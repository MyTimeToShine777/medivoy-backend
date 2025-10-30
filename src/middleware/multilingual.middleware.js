const googleTranslateService = require("../services/googleTranslate.service");
const { addTranslationJob } = require("../workers/translation.worker");
const logger = require("../utils/logger");

/**
 * Middleware to detect language and trigger translation
 * This middleware should be used on create/update routes for multilingual models
 */
const detectAndTranslate = (modelName, fields) => async (req, res, next) => {
  try {
    // Check if auto-translation is enabled
    const autoTranslate = req.body.autoTranslate !== false;
    const targetLanguage = req.body.targetLanguage || "en";

    if (!autoTranslate) {
      return next();
    }

    // Detect language from the first field
    let detectedLanguage = null;
    for (const field of fields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        detectedLanguage = await googleTranslateService.detectLanguage(
          req.body[field],
        );
        break;
      }
    }

    // Store detected language in request
    req.detectedLanguage = detectedLanguage;
    req.needsTranslation =
      detectedLanguage && detectedLanguage !== targetLanguage;
    req.translationFields = fields;
    req.targetLanguage = targetLanguage;

    next();
  } catch (error) {
    logger.error("Language detection middleware error:", error);
    // Don't fail the request, just log the error
    next();
  }
};

/**
 * Middleware to queue translation job after record creation/update
 * This should be used after the record is saved
 */
const queueTranslation = (modelName) => async (req, res, next) => {
  try {
    // Check if translation is needed
    if (!req.needsTranslation || !req.savedRecord) {
      return next();
    }

    // Add translation job to queue
    const job = await addTranslationJob(
      modelName,
      req.savedRecord.id,
      req.translationFields,
      req.targetLanguage,
    );

    // Add job info to response
    res.locals.translationJob = {
      jobId: job.jobId,
      status: "queued",
      message: "Translation job queued successfully",
    };

    next();
  } catch (error) {
    logger.error("Queue translation middleware error:", error);
    // Don't fail the request, just log the error
    next();
  }
};

/**
 * Middleware to translate request body immediately (synchronous)
 * Use this when you need immediate translation before saving
 */
const translateImmediately =
  (fields, targetLanguage = "en") =>
  async (req, res, next) => {
    try {
      // Check if immediate translation is requested
      const immediateTranslate = req.body.immediateTranslate === true;

      if (!immediateTranslate) {
        return next();
      }

      // Detect source language
      let sourceLanguage = null;
      for (const field of fields) {
        if (req.body[field] && typeof req.body[field] === "string") {
          sourceLanguage = await googleTranslateService.detectLanguage(
            req.body[field],
          );
          break;
        }
      }

      // If already in target language, skip translation
      if (sourceLanguage === targetLanguage) {
        return next();
      }

      // Translate fields
      const textsToTranslate = [];
      const fieldMap = [];

      for (const field of fields) {
        if (req.body[field] && typeof req.body[field] === "string") {
          textsToTranslate.push(req.body[field]);
          fieldMap.push(field);
        }
      }

      if (textsToTranslate.length === 0) {
        return next();
      }

      // Perform batch translation
      const translations = await googleTranslateService.translateBatch(
        textsToTranslate,
        targetLanguage,
        sourceLanguage,
      );

      // Update request body with translations
      translations.forEach((translation, index) => {
        const field = fieldMap[index];
        req.body[`${field}_original`] = translation.originalText;
        req.body[field] = translation.translatedText;
        req.body[`${field}_language`] = translation.sourceLanguage;
      });

      // Add translation metadata
      req.body.translatedFrom = sourceLanguage;
      req.body.translatedTo = targetLanguage;
      req.body.translatedAt = new Date();

      next();
    } catch (error) {
      logger.error("Immediate translation middleware error:", error);
      // Don't fail the request, just log the error
      next();
    }
  };

/**
 * Middleware to add language preference to user context
 */
const setLanguagePreference = (req, res, next) => {
  try {
    // Get language from query, header, or user profile
    const language =
      req.query.lang ||
      req.headers["accept-language"]?.split(",")[0]?.split("-")[0] ||
      req.user?.preferredLanguage ||
      "en";

    req.preferredLanguage = language;
    next();
  } catch (error) {
    logger.error("Set language preference middleware error:", error);
    req.preferredLanguage = "en";
    next();
  }
};

/**
 * Middleware to translate response data based on user's language preference
 */
const translateResponse = (fields) => async (req, res, next) => {
  try {
    const originalJson = res.json.bind(res);

    res.json = async function (data) {
      // Check if translation is needed
      const targetLanguage = req.preferredLanguage || "en";

      if (!data || targetLanguage === "en") {
        return originalJson(data);
      }

      // Translate data if it's an object or array
      if (typeof data === "object") {
        if (Array.isArray(data)) {
          // Translate array of objects
          const translatedData = await Promise.all(
            data.map((item) => translateObject(item, fields, targetLanguage)),
          );
          return originalJson(translatedData);
        }
        if (data.data) {
          // Translate data property
          if (Array.isArray(data.data)) {
            data.data = await Promise.all(
              data.data.map((item) =>
                translateObject(item, fields, targetLanguage),
              ),
            );
          } else {
            data.data = await translateObject(
              data.data,
              fields,
              targetLanguage,
            );
          }
          return originalJson(data);
        }
        // Translate single object
        const translatedData = await translateObject(
          data,
          fields,
          targetLanguage,
        );
        return originalJson(translatedData);
      }

      return originalJson(data);
    };

    next();
  } catch (error) {
    logger.error("Translate response middleware error:", error);
    next();
  }
};

/**
 * Helper function to translate object fields
 */
async function translateObject(obj, fields, targetLanguage) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const result = { ...obj };
  const textsToTranslate = [];
  const fieldMap = [];

  // Collect texts to translate
  for (const field of fields) {
    if (obj[field] && typeof obj[field] === "string") {
      textsToTranslate.push(obj[field]);
      fieldMap.push(field);
    }
  }

  if (textsToTranslate.length === 0) {
    return result;
  }

  try {
    // Translate batch
    const translations = await googleTranslateService.translateBatch(
      textsToTranslate,
      targetLanguage,
    );

    // Map translations back to fields
    translations.forEach((translation, index) => {
      const field = fieldMap[index];
      if (translation.isTranslated) {
        result[field] = translation.translatedText;
      }
    });
  } catch (error) {
    logger.error("Object translation error:", error);
  }

  return result;
}

module.exports = {
  detectAndTranslate,
  queueTranslation,
  translateImmediately,
  setLanguagePreference,
  translateResponse,
};

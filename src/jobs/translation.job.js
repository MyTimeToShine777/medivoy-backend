const { translationQueue } = require('./queue');
const translationService = require('../services/translation.service');
const logger = require('../utils/logger');

// Process translation jobs
translationQueue.process(async (job) => {
  const { type, data } = job.data;

  try {
    logger.info('Processing translation job', { type, jobId: job.id });

    switch (type) {
      case 'auto_translate':
        await autoTranslateContent(data);
        break;

      case 'bulk_translate':
        await bulkTranslateContent(data);
        break;

      case 'update_translations':
        await updateTranslations(data);
        break;

      default:
        throw new Error(`Unknown translation type: ${type}`);
    }

    logger.info('Translation job completed successfully', { type, jobId: job.id });
    return { success: true, type };
  } catch (error) {
    logger.error('Translation job failed', { type, jobId: job.id, error: error.message });
    throw error;
  }
});

// Auto-translate content to all supported languages
const autoTranslateContent = async (data) => {
  const { entityType, entityId, content, sourceLanguage } = data;
  
  const targetLanguages = ['ar', 'hi', 'es', 'fr', 'de', 'zh', 'ja', 'ru', 'pt'];
  
  for (const targetLang of targetLanguages) {
    if (targetLang !== sourceLanguage) {
      try {
        await translationService.create({
          entity_type: entityType,
          entity_id: entityId,
          language: targetLang,
          content: await translateText(content, sourceLanguage, targetLang)
        });
      } catch (error) {
        logger.error('Failed to translate to language', { targetLang, error: error.message });
      }
    }
  }
};

// Bulk translate multiple content items
const bulkTranslateContent = async (data) => {
  const { items, sourceLanguage, targetLanguages } = data;
  
  for (const item of items) {
    for (const targetLang of targetLanguages) {
      if (targetLang !== sourceLanguage) {
        try {
          await translationService.create({
            entity_type: item.entityType,
            entity_id: item.entityId,
            language: targetLang,
            content: await translateText(item.content, sourceLanguage, targetLang)
          });
        } catch (error) {
          logger.error('Failed to bulk translate', { 
            entityId: item.entityId, 
            targetLang, 
            error: error.message 
          });
        }
      }
    }
  }
};

// Update existing translations
const updateTranslations = async (data) => {
  const { entityType, entityId, content, sourceLanguage } = data;
  
  const existingTranslations = await translationService.getByEntity(entityType, entityId);
  
  for (const translation of existingTranslations) {
    if (translation.language !== sourceLanguage) {
      try {
        await translationService.update(translation.id, {
          content: await translateText(content, sourceLanguage, translation.language)
        });
      } catch (error) {
        logger.error('Failed to update translation', { 
          translationId: translation.id, 
          error: error.message 
        });
      }
    }
  }
};

// Mock translation function (replace with actual translation API)
const translateText = async (text, sourceLang, targetLang) => {
  // TODO: Implement actual translation API (Google Translate, DeepL, etc.)
  logger.info('Translating text', { sourceLang, targetLang });
  
  // Simulated translation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[${targetLang.toUpperCase()}] ${text}`);
    }, 100);
  });
};

// Add translation job to queue
const addTranslationJob = async (type, data, options = {}) => {
  try {
    const job = await translationQueue.add(
      { type, data },
      {
        priority: options.priority || 3,
        delay: options.delay || 0,
        ...options
      }
    );

    logger.info('Translation job added to queue', { type, jobId: job.id });
    return job;
  } catch (error) {
    logger.error('Failed to add translation job to queue', { type, error: error.message });
    throw error;
  }
};

module.exports = {
  addTranslationJob
};
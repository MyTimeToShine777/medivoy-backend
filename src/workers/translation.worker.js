/**
 * Translation Worker
 * Processes translation jobs from the queue
 * Part of the Bull queue system
 * Status: PRODUCTION-READY
 */

const { queues } = require('../jobs/queue');
const translationService = require('../services/translation.service');
const googleTranslateService = require('../services/googleTranslate.service');
const logger = require('../utils/logger');

const { translation: translationQueue } = queues;

/**
 * Process translation jobs with retry logic and error handling
 */
translationQueue.process(4, async (job) => {
  const { type, data } = job.data;
  const startTime = Date.now();

  try {
    logger.info('🔄 Processing translation job', {
      jobId: job.id,
      type,
      dataSize: JSON.stringify(data).length,
    });

    let result;
    switch (type) {
      case 'auto_translate':
        result = await autoTranslateContent(data, job);
        break;

      case 'bulk_translate':
        result = await bulkTranslateContent(data, job);
        break;

      case 'update_translations':
        result = await updateTranslations(data, job);
        break;

      default:
        throw new Error(`Unknown translation type: ${type}`);
    }

    const duration = Date.now() - startTime;
    logger.info('✅ Translation job completed successfully', {
      jobId: job.id,
      type,
      duration,
      result,
    });

    return { success: true, type, result, duration };
  } catch (error) {
    logger.error('❌ Translation job failed', {
      jobId: job.id,
      type,
      error: error.message,
      stack: error.stack,
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
    });

    throw error;
  }
});

/**
 * Auto-translate content to all supported languages
 * Supports multiple translation strategies
 */
async function autoTranslateContent(data, job) {
  const { entityType, entityId, content, sourceLanguage = 'en' } = data;

  if (!entityType || !entityId || !content) {
    throw new Error('Missing required fields: entityType, entityId, content');
  }

  const targetLanguages = [
    'ar',
    'hi',
    'es',
    'fr',
    'de',
    'zh',
    'ja',
    'ru',
    'pt',
    'ko',
  ];

  const translatedCount = { success: 0, failed: 0 };
  const errors = [];

  for (let index = 0; index < targetLanguages.length; index += 1) {
    const targetLang = targetLanguages[index];

    if (targetLang !== sourceLanguage) {
      try {
        // Update job progress
        const progress = Math.round(
          ((index + 1) / targetLanguages.length) * 100
        );
        job.progress(progress);

        const translatedContent = await googleTranslateService.translate(
          content,
          sourceLanguage,
          targetLang
        );

        await translationService.create({
          entity_type: entityType,
          entity_id: entityId,
          language: targetLang,
          content: translatedContent,
          source_language: sourceLanguage,
          translation_type: 'auto',
        });

        translatedCount.success += 1;

        logger.debug('✅ Translation created', {
          entityId,
          targetLang,
        });
      } catch (error) {
        translatedCount.failed += 1;
        errors.push({
          language: targetLang,
          error: error.message,
        });

        logger.error('Failed to translate to language', {
          targetLang,
          entityId,
          error: error.message,
        });
      }
    }
  }

  job.progress(100);

  return {
    entityType,
    entityId,
    translatedCount,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Bulk translate multiple content items
 * Optimized for batch processing
 */
async function bulkTranslateContent(data, job) {
  const { items, sourceLanguage = 'en', targetLanguages } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Items must be a non-empty array');
  }

  if (
    !targetLanguages ||
    !Array.isArray(targetLanguages) ||
    targetLanguages.length === 0
  ) {
    throw new Error('targetLanguages must be a non-empty array');
  }

  const stats = {
    totalItems: items.length,
    successCount: 0,
    failCount: 0,
    itemErrors: [],
  };

  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    const item = items[itemIndex];

    try {
      // Validate item
      if (!item.entityType || !item.entityId || !item.content) {
        throw new Error('Missing required item fields');
      }

      for (const targetLang of targetLanguages) {
        if (targetLang !== sourceLanguage) {
          try {
            const translatedContent = await googleTranslateService.translate(
              item.content,
              sourceLanguage,
              targetLang
            );

            await translationService.create({
              entity_type: item.entityType,
              entity_id: item.entityId,
              language: targetLang,
              content: translatedContent,
              source_language: sourceLanguage,
              translation_type: 'bulk',
            });

            stats.successCount += 1;
          } catch (error) {
            stats.failCount += 1;
            stats.itemErrors.push({
              itemIndex,
              entityId: item.entityId,
              targetLang,
              error: error.message,
            });

            logger.error('Failed bulk translation', {
              itemIndex,
              entityId: item.entityId,
              targetLang,
              error: error.message,
            });
          }
        }
      }

      // Update progress
      const progress = Math.round(((itemIndex + 1) / items.length) * 100);
      job.progress(progress);
    } catch (error) {
      stats.failCount += 1;
      stats.itemErrors.push({
        itemIndex,
        error: error.message,
      });

      logger.error('Error processing bulk item', {
        itemIndex,
        error: error.message,
      });
    }
  }

  return stats;
}

/**
 * Update existing translations
 * Refreshes translations for existing content
 */
async function updateTranslations(data, job) {
  const { entityType, entityId, content, sourceLanguage = 'en' } = data;

  if (!entityType || !entityId || !content) {
    throw new Error('Missing required fields: entityType, entityId, content');
  }

  try {
    const existingTranslations = await translationService.getByEntity(
      entityType,
      entityId
    );

    if (!existingTranslations || existingTranslations.length === 0) {
      logger.warn('No existing translations found', {
        entityType,
        entityId,
      });
      return { updated: 0, failed: 0 };
    }

    const updateStats = { updated: 0, failed: 0 };
    const errors = [];

    for (let index = 0; index < existingTranslations.length; index += 1) {
      const translation = existingTranslations[index];

      if (translation.language !== sourceLanguage) {
        try {
          const translatedContent = await googleTranslateService.translate(
            content,
            sourceLanguage,
            translation.language
          );

          await translationService.update(translation.id, {
            content: translatedContent,
            updated_at: new Date(),
          });

          updateStats.updated += 1;

          logger.debug('✅ Translation updated', {
            translationId: translation.id,
            language: translation.language,
          });
        } catch (error) {
          updateStats.failed += 1;
          errors.push({
            translationId: translation.id,
            language: translation.language,
            error: error.message,
          });

          logger.error('Failed to update translation', {
            translationId: translation.id,
            error: error.message,
          });
        }
      }

      // Update progress
      const progress = Math.round(
        ((index + 1) / existingTranslations.length) * 100
      );
      job.progress(progress);
    }

    return {
      entityType,
      entityId,
      updateStats,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    logger.error('Update translations failed', {
      entityType,
      entityId,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Add translation job to queue
 * Called from your API endpoints
 */
async function addTranslationJob(type, data, options = {}) {
  try {
    const job = await translationQueue.add(
      { type, data },
      {
        priority: options.priority || 3,
        delay: options.delay || 0,
        jobId: options.jobId,
        removeOnComplete: options.removeOnComplete || { age: 3600 },
        removeOnFail: false,
        ...options,
      }
    );

    logger.info('✅ Translation job added to queue', {
      jobId: job.id,
      type,
    });

    return job;
  } catch (error) {
    logger.error('Failed to add translation job to queue', {
      type,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Get job status
 */
async function getJobStatus(jobId) {
  try {
    const job = await translationQueue.getJob(jobId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress();

    return {
      id: job.id,
      state,
      progress,
      data: job.data,
      result: job.returnvalue,
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      stacktrace: job.stacktrace,
    };
  } catch (error) {
    logger.error('Failed to get job status', {
      jobId,
      error: error.message,
    });
    throw error;
  }
}

module.exports = {
  addTranslationJob,
  getJobStatus,
  translationQueue,
};

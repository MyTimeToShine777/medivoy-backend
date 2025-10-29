const Queue = require('bull');
const googleTranslateService = require('../services/googleTranslate.service');
const logger = require('../utils/logger');

// Import models that need translation
const { Hospital, Treatment, Doctor, Package, FAQ } = require('../models');

// Create translation queue
const translationQueue = new Queue('translation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

/**
 * Process translation jobs
 */
translationQueue.process(async (job) => {
  const { modelName, recordId, fields, targetLanguage } = job.data;

  try {
    logger.info(`Processing translation job for ${modelName} ID: ${recordId}`);

    // Get the model
    let Model;
    switch (modelName) {
      case 'Hospital':
        Model = Hospital;
        break;
      case 'Treatment':
        Model = Treatment;
        break;
      case 'Doctor':
        Model = Doctor;
        break;
      case 'Package':
        Model = Package;
        break;
      case 'FAQ':
        Model = FAQ;
        break;
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }

    // Find the record
    const record = await Model.findByPk(recordId);
    if (!record) {
      throw new Error(`${modelName} with ID ${recordId} not found`);
    }

    // Prepare translation data
    const translationData = {};
    const textsToTranslate = [];
    const fieldMap = [];

    // Collect texts to translate
    for (const field of fields) {
      if (record[field] && typeof record[field] === 'string') {
        textsToTranslate.push(record[field]);
        fieldMap.push(field);
      }
    }

    if (textsToTranslate.length === 0) {
      logger.info(`No texts to translate for ${modelName} ID: ${recordId}`);
      return { success: true, message: 'No texts to translate' };
    }

    // Detect source language from first field
    const sourceLanguage = await googleTranslateService.detectLanguage(textsToTranslate[0]);

    // If already in target language, skip translation
    if (sourceLanguage === targetLanguage) {
      logger.info(`${modelName} ID: ${recordId} is already in ${targetLanguage}`);
      return { success: true, message: 'Already in target language' };
    }

    // Translate batch
    const translations = await googleTranslateService.translateBatch(
      textsToTranslate,
      targetLanguage,
      sourceLanguage
    );

    // Map translations back to fields
    translations.forEach((translation, index) => {
      const field = fieldMap[index];
      translationData[field] = translation.translatedText;
      translationData[`${field}_original`] = translation.originalText;
      translationData[`${field}_language`] = translation.sourceLanguage;
    });

    // Add metadata
    translationData.translatedAt = new Date();
    translationData.translatedFrom = sourceLanguage;
    translationData.translatedTo = targetLanguage;

    // Update record
    await record.update(translationData);

    logger.info(`Translation completed for ${modelName} ID: ${recordId}`);

    return {
      success: true,
      modelName,
      recordId,
      sourceLanguage,
      targetLanguage,
      fieldsTranslated: fieldMap.length,
    };
  } catch (error) {
    logger.error(`Translation job failed for ${modelName} ID: ${recordId}:`, error);
    throw error;
  }
});

/**
 * Add translation job to queue
 * @param {string} modelName - Model name
 * @param {number} recordId - Record ID
 * @param {Array<string>} fields - Fields to translate
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} - Job details
 */
async function addTranslationJob(modelName, recordId, fields, targetLanguage = 'en') {
  try {
    const job = await translationQueue.add({
      modelName,
      recordId,
      fields,
      targetLanguage,
    });

    logger.info(`Translation job added: ${job.id} for ${modelName} ID: ${recordId}`);

    return {
      jobId: job.id,
      modelName,
      recordId,
      fields,
      targetLanguage,
    };
  } catch (error) {
    logger.error('Add translation job error:', error);
    throw error;
  }
}

/**
 * Get job status
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} - Job status
 */
async function getJobStatus(jobId) {
  try {
    const job = await translationQueue.getJob(jobId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress();
    const failedReason = job.failedReason;

    return {
      jobId: job.id,
      state,
      progress,
      failedReason,
      data: job.data,
      returnvalue: job.returnvalue,
    };
  } catch (error) {
    logger.error('Get job status error:', error);
    throw error;
  }
}

/**
 * Remove job from queue
 * @param {string} jobId - Job ID
 * @returns {Promise<boolean>} - Removal result
 */
async function removeJob(jobId) {
  try {
    const job = await translationQueue.getJob(jobId);
    if (!job) {
      return false;
    }

    await job.remove();
    logger.info(`Job removed: ${jobId}`);
    return true;
  } catch (error) {
    logger.error('Remove job error:', error);
    throw error;
  }
}

/**
 * Get queue statistics
 * @returns {Promise<Object>} - Queue statistics
 */
async function getQueueStats() {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      translationQueue.getWaitingCount(),
      translationQueue.getActiveCount(),
      translationQueue.getCompletedCount(),
      translationQueue.getFailedCount(),
      translationQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  } catch (error) {
    logger.error('Get queue stats error:', error);
    throw error;
  }
}

/**
 * Clean completed jobs
 * @param {number} grace - Grace period in milliseconds
 * @returns {Promise<Array>} - Cleaned job IDs
 */
async function cleanCompletedJobs(grace = 0) {
  try {
    const jobs = await translationQueue.clean(grace, 'completed');
    logger.info(`Cleaned ${jobs.length} completed jobs`);
    return jobs;
  } catch (error) {
    logger.error('Clean completed jobs error:', error);
    throw error;
  }
}

/**
 * Clean failed jobs
 * @param {number} grace - Grace period in milliseconds
 * @returns {Promise<Array>} - Cleaned job IDs
 */
async function cleanFailedJobs(grace = 0) {
  try {
    const jobs = await translationQueue.clean(grace, 'failed');
    logger.info(`Cleaned ${jobs.length} failed jobs`);
    return jobs;
  } catch (error) {
    logger.error('Clean failed jobs error:', error);
    throw error;
  }
}

// Event listeners
translationQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed:`, result);
});

translationQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed:`, err);
});

translationQueue.on('stalled', (job) => {
  logger.warn(`Job ${job.id} stalled`);
});

module.exports = {
  translationQueue,
  addTranslationJob,
  getJobStatus,
  removeJob,
  getQueueStats,
  cleanCompletedJobs,
  cleanFailedJobs,
};
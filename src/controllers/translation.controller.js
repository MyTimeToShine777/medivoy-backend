const googleTranslateService = require('../services/googleTranslate.service');
const {
  addTranslationJob,
  getJobStatus,
  removeJob,
  getQueueStats,
  cleanCompletedJobs,
  cleanFailedJobs,
} = require('../workers/translation.worker');
const logger = require('../utils/logger');

/**
 * Translate text
 */
exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required',
      });
    }

    const result = await googleTranslateService.translateText(
      text,
      targetLanguage || 'en',
      sourceLanguage
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Translate text controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to translate text',
      error: error.message,
    });
  }
};

/**
 * Translate batch
 */
exports.translateBatch = async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage } = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Texts array is required',
      });
    }

    const results = await googleTranslateService.translateBatch(
      texts,
      targetLanguage || 'en',
      sourceLanguage
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    logger.error('Translate batch controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to translate batch',
      error: error.message,
    });
  }
};

/**
 * Detect language
 */
exports.detectLanguage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required',
      });
    }

    const language = await googleTranslateService.detectLanguage(text);

    res.status(200).json({
      success: true,
      data: { language },
    });
  } catch (error) {
    logger.error('Detect language controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect language',
      error: error.message,
    });
  }
};

/**
 * Get supported languages
 */
exports.getSupportedLanguages = async (req, res) => {
  try {
    const languages = await googleTranslateService.getSupportedLanguages();

    res.status(200).json({
      success: true,
      data: languages,
    });
  } catch (error) {
    logger.error('Get supported languages controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported languages',
      error: error.message,
    });
  }
};

/**
 * Queue translation job
 */
exports.queueTranslation = async (req, res) => {
  try {
    const { modelName, recordId, fields, targetLanguage } = req.body;

    if (!modelName || !recordId || !fields) {
      return res.status(400).json({
        success: false,
        message: 'Model name, record ID, and fields are required',
      });
    }

    const job = await addTranslationJob(
      modelName,
      recordId,
      fields,
      targetLanguage || 'en'
    );

    res.status(201).json({
      success: true,
      message: 'Translation job queued successfully',
      data: job,
    });
  } catch (error) {
    logger.error('Queue translation controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue translation',
      error: error.message,
    });
  }
};

/**
 * Get job status
 */
exports.getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required',
      });
    }

    const status = await getJobStatus(jobId);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error('Get job status controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job status',
      error: error.message,
    });
  }
};

/**
 * Cancel job
 */
exports.cancelJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required',
      });
    }

    const removed = await removeJob(jobId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job cancelled successfully',
    });
  } catch (error) {
    logger.error('Cancel job controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel job',
      error: error.message,
    });
  }
};

/**
 * Get queue statistics
 */
exports.getQueueStats = async (req, res) => {
  try {
    const stats = await getQueueStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Get queue stats controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get queue statistics',
      error: error.message,
    });
  }
};

/**
 * Clean completed jobs
 */
exports.cleanCompletedJobs = async (req, res) => {
  try {
    const grace = parseInt(req.query.grace, 10) || 0;
    const jobs = await cleanCompletedJobs(grace);

    res.status(200).json({
      success: true,
      message: `${jobs.length} completed jobs cleaned`,
      data: { count: jobs.length },
    });
  } catch (error) {
    logger.error('Clean completed jobs controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean completed jobs',
      error: error.message,
    });
  }
};

/**
 * Clean failed jobs
 */
exports.cleanFailedJobs = async (req, res) => {
  try {
    const grace = parseInt(req.query.grace, 10) || 0;
    const jobs = await cleanFailedJobs(grace);

    res.status(200).json({
      success: true,
      message: `${jobs.length} failed jobs cleaned`,
      data: { count: jobs.length },
    });
  } catch (error) {
    logger.error('Clean failed jobs controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean failed jobs',
      error: error.message,
    });
  }
};

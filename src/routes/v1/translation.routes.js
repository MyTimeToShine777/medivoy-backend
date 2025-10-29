const express = require('express');
const router = express.Router();
const translationController = require('../../controllers/translation.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

/**
 * @route   POST /api/v1/translation/translate
 * @desc    Translate text
 * @access  Private
 */
router.post('/translate', auth, translationController.translateText);

/**
 * @route   POST /api/v1/translation/translate-batch
 * @desc    Translate batch of texts
 * @access  Private
 */
router.post('/translate-batch', auth, translationController.translateBatch);

/**
 * @route   POST /api/v1/translation/detect
 * @desc    Detect language
 * @access  Private
 */
router.post('/detect', auth, translationController.detectLanguage);

/**
 * @route   GET /api/v1/translation/languages
 * @desc    Get supported languages
 * @access  Public
 */
router.get('/languages', translationController.getSupportedLanguages);

/**
 * @route   POST /api/v1/translation/queue
 * @desc    Queue translation job
 * @access  Private
 */
router.post('/queue', auth, translationController.queueTranslation);

/**
 * @route   GET /api/v1/translation/job/:jobId
 * @desc    Get job status
 * @access  Private
 */
router.get('/job/:jobId', auth, translationController.getJobStatus);

/**
 * @route   DELETE /api/v1/translation/job/:jobId
 * @desc    Cancel job
 * @access  Private
 */
router.delete('/job/:jobId', auth, translationController.cancelJob);

/**
 * @route   GET /api/v1/translation/queue/stats
 * @desc    Get queue statistics
 * @access  Private (Admin only)
 */
router.get('/queue/stats', auth, authorize(['admin']), translationController.getQueueStats);

/**
 * @route   POST /api/v1/translation/queue/clean-completed
 * @desc    Clean completed jobs
 * @access  Private (Admin only)
 */
router.post('/queue/clean-completed', auth, authorize(['admin']), translationController.cleanCompletedJobs);

/**
 * @route   POST /api/v1/translation/queue/clean-failed
 * @desc    Clean failed jobs
 * @access  Private (Admin only)
 */
router.post('/queue/clean-failed', auth, authorize(['admin']), translationController.cleanFailedJobs);

module.exports = router;
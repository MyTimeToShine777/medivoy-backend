const express = require('express');
const router = express.Router();
const multer = require('multer');
const mediaController = require('../../controllers/media.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * @route   POST /api/v1/media/upload
 * @desc    Upload single file
 * @access  Private
 */
router.post('/upload', authenticate, upload.single('file'), mediaController.uploadFile);

/**
 * @route   POST /api/v1/media/upload-multiple
 * @desc    Upload multiple files
 * @access  Private
 */
router.post('/upload-multiple', authenticate, upload.array('files', 10), mediaController.uploadMultipleFiles);

/**
 * @route   DELETE /api/v1/media/:fileId
 * @desc    Delete file
 * @access  Private
 */
router.delete('/:fileId', authenticate, mediaController.deleteFile);

/**
 * @route   POST /api/v1/media/delete-multiple
 * @desc    Delete multiple files
 * @access  Private
 */
router.post('/delete-multiple', authenticate, mediaController.deleteMultipleFiles);

/**
 * @route   GET /api/v1/media/:fileId
 * @desc    Get file details
 * @access  Private
 */
router.get('/:fileId', authenticate, mediaController.getFileDetails);

/**
 * @route   GET /api/v1/media
 * @desc    List files
 * @access  Private
 */
router.get('/', authenticate, mediaController.listFiles);

/**
 * @route   PUT /api/v1/media/:fileId
 * @desc    Update file details
 * @access  Private
 */
router.put('/:fileId', authenticate, mediaController.updateFileDetails);

/**
 * @route   POST /api/v1/media/transform
 * @desc    Get transformed URL
 * @access  Private
 */
router.post('/transform', authenticate, mediaController.getTransformedUrl);

/**
 * @route   POST /api/v1/media/thumbnail
 * @desc    Get thumbnail URL
 * @access  Private
 */
router.post('/thumbnail', authenticate, mediaController.getThumbnailUrl);

/**
 * @route   POST /api/v1/media/optimize
 * @desc    Get optimized URL
 * @access  Private
 */
router.post('/optimize', authenticate, mediaController.getOptimizedUrl);

/**
 * @route   POST /api/v1/media/purge-cache
 * @desc    Purge cache
 * @access  Private (Admin only)
 */
router.post('/purge-cache', authenticate, authorize(['admin']), mediaController.purgeCache);

/**
 * @route   GET /api/v1/media/auth/params
 * @desc    Get authentication parameters for client-side upload
 * @access  Private
 */
router.get('/auth/params', authenticate, mediaController.getAuthParams);

/**
 * @route   POST /api/v1/media/folder
 * @desc    Create folder
 * @access  Private
 */
router.post('/folder', authenticate, mediaController.createFolder);

/**
 * @route   DELETE /api/v1/media/folder
 * @desc    Delete folder
 * @access  Private (Admin only)
 */
router.delete('/folder', authenticate, authorize(['admin']), mediaController.deleteFolder);

module.exports = router;
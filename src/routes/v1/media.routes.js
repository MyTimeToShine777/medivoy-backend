const express = require('express');

const router = express.Router();
const multer = require('multer');
const mediaController = require('../../controllers/media.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

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
router.post('/upload', auth, upload.single('file'), mediaController.uploadFile);

/**
 * @route   POST /api/v1/media/upload-multiple
 * @desc    Upload multiple files
 * @access  Private
 */
router.post('/upload-multiple', auth, upload.array('files', 10), mediaController.uploadMultipleFiles);

/**
 * @route   DELETE /api/v1/media/:fileId
 * @desc    Delete file
 * @access  Private
 */
router.delete('/:fileId', auth, mediaController.deleteFile);

/**
 * @route   POST /api/v1/media/delete-multiple
 * @desc    Delete multiple files
 * @access  Private
 */
router.post('/delete-multiple', auth, mediaController.deleteMultipleFiles);

/**
 * @route   GET /api/v1/media/:fileId
 * @desc    Get file details
 * @access  Private
 */
router.get('/:fileId', auth, mediaController.getFileDetails);

/**
 * @route   GET /api/v1/media
 * @desc    List files
 * @access  Private
 */

/**
 * @swagger
 * /media:
 *   get:
 *     summary: Get all Media
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - $ref: '#/components/parameters/sortParam'
 *     responses:
 *       200:
 *         description: Media retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Media'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get('/', auth, mediaController.listFiles);

/**
 * @route   PUT /api/v1/media/:fileId
 * @desc    Update file details
 * @access  Private
 */
router.put('/:fileId', auth, mediaController.updateFileDetails);

/**
 * @route   POST /api/v1/media/transform
 * @desc    Get transformed URL
 * @access  Private
 */
router.post('/transform', auth, mediaController.getTransformedUrl);

/**
 * @route   POST /api/v1/media/thumbnail
 * @desc    Get thumbnail URL
 * @access  Private
 */
router.post('/thumbnail', auth, mediaController.getThumbnailUrl);

/**
 * @route   POST /api/v1/media/optimize
 * @desc    Get optimized URL
 * @access  Private
 */
router.post('/optimize', auth, mediaController.getOptimizedUrl);

/**
 * @route   POST /api/v1/media/purge-cache
 * @desc    Purge cache
 * @access  Private (Admin only)
 */
router.post('/purge-cache', auth, authorize(['admin']), mediaController.purgeCache);

/**
 * @route   GET /api/v1/media/auth/params
 * @desc    Get authentication parameters for client-side upload
 * @access  Private
 */
router.get('/auth/params', auth, mediaController.getAuthParams);

/**
 * @route   POST /api/v1/media/folder
 * @desc    Create folder
 * @access  Private
 */
router.post('/folder', auth, mediaController.createFolder);

/**
 * @route   DELETE /api/v1/media/folder
 * @desc    Delete folder
 * @access  Private (Admin only)
 */
router.delete('/folder', auth, authorize(['admin']), mediaController.deleteFolder);

router.get('/:id', authenticate, mediaController.getMediaById);
module.exports = router;

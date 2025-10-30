/**
 * Video Call Routes
 */

const express = require('express');

const router = express.Router();
const videoCallController = require('../../controllers/videoCall.controller');
const authenticate = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/video-calls:
 *   post:
 *     summary: Initiate a video call
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', videoCallController.initiateCall);

/**
 * @swagger
 * /api/v1/video-calls/{id}/join:
 *   post:
 *     summary: Join a video call
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/join', videoCallController.joinCall);

/**
 * @swagger
 * /api/v1/video-calls/{id}/start:
 *   put:
 *     summary: Start a video call
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/start', videoCallController.startCall);

/**
 * @swagger
 * /api/v1/video-calls/{id}/end:
 *   put:
 *     summary: End a video call
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/end', videoCallController.endCall);

/**
 * @swagger
 * /api/v1/video-calls/{id}/cancel:
 *   put:
 *     summary: Cancel a scheduled video call
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/cancel', videoCallController.cancelCall);

/**
 * @swagger
 * /api/v1/video-calls/{id}/recording:
 *   put:
 *     summary: Update call recording status
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/recording', videoCallController.updateRecordingStatus);

/**
 * @swagger
 * /api/v1/video-calls/user/{userId}/history:
 *   get:
 *     summary: Get call history for a user
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user/:userId/history', videoCallController.getCallHistory);

/**
 * @swagger
 * /api/v1/video-calls/user/{userId}/upcoming:
 *   get:
 *     summary: Get upcoming scheduled calls
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user/:userId/upcoming', videoCallController.getUpcomingCalls);

/**
 * @swagger
 * /api/v1/video-calls/{id}:
 *   get:
 *     summary: Get call details by ID
 *     tags: [Video Calls]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', videoCallController.getCallById);

module.exports = router;

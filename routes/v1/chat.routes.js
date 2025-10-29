/**
 * Chat Routes
 */

const express = require('express');

const router = express.Router();
const chatController = require('../../controllers/chat.controller');
const authenticate = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/chat/conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.post('/conversations', chatController.createConversation);

/**
 * @swagger
 * /api/v1/chat/conversations/user/{userId}:
 *   get:
 *     summary: Get all conversations for a user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.get('/conversations/user/:userId', chatController.getUserConversations);

/**
 * @swagger
 * /api/v1/chat/conversations/{id}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.get('/conversations/:id', chatController.getConversationById);

/**
 * @swagger
 * /api/v1/chat/conversations/{id}/archive:
 *   put:
 *     summary: Archive/Unarchive conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.put('/conversations/:id/archive', chatController.toggleArchiveConversation);

/**
 * @swagger
 * /api/v1/chat/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.post('/messages', chatController.sendMessage);

/**
 * @swagger
 * /api/v1/chat/messages/conversation/{conversationId}:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.get('/messages/conversation/:conversationId', chatController.getConversationMessages);

/**
 * @swagger
 * /api/v1/chat/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/messages/:id', chatController.deleteMessage);

/**
 * @swagger
 * /api/v1/chat/messages/conversation/{conversationId}/read:
 *   put:
 *     summary: Mark messages as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.put('/messages/conversation/:conversationId/read', chatController.markMessagesAsRead);

/**
 * @swagger
 * /api/v1/chat/unread/{userId}:
 *   get:
 *     summary: Get unread message count for user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 */
router.get('/unread/:userId', chatController.getUnreadCount);

module.exports = router;

const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create notification (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  notificationController.createNotification,
);

// Get notification by ID (users can only access their own notifications)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.getNotification,
);

// Update notification (users can only update their own notifications)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.updateNotification,
);

// Delete notification (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  notificationController.deleteNotification,
);

// Get all notifications for a user
router.get(
  '/user/:userId',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.getUserNotifications,
);

// Mark notification as read
router.patch(
  '/:id/read',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.markAsRead,
);

module.exports = router;
const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create notification (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  notificationController.createNotification,
);

// Get notification by ID (users can only access their own notifications)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.getNotification,
);

// Update notification (users can only update their own notifications)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.updateNotification,
);

// Delete notification (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  notificationController.deleteNotification,
);

// Get all notifications for a user
router.get(
  '/user/:userId',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.getUserNotifications,
);

// Mark notification as read
router.patch(
  '/:id/read',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.markAsRead,
);

module.exports = router;
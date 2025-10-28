const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, notificationController.getUserNotifications);
router.post('/', authenticate, authorize(['admin']), notificationController.createNotification);
router.get('/:id', authenticate, notificationController.getNotification);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;

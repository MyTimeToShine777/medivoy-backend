const notificationService = require('../services/notification.service');
const { successResponse } = require('../utils/response');

class NotificationController {
  async createNotification(req, res, next) {
    try {
      const notification = await notificationService.createNotification(req.body);
      return successResponse(res, notification, 'Notification created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getNotification(req, res, next) {
    try {
      const notification = await notificationService.getNotificationById(req.params.id);
      return successResponse(res, notification, 'Notification retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getUserNotifications(req.user.id, req.query);
      return successResponse(res, notifications, 'User notifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id);
      return successResponse(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      return successResponse(res, result, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const result = await notificationService.deleteNotification(req.params.id);
      return successResponse(res, result, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();

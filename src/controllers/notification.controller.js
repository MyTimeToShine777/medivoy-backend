const Notification = require('../models/Notification.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class NotificationController {
  /**
   * Create a new notification
   */
  async createNotification(req, res) {
    try {
      const { userId, title, message, type, priority, isRead } = req.body;
      
      // Create notification
      const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        priority,
        isRead,
      });
      
      return successResponse(res, {
        message: 'Notification created successfully',
        data: notification,
      }, 201);
    } catch (error) {
      logger.error('Create notification error:', error);
      return errorResponse(res, {
        message: 'Failed to create notification',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get notification by ID
   */
  async getNotification(req, res) {
    try {
      const { id } = req.params;
      
      // Find notification
      const notification = await Notification.findByPk(id);
      
      if (!notification) {
        return errorResponse(res, {
          message: 'Notification not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Notification retrieved successfully',
        data: notification,
      });
    } catch (error) {
      logger.error('Get notification error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve notification',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update notification
   */
  async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const { title, message, type, priority, isRead } = req.body;
      
      // Find notification
      const notification = await Notification.findByPk(id);
      
      if (!notification) {
        return errorResponse(res, {
          message: 'Notification not found',
        }, 404);
      }
      
      // Update notification
      await notification.update({
        title,
        message,
        type,
        priority,
        isRead,
      });
      
      return successResponse(res, {
        message: 'Notification updated successfully',
        data: notification,
      });
    } catch (error) {
      logger.error('Update notification error:', error);
      return errorResponse(res, {
        message: 'Failed to update notification',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      
      // Find notification
      const notification = await Notification.findByPk(id);
      
      if (!notification) {
        return errorResponse(res, {
          message: 'Notification not found',
        }, 404);
      }
      
      // Delete notification
      await notification.destroy();
      
      return successResponse(res, {
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      logger.error('Delete notification error:', error);
      return errorResponse(res, {
        message: 'Failed to delete notification',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, isRead, type } = req.query;
      
      // Build where clause
      const where = { userId };
      if (isRead !== undefined) where.isRead = isRead === 'true';
      if (type) where.type = type;
      
      // Get notifications with pagination
      const notifications = await Notification.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return successResponse(res, {
        message: 'Notifications retrieved successfully',
        data: notifications.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(notifications.count / parseInt(limit, 10)),
          totalRecords: notifications.count,
        },
      });
    } catch (error) {
      logger.error('Get user notifications error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve notifications',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      
      // Find notification
      const notification = await Notification.findByPk(id);
      
      if (!notification) {
        return errorResponse(res, {
          message: 'Notification not found',
        }, 404);
      }
      
      // Update notification as read
      await notification.update({ isRead: true });
      
      return successResponse(res, {
        message: 'Notification marked as read successfully',
        data: notification,
      });
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      return errorResponse(res, {
        message: 'Failed to mark notification as read',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new NotificationController();
const Notification = require('../models/Notification.model');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      return notification;
    } catch (error) {
      logger.error('Create notification service error:', error);
      throw error;
    }
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(id) {
    try {
      const notification = await Notification.findByPk(id);
      return notification;
    } catch (error) {
      logger.error('Get notification by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update notification
   */
  async updateNotification(id, data) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.update(data);
      return notification;
    } catch (error) {
      logger.error('Update notification service error:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.destroy();
      return true;
    } catch (error) {
      logger.error('Delete notification service error:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId, filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      where.userId = userId;

      const notifications = await Notification.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return notifications;
    } catch (error) {
      logger.error('Get user notifications service error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.update({ isRead: true });
      return notification;
    } catch (error) {
      logger.error('Mark notification as read service error:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();

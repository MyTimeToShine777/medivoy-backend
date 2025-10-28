const { Notification } = require('../models');
const emailService = require('./email.service');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error-handler');

class NotificationService {
  async createNotification(notificationData) {
    try {
      const notification = await Notification.create(notificationData);
      
      // Send notification based on type
      if (notificationData.type === 'email') {
        await this.sendEmailNotification(notification);
      } else if (notificationData.type === 'sms') {
        await this.sendSMSNotification(notification);
      } else if (notificationData.type === 'push') {
        await this.sendPushNotification(notification);
      }
      
      logger.info(`Notification created: ${notification.id}`);
      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw new AppError('Failed to create notification', 500);
    }
  }

  async sendEmailNotification(notification) {
    try {
      await emailService.sendEmail(
        notification.recipient_email,
        notification.title,
        notification.message
      );
      await notification.update({ status: 'sent', sent_at: new Date() });
    } catch (error) {
      await notification.update({ status: 'failed', error_message: error.message });
      throw error;
    }
  }

  async sendSMSNotification(notification) {
    // TODO: Implement Twilio SMS sending
    logger.info(`SMS notification: ${notification.id}`);
    await notification.update({ status: 'sent', sent_at: new Date() });
  }

  async sendPushNotification(notification) {
    // TODO: Implement Firebase push notification
    logger.info(`Push notification: ${notification.id}`);
    await notification.update({ status: 'sent', sent_at: new Date() });
  }

  async getNotificationById(notificationId) {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  }

  async getUserNotifications(userId, filters = {}) {
    const notifications = await Notification.findAll({
      where: { user_id: userId, ...filters },
      order: [['created_at', 'DESC']]
    });
    return notifications;
  }

  async markAsRead(notificationId) {
    const notification = await this.getNotificationById(notificationId);
    await notification.update({ is_read: true, read_at: new Date() });
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.update(
      { is_read: true, read_at: new Date() },
      { where: { user_id: userId, is_read: false } }
    );
    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId) {
    const notification = await this.getNotificationById(notificationId);
    await notification.destroy();
    return { message: 'Notification deleted successfully' };
  }
}

module.exports = new NotificationService();

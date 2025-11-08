'use strict';

import { NotificationService } from '../services/NotificationService.js';

export class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();
    }

    async sendEmailNotification(req, res) {
        try {
            const userId = req.user.userId;
            const emailData = req.body;

            const result = await this.notificationService.sendEmailNotification(userId, emailData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Email sent',
                notificationId: result.notificationId
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async sendSMSNotification(req, res) {
        try {
            const userId = req.user.userId;
            const smsData = req.body;

            const result = await this.notificationService.sendSMSNotification(userId, smsData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'SMS sent',
                notificationId: result.notificationId
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async sendBulkEmail(req, res) {
        try {
            const emailList = req.body.emailList;
            const emailData = req.body.emailData;

            const result = await this.notificationService.sendBulkEmail(emailList, emailData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                results: result.results
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                type: req.query.type,
                status: req.query.status,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.notificationService.getNotifications(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.notifications,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async markNotificationRead(req, res) {
        try {
            const notificationId = req.params.notificationId;
            const userId = req.user.userId;

            const result = await this.notificationService.markNotificationRead(notificationId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Marked as read'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async markAllNotificationsRead(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.notificationService.markAllNotificationsRead(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'All marked as read'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async deleteNotification(req, res) {
        try {
            const notificationId = req.params.notificationId;
            const userId = req.user.userId;

            const result = await this.notificationService.deleteNotification(notificationId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Notification deleted'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new NotificationController();
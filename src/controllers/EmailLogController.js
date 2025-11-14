'use strict';

import emailLogService from '../services/EmailLogService.js';

export class EmailLogController {
    constructor() {
        this.emailLogService = emailLogService;
    }

    /**
     * LOG EMAIL
     */
    async logEmail(req, res) {
        try {
            const emailData = req.body;

            const result = await this.emailLogService.logEmail(emailData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE EMAIL STATUS
     */
    async updateEmailStatus(req, res) {
        try {
            const emailLogId = req.params.emailLogId;
            const { status, ...metadata } = req.body;

            const result = await this.emailLogService.updateEmailStatus(emailLogId, status, metadata);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET EMAIL LOGS
     */
    async getEmailLogs(req, res) {
        try {
            const userId = req.query.userId || req.user.userId;
            const { page, limit, status, emailType } = req.query;

            const result = await this.emailLogService.getEmailLogs(userId, { page, limit, status, emailType });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET EMAIL LOG BY ID
     */
    async getEmailLogById(req, res) {
        try {
            const emailLogId = req.params.emailLogId;

            const result = await this.emailLogService.getEmailLogById(emailLogId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * RETRY FAILED EMAIL
     */
    async retryFailedEmail(req, res) {
        try {
            const emailLogId = req.params.emailLogId;

            const result = await this.emailLogService.retryFailedEmail(emailLogId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET EMAIL STATISTICS
     */
    async getEmailStatistics(req, res) {
        try {
            const userId = req.query.userId || req.user.userId;
            const { startDate, endDate } = req.query;

            const result = await this.emailLogService.getEmailStatistics(userId, { startDate, endDate });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new EmailLogController();
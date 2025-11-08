'use strict';

import SMSLogService from '../services/SMSLogService.js';

export class SMSLogController {
    constructor() {
        this.smsLogService = new SMSLogService();
    }

    /**
     * LOG SMS
     */
    async logSMS(req, res) {
        try {
            const smsData = req.body;

            const result = await this.smsLogService.logSMS(smsData);

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
     * UPDATE SMS STATUS
     */
    async updateSMSStatus(req, res) {
        try {
            const smsLogId = req.params.smsLogId;
            const { status, ...metadata } = req.body;

            const result = await this.smsLogService.updateSMSStatus(smsLogId, status, metadata);

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
     * GET SMS LOGS
     */
    async getSMSLogs(req, res) {
        try {
            const userId = req.query.userId || req.user.userId;
            const { page, limit, status, smsType } = req.query;

            const result = await this.smsLogService.getSMSLogs(userId, { page, limit, status, smsType });

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
     * GET SMS LOG BY ID
     */
    async getSMSLogById(req, res) {
        try {
            const smsLogId = req.params.smsLogId;

            const result = await this.smsLogService.getSMSLogById(smsLogId);

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
     * RETRY FAILED SMS
     */
    async retryFailedSMS(req, res) {
        try {
            const smsLogId = req.params.smsLogId;

            const result = await this.smsLogService.retryFailedSMS(smsLogId);

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
     * GET SMS STATISTICS
     */
    async getSMSStatistics(req, res) {
        try {
            const userId = req.query.userId || req.user.userId;
            const { startDate, endDate } = req.query;

            const result = await this.smsLogService.getSMSStatistics(userId, { startDate, endDate });

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

export default new SMSLogController();
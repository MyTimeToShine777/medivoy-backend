'use strict';

import { getModels } from '../models/index.js';
import { Op } from 'sequelize';

export class SMSLogService {
    /**
     * LOG SMS
     */
    async logSMS(smsData) {
        try {
            if (!smsData.phoneNumber) {
                return { success: false, error: 'Phone number is required' };
            }

            if (!smsData.message) {
                return { success: false, error: 'SMS message is required' };
            }

            const { SMSLog } = getModels();

            // Calculate message length and segments
            const messageLength = smsData.message.length;
            const segmentCount = Math.ceil(messageLength / 160);

            const smsLog = await SMSLog.create({
                status: 'pending',
                attempts: 1,
                messageLength,
                segmentCount,
                ...smsData
            });

            return {
                success: true,
                data: smsLog,
                message: 'SMS logged successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE SMS STATUS
     */
    async updateSMSStatus(smsLogId, status, metadata = {}) {
        try {
            if (!smsLogId) {
                return { success: false, error: 'SMS log ID is required' };
            }

            if (!status) {
                return { success: false, error: 'Status is required' };
            }

            const validStatuses = ['pending', 'queued', 'sent', 'delivered', 'failed', 'undelivered'];
            if (!validStatuses.includes(status)) {
                return { success: false, error: 'Invalid status' };
            }

            const { SMSLog } = getModels();

            const smsLog = await SMSLog.findByPk(smsLogId);

            if (!smsLog) {
                return { success: false, error: 'SMS log not found' };
            }

            const updateData = { status, ...metadata };

            // Set timestamps based on status
            if (status === 'sent') {
                updateData.sentAt = new Date();
            } else if (status === 'delivered') {
                updateData.deliveredAt = new Date();
            }

            await smsLog.update(updateData);

            return {
                success: true,
                data: smsLog,
                message: `SMS status updated to ${status}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET SMS LOGS
     */
    async getSMSLogs(userId, options = {}) {
        try {
            const { SMSLog } = getModels();

            const { page = 1, limit = 50, status, smsType } = options;
            const offset = (page - 1) * limit;

            const where = {};
            if (userId) where.userId = userId;
            if (status) where.status = status;
            if (smsType) where.smsType = smsType;

            const { rows: logs, count: total } = await SMSLog.findAndCountAll({
                where,
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                success: true,
                data: logs,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET SMS LOG BY ID
     */
    async getSMSLogById(smsLogId) {
        try {
            if (!smsLogId) {
                return { success: false, error: 'SMS log ID is required' };
            }

            const { SMSLog, User } = getModels();

            const smsLog = await SMSLog.findByPk(smsLogId, {
                include: [
                    { model: User, as: 'user', attributes: ['userId', 'email', 'firstName', 'lastName'] }
                ]
            });

            if (!smsLog) {
                return { success: false, error: 'SMS log not found' };
            }

            return {
                success: true,
                data: smsLog
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * RETRY FAILED SMS
     */
    async retryFailedSMS(smsLogId) {
        try {
            if (!smsLogId) {
                return { success: false, error: 'SMS log ID is required' };
            }

            const { SMSLog } = getModels();

            const smsLog = await SMSLog.findByPk(smsLogId);

            if (!smsLog) {
                return { success: false, error: 'SMS log not found' };
            }

            if (smsLog.status !== 'failed') {
                return { success: false, error: 'Can only retry failed SMS' };
            }

            await smsLog.update({
                status: 'pending',
                attempts: smsLog.attempts + 1,
                errorMessage: null
            });

            return {
                success: true,
                data: smsLog,
                message: 'SMS queued for retry'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET SMS STATISTICS
     */
    async getSMSStatistics(userId, dateRange = {}) {
        try {
            const { SMSLog } = getModels();

            const where = {};
            if (userId) where.userId = userId;

            if (dateRange.startDate && dateRange.endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(dateRange.startDate), new Date(dateRange.endDate)]
                };
            }

            const stats = await SMSLog.findAll({
                where,
                attributes: [
                    'status', [sequelize.fn('COUNT', sequelize.col('smsLogId')), 'count'],
                    [sequelize.fn('SUM', sequelize.col('segmentCount')), 'totalSegments']
                ],
                group: ['status'],
                raw: true
            });

            const statsObj = stats.reduce((acc, stat) => {
                acc[stat.status] = {
                    count: parseInt(stat.count),
                    segments: parseInt(stat.totalSegments) || 0
                };
                return acc;
            }, {});

            return {
                success: true,
                data: {
                    total: stats.reduce((sum, s) => sum + parseInt(s.count), 0),
                    totalSegments: stats.reduce((sum, s) => sum + (parseInt(s.totalSegments) || 0), 0),
                    breakdown: statsObj
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new SMSLogService();
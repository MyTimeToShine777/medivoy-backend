'use strict';

import { getModels } from '../models/index.js';
import { Op } from 'sequelize';

export class EmailLogService {
    /**
     * LOG EMAIL
     */
    async logEmail(emailData) {
        try {
            if (!emailData.recipient) {
                return { success: false, error: 'Recipient email is required' };
            }

            if (!emailData.subject) {
                return { success: false, error: 'Email subject is required' };
            }

            const { EmailLog } = getModels();

            const emailLog = await EmailLog.create({
                status: 'pending',
                attempts: 1,
                ...emailData
            });

            return {
                success: true,
                data: emailLog,
                message: 'Email logged successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE EMAIL STATUS
     */
    async updateEmailStatus(emailLogId, status, metadata = {}) {
        try {
            if (!emailLogId) {
                return { success: false, error: 'Email log ID is required' };
            }

            if (!status) {
                return { success: false, error: 'Status is required' };
            }

            const validStatuses = ['pending', 'queued', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked'];
            if (!validStatuses.includes(status)) {
                return { success: false, error: 'Invalid status' };
            }

            const { EmailLog } = getModels();

            const emailLog = await EmailLog.findByPk(emailLogId);

            if (!emailLog) {
                return { success: false, error: 'Email log not found' };
            }

            const updateData = { status, ...metadata };

            // Set timestamps based on status
            if (status === 'sent') {
                updateData.sentAt = new Date();
            } else if (status === 'delivered') {
                updateData.deliveredAt = new Date();
            } else if (status === 'opened' && !emailLog.openedAt) {
                updateData.openedAt = new Date();
                updateData.openCount = (emailLog.openCount || 0) + 1;
            } else if (status === 'clicked' && !emailLog.clickedAt) {
                updateData.clickedAt = new Date();
                updateData.clickCount = (emailLog.clickCount || 0) + 1;
            }

            await emailLog.update(updateData);

            return {
                success: true,
                data: emailLog,
                message: `Email status updated to ${status}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET EMAIL LOGS
     */
    async getEmailLogs(userId, options = {}) {
        try {
            const { EmailLog } = getModels();

            const { page = 1, limit = 50, status, emailType } = options;
            const offset = (page - 1) * limit;

            const where = {};
            if (userId) where.userId = userId;
            if (status) where.status = status;
            if (emailType) where.emailType = emailType;

            const { rows: logs, count: total } = await EmailLog.findAndCountAll({
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
     * GET EMAIL LOG BY ID
     */
    async getEmailLogById(emailLogId) {
        try {
            if (!emailLogId) {
                return { success: false, error: 'Email log ID is required' };
            }

            const { EmailLog, User } = getModels();

            const emailLog = await EmailLog.findByPk(emailLogId, {
                include: [
                    { model: User, as: 'user', attributes: ['userId', 'email', 'firstName', 'lastName'] }
                ]
            });

            if (!emailLog) {
                return { success: false, error: 'Email log not found' };
            }

            return {
                success: true,
                data: emailLog
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * RETRY FAILED EMAIL
     */
    async retryFailedEmail(emailLogId) {
        try {
            if (!emailLogId) {
                return { success: false, error: 'Email log ID is required' };
            }

            const { EmailLog } = getModels();

            const emailLog = await EmailLog.findByPk(emailLogId);

            if (!emailLog) {
                return { success: false, error: 'Email log not found' };
            }

            if (emailLog.status !== 'failed') {
                return { success: false, error: 'Can only retry failed emails' };
            }

            await emailLog.update({
                status: 'pending',
                attempts: emailLog.attempts + 1,
                errorMessage: null
            });

            return {
                success: true,
                data: emailLog,
                message: 'Email queued for retry'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET EMAIL STATISTICS
     */
    async getEmailStatistics(userId, dateRange = {}) {
        try {
            const { EmailLog } = getModels();

            const where = {};
            if (userId) where.userId = userId;

            if (dateRange.startDate && dateRange.endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(dateRange.startDate), new Date(dateRange.endDate)]
                };
            }

            const stats = await EmailLog.findAll({
                where,
                attributes: [
                    'status', [sequelize.fn('COUNT', sequelize.col('emailLogId')), 'count']
                ],
                group: ['status'],
                raw: true
            });

            const statsObj = stats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {});

            return {
                success: true,
                data: {
                    total: stats.reduce((sum, s) => sum + parseInt(s.count), 0),
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

export default new EmailLogService();
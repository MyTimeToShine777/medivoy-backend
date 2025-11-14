'use strict';

import prisma from '../config/prisma.js';

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

            const emailLog = await prisma.emailLog.create({
                data: {
                    status: 'pending',
                    attempts: 1,
                    ...emailData
                }
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

            const emailLog = await prisma.emailLog.findUnique({
                where: { emailLogId }
            });

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

            const updated = await prisma.emailLog.update({
                where: { emailLogId },
                data: updateData
            });

            return {
                success: true,
                data: updated,
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
            const { page = 1, limit = 50, status, emailType } = options;
            const skip = (page - 1) * limit;

            const where = {};
            if (userId) where.userId = userId;
            if (status) where.status = status;
            if (emailType) where.emailType = emailType;

            const [logs, total] = await Promise.all([
                prisma.emailLog.findMany({
                    where,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: parseInt(limit),
                    skip: parseInt(skip)
                }),
                prisma.emailLog.count({ where })
            ]);

            return {
                success: true,
                data: logs,
                pagination: {
                    total,
                    page: parseInt(page),
                    take: parseInt(limit),
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

            const emailLog = await prisma.emailLog.findUnique({
                where: { emailLogId },
                include: {
                    user: {
                        select: { userId: true, email: true, firstName: true, lastName: true }
                    }
                }
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

            const emailLog = await prisma.emailLog.findUnique({
                where: { emailLogId }
            });

            if (!emailLog) {
                return { success: false, error: 'Email log not found' };
            }

            if (emailLog.status !== 'failed') {
                return { success: false, error: 'Can only retry failed emails' };
            }

            const updated = await prisma.emailLog.update({
                where: { emailLogId },
                data: {
                    status: 'pending',
                    attempts: emailLog.attempts + 1,
                    errorMessage: null
                }
            });

            return {
                success: true,
                data: updated,
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
            const where = {};
            if (userId) where.userId = userId;

            if (dateRange.startDate && dateRange.endDate) {
                where.createdAt = {
                    gte: new Date(dateRange.startDate),
                    lte: new Date(dateRange.endDate)
                };
            }

            const stats = await prisma.emailLog.groupBy({
                by: ['status'],
                where,
                _count: {
                    emailLogId: true
                }
            });

            const statsObj = stats.reduce((acc, stat) => {
                acc[stat.status] = stat._count.emailLogId;
                return acc;
            }, {});

            return {
                success: true,
                data: {
                    total: stats.reduce((sum, s) => sum + s._count.emailLogId, 0),
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
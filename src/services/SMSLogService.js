'use strict';

import prisma from '../config/prisma.js';

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

            // Calculate message length and segments
            const messageLength = smsData.message.length;
            const segmentCount = Math.ceil(messageLength / 160);

            const smsLog = await prisma.sMSLog.create({
                data: {
                    status: 'pending',
                    attempts: 1,
                    messageLength,
                    segmentCount,
                    ...smsData
                }
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

            const smsLog = await prisma.sMSLog.findUnique({
                where: { smsLogId }
            });

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

            const updated = await prisma.sMSLog.update({
                where: { smsLogId },
                data: updateData
            });

            return {
                success: true,
                data: updated,
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
            const { page = 1, limit = 50, status, smsType } = options;
            const skip = (page - 1) * limit;

            const where = {};
            if (userId) where.userId = userId;
            if (status) where.status = status;
            if (smsType) where.smsType = smsType;

            const [logs, total] = await Promise.all([
                prisma.sMSLog.findMany({
                    where,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: parseInt(limit),
                    skip: parseInt(skip)
                }),
                prisma.sMSLog.count({ where })
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
     * GET SMS LOG BY ID
     */
    async getSMSLogById(smsLogId) {
        try {
            if (!smsLogId) {
                return { success: false, error: 'SMS log ID is required' };
            }

            const smsLog = await prisma.sMSLog.findUnique({
                where: { smsLogId },
                include: {
                    user: {
                        select: { userId: true, email: true, firstName: true, lastName: true }
                    }
                }
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

            const smsLog = await prisma.sMSLog.findUnique({
                where: { smsLogId }
            });

            if (!smsLog) {
                return { success: false, error: 'SMS log not found' };
            }

            if (smsLog.status !== 'failed') {
                return { success: false, error: 'Can only retry failed SMS' };
            }

            const updated = await prisma.sMSLog.update({
                where: { smsLogId },
                data: {
                    status: 'pending',
                    attempts: smsLog.attempts + 1,
                    errorMessage: null
                }
            });

            return {
                success: true,
                data: updated,
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
            const where = {};
            if (userId) where.userId = userId;

            if (dateRange.startDate && dateRange.endDate) {
                where.createdAt = {
                    gte: new Date(dateRange.startDate),
                    lte: new Date(dateRange.endDate)
                };
            }

            const stats = await prisma.sMSLog.groupBy({
                by: ['status'],
                where,
                _count: {
                    smsLogId: true
                },
                _sum: {
                    segmentCount: true
                }
            });

            const statsObj = stats.reduce((acc, stat) => {
                acc[stat.status] = {
                    count: stat._count.smsLogId,
                    segments: stat._sum.segmentCount || 0
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
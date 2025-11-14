'use strict';

import prisma from '../config/prisma.js';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG SERVICE - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class AuditLogService {
    constructor() {
        this.logDir = path.join(process.cwd(), 'audit-logs');

        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LOG ACTION
    // ─────────────────────────────────────────────────────────────────────────────

    async logAction(userId, action, resourceType, resourceId, details, ipAddress) {
        try {
            if (!userId || !action) {
                return { success: false, error: 'User ID and action required' };
            }

            const auditLog = await prisma.auditLog.create({
                data: {
                    userId: userId,
                    action: action,
                    resourceType: resourceType || null,
                    resourceId: resourceId || null,
                    details: details || {},
                    ipAddress: ipAddress || 'unknown',
                    timestamp: new Date(),
                    userAgent: details && details.userAgent ? details.userAgent : null
                }
            });

            this.writeToFile(auditLog);
            console.log(`✅ Audit logged: ${action} by ${userId}`);

            return { success: true, data: auditLog };
        } catch (error) {
            console.error('❌ Log action error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET USER AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async getUserAuditLogs(userId, filters) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID required' };
            }

            const where = { userId: userId };

            if (filters.action) {
                where.action = filters.action;
            }

            if (filters.startDate && filters.endDate) {
                where.timestamp = {
                    gte: filters.startDate,
                    lte: filters.endDate
                };
            }

            if (filters.resourceType) {
                where.resourceType = filters.resourceType;
            }

            const logs = await prisma.auditLog.findMany({
                where: where,
                orderBy: {
                    timestamp: 'desc'
                },
                take: filters.limit || 100,
                skip: filters.offset || 0
            });

            const total = await prisma.auditLog.count({ where: where });

            console.log(`✅ User logs retrieved: ${userId}`);

            return { success: true, data: logs, total: total };
        } catch (error) {
            console.error('❌ Get user logs error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET RESOURCE AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async getResourceAuditLogs(resourceType, resourceId) {
        try {
            if (!resourceType || !resourceId) {
                return { success: false, error: 'Resource type and ID required' };
            }

            const logs = await prisma.auditLog.findMany({
                where: { resourceType: resourceType, resourceId: resourceId },
                orderBy: {
                    timestamp: 'desc'
                }
            });

            console.log(`✅ Resource logs retrieved: ${resourceType}/${resourceId}`);

            return { success: true, data: logs };
        } catch (error) {
            console.error('❌ Get resource logs error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET ACTION AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async getActionAuditLogs(action, filters) {
        try {
            if (!action) {
                return { success: false, error: 'Action required' };
            }

            const where = { action: action };

            if (filters.startDate && filters.endDate) {
                where.timestamp = {
                    gte: filters.startDate,
                    lte: filters.endDate
                };
            }

            const logs = await prisma.auditLog.findMany({
                where: where,
                orderBy: {
                    timestamp: 'desc'
                },
                take: filters.limit || 100,
                skip: filters.offset || 0
            });

            console.log(`✅ Action logs retrieved: ${action}`);

            return { success: true, data: logs };
        } catch (error) {
            console.error('❌ Get action logs error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GENERATE AUDIT REPORT
    // ─────────────────────────────────────────────────────────────────────────────

    async generateAuditReport(startDate, endDate, filters) {
        try {
            if (!startDate || !endDate) {
                return { success: false, error: 'Start and end dates required' };
            }

            const where = {
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            };

            if (filters.userId) {
                where.userId = filters.userId;
            }

            if (filters.action) {
                where.action = filters.action;
            }

            const logs = await prisma.auditLog.findMany({ where: where });

            const actionBreakdown = {};
            const resourceBreakdown = {};
            const userBreakdown = {};

            for (let i = 0; i < logs.length; i++) {
                const log = logs[i];
                const action = log.action ? log.action : 'unknown';
                const resource = log.resourceType ? log.resourceType : 'unknown';
                const userId = log.userId ? log.userId : 'unknown';

                actionBreakdown[action] = (actionBreakdown[action] || 0) + 1;
                resourceBreakdown[resource] = (resourceBreakdown[resource] || 0) + 1;
                userBreakdown[userId] = (userBreakdown[userId] || 0) + 1;
            }

            console.log(`✅ Audit report generated`);

            return {
                success: true,
                data: {
                    period: { start: startDate, end: endDate },
                    totalActions: logs.length,
                    actionBreakdown: actionBreakdown,
                    resourceBreakdown: resourceBreakdown,
                    userBreakdown: userBreakdown,
                    logs: logs
                }
            };
        } catch (error) {
            console.error('❌ Generate report error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SEARCH AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async searchAuditLogs(searchTerm, filters) {
        try {
            if (!searchTerm) {
                return { success: false, error: 'Search term required' };
            }

            const where = {
                OR: [
                    { userId: { contains: searchTerm, mode: 'insensitive' } },
                    { action: { contains: searchTerm, mode: 'insensitive' } },
                    { resourceType: { contains: searchTerm, mode: 'insensitive' } },
                    { ipAddress: { contains: searchTerm, mode: 'insensitive' } }
                ]
            };

            const logs = await prisma.auditLog.findMany({
                where: where,
                orderBy: {
                    timestamp: 'desc'
                },
                take: filters.limit || 50,
                skip: filters.offset || 0
            });

            const total = await prisma.auditLog.count({ where: where });

            console.log(`✅ Search completed: ${searchTerm}`);

            return { success: true, data: logs, total: total };
        } catch (error) {
            console.error('❌ Search error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // EXPORT AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async exportAuditLogs(startDate, endDate, format) {
        try {
            if (!startDate || !endDate) {
                return { success: false, error: 'Start and end dates required' };
            }

            const logs = await prisma.auditLog.findMany({
                where: {
                    timestamp: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });

            let content;
            let fileName;

            if (format === 'json') {
                content = JSON.stringify(logs, null, 2);
                fileName = `audit-logs-${Date.now()}.json`;
            } else if (format === 'csv') {
                content = this.convertToCSV(logs);
                fileName = `audit-logs-${Date.now()}.csv`;
            }

            console.log(`✅ Audit logs exported: ${fileName}`);

            return {
                success: true,
                data: {
                    content: content,
                    fileName: fileName,
                    logsCount: logs.length
                }
            };
        } catch (error) {
            console.error('❌ Export error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // WRITE TO FILE
    // ─────────────────────────────────────────────────────────────────────────────

    writeToFile(auditLog) {
        try {
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const filePath = path.join(this.logDir, `audit-${dateStr}.log`);

            const logEntry = JSON.stringify(auditLog) + '\n';
            fs.appendFileSync(filePath, logEntry);
        } catch (error) {
            console.error('❌ Write to file error:', error.message);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CONVERT TO CSV
    // ─────────────────────────────────────────────────────────────────────────────

    convertToCSV(logs) {
        try {
            const headers = ['User ID', 'Action', 'Resource Type', 'Resource ID', 'IP Address', 'Timestamp'];
            const rows = [];

            for (let i = 0; i < logs.length; i++) {
                const log = logs[i];
                rows.push([
                    log.userId || '',
                    log.action || '',
                    log.resourceType || '',
                    log.resourceId || '',
                    log.ipAddress || '',
                    log.timestamp || ''
                ]);
            }

            const csv = [headers].concat(rows).map(row => {
                return row.map(cell => `"${cell}"`).join(',');
            }).join('\n');

            return csv;
        } catch (error) {
            console.error('❌ Convert to CSV error:', error.message);
            return '';
        }
    }
}

export const auditLogService = new AuditLogService();
export default new AuditLogService();
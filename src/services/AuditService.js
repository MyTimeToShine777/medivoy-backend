'use strict';

import { AuditLog } from '../models/index.js';

export class AuditService {
    // ═══════════════════════════════════════════════════════════════════════════════
    // LOG AUTH EVENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async logAuthEvent(userId, action, details, ipAddress, userAgent) {
        try {
            const auditLog = await AuditLog.create({
                userId: userId || null,
                action,
                details: JSON.stringify(details),
                ipAddress,
                userAgent,
                timestamp: new Date()
            });

            console.log(`📝 Audit logged: ${action} by user ${userId}`);

            return auditLog;
        } catch (error) {
            console.error('❌ Audit log error:', error.message);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GET USER AUDIT LOGS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserAuditLogs(userId, limit = 50) {
        try {
            const logs = await AuditLog.findAll({
                where: { userId },
                order: [
                    ['timestamp', 'DESC']
                ],
                limit
            });

            return logs;
        } catch (error) {
            console.error('❌ Get audit logs error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GET ACTION HISTORY
    // ═══════════════════════════════════════════════════════════════════════════════

    async getActionHistory(action, limit = 100) {
        try {
            const logs = await AuditLog.findAll({
                where: { action },
                order: [
                    ['timestamp', 'DESC']
                ],
                limit
            });

            return logs;
        } catch (error) {
            console.error('❌ Get action history error:', error.message);
            throw error;
        }
    }
}

export const auditService = new AuditService();
export default auditService;
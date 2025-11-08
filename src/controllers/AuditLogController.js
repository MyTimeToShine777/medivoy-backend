'use strict';

import { auditLogService } from '../services/AuditLogService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG CONTROLLER - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class AuditLogController {
    // ─────────────────────────────────────────────────────────────────────────────
    // LOG ACTION
    // ─────────────────────────────────────────────────────────────────────────────

    async logAction(req, res, next) {
        try {
            const requiredFields = ['action'];
            const missing = requiredFields.filter(field => req.body[field] === undefined);

            if (missing.length > 0) {
                return res.status(400).json(
                    ResponseFormatter.error(
                        `Missing required fields: ${missing.join(', ')}`,
                        400,
                        'VALIDATION_ERROR'
                    )
                );
            }

            const result = await auditLogService.logAction(
                req.user.userId,
                req.body.action,
                req.body.resourceType,
                req.body.resourceId,
                req.body.details,
                req.ip
            );

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'AUDIT_ERROR'));
            }

            console.log(`✅ Action logged: ${req.body.action}`);

            return res.status(201).json(ResponseFormatter.created(result.data, 'Action logged successfully'));
        } catch (error) {
            console.error('❌ Log action error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET USER AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async getUserAuditLogs(req, res, next) {
        try {
            if (!req.params.userId) {
                return res.status(400).json(ResponseFormatter.error('User ID required', 400, 'VALIDATION_ERROR'));
            }

            const limit = parseInt(req.query.limit) || 100;
            const offset = parseInt(req.query.offset) || 0;
            const action = req.query.action;
            const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
            const resourceType = req.query.resourceType;

            const filters = {
                action: action,
                startDate: startDate,
                endDate: endDate,
                resourceType: resourceType,
                limit: limit,
                offset: offset
            };

            const result = await auditLogService.getUserAuditLogs(req.params.userId, filters);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'AUDIT_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'User audit logs retrieved', { total: result.total, limit, offset }));
        } catch (error) {
            console.error('❌ Get user logs error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET RESOURCE AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async getResourceAuditLogs(req, res, next) {
        try {
            if (!req.query.resourceType || !req.query.resourceId) {
                return res.status(400).json(ResponseFormatter.error('Resource type and ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await auditLogService.getResourceAuditLogs(req.query.resourceType, req.query.resourceId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'AUDIT_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Resource audit logs retrieved'));
        } catch (error) {
            console.error('❌ Get resource logs error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET ACTION AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async getActionAuditLogs(req, res, next) {
        try {
            if (!req.query.action) {
                return res.status(400).json(ResponseFormatter.error('Action required', 400, 'VALIDATION_ERROR'));
            }

            const limit = parseInt(req.query.limit) || 100;
            const offset = parseInt(req.query.offset) || 0;
            const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

            const filters = {
                startDate: startDate,
                endDate: endDate,
                limit: limit,
                offset: offset
            };

            const result = await auditLogService.getActionAuditLogs(req.query.action, filters);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'AUDIT_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Action audit logs retrieved'));
        } catch (error) {
            console.error('❌ Get action logs error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GENERATE AUDIT REPORT
    // ─────────────────────────────────────────────────────────────────────────────

    async generateAuditReport(req, res, next) {
        try {
            if (!req.query.startDate || !req.query.endDate) {
                return res.status(400).json(ResponseFormatter.error('Start and end dates required', 400, 'VALIDATION_ERROR'));
            }

            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);
            const userId = req.query.userId;
            const action = req.query.action;

            const filters = {
                userId: userId,
                action: action
            };

            const result = await auditLogService.generateAuditReport(startDate, endDate, filters);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'AUDIT_ERROR'));
            }

            console.log(`✅ Audit report generated`);

            return res.status(200).json(ResponseFormatter.success(result.data, 'Audit report generated successfully'));
        } catch (error) {
            console.error('❌ Generate report error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SEARCH AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async searchAuditLogs(req, res, next) {
        try {
            if (!req.query.q) {
                return res.status(400).json(ResponseFormatter.error('Search term required', 400, 'VALIDATION_ERROR'));
            }

            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;

            const filters = {
                limit: limit,
                offset: offset
            };

            const result = await auditLogService.searchAuditLogs(req.query.q, filters);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'AUDIT_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Search results retrieved', { total: result.total, limit, offset }));
        } catch (error) {
            console.error('❌ Search error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // EXPORT AUDIT LOGS
    // ─────────────────────────────────────────────────────────────────────────────

    async exportAuditLogs(req, res, next) {
        try {
            if (!req.query.startDate || !req.query.endDate) {
                return res.status(400).json(ResponseFormatter.error('Start and end dates required', 400, 'VALIDATION_ERROR'));
            }

            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);
            const format = req.query.format || 'json';

            if (format !== 'json' && format !== 'csv') {
                return res.status(400).json(ResponseFormatter.error('Format must be json or csv', 400, 'VALIDATION_ERROR'));
            }

            const result = await auditLogService.exportAuditLogs(startDate, endDate, format);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'AUDIT_ERROR'));
            }

            if (format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename="${result.data.fileName}"`);
                return res.send(result.data.content);
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${result.data.fileName}"`);
            return res.json(result.data);
        } catch (error) {
            console.error('❌ Export error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new AuditLogController();
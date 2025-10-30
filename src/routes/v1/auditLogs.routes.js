/**
 * Audit Logs Routes
 */

const express = require('express');

const router = express.Router();
const auditLogController = require('../../controllers/auditLog.controller');
const authenticate = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auditLogController.getAllAuditLogs);

/**
 * @swagger
 * /api/v1/audit-logs:
 *   post:
 *     summary: Create audit log
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auditLogController.createAuditLog);

/**
 * @swagger
 * /api/v1/audit-logs/user/{userId}:
 *   get:
 *     summary: Get user activity logs
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user/:userId', auditLogController.getUserActivityLogs);

/**
 * @swagger
 * /api/v1/audit-logs/entity/{entityType}/{entityId}:
 *   get:
 *     summary: Get entity audit trail
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/entity/:entityType/:entityId', auditLogController.getEntityAuditTrail);

/**
 * @swagger
 * /api/v1/audit-logs/statistics:
 *   get:
 *     summary: Get audit log statistics
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/statistics', auditLogController.getAuditLogStatistics);

/**
 * @swagger
 * /api/v1/audit-logs/security-events:
 *   get:
 *     summary: Get security events
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/security-events', auditLogController.getSecurityEvents);

/**
 * @swagger
 * /api/v1/audit-logs/export:
 *   get:
 *     summary: Export audit logs
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/export', auditLogController.exportAuditLogs);

/**
 * @swagger
 * /api/v1/audit-logs/{id}:
 *   get:
 *     summary: Get audit log by ID
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', auditLogController.getAuditLogById);

module.exports = router;

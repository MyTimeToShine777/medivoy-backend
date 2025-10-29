/**
 * Integrations Routes
 */

const express = require('express');
const router = express.Router();
const integrationController = require('../../controllers/integration.controller');
const authenticate = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/integrations:
 *   get:
 *     summary: Get all integrations
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', integrationController.getAllIntegrations);

/**
 * @swagger
 * /api/v1/integrations:
 *   post:
 *     summary: Create integration
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', integrationController.createIntegration);

/**
 * @swagger
 * /api/v1/integrations/slug/{slug}:
 *   get:
 *     summary: Get integration by slug
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/slug/:slug', integrationController.getIntegrationBySlug);

/**
 * @swagger
 * /api/v1/integrations/statistics:
 *   get:
 *     summary: Get integration statistics
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/statistics', integrationController.getIntegrationStatistics);

/**
 * @swagger
 * /api/v1/integrations/{id}:
 *   get:
 *     summary: Get integration by ID
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', integrationController.getIntegrationById);

/**
 * @swagger
 * /api/v1/integrations/{id}:
 *   put:
 *     summary: Update integration
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', integrationController.updateIntegration);

/**
 * @swagger
 * /api/v1/integrations/{id}:
 *   delete:
 *     summary: Delete integration
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', integrationController.deleteIntegration);

/**
 * @swagger
 * /api/v1/integrations/{id}/toggle:
 *   put:
 *     summary: Toggle integration status
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/toggle', integrationController.toggleIntegrationStatus);

/**
 * @swagger
 * /api/v1/integrations/{id}/test:
 *   post:
 *     summary: Test integration connection
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/test', integrationController.testIntegration);

/**
 * @swagger
 * /api/v1/integrations/{id}/sync:
 *   post:
 *     summary: Sync integration
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/sync', integrationController.syncIntegration);

module.exports = router;
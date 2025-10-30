/**
 * Integrations Routes
 */

const express = require('express');

const router = express.Router();
const integrationController = require('../../controllers/integration.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

// All routes require authentication
router.use(auth);

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
 *     summary: Create new integration
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', integrationController.createIntegration);

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
 *     summary: Sync data with integration
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/sync', integrationController.syncIntegration);

module.exports = router;
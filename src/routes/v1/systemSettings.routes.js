/**
 * System Settings Routes
 */

const express = require('express');

const router = express.Router();
const systemSettingsController = require('../../controllers/systemSettings.controller');
const authenticate = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/system-settings:
 *   get:
 *     summary: Get all settings
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', systemSettingsController.getAllSettings);

/**
 * @swagger
 * /api/v1/system-settings/public:
 *   get:
 *     summary: Get public settings
 *     tags: [System Settings]
 */
router.get('/public', systemSettingsController.getPublicSettings);

/**
 * @swagger
 * /api/v1/system-settings/category/{category}:
 *   get:
 *     summary: Get settings by category
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/category/:category', systemSettingsController.getSettingsByCategory);

/**
 * @swagger
 * /api/v1/system-settings/key/{key}:
 *   get:
 *     summary: Get setting by key
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/key/:key', systemSettingsController.getSettingByKey);

/**
 * @swagger
 * /api/v1/system-settings:
 *   post:
 *     summary: Create or update setting
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', systemSettingsController.upsertSetting);

/**
 * @swagger
 * /api/v1/system-settings/key/{key}:
 *   put:
 *     summary: Update setting value
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.put('/key/:key', systemSettingsController.updateSettingValue);

/**
 * @swagger
 * /api/v1/system-settings/key/{key}:
 *   delete:
 *     summary: Delete setting
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/key/:key', systemSettingsController.deleteSetting);

/**
 * @swagger
 * /api/v1/system-settings/bulk:
 *   put:
 *     summary: Bulk update settings
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.put('/bulk', systemSettingsController.bulkUpdateSettings);

/**
 * @swagger
 * /api/v1/system-settings/key/{key}/reset:
 *   put:
 *     summary: Reset setting to default
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 */
router.put('/key/:key/reset', systemSettingsController.resetSettingToDefault);

router.get('/:id', authenticate, authorize("admin"), systemSettingsController.getById);
module.exports = router;

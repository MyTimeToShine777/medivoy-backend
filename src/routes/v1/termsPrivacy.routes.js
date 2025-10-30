/**
 * Terms & Privacy Routes
 */

const express = require('express');

const router = express.Router();
const termsPrivacyController = require('../../controllers/termsPrivacy.controller');
const authenticate = require('../../middleware/auth.middleware');

/**
 * Terms and Conditions Routes
 */

/**
 * @swagger
 * /api/v1/terms-privacy/terms:
 *   get:
 *     summary: Get all terms and conditions versions
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.get('/terms', authenticate, termsPrivacyController.getAllTerms);

/**
 * @swagger
 * /api/v1/terms-privacy/terms/active:
 *   get:
 *     summary: Get active terms and conditions
 *     tags: [Terms & Privacy]
 */
router.get('/terms/active', termsPrivacyController.getActiveTerms);

/**
 * @swagger
 * /api/v1/terms-privacy/terms:
 *   post:
 *     summary: Create terms and conditions
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.post('/terms', authenticate, termsPrivacyController.createTerms);

/**
 * @swagger
 * /api/v1/terms-privacy/terms/{id}:
 *   put:
 *     summary: Update terms and conditions
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.put('/terms/:id', authenticate, termsPrivacyController.updateTerms);

/**
 * @swagger
 * /api/v1/terms-privacy/terms/{id}/publish:
 *   put:
 *     summary: Publish terms and conditions
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.put('/terms/:id/publish', authenticate, termsPrivacyController.publishTerms);

/**
 * Privacy Policy Routes
 */

/**
 * @swagger
 * /api/v1/terms-privacy/privacy:
 *   get:
 *     summary: Get all privacy policy versions
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.get('/privacy', authenticate, termsPrivacyController.getAllPrivacyPolicies);

/**
 * @swagger
 * /api/v1/terms-privacy/privacy/active:
 *   get:
 *     summary: Get active privacy policy
 *     tags: [Terms & Privacy]
 */
router.get('/privacy/active', termsPrivacyController.getActivePrivacyPolicy);

/**
 * @swagger
 * /api/v1/terms-privacy/privacy:
 *   post:
 *     summary: Create privacy policy
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.post('/privacy', authenticate, termsPrivacyController.createPrivacyPolicy);

/**
 * @swagger
 * /api/v1/terms-privacy/privacy/{id}:
 *   put:
 *     summary: Update privacy policy
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.put('/privacy/:id', authenticate, termsPrivacyController.updatePrivacyPolicy);

/**
 * @swagger
 * /api/v1/terms-privacy/privacy/{id}/publish:
 *   put:
 *     summary: Publish privacy policy
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.put('/privacy/:id/publish', authenticate, termsPrivacyController.publishPrivacyPolicy);

/**
 * User Acceptance Routes
 */

/**
 * @swagger
 * /api/v1/terms-privacy/acceptance:
 *   post:
 *     summary: Record user acceptance
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.post('/acceptance', authenticate, termsPrivacyController.recordAcceptance);

/**
 * @swagger
 * /api/v1/terms-privacy/acceptance/user/{userId}:
 *   get:
 *     summary: Get user acceptances
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.get('/acceptance/user/:userId', authenticate, termsPrivacyController.getUserAcceptances);

/**
 * @swagger
 * /api/v1/terms-privacy/acceptance/check/{userId}:
 *   get:
 *     summary: Check if user has accepted latest version
 *     tags: [Terms & Privacy]
 *     security:
 *       - bearerAuth: []
 */
router.get('/acceptance/check/:userId', authenticate, termsPrivacyController.checkUserAcceptance);

module.exports = router;

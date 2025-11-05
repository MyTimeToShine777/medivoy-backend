/**
 * DNA Kits Routes
 */

const express = require('express');

const router = express.Router();
const dnaKitController = require('../../controllers/dnaKit.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/v1/dna-kits:
 *   get:
 *     summary: Get all DNA kit orders
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', dnaKitController.getAllDNAKits);

/**
 * @swagger
 * /api/v1/dna-kits:
 *   post:
 *     summary: Create DNA kit order
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', dnaKitController.createDNAKitOrder);

/**
 * @swagger
 * /api/v1/dna-kits/patient/{patientId}:
 *   get:
 *     summary: Get patient DNA kit orders
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.get('/patient/:patientId', dnaKitController.getPatientDNAKits);

/**
 * @swagger
 * /api/v1/dna-kits/statistics:
 *   get:
 *     summary: Get DNA kit statistics
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.get('/statistics', dnaKitController.getDNAKitStatistics);

/**
 * @swagger
 * /api/v1/dna-kits/{id}:
 *   get:
 *     summary: Get DNA kit by ID
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', dnaKitController.getDNAKitById);

/**
 * @swagger
 * /api/v1/dna-kits/{id}:
 *   put:
 *     summary: Update DNA kit order
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', dnaKitController.updateDNAKitOrder);

/**
 * @swagger
 * /api/v1/dna-kits/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/status', dnaKitController.updateOrderStatus);

/**
 * @swagger
 * /api/v1/dna-kits/{id}/results:
 *   put:
 *     summary: Upload test results
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/results', dnaKitController.uploadTestResults);

/**
 * @swagger
 * /api/v1/dna-kits/{id}/cancel:
 *   put:
 *     summary: Cancel DNA kit order
 *     tags: [DNA Kits]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/cancel', dnaKitController.cancelOrder);

router.delete('/:id', auth, authorize('admin'), dnaKitController.deleteDNAKit);
module.exports = router;

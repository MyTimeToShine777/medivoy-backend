const express = require('express');
const router = express.Router();
const treatmentController = require('../../controllers/treatment.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/treatments:
 *   get:
 *     summary: Get all treatments
 *     tags: [Treatments]
 */
router.get('/', treatmentController.getAllTreatments);

/**
 * @swagger
 * /api/v1/treatments:
 *   post:
 *     summary: Create a new treatment
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['admin']), treatmentController.createTreatment);

/**
 * @swagger
 * /api/v1/treatments/{id}:
 *   get:
 *     summary: Get treatment by ID
 *     tags: [Treatments]
 */
router.get('/:id', treatmentController.getTreatment);

/**
 * @swagger
 * /api/v1/treatments/{id}:
 *   put:
 *     summary: Update treatment
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize(['admin']), treatmentController.updateTreatment);

/**
 * @swagger
 * /api/v1/treatments/{id}:
 *   delete:
 *     summary: Delete treatment
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), treatmentController.deleteTreatment);

/**
 * @swagger
 * /api/v1/treatments/category/{categoryId}:
 *   get:
 *     summary: Get treatments by category
 *     tags: [Treatments]
 */
router.get('/category/:categoryId', treatmentController.getTreatmentsByCategory);

/**
 * @swagger
 * /api/v1/treatments/subcategory/{subcategoryId}:
 *   get:
 *     summary: Get treatments by subcategory
 *     tags: [Treatments]
 */
router.get('/subcategory/:subcategoryId', treatmentController.getTreatmentsBySubcategory);

module.exports = router;

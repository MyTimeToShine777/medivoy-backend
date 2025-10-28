const express = require('express');
const router = express.Router();
const hospitalController = require('../../controllers/hospital.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 */
router.get('/', hospitalController.getAllHospitals);

/**
 * @swagger
 * /api/v1/hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.createHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 */
router.get('/:id', hospitalController.getHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}:
 *   put:
 *     summary: Update hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.updateHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}:
 *   delete:
 *     summary: Delete hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), hospitalController.deleteHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}/doctors:
 *   post:
 *     summary: Add doctor to hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/doctors', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.addDoctor);

/**
 * @swagger
 * /api/v1/hospitals/{id}/doctors/{doctorId}:
 *   delete:
 *     summary: Remove doctor from hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/doctors/:doctorId', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.removeDoctor);

/**
 * @swagger
 * /api/v1/hospitals/{id}/treatments:
 *   post:
 *     summary: Add treatment to hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/treatments', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.addTreatment);

/**
 * @swagger
 * /api/v1/hospitals/{id}/verify:
 *   post:
 *     summary: Verify hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/verify', authenticate, authorize(['admin']), hospitalController.verifyHospital);

module.exports = router;

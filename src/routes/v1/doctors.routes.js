const express = require('express');
const router = express.Router();
const doctorController = require('../../controllers/doctor.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @swagger
 * /api/v1/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['admin']), doctorController.createDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
 */
router.get('/:id', doctorController.getDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   put:
 *     summary: Update doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize(['admin', 'doctor']), doctorController.updateDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   delete:
 *     summary: Delete doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), doctorController.deleteDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}/availability:
 *   put:
 *     summary: Update doctor availability
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/availability', authenticate, authorize(['doctor']), doctorController.updateAvailability);

/**
 * @swagger
 * /api/v1/doctors/{id}/appointments:
 *   get:
 *     summary: Get doctor appointments
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/appointments', authenticate, doctorController.getAppointments);

/**
 * @swagger
 * /api/v1/doctors/{id}/verify:
 *   post:
 *     summary: Verify doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/verify', authenticate, authorize(['admin']), doctorController.verifyDoctor);

module.exports = router;

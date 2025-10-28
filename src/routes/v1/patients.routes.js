const express = require('express');
const router = express.Router();
const patientController = require('../../controllers/patient.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, authorize(['admin', 'doctor']), patientController.getAllPatients);

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, patientController.createPatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticate, patientController.getPatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, patientController.updatePatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Delete patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), patientController.deletePatient);

/**
 * @swagger
 * /api/v1/patients/{id}/medical-history:
 *   put:
 *     summary: Update patient medical history
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/medical-history', authenticate, patientController.updateMedicalHistory);

/**
 * @swagger
 * /api/v1/patients/{id}/appointments:
 *   get:
 *     summary: Get patient appointments
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/appointments', authenticate, patientController.getAppointments);

/**
 * @swagger
 * /api/v1/patients/{id}/bookings:
 *   get:
 *     summary: Get patient bookings
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/bookings', authenticate, patientController.getBookings);

module.exports = router;

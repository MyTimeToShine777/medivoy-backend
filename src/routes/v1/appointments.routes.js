const express = require('express');
const appointmentController = require('../../controllers/appointment.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - scheduledAt
 *             properties:
 *               patientId:
 *                 type: integer
 *                 description: Patient ID
 *               doctorId:
 *                 type: integer
 *                 description: Doctor ID
 *               hospitalId:
 *                 type: integer
 *                 description: Hospital ID (optional)
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled appointment date and time
 *               notes:
 *                 type: string
 *                 description: Additional notes for the appointment
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  auth,
  authorize(['patient', 'doctor', 'hospital_admin']),
  appointmentController.createAppointment,
);

// Get appointment by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  appointmentController.getAppointment,
);

// Update appointment (doctors, hospital admins, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'doctor', 'hospital_admin']),
  appointmentController.updateAppointment,
);

// Update appointment status (doctors, hospital admins, admin)
router.patch(
  '/:id/status',
  auth,
  authorize(['admin', 'doctor', 'hospital_admin']),
  appointmentController.updateAppointmentStatus,
);

// Get all appointments (admin, hospital admins)
router.get(
  '/',
  auth,
  authorize(['admin', 'hospital_admin']),
  appointmentController.getAllAppointments,
);

// Get patient appointments (patients)
router.get(
  '/patient/:patientId',
  auth,
  authorize(['admin', 'patient', 'hospital_admin']),
  appointmentController.getPatientAppointments,
);

// Get doctor appointments (doctors)
router.get(

router.delete('/:id', authenticate, appointmentController.delete);  '/doctor/:doctorId',
  auth,
  authorize(['admin', 'doctor', 'hospital_admin']),
  appointmentController.getDoctorAppointments,
);

module.exports = router;

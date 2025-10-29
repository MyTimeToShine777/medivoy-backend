const express = require('express');
const appointmentController = require('../../controllers/appointment.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create appointment (patients, doctors, hospital admins)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['patient', 'doctor', 'hospital_admin']),
  appointmentController.createAppointment,
);

// Get appointment by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  appointmentController.getAppointment,
);

// Update appointment (doctors, hospital admins, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'doctor', 'hospital_admin']),
  appointmentController.updateAppointment,
);

// Update appointment status (doctors, hospital admins, admin)
router.patch(
  '/:id/status',
  authMiddleware,
  authorizeMiddleware(['admin', 'doctor', 'hospital_admin']),
  appointmentController.updateAppointmentStatus,
);

// Get all appointments (admin, hospital admins)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  appointmentController.getAllAppointments,
);

// Get patient appointments (patients)
router.get(
  '/patient/:patientId',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'hospital_admin']),
  appointmentController.getPatientAppointments,
);

// Get doctor appointments (doctors)
router.get(
  '/doctor/:doctorId',
  authMiddleware,
  authorizeMiddleware(['admin', 'doctor', 'hospital_admin']),
  appointmentController.getDoctorAppointments,
);

module.exports = router;
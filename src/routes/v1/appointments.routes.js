const express = require('express');
const appointmentController = require('../../controllers/appointment.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create appointment (patients, doctors, hospital admins)
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
  '/doctor/:doctorId',
  auth,
  authorize(['admin', 'doctor', 'hospital_admin']),
  appointmentController.getDoctorAppointments,
);

module.exports = router;
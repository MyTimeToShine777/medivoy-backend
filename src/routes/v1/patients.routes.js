const express = require('express');
const patientController = require('../../controllers/patient.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create patient (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  patientController.createPatient,
);

// Get patient by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  patientController.getPatient,
);

// Update patient (patients themselves, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'patient']),
  patientController.updatePatient,
);

// Delete patient (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  patientController.deletePatient,
);

// Get all patients (admin, doctors, hospital admins)
router.get(
  '/',
  auth,
  authorize(['admin', 'doctor', 'hospital_admin']),
  patientController.getAllPatients,
);

module.exports = router;
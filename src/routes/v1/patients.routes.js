const express = require('express');
const patientController = require('../../controllers/patient.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create patient (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  patientController.createPatient,
);

// Get patient by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  patientController.getPatient,
);

// Update patient (patients themselves, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient']),
  patientController.updatePatient,
);

// Delete patient (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  patientController.deletePatient,
);

// Get all patients (admin, doctors, hospital admins)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'doctor', 'hospital_admin']),
  patientController.getAllPatients,
);

module.exports = router;
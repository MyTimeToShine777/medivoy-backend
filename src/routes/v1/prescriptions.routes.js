const express = require('express');
const prescriptionController = require('../../controllers/prescription.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create prescription (doctors only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['doctor']),
  prescriptionController.createPrescription,
);

// Get prescription by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  prescriptionController.getPrescription,
);

// Update prescription (doctors only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['doctor']),
  prescriptionController.updatePrescription,
);

// Delete prescription (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  prescriptionController.deletePrescription,
);

// Get all prescriptions for a patient (authenticated users)
router.get(
  '/patient/:patientId',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  prescriptionController.getPatientPrescriptions,
);

module.exports = router;
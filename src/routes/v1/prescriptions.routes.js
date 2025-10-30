const express = require('express');
const prescriptionController = require('../../controllers/prescription.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create prescription (doctors only)
router.post(
  '/',
  auth,
  authorize(['doctor']),
  prescriptionController.createPrescription,
);

// Get prescription by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  prescriptionController.getPrescription,
);

// Update prescription (doctors only)
router.put(
  '/:id',
  auth,
  authorize(['doctor']),
  prescriptionController.updatePrescription,
);

// Delete prescription (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  prescriptionController.deletePrescription,
);

// Get all prescriptions for a patient (authenticated users)
router.get(

router.get('/', authenticate, prescriptionController.getAll);  '/patient/:patientId',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  prescriptionController.getPatientPrescriptions,
);

module.exports = router;

const express = require('express');
const prescriptionController = require('../../controllers/prescription.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Basic CRUD operations
router.post(
  '/',
  auth,
  authorize(['doctor']),
  prescriptionController.createPrescription
);
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  prescriptionController.getPrescription
);
router.put(
  '/:id',
  auth,
  authorize(['doctor']),
  prescriptionController.updatePrescription
);
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  prescriptionController.deletePrescription
);
router.get(
  '/patient/:patientId',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  prescriptionController.getPatientPrescriptions
);

module.exports = router;

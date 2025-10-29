const express = require('express');
const medicalRecordController = require('../../controllers/medicalRecord.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create medical record (doctors, hospital admins, admin)
router.post(
  '/',
  auth,
   // Get all medical records (admin, doctor, hospital_admin)\n   router.get(\n     "/",\n     auth,\n     authorize(["admin", "doctor", "hospital_admin"]),\n     medicalRecordController.getAllMedicalRecords,\n   );
  authorize(['admin', 'doctor', 'hospital_admin']),
  medicalRecordController.createMedicalRecord,
);

// Get medical record by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  medicalRecordController.getMedicalRecord,
);

// Update medical record (doctors, hospital admins, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'doctor', 'hospital_admin']),
  medicalRecordController.updateMedicalRecord,
);

// Delete medical record (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  medicalRecordController.deleteMedicalRecord,
);

// Get all medical records for a patient (authenticated users)
router.get(
  '/patient/:patientId',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  medicalRecordController.getPatientMedicalRecords,
);

module.exports = router;
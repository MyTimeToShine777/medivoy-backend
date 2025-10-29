const express = require('express');
const medicalRecordController = require('../../controllers/medicalRecord.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create medical record (doctors, hospital admins, admin)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'doctor', 'hospital_admin']),
  medicalRecordController.createMedicalRecord,
);

// Get medical record by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  medicalRecordController.getMedicalRecord,
);

// Update medical record (doctors, hospital admins, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'doctor', 'hospital_admin']),
  medicalRecordController.updateMedicalRecord,
);

// Delete medical record (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  medicalRecordController.deleteMedicalRecord,
);

// Get all medical records for a patient (authenticated users)
router.get(
  '/patient/:patientId',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  medicalRecordController.getPatientMedicalRecords,
);

module.exports = router;
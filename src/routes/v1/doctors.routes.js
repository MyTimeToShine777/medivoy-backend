const express = require('express');
const doctorController = require('../../controllers/doctor.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create doctor (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  doctorController.createDoctor,
);

// Get doctor by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  doctorController.getDoctor,
);

// Update doctor (doctors themselves, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'doctor']),
  doctorController.updateDoctor,
);

// Delete doctor (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  doctorController.deleteDoctor,
);

// Get all doctors (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  doctorController.getAllDoctors,
);

// Verify doctor (admin only)
router.patch(
  '/:id/verify',
  authMiddleware,
  authorizeMiddleware(['admin']),
  doctorController.verifyDoctor,
);

module.exports = router;
const express = require('express');
const doctorController = require('../../controllers/doctor.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create doctor (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  doctorController.createDoctor,
);

// Get doctor by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  doctorController.getDoctor,
);

// Update doctor (doctors themselves, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'doctor']),
  doctorController.updateDoctor,
);

// Delete doctor (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  doctorController.deleteDoctor,
);

// Get all doctors (authenticated users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  doctorController.getAllDoctors,
);

// Verify doctor (admin only)
router.patch(
  '/:id/verify',
  auth,
  authorize(['admin']),
  doctorController.verifyDoctor,
);

module.exports = router;
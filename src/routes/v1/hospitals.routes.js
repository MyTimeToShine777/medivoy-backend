const express = require('express');
const hospitalController = require('../../controllers/hospital.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create hospital (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  hospitalController.createHospital,
);

// Get hospital by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  hospitalController.getHospital,
);

// Update hospital (hospital admins themselves, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'hospital_admin']),
  hospitalController.updateHospital,
);

// Delete hospital (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  hospitalController.deleteHospital,
);

// Get all hospitals (authenticated users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  hospitalController.getAllHospitals,
);

// Verify hospital (admin only)
router.patch(
  '/:id/verify',
  auth,
  authorize(['admin']),
  hospitalController.verifyHospital,
);

module.exports = router;
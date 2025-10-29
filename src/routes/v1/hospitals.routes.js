const express = require('express');
const hospitalController = require('../../controllers/hospital.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create hospital (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  hospitalController.createHospital,
);

// Get hospital by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  hospitalController.getHospital,
);

// Update hospital (hospital admins themselves, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  hospitalController.updateHospital,
);

// Delete hospital (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  hospitalController.deleteHospital,
);

// Get all hospitals (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  hospitalController.getAllHospitals,
);

// Verify hospital (admin only)
router.patch(
  '/:id/verify',
  authMiddleware,
  authorizeMiddleware(['admin']),
  hospitalController.verifyHospital,
);

module.exports = router;
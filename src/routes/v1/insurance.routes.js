const express = require('express');
const insuranceController = require('../../controllers/insurance.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create insurance provider (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  insuranceController.createInsurance,
);

// Get insurance provider by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  insuranceController.getInsurance,
);

// Update insurance provider (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  insuranceController.updateInsurance,
);

// Delete insurance provider (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  insuranceController.deleteInsurance,
);

// Get all insurance providers (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  insuranceController.getAllInsurance,
);

module.exports = router;
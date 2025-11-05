const express = require('express');
const insuranceController = require('../../controllers/insurance.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create insurance provider (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  insuranceController.createInsurance
);

// Get insurance provider by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  insuranceController.getInsurance
);

// Update insurance provider (admin only)
router.put(
  '/:id',
  auth,
  authorize(['admin']),
  insuranceController.updateInsurance
);

// Delete insurance provider (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  insuranceController.deleteInsurance
);

// Get all insurance providers (authd users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  insuranceController.getAllInsurance
);

module.exports = router;

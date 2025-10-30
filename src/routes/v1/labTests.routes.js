const express = require('express');
const labTestController = require('../../controllers/labTest.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create lab test (admin, hospital admins)
router.post(
  '/',
  auth,
  authorize(['admin', 'hospital_admin']),
  labTestController.createLabTest,
);

// Get lab test by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  labTestController.getLabTest,
);

// Update lab test (admin, hospital admins)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'hospital_admin']),
  labTestController.updateLabTest,
);

// Delete lab test (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  labTestController.deleteLabTest,
);

// Get all lab tests (authd users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  labTestController.getAllLabTests,
);

module.exports = router;

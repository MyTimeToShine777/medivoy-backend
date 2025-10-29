const express = require('express');
const labTestController = require('../../controllers/labTest.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create lab test (admin, hospital admins)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  labTestController.createLabTest,
);

// Get lab test by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  labTestController.getLabTest,
);

// Update lab test (admin, hospital admins)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  labTestController.updateLabTest,
);

// Delete lab test (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  labTestController.deleteLabTest,
);

// Get all lab tests (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  labTestController.getAllLabTests,
);

module.exports = router;
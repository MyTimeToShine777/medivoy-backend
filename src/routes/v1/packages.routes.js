const express = require('express');
const packageController = require('../../controllers/package.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create package (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  packageController.createPackage,
);

// Get package by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  packageController.getPackage,
);

// Update package (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  packageController.updatePackage,
);

// Delete package (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  packageController.deletePackage,
);

// Get all packages (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  packageController.getAllPackages,
);

module.exports = router;
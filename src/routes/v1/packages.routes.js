const express = require('express');
const packageController = require('../../controllers/package.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create package (admin only)
router.post('/', auth, authorize(['admin']), packageController.createPackage);

// Get package by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  packageController.getPackage
);

// Update package (admin only)
router.put('/:id', auth, authorize(['admin']), packageController.updatePackage);

// Delete package (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  packageController.deletePackage
);

// Get all packages (authd users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  packageController.getAllPackages
);

module.exports = router;

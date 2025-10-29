const express = require('express');
const laboratoryController = require('../../controllers/laboratory.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create laboratory (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  laboratoryController.createLaboratory,
);

// Get laboratory by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  laboratoryController.getLaboratory,
);

// Update laboratory (admin only)
router.put(
  '/:id',
  auth,
  authorize(['admin']),
  laboratoryController.updateLaboratory,
);

// Delete laboratory (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  laboratoryController.deleteLaboratory,
);

// Get all laboratories (authenticated users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  laboratoryController.getAllLaboratories,
);

module.exports = router;
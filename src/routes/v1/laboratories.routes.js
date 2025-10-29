const express = require('express');
const laboratoryController = require('../../controllers/laboratory.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create laboratory (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  laboratoryController.createLaboratory,
);

// Get laboratory by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  laboratoryController.getLaboratory,
);

// Update laboratory (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  laboratoryController.updateLaboratory,
);

// Delete laboratory (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  laboratoryController.deleteLaboratory,
);

// Get all laboratories (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  laboratoryController.getAllLaboratories,
);

module.exports = router;
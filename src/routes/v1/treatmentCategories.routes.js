const express = require('express');
const treatmentCategoryController = require('../../controllers/treatmentCategory.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create treatment category (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  treatmentCategoryController.createTreatmentCategory,
);

// Get treatment category by ID (public access)
router.get(
  '/:id',
  treatmentCategoryController.getTreatmentCategory,
);

// Update treatment category (admin only)
router.put(
  '/:id',
  auth,
  authorize(['admin']),
  treatmentCategoryController.updateTreatmentCategory,
);

// Delete treatment category (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  treatmentCategoryController.deleteTreatmentCategory,
);

// Get all treatment categories (public access)
router.get(
  '/',
  treatmentCategoryController.getAllTreatmentCategories,
);

module.exports = router;

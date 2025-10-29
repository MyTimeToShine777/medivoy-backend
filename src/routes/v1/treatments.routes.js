const express = require('express');
const treatmentController = require('../../controllers/treatment.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create treatment (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  treatmentController.createTreatment,
);

// Get treatment by ID (public access)
router.get(
  '/:id',
  treatmentController.getTreatment,
);

// Update treatment (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  treatmentController.updateTreatment,
);

// Delete treatment (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  treatmentController.deleteTreatment,
);

// Get all treatments (public access)
router.get(
  '/',
  treatmentController.getAllTreatments,
);

// Get treatments by category (public access)
router.get(
  '/category/:categoryId',
  treatmentController.getTreatmentsByCategory,
);

// Get treatments by subcategory (public access)
router.get(
  '/subcategory/:subcategoryId',
  treatmentController.getTreatmentsBySubcategory,
);

module.exports = router;
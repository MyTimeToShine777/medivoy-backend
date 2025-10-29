const express = require('express');
const reviewController = require('../../controllers/review.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create review (patients only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['patient']),
  reviewController.createReview,
);

// Get review by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  reviewController.getReview,
);

// Update review (patients who wrote it, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient']),
  reviewController.updateReview,
);

// Delete review (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  reviewController.deleteReview,
);

// Get all reviews (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  reviewController.getAllReviews,
);

// Verify review (admin only)
router.patch(
  '/:id/verify',
  authMiddleware,
  authorizeMiddleware(['admin']),
  reviewController.verifyReview,
);

module.exports = router;
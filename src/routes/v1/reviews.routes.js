const express = require('express');
const reviewController = require('../../controllers/review.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create review (patients only)
router.post('/', auth, authorize(['patient']), reviewController.createReview);

// Get review by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  reviewController.getReview
);

// Update review (patients who wrote it, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'patient']),
  reviewController.updateReview
);

// Delete review (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  reviewController.deleteReview
);

// Get all reviews (authd users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  reviewController.getAllReviews
);

// Verify review (admin only)
router.patch(
  '/:id/verify',
  auth,
  authorize(['admin']),
  reviewController.verifyReview
);

module.exports = router;

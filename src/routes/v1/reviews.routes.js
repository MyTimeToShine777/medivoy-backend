const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/review.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.post('/', authenticate, reviewController.createReview);
router.get('/:id', reviewController.getReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.get('/:reviewableType/:reviewableId', reviewController.getEntityReviews);
router.post('/:id/approve', authenticate, authorize(['admin']), reviewController.approveReview);
router.post('/:id/reject', authenticate, authorize(['admin']), reviewController.rejectReview);

module.exports = router;

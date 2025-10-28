const reviewService = require('../services/review.service');
const { successResponse } = require('../utils/response');

class ReviewController {
  async createReview(req, res, next) {
    try {
      const review = await reviewService.createReview(req.body);
      return successResponse(res, review, 'Review created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getReview(req, res, next) {
    try {
      const review = await reviewService.getReviewById(req.params.id);
      return successResponse(res, review, 'Review retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      const review = await reviewService.updateReview(req.params.id, req.body);
      return successResponse(res, review, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const result = await reviewService.deleteReview(req.params.id);
      return successResponse(res, result, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getEntityReviews(req, res, next) {
    try {
      const { reviewableType, reviewableId } = req.params;
      const { page, limit } = req.query;
      const result = await reviewService.getEntityReviews(reviewableType, reviewableId, { page, limit });
      return successResponse(res, result, 'Reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async approveReview(req, res, next) {
    try {
      const review = await reviewService.approveReview(req.params.id);
      return successResponse(res, review, 'Review approved successfully');
    } catch (error) {
      next(error);
    }
  }

  async rejectReview(req, res, next) {
    try {
      const { reason } = req.body;
      const review = await reviewService.rejectReview(req.params.id, reason);
      return successResponse(res, review, 'Review rejected successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();

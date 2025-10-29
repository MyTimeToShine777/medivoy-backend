const Review = require('../models/Review.model');
const logger = require('../utils/logger');

class ReviewService {
  /**
   * Create a new review
   */
  async createReview(data) {
    try {
      const review = await Review.create(data);
      return review;
    } catch (error) {
      logger.error('Create review service error:', error);
      throw error;
    }
  }

  /**
   * Get review by ID
   */
  async getReviewById(id) {
    try {
      const review = await Review.findByPk(id);
      return review;
    } catch (error) {
      logger.error('Get review by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update review
   */
  async updateReview(id, data) {
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        throw new Error('Review not found');
      }
      
      await review.update(data);
      return review;
    } catch (error) {
      logger.error('Update review service error:', error);
      throw error;
    }
  }

  /**
   * Delete review
   */
  async deleteReview(id) {
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        throw new Error('Review not found');
      }
      
      await review.destroy();
      return true;
    } catch (error) {
      logger.error('Delete review service error:', error);
      throw error;
    }
  }

  /**
   * Get all reviews
   */
  async getAllReviews(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      
      const reviews = await Review.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return reviews;
    } catch (error) {
      logger.error('Get all reviews service error:', error);
      throw error;
    }
  }

  /**
   * Verify review
   */
  async verifyReview(id) {
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        throw new Error('Review not found');
      }
      
      await review.update({ isVerified: true });
      return review;
    } catch (error) {
      logger.error('Verify review service error:', error);
      throw error;
    }
  }
}

module.exports = new ReviewService();
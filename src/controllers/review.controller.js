const Review = require('../models/Review.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class ReviewController {
  /**
   * Create a new review
   */
  async createReview(req, res) {
    try {
      const { bookingId, patientId, doctorId, hospitalId, rating, comment, isVerified } = req.body;
      
      // Create review
      const review = await Review.create({
        bookingId,
        patientId,
        doctorId,
        hospitalId,
        rating,
        comment,
        isVerified,
      });
      
      return successResponse(res, {
        message: 'Review created successfully',
        data: review,
      }, 201);
    } catch (error) {
      logger.error('Create review error:', error);
      return errorResponse(res, {
        message: 'Failed to create review',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get review by ID
   */
  async getReview(req, res) {
    try {
      const { id } = req.params;
      
      // Find review
      const review = await Review.findByPk(id);
      
      if (!review) {
        return errorResponse(res, {
          message: 'Review not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Review retrieved successfully',
        data: review,
      });
    } catch (error) {
      logger.error('Get review error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve review',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update review
   */
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      
      // Find review
      const review = await Review.findByPk(id);
      
      if (!review) {
        return errorResponse(res, {
          message: 'Review not found',
        }, 404);
      }
      
      // Update review
      await review.update({
        rating,
        comment,
      });
      
      return successResponse(res, {
        message: 'Review updated successfully',
        data: review,
      });
    } catch (error) {
      logger.error('Update review error:', error);
      return errorResponse(res, {
        message: 'Failed to update review',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete review
   */
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      
      // Find review
      const review = await Review.findByPk(id);
      
      if (!review) {
        return errorResponse(res, {
          message: 'Review not found',
        }, 404);
      }
      
      // Delete review
      await review.destroy();
      
      return successResponse(res, {
        message: 'Review deleted successfully',
      });
    } catch (error) {
      logger.error('Delete review error:', error);
      return errorResponse(res, {
        message: 'Failed to delete review',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all reviews
   */
  async getAllReviews(req, res) {
    try {
      const { page = 1, limit = 10, doctorId, hospitalId, minRating } = req.query;
      
      // Build where clause
      const where = {};
      if (doctorId) where.doctorId = doctorId;
      if (hospitalId) where.hospitalId = hospitalId;
      if (minRating) where.rating = { [Sequelize.Op.gte]: minRating };
      
      // Get reviews with pagination
      const reviews = await Review.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return successResponse(res, {
        message: 'Reviews retrieved successfully',
        data: reviews.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(reviews.count / parseInt(limit, 10)),
          totalRecords: reviews.count,
        },
      });
    } catch (error) {
      logger.error('Get all reviews error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve reviews',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get average rating for doctor/hospital
   */
  async getAverageRating(req, res) {
    try {
      const { doctorId, hospitalId } = req.query;
      
      // Build where clause
      const where = {};
      if (doctorId) where.doctorId = doctorId;
      if (hospitalId) where.hospitalId = hospitalId;
      
      // Calculate average rating
      const result = await Review.findOne({
        where,
        attributes: [
          [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalReviews'],
        ],
      });
      
      const averageRating = result.get('averageRating');
      const totalReviews = result.get('totalReviews');
      
      return successResponse(res, {
        message: 'Average rating calculated successfully',
        data: {
          averageRating: parseFloat(averageRating).toFixed(1),
          totalReviews: parseInt(totalReviews, 10),
        },
      });
    } catch (error) {
      logger.error('Get average rating error:', error);
      return errorResponse(res, {
        message: 'Failed to calculate average rating',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Verify review (admin only)
   */
  async verifyReview(req, res) {
    try {
      const { id } = req.params;

      // Find review
      const review = await Review.findByPk(id);

      if (!review) {
        return errorResponse(res, {
          message: 'Review not found',
          code: 'REVIEW_NOT_FOUND',
        }, 404);
      }

      // Update review verification status
      await review.update({ is_verified: true });

      return successResponse(res, {
        message: 'Review verified successfully',
        data: review,
      });
    } catch (error) {
      logger.error('Verify review error:', error);
      return errorResponse(res, {
        message: 'Failed to verify review',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get reviews by entity (doctor, hospital, treatment)
   */
  async getReviewsByEntity(req, res) {
    try {
      const { entityType, entityId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Build where clause based on entity type
      const where = {};
      if (entityType === 'doctor') where.doctor_id = entityId;
      else if (entityType === 'hospital') where.hospital_id = entityId;
      else if (entityType === 'treatment') where.treatment_id = entityId;
      else {
        return errorResponse(res, {
          message: 'Invalid entity type',
          code: 'INVALID_ENTITY_TYPE',
        }, 400);
      }

      // Get reviews with pagination
      const reviews = await Review.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['created_at', 'DESC']],
      });

      return successResponse(res, {
        message: 'Reviews retrieved successfully',
        data: reviews.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(reviews.count / parseInt(limit, 10)),
          totalRecords: reviews.count,
        },
      });
    } catch (error) {
      logger.error('Get reviews by entity error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve reviews',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new ReviewController();
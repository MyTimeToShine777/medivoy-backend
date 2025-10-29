const Review = require('../models/Review.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class ReviewController {
  /**
   * Create a new review
   */
  static async createReview(req, res) {
    try {
      const {
        bookingId, patientId, doctorId, hospitalId, rating, comment, isVerified,
      } = req.body;

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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get review by ID
   */
  static async getReview(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update review
   */
  static async updateReview(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete review
   */
  static async deleteReview(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all reviews
   */
  static async getAllReviews(req, res) {
    try {
      const {
        page = 1, limit = 10, doctorId, hospitalId, minRating,
      } = req.query;

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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get average rating for doctor/hospital
   */
  static async getAverageRating(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Verify review (admin only)
   */
  static async verifyReview(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get reviews by entity (doctor, hospital, treatment)
   */
  static async getReviewsByEntity(req, res) {
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
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = ReviewController;

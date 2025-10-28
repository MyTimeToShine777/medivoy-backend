const { Review, User, Hospital, Doctor } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class ReviewService {
  async createReview(reviewData) {
    try {
      const review = await Review.create(reviewData);
      
      // Update average rating for the reviewed entity
      await this.updateAverageRating(reviewData.reviewable_type, reviewData.reviewable_id);
      
      logger.info(`Review created: ${review.id}`);
      return review;
    } catch (error) {
      logger.error('Error creating review:', error);
      throw new AppError('Failed to create review', 500);
    }
  }

  async getReviewById(reviewId) {
    const review = await Review.findByPk(reviewId, {
      include: [{ model: User, as: 'user' }]
    });
    
    if (!review) {
      throw new AppError('Review not found', 404);
    }
    
    return review;
  }

  async updateReview(reviewId, updateData) {
    const review = await this.getReviewById(reviewId);
    await review.update(updateData);
    
    // Update average rating
    await this.updateAverageRating(review.reviewable_type, review.reviewable_id);
    
    logger.info(`Review updated: ${reviewId}`);
    return review;
  }

  async deleteReview(reviewId) {
    const review = await this.getReviewById(reviewId);
    const { reviewable_type, reviewable_id } = review;
    
    await review.destroy();
    
    // Update average rating
    await this.updateAverageRating(reviewable_type, reviewable_id);
    
    logger.info(`Review deleted: ${reviewId}`);
    return { message: 'Review deleted successfully' };
  }

  async getEntityReviews(reviewableType, reviewableId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: {
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
        is_approved: true
      },
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']]
    });

    return {
      reviews: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateAverageRating(reviewableType, reviewableId) {
    const reviews = await Review.findAll({
      where: {
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
        is_approved: true
      }
    });

    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update the entity's average rating
    let Model;
    if (reviewableType === 'Hospital') {
      Model = Hospital;
    } else if (reviewableType === 'Doctor') {
      Model = Doctor;
    }

    if (Model) {
      await Model.update(
        { average_rating: averageRating, total_reviews: reviews.length },
        { where: { id: reviewableId } }
      );
    }
  }

  async approveReview(reviewId) {
    const review = await this.getReviewById(reviewId);
    await review.update({ is_approved: true, approved_at: new Date() });
    
    // Update average rating
    await this.updateAverageRating(review.reviewable_type, review.reviewable_id);
    
    logger.info(`Review approved: ${reviewId}`);
    return review;
  }

  async rejectReview(reviewId, reason) {
    const review = await this.getReviewById(reviewId);
    await review.update({
      is_approved: false,
      rejection_reason: reason
    });
    logger.info(`Review rejected: ${reviewId}`);
    return review;
  }
}

module.exports = new ReviewService();

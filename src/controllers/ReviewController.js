'use strict';

import { ReviewService } from '../services/ReviewService.js';
import { AppError } from '../utils/errors/AppError.js';

export class ReviewController {
    constructor() {
        this.reviewService = new ReviewService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // BOOKING REVIEWS
    // ═══════════════════════════════════════════════════════════════════════════════

    async createBookingReview(req, res) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.bookingId;
            const reviewData = req.body;

            const result = await this.reviewService.createBookingReview(bookingId, userId, reviewData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Review created successfully',
                data: result.review
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBookingReviewsForHospital(req, res) {
        try {
            const hospitalId = req.params.hospitalId;
            const filters = {
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.reviewService.getBookingReviewsForHospital(hospitalId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.reviews,
                pagination: result.pagination,
                stats: result.stats
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async publishBookingReview(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const adminUserId = req.user.userId;
            const approvalData = req.body;

            const result = await this.reviewService.publishBookingReview(reviewId, adminUserId, approvalData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Review published',
                data: result.review
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async rejectBookingReview(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const adminUserId = req.user.userId;
            const reason = req.body.reason;

            const result = await this.reviewService.rejectBookingReview(reviewId, adminUserId, reason);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Review rejected'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateBookingReview(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.reviewService.updateBookingReview(reviewId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Review updated',
                data: result.review
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteBookingReview(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const userId = req.user.userId;

            const result = await this.reviewService.deleteBookingReview(reviewId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Review deleted'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MEDICAL REVIEWS
    // ═══════════════════════════════════════════════════════════════════════════════

    async createMedicalReview(req, res) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.bookingId;
            const reviewData = req.body;

            const result = await this.reviewService.createMedicalReview(bookingId, userId, reviewData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Medical review created',
                data: result.review
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getMedicalReviewsForDoctor(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const filters = {
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.reviewService.getMedicalReviewsForDoctor(doctorId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.reviews,
                pagination: result.pagination,
                stats: result.stats
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async publishMedicalReview(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const adminUserId = req.user.userId;
            const approvalData = req.body;

            const result = await this.reviewService.publishMedicalReview(reviewId, adminUserId, approvalData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Medical review published',
                data: result.review
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // COMMON REVIEW ENDPOINTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async markReviewHelpful(req, res) {
        try {
            const reviewId = req.params.reviewId;

            const result = await this.reviewService.markReviewHelpful(reviewId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Marked as helpful',
                helpfulCount: result.helpfulCount
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getReviewStatistics(req, res) {
        try {
            const hospitalId = req.query.hospitalId;
            const doctorId = req.query.doctorId;

            const result = await this.reviewService.getReviewStatistics(hospitalId, doctorId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.stats
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async flagReviewForModeration(req, res) {
        try {
            const reviewId = req.params.reviewId;
            const reason = req.body.reason;

            const result = await this.reviewService.flagReviewForModeration(reviewId, reason);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Review flagged for moderation'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new ReviewController();
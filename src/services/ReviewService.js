import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import notificationService from './NotificationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

// CONSOLIDATED: BookingReviewService + MedicalReviewService + ReviewService
export class ReviewService {
    constructor() {
        this.validationService = validationService;
        this.notificationService = notificationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // BOOKING REVIEW METHODS (from BookingReviewService)
    // ═══════════════════════════════════════════════════════════════════════════════

    async createBookingReview(bookingId, userId, reviewData) {
        return await prisma.$transaction(async(tx) => {
            if (!bookingId || !userId || !reviewData) {
                throw new AppError('Required parameters missing', 400);
            }

            const booking = await tx.booking.findUnique({ where: { bookingId } });
            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                throw new AppError('Cannot review other\'s booking', 403);
            }

            if (booking.status !== 'completed') {
                throw new AppError('Only completed bookings can be reviewed', 400);
            }

            const existing = await tx.review.findFirst({
                where: { bookingId: bookingId, reviewType: 'booking' }
            });

            if (existing) {
                throw new AppError('Already reviewed', 409);
            }

            const errors = this.validationService.validateReviewData(reviewData);
            if (errors.length) {
                throw new AppError(errors.join(', '), 400);
            }

            const review = await tx.review.create({
                data: {
                    reviewId: this._generateReviewId(),
                    bookingId: bookingId,
                    userId: userId,
                    hospitalId: booking.hospitalId,
                    reviewType: 'booking',
                    rating: reviewData.rating,
                    title: reviewData.title,
                    content: reviewData.content,
                    aspects: {
                        communication: reviewData.communication,
                        facilities: reviewData.facilities,
                        costValue: reviewData.costValue
                    },
                    isPublished: false,
                    helpfulCount: 0,
                    reviewedAt: new Date()
                }
            });

            await tx.reviewApproval.create({
                data: {
                    approvalId: this._generateApprovalId(),
                    reviewId: review.reviewId,
                    status: 'pending'
                }
            });

            await this.auditLogService.logAction({
                action: 'BOOKING_REVIEW_CREATED',
                entityType: 'Review',
                entityId: review.reviewId,
                userId: userId,
                details: {}
            }, tx);

            return { success: true, message: 'Review created', review: review };
        });
    }

    async getBookingReviewsForHospital(hospitalId, filters) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { hospitalId: hospitalId, reviewType: 'booking', isPublished: true };

            const reviews = await prisma.reviews.findMany({
                where: where,
                include: {
                    users: {
                        select: { firstName: true, lastName: true }
                    },
                    booking: true
                },
                orderBy: {
                    reviewedAt: 'desc'
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.reviews.count({ where: where });
            const avgRating = await this._calculateAverageRating(hospitalId, 'booking');

            return {
                success: true,
                reviews: reviews,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit },
                stats: { avgRating: avgRating, totalReviews: total }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async publishBookingReview(reviewId, adminUserId, approvalData) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !adminUserId) throw new AppError('IDs required', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            if (review.reviewType !== 'booking') {
                throw new AppError('Not a booking review', 400);
            }

            const updatedReview = await tx.review.update({
                where: { reviewId },
                data: {
                    isPublished: true,
                    publishedAt: new Date()
                }
            });

            const approval = await tx.reviewApproval.findFirst({ where: { reviewId: reviewId } });
            if (approval) {
                await tx.reviewApproval.update({
                    where: { approvalId: approval.approvalId },
                    data: {
                        status: 'approved',
                        approvedBy: adminUserId,
                        approvedAt: new Date()
                    }
                });
            }

            await this.auditLogService.logAction({
                action: 'BOOKING_REVIEW_PUBLISHED',
                entityType: 'Review',
                entityId: reviewId,
                userId: adminUserId,
                details: {}
            }, tx);

            return { success: true, message: 'Published', review: updatedReview };
        });
    }

    async rejectBookingReview(reviewId, adminUserId, reason) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !adminUserId || !reason) {
                throw new AppError('Required params missing', 400);
            }

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            const approval = await tx.reviewApproval.findFirst({ where: { reviewId: reviewId } });
            if (approval) {
                await tx.reviewApproval.update({
                    where: { approvalId: approval.approvalId },
                    data: {
                        status: 'rejected',
                        rejectedBy: adminUserId,
                        rejectionReason: reason
                    }
                });
            }

            await tx.review.delete({ where: { reviewId } });

            await this.notificationService.sendNotification(review.userId, 'REVIEW_REJECTED', { reason: reason });

            await this.auditLogService.logAction({
                action: 'BOOKING_REVIEW_REJECTED',
                entityType: 'Review',
                entityId: reviewId,
                userId: adminUserId,
                details: { reason: reason }
            }, tx);

            return { success: true, message: 'Rejected' };
        });
    }

    async updateBookingReview(reviewId, userId, updateData) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !userId) throw new AppError('IDs required', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            if (review.userId !== userId) {
                throw new AppError('Unauthorized', 403);
            }

            if (review.isPublished) {
                throw new AppError('Cannot update published review', 400);
            }

            const updateFields = {};
            if (updateData.rating) updateFields.rating = updateData.rating;
            if (updateData.title) updateFields.title = updateData.title;
            if (updateData.content) updateFields.content = updateData.content;

            const updatedReview = await tx.review.update({
                where: { reviewId },
                data: updateFields
            });

            await this.auditLogService.logAction({
                action: 'BOOKING_REVIEW_UPDATED',
                entityType: 'Review',
                entityId: reviewId,
                userId: userId,
                details: {}
            }, tx);

            return { success: true, message: 'Updated', review: updatedReview };
        });
    }

    async deleteBookingReview(reviewId, userId) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !userId) throw new AppError('IDs required', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            if (review.userId !== userId) {
                throw new AppError('Unauthorized', 403);
            }

            await tx.review.delete({ where: { reviewId } });

            await this.auditLogService.logAction({
                action: 'BOOKING_REVIEW_DELETED',
                entityType: 'Review',
                entityId: reviewId,
                userId: userId,
                details: {}
            }, tx);

            return { success: true, message: 'Deleted' };
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MEDICAL REVIEW METHODS (from MedicalReviewService - MERGED)
    // ═══════════════════════════════════════════════════════════════════════════════

    async createMedicalReview(bookingId, userId, reviewData) {
        return await prisma.$transaction(async(tx) => {
            if (!bookingId || !userId || !reviewData) {
                throw new AppError('Required parameters missing', 400);
            }

            const booking = await tx.booking.findUnique({ where: { bookingId } });
            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                throw new AppError('Cannot review other\'s booking', 403);
            }

            const existing = await tx.review.findFirst({
                where: { bookingId: bookingId, reviewType: 'medical' }
            });

            if (existing) {
                throw new AppError('Medical review already exists', 409);
            }

            const errors = this.validationService.validateMedicalReviewData(reviewData);
            if (errors.length) {
                throw new AppError(errors.join(', '), 400);
            }

            const review = await tx.review.create({
                data: {
                    reviewId: this._generateReviewId(),
                    bookingId: bookingId,
                    userId: userId,
                    doctorId: reviewData.doctorId || null,
                    hospitalId: booking.hospitalId,
                    reviewType: 'medical',
                    rating: reviewData.rating,
                    title: reviewData.title,
                    content: reviewData.content,
                    aspects: {
                        doctorProfessionalism: reviewData.doctorProfessionalism,
                        treatmentEffectiveness: reviewData.treatmentEffectiveness,
                        hospitalHygiene: reviewData.hospitalHygiene,
                        careQuality: reviewData.careQuality
                    },
                    isPublished: false,
                    helpfulCount: 0,
                    reviewedAt: new Date()
                }
            });

            await tx.reviewApproval.create({
                data: {
                    approvalId: this._generateApprovalId(),
                    reviewId: review.reviewId,
                    status: 'pending'
                }
            });

            await this.auditLogService.logAction({
                action: 'MEDICAL_REVIEW_CREATED',
                entityType: 'Review',
                entityId: review.reviewId,
                userId: userId,
                details: {}
            }, tx);

            return { success: true, message: 'Medical review created', review: review };
        });
    }

    async getMedicalReviewsForDoctor(doctorId, filters) {
        try {
            if (!doctorId) throw new AppError('Doctor ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { doctorId: doctorId, reviewType: 'medical', isPublished: true };

            const reviews = await prisma.reviews.findMany({
                where: where,
                include: {
                    users: {
                        select: { firstName: true, lastName: true }
                    },
                    doctor: true
                },
                orderBy: {
                    reviewedAt: 'desc'
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.reviews.count({ where: where });
            const avgRating = await this._calculateAverageRating(null, 'medical', doctorId);

            return {
                success: true,
                reviews: reviews,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit },
                stats: { avgRating: avgRating, totalReviews: total }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async publishMedicalReview(reviewId, adminUserId, approvalData) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !adminUserId) throw new AppError('IDs required', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            if (review.reviewType !== 'medical') {
                throw new AppError('Not a medical review', 400);
            }

            const updatedReview = await tx.review.update({
                where: { reviewId },
                data: {
                    isPublished: true,
                    publishedAt: new Date()
                }
            });

            const approval = await tx.reviewApproval.findFirst({ where: { reviewId: reviewId } });
            if (approval) {
                await tx.reviewApproval.update({
                    where: { approvalId: approval.approvalId },
                    data: {
                        status: 'approved',
                        approvedBy: adminUserId,
                        approvedAt: new Date()
                    }
                });
            }

            await this.auditLogService.logAction({
                action: 'MEDICAL_REVIEW_PUBLISHED',
                entityType: 'Review',
                entityId: reviewId,
                userId: adminUserId,
                details: {}
            }, tx);

            return { success: true, message: 'Published', review: updatedReview };
        });
    }

    async rejectMedicalReview(reviewId, adminUserId, reason) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !adminUserId || !reason) {
                throw new AppError('Required params missing', 400);
            }

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            const approval = await tx.reviewApproval.findFirst({ where: { reviewId: reviewId } });
            if (approval) {
                await tx.reviewApproval.update({
                    where: { approvalId: approval.approvalId },
                    data: {
                        status: 'rejected',
                        rejectedBy: adminUserId,
                        rejectionReason: reason
                    }
                });
            }

            await tx.review.delete({ where: { reviewId } });

            await this.notificationService.sendNotification(review.userId, 'MEDICAL_REVIEW_REJECTED', { reason: reason });

            await this.auditLogService.logAction({
                action: 'MEDICAL_REVIEW_REJECTED',
                entityType: 'Review',
                entityId: reviewId,
                userId: adminUserId,
                details: { reason: reason }
            }, tx);

            return { success: true, message: 'Rejected' };
        });
    }

    async updateMedicalReview(reviewId, userId, updateData) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !userId) throw new AppError('IDs required', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            if (review.userId !== userId) {
                throw new AppError('Unauthorized', 403);
            }

            if (review.isPublished) {
                throw new AppError('Cannot update published review', 400);
            }

            const updateFields = {};
            if (updateData.rating) updateFields.rating = updateData.rating;
            if (updateData.title) updateFields.title = updateData.title;
            if (updateData.content) updateFields.content = updateData.content;

            const updatedReview = await tx.review.update({
                where: { reviewId },
                data: updateFields
            });

            await this.auditLogService.logAction({
                action: 'MEDICAL_REVIEW_UPDATED',
                entityType: 'Review',
                entityId: reviewId,
                userId: userId,
                details: {}
            }, tx);

            return { success: true, message: 'Updated', review: updatedReview };
        });
    }

    async deleteMedicalReview(reviewId, userId) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !userId) throw new AppError('IDs required', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            if (review.userId !== userId) {
                throw new AppError('Unauthorized', 403);
            }

            await tx.review.delete({ where: { reviewId } });

            await this.auditLogService.logAction({
                action: 'MEDICAL_REVIEW_DELETED',
                entityType: 'Review',
                entityId: reviewId,
                userId: userId,
                details: {}
            }, tx);

            return { success: true, message: 'Deleted' };
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // COMMON REVIEW METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    async markReviewHelpful(reviewId) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId) throw new AppError('Review ID required', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            const updatedReview = await tx.review.update({
                where: { reviewId },
                data: {
                    helpfulCount: (review.helpfulCount || 0) + 1
                }
            });

            return { success: true, helpfulCount: updatedReview.helpfulCount };
        });
    }

    async getReviewStatistics(hospitalId, doctorId) {
        try {
            const where = { isPublished: true };
            if (hospitalId) where.hospitalId = hospitalId;
            if (doctorId) where.doctorId = doctorId;

            const total = await prisma.reviews.count({ where: where });
            const avgRating = await this._calculateAverageRating(hospitalId, null, doctorId);

            return {
                success: true,
                stats: {
                    totalReviews: total,
                    avgRating: avgRating,
                    distribution: {}
                }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async flagReviewForModeration(reviewId, reason) {
        return await prisma.$transaction(async(tx) => {
            if (!reviewId || !reason) throw new AppError('Required params missing', 400);

            const review = await tx.review.findUnique({ where: { reviewId } });
            if (!review) {
                throw new AppError('Review not found', 404);
            }

            await tx.review.update({
                where: { reviewId },
                data: {
                    isFlaggedForModeration: true,
                    moderationReason: reason,
                    flaggedAt: new Date()
                }
            });

            await this.auditLogService.logAction({
                action: 'REVIEW_FLAGGED',
                entityType: 'Review',
                entityId: reviewId,
                userId: 'SYSTEM',
                details: { reason: reason }
            }, tx);

            return { success: true, message: 'Flagged' };
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateReviewId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'REV-' + ts + rnd;
    }

    _generateApprovalId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'APP-' + ts + rnd;
    }

    async _calculateAverageRating(hospitalId, reviewType, doctorId) {
        try {
            const where = { isPublished: true };
            if (hospitalId) where.hospitalId = hospitalId;
            if (reviewType) where.reviewType = reviewType;
            if (doctorId) where.doctorId = doctorId;

            const result = await prisma.reviews.aggregate({
                where: where,
                _avg: {
                    rating: true
                }
            });

            return result._avg.rating ? parseFloat(result._avg.rating).toFixed(2) : 0;
        } catch (error) {
            return 0;
        }
    }
}

export default new ReviewService();
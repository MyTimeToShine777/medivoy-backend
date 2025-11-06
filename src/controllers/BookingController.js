// Booking Controller - Complete Booking Management - NO optional chaining
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import BookingService from '../services/BookingService.js';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../utils/logger.js';

class BookingController {
    // Create booking
    createBooking = asyncHandler(async(req, res) => {
        try {
            const patientId = req.user.userId;
            const bookingData = req.body;

            if (!patientId) {
                return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
            }

            const result = await BookingService.createBooking(patientId, bookingData);

            logger.info(`Booking created: ${result.bookingReference}`);
            return sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.BOOKING_CREATED, result);
        } catch (error) {
            logger.error('Create booking error:', error.message);
            throw error;
        }
    });

    // Get booking details
    getBookingDetails = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            const result = await BookingService.getBookingDetails(parseInt(bookingId));

            return sendSuccess(res, HTTP_STATUS.OK, 'Booking details retrieved', result);
        } catch (error) {
            logger.error('Get booking details error:', error.message);
            throw error;
        }
    });

    // Get pending bookings for dashboard
    getPendingBookings = asyncHandler(async(req, res) => {
        try {
            const { page, limit } = req.query;

            const result = await BookingService.getPendingBookingsForDashboard(page, limit);

            return sendPaginatedSuccess(
                res,
                HTTP_STATUS.OK,
                'Pending bookings retrieved',
                result.data,
                result.pagination
            );
        } catch (error) {
            logger.error('Get pending bookings error:', error.message);
            throw error;
        }
    });

    // Update booking status
    updateBookingStatus = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;
            const { bookingStatus } = req.body;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            if (!bookingStatus) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking status is required');
            }

            const result = await BookingService.updateBookingStatus(
                parseInt(bookingId),
                bookingStatus
            );

            logger.info(`Booking ${bookingId} status updated to ${bookingStatus}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Booking status updated', result);
        } catch (error) {
            logger.error('Update booking status error:', error.message);
            throw error;
        }
    });

    // Review booking
    reviewBooking = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;
            const staffId = req.user.userId;
            const reviewData = req.body;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            if (!staffId) {
                return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Staff ID not found');
            }

            const result = await BookingService.reviewBooking(
                parseInt(bookingId),
                staffId,
                reviewData
            );

            logger.info(`Booking ${bookingId} reviewed by staff ${staffId}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Booking reviewed successfully', result);
        } catch (error) {
            logger.error('Review booking error:', error.message);
            throw error;
        }
    });

    // Upload insurance document
    uploadInsuranceDocument = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            if (!req.file) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'File is required');
            }

            const insuranceData = {
                insuranceProviderName: req.body.insuranceProviderName || '',
                policyNumber: req.body.policyNumber || '',
                groupNumber: req.body.groupNumber || null,
                memberId: req.body.memberId || null,
                coverageType: req.body.coverageType || 'partial',
                coverageAmount: req.body.coverageAmount || null,
                deductible: req.body.deductible || null,
                coInsurancePercentage: req.body.coInsurancePercentage || null,
                validFrom: req.body.validFrom || null,
                validTo: req.body.validTo || null,
            };

            const result = await BookingService.uploadInsuranceDocument(
                parseInt(bookingId),
                req.file.buffer,
                req.file.originalname,
                insuranceData
            );

            logger.info(`Insurance document uploaded for booking ${bookingId}`);
            return sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.DOCUMENT_UPLOADED, result);
        } catch (error) {
            logger.error('Upload insurance document error:', error.message);
            throw error;
        }
    });

    // Upload medical document
    uploadMedicalDocument = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            if (!req.file) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'File is required');
            }

            const medicalData = {
                documentType: req.body.documentType || 'other',
                documentTitle: req.body.documentTitle || '',
                description: req.body.description || null,
                dateOfDocument: req.body.dateOfDocument || null,
                hospitalName: req.body.hospitalName || null,
                doctorName: req.body.doctorName || null,
                specialty: req.body.specialty || null,
            };

            const result = await BookingService.uploadMedicalDocument(
                parseInt(bookingId),
                req.file.buffer,
                req.file.originalname,
                medicalData
            );

            logger.info(`Medical document uploaded for booking ${bookingId}`);
            return sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.DOCUMENT_UPLOADED, result);
        } catch (error) {
            logger.error('Upload medical document error:', error.message);
            throw error;
        }
    });

    // Get booking documents
    getBookingDocuments = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            const result = await BookingService.getBookingDocuments(parseInt(bookingId));

            return sendSuccess(res, HTTP_STATUS.OK, 'Documents retrieved', result);
        } catch (error) {
            logger.error('Get booking documents error:', error.message);
            throw error;
        }
    });

    // Cancel booking
    cancelBooking = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;
            const { reason } = req.body;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            const result = await BookingService.cancelBooking(parseInt(bookingId), reason);

            logger.info(`Booking ${bookingId} cancelled`);
            return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.BOOKING_CANCELLED, result);
        } catch (error) {
            logger.error('Cancel booking error:', error.message);
            throw error;
        }
    });
}

export default new BookingController();
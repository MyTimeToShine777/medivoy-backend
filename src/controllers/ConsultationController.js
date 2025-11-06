// Consultation Controller - Video Calls with Google Meet - NO optional chaining
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import ConsultationService from '../services/ConsultationService.js';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import logger from '../utils/logger.js';

class ConsultationController {
    // Schedule consultation
    scheduleConsultation = asyncHandler(async(req, res) => {
        try {
            const { bookingId, doctorId, consultationDate, type } = req.body;

            if (!bookingId || !doctorId || !consultationDate || !type) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'All consultation details are required');
            }

            const result = await ConsultationService.scheduleConsultation(
                bookingId,
                doctorId,
                consultationDate,
                type
            );

            logger.info(`Consultation scheduled: ${result.consultationId}`);
            return sendSuccess(res, HTTP_STATUS.CREATED, 'Consultation scheduled successfully', result);
        } catch (error) {
            logger.error('Schedule consultation error:', error.message);
            throw error;
        }
    });

    // Get meeting link
    getMeetingLink = asyncHandler(async(req, res) => {
        try {
            const { consultationId } = req.params;

            if (!consultationId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Consultation ID is required');
            }

            const result = await ConsultationService.getMeetingLink(parseInt(consultationId));

            logger.info(`Retrieved meeting link for consultation ${consultationId}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Meeting link retrieved', result);
        } catch (error) {
            logger.error('Get meeting link error:', error.message);
            throw error;
        }
    });

    // Start consultation
    startConsultation = asyncHandler(async(req, res) => {
        try {
            const { consultationId } = req.params;

            if (!consultationId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Consultation ID is required');
            }

            const result = await ConsultationService.startConsultation(parseInt(consultationId));

            logger.info(`Consultation started: ${consultationId}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Consultation started', result);
        } catch (error) {
            logger.error('Start consultation error:', error.message);
            throw error;
        }
    });

    // End consultation and save notes/prescription
    endConsultation = asyncHandler(async(req, res) => {
        try {
            const { consultationId } = req.params;
            const { notes, prescription } = req.body;

            if (!consultationId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Consultation ID is required');
            }

            const result = await ConsultationService.endConsultation(
                parseInt(consultationId),
                notes,
                prescription
            );

            logger.info(`Consultation ended: ${consultationId}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Consultation ended successfully', result);
        } catch (error) {
            logger.error('End consultation error:', error.message);
            throw error;
        }
    });

    // Get upcoming consultations for user
    getUpcomingConsultations = asyncHandler(async(req, res) => {
        try {
            const userId = req.user.userId;
            const { page, limit } = req.query;

            if (!userId) {
                return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
            }

            const result = await ConsultationService.getUpcomingConsultations(userId, page, limit);

            logger.info(`Retrieved ${result.data.length} upcoming consultations for user ${userId}`);
            return sendPaginatedSuccess(
                res,
                HTTP_STATUS.OK,
                'Upcoming consultations retrieved',
                result.data,
                result.pagination
            );
        } catch (error) {
            logger.error('Get upcoming consultations error:', error.message);
            throw error;
        }
    });

    // Cancel consultation
    cancelConsultation = asyncHandler(async(req, res) => {
        try {
            const { consultationId } = req.params;
            const { reason } = req.body;

            if (!consultationId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Consultation ID is required');
            }

            const result = await ConsultationService.cancelConsultation(
                parseInt(consultationId),
                reason
            );

            logger.info(`Consultation cancelled: ${consultationId}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Consultation cancelled successfully', result);
        } catch (error) {
            logger.error('Cancel consultation error:', error.message);
            throw error;
        }
    });
}

export default new ConsultationController();
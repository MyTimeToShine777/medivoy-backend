// Consultation Service - Video Calls with Google Meet - NO optional chaining
import { sequelize } from '../config/database.js';
import logger from '../utils/logger.js';
import helpers from '../utils/helpers.js';
import validators from '../utils/validators.js';
import {
    ValidationError,
    NotFoundError,
} from '../exceptions/index.js';

class ConsultationService {
    // Schedule consultation
    async scheduleConsultation(bookingId, doctorId, consultationDate, type) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            if (!validators.isValidInteger(doctorId)) {
                throw new ValidationError('Valid doctor ID is required');
            }

            if (!validators.isValidDate(consultationDate)) {
                throw new ValidationError('Valid consultation date is required');
            }

            if (!type || !['video', 'audio', 'text', 'in_person'].includes(type)) {
                throw new ValidationError('Valid consultation type is required');
            }

            // Verify booking exists
            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            // Generate unique Google Meet link
            const randomCode = helpers.generateRandomString(21).toLowerCase();
            const meetingLink = `https://meet.google.com/${randomCode}`;

            // Create consultation
            const Consultation = sequelize.models.Consultation;
            const consultation = await Consultation.create({
                bookingId: bookingId,
                patientId: booking.patientId,
                doctorId: doctorId,
                consultationType: type,
                consultationDate: new Date(consultationDate),
                status: 'scheduled',
                meetingLink: meetingLink,
            });

            logger.info(`Consultation scheduled: ${consultation.id}`);

            return {
                consultationId: consultation.id,
                bookingId: booking.id,
                doctorId: doctorId,
                date: consultation.consultationDate,
                type: consultation.consultationType,
                meetingLink: meetingLink,
                status: consultation.status,
            };
        } catch (error) {
            logger.error('Consultation scheduling failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Get meeting link
    async getMeetingLink(consultationId) {
        try {
            if (!validators.isValidInteger(consultationId)) {
                throw new ValidationError('Valid consultation ID is required');
            }

            const Consultation = sequelize.models.Consultation;
            const consultation = await Consultation.findByPk(consultationId);
            if (!consultation) {
                throw new NotFoundError('Consultation not found');
            }

            if (!consultation.meetingLink) {
                throw new NotFoundError('Meeting link not available');
            }

            logger.info(`Retrieved meeting link for consultation ${consultationId}`);

            return {
                consultationId: consultation.id,
                meetingLink: consultation.meetingLink,
                type: consultation.consultationType,
            };
        } catch (error) {
            logger.error('Failed to get meeting link');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Start consultation
    async startConsultation(consultationId) {
        try {
            if (!validators.isValidInteger(consultationId)) {
                throw new ValidationError('Valid consultation ID is required');
            }

            const Consultation = sequelize.models.Consultation;
            const consultation = await Consultation.findByPk(consultationId);
            if (!consultation) {
                throw new NotFoundError('Consultation not found');
            }

            if (consultation.status !== 'scheduled') {
                throw new ValidationError('Consultation is not in scheduled status');
            }

            consultation.status = 'ongoing';
            consultation.startedAt = new Date();
            await consultation.save();

            logger.info(`Consultation started: ${consultationId}`);

            return {
                consultationId: consultation.id,
                status: consultation.status,
                meetingLink: consultation.meetingLink,
                startedAt: consultation.startedAt,
            };
        } catch (error) {
            logger.error('Consultation start failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // End consultation and save notes
    async endConsultation(consultationId, notes, prescription) {
        try {
            if (!validators.isValidInteger(consultationId)) {
                throw new ValidationError('Valid consultation ID is required');
            }

            const Consultation = sequelize.models.Consultation;
            const consultation = await Consultation.findByPk(consultationId);
            if (!consultation) {
                throw new NotFoundError('Consultation not found');
            }

            if (consultation.status !== 'ongoing') {
                throw new ValidationError('Consultation is not ongoing');
            }

            const endTime = new Date();
            const duration = Math.round((endTime - consultation.startedAt) / 60000); // minutes

            consultation.status = 'completed';
            consultation.endedAt = endTime;
            consultation.duration = duration;
            if (notes) consultation.notes = notes;
            if (prescription) consultation.prescription = prescription;
            await consultation.save();

            logger.info(`Consultation ended: ${consultationId}`);

            return {
                consultationId: consultation.id,
                status: consultation.status,
                duration: duration,
                endedAt: consultation.endedAt,
            };
        } catch (error) {
            logger.error('Consultation end failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Get upcoming consultations
    async getUpcomingConsultations(userId, page, limit) {
        try {
            if (!validators.isValidInteger(userId)) {
                throw new ValidationError('Valid user ID is required');
            }

            const pageNum = helpers.toInt(page, 1);
            const limitNum = helpers.toInt(limit, 10);
            const offset = (pageNum - 1) * limitNum;

            const Consultation = sequelize.models.Consultation;
            const Op = sequelize.Sequelize.Op;

            const { count, rows } = await Consultation.findAndCountAll({
                where: {
                    consultationDate: {
                        [Op.gte]: new Date(),
                    },
                    [Op.or]: [
                        { doctorId: userId },
                        { patientId: userId },
                    ],
                },
                offset: offset,
                limit: limitNum,
                order: [
                    ['consultationDate', 'ASC']
                ],
            });

            const pagination = helpers.calculatePagination(pageNum, limitNum, count);

            logger.info(`Retrieved ${rows.length} upcoming consultations for user ${userId}`);

            return {
                data: rows,
                pagination: pagination,
            };
        } catch (error) {
            logger.error('Failed to get upcoming consultations');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Cancel consultation
    async cancelConsultation(consultationId, reason) {
        try {
            if (!validators.isValidInteger(consultationId)) {
                throw new ValidationError('Valid consultation ID is required');
            }

            const Consultation = sequelize.models.Consultation;
            const consultation = await Consultation.findByPk(consultationId);
            if (!consultation) {
                throw new NotFoundError('Consultation not found');
            }

            if (!['scheduled', 'ongoing'].includes(consultation.status)) {
                throw new ValidationError('Cannot cancel completed or cancelled consultation');
            }

            consultation.status = 'cancelled';
            if (reason) consultation.notes = reason;
            await consultation.save();

            logger.info(`Consultation cancelled: ${consultationId}`);

            return {
                consultationId: consultation.id,
                status: consultation.status,
            };
        } catch (error) {
            logger.error('Consultation cancellation failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }
}

export default new ConsultationService();
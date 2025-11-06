// Booking Service - Complete Booking Management - NO optional chaining
import { sequelize } from '../config/database.js';
import logger from '../utils/logger.js';
import helpers from '../utils/helpers.js';
import validators from '../utils/validators.js';
import fileUploadUtil from '../utils/fileUpload.js';
import {
    ValidationError,
    NotFoundError,
    ConflictError,
    DatabaseError,
} from '../exceptions/index.js';
import { BOOKING_STATUSES } from '../constants/bookingStatuses.js';

class BookingService {
    // Create booking with preferences
    async createBooking(patientId, bookingData) {
        try {
            if (!patientId || typeof patientId !== 'number') {
                throw new ValidationError('Valid patient ID is required');
            }

            if (!bookingData || typeof bookingData !== 'object') {
                throw new ValidationError('Booking data is required');
            }

            // Validate required fields
            const requiredFields = ['countryId', 'hospitalId', 'packageTypeId'];
            if (!validators.hasRequiredFields(bookingData, requiredFields)) {
                throw new ValidationError('Missing required fields: countryId, hospitalId, packageTypeId');
            }

            // Validate IDs
            if (!validators.isValidInteger(bookingData.countryId)) {
                throw new ValidationError('Valid country ID is required');
            }

            if (!validators.isValidInteger(bookingData.hospitalId)) {
                throw new ValidationError('Valid hospital ID is required');
            }

            if (!validators.isValidInteger(bookingData.packageTypeId)) {
                throw new ValidationError('Valid package type ID is required');
            }

            // Check country exists
            const Country = sequelize.models.Country;
            const country = await Country.findByPk(bookingData.countryId);
            if (!country) {
                throw new NotFoundError('Country not found');
            }

            // Check hospital exists
            const Hospital = sequelize.models.Hospital;
            const hospital = await Hospital.findByPk(bookingData.hospitalId);
            if (!hospital) {
                throw new NotFoundError('Hospital not found');
            }

            // Generate booking reference
            const bookingReference = helpers.generateBookingReference();

            // Create booking
            const Booking = sequelize.models.Booking;
            const booking = await Booking.create({
                patientId: patientId,
                countryId: bookingData.countryId,
                hospitalId: bookingData.hospitalId,
                doctorId: bookingData.doctorId || null,
                treatmentId: bookingData.treatmentId || null,
                packageTypeId: bookingData.packageTypeId,
                packageTierId: bookingData.packageTierId || null,
                bookingReference: bookingReference,
                bookingStatus: BOOKING_STATUSES.INQUIRY,
                preferences: bookingData.preferences || {},
                totalCost: bookingData.totalCost || null,
                currency: bookingData.currency || 'INR',
                notes: bookingData.notes || null,
            });

            // Create booking preferences
            const BookingPreferences = sequelize.models.BookingPreferences;
            if (bookingData.preferences) {
                await BookingPreferences.create({
                    bookingId: booking.id,
                    ...bookingData.preferences,
                });
            }

            logger.info(`Booking created: ${bookingReference} for patient ${patientId}`);

            return {
                id: booking.id,
                bookingReference: booking.bookingReference,
                status: booking.bookingStatus,
                createdAt: booking.createdAt,
            };
        } catch (error) {
            logger.error('Booking creation failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Get booking details
    async getBookingDetails(bookingId) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId, {
                include: [
                    { model: sequelize.models.Country, as: 'country' },
                    { model: sequelize.models.Hospital, as: 'hospital' },
                    { model: sequelize.models.BookingPreferences, as: 'preferences' },
                ],
            });

            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            return booking;
        } catch (error) {
            logger.error('Failed to get booking details');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Get bookings for dashboard
    async getPendingBookingsForDashboard(page, limit) {
        try {
            const pageNum = helpers.toInt(page, 1);
            const limitNum = helpers.toInt(limit, 10);
            const offset = (pageNum - 1) * limitNum;

            const Booking = sequelize.models.Booking;
            const { count, rows } = await Booking.findAndCountAll({
                where: {
                    bookingStatus: [
                        BOOKING_STATUSES.INQUIRY,
                        BOOKING_STATUSES.UNDER_REVIEW,
                        BOOKING_STATUSES.AWAITING_DOCUMENTS,
                    ],
                },
                include: [{
                        model: sequelize.models.User,
                        as: 'patient',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
                    },
                    { model: sequelize.models.Country, as: 'country' },
                    { model: sequelize.models.Hospital, as: 'hospital' },
                ],
                offset: offset,
                limit: limitNum,
                order: [
                    ['createdAt', 'DESC']
                ],
            });

            const pagination = helpers.calculatePagination(pageNum, limitNum, count);

            logger.info(`Retrieved ${rows.length} pending bookings`);

            return {
                data: rows,
                pagination: pagination,
            };
        } catch (error) {
            logger.error('Failed to get pending bookings');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId, newStatus) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            if (!newStatus || typeof newStatus !== 'string') {
                throw new ValidationError('New status is required');
            }

            // Validate status
            if (!validators.isValidEnum(newStatus, Object.values(BOOKING_STATUSES))) {
                throw new ValidationError('Invalid booking status');
            }

            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            // Update status
            booking.bookingStatus = newStatus;
            await booking.save();

            logger.info(`Booking ${bookingId} status updated to ${newStatus}`);

            return {
                id: booking.id,
                bookingReference: booking.bookingReference,
                status: booking.bookingStatus,
                updatedAt: booking.updatedAt,
            };
        } catch (error) {
            logger.error('Failed to update booking status');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Review booking
    async reviewBooking(bookingId, staffId, reviewData) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            if (!validators.isValidInteger(staffId)) {
                throw new ValidationError('Valid staff ID is required');
            }

            if (!reviewData || typeof reviewData !== 'object') {
                throw new ValidationError('Review data is required');
            }

            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            const BookingReview = sequelize.models.BookingReview;
            const review = await BookingReview.create({
                bookingId: bookingId,
                reviewedByStaffId: staffId,
                isApproved: reviewData.isApproved || false,
                reviewStatus: reviewData.reviewStatus || 'pending',
                reviewNotes: reviewData.reviewNotes || null,
                isValidBooking: reviewData.isValidBooking !== false,
                reasonsForRejection: reviewData.reasonsForRejection || null,
                requiredInformation: reviewData.requiredInformation || null,
                recommendedPackageTier: reviewData.recommendedPackageTier || null,
                recommendedAction: reviewData.recommendedAction || null,
                estimatedTreatmentCost: reviewData.estimatedTreatmentCost || null,
                estimatedDurationDays: reviewData.estimatedDurationDays || null,
            });

            // Update booking status based on review
            if (reviewData.isApproved === true) {
                booking.bookingStatus = BOOKING_STATUSES.AWAITING_DOCUMENTS;
            } else if (reviewData.isApproved === false) {
                booking.bookingStatus = BOOKING_STATUSES.REJECTED;
            } else {
                booking.bookingStatus = BOOKING_STATUSES.UNDER_REVIEW;
            }

            await booking.save();

            logger.info(`Booking ${bookingId} reviewed by staff ${staffId}`);

            return {
                reviewId: review.id,
                bookingId: booking.id,
                status: booking.bookingStatus,
                createdAt: review.createdAt,
            };
        } catch (error) {
            logger.error('Failed to review booking');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Upload insurance document
    async uploadInsuranceDocument(bookingId, fileBuffer, fileName, insuranceData) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            if (!fileBuffer) {
                throw new ValidationError('File buffer is required');
            }

            if (!fileName) {
                throw new ValidationError('File name is required');
            }

            // Get booking
            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            // Upload to ImageKit
            const uploadResult = await fileUploadUtil.uploadInsuranceDocument(
                fileBuffer,
                fileName,
                bookingId
            );

            if (!uploadResult.success) {
                throw new Error(uploadResult.error);
            }

            // Save to database
            const InsuranceDocument = sequelize.models.InsuranceDocument;
            const document = await InsuranceDocument.create({
                bookingId: bookingId,
                patientId: booking.patientId,
                insuranceProviderName: insuranceData.insuranceProviderName || '',
                policyNumber: insuranceData.policyNumber || '',
                groupNumber: insuranceData.groupNumber || null,
                memberId: insuranceData.memberId || null,
                coverageType: insuranceData.coverageType || 'partial',
                coverageAmount: insuranceData.coverageAmount || null,
                deductible: insuranceData.deductible || null,
                coInsurancePercentage: insuranceData.coInsurancePercentage || null,
                documentUrl: uploadResult.url,
                documentType: uploadResult.name,
                fileName: uploadResult.name,
                fileSize: uploadResult.size,
                fileId: uploadResult.fileId,
                validFrom: insuranceData.validFrom || null,
                validTo: insuranceData.validTo || null,
                verificationStatus: 'pending',
            });

            logger.info(`Insurance document uploaded for booking ${bookingId}`);

            return {
                documentId: document.id,
                bookingId: booking.id,
                fileName: document.fileName,
                url: document.documentUrl,
                verificationStatus: document.verificationStatus,
                uploadedAt: document.createdAt,
            };
        } catch (error) {
            logger.error('Failed to upload insurance document');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Upload medical document
    async uploadMedicalDocument(bookingId, fileBuffer, fileName, medicalData) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            if (!fileBuffer) {
                throw new ValidationError('File buffer is required');
            }

            if (!fileName) {
                throw new ValidationError('File name is required');
            }

            // Get booking
            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            // Upload to ImageKit
            const uploadResult = await fileUploadUtil.uploadMedicalDocument(
                fileBuffer,
                fileName,
                bookingId,
                medicalData.documentType
            );

            if (!uploadResult.success) {
                throw new Error(uploadResult.error);
            }

            // Save to database
            const MedicalDocument = sequelize.models.MedicalDocument;
            const document = await MedicalDocument.create({
                bookingId: bookingId,
                patientId: booking.patientId,
                documentType: medicalData.documentType || 'other',
                documentTitle: medicalData.documentTitle || '',
                description: medicalData.description || null,
                documentUrl: uploadResult.url,
                fileName: uploadResult.name,
                fileSize: uploadResult.size,
                fileId: uploadResult.fileId,
                dateOfDocument: medicalData.dateOfDocument || null,
                hospitalName: medicalData.hospitalName || null,
                doctorName: medicalData.doctorName || null,
                specialty: medicalData.specialty || null,
                reviewStatus: 'pending',
                isRelevantForTreatment: true,
            });

            logger.info(`Medical document uploaded for booking ${bookingId}`);

            return {
                documentId: document.id,
                bookingId: booking.id,
                documentType: document.documentType,
                fileName: document.fileName,
                url: document.documentUrl,
                reviewStatus: document.reviewStatus,
                uploadedAt: document.createdAt,
            };
        } catch (error) {
            logger.error('Failed to upload medical document');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Get booking documents
    async getBookingDocuments(bookingId) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            const InsuranceDocument = sequelize.models.InsuranceDocument;
            const MedicalDocument = sequelize.models.MedicalDocument;

            const insuranceDocs = await InsuranceDocument.findAll({
                where: { bookingId: bookingId },
            });

            const medicalDocs = await MedicalDocument.findAll({
                where: { bookingId: bookingId },
            });

            logger.info(`Retrieved documents for booking ${bookingId}`);

            return {
                insurance: insuranceDocs,
                medical: medicalDocs,
            };
        } catch (error) {
            logger.error('Failed to get booking documents');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Cancel booking
    async cancelBooking(bookingId, reason) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            booking.bookingStatus = BOOKING_STATUSES.CANCELLED;
            booking.notes = reason || 'Booking cancelled';
            await booking.save();

            logger.info(`Booking ${bookingId} cancelled`);

            return {
                id: booking.id,
                bookingReference: booking.bookingReference,
                status: booking.bookingStatus,
                cancelledAt: booking.updatedAt,
            };
        } catch (error) {
            logger.error('Failed to cancel booking');
            logger.error('Error details:', error.message);
            throw error;
        }
    }
}

export default new BookingService();
import { Op, sequelize } from 'sequelize';
import {
    Booking,
    BookingHistory,
    BookingStep,
    Payment,
    ExpertCall,
    Package,
    FeatureAddOn,
    BookingAddOn,
    Treatment,
    Hospital,
    Country,
    City,
    User,
    AuditLog
} from '../models/index.js';
import { ValidationService } from './ValidationService.js';
import { NotificationService } from './NotificationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import {
    BOOKING_STATUSES,
    BOOKING_WORKFLOW_STEPS,
    COST_ESTIMATION_CONFIG,
    BOOKING_STEP_LABELS,
    BOOKING_STEP_DESCRIPTIONS
} from '../constants/index.js';
import { AppError } from '../utils/errors/AppError.js';

export class BookingService {
    constructor() {
        this.validationService = new ValidationService();
        this.notificationService = new NotificationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CORE BOOKING MANAGEMENT (from BookingService)
    // ═══════════════════════════════════════════════════════════════════════════════

    async createBooking(userId, treatmentId, countryId, bookingData) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !treatmentId || !countryId) {
                throw new AppError('userId, treatmentId, countryId are required', 400);
            }

            const user = await User.findByPk(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const treatment = await Treatment.findByPk(treatmentId);
            if (!treatment) {
                throw new AppError('Treatment not found', 404);
            }

            const country = await Country.findByPk(countryId);
            if (!country) {
                throw new AppError('Country not found', 404);
            }

            const existingBooking = await Booking.findOne({
                where: {
                    userId: userId,
                    treatmentId: treatmentId,
                    status: {
                        [Op.in]: [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.EXPERT_REVIEW]
                    }
                },
                transaction: transaction
            });

            if (existingBooking) {
                await transaction.rollback();
                throw new AppError('Active booking already exists for this treatment', 409);
            }

            const bookingId = this._generateBookingId();
            const booking = await Booking.create({
                bookingId: bookingId,
                userId: userId,
                treatmentId: treatmentId,
                countryId: countryId,
                currentStep: BOOKING_WORKFLOW_STEPS.TREATMENT_SELECTION,
                status: BOOKING_STATUSES.PENDING,
                workflowData: { step_1: { completedAt: new Date() } },
                basePrice: 0,
                addOnsPrice: 0,
                totalPrice: 0,
                notes: bookingData && bookingData.notes ? bookingData.notes : null,
                createdFrom: bookingData && bookingData.createdFrom ? bookingData.createdFrom : 'web'
            }, { transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'BOOKING_CREATED',
                status: BOOKING_STATUSES.PENDING,
                changes: { initial: true },
                createdBy: userId
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'BOOKING_CREATED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: userId,
                details: { treatmentId: treatmentId, countryId: countryId }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Booking created successfully',
                bookingId: booking.bookingId,
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getBookingById(bookingId, userId) {
        try {
            if (!bookingId) {
                throw new AppError('Booking ID is required', 400);
            }

            const booking = await Booking.findOne({
                where: { bookingId: bookingId },
                include: [
                    { model: User, attributes: ['userId', 'firstName', 'lastName', 'email', 'phone'] },
                    { model: Treatment },
                    { model: Hospital },
                    { model: Country },
                    { model: City },
                    { model: Package },
                    { model: BookingAddOn, include: [{ model: FeatureAddOn }] },
                    { model: Payment },
                    { model: ExpertCall }
                ]
            });

            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                throw new AppError('Unauthorized access to this booking', 403);
            }

            return {
                success: true,
                booking: booking,
                stepLabel: BOOKING_STEP_LABELS[booking.currentStep],
                stepDescription: BOOKING_STEP_DESCRIPTIONS[booking.currentStep]
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateBookingStep(bookingId, stepNumber, stepData) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !stepNumber) {
                throw new AppError('Booking ID and step number are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            const isValidStep = Object.values(BOOKING_WORKFLOW_STEPS).includes(stepNumber);
            if (!isValidStep) {
                await transaction.rollback();
                throw new AppError('Invalid step number', 400);
            }

            const previousStep = booking.currentStep;
            const workflowData = booking.workflowData || {};
            workflowData['step_' + stepNumber] = {
                data: stepData,
                completedAt: new Date()
            };

            booking.currentStep = stepNumber;
            booking.workflowData = workflowData;
            await booking.save({ transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'STEP_UPDATED',
                status: booking.status,
                changes: { previousStep: previousStep, newStep: stepNumber },
                createdBy: booking.userId
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'BOOKING_STEP_UPDATED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: booking.userId,
                details: { stepNumber: stepNumber, previousStep: previousStep }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Booking step updated successfully',
                currentStep: booking.currentStep,
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async listUserBookings(userId, filters) {
        try {
            if (!userId) {
                throw new AppError('User ID is required', 400);
            }

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { userId: userId };

            if (filters && filters.status) {
                const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
                where.status = {
                    [Op.in]: statusArray
                };
            }

            if (filters && filters.treatmentId) {
                where.treatmentId = filters.treatmentId;
            }

            const bookings = await Booking.findAll({
                where: where,
                include: [
                    { model: Treatment, attributes: ['treatmentName'] },
                    { model: Hospital, attributes: ['hospitalName'] },
                    { model: Country, attributes: ['countryName'] },
                    { model: Package, attributes: ['packageName', 'basePrice'] }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit,
                offset: offset,
                distinct: true
            });

            const total = await Booking.count({ where: where });

            return {
                success: true,
                bookings: bookings,
                pagination: {
                    total: total,
                    page: Math.floor(offset / limit) + 1,
                    pages: Math.ceil(total / limit),
                    limit: limit
                }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async cancelBooking(bookingId, userId, cancellationReason) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !cancellationReason) {
                throw new AppError('Booking ID and cancellation reason are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                await transaction.rollback();
                throw new AppError('Unauthorized to cancel this booking', 403);
            }

            if (booking.status === BOOKING_STATUSES.CANCELLED) {
                await transaction.rollback();
                throw new AppError('Booking is already cancelled', 400);
            }

            const previousStatus = booking.status;
            booking.status = BOOKING_STATUSES.CANCELLED;
            booking.cancellationReason = cancellationReason;
            booking.cancelledAt = new Date();
            await booking.save({ transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'BOOKING_CANCELLED',
                status: BOOKING_STATUSES.CANCELLED,
                changes: { previousStatus: previousStatus, reason: cancellationReason },
                createdBy: userId
            }, { transaction: transaction });

            const payment = await Payment.findOne({
                where: { bookingId: bookingId, status: 'completed' },
                transaction: transaction
            });

            if (payment) {
                payment.status = 'refunded';
                payment.refundedAt = new Date();
                await payment.save({ transaction: transaction });
            }

            await this.auditLogService.logAction({
                action: 'BOOKING_CANCELLED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: userId,
                details: { cancellationReason: cancellationReason }
            }, transaction);

            await this.notificationService.sendNotification(userId, 'BOOKING_CANCELLED', {
                bookingId: bookingId,
                reason: cancellationReason
            });

            await transaction.commit();

            return {
                success: true,
                message: 'Booking cancelled successfully',
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // WORKFLOW METHODS (from BookingWorkflowService - MERGED)
    // ═══════════════════════════════════════════════════════════════════════════════

    async startWorkflow(bookingId, userId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !userId) {
                throw new AppError('Booking ID and User ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                await transaction.rollback();
                throw new AppError('Unauthorized to start this workflow', 403);
            }

            if (booking.workflowStartedAt) {
                await transaction.rollback();
                throw new AppError('Workflow already started', 400);
            }

            booking.workflowStartedAt = new Date();
            booking.currentStep = BOOKING_WORKFLOW_STEPS.TREATMENT_SELECTION;
            await booking.save({ transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'WORKFLOW_STARTED',
                status: booking.status,
                changes: { step: BOOKING_WORKFLOW_STEPS.TREATMENT_SELECTION },
                createdBy: userId
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'WORKFLOW_STARTED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Workflow started successfully',
                currentStep: booking.currentStep,
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async proceedToNextStep(bookingId, userId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !userId) {
                throw new AppError('Booking ID and User ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                await transaction.rollback();
                throw new AppError('Unauthorized', 403);
            }

            const steps = Object.values(BOOKING_WORKFLOW_STEPS).sort((a, b) => a - b);
            const currentIndex = steps.indexOf(booking.currentStep);

            if (currentIndex === -1 || currentIndex === steps.length - 1) {
                await transaction.rollback();
                throw new AppError('Cannot proceed further in workflow', 400);
            }

            const validation = this._validateStepData(booking, booking.currentStep);
            if (!validation.isValid) {
                await transaction.rollback();
                throw new AppError('Step validation failed: ' + validation.errors.join(', '), 400);
            }

            const previousStep = booking.currentStep;
            const nextStep = steps[currentIndex + 1];

            booking.currentStep = nextStep;
            await booking.save({ transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'STEP_ADVANCED',
                status: booking.status,
                changes: { fromStep: previousStep, toStep: nextStep },
                createdBy: userId
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'WORKFLOW_STEP_ADVANCED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: userId,
                details: { fromStep: previousStep, toStep: nextStep }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Proceeding to next step',
                currentStep: nextStep,
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async goToPreviousStep(bookingId, userId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !userId) {
                throw new AppError('Booking ID and User ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                await transaction.rollback();
                throw new AppError('Unauthorized', 403);
            }

            const steps = Object.values(BOOKING_WORKFLOW_STEPS).sort((a, b) => a - b);
            const currentIndex = steps.indexOf(booking.currentStep);

            if (currentIndex <= 0) {
                await transaction.rollback();
                throw new AppError('Cannot go to previous step', 400);
            }

            const previousStep = booking.currentStep;
            const newStep = steps[currentIndex - 1];

            booking.currentStep = newStep;
            await booking.save({ transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'STEP_REVERSED',
                status: booking.status,
                changes: { fromStep: previousStep, toStep: newStep },
                createdBy: userId
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'WORKFLOW_STEP_REVERSED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: userId,
                details: { fromStep: previousStep, toStep: newStep }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Reverted to previous step',
                currentStep: newStep,
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async completeWorkflow(bookingId, userId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !userId) {
                throw new AppError('Booking ID and User ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                await transaction.rollback();
                throw new AppError('Unauthorized', 403);
            }

            const lastStep = Math.max(...Object.values(BOOKING_WORKFLOW_STEPS));
            if (booking.currentStep !== lastStep) {
                await transaction.rollback();
                throw new AppError('All workflow steps must be completed', 400);
            }

            booking.status = BOOKING_STATUSES.EXPERT_REVIEW;
            booking.workflowCompletedAt = new Date();
            await booking.save({ transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'WORKFLOW_COMPLETED',
                status: BOOKING_STATUSES.EXPERT_REVIEW,
                changes: { completedAt: new Date() },
                createdBy: userId
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'WORKFLOW_COMPLETED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: userId,
                details: {}
            }, transaction);

            await this.notificationService.sendNotification(userId, 'BOOKING_SUBMITTED_FOR_REVIEW', {
                bookingId: bookingId
            });

            await transaction.commit();

            return {
                success: true,
                message: 'Workflow completed successfully',
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getWorkflowProgress(bookingId, userId) {
        try {
            if (!bookingId || !userId) {
                throw new AppError('Booking ID and User ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId) {
                throw new AppError('Unauthorized', 403);
            }

            const allSteps = Object.values(BOOKING_WORKFLOW_STEPS).sort((a, b) => a - b);
            const workflowData = booking.workflowData || {};
            const completedSteps = allSteps.filter(step => {
                return workflowData['step_' + step] !== undefined;
            });

            const progress = {
                totalSteps: allSteps.length,
                completedStepsCount: completedSteps.length,
                progressPercentage: Math.round((completedSteps.length / allSteps.length) * 100),
                currentStep: booking.currentStep,
                completedSteps: completedSteps,
                skippedSteps: booking.skippedSteps || [],
                remainingSteps: allSteps.filter(step => !completedSteps.includes(step))
            };

            return {
                success: true,
                progress: progress
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getBookingHistory(bookingId) {
        try {
            if (!bookingId) {
                throw new AppError('Booking ID is required', 400);
            }

            const history = await BookingHistory.findAll({
                where: { bookingId: bookingId },
                include: [{ model: User, attributes: ['firstName', 'lastName'] }],
                order: [
                    ['createdAt', 'ASC']
                ]
            });

            return {
                success: true,
                history: history,
                totalEntries: history.length
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async updateBookingNotes(bookingId, userId, notes) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !userId || !notes) {
                throw new AppError('Booking ID, User ID, and notes are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            if (booking.userId !== userId && userId !== 'ADMIN') {
                await transaction.rollback();
                throw new AppError('Unauthorized', 403);
            }

            const previousNotes = booking.notes;
            booking.notes = notes;
            await booking.save({ transaction: transaction });

            await BookingHistory.create({
                historyId: this._generateHistoryId(),
                bookingId: bookingId,
                action: 'NOTES_UPDATED',
                status: booking.status,
                changes: { previousNotes: previousNotes, newNotes: notes },
                createdBy: userId
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'BOOKING_NOTES_UPDATED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: userId,
                details: { notes: notes }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Booking notes updated',
                booking: booking
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEP DATA METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    async setTreatmentSelection(bookingId, treatmentId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !treatmentId) {
                throw new AppError('Booking ID and Treatment ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            const treatment = await Treatment.findByPk(treatmentId, { transaction: transaction });
            if (!treatment) {
                await transaction.rollback();
                throw new AppError('Treatment not found', 404);
            }

            booking.treatmentId = treatmentId;
            const workflowData = booking.workflowData || {};
            workflowData.step_1 = {
                treatmentId: treatmentId,
                treatmentName: treatment.treatmentName,
                completedAt: new Date()
            };
            booking.workflowData = workflowData;
            await booking.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'STEP_1_COMPLETED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: booking.userId,
                details: { treatmentId: treatmentId }
            }, transaction);

            await transaction.commit();

            return { success: true, booking: booking };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async setCountrySelection(bookingId, countryId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !countryId) {
                throw new AppError('Booking ID and Country ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            const country = await Country.findByPk(countryId, { transaction: transaction });
            if (!country) {
                await transaction.rollback();
                throw new AppError('Country not found', 404);
            }

            booking.countryId = countryId;
            const workflowData = booking.workflowData || {};
            workflowData.step_2 = {
                countryId: countryId,
                countryName: country.countryName,
                currencyCode: country.currencyCode,
                completedAt: new Date()
            };
            booking.workflowData = workflowData;
            await booking.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'STEP_2_COMPLETED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: booking.userId,
                details: { countryId: countryId }
            }, transaction);

            await transaction.commit();

            return { success: true, booking: booking };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async setCitySelection(bookingId, cityId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !cityId) {
                throw new AppError('Booking ID and City ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            const city = await City.findByPk(cityId, { transaction: transaction });
            if (!city) {
                await transaction.rollback();
                throw new AppError('City not found', 404);
            }

            booking.cityId = cityId;
            const workflowData = booking.workflowData || {};
            workflowData.step_3 = {
                cityId: cityId,
                cityName: city.cityName,
                state: city.state,
                completedAt: new Date()
            };
            booking.workflowData = workflowData;
            await booking.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'STEP_3_COMPLETED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: booking.userId,
                details: { cityId: cityId }
            }, transaction);

            await transaction.commit();

            return { success: true, booking: booking };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async setHospitalSelection(bookingId, hospitalId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !hospitalId) {
                throw new AppError('Booking ID and Hospital ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            const hospital = await Hospital.findByPk(hospitalId, { transaction: transaction });
            if (!hospital) {
                await transaction.rollback();
                throw new AppError('Hospital not found', 404);
            }

            booking.hospitalId = hospitalId;
            const workflowData = booking.workflowData || {};
            workflowData.step_4 = {
                hospitalId: hospitalId,
                hospitalName: hospital.hospitalName,
                location: hospital.location,
                completedAt: new Date()
            };
            booking.workflowData = workflowData;
            await booking.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'STEP_4_COMPLETED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: booking.userId,
                details: { hospitalId: hospitalId }
            }, transaction);

            await transaction.commit();

            return { success: true, booking: booking };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async setPackageSelection(bookingId, packageId) {
        const transaction = await sequelize.transaction();
        try {
            if (!bookingId || !packageId) {
                throw new AppError('Booking ID and Package ID are required', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            const packageRecord = await Package.findByPk(packageId, { transaction: transaction });
            if (!packageRecord) {
                await transaction.rollback();
                throw new AppError('Package not found', 404);
            }

            booking.packageId = packageId;
            booking.basePrice = packageRecord.basePrice;
            booking.totalPrice = packageRecord.basePrice;

            const workflowData = booking.workflowData || {};
            workflowData.step_5 = {
                packageId: packageId,
                packageName: packageRecord.packageName,
                basePrice: packageRecord.basePrice,
                completedAt: new Date()
            };
            booking.workflowData = workflowData;
            await booking.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'STEP_5_COMPLETED',
                entityType: 'Booking',
                entityId: bookingId,
                userId: booking.userId,
                details: { packageId: packageId, price: packageRecord.basePrice }
            }, transaction);

            await transaction.commit();

            return { success: true, booking: booking };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateBookingId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.floor(Math.random() * 10000).toString(36).toUpperCase();
        return 'BK-' + timestamp + random;
    }

    _generateHistoryId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.floor(Math.random() * 10000).toString(36).toUpperCase();
        return 'BH-' + timestamp + random;
    }

    _validateStepData(booking, step) {
        const workflowData = booking.workflowData || {};
        const stepKey = 'step_' + step;

        if (!workflowData[stepKey]) {
            return {
                isValid: false,
                errors: ['Step ' + step + ' data is incomplete']
            };
        }

        return { isValid: true, errors: [] };
    }
}

export default BookingService;
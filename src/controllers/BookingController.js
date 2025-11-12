'use strict';

import { BookingService } from '../services/BookingService.js';
import { AppError } from '../utils/errors/AppError.js';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING CONTROLLER - ULTRA-COMPREHENSIVE - NO OPTIONAL CHAINING
// Production Ready with Standardized Error Responses
// ═══════════════════════════════════════════════════════════════════════════════

export class BookingController {
    constructor() {
        this.bookingService = new BookingService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CREATE BOOKING
    // ═══════════════════════════════════════════════════════════════════════════════

    async createBooking(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const { treatmentId, countryId } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!treatmentId || !countryId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Treatment ID and Country ID are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.createBooking(userId, treatmentId, countryId, req.body);

            return res.status(201).json({
                success: true,
                message: result.message,
                data: {
                    bookingId: result.bookingId,
                    booking: result.booking
                }
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in createBooking controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: error && error.details ? error.details : null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GET BOOKING BY ID
    // ═══════════════════════════════════════════════════════════════════════════════

    async getBookingById(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.getBookingById(bookingId, userId);

            return res.status(200).json({
                success: true,
                data: result.booking,
                meta: {
                    stepLabel: result.stepLabel,
                    stepDescription: result.stepDescription
                }
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in getBookingById controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // UPDATE BOOKING
    // ═══════════════════════════════════════════════════════════════════════════════

    async updateBooking(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const updateData = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.updateBooking(bookingId, updateData);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in updateBooking controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // UPDATE BOOKING STEP
    // ═══════════════════════════════════════════════════════════════════════════════

    async updateBookingStep(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { stepNumber, stepData } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId || !stepNumber) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID and step number are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.updateBookingStep(bookingId, stepNumber, stepData);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    currentStep: result.currentStep,
                    booking: result.booking
                }
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in updateBookingStep controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // LIST USER BOOKINGS
    // ═══════════════════════════════════════════════════════════════════════════════

    async listUserBookings(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            const filters = {
                status: req.query && req.query.status ? req.query.status : null,
                treatmentId: req.query && req.query.treatmentId ? req.query.treatmentId : null,
                limit: req.query && req.query.limit ? parseInt(req.query.limit) : 10,
                offset: req.query && req.query.offset ? parseInt(req.query.offset) : 0
            };

            const result = await this.bookingService.listUserBookings(userId, filters);

            return res.status(200).json({
                success: true,
                data: result.bookings,
                pagination: result.pagination
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in listUserBookings controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CANCEL BOOKING
    // ═══════════════════════════════════════════════════════════════════════════════

    async cancelBooking(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { cancellationReason } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            if (!cancellationReason) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Cancellation reason is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.cancelBooking(bookingId, userId, cancellationReason);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in cancelBooking controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // START WORKFLOW
    // ═══════════════════════════════════════════════════════════════════════════════

    async startWorkflow(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.startWorkflow(bookingId, userId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    currentStep: result.currentStep,
                    booking: result.booking
                }
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in startWorkflow controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PROCEED TO NEXT STEP
    // ═══════════════════════════════════════════════════════════════════════════════

    async proceedToNextStep(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.proceedToNextStep(bookingId, userId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    currentStep: result.currentStep,
                    booking: result.booking
                }
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in proceedToNextStep controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GO TO PREVIOUS STEP
    // ═══════════════════════════════════════════════════════════════════════════════

    async goToPreviousStep(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.goToPreviousStep(bookingId, userId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    currentStep: result.currentStep,
                    booking: result.booking
                }
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in goToPreviousStep controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // COMPLETE WORKFLOW
    // ═══════════════════════════════════════════════════════════════════════════════

    async completeWorkflow(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.completeWorkflow(bookingId, userId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in completeWorkflow controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GET WORKFLOW PROGRESS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getWorkflowProgress(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.getWorkflowProgress(bookingId, userId);

            return res.status(200).json({
                success: true,
                data: result.progress
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in getWorkflowProgress controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GET BOOKING HISTORY
    // ═══════════════════════════════════════════════════════════════════════════════

    async getBookingHistory(req, res) {
        try {
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID is required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.getBookingHistory(bookingId);

            return res.status(200).json({
                success: true,
                data: result.history,
                meta: {
                    totalEntries: result.totalEntries
                }
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in getBookingHistory controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // UPDATE BOOKING NOTES
    // ═══════════════════════════════════════════════════════════════════════════════

    async updateBookingNotes(req, res) {
        try {
            const userId = req.user && req.user.userId ? req.user.userId : null;
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { notes } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User authentication required',
                        details: null
                    }
                });
            }

            if (!bookingId || !notes) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID and notes are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.updateBookingNotes(bookingId, userId, notes);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in updateBookingNotes controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SET TREATMENT SELECTION (STEP 1)
    // ═══════════════════════════════════════════════════════════════════════════════

    async setTreatmentSelection(req, res) {
        try {
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { treatmentId } = req.body;

            if (!bookingId || !treatmentId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID and Treatment ID are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.setTreatmentSelection(bookingId, treatmentId);

            return res.status(200).json({
                success: true,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in setTreatmentSelection controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SET COUNTRY SELECTION (STEP 2)
    // ═══════════════════════════════════════════════════════════════════════════════

    async setCountrySelection(req, res) {
        try {
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { countryId } = req.body;

            if (!bookingId || !countryId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID and Country ID are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.setCountrySelection(bookingId, countryId);

            return res.status(200).json({
                success: true,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in setCountrySelection controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SET CITY SELECTION (STEP 3)
    // ═══════════════════════════════════════════════════════════════════════════════

    async setCitySelection(req, res) {
        try {
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { cityId } = req.body;

            if (!bookingId || !cityId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID and City ID are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.setCitySelection(bookingId, cityId);

            return res.status(200).json({
                success: true,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in setCitySelection controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SET HOSPITAL SELECTION (STEP 4)
    // ═══════════════════════════════════════════════════════════════════════════════

    async setHospitalSelection(req, res) {
        try {
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { hospitalId } = req.body;

            if (!bookingId || !hospitalId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID and Hospital ID are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.setHospitalSelection(bookingId, hospitalId);

            return res.status(200).json({
                success: true,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in setHospitalSelection controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SET PACKAGE SELECTION (STEP 5)
    // ═══════════════════════════════════════════════════════════════════════════════

    async setPackageSelection(req, res) {
        try {
            const bookingId = req.params && req.params.bookingId ? req.params.bookingId : null;
            const { packageId } = req.body;

            if (!bookingId || !packageId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Booking ID and Package ID are required',
                        details: null
                    }
                });
            }

            const result = await this.bookingService.setPackageSelection(bookingId, packageId);

            return res.status(200).json({
                success: true,
                data: result.booking
            });
        } catch (error) {
            const statusCode = error && error.statusCode ? error.statusCode : 500;
            const errorMessage = error && error.message ? error.message : 'Internal server error';

            console.error('Error in setPackageSelection controller:', errorMessage);

            return res.status(statusCode).json({
                success: false,
                error: {
                    code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
                    message: errorMessage,
                    details: null
                }
            });
        }
    }
}

export default new BookingController();
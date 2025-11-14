'use strict';

import appointmentService from '../services/AppointmentService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';
import { AppError } from '../utils/errors/AppError.js';

// ═══════════════════════════════════════════════════════════════════════════════
// APPOINTMENT CONTROLLER - ULTRA-COMPREHENSIVE
// Includes: Appointment Booking + Consultation + Slot Management
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

export class AppointmentController {
    constructor() {
        this.appointmentService = appointmentService;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // BOOK APPOINTMENT
    // ─────────────────────────────────────────────────────────────────────────────

    async bookAppointment(req, res, next) {
        try {
            const requiredFields = ['doctorId', 'appointmentDate', 'startTime', 'endTime'];
            const missing = requiredFields.filter(field => req.body[field] === undefined);

            if (missing.length > 0) {
                return res.status(400).json(
                    ResponseFormatter.error(
                        `Missing required fields: ${missing.join(', ')}`,
                        400,
                        'VALIDATION_ERROR'
                    )
                );
            }

            if (!req.user || !req.user.userId) {
                return res.status(401).json(
                    ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR')
                );
            }

            const appointmentData = {
                doctorId: req.body.doctorId,
                appointmentDate: req.body.appointmentDate,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                appointmentType: req.body.appointmentType || 'consultation',
                consultationMode: req.body.consultationMode || 'video',
                notes: req.body.notes || null,
                reason: req.body.reason || null
            };

            const result = await this.appointmentService.bookAppointment(req.user.userId, appointmentData);

            console.log(`✅ Appointment booked: ${result.appointment.appointmentId}`);

            return res.status(201).json(
                ResponseFormatter.created(
                    result.appointment,
                    result.message
                )
            );
        } catch (error) {
            console.error('❌ Book appointment error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'APPOINTMENT_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET APPOINTMENT BY ID
    // ─────────────────────────────────────────────────────────────────────────────

    async getAppointmentById(req, res, next) {
        try {
            if (!req.params.appointmentId) {
                return res.status(400).json(
                    ResponseFormatter.error('Appointment ID required', 400, 'VALIDATION_ERROR')
                );
            }

            if (!req.user || !req.user.userId) {
                return res.status(401).json(
                    ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR')
                );
            }

            const result = await this.appointmentService.getAppointmentById(
                req.params.appointmentId,
                req.user.userId
            );

            console.log(`✅ Appointment retrieved: ${req.params.appointmentId}`);

            return res.status(200).json(ResponseFormatter.success(result.appointment));
        } catch (error) {
            console.error('❌ Get appointment error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'APPOINTMENT_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET USER APPOINTMENTS
    // ─────────────────────────────────────────────────────────────────────────────

    async getUserAppointments(req, res, next) {
        try {
            if (!req.user || !req.user.userId) {
                return res.status(401).json(
                    ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR')
                );
            }

            const filters = {
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                offset: req.query.offset ? parseInt(req.query.offset) : 0,
                status: req.query.status || null,
                appointmentDate: req.query.appointmentDate || null
            };

            if (filters.limit <= 0 || filters.offset < 0) {
                return res.status(400).json(
                    ResponseFormatter.error(
                        'Limit must be positive and offset must be non-negative',
                        400,
                        'VALIDATION_ERROR'
                    )
                );
            }

            const result = await this.appointmentService.getUserAppointments(req.user.userId, filters);

            console.log(`✅ User appointments retrieved: ${req.user.userId}`);

            return res.status(200).json(
                ResponseFormatter.success(
                    result.appointments,
                    'Appointments retrieved',
                    result.pagination
                )
            );
        } catch (error) {
            console.error('❌ Get user appointments error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'APPOINTMENT_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RESCHEDULE APPOINTMENT
    // ─────────────────────────────────────────────────────────────────────────────

    async rescheduleAppointment(req, res, next) {
        try {
            if (!req.params.appointmentId) {
                return res.status(400).json(
                    ResponseFormatter.error('Appointment ID required', 400, 'VALIDATION_ERROR')
                );
            }

            const requiredFields = ['appointmentDate', 'startTime', 'endTime'];
            const missing = requiredFields.filter(field => req.body[field] === undefined);

            if (missing.length > 0) {
                return res.status(400).json(
                    ResponseFormatter.error(
                        `Missing required fields: ${missing.join(', ')}`,
                        400,
                        'VALIDATION_ERROR'
                    )
                );
            }

            if (!req.user || !req.user.userId) {
                return res.status(401).json(
                    ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR')
                );
            }

            const newData = {
                appointmentDate: req.body.appointmentDate,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            };

            const result = await this.appointmentService.rescheduleAppointment(
                req.params.appointmentId,
                req.user.userId,
                newData
            );

            console.log(`✅ Appointment rescheduled: ${req.params.appointmentId}`);

            return res.status(200).json(
                ResponseFormatter.success(result.appointment, result.message)
            );
        } catch (error) {
            console.error('❌ Reschedule appointment error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'APPOINTMENT_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CANCEL APPOINTMENT
    // ─────────────────────────────────────────────────────────────────────────────

    async cancelAppointment(req, res, next) {
        try {
            if (!req.params.appointmentId) {
                return res.status(400).json(
                    ResponseFormatter.error('Appointment ID required', 400, 'VALIDATION_ERROR')
                );
            }

            if (!req.user || !req.user.userId) {
                return res.status(401).json(
                    ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR')
                );
            }

            const reason = req.body.reason || 'No reason provided';

            const result = await this.appointmentService.cancelAppointment(
                req.params.appointmentId,
                req.user.userId,
                reason
            );

            console.log(`✅ Appointment cancelled: ${req.params.appointmentId}`);

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ Cancel appointment error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'APPOINTMENT_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async createConsultation(req, res, next) {
        try {
            if (!req.params.appointmentId) {
                return res.status(400).json(
                    ResponseFormatter.error('Appointment ID required', 400, 'VALIDATION_ERROR')
                );
            }

            const consultationData = {
                consultationType: req.body.consultationType || 'video',
                meetingLink: req.body.meetingLink || null
            };

            const result = await this.appointmentService.createConsultation(
                req.params.appointmentId,
                consultationData
            );

            console.log(`✅ Consultation created: ${result.consultation.callId}`);

            return res.status(201).json(
                ResponseFormatter.created(result.consultation, result.message)
            );
        } catch (error) {
            console.error('❌ Create consultation error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'CONSULTATION_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // START CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async startConsultation(req, res, next) {
        try {
            if (!req.params.callId) {
                return res.status(400).json(
                    ResponseFormatter.error('Call ID required', 400, 'VALIDATION_ERROR')
                );
            }

            if (!req.user || !req.user.userId) {
                return res.status(401).json(
                    ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR')
                );
            }

            const result = await this.appointmentService.startConsultation(
                req.params.callId,
                req.user.userId
            );

            console.log(`✅ Consultation started: ${req.params.callId}`);

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ Start consultation error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'CONSULTATION_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // END CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async endConsultation(req, res, next) {
        try {
            if (!req.params.callId) {
                return res.status(400).json(
                    ResponseFormatter.error('Call ID required', 400, 'VALIDATION_ERROR')
                );
            }

            if (!req.user || !req.user.userId) {
                return res.status(401).json(
                    ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR')
                );
            }

            const consultationNotes = req.body.consultationNotes || null;

            const result = await this.appointmentService.endConsultation(
                req.params.callId,
                req.user.userId,
                consultationNotes
            );

            console.log(`✅ Consultation ended: ${req.params.callId}`);

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ End consultation error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'CONSULTATION_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE SLOTS
    // ─────────────────────────────────────────────────────────────────────────────

    async createSlots(req, res, next) {
        try {
            if (!req.params.doctorId) {
                return res.status(400).json(
                    ResponseFormatter.error('Doctor ID required', 400, 'VALIDATION_ERROR')
                );
            }

            if (!req.body.slotsData || !Array.isArray(req.body.slotsData) || req.body.slotsData.length === 0) {
                return res.status(400).json(
                    ResponseFormatter.error('Slots data must be a non-empty array', 400, 'VALIDATION_ERROR')
                );
            }

            for (const slot of req.body.slotsData) {
                const requiredFields = ['appointmentDate', 'startTime', 'endTime'];
                const missing = requiredFields.filter(field => slot[field] === undefined);

                if (missing.length > 0) {
                    return res.status(400).json(
                        ResponseFormatter.error(
                            `Slot missing fields: ${missing.join(', ')}`,
                            400,
                            'VALIDATION_ERROR'
                        )
                    );
                }
            }

            const result = await this.appointmentService.createSlots(
                req.params.doctorId,
                req.body.slotsData
            );

            console.log(`✅ Slots created: ${result.slots.length} slots for doctor ${req.params.doctorId}`);

            return res.status(201).json(
                ResponseFormatter.created(result.slots, result.message)
            );
        } catch (error) {
            console.error('❌ Create slots error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'SLOT_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET AVAILABLE SLOTS
    // ─────────────────────────────────────────────────────────────────────────────

    async getAvailableSlots(req, res, next) {
        try {
            if (!req.params.doctorId || !req.query.date) {
                return res.status(400).json(
                    ResponseFormatter.error('Doctor ID and date required', 400, 'VALIDATION_ERROR')
                );
            }

            const result = await this.appointmentService.getAvailableSlots(
                req.params.doctorId,
                req.query.date
            );

            console.log(`✅ Available slots retrieved: ${result.total} slots for ${req.params.doctorId}`);

            return res.status(200).json(
                ResponseFormatter.success(result.slots, `Available slots: ${result.total}`)
            );
        } catch (error) {
            console.error('❌ Get available slots error:', error.message);

            if (error instanceof AppError) {
                return res.status(error.statusCode).json(
                    ResponseFormatter.error(error.message, error.statusCode, error.code || 'SLOT_ERROR')
                );
            }

            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new AppointmentController();
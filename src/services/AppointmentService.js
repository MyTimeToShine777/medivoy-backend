'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { NotificationService } from './NotificationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

// CONSOLIDATED: ConsultationService + AppointmentService
export class AppointmentService {
    constructor() {
        this.validationService = new ValidationService();
        this.notificationService = new NotificationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // APPOINTMENT BOOKING (from AppointmentService)
    // ═══════════════════════════════════════════════════════════════════════════════

    async bookAppointment(userId, appointmentData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!userId || !appointmentData) {
                throw new AppError('Required parameters missing', 400);
            }

            const user = await prisma.user.findUnique({ where: { userId } });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            const doctor = await tx.doctor.findUnique({ where: { doctorId: appointmentData.doctorId } });
            if (!doctor) {
                await transaction.rollback();
                throw new AppError('Doctor not found', 404);
            }

            const errors = this.validationService.validateAppointmentData(appointmentData);
            if (errors.length) {
                await transaction.rollback();
                throw new AppError(errors.join(', '), 400);
            }

            // Check slot availability
            const slot = await tx.appointmentSlot.findFirst({
                where: {
                    doctorId: appointmentData.doctorId,
                    appointmentDate: appointmentData.appointmentDate,
                    startTime: appointmentData.startTime,
                    isAvailable: true
                },
                transaction: transaction
            });

            if (!slot) {
                await transaction.rollback();
                throw new AppError('Slot not available', 409);
            }

            // Check for duplicate appointments
            const existing = await tx.appointment.findFirst({
                where: {
                    userId: userId,
                    doctorId: appointmentData.doctorId,
                    appointmentDate: appointmentData.appointmentDate,
                    status: {
                        in: ['scheduled', 'confirmed'] }
                },
                transaction: transaction
            });

            if (existing) {
                await transaction.rollback();
                throw new AppError('Already have appointment with this doctor on this date', 409);
            }

            const appointment = await tx.appointment.create({
                data: {
                appointmentId: this._generateAppointmentId(),
                userId: userId,
                doctorId: appointmentData.doctorId,
                appointmentDate: appointmentData.appointmentDate,
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime,
                appointmentType: appointmentData.appointmentType || 'consultation',
                consultationMode: appointmentData.consultationMode || 'video',
                status: 'scheduled',
                notes: appointmentData.notes || null,
                reason: appointmentData.reason || null,
                bookedAt: new Date()
            }, { transaction: transaction });

            // Mark slot as unavailable
            slot.isAvailable = false;
            slot.bookedBy = userId;
            await slot.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'APPOINTMENT_BOOKED',
                entityType: 'Appointment',
                entityId: appointment.appointmentId,
                userId: userId,
                details: { doctorId: appointmentData.doctorId }
            }, transaction);

            await this.notificationService.sendNotification(userId, 'APPOINTMENT_BOOKED', {
                appointmentId: appointment.appointmentId,
                doctorName: doctor.firstName + ' ' + doctor.lastName,
                date: appointmentData.appointmentDate
            });

            await transaction.commit();

            return { success: true, message: 'Appointment booked', appointment: appointment };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getAppointmentById(appointmentId, userId) {
        try {
            if (!appointmentId || !userId) throw new AppError('Required params missing', 400);

            const appointment = await Appointment.findOne({
                where: { appointmentId: appointmentId },
                include: [
                    { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
                    { model: Doctor, attributes: ['firstName', 'lastName', 'specialization'] },
                    { model: Hospital, attributes: ['hospitalName'] },
                    { model: ExpertCall, attributes: ['callId', 'meetingLink', 'status'] }
                ]
            });

            if (!appointment) {
                throw new AppError('Appointment not found', 404);
            }

            if (appointment.userId !== userId && userId !== 'ADMIN') {
                throw new AppError('Unauthorized', 403);
            }

            return { success: true, appointment: appointment };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getUserAppointments(userId, filters) {
        try {
            if (!userId) throw new AppError('User ID required', 400);

            const limit = filters && filters.limit ? Math.min(filters.limit, 100) : 10;
            const offset = filters && filters.offset ? filters.offset : 0;
            const where = { userId: userId };

            if (filters && filters.status) {
                where.status = filters.status;
            }

            if (filters && filters.appointmentDate) {
                where.appointmentDate = {
                    gte: filters.appointmentDate };
            }

            const appointments = await Appointment.findAll({
                where: where,
                include: [
                    { model: Doctor, attributes: ['firstName', 'lastName', 'specialization'] },
                    { model: Hospital, attributes: ['hospitalName'] }
                ],
                order: [
                    ['appointmentDate', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Appointment.count({ where: where });

            return {
                success: true,
                appointments: appointments,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async rescheduleAppointment(appointmentId, userId, newData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!appointmentId || !userId || !newData) {
                throw new AppError('Required parameters missing', 400);
            }

            const appointment = await tx.appointment.findUnique({ where: { appointmentId: appointmentId } });
            if (!appointment) {
                await transaction.rollback();
                throw new AppError('Appointment not found', 404);
            }

            if (appointment.userId !== userId) {
                await transaction.rollback();
                throw new AppError('Unauthorized', 403);
            }

            if (appointment.status === 'completed' || appointment.status === 'cancelled') {
                await transaction.rollback();
                throw new AppError('Cannot reschedule this appointment', 400);
            }

            const oldSlot = await AppointmentSlot.findOne({
                where: {
                    doctorId: appointment.doctorId,
                    appointmentDate: appointment.appointmentDate,
                    startTime: appointment.startTime
                },
                transaction: transaction
            });

            if (oldSlot) {
                oldSlot.isAvailable = true;
                oldSlot.bookedBy = null;
                await oldSlot.save({ transaction: transaction });
            }

            // Find new slot
            const newSlot = await AppointmentSlot.findOne({
                where: {
                    doctorId: appointment.doctorId,
                    appointmentDate: newData.appointmentDate,
                    startTime: newData.startTime,
                    isAvailable: true
                },
                transaction: transaction
            });

            if (!newSlot) {
                await transaction.rollback();
                throw new AppError('New slot not available', 409);
            }

            appointment.appointmentDate = newData.appointmentDate;
            appointment.startTime = newData.startTime;
            appointment.endTime = newData.endTime;
            appointment.rescheduledAt = new Date();
            appointment.rescheduledCount = (appointment.rescheduledCount || 0) + 1;
            await appointment.save({ transaction: transaction });

            newSlot.isAvailable = false;
            newSlot.bookedBy = userId;
            await newSlot.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'APPOINTMENT_RESCHEDULED',
                entityType: 'Appointment',
                entityId: appointmentId,
                userId: userId,
                details: { newDate: newData.appointmentDate }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Rescheduled', appointment: appointment };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async cancelAppointment(appointmentId, userId, reason) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!appointmentId || !userId) throw new AppError('Required params missing', 400);

            const appointment = await tx.appointment.findUnique({ where: { appointmentId: appointmentId } });
            if (!appointment) {
                await transaction.rollback();
                throw new AppError('Appointment not found', 404);
            }

            if (appointment.userId !== userId && userId !== 'ADMIN') {
                await transaction.rollback();
                throw new AppError('Unauthorized', 403);
            }

            if (appointment.status === 'cancelled') {
                await transaction.rollback();
                throw new AppError('Already cancelled', 400);
            }

            appointment.status = 'cancelled';
            appointment.cancellationReason = reason || null;
            appointment.cancelledAt = new Date();
            await appointment.save({ transaction: transaction });

            // Free up the slot
            const slot = await tx.appointmentSlot.findFirst({
                where: {
                    doctorId: appointment.doctorId,
                    appointmentDate: appointment.appointmentDate,
                    startTime: appointment.startTime
                },
                transaction: transaction
            });

            if (slot) {
                slot.isAvailable = true;
                slot.bookedBy = null;
                await slot.save({ transaction: transaction });
            }

            await this.auditLogService.logAction({
                action: 'APPOINTMENT_CANCELLED',
                entityType: 'Appointment',
                entityId: appointmentId,
                userId: userId,
                details: { reason: reason }
            }, transaction);

            await this.notificationService.sendNotification(userId, 'APPOINTMENT_CANCELLED', {
                appointmentId: appointmentId,
                reason: reason
            });

            await transaction.commit();

            return { success: true, message: 'Cancelled' };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CONSULTATION METHODS (from ConsultationService - MERGED)
    // ═══════════════════════════════════════════════════════════════════════════════

    async createConsultation(appointmentId, consultationData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!appointmentId || !consultationData) {
                throw new AppError('Required parameters missing', 400);
            }

            const appointment = await tx.appointment.findUnique({ where: { appointmentId: appointmentId } });
            if (!appointment) {
                await transaction.rollback();
                throw new AppError('Appointment not found', 404);
            }

            const expertCall = await ExpertCall.create({
                callId: this._generateCallId(),
                appointmentId: appointmentId,
                doctorId: appointment.doctorId,
                userId: appointment.userId,
                consultationType: consultationData.consultationType || 'video',
                scheduledAt: appointment.appointmentDate,
                meetingLink: consultationData.meetingLink || null,
                status: 'pending',
                createdAt: new Date()
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'CONSULTATION_CREATED',
                entityType: 'ExpertCall',
                entityId: expertCall.callId,
                userId: appointment.userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Consultation created', consultation: expertCall };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async startConsultation(callId, userId) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!callId || !userId) throw new AppError('Required params missing', 400);

            const call = await tx.expertCall.findUnique({ where: { callId: callId } });
            if (!call) {
                await transaction.rollback();
                throw new AppError('Call not found', 404);
            }

            if (call.userId !== userId && userId !== 'DOCTOR') {
                await transaction.rollback();
                throw new AppError('Unauthorized', 403);
            }

            call.status = 'in_progress';
            call.startedAt = new Date();
            await call.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'CONSULTATION_STARTED',
                entityType: 'ExpertCall',
                entityId: callId,
                userId: userId,
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Consultation started' };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async endConsultation(callId, userId, consultationNotes) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!callId || !userId) throw new AppError('Required params missing', 400);

            const call = await tx.expertCall.findUnique({ where: { callId: callId } });
            if (!call) {
                await transaction.rollback();
                throw new AppError('Call not found', 404);
            }

            call.status = 'completed';
            call.endedAt = new Date();
            call.consultationNotes = consultationNotes || null;
            const duration = call.endedAt - call.startedAt;
            call.durationInMinutes = Math.round(duration / 60000);
            await call.save({ transaction: transaction });

            // Update appointment status
            const appointment = await tx.appointment.findUnique({ where: { appointmentId: call.appointmentId } });
            if (appointment) {
                appointment.status = 'completed';
                await appointment.save({ transaction: transaction });
            }

            await this.auditLogService.logAction({
                action: 'CONSULTATION_ENDED',
                entityType: 'ExpertCall',
                entityId: callId,
                userId: userId,
                details: { duration: call.durationInMinutes }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Consultation ended' };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SLOT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createSlots(doctorId, slotsData) {
        const result = await prisma.$transaction(async (tx) => {
        try {
            if (!doctorId || !slotsData) throw new AppError('Required params missing', 400);

            const slots = [];

            for (const slot of slotsData) {
                const slotRecord = await AppointmentSlot.create({
                    slotId: this._generateSlotId(),
                    doctorId: doctorId,
                    appointmentDate: slot.appointmentDate,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: true
                }, { transaction: transaction });

                slots.push(slotRecord);
            }

            await this.auditLogService.logAction({
                action: 'SLOTS_CREATED',
                entityType: 'AppointmentSlot',
                entityId: 'BULK-' + Date.now(),
                userId: 'ADMIN',
                details: { doctorId: doctorId, slotCount: slots.length }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Slots created', slots: slots };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getAvailableSlots(doctorId, date) {
        try {
            if (!doctorId || !date) throw new AppError('Required params missing', 400);

            const slots = await AppointmentSlot.findAll({
                where: {
                    doctorId: doctorId,
                    appointmentDate: date,
                    isAvailable: true
                },
                order: [
                    ['startTime', 'ASC']
                ]
            });

            return { success: true, slots: slots, total: slots.length };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generateAppointmentId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'APT-' + ts + rnd;
    }

    _generateCallId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'CALL-' + ts + rnd;
    }

    _generateSlotId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'SLOT-' + ts + rnd;
    }
}

export default AppointmentService;
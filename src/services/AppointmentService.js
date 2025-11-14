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
        return await prisma.$transaction(async(tx) => {
            if (!userId || !appointmentData) {
                throw new AppError('Required parameters missing', 400);
            }

            const user = await tx.user.findUnique({ where: { userId } });
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const doctor = await tx.doctor.findUnique({ where: { doctorId: appointmentData.doctorId } });
            if (!doctor) {
                throw new AppError('Doctor not found', 404);
            }

            const errors = this.validationService.validateAppointmentData(appointmentData);
            if (errors.length) {
                throw new AppError(errors.join(', '), 400);
            }

            // Check slot availability
            const slot = await tx.appointmentSlot.findFirst({
                where: {
                    doctorId: appointmentData.doctorId,
                    appointmentDate: appointmentData.appointmentDate,
                    startTime: appointmentData.startTime,
                    isAvailable: true
                }
            });

            if (!slot) {
                throw new AppError('Slot not available', 409);
            }

            // Check for duplicate appointments
            const existing = await tx.appointment.findFirst({
                where: {
                    userId: userId,
                    doctorId: appointmentData.doctorId,
                    appointmentDate: appointmentData.appointmentDate,
                    status: { in: ['scheduled', 'confirmed']
                    }
                }
            });

            if (existing) {
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
                }
            });

            // Mark slot as unavailable
            await tx.appointmentSlot.update({
                where: { slotId: slot.slotId },
                data: {
                    isAvailable: false,
                    bookedBy: userId
                }
            });

            await this.auditLogService.logAction({
                action: 'APPOINTMENT_BOOKED',
                entityType: 'Appointment',
                entityId: appointment.appointmentId,
                userId: userId,
                details: { doctorId: appointmentData.doctorId }
            });

            await this.notificationService.sendNotification(userId, 'APPOINTMENT_BOOKED', {
                appointmentId: appointment.appointmentId,
                doctorName: doctor.firstName + ' ' + doctor.lastName,
                date: appointmentData.appointmentDate
            });

            return { success: true, message: 'Appointment booked', appointment: appointment };
        });
    }

    async getAppointmentById(appointmentId, userId) {
        try {
            if (!appointmentId || !userId) throw new AppError('Required params missing', 400);

            const appointment = await prisma.appointment.findUnique({
                where: { appointmentId: appointmentId },
                include: {
                    user: {
                        select: { firstName: true, lastName: true, email: true, phone: true }
                    },
                    doctor: {
                        select: { firstName: true, lastName: true, specialization: true }
                    },
                    hospital: {
                        select: { hospitalName: true }
                    },
                    expertCalls: {
                        select: { callId: true, meetingLink: true, status: true }
                    }
                }
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
                    gte: filters.appointmentDate
                };
            }

            const appointments = await prisma.appointment.findMany({
                where: where,
                include: {
                    doctor: {
                        select: { firstName: true, lastName: true, specialization: true }
                    },
                    hospital: {
                        select: { hospitalName: true }
                    }
                },
                orderBy: {
                    appointmentDate: 'desc'
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.appointment.count({ where: where });

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
        return await prisma.$transaction(async(tx) => {
            if (!appointmentId || !userId || !newData) {
                throw new AppError('Required parameters missing', 400);
            }

            const appointment = await tx.appointment.findUnique({ where: { appointmentId } });
            if (!appointment) {
                throw new AppError('Appointment not found', 404);
            }

            if (appointment.userId !== userId) {
                throw new AppError('Unauthorized', 403);
            }

            if (appointment.status === 'completed' || appointment.status === 'cancelled') {
                throw new AppError('Cannot reschedule this appointment', 400);
            }

            const oldSlot = await tx.appointmentSlot.findFirst({
                where: {
                    doctorId: appointment.doctorId,
                    appointmentDate: appointment.appointmentDate,
                    startTime: appointment.startTime
                }
            });

            if (oldSlot) {
                await tx.appointmentSlot.update({
                    where: { slotId: oldSlot.slotId },
                    data: {
                        isAvailable: true,
                        bookedBy: null
                    }
                });
            }

            // Find new slot
            const newSlot = await tx.appointmentSlot.findFirst({
                where: {
                    doctorId: appointment.doctorId,
                    appointmentDate: newData.appointmentDate,
                    startTime: newData.startTime,
                    isAvailable: true
                }
            });

            if (!newSlot) {
                throw new AppError('New slot not available', 409);
            }

            await tx.appointment.update({
                where: { appointmentId },
                data: {
                    appointmentDate: newData.appointmentDate,
                    startTime: newData.startTime,
                    endTime: newData.endTime,
                    rescheduledAt: new Date(),
                    rescheduledCount: (appointment.rescheduledCount || 0) + 1
                }
            });

            await tx.appointmentSlot.update({
                where: { slotId: newSlot.slotId },
                data: {
                    isAvailable: false,
                    bookedBy: userId
                }
            });

            await this.auditLogService.logAction({
                action: 'APPOINTMENT_RESCHEDULED',
                entityType: 'Appointment',
                entityId: appointmentId,
                userId: userId,
                details: { newDate: newData.appointmentDate }
            });

            const updatedAppointment = await tx.appointment.findUnique({ where: { appointmentId } });
            return { success: true, message: 'Rescheduled', appointment: updatedAppointment };
        });
    }

    async cancelAppointment(appointmentId, userId, reason) {
        return await prisma.$transaction(async(tx) => {
            if (!appointmentId || !userId) throw new AppError('Required params missing', 400);

            const appointment = await tx.appointment.findUnique({ where: { appointmentId } });
            if (!appointment) {
                throw new AppError('Appointment not found', 404);
            }

            if (appointment.userId !== userId && userId !== 'ADMIN') {
                throw new AppError('Unauthorized', 403);
            }

            if (appointment.status === 'cancelled') {
                throw new AppError('Already cancelled', 400);
            }

            await tx.appointment.update({
                where: { appointmentId },
                data: {
                    status: 'cancelled',
                    cancellationReason: reason || null,
                    cancelledAt: new Date()
                }
            });

            // Free up the slot
            const slot = await tx.appointmentSlot.findFirst({
                where: {
                    doctorId: appointment.doctorId,
                    appointmentDate: appointment.appointmentDate,
                    startTime: appointment.startTime
                }
            });

            if (slot) {
                await tx.appointmentSlot.update({
                    where: { slotId: slot.slotId },
                    data: {
                        isAvailable: true,
                        bookedBy: null
                    }
                });
            }

            await this.auditLogService.logAction({
                action: 'APPOINTMENT_CANCELLED',
                entityType: 'Appointment',
                entityId: appointmentId,
                userId: userId,
                details: { reason: reason }
            });

            await this.notificationService.sendNotification(userId, 'APPOINTMENT_CANCELLED', {
                appointmentId: appointmentId,
                reason: reason
            });

            return { success: true, message: 'Cancelled' };
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CONSULTATION METHODS (from ConsultationService - MERGED)
    // ═══════════════════════════════════════════════════════════════════════════════

    async createConsultation(appointmentId, consultationData) {
        return await prisma.$transaction(async(tx) => {
            if (!appointmentId || !consultationData) {
                throw new AppError('Required parameters missing', 400);
            }

            const appointment = await tx.appointment.findUnique({ where: { appointmentId } });
            if (!appointment) {
                throw new AppError('Appointment not found', 404);
            }

            const expertCall = await tx.expertCall.create({
                data: {
                    callId: this._generateCallId(),
                    appointmentId: appointmentId,
                    doctorId: appointment.doctorId,
                    userId: appointment.userId,
                    consultationType: consultationData.consultationType || 'video',
                    scheduledAt: appointment.appointmentDate,
                    meetingLink: consultationData.meetingLink || null,
                    status: 'pending',
                    createdAt: new Date()
                }
            });

            await this.auditLogService.logAction({
                action: 'CONSULTATION_CREATED',
                entityType: 'ExpertCall',
                entityId: expertCall.callId,
                userId: appointment.userId,
                details: {}
            });

            return { success: true, message: 'Consultation created', consultation: expertCall };
        });
    }

    async startConsultation(callId, userId) {
        return await prisma.$transaction(async(tx) => {
            if (!callId || !userId) throw new AppError('Required params missing', 400);

            const call = await tx.expertCall.findUnique({ where: { callId } });
            if (!call) {
                throw new AppError('Call not found', 404);
            }

            if (call.userId !== userId && userId !== 'DOCTOR') {
                throw new AppError('Unauthorized', 403);
            }

            await tx.expertCall.update({
                where: { callId },
                data: {
                    status: 'in_progress',
                    startedAt: new Date()
                }
            });

            await this.auditLogService.logAction({
                action: 'CONSULTATION_STARTED',
                entityType: 'ExpertCall',
                entityId: callId,
                userId: userId,
                details: {}
            });

            return { success: true, message: 'Consultation started' };
        });
    }

    async endConsultation(callId, userId, consultationNotes) {
        return await prisma.$transaction(async(tx) => {
            if (!callId || !userId) throw new AppError('Required params missing', 400);

            const call = await tx.expertCall.findUnique({ where: { callId } });
            if (!call) {
                throw new AppError('Call not found', 404);
            }

            const endedAt = new Date();
            const duration = endedAt - call.startedAt;
            const durationInMinutes = Math.round(duration / 60000);

            await tx.expertCall.update({
                where: { callId },
                data: {
                    status: 'completed',
                    endedAt: endedAt,
                    consultationNotes: consultationNotes || null,
                    durationInMinutes: durationInMinutes
                }
            });

            // Update appointment status
            if (call.appointmentId) {
                await tx.appointment.update({
                    where: { appointmentId: call.appointmentId },
                    data: { status: 'completed' }
                });
            }

            await this.auditLogService.logAction({
                action: 'CONSULTATION_ENDED',
                entityType: 'ExpertCall',
                entityId: callId,
                userId: userId,
                details: { duration: durationInMinutes }
            });

            return { success: true, message: 'Consultation ended' };
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SLOT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createSlots(doctorId, slotsData) {
        return await prisma.$transaction(async(tx) => {
            if (!doctorId || !slotsData) throw new AppError('Required params missing', 400);

            const slots = [];

            for (const slot of slotsData) {
                const slotRecord = await tx.appointmentSlot.create({
                    data: {
                        slotId: this._generateSlotId(),
                        doctorId: doctorId,
                        appointmentDate: slot.appointmentDate,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isAvailable: true
                    }
                });

                slots.push(slotRecord);
            }

            await this.auditLogService.logAction({
                action: 'SLOTS_CREATED',
                entityType: 'AppointmentSlot',
                entityId: 'BULK-' + Date.now(),
                userId: 'ADMIN',
                details: { doctorId: doctorId, slotCount: slots.length }
            });

            return { success: true, message: 'Slots created', slots: slots };
        });
    }

    async getAvailableSlots(doctorId, date) {
        try {
            if (!doctorId || !date) throw new AppError('Required params missing', 400);

            const slots = await prisma.appointmentSlot.findMany({
                where: {
                    doctorId: doctorId,
                    appointmentDate: date,
                    isAvailable: true
                },
                orderBy: {
                    startTime: 'asc'
                }
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
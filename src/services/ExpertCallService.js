'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERT CALL SERVICE - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class ExpertCallService {
    // ─────────────────────────────────────────────────────────────────────────────
    // SCHEDULE CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async scheduleCall(userId, doctorId, scheduledTime, duration, topic) {
        try {
            if (!userId || !doctorId || !scheduledTime) {
                return { success: false, error: 'User ID, doctor ID and scheduled time required' };
            }

            const call = await prisma.expertCall.create({
                data: {
                    userId: userId,
                    doctorId: doctorId,
                    scheduledTime: new Date(scheduledTime),
                    duration: duration || 30,
                    topic: topic || '',
                    status: 'scheduled',
                    createdAt: new Date()
                }
            });

            await cacheService.delete(`expert_calls_${userId}`);
            console.log(`✅ Call scheduled: ${call.callId}`);

            return { success: true, data: call };
        } catch (error) {
            console.error('❌ Schedule call error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET CALL HISTORY
    // ─────────────────────────────────────────────────────────────────────────────

    async getCallHistory(userId) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID required' };
            }

            const cacheKey = `expert_calls_${userId}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: cached };

            const calls = await prisma.expert_calls.findMany({
                where: { userId: userId },
                include: {
                    doctors: {
                        select: {
                            doctorId: true,
                            users: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            },
                            primarySpecialization: true
                        }
                    }
                },
                orderBy: {
                    scheduledTime: 'desc'
                }
            });

            await cacheService.set(cacheKey, calls, 86400);
            console.log(`✅ Call history retrieved: ${userId}`);

            return { success: true, data: calls };
        } catch (error) {
            console.error('❌ Get call history error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // START CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async startCall(callId) {
        try {
            if (!callId) {
                return { success: false, error: 'Call ID required' };
            }

            const call = await prisma.expertCall.findUnique({ where: { callId } });

            if (!call) {
                return { success: false, error: 'Call not found', code: 'NOT_FOUND' };
            }

            await prisma.expertCall.update({ 
                where: { callId }, 
                data: {
                    status: 'in_progress',
                    startedAt: new Date()
                }
            });

            await cacheService.delete(`expert_calls_${call.userId}`);
            console.log(`✅ Call started: ${callId}`);

            return { success: true, data: call };
        } catch (error) {
            console.error('❌ Start call error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // END CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async endCall(callId, notes) {
        try {
            if (!callId) {
                return { success: false, error: 'Call ID required' };
            }

            const call = await prisma.expertCall.findUnique({ where: { callId } });

            if (!call) {
                return { success: false, error: 'Call not found', code: 'NOT_FOUND' };
            }

            await prisma.expertCall.update({ 
                where: { callId }, 
                data: {
                    status: 'completed',
                    endedAt: new Date(),
                    notes: notes || ''
                }
            });

            await cacheService.delete(`expert_calls_${call.userId}`);
            console.log(`✅ Call ended: ${callId}`);

            return { success: true, data: call };
        } catch (error) {
            console.error('❌ End call error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CANCEL CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async cancelCall(callId) {
        try {
            if (!callId) {
                return { success: false, error: 'Call ID required' };
            }

            const call = await prisma.expertCall.findUnique({ where: { callId } });

            if (!call) {
                return { success: false, error: 'Call not found', code: 'NOT_FOUND' };
            }

            await prisma.expertCall.update({ 
                where: { callId }, 
                data: {
                    status: 'cancelled',
                    cancelledAt: new Date()
                }
            });

            await cacheService.delete(`expert_calls_${call.userId}`);
            console.log(`✅ Call cancelled: ${callId}`);

            return { success: true, message: 'Call cancelled successfully' };
        } catch (error) {
            console.error('❌ Cancel call error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET DOCTOR SCHEDULE
    // ─────────────────────────────────────────────────────────────────────────────

    async getDoctorAvailability(doctorId, date) {
        try {
            if (!doctorId || !date) {
                return { success: false, error: 'Doctor ID and date required' };
            }

            const calls = await prisma.expertCall.findMany({
                where: { doctorId: doctorId, scheduledTime: {
                        [require('sequelize').Op.gte]: new Date(date) } },
                attributes: ['scheduledTime', 'duration']
            });

            console.log(`✅ Doctor availability retrieved: ${doctorId}`);

            return { success: true, data: calls };
        } catch (error) {
            console.error('❌ Get availability error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RESCHEDULE CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async rescheduleCall(callId, newScheduledTime) {
        try {
            if (!callId || !newScheduledTime) {
                return { success: false, error: 'Call ID and new time required' };
            }

            const call = await prisma.expertCall.findUnique({ where: { callId } });

            if (!call) {
                return { success: false, error: 'Call not found', code: 'NOT_FOUND' };
            }

            await prisma.expertCall.update({ 
                where: { callId }, 
                data: {
                    scheduledTime: new Date(newScheduledTime),
                    rescheduledAt: new Date()
                }
            });

            await cacheService.delete(`expert_calls_${call.userId}`);
            console.log(`✅ Call rescheduled: ${callId}`);

            return { success: true, data: call };
        } catch (error) {
            console.error('❌ Reschedule call error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const expertCallService = new ExpertCallService();
export default new ExpertCallService();
'use strict';

import { expertCallService } from '../services/ExpertCallService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERT CALL CONTROLLER - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class ExpertCallController {
    // ─────────────────────────────────────────────────────────────────────────────
    // SCHEDULE CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async scheduleCall(req, res, next) {
        try {
            const requiredFields = ['doctorId', 'scheduledTime'];
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

            const result = await expertCallService.scheduleCall(
                req.user.userId,
                req.body.doctorId,
                req.body.scheduledTime,
                req.body.duration,
                req.body.topic
            );

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CALL_ERROR'));
            }

            console.log(`✅ Call scheduled by ${req.user.userId}`);

            return res.status(201).json(ResponseFormatter.created(result.data, 'Call scheduled successfully'));
        } catch (error) {
            console.error('❌ Schedule call error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET CALL HISTORY
    // ─────────────────────────────────────────────────────────────────────────────

    async getCallHistory(req, res, next) {
        try {
            const result = await expertCallService.getCallHistory(req.user.userId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CALL_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Call history retrieved'));
        } catch (error) {
            console.error('❌ Get history error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // START CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async startCall(req, res, next) {
        try {
            if (!req.params.callId) {
                return res.status(400).json(ResponseFormatter.error('Call ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await expertCallService.startCall(req.params.callId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'CALL_ERROR'));
            }

            console.log(`✅ Call started: ${req.params.callId}`);

            return res.status(200).json(ResponseFormatter.success(result.data, 'Call started successfully'));
        } catch (error) {
            console.error('❌ Start call error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // END CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async endCall(req, res, next) {
        try {
            if (!req.params.callId) {
                return res.status(400).json(ResponseFormatter.error('Call ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await expertCallService.endCall(req.params.callId, req.body.notes);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'CALL_ERROR'));
            }

            console.log(`✅ Call ended: ${req.params.callId}`);

            return res.status(200).json(ResponseFormatter.success(result.data, 'Call ended successfully'));
        } catch (error) {
            console.error('❌ End call error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CANCEL CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async cancelCall(req, res, next) {
        try {
            if (!req.params.callId) {
                return res.status(400).json(ResponseFormatter.error('Call ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await expertCallService.cancelCall(req.params.callId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'CALL_ERROR'));
            }

            console.log(`✅ Call cancelled: ${req.params.callId}`);

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ Cancel call error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET DOCTOR AVAILABILITY
    // ─────────────────────────────────────────────────────────────────────────────

    async getDoctorAvailability(req, res, next) {
        try {
            if (!req.params.doctorId || !req.query.date) {
                return res.status(400).json(ResponseFormatter.error('Doctor ID and date required', 400, 'VALIDATION_ERROR'));
            }

            const result = await expertCallService.getDoctorAvailability(req.params.doctorId, req.query.date);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CALL_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Doctor availability retrieved'));
        } catch (error) {
            console.error('❌ Get availability error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RESCHEDULE CALL
    // ─────────────────────────────────────────────────────────────────────────────

    async rescheduleCall(req, res, next) {
        try {
            if (!req.params.callId || !req.body.newScheduledTime) {
                return res.status(400).json(ResponseFormatter.error('Call ID and new time required', 400, 'VALIDATION_ERROR'));
            }

            const result = await expertCallService.rescheduleCall(req.params.callId, req.body.newScheduledTime);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'CALL_ERROR'));
            }

            console.log(`✅ Call rescheduled: ${req.params.callId}`);

            return res.status(200).json(ResponseFormatter.success(result.data, 'Call rescheduled successfully'));
        } catch (error) {
            console.error('❌ Reschedule call error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new ExpertCallController();
'use strict';

import { consultationService } from '../services/ConsultationService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSULTATION CONTROLLER - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class ConsultationController {
    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async createConsultation(req, res, next) {
        try {
            const requiredFields = ['doctorId', 'consultationType'];
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

            const result = await consultationService.createConsultation(
                req.user.userId,
                req.body.doctorId,
                req.body.consultationType,
                req.body.symptoms,
                req.body.notes
            );

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CONSULTATION_ERROR'));
            }

            console.log(`✅ Consultation created: ${result.data.consultationId}`);

            return res.status(201).json(ResponseFormatter.created(result.data, 'Consultation created successfully'));
        } catch (error) {
            console.error('❌ Create consultation error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET PATIENT CONSULTATIONS
    // ─────────────────────────────────────────────────────────────────────────────

    async getPatientConsultations(req, res, next) {
        try {
            const result = await consultationService.getPatientConsultations(req.user.userId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CONSULTATION_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Consultations retrieved'));
        } catch (error) {
            console.error('❌ Get consultations error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET CONSULTATION BY ID
    // ─────────────────────────────────────────────────────────────────────────────

    async getConsultationById(req, res, next) {
        try {
            if (!req.params.consultationId) {
                return res.status(400).json(ResponseFormatter.error('Consultation ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await consultationService.getConsultationById(req.params.consultationId);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, result.code || 'NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ Get consultation error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async updateConsultation(req, res, next) {
        try {
            if (!req.params.consultationId) {
                return res.status(400).json(ResponseFormatter.error('Consultation ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await consultationService.updateConsultation(
                req.params.consultationId,
                req.body.diagnosis,
                req.body.treatment,
                req.body.status
            );

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'CONSULTATION_ERROR'));
            }

            console.log(`✅ Consultation updated: ${req.params.consultationId}`);

            return res.status(200).json(ResponseFormatter.success(result.data, 'Consultation updated successfully'));
        } catch (error) {
            console.error('❌ Update consultation error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE CONSULTATION
    // ─────────────────────────────────────────────────────────────────────────────

    async deleteConsultation(req, res, next) {
        try {
            if (!req.params.consultationId) {
                return res.status(400).json(ResponseFormatter.error('Consultation ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await consultationService.deleteConsultation(req.params.consultationId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'CONSULTATION_ERROR'));
            }

            console.log(`✅ Consultation deleted: ${req.params.consultationId}`);

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ Delete consultation error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new ConsultationController();
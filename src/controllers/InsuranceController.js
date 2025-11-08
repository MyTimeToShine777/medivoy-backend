'use strict';

import InsuranceService from '../services/InsuranceService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

// ═══════════════════════════════════════════════════════════════════════════════
// INSURANCE CONTROLLER - ULTRA-COMPREHENSIVE
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

export class InsuranceController {
    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE INSURANCE PLAN
    // ─────────────────────────────────────────────────────────────────────────────

    async createInsurancePlan(req, res, next) {
        try {
            const requiredFields = ['planName', 'provider', 'totalAmount', 'coveragePercentage'];
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

            const insuranceData = {
                userId: req.user.userId,
                planName: req.body.planName,
                provider: req.body.provider,
                totalAmount: req.body.totalAmount,
                balanceAmount: req.body.totalAmount,
                coveragePercentage: req.body.coveragePercentage,
                coveredTreatments: req.body.coveredTreatments || [],
                startDate: req.body.startDate || new Date(),
                endDate: req.body.endDate,
                deductible: req.body.deductible || 0,
                copay: req.body.copay || 0,
                maxClaimAmount: req.body.maxClaimAmount || req.body.totalAmount
            };

            const result = await InsuranceService.createInsurancePlan(insuranceData);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'INSURANCE_ERROR'));
            }

            console.log(`✅ Insurance plan created: ${result.data.insuranceId}`);

            return res.status(201).json(ResponseFormatter.created(result.data, result.message));
        } catch (error) {
            console.error('❌ Create insurance plan error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET INSURANCE BY ID
    // ─────────────────────────────────────────────────────────────────────────────

    async getInsuranceById(req, res, next) {
        try {
            if (!req.params.insuranceId) {
                return res.status(400).json(ResponseFormatter.error('Insurance ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await InsuranceService.getInsuranceById(req.params.insuranceId);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, 'NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ Get insurance error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET USER INSURANCE
    // ─────────────────────────────────────────────────────────────────────────────

    async getUserInsurance(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json(ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR'));
            }

            const result = await InsuranceService.getUserInsurance(req.user.userId);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, 'NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ Get user insurance error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // VALIDATE COVERAGE
    // ─────────────────────────────────────────────────────────────────────────────

    async validateCoverage(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json(ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR'));
            }

            if (!req.body.treatmentCost || req.body.treatmentCost <= 0) {
                return res.status(400).json(ResponseFormatter.error('Valid treatment cost required', 400, 'VALIDATION_ERROR'));
            }

            const result = await InsuranceService.validateCoverage(req.user.userId, req.body.treatmentCost);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'COVERAGE_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success({
                covered: result.covered,
                partialCoverage: result.partialCoverage,
                coveredAmount: result.coveredAmount,
                remainingCost: result.remainingCost
            }, 'Coverage validated'));
        } catch (error) {
            console.error('❌ Validate coverage error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE CLAIM
    // ─────────────────────────────────────────────────────────────────────────────

    async createClaim(req, res, next) {
        try {
            if (!req.body.insuranceId || !req.body.claimAmount) {
                return res.status(400).json(ResponseFormatter.error('Insurance ID and claim amount required', 400, 'VALIDATION_ERROR'));
            }

            if (req.body.claimAmount <= 0) {
                return res.status(400).json(ResponseFormatter.error('Claim amount must be greater than 0', 400, 'VALIDATION_ERROR'));
            }

            const claimData = {
                insuranceId: req.body.insuranceId,
                claimAmount: req.body.claimAmount,
                claimDescription: req.body.claimDescription,
                claimType: req.body.claimType || 'medical',
                documents: req.body.documents || [],
                submittedAt: new Date()
            };

            const result = await InsuranceService.createClaim(claimData);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CLAIM_ERROR'));
            }

            console.log(`✅ Claim created for insurance: ${result.data.insuranceId}`);

            return res.status(201).json(ResponseFormatter.created(result.data, result.message));
        } catch (error) {
            console.error('❌ Create claim error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // APPROVE CLAIM
    // ─────────────────────────────────────────────────────────────────────────────

    async approveClaim(req, res, next) {
        try {
            if (!req.user || req.user.role !== 'ADMIN') {
                return res.status(403).json(ResponseFormatter.error('Admin access required', 403, 'AUTHORIZATION_ERROR'));
            }

            if (!req.params.insuranceId || !req.body.approvalAmount) {
                return res.status(400).json(ResponseFormatter.error('Insurance ID and approval amount required', 400, 'VALIDATION_ERROR'));
            }

            if (req.body.approvalAmount <= 0) {
                return res.status(400).json(ResponseFormatter.error('Approval amount must be greater than 0', 400, 'VALIDATION_ERROR'));
            }

            const result = await InsuranceService.approveClaim(req.params.insuranceId, req.body.approvalAmount);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CLAIM_ERROR'));
            }

            console.log(`✅ Claim approved for insurance: ${req.params.insuranceId}`);

            return res.status(200).json(ResponseFormatter.success(result.data, result.message));
        } catch (error) {
            console.error('❌ Approve claim error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // REJECT CLAIM
    // ─────────────────────────────────────────────────────────────────────────────

    async rejectClaim(req, res, next) {
        try {
            if (!req.user || req.user.role !== 'ADMIN') {
                return res.status(403).json(ResponseFormatter.error('Admin access required', 403, 'AUTHORIZATION_ERROR'));
            }

            if (!req.params.insuranceId) {
                return res.status(400).json(ResponseFormatter.error('Insurance ID required', 400, 'VALIDATION_ERROR'));
            }

            const rejectionReason = req.body.rejectionReason || 'Claim rejected by admin';

            const result = await InsuranceService.rejectClaim(req.params.insuranceId, rejectionReason);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'CLAIM_ERROR'));
            }

            console.log(`✅ Claim rejected for insurance: ${req.params.insuranceId}`);

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ Reject claim error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET TREATMENT COVERAGE
    // ─────────────────────────────────────────────────────────────────────────────

    async getTreatmentCoverage(req, res, next) {
        try {
            if (!req.params.insuranceId || !req.query.treatmentType) {
                return res.status(400).json(ResponseFormatter.error('Insurance ID and treatment type required', 400, 'VALIDATION_ERROR'));
            }

            const result = await InsuranceService.getTreatmentCoverage(req.params.insuranceId, req.query.treatmentType);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, 'NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success({
                covered: result.covered,
                coveragePercentage: result.coveragePercentage,
                message: result.message
            }));
        } catch (error) {
            console.error('❌ Get treatment coverage error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET INSURANCE STATISTICS
    // ─────────────────────────────────────────────────────────────────────────────

    async getInsuranceStats(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json(ResponseFormatter.error('User not authenticated', 401, 'AUTHENTICATION_ERROR'));
            }

            const result = await InsuranceService.getInsuranceStats(req.user.userId);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, 'NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Insurance statistics retrieved'));
        } catch (error) {
            console.error('❌ Get insurance stats error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new InsuranceController();
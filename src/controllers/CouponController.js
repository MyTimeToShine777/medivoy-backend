'use strict';

import { couponService } from '../services/CouponService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

// ═══════════════════════════════════════════════════════════════════════════════
// COUPON CONTROLLER - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class CouponController {
    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async createCoupon(req, res, next) {
        try {
            const requiredFields = ['code', 'discountType', 'discountValue', 'maxUsageCount'];
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

            const result = await couponService.createCoupon(req.body);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            console.log(`✅ Coupon created: ${result.data.couponId}`);
            return res.status(201).json(ResponseFormatter.created(result.data, 'Coupon created successfully'));
        } catch (error) {
            console.error('❌ Create error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET COUPON BY CODE
    // ─────────────────────────────────────────────────────────────────────────────

    async getCouponByCode(req, res, next) {
        try {
            if (!req.params.code) {
                return res.status(400).json(ResponseFormatter.error('Coupon code required', 400, 'VALIDATION_ERROR'));
            }

            const result = await couponService.getCouponByCode(req.params.code);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, result.code || 'NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ Get error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // VALIDATE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async validateCoupon(req, res, next) {
        try {
            if (!req.body.code || !req.body.orderAmount) {
                return res.status(400).json(ResponseFormatter.error('Code and order amount required', 400, 'VALIDATION_ERROR'));
            }

            const result = await couponService.validateCoupon(req.body.code, req.body.orderAmount);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Coupon validated successfully'));
        } catch (error) {
            console.error('❌ Validate error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // APPLY COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async applyCoupon(req, res, next) {
        try {
            if (!req.body.code) {
                return res.status(400).json(ResponseFormatter.error('Coupon code required', 400, 'VALIDATION_ERROR'));
            }

            const result = await couponService.applyCoupon(req.body.code);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, 'COUPON_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Coupon applied successfully'));
        } catch (error) {
            console.error('❌ Apply error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LIST COUPONS
    // ─────────────────────────────────────────────────────────────────────────────

    async listCoupons(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            const filters = {
                discountType: req.query.discountType
            };

            const result = await couponService.listCoupons(filters, limit, offset);

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ List error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async updateCoupon(req, res, next) {
        try {
            if (!req.params.couponId) {
                return res.status(400).json(ResponseFormatter.error('Coupon ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await couponService.updateCoupon(req.params.couponId, req.body);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Coupon updated successfully'));
        } catch (error) {
            console.error('❌ Update error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async deleteCoupon(req, res, next) {
        try {
            if (!req.params.couponId) {
                return res.status(400).json(ResponseFormatter.error('Coupon ID required', 400, 'VALIDATION_ERROR'));
            }

            const result = await couponService.deleteCoupon(req.params.couponId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ Delete error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new CouponController();
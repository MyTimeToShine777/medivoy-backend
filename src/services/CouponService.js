'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';

// ═══════════════════════════════════════════════════════════════════════════════
// COUPON SERVICE - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class CouponService {
    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async createCoupon(data) {
        try {
            const coupon = await prisma.coupon.create({
                data: {
                    code: data.code,
                    description: data.description,
                    discountType: data.discountType,
                    discountValue: data.discountValue,
                    maxUsageCount: data.maxUsageCount,
                    usageCount: 0,
                    minOrderAmount: data.minOrderAmount || 0,
                    validFrom: data.validFrom || new Date(),
                    validUpto: data.validUpto,
                    isActive: data.isActive !== false,
                    createdAt: new Date()
                }
            });

            await cacheService.delete('coupons');
            console.log(`✅ Coupon created: ${coupon.couponId}`);

            return { success: true, data: coupon };
        } catch (error) {
            console.error('❌ Create coupon error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET COUPON BY CODE
    // ─────────────────────────────────────────────────────────────────────────────

    async getCouponByCode(code) {
        try {
            const coupon = await prisma.coupon.findFirst({
                where: { code: code.toUpperCase(), isActive: true }
            });

            if (!coupon) {
                return { success: false, error: 'Coupon not found', code: 'NOT_FOUND' };
            }

            return { success: true, data: coupon };
        } catch (error) {
            console.error('❌ Get coupon error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // VALIDATE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async validateCoupon(code, orderAmount) {
        try {
            const coupon = await prisma.coupon.findFirst({
                where: { code: code.toUpperCase() }
            });

            if (!coupon) {
                return { success: false, error: 'Coupon not found', code: 'INVALID_COUPON' };
            }

            if (!coupon.isActive) {
                return { success: false, error: 'Coupon is inactive', code: 'INACTIVE_COUPON' };
            }

            if (coupon.usageCount >= coupon.maxUsageCount) {
                return { success: false, error: 'Coupon usage limit exceeded', code: 'LIMIT_EXCEEDED' };
            }

            if (orderAmount < coupon.minOrderAmount) {
                return { success: false, error: `Minimum order amount ${coupon.minOrderAmount} required`, code: 'INVALID_AMOUNT' };
            }

            const now = new Date();
            if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUpto)) {
                return { success: false, error: 'Coupon is not valid', code: 'EXPIRED' };
            }

            let discount = 0;
            if (coupon.discountType === 'percentage') {
                discount = (orderAmount * coupon.discountValue) / 100;
            } else if (coupon.discountType === 'fixed') {
                discount = coupon.discountValue;
            }

            console.log(`✅ Coupon validated: ${code}`);

            return { success: true, data: { coupon, discount, finalAmount: orderAmount - discount } };
        } catch (error) {
            console.error('❌ Validate coupon error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // APPLY COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async applyCoupon(code) {
        try {
            const coupon = await prisma.coupon.findFirst({
                where: { code: code.toUpperCase() }
            });

            if (!coupon) {
                return { success: false, error: 'Coupon not found' };
            }

            const updated = await prisma.coupon.update({
                where: { couponId: coupon.couponId },
                data: {
                    usageCount: coupon.usageCount + 1,
                    lastUsedAt: new Date()
                }
            });

            await cacheService.delete('coupons');
            console.log(`✅ Coupon applied: ${code}`);

            return { success: true, data: updated };
        } catch (error) {
            console.error('❌ Apply coupon error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LIST COUPONS
    // ─────────────────────────────────────────────────────────────────────────────

    async listCoupons(filters = {}, limit = 20, offset = 0) {
        try {
            const cacheKey = `coupons_${JSON.stringify(filters)}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: cached };

            const where = { isActive: true };
            if (filters.discountType) where.discountType = filters.discountType;

            const coupons = await prisma.coupon.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: {
                    createdAt: 'desc'
                }
            });

            await cacheService.set(cacheKey, coupons, 3600);
            return { success: true, data: coupons };
        } catch (error) {
            console.error('❌ List coupons error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async updateCoupon(couponId, data) {
        try {
            const coupon = await prisma.coupon.findUnique({
                where: { couponId }
            });

            if (!coupon) {
                return { success: false, error: 'Coupon not found', code: 'NOT_FOUND' };
            }

            const updated = await prisma.coupon.update({
                where: { couponId },
                data: {
                    description: data.description || coupon.description,
                    discountValue: data.discountValue !== undefined ? data.discountValue : coupon.discountValue,
                    maxUsageCount: data.maxUsageCount || coupon.maxUsageCount,
                    minOrderAmount: data.minOrderAmount !== undefined ? data.minOrderAmount : coupon.minOrderAmount,
                    validUpto: data.validUpto || coupon.validUpto,
                    isActive: data.isActive !== undefined ? data.isActive : coupon.isActive,
                    updatedAt: new Date()
                }
            });

            await cacheService.delete('coupons');
            console.log(`✅ Coupon updated: ${couponId}`);

            return { success: true, data: updated };
        } catch (error) {
            console.error('❌ Update coupon error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE COUPON
    // ─────────────────────────────────────────────────────────────────────────────

    async deleteCoupon(couponId) {
        try {
            const coupon = await prisma.coupon.findUnique({
                where: { couponId }
            });

            if (!coupon) {
                return { success: false, error: 'Coupon not found', code: 'NOT_FOUND' };
            }

            await prisma.coupon.delete({
                where: { couponId }
            });
            await cacheService.delete('coupons');
            console.log(`✅ Coupon deleted: ${couponId}`);

            return { success: true, message: 'Coupon deleted successfully' };
        } catch (error) {
            console.error('❌ Delete coupon error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const couponService = new CouponService();
export default new CouponService();
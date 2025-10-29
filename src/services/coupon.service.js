const Coupon = require('../models/Coupon.model');
const logger = require('../utils/logger');

class CouponService {
  /**
   * Create a new coupon
   */
  async createCoupon(data) {
    try {
      const coupon = await Coupon.create(data);
      return coupon;
    } catch (error) {
      logger.error('Create coupon service error:', error);
      throw error;
    }
  }

  /**
   * Get coupon by ID
   */
  async getCouponById(id) {
    try {
      const coupon = await Coupon.findByPk(id);
      return coupon;
    } catch (error) {
      logger.error('Get coupon by ID service error:', error);
      throw error;
    }
  }

  /**
   * Get coupon by code
   */
  async getCouponByCode(code) {
    try {
      const coupon = await Coupon.findOne({ where: { code } });
      return coupon;
    } catch (error) {
      logger.error('Get coupon by code service error:', error);
      throw error;
    }
  }

  /**
   * Update coupon
   */
  async updateCoupon(id, data) {
    try {
      const coupon = await Coupon.findByPk(id);
      if (!coupon) {
        throw new Error('Coupon not found');
      }
      
      await coupon.update(data);
      return coupon;
    } catch (error) {
      logger.error('Update coupon service error:', error);
      throw error;
    }
  }

  /**
   * Delete coupon
   */
  async deleteCoupon(id) {
    try {
      const coupon = await Coupon.findByPk(id);
      if (!coupon) {
        throw new Error('Coupon not found');
      }
      
      await coupon.destroy();
      return true;
    } catch (error) {
      logger.error('Delete coupon service error:', error);
      throw error;
    }
  }

  /**
   * Get all coupons
   */
  async getAllCoupons(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      
      const coupons = await Coupon.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return coupons;
    } catch (error) {
      logger.error('Get all coupons service error:', error);
      throw error;
    }
  }

  /**
   * Validate coupon
   */
  async validateCoupon(code) {
    try {
      const coupon = await Coupon.findOne({ where: { code } });
      if (!coupon) {
        throw new Error('Coupon not found');
      }
      
      // Check if coupon is active
      if (!coupon.isActive) {
        throw new Error('Coupon is not active');
      }
      
      // Check if coupon is expired
      const now = new Date();
      if (new Date(coupon.validFrom) > now) {
        throw new Error('Coupon is not yet valid');
      }
      
      if (new Date(coupon.validUntil) < now) {
        throw new Error('Coupon has expired');
      }
      
      // Check if coupon has reached maximum uses
      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        throw new Error('Coupon has reached maximum uses');
      }
      
      return coupon;
    } catch (error) {
      logger.error('Validate coupon service error:', error);
      throw error;
    }
  }

  /**
   * Apply coupon
   */
  async applyCoupon(code) {
    try {
      const coupon = await this.validateCoupon(code);
      
      // Increment used count
      await coupon.increment('usedCount');
      
      return coupon;
    } catch (error) {
      logger.error('Apply coupon service error:', error);
      throw error;
    }
  }
}

module.exports = new CouponService();
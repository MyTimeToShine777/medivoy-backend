const { Coupon } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class CouponService {
  async createCoupon(data) {
    try {
      const coupon = await Coupon.create(data);
      logger.info(`Coupon created: ${coupon.id}`);
      return coupon;
    } catch (error) {
      logger.error('Error creating coupon:', error);
      throw new AppError('Failed to create coupon', 500);
    }
  }

  async getCouponById(id) {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) throw new AppError('Coupon not found', 404);
    return coupon;
  }

  async getCouponByCode(code) {
    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) throw new AppError('Coupon not found', 404);
    return coupon;
  }

  async getAllCoupons(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Coupon.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { coupons: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async validateCoupon(code, amount) {
    const coupon = await this.getCouponByCode(code);
    
    // Check if coupon is active
    if (!coupon.is_active) {
      throw new AppError('Coupon is not active', 400);
    }
    
    // Check expiry date
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      throw new AppError('Coupon has expired', 400);
    }
    
    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      throw new AppError('Coupon usage limit reached', 400);
    }
    
    // Check minimum amount
    if (coupon.min_amount && amount < coupon.min_amount) {
      throw new AppError(`Minimum amount ${coupon.min_amount} required`, 400);
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (amount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }
    
    return { valid: true, discount, coupon };
  }

  async applyCoupon(code) {
    const coupon = await this.getCouponByCode(code);
    await coupon.increment('used_count');
    logger.info(`Coupon applied: ${code}`);
    return coupon;
  }

  async updateCoupon(id, data) {
    const coupon = await this.getCouponById(id);
    await coupon.update(data);
    logger.info(`Coupon updated: ${id}`);
    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await this.getCouponById(id);
    await coupon.destroy();
    logger.info(`Coupon deleted: ${id}`);
    return { message: 'Coupon deleted successfully' };
  }
}

module.exports = new CouponService();

const couponService = require('../services/coupon.service');
const { successResponse } = require('../utils/response');

class CouponController {
  async createCoupon(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      return successResponse(res, coupon, 'Coupon created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getCoupon(req, res, next) {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      return successResponse(res, coupon, 'Coupon retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllCoupons(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await couponService.getAllCoupons(filters, { page, limit });
      return successResponse(res, result, 'Coupons retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async validateCoupon(req, res, next) {
    try {
      const { code, amount } = req.body;
      const result = await couponService.validateCoupon(code, amount);
      return successResponse(res, result, 'Coupon validated successfully');
    } catch (error) {
      next(error);
    }
  }

  async applyCoupon(req, res, next) {
    try {
      const { code } = req.body;
      const coupon = await couponService.applyCoupon(code);
      return successResponse(res, coupon, 'Coupon applied successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      return successResponse(res, coupon, 'Coupon updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteCoupon(req, res, next) {
    try {
      const result = await couponService.deleteCoupon(req.params.id);
      return successResponse(res, result, 'Coupon deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CouponController();

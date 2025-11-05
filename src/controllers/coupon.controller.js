const Coupon = require('../models/Coupon.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class CouponController {
  /**
   * Create a new coupon
   */
  static async createCoupon(req, res) {
    try {
      const {
        code,
        discountType,
        discountValue,
        validFrom,
        validUntil,
        maxUses,
        usedCount,
      } = req.body;

      // Create coupon
      const coupon = await Coupon.create({
        code,
        discountType,
        discountValue,
        validFrom,
        validUntil,
        maxUses,
        usedCount,
      });

      return successResponse(
        res,
        {
          message: 'Coupon created successfully',
          data: coupon,
        },
        201
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to create coupon');
    }
  }

  /**
   * Get coupon by ID
   */
  static async getCoupon(req, res) {
    try {
      const { id } = req.params;

      // Find coupon
      const coupon = await Coupon.findByPk(id);

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: 'Coupon not found',
          },
          404
        );
      }

      return successResponse(res, {
        message: 'Coupon retrieved successfully',
        data: coupon,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve coupon');
    }
  }

  /**
   * Get all coupons
   */
  static async getAllCoupons(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      // Get coupons with pagination
      const coupons = await Coupon.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Coupons retrieved successfully',
        data: coupons.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(coupons.count / parseInt(limit, 10)),
          totalRecords: coupons.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve coupons');
    }
  }

  /**
   * Validate coupon
   */
  static async validateCoupon(req, res) {
    try {
      const { code } = req.params;

      // Find coupon by code
      const coupon = await Coupon.findOne({ where: { code } });

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: 'Coupon not found',
          },
          404
        );
      }

      // Check if coupon is valid
      const now = new Date();
      if (new Date(coupon.validFrom) > now) {
        return errorResponse(
          res,
          {
            message: 'Coupon is not yet valid',
          },
          400
        );
      }

      if (new Date(coupon.validUntil) < now) {
        return errorResponse(
          res,
          {
            message: 'Coupon has expired',
          },
          400
        );
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return errorResponse(
          res,
          {
            message: 'Coupon has reached maximum uses',
          },
          400
        );
      }

      return successResponse(res, {
        message: 'Coupon is valid',
        data: coupon,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to validate coupon');
    }
  }

  /**
   * Apply coupon
   */
  static async applyCoupon(req, res) {
    try {
      const { code } = req.params;

      // Find coupon by code
      const coupon = await Coupon.findOne({ where: { code } });

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: 'Coupon not found',
          },
          404
        );
      }

      // Check if coupon is valid
      const now = new Date();
      if (new Date(coupon.validFrom) > now) {
        return errorResponse(
          res,
          {
            message: 'Coupon is not yet valid',
          },
          400
        );
      }

      if (new Date(coupon.validUntil) < now) {
        return errorResponse(
          res,
          {
            message: 'Coupon has expired',
          },
          400
        );
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return errorResponse(
          res,
          {
            message: 'Coupon has reached maximum uses',
          },
          400
        );
      }

      // Increment used count
      await coupon.increment('usedCount');

      return successResponse(res, {
        message: 'Coupon applied successfully',
        data: coupon,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to apply coupon');
    }
  }

  /**
   * Update coupon
   */
  static async updateCoupon(req, res) {
    try {
      const { id } = req.params;
      const {
        code,
        discountType,
        discountValue,
        validFrom,
        validUntil,
        maxUses,
      } = req.body;

      // Find coupon
      const coupon = await Coupon.findByPk(id);

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: 'Coupon not found',
          },
          404
        );
      }

      // Update coupon
      await coupon.update({
        code,
        discountType,
        discountValue,
        validFrom,
        validUntil,
        maxUses,
      });

      return successResponse(res, {
        message: 'Coupon updated successfully',
        data: coupon,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to update coupon');
    }
  }

  /**
   * Delete coupon
   */
  static async deleteCoupon(req, res) {
    try {
      const { id } = req.params;

      // Find coupon
      const coupon = await Coupon.findByPk(id);

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: 'Coupon not found',
          },
          404
        );
      }

      // Delete coupon
      await coupon.destroy();

      return successResponse(res, {
        message: 'Coupon deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to delete coupon');
    }
  }
}

module.exports = CouponController;

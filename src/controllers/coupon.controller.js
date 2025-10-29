const Coupon = require("../models/Coupon.model");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

class CouponController {
  /**
   * Create a new coupon
   */
  async createCoupon(req, res) {
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
          message: "Coupon created successfully",
          data: coupon,
        },
        201,
      );
    } catch (error) {
      logger.error("Create coupon error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to create coupon",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get coupon by ID
   */
  async getCoupon(req, res) {
    try {
      const { id } = req.params;

      // Find coupon
      const coupon = await Coupon.findByPk(id);

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: "Coupon not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Coupon retrieved successfully",
        data: coupon,
      });
    } catch (error) {
      logger.error("Get coupon error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to retrieve coupon",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get all coupons
   */
  async getAllCoupons(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      // Get coupons with pagination
      const coupons = await Coupon.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Coupons retrieved successfully",
        data: coupons.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(coupons.count / parseInt(limit, 10)),
          totalRecords: coupons.count,
        },
      });
    } catch (error) {
      logger.error("Get all coupons error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to retrieve coupons",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Validate coupon
   */
  async validateCoupon(req, res) {
    try {
      const { code } = req.params;

      // Find coupon by code
      const coupon = await Coupon.findOne({ where: { code } });

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: "Coupon not found",
          },
          404,
        );
      }

      // Check if coupon is valid
      const now = new Date();
      if (new Date(coupon.validFrom) > now) {
        return errorResponse(
          res,
          {
            message: "Coupon is not yet valid",
          },
          400,
        );
      }

      if (new Date(coupon.validUntil) < now) {
        return errorResponse(
          res,
          {
            message: "Coupon has expired",
          },
          400,
        );
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return errorResponse(
          res,
          {
            message: "Coupon has reached maximum uses",
          },
          400,
        );
      }

      return successResponse(res, {
        message: "Coupon is valid",
        data: coupon,
      });
    } catch (error) {
      logger.error("Validate coupon error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to validate coupon",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Apply coupon
   */
  async applyCoupon(req, res) {
    try {
      const { code } = req.params;

      // Find coupon by code
      const coupon = await Coupon.findOne({ where: { code } });

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: "Coupon not found",
          },
          404,
        );
      }

      // Check if coupon is valid
      const now = new Date();
      if (new Date(coupon.validFrom) > now) {
        return errorResponse(
          res,
          {
            message: "Coupon is not yet valid",
          },
          400,
        );
      }

      if (new Date(coupon.validUntil) < now) {
        return errorResponse(
          res,
          {
            message: "Coupon has expired",
          },
          400,
        );
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return errorResponse(
          res,
          {
            message: "Coupon has reached maximum uses",
          },
          400,
        );
      }

      // Increment used count
      await coupon.increment("usedCount");

      return successResponse(res, {
        message: "Coupon applied successfully",
        data: coupon,
      });
    } catch (error) {
      logger.error("Apply coupon error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to apply coupon",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Update coupon
   */
  async updateCoupon(req, res) {
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
            message: "Coupon not found",
          },
          404,
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
        message: "Coupon updated successfully",
        data: coupon,
      });
    } catch (error) {
      logger.error("Update coupon error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to update coupon",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Delete coupon
   */
  async deleteCoupon(req, res) {
    try {
      const { id } = req.params;

      // Find coupon
      const coupon = await Coupon.findByPk(id);

      if (!coupon) {
        return errorResponse(
          res,
          {
            message: "Coupon not found",
          },
          404,
        );
      }

      // Delete coupon
      await coupon.destroy();

      return successResponse(res, {
        message: "Coupon deleted successfully",
      });
    } catch (error) {
      logger.error("Delete coupon error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to delete coupon",
          error: error.message,
        },
        500,
      );
    }
  }
}

module.exports = new CouponController();

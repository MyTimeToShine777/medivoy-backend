const Subscription = require("../models/Subscription.model");
const SubscriptionPlan = require("../models/SubscriptionPlan.model");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class SubscriptionController {
  /**
   * Create a new subscription
   */
  static async createSubscription(req, res) {
    try {
      const { userId, planId, startDate, endDate, isActive } = req.body;

      // Find subscription plan
      const plan = await SubscriptionPlan.findByPk(planId);
      if (!plan) {
        return errorResponse(
          res,
          {
            message: "Subscription plan not found",
          },
          404,
        );
      }

      // Create subscription
      const subscription = await Subscription.create({
        userId,
        planId,
        startDate,
        endDate,
        isActive,
        planName: plan.name,
        planPrice: plan.price,
        planFeatures: plan.features,
      });

      return successResponse(
        res,
        {
          message: "Subscription created successfully",
          data: subscription,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get subscription by ID
   */
  static async getSubscription(req, res) {
    try {
      const { id } = req.params;

      // Find subscription
      const subscription = await Subscription.findByPk(id);

      if (!subscription) {
        return errorResponse(
          res,
          {
            message: "Subscription not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Subscription retrieved successfully",
        data: subscription,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update subscription
   */
  static async updateSubscription(req, res) {
    try {
      const { id } = req.params;
      const { isActive, endDate } = req.body;

      // Find subscription
      const subscription = await Subscription.findByPk(id);

      if (!subscription) {
        return errorResponse(
          res,
          {
            message: "Subscription not found",
          },
          404,
        );
      }

      // Update subscription
      await subscription.update({
        isActive,
        endDate,
      });

      return successResponse(res, {
        message: "Subscription updated successfully",
        data: subscription,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(req, res) {
    try {
      const { id } = req.params;

      // Find subscription
      const subscription = await Subscription.findByPk(id);

      if (!subscription) {
        return errorResponse(
          res,
          {
            message: "Subscription not found",
          },
          404,
        );
      }

      // Cancel subscription
      await subscription.update({
        isActive: false,
        cancelledAt: new Date(),
      });

      return successResponse(res, {
        message: "Subscription cancelled successfully",
        data: subscription,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all subscriptions for a user
   */
  static async getUserSubscriptions(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = { userId };
      if (isActive !== undefined) where.isActive = isActive === "true";

      // Get subscriptions with pagination
      const subscriptions = await Subscription.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Subscriptions retrieved successfully",
        data: subscriptions.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(subscriptions.count / parseInt(limit, 10)),
          totalRecords: subscriptions.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all subscription plans
   */
  static async getSubscriptionPlans(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;

      // Build where clause
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === "true";

      // Get subscription plans with pagination
      const plans = await SubscriptionPlan.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Subscription plans retrieved successfully",
        data: plans.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(plans.count / parseInt(limit, 10)),
          totalRecords: plans.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete subscription (admin only)
   */
  static async deleteSubscription(req, res) {
    try {
      const { id } = req.params;

      // Find subscription
      const subscription = await Subscription.findByPk(id);

      if (!subscription) {
        return errorResponse(
          res,
          {
            message: "Subscription not found",
            code: "SUBSCRIPTION_NOT_FOUND",
          },
          404,
        );
      }

      // Delete subscription
      await subscription.destroy();

      return successResponse(res, {
        message: "Subscription deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Renew subscription
   */
  static async renewSubscription(req, res) {
    try {
      const { id } = req.params;

      // Find subscription
      const subscription = await Subscription.findByPk(id);

      if (!subscription) {
        return errorResponse(
          res,
          {
            message: "Subscription not found",
            code: "SUBSCRIPTION_NOT_FOUND",
          },
          404,
        );
      }

      // Calculate new end date based on plan duration
      const plan = await SubscriptionPlan.findByPk(subscription.plan_id);
      const newEndDate = new Date();
      newEndDate.setMonth(newEndDate.getMonth() + (plan.duration_months || 1));

      // Update subscription
      await subscription.update({
        end_date: newEndDate,
        status: "active",
      });

      return successResponse(res, {
        message: "Subscription renewed successfully",
        data: subscription,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = SubscriptionController;

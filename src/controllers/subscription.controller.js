const subscriptionService = require('../services/subscription.service');
const { successResponse } = require('../utils/response');

class SubscriptionController {
  async createSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.createSubscription(req.body);
      return successResponse(res, subscription, 'Subscription created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.getSubscriptionById(req.params.id);
      return successResponse(res, subscription, 'Subscription retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllSubscriptions(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await subscriptionService.getAllSubscriptions(filters, { page, limit });
      return successResponse(res, result, 'Subscriptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
      return successResponse(res, subscription, 'Subscription updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelSubscription(req, res, next) {
    try {
      const { reason } = req.body;
      const subscription = await subscriptionService.cancelSubscription(req.params.id, reason);
      return successResponse(res, subscription, 'Subscription cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async renewSubscription(req, res, next) {
    try {
      const subscription = await subscriptionService.renewSubscription(req.params.id);
      return successResponse(res, subscription, 'Subscription renewed successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteSubscription(req, res, next) {
    try {
      const result = await subscriptionService.deleteSubscription(req.params.id);
      return successResponse(res, result, 'Subscription deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubscriptionController();

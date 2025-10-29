const Subscription = require('../models/Subscription.model');
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const logger = require('../utils/logger');

class SubscriptionService {
  /**
   * Create a new subscription
   */
  async createSubscription(data) {
    try {
      // Find subscription plan
      const plan = await SubscriptionPlan.findByPk(data.planId);
      if (!plan) {
        throw new Error('Subscription plan not found');
      }
      
      // Add plan details to subscription data
      const subscriptionData = {
        ...data,
        planName: plan.name,
        planPrice: plan.price,
        planFeatures: plan.features,
      };
      
      const subscription = await Subscription.create(subscriptionData);
      return subscription;
    } catch (error) {
      logger.error('Create subscription service error:', error);
      throw error;
    }
  }

  /**
   * Get subscription by ID
   */
  async getSubscriptionById(id) {
    try {
      const subscription = await Subscription.findByPk(id);
      return subscription;
    } catch (error) {
      logger.error('Get subscription by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(id, data) {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      await subscription.update(data);
      return subscription;
    } catch (error) {
      logger.error('Update subscription service error:', error);
      throw error;
    }
  }

  /**
   * Delete subscription
   */
  async deleteSubscription(id) {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      await subscription.destroy();
      return true;
    } catch (error) {
      logger.error('Delete subscription service error:', error);
      throw error;
    }
  }

  /**
   * Get all subscriptions for a user
   */
  async getUserSubscriptions(userId, filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      where.userId = userId;
      
      const subscriptions = await Subscription.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return subscriptions;
    } catch (error) {
      logger.error('Get user subscriptions service error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(id) {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      
      await subscription.update({
        isActive: false,
        cancelledAt: new Date(),
      });
      
      return subscription;
    } catch (error) {
      logger.error('Cancel subscription service error:', error);
      throw error;
    }
  }
}

module.exports = new SubscriptionService();
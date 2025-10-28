const { Subscription, SubscriptionPlan, User } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class SubscriptionService {
  async createSubscription(data) {
    try {
      const subscription = await Subscription.create(data);
      logger.info(`Subscription created: ${subscription.id}`);
      return subscription;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new AppError('Failed to create subscription', 500);
    }
  }

  async getSubscriptionById(id) {
    const subscription = await Subscription.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: SubscriptionPlan, as: 'plan' }
      ]
    });
    if (!subscription) throw new AppError('Subscription not found', 404);
    return subscription;
  }

  async getAllSubscriptions(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Subscription.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: User, as: 'user' },
        { model: SubscriptionPlan, as: 'plan' }
      ],
      order: [['created_at', 'DESC']]
    });
    return { subscriptions: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateSubscription(id, data) {
    const subscription = await this.getSubscriptionById(id);
    await subscription.update(data);
    logger.info(`Subscription updated: ${id}`);
    return subscription;
  }

  async cancelSubscription(id, reason) {
    const subscription = await this.getSubscriptionById(id);
    await subscription.update({
      status: 'cancelled',
      cancelled_at: new Date(),
      cancellation_reason: reason
    });
    logger.info(`Subscription cancelled: ${id}`);
    return subscription;
  }

  async renewSubscription(id) {
    const subscription = await this.getSubscriptionById(id);
    const plan = await SubscriptionPlan.findByPk(subscription.plan_id);
    
    const newEndDate = new Date(subscription.end_date);
    newEndDate.setMonth(newEndDate.getMonth() + plan.duration_months);
    
    await subscription.update({
      status: 'active',
      end_date: newEndDate,
      renewed_at: new Date()
    });
    
    logger.info(`Subscription renewed: ${id}`);
    return subscription;
  }

  async deleteSubscription(id) {
    const subscription = await this.getSubscriptionById(id);
    await subscription.destroy();
    logger.info(`Subscription deleted: ${id}`);
    return { message: 'Subscription deleted successfully' };
  }
}

module.exports = new SubscriptionService();

const Payment = require('../models/Payment.model');
const logger = require('../utils/logger');

class PaymentService {
  /**
   * Create a new payment
   */
  async createPayment(data) {
    try {
      const payment = await Payment.create(data);
      return payment;
    } catch (error) {
      logger.error('Create payment service error:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id) {
    try {
      const payment = await Payment.findByPk(id);
      return payment;
    } catch (error) {
      logger.error('Get payment by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update payment
   */
  async updatePayment(id, data) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      await payment.update(data);
      return payment;
    } catch (error) {
      logger.error('Update payment service error:', error);
      throw error;
    }
  }

  /**
   * Delete payment
   */
  async deletePayment(id) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      await payment.destroy();
      return true;
    } catch (error) {
      logger.error('Delete payment service error:', error);
      throw error;
    }
  }

  /**
   * Get all payments
   */
  async getAllPayments(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const payments = await Payment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return payments;
    } catch (error) {
      logger.error('Get all payments service error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();

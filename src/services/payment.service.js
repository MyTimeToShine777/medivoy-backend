const { Payment, Invoice, Booking } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class PaymentService {
  async createPayment(paymentData) {
    try {
      const payment = await Payment.create(paymentData);
      logger.info(`Payment created: ${payment.id}`);
      return payment;
    } catch (error) {
      logger.error('Error creating payment:', error);
      throw new AppError('Failed to create payment', 500);
    }
  }

  async getPaymentById(paymentId) {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Booking, as: 'booking' },
        { model: Invoice, as: 'invoice' }
      ]
    });
    
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    
    return payment;
  }

  async processStripePayment(paymentData) {
    try {
      // TODO: Implement Stripe payment processing
      const payment = await this.createPayment({
        ...paymentData,
        payment_method: 'stripe',
        status: 'pending'
      });
      
      // Simulate Stripe processing
      await payment.update({
        status: 'completed',
        transaction_id: `stripe_${Date.now()}`,
        paid_at: new Date()
      });
      
      logger.info(`Stripe payment processed: ${payment.id}`);
      return payment;
    } catch (error) {
      logger.error('Error processing Stripe payment:', error);
      throw new AppError('Failed to process payment', 500);
    }
  }

  async processRazorpayPayment(paymentData) {
    try {
      // TODO: Implement Razorpay payment processing
      const payment = await this.createPayment({
        ...paymentData,
        payment_method: 'razorpay',
        status: 'pending'
      });
      
      // Simulate Razorpay processing
      await payment.update({
        status: 'completed',
        transaction_id: `razorpay_${Date.now()}`,
        paid_at: new Date()
      });
      
      logger.info(`Razorpay payment processed: ${payment.id}`);
      return payment;
    } catch (error) {
      logger.error('Error processing Razorpay payment:', error);
      throw new AppError('Failed to process payment', 500);
    }
  }

  async refundPayment(paymentId, refundAmount, reason) {
    const payment = await this.getPaymentById(paymentId);
    
    if (payment.status !== 'completed') {
      throw new AppError('Only completed payments can be refunded', 400);
    }
    
    // TODO: Implement actual refund logic with payment gateway
    await payment.update({
      status: 'refunded',
      refund_amount: refundAmount,
      refund_reason: reason,
      refunded_at: new Date()
    });
    
    logger.info(`Payment refunded: ${paymentId}`);
    return payment;
  }

  async getAllPayments(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Booking, as: 'booking' },
        { model: Invoice, as: 'invoice' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      payments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async verifyPayment(paymentId, verificationData) {
    const payment = await this.getPaymentById(paymentId);
    await payment.update({
      is_verified: true,
      verification_data: verificationData,
      verified_at: new Date()
    });
    logger.info(`Payment verified: ${paymentId}`);
    return payment;
  }
}

module.exports = new PaymentService();

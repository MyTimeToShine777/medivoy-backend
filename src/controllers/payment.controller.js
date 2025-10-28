const paymentService = require('../services/payment.service');
const { successResponse } = require('../utils/response');

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const payment = await paymentService.createPayment(req.body);
      return successResponse(res, payment, 'Payment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req, res, next) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      return successResponse(res, payment, 'Payment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async processStripePayment(req, res, next) {
    try {
      const payment = await paymentService.processStripePayment(req.body);
      return successResponse(res, payment, 'Stripe payment processed successfully');
    } catch (error) {
      next(error);
    }
  }

  async processRazorpayPayment(req, res, next) {
    try {
      const payment = await paymentService.processRazorpayPayment(req.body);
      return successResponse(res, payment, 'Razorpay payment processed successfully');
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req, res, next) {
    try {
      const { refundAmount, reason } = req.body;
      const payment = await paymentService.refundPayment(req.params.id, refundAmount, reason);
      return successResponse(res, payment, 'Payment refunded successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await paymentService.getAllPayments(filters, { page, limit });
      return successResponse(res, result, 'Payments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const payment = await paymentService.verifyPayment(req.params.id, req.body);
      return successResponse(res, payment, 'Payment verified successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();

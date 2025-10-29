const Payment = require('../models/Payment.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class PaymentController {
  /**
   * Create a new payment
   */
  async createPayment(req, res) {
    try {
      const {
        bookingId, patientId, amount, currency, paymentMethod, transactionId,
      } = req.body;

      // Create payment
      const payment = await Payment.create({
        bookingId,
        patientId,
        amount,
        currency,
        paymentMethod,
        transactionId,
      });

      return successResponse(res, {
        message: 'Payment created successfully',
        data: payment,
      }, 201);
    } catch (error) {
      logger.error('Create payment error:', error);
      return errorResponse(res, {
        message: 'Failed to create payment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(req, res) {
    try {
      const { id } = req.params;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(res, {
          message: 'Payment not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'Payment retrieved successfully',
        data: payment,
      });
    } catch (error) {
      logger.error('Get payment error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve payment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update payment
   */
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(res, {
          message: 'Payment not found',
        }, 404);
      }

      // Update payment
      await payment.update({
        status,
        transactionId,
      });

      return successResponse(res, {
        message: 'Payment updated successfully',
        data: payment,
      });
    } catch (error) {
      logger.error('Update payment error:', error);
      return errorResponse(res, {
        message: 'Failed to update payment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete payment
   */
  async deletePayment(req, res) {
    try {
      const { id } = req.params;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(res, {
          message: 'Payment not found',
        }, 404);
      }

      // Delete payment
      await payment.destroy();

      return successResponse(res, {
        message: 'Payment deleted successfully',
      });
    } catch (error) {
      logger.error('Delete payment error:', error);
      return errorResponse(res, {
        message: 'Failed to delete payment',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all payments
   */
  async getAllPayments(req, res) {
    try {
      const {
        page = 1, limit = 10, status, patientId,
      } = req.query;

      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (patientId) where.patientId = patientId;

      // Get payments with pagination
      const payments = await Payment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Payments retrieved successfully',
        data: payments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(payments.count / parseInt(limit, 10)),
          totalRecords: payments.count,
        },
      });
    } catch (error) {
      logger.error('Get all payments error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve payments',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Process payment refund
   */
  async processRefund(req, res) {
    try {
      const { id } = req.params;
      const { refundAmount, refundReason } = req.body;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(res, {
          message: 'Payment not found',
        }, 404);
      }

      // Process refund
      // Note: This would integrate with Stripe/Razorpay APIs
      const refundTransactionId = `refund_${Date.now()}`; // Placeholder

      // Update payment with refund details
      await payment.update({
        refundAmount,
        refundReason,
        refundTransactionId,
        status: 'refunded',
      });

      return successResponse(res, {
        message: 'Payment refund processed successfully',
        data: payment,
      });
    } catch (error) {
      logger.error('Process payment refund error:', error);
      return errorResponse(res, {
        message: 'Failed to process payment refund',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new PaymentController();

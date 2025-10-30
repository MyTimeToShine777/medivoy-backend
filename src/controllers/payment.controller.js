const Payment = require("../models/Payment.model");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class PaymentController {
  /**
   * Create a new payment
   */
  static async createPayment(req, res) {
    try {
      const {
        bookingId,
        patientId,
        amount,
        currency,
        paymentMethod,
        transactionId,
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

      return successResponse(
        res,
        {
          message: "Payment created successfully",
          data: payment,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get payment by ID
   */
  static async getPayment(req, res) {
    try {
      const { id } = req.params;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(
          res,
          {
            message: "Payment not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Payment retrieved successfully",
        data: payment,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update payment
   */
  static async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(
          res,
          {
            message: "Payment not found",
          },
          404,
        );
      }

      // Update payment
      await payment.update({
        status,
        transactionId,
      });

      return successResponse(res, {
        message: "Payment updated successfully",
        data: payment,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete payment
   */
  static async deletePayment(req, res) {
    try {
      const { id } = req.params;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(
          res,
          {
            message: "Payment not found",
          },
          404,
        );
      }

      // Delete payment
      await payment.destroy();

      return successResponse(res, {
        message: "Payment deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all payments
   */
  static async getAllPayments(req, res) {
    try {
      const { page = 1, limit = 10, status, patientId } = req.query;

      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (patientId) where.patientId = patientId;

      // Get payments with pagination
      const payments = await Payment.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Payments retrieved successfully",
        data: payments.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(payments.count / parseInt(limit, 10)),
          totalRecords: payments.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Process payment refund
   */
  static async processRefund(req, res) {
    try {
      const { id } = req.params;
      const { refundAmount, refundReason } = req.body;

      // Find payment
      const payment = await Payment.findByPk(id);

      if (!payment) {
        return errorResponse(
          res,
          {
            message: "Payment not found",
          },
          404,
        );
      }

      // Process refund
      // Note: This would integrate with Stripe/Razorpay APIs
      const refundTransactionId = `refund_${Date.now()}`; // Placeholder

      // Update payment with refund details
      await payment.update({
        refundAmount,
        refundReason,
        refundTransactionId,
        status: "refunded",
      });

      return successResponse(res, {
        message: "Payment refund processed successfully",
        data: payment,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = PaymentController;

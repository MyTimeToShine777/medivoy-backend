// Payment Controller - Stripe & Razorpay - NO optional chaining
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import PaymentService from '../services/PaymentService.js';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import logger from '../utils/logger.js';

class PaymentController {
    // Create Stripe payment
    createStripePayment = asyncHandler(async(req, res) => {
        try {
            const userId = req.user.userId;
            const { bookingId, amount, currency } = req.body;

            if (!bookingId || !amount || !currency) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID, amount, and currency are required');
            }

            const result = await PaymentService.createStripePayment(bookingId, userId, amount, currency);
            return sendSuccess(res, HTTP_STATUS.CREATED, 'Stripe payment initiated', result);
        } catch (error) {
            logger.error('Create Stripe payment error:', error.message);
            throw error;
        }
    });

    // Create Razorpay payment
    createRazorpayPayment = asyncHandler(async(req, res) => {
        try {
            const userId = req.user.userId;
            const { bookingId, amount, currency } = req.body;

            if (!bookingId || !amount || !currency) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID, amount, and currency are required');
            }

            const result = await PaymentService.createRazorpayPayment(bookingId, userId, amount, currency);
            return sendSuccess(res, HTTP_STATUS.CREATED, 'Razorpay payment initiated', result);
        } catch (error) {
            logger.error('Create Razorpay payment error:', error.message);
            throw error;
        }
    });

    // Verify Stripe payment
    verifyStripePayment = asyncHandler(async(req, res) => {
        try {
            const { paymentId, paymentIntentId } = req.body;

            if (!paymentId || !paymentIntentId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Payment ID and intent ID are required');
            }

            const result = await PaymentService.verifyStripePayment(paymentId, paymentIntentId);
            return sendSuccess(res, HTTP_STATUS.OK, 'Stripe payment verified', result);
        } catch (error) {
            logger.error('Verify Stripe payment error:', error.message);
            throw error;
        }
    });

    // Verify Razorpay payment
    verifyRazorpayPayment = asyncHandler(async(req, res) => {
        try {
            const { paymentId, razorpayPaymentId, razorpaySignature } = req.body;

            if (!paymentId || !razorpayPaymentId || !razorpaySignature) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Payment details are required');
            }

            const result = await PaymentService.verifyRazorpayPayment(paymentId, razorpayPaymentId, razorpaySignature);
            return sendSuccess(res, HTTP_STATUS.OK, 'Razorpay payment verified', result);
        } catch (error) {
            logger.error('Verify Razorpay payment error:', error.message);
            throw error;
        }
    });

    // Get payment history
    getPaymentHistory = asyncHandler(async(req, res) => {
        try {
            const userId = req.user.userId;
            const { page, limit } = req.query;

            const result = await PaymentService.getPaymentHistory(userId, page, limit);
            return sendPaginatedSuccess(res, HTTP_STATUS.OK, 'Payment history retrieved', result.data, result.pagination);
        } catch (error) {
            logger.error('Get payment history error:', error.message);
            throw error;
        }
    });

    // Generate invoice
    generateInvoice = asyncHandler(async(req, res) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Booking ID is required');
            }

            const result = await PaymentService.generateInvoice(parseInt(bookingId));
            return sendSuccess(res, HTTP_STATUS.CREATED, 'Invoice generated', result);
        } catch (error) {
            logger.error('Generate invoice error:', error.message);
            throw error;
        }
    });

    // Refund payment
    refundPayment = asyncHandler(async(req, res) => {
        try {
            const { paymentId, reason } = req.body;

            if (!paymentId) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Payment ID is required');
            }

            const result = await PaymentService.refundPayment(paymentId, reason);
            return sendSuccess(res, HTTP_STATUS.OK, 'Payment refunded', result);
        } catch (error) {
            logger.error('Refund payment error:', error.message);
            throw error;
        }
    });
}

export default new PaymentController();
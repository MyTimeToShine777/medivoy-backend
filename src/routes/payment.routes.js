// Payment Routes - Stripe & Razorpay - NO optional chaining
import express from 'express';
import PaymentController from '../controllers/PaymentController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import Joi from 'joi';

const router = express.Router();

const createPaymentSchema = Joi.object({
    bookingId: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).required(),
});

const verifyPaymentSchema = Joi.object({
    paymentId: Joi.number().integer().required(),
});

const refundPaymentSchema = Joi.object({
    paymentId: Joi.number().integer().required(),
    reason: Joi.string().optional(),
});

/**
 * @swagger
 * /payments/stripe:
 *   post:
 *     summary: Create Stripe payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       201:
 *         description: Payment initiated
 */
router.post('/stripe', authMiddleware, validateRequest(createPaymentSchema, 'body'), PaymentController.createStripePayment);

/**
 * @swagger
 * /payments/razorpay:
 *   post:
 *     summary: Create Razorpay payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 */
router.post('/razorpay', authMiddleware, validateRequest(createPaymentSchema, 'body'), PaymentController.createRazorpayPayment);

/**
 * @swagger
 * /payments/verify-stripe:
 *   post:
 *     summary: Verify Stripe payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 */
router.post('/verify-stripe', authMiddleware, PaymentController.verifyStripePayment);

/**
 * @swagger
 * /payments/verify-razorpay:
 *   post:
 *     summary: Verify Razorpay payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 */
router.post('/verify-razorpay', authMiddleware, PaymentController.verifyRazorpayPayment);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
router.get('/history', authMiddleware, PaymentController.getPaymentHistory);

/**
 * @swagger
 * /payments/{bookingId}/invoice:
 *   post:
 *     summary: Generate invoice
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 */
router.post('/:bookingId/invoice', authMiddleware, PaymentController.generateInvoice);

/**
 * @swagger
 * /payments/refund:
 *   post:
 *     summary: Refund payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 */
router.post('/refund', authMiddleware, validateRequest(refundPaymentSchema, 'body'), PaymentController.refundPayment);

export default router;
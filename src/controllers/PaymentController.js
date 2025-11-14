'use strict';

import paymentGatewayService from '../services/PaymentGatewayService.js';
import { AppError } from '../utils/errors/AppError.js';

export class PaymentController {
    constructor() {
        this.paymentService = paymentGatewayService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PAYMENT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createPayment(req, res) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.bookingId;
            const paymentData = req.body;

            const result = await this.paymentService.createPayment(userId, bookingId, paymentData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Payment initiated',
                data: {
                    paymentId: result.paymentId,
                    gatewayPaymentId: result.gatewayPaymentId,
                    gateway: result.gateway,
                    amount: result.amount,
                    currency: result.currency
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async verifyPayment(req, res) {
        try {
            const paymentId = req.params.paymentId;
            const verificationData = req.body;

            const result = await this.paymentService.verifyPayment(paymentId, verificationData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verified',
                data: result.payment
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async refundPayment(req, res) {
        try {
            const paymentId = req.params.paymentId;
            const userId = req.user.userId;
            const refundData = req.body;

            const result = await this.paymentService.refundPayment(paymentId, userId, refundData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Refund processed',
                data: result.payment
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async createSubscription(req, res) {
        try {
            const userId = req.user.userId;
            const subscriptionData = req.body;

            const result = await this.paymentService.createSubscription(userId, subscriptionData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Subscription created',
                data: {
                    subscriptionId: result.subscriptionId,
                    gateway: result.gateway
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // WEBHOOK HANDLERS
    // ═══════════════════════════════════════════════════════════════════════════════

    async handleRazorpayWebhook(req, res) {
        try {
            const webhookData = req.body;
            const signature = req.headers['x-razorpay-signature'];

            const result = await this.paymentService.handleRazorpayWebhook(webhookData, signature);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Webhook processed'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async handleStripeWebhook(req, res) {
        try {
            const webhookData = req.body;
            const signature = req.headers['stripe-signature'];

            const result = await this.paymentService.handleStripeWebhook(webhookData, signature);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Webhook processed'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new PaymentController();
'use strict';

import { Op, sequelize } from 'sequelize';
import { Payment, Booking, User, AuditLog } from '../models/index.js';
import { ValidationService } from './ValidationService.js';
import { NotificationService } from './NotificationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';
import Razorpay from 'razorpay';
import Stripe from 'stripe';

// CONSOLIDATED: RazorpayService + StripeService + PaymentService
export class PaymentGatewayService {
    constructor() {
        this.validationService = new ValidationService();
        this.notificationService = new NotificationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();

        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PAYMENT CREATION (Auto-select gateway by currency)
    // ═══════════════════════════════════════════════════════════════════════════════

    async createPayment(userId, bookingId, paymentData) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !bookingId || !paymentData) {
                throw new AppError('Required parameters missing', 400);
            }

            const booking = await Booking.findByPk(bookingId, { transaction: transaction });
            if (!booking) {
                await transaction.rollback();
                throw new AppError('Booking not found', 404);
            }

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            const errors = this.validationService.validatePaymentData(paymentData);
            if (errors.length) {
                await transaction.rollback();
                throw new AppError(errors.join(', '), 400);
            }

            // Auto-select gateway based on currency
            const gateway = this._selectGateway(paymentData.currency);

            let gatewayPaymentId;
            let gatewayResponse;

            if (gateway === 'razorpay') {
                gatewayResponse = await this._createRazorpayOrder(paymentData, user);
                gatewayPaymentId = gatewayResponse.id;
            } else if (gateway === 'stripe') {
                gatewayResponse = await this._createStripePaymentIntent(paymentData, user);
                gatewayPaymentId = gatewayResponse.id;
            }

            const payment = await Payment.create({
                paymentId: this._generatePaymentId(),
                bookingId: bookingId,
                userId: userId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                gateway: gateway,
                gatewayPaymentId: gatewayPaymentId,
                status: 'pending',
                paymentMethod: paymentData.paymentMethod || null,
                description: paymentData.description || null,
                metadata: gatewayResponse,
                createdAt: new Date()
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'PAYMENT_CREATED',
                entityType: 'Payment',
                entityId: payment.paymentId,
                userId: userId,
                details: { gateway: gateway, amount: paymentData.amount }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Payment initiated',
                paymentId: payment.paymentId,
                gatewayPaymentId: gatewayPaymentId,
                gateway: gateway,
                amount: payment.amount,
                currency: payment.currency
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PAYMENT VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════════════

    async verifyPayment(paymentId, verificationData) {
        const transaction = await sequelize.transaction();
        try {
            if (!paymentId || !verificationData) {
                throw new AppError('Required parameters missing', 400);
            }

            const payment = await Payment.findOne({
                where: { paymentId: paymentId },
                transaction: transaction
            });

            if (!payment) {
                await transaction.rollback();
                throw new AppError('Payment not found', 404);
            }

            let isValid = false;

            if (payment.gateway === 'razorpay') {
                isValid = await this._verifyRazorpayPayment(payment, verificationData);
            } else if (payment.gateway === 'stripe') {
                isValid = await this._verifyStripePayment(payment, verificationData);
            }

            if (!isValid) {
                await transaction.rollback();
                throw new AppError('Payment verification failed', 400);
            }

            payment.status = 'completed';
            payment.verifiedAt = new Date();
            await payment.save({ transaction: transaction });

            // Update booking status
            const booking = await Booking.findByPk(payment.bookingId, { transaction: transaction });
            if (booking) {
                booking.paymentStatus = 'completed';
                await booking.save({ transaction: transaction });
            }

            await this.auditLogService.logAction({
                action: 'PAYMENT_VERIFIED',
                entityType: 'Payment',
                entityId: paymentId,
                userId: payment.userId,
                details: { gateway: payment.gateway }
            }, transaction);

            await this.notificationService.sendNotification(payment.userId, 'PAYMENT_SUCCESSFUL', {
                paymentId: paymentId,
                amount: payment.amount,
                currency: payment.currency
            });

            await transaction.commit();

            return { success: true, message: 'Payment verified', payment: payment };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // REFUND HANDLING
    // ═══════════════════════════════════════════════════════════════════════════════

    async refundPayment(paymentId, userId, refundData) {
        const transaction = await sequelize.transaction();
        try {
            if (!paymentId || !userId || !refundData) {
                throw new AppError('Required parameters missing', 400);
            }

            const payment = await Payment.findOne({
                where: { paymentId: paymentId },
                transaction: transaction
            });

            if (!payment) {
                await transaction.rollback();
                throw new AppError('Payment not found', 404);
            }

            if (payment.userId !== userId && userId !== 'ADMIN') {
                await transaction.rollback();
                throw new AppError('Unauthorized to refund', 403);
            }

            if (payment.status === 'refunded') {
                await transaction.rollback();
                throw new AppError('Already refunded', 400);
            }

            let refundResponse;

            if (payment.gateway === 'razorpay') {
                refundResponse = await this._refundRazorpayPayment(payment, refundData);
            } else if (payment.gateway === 'stripe') {
                refundResponse = await this._refundStripePayment(payment, refundData);
            }

            payment.status = 'refunded';
            payment.refundAmount = refundData.amount || payment.amount;
            payment.refundReason = refundData.reason || null;
            payment.refundedAt = new Date();
            payment.refundGatewayId = refundResponse.id;
            await payment.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'PAYMENT_REFUNDED',
                entityType: 'Payment',
                entityId: paymentId,
                userId: userId,
                details: { reason: refundData.reason, amount: refundData.amount }
            }, transaction);

            await this.notificationService.sendNotification(payment.userId, 'PAYMENT_REFUNDED', {
                paymentId: paymentId,
                refundAmount: payment.refundAmount
            });

            await transaction.commit();

            return { success: true, message: 'Refund processed', payment: payment };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SUBSCRIPTION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createSubscription(userId, subscriptionData) {
        const transaction = await sequelize.transaction();
        try {
            if (!userId || !subscriptionData) {
                throw new AppError('Required parameters missing', 400);
            }

            const user = await User.findByPk(userId, { transaction: transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError('User not found', 404);
            }

            const gateway = this._selectGateway(subscriptionData.currency);
            let subscriptionResponse;

            if (gateway === 'razorpay') {
                subscriptionResponse = await this._createRazorpaySubscription(subscriptionData, user);
            } else if (gateway === 'stripe') {
                subscriptionResponse = await this._createStripeSubscription(subscriptionData, user);
            }

            await this.auditLogService.logAction({
                action: 'SUBSCRIPTION_CREATED',
                entityType: 'Subscription',
                entityId: subscriptionResponse.id,
                userId: userId,
                details: { gateway: gateway }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Subscription created',
                subscriptionId: subscriptionResponse.id,
                gateway: gateway
            };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // WEBHOOK HANDLERS
    // ═══════════════════════════════════════════════════════════════════════════════

    async handleRazorpayWebhook(webhookData, signature) {
        const transaction = await sequelize.transaction();
        try {
            const isValid = await this._verifyRazorpayWebhook(webhookData, signature);
            if (!isValid) {
                throw new AppError('Invalid webhook signature', 400);
            }

            const eventType = webhookData.event;
            const eventData = webhookData.payload.payment.entity;

            if (eventType === 'payment.authorized') {
                const payment = await Payment.findOne({
                    where: { gatewayPaymentId: eventData.id },
                    transaction: transaction
                });

                if (payment) {
                    payment.status = 'completed';
                    payment.verifiedAt = new Date();
                    await payment.save({ transaction: transaction });
                }
            } else if (eventType === 'payment.failed') {
                const payment = await Payment.findOne({
                    where: { gatewayPaymentId: eventData.id },
                    transaction: transaction
                });

                if (payment) {
                    payment.status = 'failed';
                    payment.failureReason = eventData.error_description;
                    await payment.save({ transaction: transaction });
                }
            }

            await transaction.commit();

            return { success: true, message: 'Webhook processed' };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    async handleStripeWebhook(webhookData, signature) {
        const transaction = await sequelize.transaction();
        try {
            const isValid = await this._verifyStripeWebhook(webhookData, signature);
            if (!isValid) {
                throw new AppError('Invalid webhook signature', 400);
            }

            const eventType = webhookData.type;
            const eventData = webhookData.data.object;

            if (eventType === 'payment_intent.succeeded') {
                const payment = await Payment.findOne({
                    where: { gatewayPaymentId: eventData.id },
                    transaction: transaction
                });

                if (payment) {
                    payment.status = 'completed';
                    payment.verifiedAt = new Date();
                    await payment.save({ transaction: transaction });
                }
            } else if (eventType === 'payment_intent.payment_failed') {
                const payment = await Payment.findOne({
                    where: { gatewayPaymentId: eventData.id },
                    transaction: transaction
                });

                if (payment) {
                    payment.status = 'failed';
                    payment.failureReason = eventData.last_payment_error.message;
                    await payment.save({ transaction: transaction });
                }
            }

            await transaction.commit();

            return { success: true, message: 'Webhook processed' };
        } catch (error) {
            await transaction.rollback();
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _selectGateway(currency) {
        const razorpayCurrencies = ['INR', 'USD', 'GBP', 'EUR'];
        const stripeCurrencies = ['USD', 'EUR', 'GBP', 'AUD'];

        if (razorpayCurrencies.includes(currency)) {
            return 'razorpay';
        } else if (stripeCurrencies.includes(currency)) {
            return 'stripe';
        } else {
            return 'razorpay';
        }
    }

    async _createRazorpayOrder(paymentData, user) {
        const order = await this.razorpay.orders.create({
            amount: paymentData.amount * 100,
            currency: paymentData.currency,
            receipt: this._generatePaymentId(),
            customer_notify: 1,
            notes: {
                userId: user.userId,
                email: user.email,
                phone: user.phone
            }
        });
        return order;
    }

    async _createStripePaymentIntent(paymentData, user) {
        const intent = await this.stripe.paymentIntents.create({
            amount: paymentData.amount * 100,
            currency: paymentData.currency.toLowerCase(),
            customer: user.stripeCustomerId || undefined,
            description: paymentData.description,
            metadata: {
                userId: user.userId,
                email: user.email
            }
        });
        return intent;
    }

    async _verifyRazorpayPayment(payment, verificationData) {
        const crypto = require('crypto');
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(payment.gatewayPaymentId + '|' + verificationData.razorpay_payment_id)
            .digest('hex');

        return generated_signature === verificationData.razorpay_signature;
    }

    async _verifyStripePayment(payment, verificationData) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(payment.gatewayPaymentId);
        return paymentIntent.status === 'succeeded';
    }

    async _refundRazorpayPayment(payment, refundData) {
        const refund = await this.razorpay.payments.refund(payment.gatewayPaymentId, {
            amount: refundData.amount ? refundData.amount * 100 : undefined,
            notes: {
                reason: refundData.reason
            }
        });
        return refund;
    }

    async _refundStripePayment(payment, refundData) {
        const refund = await this.stripe.refunds.create({
            payment_intent: payment.gatewayPaymentId,
            amount: refundData.amount ? refundData.amount * 100 : undefined,
            reason: refundData.reason || 'requested_by_customer'
        });
        return refund;
    }

    async _createRazorpaySubscription(subscriptionData, user) {
        const subscription = await this.razorpay.subscriptions.create({
            plan_id: subscriptionData.planId,
            customer_notify: 1,
            quantity: 1,
            total_count: subscriptionData.totalCount || 12,
            start_at: subscriptionData.startAt || Math.floor(Date.now() / 1000)
        });
        return subscription;
    }

    async _createStripeSubscription(subscriptionData, user) {
        const subscription = await this.stripe.subscriptions.create({
            customer: user.stripeCustomerId,
            items: [{ price: subscriptionData.priceId }],
            default_payment_method: subscriptionData.paymentMethodId
        });
        return subscription;
    }

    async _verifyRazorpayWebhook(webhookData, signature) {
        const crypto = require('crypto');
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(webhookData))
            .digest('hex');

        return generated_signature === signature;
    }

    async _verifyStripeWebhook(webhookData, signature) {
        const crypto = require('crypto');
        const generated_signature = crypto
            .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET)
            .update(JSON.stringify(webhookData))
            .digest('hex');

        return generated_signature === signature;
    }

    _generatePaymentId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'PAY-' + ts + rnd;
    }
}

export default PaymentGatewayService;
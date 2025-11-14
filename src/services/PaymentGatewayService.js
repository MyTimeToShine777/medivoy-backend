// Payment Gateway Service - Razorpay & Stripe Integration
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import prisma from '../config/prisma.js';

class PaymentGatewayService {
    constructor() {
        // Initialize Razorpay if credentials provided
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            this.razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
        }

        // Initialize Stripe if credentials provided
        if (process.env.STRIPE_SECRET_KEY) {
            this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CREATE PAYMENT
    // ═══════════════════════════════════════════════════════════════════════════════
    async createPayment(userId, bookingId, paymentData) {
        try {
            const { gateway, amount, currency = 'INR' } = paymentData;

            if (gateway === 'razorpay' && this.razorpay) {
                const order = await this.razorpay.orders.create({
                    amount: amount * 100,
                    currency: currency,
                    receipt: `booking_${bookingId}`,
                });

                const payment = await prisma.payments.create({
                    data: {
                        userId,
                        bookingId,
                        gateway: 'razorpay',
                        gatewayPaymentId: order.id,
                        amount,
                        currency,
                        status: 'pending',
                    },
                });

                return {
                    success: true,
                    paymentId: payment.paymentId,
                    gatewayPaymentId: order.id,
                    gateway: 'razorpay',
                    amount,
                    currency,
                };
            } else if (gateway === 'stripe' && this.stripe) {
                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: amount * 100,
                    currency: currency.toLowerCase(),
                    metadata: { bookingId, userId },
                });

                const payment = await prisma.payments.create({
                    data: {
                        userId,
                        bookingId,
                        gateway: 'stripe',
                        gatewayPaymentId: paymentIntent.id,
                        amount,
                        currency,
                        status: 'pending',
                    },
                });

                return {
                    success: true,
                    paymentId: payment.paymentId,
                    gatewayPaymentId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret,
                    gateway: 'stripe',
                    amount,
                    currency,
                };
            }

            return { success: false, error: 'Payment gateway not configured' };
        } catch (error) {
            console.error('Create payment error:', error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VERIFY PAYMENT
    // ═══════════════════════════════════════════════════════════════════════════════
    async verifyPayment(paymentId, verificationData) {
        try {
            const payment = await prisma.payments.findUnique({
                where: { paymentId },
            });

            if (!payment) {
                return { success: false, error: 'Payment not found' };
            }

            if (payment.gateway === 'razorpay') {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verificationData;

                const expectedSignature = crypto
                    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                    .digest('hex');

                if (expectedSignature === razorpay_signature) {
                    const updatedPayment = await prisma.payments.update({
                        where: { paymentId },
                        data: {
                            status: 'completed',
                            transactionId: razorpay_payment_id,
                            paidAt: new Date(),
                        },
                    });

                    return { success: true, payment: updatedPayment };
                }

                return { success: false, error: 'Invalid signature' };
            } else if (payment.gateway === 'stripe') {
                const paymentIntent = await this.stripe.paymentIntents.retrieve(payment.gatewayPaymentId);

                if (paymentIntent.status === 'succeeded') {
                    const updatedPayment = await prisma.payments.update({
                        where: { paymentId },
                        data: {
                            status: 'completed',
                            transactionId: paymentIntent.id,
                            paidAt: new Date(),
                        },
                    });

                    return { success: true, payment: updatedPayment };
                }

                return { success: false, error: 'Payment not successful' };
            }

            return { success: false, error: 'Unknown gateway' };
        } catch (error) {
            console.error('Verify payment error:', error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // REFUND PAYMENT
    // ═══════════════════════════════════════════════════════════════════════════════
    async refundPayment(paymentId, userId, refundData) {
        try {
            const payment = await prisma.payments.findUnique({
                where: { paymentId },
            });

            if (!payment || payment.status !== 'completed') {
                return { success: false, error: 'Payment not eligible for refund' };
            }

            const { amount, reason } = refundData;

            if (payment.gateway === 'razorpay' && this.razorpay) {
                const refund = await this.razorpay.payments.refund(payment.transactionId, {
                    amount: amount * 100,
                });

                const updatedPayment = await prisma.payments.update({
                    where: { paymentId },
                    data: {
                        status: 'refunded',
                        refundReason: reason,
                        refundedAt: new Date(),
                    },
                });

                return { success: true, payment: updatedPayment, refund };
            } else if (payment.gateway === 'stripe' && this.stripe) {
                const refund = await this.stripe.refunds.create({
                    payment_intent: payment.gatewayPaymentId,
                    amount: amount * 100,
                });

                const updatedPayment = await prisma.payments.update({
                    where: { paymentId },
                    data: {
                        status: 'refunded',
                        refundReason: reason,
                        refundedAt: new Date(),
                    },
                });

                return { success: true, payment: updatedPayment, refund };
            }

            return { success: false, error: 'Refund not supported' };
        } catch (error) {
            console.error('Refund payment error:', error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CREATE SUBSCRIPTION
    // ═══════════════════════════════════════════════════════════════════════════════
    async createSubscription(userId, subscriptionData) {
        try {
            const { planId, gateway } = subscriptionData;

            const plan = await prisma.subscriptionPlan.findUnique({
                where: { planId },
            });

            if (!plan) {
                return { success: false, error: 'Plan not found' };
            }

            if (gateway === 'razorpay' && this.razorpay) {
                const subscription = await this.razorpay.subscriptions.create({
                    plan_id: plan.gatewayPlanId,
                    customer_notify: 1,
                    total_count: plan.billingCycle === 'monthly' ? 12 : 1,
                });

                const dbSubscription = await prisma.subscription.create({
                    data: {
                        userId,
                        planId,
                        gateway: 'razorpay',
                        gatewaySubscriptionId: subscription.id,
                        status: 'active',
                        startDate: new Date(),
                    },
                });

                return { success: true, subscription: dbSubscription };
            } else if (gateway === 'stripe' && this.stripe) {
                const customer = await this.stripe.customers.create({
                    metadata: { userId },
                });

                const subscription = await this.stripe.subscriptions.create({
                    customer: customer.id,
                    items: [{ price: plan.gatewayPlanId }],
                });

                const dbSubscription = await prisma.subscription.create({
                    data: {
                        userId,
                        planId,
                        gateway: 'stripe',
                        gatewaySubscriptionId: subscription.id,
                        status: 'active',
                        startDate: new Date(),
                    },
                });

                return { success: true, subscription: dbSubscription };
            }

            return { success: false, error: 'Subscription gateway not configured' };
        } catch (error) {
            console.error('Create subscription error:', error);
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CANCEL SUBSCRIPTION
    // ═══════════════════════════════════════════════════════════════════════════════
    async cancelSubscription(subscriptionId, userId) {
        try {
            const subscription = await prisma.subscription.findUnique({
                where: { subscriptionId },
            });

            if (!subscription || subscription.userId !== userId) {
                return { success: false, error: 'Subscription not found' };
            }

            if (subscription.gateway === 'razorpay' && this.razorpay) {
                await this.razorpay.subscriptions.cancel(subscription.gatewaySubscriptionId);
            } else if (subscription.gateway === 'stripe' && this.stripe) {
                await this.stripe.subscriptions.cancel(subscription.gatewaySubscriptionId);
            }

            const updatedSubscription = await prisma.subscription.update({
                where: { subscriptionId },
                data: {
                    status: 'cancelled',
                    endDate: new Date(),
                },
            });

            return { success: true, subscription: updatedSubscription };
        } catch (error) {
            console.error('Cancel subscription error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new PaymentGatewayService();

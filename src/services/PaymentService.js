// Payment Service - Stripe & Razorpay - NO optional chaining
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { sequelize } from '../config/database.js';
import logger from '../utils/logger.js';
import helpers from '../utils/helpers.js';
import validators from '../utils/validators.js';
import {
    ValidationError,
    NotFoundError,
    DatabaseError,
} from '../exceptions/index.js';

// Initialize payment gateways
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class PaymentService {
    // Create payment with Stripe
    async createStripePayment(bookingId, patientId, amount, currency) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            if (!validators.isValidInteger(patientId)) {
                throw new ValidationError('Valid patient ID is required');
            }

            if (!validators.isValidDecimal(amount) || amount <= 0) {
                throw new ValidationError('Valid amount is required');
            }

            // Get booking and patient info
            const Booking = sequelize.models.Booking;
            const User = sequelize.models.User;

            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            const patient = await User.findByPk(patientId);
            if (!patient) {
                throw new NotFoundError('Patient not found');
            }

            // Create Stripe payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency.toLowerCase(),
                metadata: {
                    bookingId: bookingId.toString(),
                    patientId: patientId.toString(),
                },
                description: `Booking ${booking.bookingReference} for ${patient.firstName} ${patient.lastName}`,
            });

            // Save payment record
            const Payment = sequelize.models.Payment;
            const payment = await Payment.create({
                bookingId: bookingId,
                patientId: patientId,
                amount: amount,
                currency: currency,
                gateway: 'stripe',
                transactionId: paymentIntent.id,
                paymentStatus: 'pending',
                paymentDetails: {
                    intentId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret,
                },
            });

            logger.info(`Stripe payment initiated: ${paymentIntent.id}`);

            return {
                paymentId: payment.id,
                clientSecret: paymentIntent.client_secret,
                amount: amount,
                currency: currency,
                status: 'pending',
            };
        } catch (error) {
            logger.error('Stripe payment creation failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Create payment with Razorpay
    async createRazorpayPayment(bookingId, patientId, amount, currency) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            if (!validators.isValidInteger(patientId)) {
                throw new ValidationError('Valid patient ID is required');
            }

            if (!validators.isValidDecimal(amount) || amount <= 0) {
                throw new ValidationError('Valid amount is required');
            }

            // Get booking info
            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            // Create Razorpay order
            const order = await razorpay.orders.create({
                amount: Math.round(amount * 100), // Convert to paise
                currency: currency,
                receipt: `booking_${bookingId}_${Date.now()}`,
                notes: {
                    bookingId: bookingId,
                    patientId: patientId,
                },
            });

            // Save payment record
            const Payment = sequelize.models.Payment;
            const payment = await Payment.create({
                bookingId: bookingId,
                patientId: patientId,
                amount: amount,
                currency: currency,
                gateway: 'razorpay',
                transactionId: order.id,
                paymentStatus: 'pending',
                paymentDetails: {
                    orderId: order.id,
                    keyId: process.env.RAZORPAY_KEY_ID,
                },
            });

            logger.info(`Razorpay payment initiated: ${order.id}`);

            return {
                paymentId: payment.id,
                orderId: order.id,
                amount: amount,
                currency: currency,
                keyId: process.env.RAZORPAY_KEY_ID,
                status: 'pending',
            };
        } catch (error) {
            logger.error('Razorpay payment creation failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Verify Stripe payment
    async verifyStripePayment(paymentId, paymentIntentId) {
        try {
            if (!validators.isValidInteger(paymentId)) {
                throw new ValidationError('Valid payment ID is required');
            }

            if (!paymentIntentId || typeof paymentIntentId !== 'string') {
                throw new ValidationError('Valid payment intent ID is required');
            }

            // Get payment record
            const Payment = sequelize.models.Payment;
            const payment = await Payment.findByPk(paymentId);
            if (!payment) {
                throw new NotFoundError('Payment not found');
            }

            // Verify with Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                payment.paymentStatus = 'completed';
                payment.completedAt = new Date();
                await payment.save();

                // Update booking status
                const Booking = sequelize.models.Booking;
                const booking = await Booking.findByPk(payment.bookingId);
                if (booking) {
                    booking.bookingStatus = 'payment_completed';
                    await booking.save();
                }

                logger.info(`Stripe payment verified: ${paymentIntentId}`);

                return {
                    paymentId: payment.id,
                    status: 'completed',
                    amount: payment.amount,
                };
            } else if (paymentIntent.status === 'requires_payment_method') {
                payment.paymentStatus = 'pending';
                await payment.save();
                throw new ValidationError('Payment requires payment method');
            } else {
                payment.paymentStatus = 'failed';
                payment.errorMessage = `Payment status: ${paymentIntent.status}`;
                await payment.save();
                throw new Error(`Payment failed: ${paymentIntent.status}`);
            }
        } catch (error) {
            logger.error('Stripe payment verification failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Verify Razorpay payment
    async verifyRazorpayPayment(paymentId, razorpayPaymentId, razorpaySignature) {
        try {
            if (!validators.isValidInteger(paymentId)) {
                throw new ValidationError('Valid payment ID is required');
            }

            if (!razorpayPaymentId || typeof razorpayPaymentId !== 'string') {
                throw new ValidationError('Valid Razorpay payment ID is required');
            }

            if (!razorpaySignature || typeof razorpaySignature !== 'string') {
                throw new ValidationError('Valid signature is required');
            }

            // Get payment record
            const Payment = sequelize.models.Payment;
            const payment = await Payment.findByPk(paymentId);
            if (!payment) {
                throw new NotFoundError('Payment not found');
            }

            // Verify signature
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
            hmac.update(payment.paymentDetails.orderId + '|' + razorpayPaymentId);
            const signature = hmac.digest('hex');

            if (signature !== razorpaySignature) {
                throw new ValidationError('Invalid payment signature');
            }

            // Update payment
            payment.paymentStatus = 'completed';
            payment.completedAt = new Date();
            payment.paymentDetails.paymentId = razorpayPaymentId;
            await payment.save();

            // Update booking status
            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(payment.bookingId);
            if (booking) {
                booking.bookingStatus = 'payment_completed';
                await booking.save();
            }

            logger.info(`Razorpay payment verified: ${razorpayPaymentId}`);

            return {
                paymentId: payment.id,
                status: 'completed',
                amount: payment.amount,
            };
        } catch (error) {
            logger.error('Razorpay payment verification failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Get payment history
    async getPaymentHistory(patientId, page, limit) {
        try {
            if (!validators.isValidInteger(patientId)) {
                throw new ValidationError('Valid patient ID is required');
            }

            const pageNum = helpers.toInt(page, 1);
            const limitNum = helpers.toInt(limit, 10);
            const offset = (pageNum - 1) * limitNum;

            const Payment = sequelize.models.Payment;
            const { count, rows } = await Payment.findAndCountAll({
                where: { patientId: patientId },
                offset: offset,
                limit: limitNum,
                order: [
                    ['createdAt', 'DESC']
                ],
            });

            const pagination = helpers.calculatePagination(pageNum, limitNum, count);

            logger.info(`Retrieved ${rows.length} payments for patient ${patientId}`);

            return {
                data: rows,
                pagination: pagination,
            };
        } catch (error) {
            logger.error('Failed to get payment history');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Generate invoice
    async generateInvoice(bookingId) {
        try {
            if (!validators.isValidInteger(bookingId)) {
                throw new ValidationError('Valid booking ID is required');
            }

            const Booking = sequelize.models.Booking;
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                throw new NotFoundError('Booking not found');
            }

            const Payment = sequelize.models.Payment;
            const payment = await Payment.findOne({
                where: {
                    bookingId: bookingId,
                    paymentStatus: 'completed',
                },
            });

            if (!payment) {
                throw new NotFoundError('No completed payment found for this booking');
            }

            const Invoice = sequelize.models.Invoice;
            const invoiceNumber = helpers.generateInvoiceNumber();

            const invoice = await Invoice.create({
                bookingId: bookingId,
                invoiceNumber: invoiceNumber,
                patientId: booking.patientId,
                subtotal: payment.amount,
                tax: 0,
                discount: 0,
                total: payment.amount,
                currency: payment.currency,
                status: 'sent',
                items: [{
                    description: `Medical Treatment - Booking ${booking.bookingReference}`,
                    quantity: 1,
                    unitPrice: payment.amount,
                    total: payment.amount,
                }, ],
                sentAt: new Date(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            });

            logger.info(`Invoice generated: ${invoiceNumber}`);

            return {
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                amount: invoice.total,
                status: invoice.status,
            };
        } catch (error) {
            logger.error('Invoice generation failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Refund payment
    async refundPayment(paymentId, reason) {
        try {
            if (!validators.isValidInteger(paymentId)) {
                throw new ValidationError('Valid payment ID is required');
            }

            const Payment = sequelize.models.Payment;
            const payment = await Payment.findByPk(paymentId);
            if (!payment) {
                throw new NotFoundError('Payment not found');
            }

            if (payment.paymentStatus !== 'completed') {
                throw new ValidationError('Only completed payments can be refunded');
            }

            try {
                if (payment.gateway === 'stripe') {
                    await stripe.refunds.create({
                        payment_intent: payment.paymentDetails.intentId,
                        reason: reason || 'requested_by_customer',
                    });
                } else if (payment.gateway === 'razorpay') {
                    await razorpay.payments.refund(payment.paymentDetails.paymentId, {
                        notes: { reason: reason || 'requested_by_customer' },
                    });
                }

                payment.paymentStatus = 'refunded';
                await payment.save();

                logger.info(`Payment refunded: ${paymentId}`);

                return {
                    paymentId: payment.id,
                    status: 'refunded',
                    amount: payment.amount,
                };
            } catch (refundError) {
                throw new Error(`Refund failed: ${refundError.message}`);
            }
        } catch (error) {
            logger.error('Payment refund failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }
}

export default new PaymentService();
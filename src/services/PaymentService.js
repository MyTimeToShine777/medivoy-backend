// Payment Service - Payment processing and management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class PaymentService {
    // ========== CREATE PAYMENT ==========
    async createPayment(paymentData) {
        try {
            const payment = await prisma.payments.create({
                data: {
                    paymentNumber: await this.generatePaymentNumber(),
                    status: 'pending',
                    ...paymentData,
                }
            });

                    return {
                        success: true,
                        data: payment,
                        message: 'Payment created successfully',
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        error: error.message,
                        message: 'Failed to create payment',
                    };
                }
            }

            // ========== GET PAYMENT ==========
            async getPaymentById(paymentId) {
                try {
                    const payment = await prisma.payments.findUnique({ 
                        where: { paymentId: paymentId }
                    });

                    if (!payment) {
                        return {
                            success: false,
                            error: 'Payment not found',
                        };
                    }

                    return {
                        success: true,
                        data: payment,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message,
                    };
                }
            }

            async getPaymentByNumber(paymentNumber) {
                try {
                    const payment = await prisma.payments.findFirst({
                        where: { paymentNumber },
                    });

                    if (!payment) {
                        return {
                            success: false,
                            error: 'Payment not found',
                        };
                    }

                    return {
                        success: true,
                        data: payment,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message,
                    };
                }
            }

            // ========== GET USER PAYMENTS ==========
            async getUserPayments(userId, filters = {}) {
                try {
                    const where = { userId };

                    if (filters.status) {
                        where.status = filters.status;
                    }
                    if (filters.method) {
                        where.method = filters.method;
                    }

                    const payments = await prisma.payments.findMany({
                        where,
                        include: [{ model: Booking, as: 'booking' }],
                        order: [
                            ['createdAt', 'DESC']
                        ],
                        limit: filters.limit || 20,
                        offset: filters.offset || 0,
                    });

                    const total = await prisma.payments.count({ where });

                    return {
                        success: true,
                        data: payments,
                        total,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message,
                    };
                }
            }

            // ========== PROCESS PAYMENT ==========
            async processPayment(paymentId, gatewayResponse) {
                try {
                    const payment = await prisma.payments.findUnique({ where: { paymentId: paymentId } });
                    if (!payment) {
                        return {
                            success: false,
                            error: 'Payment not found',
                        };
                    }

                    if (gatewayResponse.status === 'success') {
                        payment.status = 'completed';
                        payment.completedAt = new Date();
                        payment.transactionId = gatewayResponse.transactionId;
                        payment.gatewayResponse = gatewayResponse;

                        await payment.save();

                        // Update booking as paid
                        const booking = await prisma.bookings.findUnique({ where: { bookingId: payment.bookingId } });
                        if (booking) {
                            booking.isPaid = true;
                            booking.paidAt = new Date();
                            await booking.save();
                        }

                        return {
                            success: true,
                            data: payment,
                            message: 'Payment processed successfully',
                        };
                    } else {
                        payment.status = 'failed';
                        payment.failureReason = gatewayResponse.reason;
                        await payment.save();

                        return {
                            success: false,
                            error: gatewayResponse.reason,
                            message: 'Payment processing failed',
                        };
                    }
                } catch (error) {
                    return {
                        success: false,
                        error: error.message,
                    };
                }
            }

            // ========== REFUND ==========
            async refundPayment(paymentId, refundAmount = null, reason = null) {
                    try {
                        const payment = await prisma.payments.findUnique({ where: { paymentId: paymentId } });
                        if (!payment) {
                            return {
                                success: false,
                                error: 'Payment not found',
                            };
                        }

                        if (payment.status !== 'completed') {
                            return {
                                success: false,
                                error: 'Only completed payments can be refunded',
                            };
                        }

                        const refund = await prisma.refund.create({
                            data: {
                                paymentId,
                                bookingId: payment.bookingId,
                                userId: payment.userId,
                                amount: refundAmount || payment.amount,
                                reason: reason || 'Customer requested refund',
                                status: 'initiated',
                            }
                        });

                            payment.refundedAmount = (payment.refundedAmount || 0) + refund.amount; payment.status = 'refunded'; await payment.save();

                            return {
                                success: true,
                                data: refund,
                                message: 'Refund initiated successfully',
                            };
                        }
                        catch (error) {
                            return {
                                success: false,
                                error: error.message,
                            };
                        }
                    }

                    // ========== PAYMENT VERIFICATION ==========
                    async verifyPayment(transactionId, expectedAmount) {
                        try {
                            const payment = await prisma.payments.findFirst({
                                where: { transactionId },
                            });

                            if (!payment) {
                                return {
                                    success: false,
                                    error: 'Payment not found',
                                };
                            }

                            if (payment.amount !== expectedAmount) {
                                return {
                                    success: false,
                                    error: 'Amount mismatch',
                                };
                            }

                            if (payment.status !== 'completed') {
                                return {
                                    success: false,
                                    error: 'Payment not completed',
                                };
                            }

                            return {
                                success: true,
                                data: payment,
                                message: 'Payment verified',
                            };
                        } catch (error) {
                            return {
                                success: false,
                                error: error.message,
                            };
                        }
                    }

                    // ========== PAYMENT ANALYTICS ==========
                    async getPaymentStats(filters = {}) {
                        try {
                            const where = { status: 'completed' };

                            if (filters.startDate && filters.endDate) {
                                where.completedAt = {
                                    gte: filters.startDate,
                                    lte: filters.endDate
                                };
                            }

                                const totalPayments = await prisma.payments.count({ where });
                                const totalAmount = await Payment.sum('amount', { where });
                                const averageAmount = await Payment.avg('amount', { where });

                                const paymentsByMethod = await prisma.payments.findMany({
                                    where,
                                    attributes: ['method', [this. /* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', this. /* TODO: Check field name */ sequelize.col('paymentId')), 'count']],
                                    group: ['method'],
                                    raw: true,
                                });

                                return {
                                    success: true,
                                    data: {
                                        totalPayments,
                                        totalAmount,
                                        averageAmount: averageAmount ? averageAmount.toFixed(2) : 0,
                                        paymentsByMethod,
                                    },
                                };
                            } catch (error) {
                                return {
                                    success: false,
                                    error: error.message,
                                };
                            }
                        }

                        // ========== HELPER METHODS ==========
                        async generatePaymentNumber() {
                            const timestamp = Date.now();
                            const random = Math.floor(Math.random() * 10000);
                            return `PAY-${timestamp}-${random}`;
                        }
                    }

                    export { PaymentService };
                    export default new PaymentService();
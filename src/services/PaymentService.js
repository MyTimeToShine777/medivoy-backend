// Payment Service - Payment processing and management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class PaymentService {
    // ========== CREATE PAYMENT ==========
    async createPayment(paymentData) {
        try {
            const payment = await prisma.payment.create({ data: {
                paymentNumber: await this.generatePaymentNumber(),
                status: 'pending',
                ...paymentData,
            });

            return {
                success: true,
                data: payment,
                message: 'Payment created successfully',
            };
        } catch (error) {
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
            const payment = await prisma.payment.findUnique({
                where: { id: paymentId },
                include: {
                    booking: true,
                    user: true,
                    invoice: true
                }
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
            const payment = await prisma.payment.findFirst({
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

            const payments = await prisma.payment.findMany({
                where,
                include: {
                    booking: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: filters.limit || 20,
                skip: filters.offset || 0,
            });

            const total = await prisma.payment.count({ where });

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
            const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
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
                const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
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
            const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
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

            const refund = await prisma.refund.create({ data: {
                paymentId,
                bookingId: payment.bookingId,
                userId: payment.userId,
                amount: refundAmount || payment.amount,
                reason: reason || 'Customer requested refund',
                status: 'initiated',
            });

            payment.refundedAmount = (payment.refundedAmount || 0) + refund.amount;
            payment.status = 'refunded';
            await payment.save();

            return {
                success: true,
                data: refund,
                message: 'Refund initiated successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== PAYMENT VERIFICATION ==========
    async verifyPayment(transactionId, expectedAmount) {
        try {
            const payment = await prisma.payment.findFirst({
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
                    gte: new Date(filters.startDate),
                    lte: new Date(filters.endDate)
                };
            }

            const totalPayments = await prisma.payment.count({ where });
            
            const aggregations = await prisma.payment.aggregate({
                where,
                _sum: { amount: true },
                _avg: { amount: true }
            });
            
            const totalAmount = aggregations._sum.amount || 0;
            const averageAmount = aggregations._avg.amount || 0;

            // Group by method manually
            const payments = await prisma.payment.findMany({
                where,
                select: {
                    method: true,
                    paymentId: true
                }
            });

            const paymentsByMethod = payments.reduce((acc, payment) => {
                const method = payment.method || 'unknown';
                if (!acc[method]) {
                    acc[method] = { method, count: 0 };
                }
                acc[method].count += 1;
                return acc;
            }, {});

            const paymentsByMethodArray = Object.values(paymentsByMethod);

            return {
                success: true,
                data: {
                    totalPayments,
                    totalAmount,
                    averageAmount: averageAmount ? averageAmount.toFixed(2) : 0,
                    paymentsByMethod: paymentsByMethodArray,
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

export default new PaymentService();
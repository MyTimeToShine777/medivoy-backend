// Refund Service - Refund processing and management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class RefundService {
    // ========== CREATE REFUND ==========
    async createRefund(refundData) {
        try {
            const refund = await prisma.refund.create({
                data: {
                    refundNumber: await this.generateRefundNumber(),
                    status: 'initiated',
                    ...refundData,
                }
            });

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

    // ========== GET REFUND ==========
    async getRefundById(refundId) {
        try {
            const refund = await prisma.refund.findUnique({
                where: { refundId },
                include: {
                    payment: true,
                    booking: true,
                    user: true
                }
            });

            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            return {
                success: true,
                data: refund,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getRefundByNumber(refundNumber) {
        try {
            const refund = await prisma.refund.findFirst({
                where: { refundNumber }
            });

            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            return {
                success: true,
                data: refund,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET USER REFUNDS ==========
    async getUserRefunds(userId, filters = {}) {
        try {
            const where = { userId };

            if (filters.status) {
                where.status = filters.status;
            }

            const refunds = await prisma.refund.findMany({
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

            const total = await prisma.refund.count({ where });

            return {
                success: true,
                data: refunds,
                total,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== VALIDATE REFUND ELIGIBILITY ==========
    async validateRefundEligibility(bookingId) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { bookingId }
            });
            if (!booking) {
                return {
                    success: false,
                    eligible: false,
                    error: 'Booking not found',
                };
            }

            // Check if booking is within refund window (e.g., within 7 days)
            const refundWindowDays = 7;
            const bookingDate = new Date(booking.createdAt);
            const currentDate = new Date();
            const daysDifference = Math.floor((currentDate - bookingDate) / (1000 * 60 * 60 * 24));

            if (daysDifference > refundWindowDays) {
                return {
                    success: false,
                    eligible: false,
                    error: `Refund window expired. Booking is ${daysDifference} days old.`,
                };
            }

            if (booking.status === 'completed') {
                return {
                    success: false,
                    eligible: false,
                    error: 'Cannot refund completed bookings',
                };
            }

            return {
                success: true,
                eligible: true,
                refundableAmount: booking.totalCost,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== PROCESS REFUND ==========
    async processRefund(refundId, gatewayResponse) {
        try {
            const refund = await prisma.refund.findUnique({
                where: { refundId }
            });
            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            if (gatewayResponse.status === 'success') {
                const updated = await prisma.refund.update({
                    where: { refundId },
                    data: {
                        status: 'completed',
                        completedAt: new Date(),
                        transactionId: gatewayResponse.transactionId,
                        gatewayResponse: gatewayResponse
                    }
                });

                // Update payment status
                const payment = await prisma.payment.findUnique({
                    where: { paymentId: refund.paymentId }
                });
                if (payment) {
                    await prisma.payment.update({
                        where: { paymentId: refund.paymentId },
                        data: {
                            refundedAmount: (payment.refundedAmount || 0) + refund.amount,
                            status: 'refunded'
                        }
                    });
                }

                return {
                    success: true,
                    data: updated,
                    message: 'Refund processed successfully',
                };
            } else {
                const failed = await prisma.refund.update({
                    where: { refundId },
                    data: {
                        status: 'failed',
                        failureReason: gatewayResponse.reason
                    }
                });

                return {
                    success: false,
                    error: gatewayResponse.reason,
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== APPROVE REFUND ==========
    async approveRefund(refundId, approvalNotes = null) {
        try {
            const refund = await prisma.refund.findUnique({
                where: { refundId }
            });
            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            const updateData = {
                status: 'approved',
                approvedAt: new Date()
            };
            if (approvalNotes) {
                updateData.approvalNotes = approvalNotes;
            }

            const updated = await prisma.refund.update({
                where: { refundId },
                data: updateData
            });

            return {
                success: true,
                data: updated,
                message: 'Refund approved',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== REJECT REFUND ==========
    async rejectRefund(refundId, rejectionReason) {
        try {
            const refund = await prisma.refund.findUnique({
                where: { refundId }
            });
            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            const updated = await prisma.refund.update({
                where: { refundId },
                data: {
                    status: 'rejected',
                    rejectionReason: rejectionReason,
                    rejectedAt: new Date()
                }
            });

            return {
                success: true,
                data: updated,
                message: 'Refund rejected',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== REFUND STATISTICS ==========
    async getRefundStats(period = 'month') {
        try {
            const startDate = this.getDateRange(period).start;
            const endDate = this.getDateRange(period).end;

            const where = {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            };

            const [totalRefunds, approvedRefunds, totalRefundAmountResult] = await Promise.all([
                prisma.refund.count({ where }),
                prisma.refund.count({
                    where: {...where, status: 'approved' }
                }),
                prisma.refund.aggregate({
                    where: {...where, status: 'completed' },
                    _sum: { amount: true }
                })
            ]);
            
            const totalRefundAmount = totalRefundAmountResult._sum.amount || 0;

            return {
                success: true,
                data: {
                    totalRefunds,
                    approvedRefunds,
                    totalRefundAmount: totalRefundAmount || 0,
                    period,
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
    async generateRefundNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `REF-${timestamp}-${random}`;
    }

    getDateRange(period) {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        if (period === 'week') {
            start.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            start.setMonth(now.getMonth() - 1);
        } else if (period === 'year') {
            start.setFullYear(now.getFullYear() - 1);
        }

        return { start, end };
    }
}

export default new RefundService();
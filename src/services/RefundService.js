// Refund Service - Refund processing and management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { Refund, Payment, Booking, User } from '../models/index.js';

class RefundService {
    // ========== CREATE REFUND ==========
    async createRefund(refundData) {
        try {
            const refund = await Refund.create({
                refundNumber: await this.generateRefundNumber(),
                status: 'initiated',
                ...refundData,
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
            const refund = await Refund.findByPk(refundId, {
                include: [
                    { model: Payment, as: 'payment' },
                    { model: Booking, as: 'booking' },
                    { model: User, as: 'user' },
                ],
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
            const refund = await Refund.findOne({
                where: { refundNumber },
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

            const refunds = await Refund.findAll({
                where,
                include: [
                    { model: Booking, as: 'booking' },
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            const total = await Refund.count({ where });

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
            const booking = await Booking.findByPk(bookingId);
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
            const refund = await Refund.findByPk(refundId);
            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            if (gatewayResponse.status === 'success') {
                refund.status = 'completed';
                refund.completedAt = new Date();
                refund.transactionId = gatewayResponse.transactionId;
                refund.gatewayResponse = gatewayResponse;

                await refund.save();

                // Update payment status
                const payment = await Payment.findByPk(refund.paymentId);
                if (payment) {
                    payment.refundedAmount = (payment.refundedAmount || 0) + refund.amount;
                    payment.status = 'refunded';
                    await payment.save();
                }

                return {
                    success: true,
                    data: refund,
                    message: 'Refund processed successfully',
                };
            } else {
                refund.status = 'failed';
                refund.failureReason = gatewayResponse.reason;
                await refund.save();

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
            const refund = await Refund.findByPk(refundId);
            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            refund.status = 'approved';
            refund.approvedAt = new Date();
            if (approvalNotes) {
                refund.approvalNotes = approvalNotes;
            }

            await refund.save();

            return {
                success: true,
                data: refund,
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
            const refund = await Refund.findByPk(refundId);
            if (!refund) {
                return {
                    success: false,
                    error: 'Refund not found',
                };
            }

            refund.status = 'rejected';
            refund.rejectionReason = rejectionReason;
            refund.rejectedAt = new Date();

            await refund.save();

            return {
                success: true,
                data: refund,
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
                    [Op.between]: [startDate, endDate],
                },
            };

            const totalRefunds = await Refund.count({ where });
            const approvedRefunds = await Refund.count({
                where: {...where, status: 'approved' },
            });
            const totalRefundAmount = await Refund.sum('amount', { where: {...where, status: 'completed' } });

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
'use strict';

import prisma from '../config/prisma.js';

export class TransactionService {
    /**
     * CREATE TRANSACTION
     */
    async createTransaction(paymentId, transactionData) {
        try {
            if (!paymentId) {
                return { success: false, error: 'Payment ID is required' };
            }

            if (!transactionData.amount || transactionData.amount <= 0) {
                return { success: false, error: 'Valid amount is required' };
            }

            // Validate payment exists
            const payment = await prisma.payment.findUnique({
                where: { paymentId }
            });
            if (!payment) {
                return { success: false, error: 'Payment not found' };
            }

            // Generate transaction number
            const transactionNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            const transaction = await prisma.transaction.create({
                data: {
                    paymentId,
                    transactionNumber,
                    status: 'pending',
                    ...transactionData
                }
            });

            return {
                success: true,
                data: transaction,
                message: 'Transaction created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET TRANSACTIONS BY PAYMENT
     */
    async getTransactionsByPayment(paymentId) {
        try {
            if (!paymentId) {
                return { success: false, error: 'Payment ID is required' };
            }

            const transactions = await prisma.transaction.findMany({
                where: { paymentId },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return {
                success: true,
                data: transactions,
                total: transactions.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET TRANSACTION BY ID
     */
    async getTransactionById(transactionId) {
        try {
            if (!transactionId) {
                return { success: false, error: 'Transaction ID is required' };
            }

            const transaction = await prisma.transaction.findUnique({
                where: { transactionId },
                include: {
                    payment: {
                        include: {
                            booking: {
                                select: { bookingId: true, bookingNumber: true }
                            }
                        }
                    }
                }
            });

            if (!transaction) {
                return { success: false, error: 'Transaction not found' };
            }

            return {
                success: true,
                data: transaction
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE TRANSACTION STATUS
     */
    async updateTransactionStatus(transactionId, status, gatewayResponse = {}) {
        try {
            if (!transactionId) {
                return { success: false, error: 'Transaction ID is required' };
            }

            if (!status) {
                return { success: false, error: 'Status is required' };
            }

            const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];
            if (!validStatuses.includes(status)) {
                return { success: false, error: 'Invalid status' };
            }

            const transaction = await prisma.transaction.findUnique({
                where: { transactionId }
            });

            if (!transaction) {
                return { success: false, error: 'Transaction not found' };
            }

            const updateData = {
                status,
                gatewayResponse
            };

            // Set timestamps based on status
            if (status === 'processing') {
                updateData.processedAt = new Date();
            } else if (status === 'completed') {
                updateData.completedAt = new Date();
            }

            const updated = await prisma.transaction.update({
                where: { transactionId },
                data: updateData
            });

            return {
                success: true,
                data: updated,
                message: `Transaction status updated to ${status}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET TRANSACTION BY GATEWAY ID
     */
    async getTransactionByGatewayId(gatewayTransactionId) {
        try {
            if (!gatewayTransactionId) {
                return { success: false, error: 'Gateway transaction ID is required' };
            }

            const transaction = await prisma.transaction.findFirst({
                where: { gatewayTransactionId }
            });

            if (!transaction) {
                return { success: false, error: 'Transaction not found' };
            }

            return {
                success: true,
                data: transaction
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET USER TRANSACTIONS
     */
    async getUserTransactions(userId, options = {}) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID is required' };
            }

            const { page = 1, limit = 10, status } = options;
            const skip = (page - 1) * limit;

            const where = { userId };
            if (status) where.status = status;

            const [transactions, total] = await Promise.all([
                prisma.transaction.findMany({
                    where,
                    include: {
                        payment: {
                            include: {
                                booking: {
                                    select: { bookingId: true, bookingNumber: true }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: parseInt(limit),
                    skip: parseInt(skip)
                }),
                prisma.transaction.count({ where })
            ]);

            return {
                success: true,
                data: transactions,
                pagination: {
                    total,
                    page: parseInt(page),
                    take: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * CALCULATE NET AMOUNT
     */
    calculateNetAmount(amount, gatewayFee = 0) {
        try {
            const netAmount = parseFloat(amount) - parseFloat(gatewayFee);
            return {
                success: true,
                data: { netAmount: netAmount.toFixed(2) }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new TransactionService();
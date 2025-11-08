'use strict';

import { getModels } from '../models/index.js';
import { Op } from 'sequelize';

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

            const { Transaction, Payment } = getModels();

            // Validate payment exists
            const payment = await Payment.findByPk(paymentId);
            if (!payment) {
                return { success: false, error: 'Payment not found' };
            }

            // Generate transaction number
            const transactionNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            const transaction = await Transaction.create({
                paymentId,
                transactionNumber,
                status: 'pending',
                ...transactionData
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

            const { Transaction } = getModels();

            const transactions = await Transaction.findAll({
                where: { paymentId },
                order: [
                    ['createdAt', 'DESC']
                ]
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

            const { Transaction, Payment, Booking } = getModels();

            const transaction = await Transaction.findByPk(transactionId, {
                include: [{
                    model: Payment,
                    as: 'payment',
                    include: [
                        { model: Booking, as: 'booking', attributes: ['bookingId', 'bookingNumber'] }
                    ]
                }]
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

            const { Transaction } = getModels();

            const transaction = await Transaction.findByPk(transactionId);

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

            await transaction.update(updateData);

            return {
                success: true,
                data: transaction,
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

            const { Transaction } = getModels();

            const transaction = await Transaction.findOne({
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

            const { Transaction, Payment, Booking } = getModels();

            const { page = 1, limit = 10, status } = options;
            const offset = (page - 1) * limit;

            const where = { userId };
            if (status) where.status = status;

            const { rows: transactions, count: total } = await Transaction.findAndCountAll({
                where,
                include: [{
                    model: Payment,
                    as: 'payment',
                    include: [
                        { model: Booking, as: 'booking', attributes: ['bookingId', 'bookingNumber'] }
                    ]
                }],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                success: true,
                data: transactions,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
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
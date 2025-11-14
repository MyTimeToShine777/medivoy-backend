'use strict';

import transactionService from '../services/TransactionService.js';

export class TransactionController {
    constructor() {
        this.transactionService = transactionService;
    }

    /**
     * CREATE TRANSACTION
     */
    async createTransaction(req, res) {
        try {
            const { paymentId } = req.body;
            const transactionData = req.body;

            if (!paymentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Payment ID is required'
                });
            }

            const result = await this.transactionService.createTransaction(paymentId, transactionData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET TRANSACTIONS BY PAYMENT
     */
    async getTransactionsByPayment(req, res) {
        try {
            const paymentId = req.params.paymentId;

            const result = await this.transactionService.getTransactionsByPayment(paymentId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET TRANSACTION BY ID
     */
    async getTransactionById(req, res) {
        try {
            const transactionId = req.params.transactionId;

            const result = await this.transactionService.getTransactionById(transactionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE TRANSACTION STATUS
     */
    async updateTransactionStatus(req, res) {
        try {
            const transactionId = req.params.transactionId;
            const { status, gatewayResponse } = req.body;

            const result = await this.transactionService.updateTransactionStatus(transactionId, status, gatewayResponse);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET TRANSACTION BY GATEWAY ID
     */
    async getTransactionByGatewayId(req, res) {
        try {
            const gatewayTransactionId = req.params.gatewayTransactionId;

            const result = await this.transactionService.getTransactionByGatewayId(gatewayTransactionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET USER TRANSACTIONS
     */
    async getUserTransactions(req, res) {
        try {
            const userId = req.user.userId;
            const { page, limit, status } = req.query;

            const result = await this.transactionService.getUserTransactions(userId, { page, limit, status });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new TransactionController();
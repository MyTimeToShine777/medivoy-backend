'use strict';

import invoiceService from '../services/InvoiceService.js';

export class InvoiceController {
    constructor() {
        this.invoiceService = invoiceService;
    }

    async createInvoice(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const invoiceData = req.body;

            const result = await this.invoiceService.createInvoice(bookingId, invoiceData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Invoice created successfully',
                data: result.invoice
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getInvoiceById(req, res) {
        try {
            const invoiceId = req.params.invoiceId;
            const userId = req.user ? req.user.userId : null;

            const result = await this.invoiceService.getInvoiceById(invoiceId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.invoice
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getInvoiceByNumber(req, res) {
        try {
            const invoiceNumber = req.query.invoiceNumber;

            const result = await this.invoiceService.getInvoiceByNumber(invoiceNumber);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.invoice
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listInvoices(req, res) {
        try {
            const filters = {
                userId: req.query.userId,
                status: req.query.status,
                hospitalId: req.query.hospitalId,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.invoiceService.listInvoices(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.invoices,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async markInvoicePaid(req, res) {
        try {
            const invoiceId = req.params.invoiceId;
            const paymentDetails = req.body;

            const result = await this.invoiceService.markInvoicePaid(invoiceId, paymentDetails);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Invoice marked as paid successfully',
                data: result.invoice
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async sendInvoiceReminder(req, res) {
        try {
            const invoiceId = req.params.invoiceId;

            const result = await this.invoiceService.sendInvoiceReminder(invoiceId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Invoice reminder sent successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async generateInvoicePDF(req, res) {
        try {
            const invoiceId = req.params.invoiceId;

            const result = await this.invoiceService.generateInvoicePDF(invoiceId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                downloadUrl: result.downloadUrl
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new InvoiceController();
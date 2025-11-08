// Invoice Service - Invoice generation and management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { Invoice, Booking, Payment, User } from '../models/index.js';
import PDFDocument from 'pdfkit';

class InvoiceService {
    // ========== CREATE INVOICE ==========
    async createInvoice(invoiceData) {
        try {
            const invoice = await Invoice.create({
                invoiceNumber: await this.generateInvoiceNumber(),
                status: 'draft',
                ...invoiceData,
            });

            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET INVOICE ==========
    async getInvoiceById(invoiceId) {
        try {
            const invoice = await Invoice.findByPk(invoiceId, {
                include: [
                    { model: Booking, as: 'booking' },
                    { model: User, as: 'user' },
                ],
            });

            if (!invoice) return { success: false, error: 'Not found' };
            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET USER INVOICES ==========
    async getUserInvoices(userId) {
        try {
            const invoices = await Invoice.findAll({
                where: { userId },
                order: [
                    ['createdAt', 'DESC']
                ],
            });

            return { success: true, data: invoices };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== FINALIZE INVOICE ==========
    async finalizeInvoice(invoiceId) {
        try {
            const invoice = await Invoice.findByPk(invoiceId);
            if (!invoice) return { success: false, error: 'Not found' };

            invoice.status = 'finalized';
            invoice.finalizedAt = new Date();
            await invoice.save();

            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== MARK AS PAID ==========
    async markInvoiceAsPaid(invoiceId, paymentDetails) {
        try {
            const invoice = await Invoice.findByPk(invoiceId);
            if (!invoice) return { success: false, error: 'Not found' };

            invoice.status = 'paid';
            invoice.paidAt = new Date();
            invoice.paymentMethod = paymentDetails.method;
            invoice.transactionId = paymentDetails.transactionId;

            await invoice.save();

            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GENERATE PDF ==========
    async generateInvoicePDF(invoiceId) {
        try {
            const invoice = await Invoice.findByPk(invoiceId, {
                include: [
                    { model: Booking, as: 'booking' },
                    { model: User, as: 'user' },
                ],
            });

            if (!invoice) return { success: false, error: 'Not found' };

            const doc = new PDFDocument();
            doc.fontSize(20).text('INVOICE', 100, 100);
            doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`, 100, 150);
            doc.text(`Date: ${invoice.createdAt}`, 100, 170);
            doc.text(`Amount: ${invoice.totalAmount}`, 100, 190);

            return {
                success: true,
                data: {
                    invoiceId,
                    invoiceNumber: invoice.invoiceNumber,
                    totalAmount: invoice.totalAmount,
                    status: invoice.status,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateInvoiceNumber() {
        return `INV-${Date.now()}-${Math.random() * 10000 | 0}`;
    }
}

export default new InvoiceService();
// Invoice Service - Invoice generation and management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';
import PDFDocument from 'pdfkit';

class InvoiceService {
    // ========== CREATE INVOICE ==========
    async createInvoice(invoiceData) {
        try {
            const invoice = await prisma.invoices.create({
                data: {
                    invoiceNumber: await this.generateInvoiceNumber(),
                    status: 'draft',
                    ...invoiceData
                }
            });

            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET INVOICE ==========
    async getInvoiceById(invoiceId) {
        try {
            const invoice = await prisma.invoices.findUnique({
                where: { invoiceId },
                include: {
                    booking: true,
                    users: true,
                },
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
            const invoices = await prisma.invoices.findMany({
                where: { userId },
                orderBy: {
                    createdAt: 'desc'
                },
            });

            return { success: true, data: invoices };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== FINALIZE INVOICE ==========
    async finalizeInvoice(invoiceId) {
        try {
            const invoice = await prisma.invoices.findUnique({ where: { invoiceId } });
            if (!invoice) return { success: false, error: 'Not found' };

            invoice.status = 'finalized';
            invoice.finalizedAt = new Date();
            await prisma.invoices.update({ where: { invoiceId }, data: { status: invoice.status, finalizedAt: invoice.finalizedAt, paidAt: invoice.paidAt, paymentMethod: invoice.paymentMethod } });

            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== MARK AS PAID ==========
    async markInvoiceAsPaid(invoiceId, paymentDetails) {
        try {
            const invoice = await prisma.invoices.findUnique({ where: { invoiceId } });
            if (!invoice) return { success: false, error: 'Not found' };

            invoice.status = 'paid';
            invoice.paidAt = new Date();
            invoice.paymentMethod = paymentDetails.method;
            invoice.transactionId = paymentDetails.transactionId;

            await prisma.invoices.update({ where: { invoiceId }, data: { status: invoice.status, finalizedAt: invoice.finalizedAt, paidAt: invoice.paidAt, paymentMethod: invoice.paymentMethod } });

            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GENERATE PDF ==========
    async generateInvoicePDF(invoiceId) {
        try {
            const invoice = await prisma.invoices.findUnique({
                where: { invoiceId },
                include: {
                    booking: true,
                    users: true,
                },
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

export { InvoiceService };
export default new InvoiceService();
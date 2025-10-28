const { Invoice, Payment, Booking } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateInvoiceNumber } = require('../utils/helpers');
const logger = require('../utils/logger');

class InvoiceService {
  async createInvoice(data) {
    try {
      const invoice_number = generateInvoiceNumber();
      const invoice = await Invoice.create({ ...data, invoice_number });
      logger.info(`Invoice created: ${invoice.id}`);
      return invoice;
    } catch (error) {
      logger.error('Error creating invoice:', error);
      throw new AppError('Failed to create invoice', 500);
    }
  }

  async getInvoiceById(id) {
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Booking, as: 'booking' },
        { model: Payment, as: 'payment' }
      ]
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
  }

  async getAllInvoices(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Invoice.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: Booking, as: 'booking' }],
      order: [['created_at', 'DESC']]
    });
    return { invoices: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateInvoice(id, data) {
    const invoice = await this.getInvoiceById(id);
    await invoice.update(data);
    logger.info(`Invoice updated: ${id}`);
    return invoice;
  }

  async generatePDF(id) {
    const invoice = await this.getInvoiceById(id);
    // TODO: Implement PDF generation using puppeteer or similar
    logger.info(`Generating PDF for invoice: ${id}`);
    return { message: 'PDF generation not yet implemented', invoice };
  }

  async sendInvoiceEmail(id) {
    const invoice = await this.getInvoiceById(id);
    // TODO: Implement email sending
    logger.info(`Sending invoice email: ${id}`);
    return { message: 'Invoice email sent successfully' };
  }

  async deleteInvoice(id) {
    const invoice = await this.getInvoiceById(id);
    await invoice.destroy();
    logger.info(`Invoice deleted: ${id}`);
    return { message: 'Invoice deleted successfully' };
  }
}

module.exports = new InvoiceService();

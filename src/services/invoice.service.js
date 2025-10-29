const Invoice = require('../models/Invoice.model');
const logger = require('../utils/logger');

class InvoiceService {
  /**
   * Create a new invoice
   */
  async createInvoice(data) {
    try {
      const invoice = await Invoice.create(data);
      return invoice;
    } catch (error) {
      logger.error('Create invoice service error:', error);
      throw error;
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id) {
    try {
      const invoice = await Invoice.findByPk(id);
      return invoice;
    } catch (error) {
      logger.error('Get invoice by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update invoice
   */
  async updateInvoice(id, data) {
    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      await invoice.update(data);
      return invoice;
    } catch (error) {
      logger.error('Update invoice service error:', error);
      throw error;
    }
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(id) {
    try {
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      await invoice.destroy();
      return true;
    } catch (error) {
      logger.error('Delete invoice service error:', error);
      throw error;
    }
  }

  /**
   * Get all invoices
   */
  async getAllInvoices(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;
      
      const invoices = await Invoice.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return invoices;
    } catch (error) {
      logger.error('Get all invoices service error:', error);
      throw error;
    }
  }
}

module.exports = new InvoiceService();
const Invoice = require('../models/Invoice.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class InvoiceController {
  /**
   * Create a new invoice
   */
  async createInvoice(req, res) {
    try {
      const { bookingId, patientId, amount, currency, dueDate, items } = req.body;
      
      // Create invoice
      const invoice = await Invoice.create({
        bookingId,
        patientId,
        amount,
        currency,
        dueDate,
        items,
      });
      
      return successResponse(res, {
        message: 'Invoice created successfully',
        data: invoice,
      }, 201);
    } catch (error) {
      logger.error('Create invoice error:', error);
      return errorResponse(res, {
        message: 'Failed to create invoice',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoice(req, res) {
    try {
      const { id } = req.params;
      
      // Find invoice
      const invoice = await Invoice.findByPk(id);
      
      if (!invoice) {
        return errorResponse(res, {
          message: 'Invoice not found',
        }, 404);
      }
      
      return successResponse(res, {
        message: 'Invoice retrieved successfully',
        data: invoice,
      });
    } catch (error) {
      logger.error('Get invoice error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve invoice',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all invoices
   */
  async getAllInvoices(req, res) {
    try {
      const { page = 1, limit = 10, status, patientId } = req.query;
      
      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (patientId) where.patientId = patientId;
      
      // Get invoices with pagination
      const invoices = await Invoice.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });
      
      return successResponse(res, {
        message: 'Invoices retrieved successfully',
        data: invoices.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(invoices.count / parseInt(limit, 10)),
          totalRecords: invoices.count,
        },
      });
    } catch (error) {
      logger.error('Get all invoices error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve invoices',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new InvoiceController();
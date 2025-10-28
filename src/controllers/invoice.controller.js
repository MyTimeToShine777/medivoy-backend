const invoiceService = require('../services/invoice.service');
const { successResponse } = require('../utils/response');

class InvoiceController {
  async createInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.createInvoice(req.body);
      return successResponse(res, invoice, 'Invoice created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.getInvoiceById(req.params.id);
      return successResponse(res, invoice, 'Invoice retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllInvoices(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await invoiceService.getAllInvoices(filters, { page, limit });
      return successResponse(res, result, 'Invoices retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
      return successResponse(res, invoice, 'Invoice updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async generatePDF(req, res, next) {
    try {
      const result = await invoiceService.generatePDF(req.params.id);
      return successResponse(res, result, 'Invoice PDF generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async sendInvoiceEmail(req, res, next) {
    try {
      const result = await invoiceService.sendInvoiceEmail(req.params.id);
      return successResponse(res, result, 'Invoice email sent successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteInvoice(req, res, next) {
    try {
      const result = await invoiceService.deleteInvoice(req.params.id);
      return successResponse(res, result, 'Invoice deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoiceController();

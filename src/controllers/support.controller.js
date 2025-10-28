const supportService = require('../services/support.service');
const { successResponse } = require('../utils/response');

class SupportController {
  async createTicket(req, res, next) {
    try {
      const ticket = await supportService.createTicket(req.body);
      return successResponse(res, ticket, 'Support ticket created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTicket(req, res, next) {
    try {
      const ticket = await supportService.getTicketById(req.params.id);
      return successResponse(res, ticket, 'Support ticket retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllTickets(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await supportService.getAllTickets(filters, { page, limit });
      return successResponse(res, result, 'Support tickets retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTicket(req, res, next) {
    try {
      const ticket = await supportService.updateTicket(req.params.id, req.body);
      return successResponse(res, ticket, 'Support ticket updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTicketStatus(req, res, next) {
    try {
      const { status } = req.body;
      const ticket = await supportService.updateTicketStatus(req.params.id, status);
      return successResponse(res, ticket, 'Support ticket status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async addReply(req, res, next) {
    try {
      const ticket = await supportService.addReply(req.params.id, req.body);
      return successResponse(res, ticket, 'Reply added successfully');
    } catch (error) {
      next(error);
    }
  }

  async closeTicket(req, res, next) {
    try {
      const ticket = await supportService.closeTicket(req.params.id);
      return successResponse(res, ticket, 'Support ticket closed successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req, res, next) {
    try {
      const result = await supportService.deleteTicket(req.params.id);
      return successResponse(res, result, 'Support ticket deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupportController();

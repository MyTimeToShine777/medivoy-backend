const SupportTicket = require('../models/SupportTicket.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

class SupportController {
  /**
   * Create a new support ticket
   */
  static async createTicket(req, res) {
    try {
      const { userId, subject, description, priority, category } = req.body;

      // Create support ticket
      const ticket = await SupportTicket.create({
        userId,
        subject,
        description,
        priority,
        category,
      });

      return successResponse(
        res,
        {
          message: 'Support ticket created successfully',
          data: ticket,
        },
        201
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get support ticket by ID
   */
  static async getTicket(req, res) {
    try {
      const { id } = req.params;

      // Find support ticket
      const ticket = await SupportTicket.findByPk(id);

      if (!ticket) {
        return errorResponse(
          res,
          {
            message: 'Support ticket not found',
          },
          404
        );
      }

      return successResponse(res, {
        message: 'Support ticket retrieved successfully',
        data: ticket,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update support ticket
   */
  static async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { subject, description, priority, category, status } = req.body;

      // Find support ticket
      const ticket = await SupportTicket.findByPk(id);

      if (!ticket) {
        return errorResponse(
          res,
          {
            message: 'Support ticket not found',
          },
          404
        );
      }

      // Update support ticket
      await ticket.update({
        subject,
        description,
        priority,
        category,
        status,
      });

      return successResponse(res, {
        message: 'Support ticket updated successfully',
        data: ticket,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete support ticket
   */
  static async deleteTicket(req, res) {
    try {
      const { id } = req.params;

      // Find support ticket
      const ticket = await SupportTicket.findByPk(id);

      if (!ticket) {
        return errorResponse(
          res,
          {
            message: 'Support ticket not found',
          },
          404
        );
      }

      // Delete support ticket
      await ticket.destroy();

      return successResponse(res, {
        message: 'Support ticket deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all support tickets
   */
  static async getAllTickets(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority,
        category,
        userId,
      } = req.query;

      // Build where clause
      const where = {};
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (category) where.category = category;
      if (userId) where.userId = userId;

      // Get support tickets with pagination
      const tickets = await SupportTicket.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Support tickets retrieved successfully',
        data: tickets.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(tickets.count / parseInt(limit, 10)),
          totalRecords: tickets.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Add response to support ticket
   */
  static async addResponse(req, res) {
    try {
      const { id } = req.params;
      const { responseText, responderId } = req.body;

      // Find support ticket
      const ticket = await SupportTicket.findByPk(id);

      if (!ticket) {
        return errorResponse(
          res,
          {
            message: 'Support ticket not found',
          },
          404
        );
      }

      // Add response to ticket
      const responses = ticket.responses || [];
      responses.push({
        text: responseText,
        responderId,
        createdAt: new Date(),
      });

      // Update ticket with new response
      await ticket.update({ responses, status: 'in_progress' });

      return successResponse(res, {
        message: 'Response added to support ticket successfully',
        data: ticket,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Close support ticket
   */
  static async closeTicket(req, res) {
    try {
      const { id } = req.params;

      // Find support ticket
      const ticket = await SupportTicket.findByPk(id);

      if (!ticket) {
        return errorResponse(
          res,
          {
            message: 'Support ticket not found',
          },
          404
        );
      }

      // Close ticket
      await ticket.update({ status: 'closed', closedAt: new Date() });

      return successResponse(res, {
        message: 'Support ticket closed successfully',
        data: ticket,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get support ticket by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const ticket = await SupportTicket.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: User, as: 'assignedTo' },
        ],
      });

      if (!ticket) {
        return errorResponse(res, 'Support ticket not found', 404);
      }

      return successResponse(res, {
        message: 'Support ticket retrieved successfully',
        data: ticket,
      });
    } catch (error) {
      return handleDatabaseError(
        error,
        res,
        'Failed to retrieve support ticket'
      );
    }
  }
}

module.exports = SupportController;

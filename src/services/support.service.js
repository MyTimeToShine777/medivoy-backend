const SupportTicket = require('../models/SupportTicket.model');
const logger = require('../utils/logger');

class SupportService {
  /**
   * Create a new support ticket
   */
  async createTicket(data) {
    try {
      const ticket = await SupportTicket.create(data);
      return ticket;
    } catch (error) {
      logger.error('Create support ticket service error:', error);
      throw error;
    }
  }

  /**
   * Get support ticket by ID
   */
  async getTicketById(id) {
    try {
      const ticket = await SupportTicket.findByPk(id);
      return ticket;
    } catch (error) {
      logger.error('Get support ticket by ID service error:', error);
      throw error;
    }
  }

  /**
   * Update support ticket
   */
  async updateTicket(id, data) {
    try {
      const ticket = await SupportTicket.findByPk(id);
      if (!ticket) {
        throw new Error('Support ticket not found');
      }

      await ticket.update(data);
      return ticket;
    } catch (error) {
      logger.error('Update support ticket service error:', error);
      throw error;
    }
  }

  /**
   * Delete support ticket
   */
  async deleteTicket(id) {
    try {
      const ticket = await SupportTicket.findByPk(id);
      if (!ticket) {
        throw new Error('Support ticket not found');
      }

      await ticket.destroy();
      return true;
    } catch (error) {
      logger.error('Delete support ticket service error:', error);
      throw error;
    }
  }

  /**
   * Get all support tickets
   */
  async getAllTickets(filters = {}) {
    try {
      const { page = 1, limit = 10, ...where } = filters;

      const tickets = await SupportTicket.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return tickets;
    } catch (error) {
      logger.error('Get all tickets service error:', error);
      throw error;
    }
  }
}

module.exports = new SupportService();

const { SupportTicket, User } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class SupportService {
  async createTicket(data) {
    try {
      const ticket = await SupportTicket.create({
        ...data,
        status: 'open',
        ticket_number: `TKT-${Date.now()}`
      });
      logger.info(`Support ticket created: ${ticket.id}`);
      return ticket;
    } catch (error) {
      logger.error('Error creating support ticket:', error);
      throw new AppError('Failed to create support ticket', 500);
    }
  }

  async getTicketById(id) {
    const ticket = await SupportTicket.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!ticket) throw new AppError('Support ticket not found', 404);
    return ticket;
  }

  async getAllTickets(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await SupportTicket.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']]
    });
    return { tickets: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateTicket(id, data) {
    const ticket = await this.getTicketById(id);
    await ticket.update(data);
    logger.info(`Support ticket updated: ${id}`);
    return ticket;
  }

  async updateTicketStatus(id, status) {
    const ticket = await this.getTicketById(id);
    await ticket.update({ status });
    logger.info(`Support ticket status updated: ${id} - ${status}`);
    return ticket;
  }

  async addReply(id, reply) {
    const ticket = await this.getTicketById(id);
    const replies = ticket.replies || [];
    replies.push({ ...reply, timestamp: new Date() });
    await ticket.update({ replies });
    logger.info(`Reply added to ticket: ${id}`);
    return ticket;
  }

  async closeTicket(id) {
    const ticket = await this.getTicketById(id);
    await ticket.update({ status: 'closed', closed_at: new Date() });
    logger.info(`Support ticket closed: ${id}`);
    return ticket;
  }

  async deleteTicket(id) {
    const ticket = await this.getTicketById(id);
    await ticket.destroy();
    logger.info(`Support ticket deleted: ${id}`);
    return { message: 'Support ticket deleted successfully' };
  }
}

module.exports = new SupportService();

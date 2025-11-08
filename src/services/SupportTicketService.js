// Support Ticket Service - Customer support management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { SupportTicket, User, Booking } from '../models/index.js';

class SupportTicketService {
    // ========== CREATE TICKET ==========
    async createTicket(ticketData) {
        try {
            const ticket = await SupportTicket.create({
                ticketNumber: await this.generateTicketNumber(),
                status: 'new',
                ...ticketData,
            });

            return { success: true, data: ticket };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET TICKET ==========
    async getTicketById(ticketId) {
        try {
            const ticket = await SupportTicket.findByPk(ticketId, {
                include: [
                    { model: User, as: 'customer' },
                    { model: Booking, as: 'booking' },
                ],
            });

            if (!ticket) return { success: false, error: 'Not found' };
            return { success: true, data: ticket };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET USER TICKETS ==========
    async getUserTickets(userId, filters = {}) {
        try {
            const where = { userId };

            if (filters.status) where.status = filters.status;

            const tickets = await SupportTicket.findAll({
                where,
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            return { success: true, data: tickets };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE TICKET STATUS ==========
    async updateTicketStatus(ticketId, newStatus) {
        try {
            const ticket = await SupportTicket.findByPk(ticketId);
            if (!ticket) return { success: false, error: 'Not found' };

            ticket.status = newStatus;
            if (newStatus === 'resolved') {
                ticket.resolvedAt = new Date();
            }

            await ticket.save();
            return { success: true, data: ticket };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ASSIGN TICKET ==========
    async assignTicket(ticketId, staffId) {
        try {
            const ticket = await SupportTicket.findByPk(ticketId);
            if (!ticket) return { success: false, error: 'Not found' };

            ticket.assignedToId = staffId;
            ticket.status = 'open';
            await ticket.save();

            return { success: true, data: ticket };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateTicketNumber() {
        return `TKT-${Date.now()}-${Math.random() * 10000 | 0}`;
    }
}

export default new SupportTicketService();
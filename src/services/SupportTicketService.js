// Support Ticket Service - Customer support management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class SupportTicketService {
    // ========== CREATE TICKET ==========
    async createTicket(ticketData) {
        try {
            const ticket = await prisma.supportTicket.create({
                data: {
                    ticketNumber: await this.generateTicketNumber(),
                    status: 'new',
                    ...ticketData,
                }
            });

            return { success: true, data: ticket };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET TICKET ==========
    async getTicketById(ticketId) {
        try {
            const ticket = await prisma.supportTicket.findUnique({
                where: { ticketId },
                include: {
                    customer: true,
                    booking: true
                }
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

            const tickets = await prisma.supportTicket.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                take: filters.limit || 20,
                skip: filters.offset || 0,
            });

            return { success: true, data: tickets };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE TICKET STATUS ==========
    async updateTicketStatus(ticketId, newStatus) {
        try {
            const ticket = await prisma.supportTicket.findUnique({
                where: { ticketId }
            });
            if (!ticket) return { success: false, error: 'Not found' };

            const updateData = { status: newStatus };
            if (newStatus === 'resolved') {
                updateData.resolvedAt = new Date();
            }

            const updated = await prisma.supportTicket.update({
                where: { ticketId },
                data: updateData
            });
            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ASSIGN TICKET ==========
    async assignTicket(ticketId, staffId) {
        try {
            const ticket = await prisma.supportTicket.findUnique({
                where: { ticketId }
            });
            if (!ticket) return { success: false, error: 'Not found' };

            const updated = await prisma.supportTicket.update({
                where: { ticketId },
                data: {
                    assignedToId: staffId,
                    status: 'open'
                }
            });

            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateTicketNumber() {
        return `TKT-${Date.now()}-${Math.random() * 10000 | 0}`;
    }
}

export default new SupportTicketService();
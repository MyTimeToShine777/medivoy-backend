'use strict';

import { SupportTicketService } from '../services/SupportTicketService.js';

export class SupportTicketController {
    constructor() {
        this.supportTicketService = new SupportTicketService();
    }

    async createTicket(req, res) {
        try {
            const userId = req.user.userId;
            const ticketData = req.body;

            const result = await this.supportTicketService.createTicket(userId, ticketData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Support ticket created successfully',
                data: result.ticket
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getTicketById(req, res) {
        try {
            const ticketId = req.params.ticketId;
            const userId = req.user.userId;

            const result = await this.supportTicketService.getTicketById(ticketId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.ticket
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserTickets(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                status: req.query.status,
                priority: req.query.priority,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.supportTicketService.getUserTickets(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.tickets,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateTicket(req, res) {
        try {
            const ticketId = req.params.ticketId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.supportTicketService.updateTicket(ticketId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Support ticket updated successfully',
                data: result.ticket
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async addTicketReply(req, res) {
        try {
            const ticketId = req.params.ticketId;
            const userId = req.user.userId;
            const replyData = req.body;

            const result = await this.supportTicketService.addTicketReply(ticketId, userId, replyData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Reply added successfully',
                data: result.reply
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async closeTicket(req, res) {
        try {
            const ticketId = req.params.ticketId;
            const userId = req.user.userId;
            const resolution = req.body.resolution;

            const result = await this.supportTicketService.closeTicket(ticketId, userId, resolution);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Support ticket closed successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async escalateTicket(req, res) {
        try {
            const ticketId = req.params.ticketId;
            const reason = req.body.reason;

            const result = await this.supportTicketService.escalateTicket(ticketId, reason);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Ticket escalated successfully'
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new SupportTicketController();
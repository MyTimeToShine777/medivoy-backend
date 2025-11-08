'use strict';

import { BookingService } from '../services/BookingService.js';
import { AppError } from '../utils/errors/AppError.js';

export class BookingController {
    constructor() {
        this.bookingService = new BookingService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // BOOKING ENDPOINTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async createBooking(req, res) {
        try {
            const userId = req.user.userId;
            const bookingData = req.body;

            const result = await this.bookingService.createBooking(userId, bookingData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: result.booking
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBookingById(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;

            const result = await this.bookingService.getBookingById(bookingId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.booking
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getUserBookings(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                status: req.query.status,
                limit: parseInt(req.query.limit) || 10,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.bookingService.getUserBookings(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.bookings,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateBooking(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;
            const updateData = req.body;

            const result = await this.bookingService.updateBooking(bookingId, userId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Booking updated successfully',
                data: result.booking
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async cancelBooking(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;
            const reason = req.body.reason;

            const result = await this.bookingService.cancelBooking(bookingId, userId, reason);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Booking cancelled successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // BOOKING WORKFLOW ENDPOINTS
    // ═══════════════════════════════════════════════════════════════════════════════

    async startWorkflow(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;

            const result = await this.bookingService.startWorkflow(bookingId, userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Workflow started',
                data: result.workflow
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getWorkflowProgress(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;

            const result = await this.bookingService.getWorkflowProgress(bookingId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.progress
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async proceedToNextStep(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;
            const stepData = req.body;

            const result = await this.bookingService.proceedToNextStep(bookingId, userId, stepData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Proceeding to next step',
                data: result.booking
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBookingHistory(req, res) {
        try {
            const bookingId = req.params.bookingId;
            const userId = req.user.userId;

            const result = await this.bookingService.getBookingHistory(bookingId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.history
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new BookingController();
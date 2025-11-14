'use strict';

import companionService from '../services/CompanionService.js';

export class CompanionController {
    constructor() {
        this.companionService = companionService;
    }

    /**
     * ADD COMPANION
     */
    async addCompanion(req, res) {
        try {
            const { bookingId, patientId } = req.body;
            const companionData = req.body;

            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: 'Booking ID is required'
                });
            }

            const result = await this.companionService.addCompanion(bookingId, patientId, companionData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET BOOKING COMPANIONS
     */
    async getBookingCompanions(req, res) {
        try {
            const bookingId = req.params.bookingId;

            const result = await this.companionService.getBookingCompanions(bookingId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET COMPANION BY ID
     */
    async getCompanionById(req, res) {
        try {
            const companionId = req.params.companionId;

            const result = await this.companionService.getCompanionById(companionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE COMPANION
     */
    async updateCompanion(req, res) {
        try {
            const companionId = req.params.companionId;
            const updateData = req.body;

            const result = await this.companionService.updateCompanion(companionId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * REMOVE COMPANION
     */
    async removeCompanion(req, res) {
        try {
            const companionId = req.params.companionId;

            const result = await this.companionService.removeCompanion(companionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET PATIENT COMPANIONS
     */
    async getPatientCompanions(req, res) {
        try {
            const patientId = req.params.patientId || req.user.patientId;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID is required'
                });
            }

            const result = await this.companionService.getPatientCompanions(patientId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new CompanionController();
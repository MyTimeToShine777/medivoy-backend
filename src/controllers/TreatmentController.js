'use strict';

import treatmentService from '../services/TreatmentService.js';

export class TreatmentController {
    constructor() {
        this.treatmentService = treatmentService;
    }

    async createTreatment(req, res) {
        try {
            const treatmentData = req.body;

            const result = await this.treatmentService.createTreatment(treatmentData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Treatment created',
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getTreatmentById(req, res) {
        try {
            const treatmentId = req.params.treatmentId;

            const result = await this.treatmentService.getTreatmentById(treatmentId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listTreatments(req, res) {
        try {
            const filters = {
                category: req.query.category,
                search: req.query.search,
                minPrice: parseInt(req.query.minPrice) || null,
                maxPrice: parseInt(req.query.maxPrice) || null,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.treatmentService.searchTreatments(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async searchTreatments(req, res) {
        try {
            const query = req.query.q;

            const result = await this.treatmentService.searchTreatments(query);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateTreatment(req, res) {
        try {
            const treatmentId = req.params.treatmentId;
            const updateData = req.body;

            const result = await this.treatmentService.updateTreatment(treatmentId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Treatment updated',
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getTreatmentStats(req, res) {
        try {
            const treatmentId = req.params.treatmentId;

            const result = await this.treatmentService.getTreatmentStats(treatmentId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new TreatmentController();
'use strict';

import specializationService from '../services/SpecializationService.js';

export class SpecializationController {
    constructor() {
        this.specializationService = specializationService;
    }

    async createSpecialization(req, res) {
        try {
            const specializationData = req.body;

            const result = await this.specializationService.createSpecialization(specializationData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Specialization created',
                data: result.specialization
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getSpecializationById(req, res) {
        try {
            const specializationId = req.params.specializationId;

            const result = await this.specializationService.getSpecializationById(specializationId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.specialization
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async listSpecializations(req, res) {
        try {
            const filters = {
                search: req.query.search,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.specializationService.listSpecializations(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.specializations,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateSpecialization(req, res) {
        try {
            const specializationId = req.params.specializationId;
            const updateData = req.body;

            const result = await this.specializationService.updateSpecialization(specializationId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Specialization updated',
                data: result.specialization
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getSpecializationDoctors(req, res) {
        try {
            const specializationId = req.params.specializationId;
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.specializationService.getSpecializationDoctors(specializationId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.doctors,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getSpecializationStats(req, res) {
        try {
            const specializationId = req.params.specializationId;

            const result = await this.specializationService.getSpecializationStats(specializationId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.stats
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new SpecializationController();
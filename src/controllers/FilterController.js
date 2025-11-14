'use strict';

import filterService from '../services/FilterService.js';

export class FilterController {
    constructor() {
        this.filterService = filterService;
    }

    async filterHospitals(req, res) {
        try {
            const filters = {
                cityId: req.query.cityId,
                countryId: req.query.countryId,
                minRating: parseInt(req.query.minRating) || null,
                accreditation: req.query.accreditation,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.filterService.filterHospitals(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.hospitals,
                pagination: result.pagination,
                appliedFilters: result.appliedFilters
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async filterDoctors(req, res) {
        try {
            const filters = {
                specializationId: req.query.specializationId,
                hospitalId: req.query.hospitalId,
                minExperience: parseInt(req.query.minExperience) || null,
                minRating: parseInt(req.query.minRating) || null,
                availability: req.query.availability === 'true',
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.filterService.filterDoctors(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.doctors,
                pagination: result.pagination,
                appliedFilters: result.appliedFilters
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async filterTreatments(req, res) {
        try {
            const filters = {
                category: req.query.category,
                minPrice: parseInt(req.query.minPrice) || null,
                maxPrice: parseInt(req.query.maxPrice) || null,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.filterService.filterTreatments(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.treatments,
                pagination: result.pagination,
                appliedFilters: result.appliedFilters
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async filterPackages(req, res) {
        try {
            const filters = {
                treatmentId: req.query.treatmentId,
                hospitalId: req.query.hospitalId,
                minPrice: parseInt(req.query.minPrice) || null,
                maxPrice: parseInt(req.query.maxPrice) || null,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.filterService.filterPackages(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.packages,
                pagination: result.pagination,
                appliedFilters: result.appliedFilters
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getFilterOptions(req, res) {
        try {
            const entityType = req.query.type;

            const result = await this.filterService.getFilterOptions(entityType);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                options: result.options
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new FilterController();
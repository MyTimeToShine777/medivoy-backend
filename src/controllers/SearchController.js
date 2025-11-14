'use strict';

import searchService from '../services/SearchService.js';

export class SearchController {
    constructor() {
        this.searchService = searchService;
    }

    async globalSearch(req, res) {
        try {
            const query = req.query.q;
            const filters = {
                limit: parseInt(req.query.limit) || 10
            };

            const result = await this.searchService.globalSearch(query, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                totalResults: result.totalResults
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async searchHospitals(req, res) {
        try {
            const query = req.query.q;
            const filters = {
                cityId: req.query.cityId,
                countryId: req.query.countryId,
                minRating: parseInt(req.query.minRating) || null,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.searchService.searchHospitals(query, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.hospitals,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async searchDoctors(req, res) {
        try {
            const query = req.query.q;
            const filters = {
                specializationId: req.query.specializationId,
                hospitalId: req.query.hospitalId,
                minRating: parseInt(req.query.minRating) || null,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.searchService.searchDoctors(query, filters);

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

    async searchTreatments(req, res) {
        try {
            const query = req.query.q;
            const filters = {
                category: req.query.category,
                minPrice: parseInt(req.query.minPrice) || null,
                maxPrice: parseInt(req.query.maxPrice) || null,
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.searchService.searchTreatments(query, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.treatments,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getAutocompleteSuggestions(req, res) {
        try {
            const query = req.query.q;
            const entityType = req.query.type || 'all';

            const result = await this.searchService.getAutocompleteSuggestions(query, entityType);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                suggestions: result.suggestions
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new SearchController();
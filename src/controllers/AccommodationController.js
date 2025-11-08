'use strict';

import { accommodationService } from '../services/AccommodationService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOMMODATION CONTROLLER - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class AccommodationController {
    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE ACCOMMODATION
    // ─────────────────────────────────────────────────────────────────────────────

    async createAccommodation(req, res, next) {
        try {
            const result = await accommodationService.createAccommodation(req.body);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            return res.status(201).json(ResponseFormatter.created(result.data, 'Accommodation created successfully'));
        } catch (error) {
            console.error('❌ Create error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET ACCOMMODATION BY ID
    // ─────────────────────────────────────────────────────────────────────────────

    async getAccommodationById(req, res, next) {
        try {
            const result = await accommodationService.getAccommodationById(req.params.accommodationId);

            if (!result.success) {
                return res.status(404).json(ResponseFormatter.error(result.error, 404, result.code || 'NOT_FOUND'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ Get error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LIST ACCOMMODATIONS
    // ─────────────────────────────────────────────────────────────────────────────

    async listAccommodations(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            const filters = {
                city: req.query.city,
                accommodationType: req.query.type,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice
            };

            const result = await accommodationService.listAccommodations(filters, limit, offset);

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ List error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE ACCOMMODATION
    // ─────────────────────────────────────────────────────────────────────────────

    async updateAccommodation(req, res, next) {
        try {
            const result = await accommodationService.updateAccommodation(req.params.accommodationId, req.body);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Accommodation updated successfully'));
        } catch (error) {
            console.error('❌ Update error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE ACCOMMODATION
    // ─────────────────────────────────────────────────────────────────────────────

    async deleteAccommodation(req, res, next) {
        try {
            const result = await accommodationService.deleteAccommodation(req.params.accommodationId);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success({}, result.message));
        } catch (error) {
            console.error('❌ Delete error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SEARCH ACCOMMODATIONS
    // ─────────────────────────────────────────────────────────────────────────────

    async searchAccommodations(req, res, next) {
        try {
            if (!req.query.q) {
                return res.status(400).json(ResponseFormatter.error('Search query required', 400, 'VALIDATION_ERROR'));
            }

            const result = await accommodationService.searchAccommodations(req.query.q);

            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            console.error('❌ Search error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE AVAILABILITY
    // ─────────────────────────────────────────────────────────────────────────────

    async updateAvailability(req, res, next) {
        try {
            if (req.body.availableRooms === undefined) {
                return res.status(400).json(ResponseFormatter.error('Available rooms required', 400, 'VALIDATION_ERROR'));
            }

            const result = await accommodationService.updateAvailability(req.params.accommodationId, req.body.availableRooms);

            if (!result.success) {
                return res.status(400).json(ResponseFormatter.error(result.error, 400, result.code || 'VALIDATION_ERROR'));
            }

            return res.status(200).json(ResponseFormatter.success(result.data, 'Availability updated'));
        } catch (error) {
            console.error('❌ Update availability error:', error.message);
            return res.status(500).json(ResponseFormatter.error(error.message, 500, 'SERVER_ERROR'));
        }
    }
}

export default new AccommodationController();
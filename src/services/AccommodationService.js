'use strict';

import { Accommodation } from '../models/index.js';
import { cacheService } from '../config/redis.js';

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOMMODATION SERVICE - ULTRA-COMPREHENSIVE
// ═══════════════════════════════════════════════════════════════════════════════

export class AccommodationService {
    // ─────────────────────────────────────────────────────────────────────────────
    // CREATE ACCOMMODATION
    // ─────────────────────────────────────────────────────────────────────────────

    async createAccommodation(data) {
        try {
            const accommodation = await Accommodation.create({
                accommodationName: data.accommodationName,
                accommodationType: data.accommodationType,
                location: data.location,
                city: data.city,
                country: data.country,
                pricePerNight: data.pricePerNight,
                currency: data.currency || 'INR',
                totalRooms: data.totalRooms,
                availableRooms: data.availableRooms || data.totalRooms,
                amenities: data.amenities || [],
                checkInTime: data.checkInTime,
                checkOutTime: data.checkOutTime,
                description: data.description,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                rating: data.rating || 0,
                isActive: data.isActive !== false,
                createdAt: new Date()
            });

            await cacheService.delete('accommodations');
            console.log(`✅ Accommodation created: ${accommodation.accommodationId}`);

            return { success: true, data: accommodation };
        } catch (error) {
            console.error('❌ Create accommodation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET ACCOMMODATION BY ID
    // ─────────────────────────────────────────────────────────────────────────────

    async getAccommodationById(accommodationId) {
        try {
            const accommodation = await Accommodation.findByPk(accommodationId);

            if (!accommodation) {
                return { success: false, error: 'Accommodation not found', code: 'NOT_FOUND' };
            }

            return { success: true, data: accommodation };
        } catch (error) {
            console.error('❌ Get accommodation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // LIST ALL ACCOMMODATIONS
    // ─────────────────────────────────────────────────────────────────────────────

    async listAccommodations(filters = {}, limit = 20, offset = 0) {
        try {
            const cacheKey = `accommodations_${JSON.stringify(filters)}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: cached };

            const where = { isActive: true };
            if (filters.city) where.city = filters.city;
            if (filters.accommodationType) where.accommodationType = filters.accommodationType;
            if (filters.minPrice || filters.maxPrice) {
                where.pricePerNight = {};
                if (filters.minPrice) where.pricePerNight[require('sequelize').Op.gte] = filters.minPrice;
                if (filters.maxPrice) where.pricePerNight[require('sequelize').Op.lte] = filters.maxPrice;
            }

            const accommodations = await Accommodation.findAll({
                where,
                limit,
                offset,
                order: [
                    ['rating', 'DESC']
                ]
            });

            await cacheService.set(cacheKey, accommodations, 3600);
            return { success: true, data: accommodations };
        } catch (error) {
            console.error('❌ List accommodations error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE ACCOMMODATION
    // ─────────────────────────────────────────────────────────────────────────────

    async updateAccommodation(accommodationId, data) {
        try {
            const accommodation = await Accommodation.findByPk(accommodationId);

            if (!accommodation) {
                return { success: false, error: 'Accommodation not found', code: 'NOT_FOUND' };
            }

            await accommodation.update({
                accommodationName: data.accommodationName || accommodation.accommodationName,
                location: data.location || accommodation.location,
                pricePerNight: data.pricePerNight || accommodation.pricePerNight,
                totalRooms: data.totalRooms || accommodation.totalRooms,
                availableRooms: data.availableRooms !== undefined ? data.availableRooms : accommodation.availableRooms,
                amenities: data.amenities || accommodation.amenities,
                description: data.description || accommodation.description,
                contactEmail: data.contactEmail || accommodation.contactEmail,
                contactPhone: data.contactPhone || accommodation.contactPhone,
                rating: data.rating || accommodation.rating,
                isActive: data.isActive !== undefined ? data.isActive : accommodation.isActive,
                updatedAt: new Date()
            });

            await cacheService.delete('accommodations');
            console.log(`✅ Accommodation updated: ${accommodationId}`);

            return { success: true, data: accommodation };
        } catch (error) {
            console.error('❌ Update accommodation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE ACCOMMODATION
    // ─────────────────────────────────────────────────────────────────────────────

    async deleteAccommodation(accommodationId) {
        try {
            const accommodation = await Accommodation.findByPk(accommodationId);

            if (!accommodation) {
                return { success: false, error: 'Accommodation not found', code: 'NOT_FOUND' };
            }

            await accommodation.destroy();
            await cacheService.delete('accommodations');
            console.log(`✅ Accommodation deleted: ${accommodationId}`);

            return { success: true, message: 'Accommodation deleted successfully' };
        } catch (error) {
            console.error('❌ Delete accommodation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SEARCH ACCOMMODATIONS
    // ─────────────────────────────────────────────────────────────────────────────

    async searchAccommodations(query) {
        try {
            const accommodations = await Accommodation.findAll({
                where: {
                    isActive: true,
                    [require('sequelize').Op.or]: [
                        { accommodationName: {
                                [require('sequelize').Op.iLike]: `%${query}%` } },
                        { location: {
                                [require('sequelize').Op.iLike]: `%${query}%` } },
                        { city: {
                                [require('sequelize').Op.iLike]: `%${query}%` } },
                        { country: {
                                [require('sequelize').Op.iLike]: `%${query}%` } }
                    ]
                }
            });

            return { success: true, data: accommodations };
        } catch (error) {
            console.error('❌ Search accommodations error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE AVAILABILITY
    // ─────────────────────────────────────────────────────────────────────────────

    async updateAvailability(accommodationId, availableRooms) {
        try {
            const accommodation = await Accommodation.findByPk(accommodationId);

            if (!accommodation) {
                return { success: false, error: 'Accommodation not found', code: 'NOT_FOUND' };
            }

            if (availableRooms < 0 || availableRooms > accommodation.totalRooms) {
                return { success: false, error: 'Invalid availability', code: 'VALIDATION_ERROR' };
            }

            await accommodation.update({ availableRooms, updatedAt: new Date() });
            await cacheService.delete('accommodations');

            return { success: true, data: accommodation };
        } catch (error) {
            console.error('❌ Update availability error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const accommodationService = new AccommodationService();
export default accommodationService;
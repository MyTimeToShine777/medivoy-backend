'use strict';

import prisma from '../config/prisma.js';
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
            const accommodation = await prisma.accommodation.create({
                data: {
                    userId: data.userId,
                    type: data.accommodationType,
                    name: data.accommodationName,
                    address: data.location,
                    city: data.city,
                    checkInDate: data.checkInDate || new Date(),
                    checkOutDate: data.checkOutDate || new Date(),
                    numberOfGuests: data.numberOfGuests || 1,
                    pricePerNight: data.pricePerNight,
                    totalPrice: data.totalPrice || data.pricePerNight,
                    finalPrice: data.finalPrice || data.totalPrice || data.pricePerNight,
                    currency: data.currency || 'INR',
                    phone: data.contactPhone,
                    email: data.contactEmail,
                    amenities: data.amenities || [],
                    rating: data.rating || 0,
                    isActive: data.isActive !== false,
                }
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
            const accommodation = await prisma.accommodation.findUnique({
                where: { accommodationId }
            });

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
            if (filters.accommodationType) where.type = filters.accommodationType;
            if (filters.minPrice || filters.maxPrice) {
                where.pricePerNight = {};
                if (filters.minPrice) where.pricePerNight.gte = filters.minPrice;
                if (filters.maxPrice) where.pricePerNight.lte = filters.maxPrice;
            }

            const accommodations = await prisma.accommodation.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: {
                    rating: 'desc'
                }
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
            const accommodation = await prisma.accommodation.findUnique({
                where: { accommodationId }
            });

            if (!accommodation) {
                return { success: false, error: 'Accommodation not found', code: 'NOT_FOUND' };
            }

            const updated = await prisma.accommodation.update({
                where: { accommodationId },
                data: {
                    name: data.accommodationName,
                    address: data.location,
                    pricePerNight: data.pricePerNight,
                    numberOfRooms: data.totalRooms,
                    amenities: data.amenities,
                    specialRequirements: data.description,
                    email: data.contactEmail,
                    phone: data.contactPhone,
                    rating: data.rating,
                    isActive: data.isActive,
                    updatedAt: new Date()
                }
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
            const accommodation = await prisma.accommodation.findUnique({
                where: { accommodationId }
            });

            if (!accommodation) {
                return { success: false, error: 'Accommodation not found', code: 'NOT_FOUND' };
            }

            await prisma.accommodation.delete({
                where: { accommodationId }
            });
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
            const accommodations = await prisma.accommodation.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } },
                        { city: { contains: query, mode: 'insensitive' } }
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
            const accommodation = await prisma.accommodation.findUnique({
                where: { accommodationId }
            });

            if (!accommodation) {
                return { success: false, error: 'Accommodation not found', code: 'NOT_FOUND' };
            }

            if (availableRooms < 0 || availableRooms > accommodation.numberOfRooms) {
                return { success: false, error: 'Invalid availability', code: 'VALIDATION_ERROR' };
            }

            const updated = await prisma.accommodation.update({
                where: { accommodationId },
                data: { numberOfRooms: availableRooms, updatedAt: new Date() }
            });
            await cacheService.delete('accommodations');

            return { success: true, data: updated };
        } catch (error) {
            console.error('❌ Update availability error:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const accommodationService = new AccommodationService();
export default new AccommodationService();
'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class FilterService {
    constructor() {
        this.validationService = validationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL FILTERING
    // ═══════════════════════════════════════════════════════════════════════════════

    async filterHospitals(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.cityId) where.cityId = filters.cityId;
            if (filters.countryId) where.countryId = filters.countryId;
            if (filters.accreditation) {
                where.accreditation = { contains: filters.accreditation };
            }
            if (filters.minRating || filters.maxRating) {
                where.averageRating = {};
                if (filters.minRating) where.averageRating.gte = filters.minRating;
                if (filters.maxRating) where.averageRating.lte = filters.maxRating;
            }
            if (filters.minBeds) {
                where.totalBeds = { gte: filters.minBeds };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const [hospitals, total] = await Promise.all([
                prisma.hospitals.findMany({
                    where,
                    include: {
                        city: true,
                        country: true
                    },
                    orderBy: {
                        [filters.sortBy || 'averageRating']: (filters.sortOrder ? filters.sortOrder.toLowerCase() : 'desc')
                    },
                    take: limit,
                    skip: offset
                }),
                prisma.hospitals.count({ where })
            ]);

            await this.auditLogService.logAction({
                action: 'HOSPITALS_FILTERED',
                entityType: 'Filter',
                entityId: 'FILTER-' + Date.now(),
                userId: 'ANONYMOUS',
                details: { filters: filters, resultCount: hospitals.length }
            });

            return {
                success: true,
                hospitals: hospitals,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit },
                appliedFilters: filters
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DOCTOR FILTERING
    // ═══════════════════════════════════════════════════════════════════════════════

    async filterDoctors(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.specializationId) where.specializationId = filters.specializationId;
            if (filters.hospitalId) where.hospitalId = filters.hospitalId;
            if (filters.minExperience || filters.maxExperience) {
                where.experience = {};
                if (filters.minExperience) where.experience.gte = filters.minExperience;
                if (filters.maxExperience) where.experience.lte = filters.maxExperience;
            }
            if (filters.minRating || filters.maxRating) {
                where.averageRating = {};
                if (filters.minRating) where.averageRating.gte = filters.minRating;
                if (filters.maxRating) where.averageRating.lte = filters.maxRating;
            }
            if (filters.availability === true) {
                where.isAvailable = true;
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const [doctors, total] = await Promise.all([
                prisma.doctors.findMany({
                    where,
                    include: {
                        hospital: true,
                        specialization: true
                    },
                    orderBy: [
                        {
                            [filters.sortBy || 'averageRating']: (filters.sortOrder ? filters.sortOrder.toLowerCase() : 'desc')
                        },
                        { experience: 'desc' }
                    ],
                    take: limit,
                    skip: offset
                }),
                prisma.doctors.count({ where })
            ]);

            return {
                success: true,
                doctors: doctors,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit },
                appliedFilters: filters
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TREATMENT FILTERING
    // ═══════════════════════════════════════════════════════════════════════════════

    async filterTreatments(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.category) where.category = filters.category;
            if (filters.minPrice || filters.maxPrice) {
                where.basePrice = {};
                if (filters.minPrice) where.basePrice.gte = filters.minPrice;
                if (filters.maxPrice) where.basePrice.lte = filters.maxPrice;
            }
            if (filters.minRating) {
                where.averageRating = { gte: filters.minRating };
            }
            if (filters.minDuration) {
                where.duration = { gte: filters.minDuration };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const [treatments, total] = await Promise.all([
                prisma.treatments.findMany({
                    where,
                    orderBy: {
                        [filters.sortBy || 'basePrice']: (filters.sortOrder ? filters.sortOrder.toLowerCase() : 'asc')
                    },
                    take: limit,
                    skip: offset
                }),
                prisma.treatments.count({ where })
            ]);

            return {
                success: true,
                treatments: treatments,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit },
                appliedFilters: filters
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PACKAGE FILTERING
    // ═══════════════════════════════════════════════════════════════════════════════

    async filterPackages(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.treatmentId) where.treatmentId = filters.treatmentId;
            if (filters.hospitalId) where.hospitalId = filters.hospitalId;
            if (filters.minPrice || filters.maxPrice) {
                where.finalPrice = {};
                if (filters.minPrice) where.finalPrice.gte = filters.minPrice;
                if (filters.maxPrice) where.finalPrice.lte = filters.maxPrice;
            }
            if (filters.minDiscount) {
                where.discountPercentage = { gte: filters.minDiscount };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const [packages, total] = await Promise.all([
                prisma.package.findMany({
                    where,
                    include: {
                        treatment: true,
                        hospital: true
                    },
                    orderBy: {
                        [filters.sortBy || 'finalPrice']: (filters.sortOrder ? filters.sortOrder.toLowerCase() : 'asc')
                    },
                    take: limit,
                    skip: offset
                }),
                prisma.package.count({ where })
            ]);

            return {
                success: true,
                packages: packages,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit },
                appliedFilters: filters
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MULTI-ENTITY FILTERING
    // ═══════════════════════════════════════════════════════════════════════════════

    async applyMultipleFilters(entityType, filters = {}) {
        try {
            if (!entityType) {
                return { success: false, error: 'Entity type required' };
            }

            let result;

            switch (entityType.toLowerCase()) {
                case 'hospitals':
                    result = await this.filterHospitals(filters);
                    break;
                case 'doctors':
                    result = await this.filterDoctors(filters);
                    break;
                case 'treatments':
                    result = await this.filterTreatments(filters);
                    break;
                case 'packages':
                    result = await this.filterPackages(filters);
                    break;
                default:
                    return { success: false, error: 'Invalid entity type' };
            }

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FILTER OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getFilterOptions(entityType) {
        try {
            if (!entityType) {
                return { success: false, error: 'Entity type required' };
            }

            const options = {};

            if (entityType === 'doctors') {
                const specializations = await prisma.specialization.findMany({
                    where: { isActive: true },
                    select: { specializationId: true, specializationName: true }
                });
                options.specializations = specializations;
                options.experienceRanges = [
                    { label: '0-2 years', min: 0, max: 2 },
                    { label: '2-5 years', min: 2, max: 5 },
                    { label: '5-10 years', min: 5, max: 10 },
                    { label: '10+ years', min: 10, max: 999 }
                ];
                options.ratingRanges = [1, 2, 3, 4, 4.5, 5];
            }

            if (entityType === 'treatments') {
                const categories = await prisma.treatments.findMany({
                    where: { isActive: true },
                    select: { category: true },
                    distinct: ['category']
                });
                options.categories = categories.map(c => c.category);
                options.priceRanges = [
                    { label: 'Under $5000', min: 0, max: 5000 },
                    { label: '$5000 - $10000', min: 5000, max: 10000 },
                    { label: '$10000 - $25000', min: 10000, max: 25000 },
                    { label: 'Over $25000', min: 25000, max: 999999 }
                ];
            }

            return { success: true, options: options };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new FilterService();
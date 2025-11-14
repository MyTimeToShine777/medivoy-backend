'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { CacheService } from './CacheService.js';
import { AppError } from '../utils/errors/AppError.js';

export class SearchService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
        this.cacheService = new CacheService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GLOBAL SEARCH
    // ═══════════════════════════════════════════════════════════════════════════════

    async globalSearch(query, filters = {}) {
        try {
            if (!query || query.length < 2) {
                return { success: false, error: 'Search query must be at least 2 characters' };
            }

            const limit = filters.limit || 10;

            // Check cache
            const cacheKey = 'search_' + query + '_' + JSON.stringify(filters);
            const cached = await this.cacheService.get(cacheKey);
            if (cached.value) {
                return { success: true, data: cached.value, fromCache: true };
            }

            const hospitals = await prisma.hospital.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { hospitalName: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } }
                    ]
                },
                include: {
                    city: true,
                    country: true
                },
                take: limit
            });

            const doctors = await prisma.doctor.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { firstName: { contains: query, mode: 'insensitive' } },
                        { lastName: { contains: query, mode: 'insensitive' } },
                        { specialization: { contains: query, mode: 'insensitive' } }
                    ]
                },
                include: {
                    hospital: true,
                    Specialization: true
                },
                take: limit
            });

            const treatments = await prisma.treatment.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { treatmentName: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit
            });

            const result = {
                hospitals: hospitals,
                doctors: doctors,
                treatments: treatments,
                totalResults: hospitals.length + doctors.length + treatments.length,
                searchedAt: new Date()
            };

            // Cache for 1 hour
            await this.cacheService.set(cacheKey, result, 3600);

            await this.auditLogService.logAction({
                action: 'GLOBAL_SEARCH_PERFORMED',
                entityType: 'Search',
                entityId: 'SEARCH-' + Date.now(),
                userId: 'ANONYMOUS',
                details: { query: query, resultsCount: result.totalResults }
            });

            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL SEARCH
    // ═══════════════════════════════════════════════════════════════════════════════

    async searchHospitals(query, filters = {}) {
        try {
            if (!query) {
                return { success: false, error: 'Search query required' };
            }

            const where = {
                isActive: true,
                OR: [
                    { hospitalName: { contains: query, mode: 'insensitive' } },
                    { address: { contains: query, mode: 'insensitive' } }
                ]
            };

            if (filters.cityId) where.cityId = filters.cityId;
            if (filters.countryId) where.countryId = filters.countryId;
            if (filters.minRating) where.averageRating = { gte: filters.minRating };
            if (filters.accreditation) {
                where.accreditation = { contains: filters.accreditation, mode: 'insensitive' };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const hospitals = await prisma.hospital.findMany({
                where: where,
                include: {
                    city: { select: { cityName: true } },
                    country: { select: { countryName: true } }
                },
                orderBy: { averageRating: 'desc' },
                take: limit,
                skip: offset
            });

            const total = await prisma.hospital.count({ where: where });

            return {
                success: true,
                hospitals: hospitals,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DOCTOR SEARCH
    // ═══════════════════════════════════════════════════════════════════════════════

    async searchDoctors(query, filters = {}) {
        try {
            if (!query) {
                return { success: false, error: 'Search query required' };
            }

            const where = {
                isActive: true,
                OR: [
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } },
                    { specialization: { contains: query, mode: 'insensitive' } }
                ]
            };

            if (filters.specializationId) where.specializationId = filters.specializationId;
            if (filters.hospitalId) where.hospitalId = filters.hospitalId;
            if (filters.minRating) where.averageRating = { gte: filters.minRating };
            if (filters.minExperience) where.experience = { gte: filters.minExperience };
            if (filters.availability === true) where.isAvailable = true;

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const doctors = await prisma.doctor.findMany({
                where: where,
                include: {
                    hospital: { select: { hospitalName: true } },
                    Specialization: { select: { specializationName: true } }
                },
                orderBy: [
                    { averageRating: 'desc' },
                    { experience: 'desc' }
                ],
                take: limit,
                skip: offset
            });

            const total = await prisma.doctor.count({ where: where });

            return {
                success: true,
                doctors: doctors,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TREATMENT SEARCH
    // ═══════════════════════════════════════════════════════════════════════════════

    async searchTreatments(query, filters = {}) {
        try {
            if (!query) {
                return { success: false, error: 'Search query required' };
            }

            const where = {
                isActive: true,
                OR: [
                    { treatmentName: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            };

            if (filters.category) where.category = filters.category;
            if (filters.minPrice || filters.maxPrice) {
                where.basePrice = {};
                if (filters.minPrice) where.basePrice.gte = filters.minPrice;
                if (filters.maxPrice) where.basePrice.lte = filters.maxPrice;
            }
            if (filters.minRating) where.averageRating = { gte: filters.minRating };

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const treatments = await prisma.treatment.findMany({
                where: where,
                orderBy: { basePrice: 'asc' },
                take: limit,
                skip: offset
            });

            const total = await prisma.treatment.count({ where: where });

            return {
                success: true,
                treatments: treatments,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PACKAGE SEARCH
    // ═══════════════════════════════════════════════════════════════════════════════

    async searchPackages(query, filters = {}) {
        try {
            if (!query) {
                return { success: false, error: 'Search query required' };
            }

            const where = {
                isActive: true,
                OR: [
                    { packageName: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            };

            if (filters.treatmentId) where.treatmentId = filters.treatmentId;
            if (filters.hospitalId) where.hospitalId = filters.hospitalId;
            if (filters.minPrice || filters.maxPrice) {
                where.finalPrice = {};
                if (filters.minPrice) where.finalPrice.gte = filters.minPrice;
                if (filters.maxPrice) where.finalPrice.lte = filters.maxPrice;
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const packages = await prisma.package.findMany({
                where: where,
                include: {
                    treatment: true,
                    hospital: true
                },
                orderBy: { finalPrice: 'asc' },
                take: limit,
                skip: offset
            });

            const total = await prisma.package.count({ where: where });

            return {
                success: true,
                packages: packages,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ADVANCED SEARCH
    // ═══════════════════════════════════════════════════════════════════════════════

    async advancedSearch(searchCriteria = {}) {
        try {
            if (!searchCriteria || Object.keys(searchCriteria).length === 0) {
                return { success: false, error: 'Search criteria required' };
            }

            const results = {};

            if (searchCriteria.hospital && searchCriteria.hospital.query) {
                results.hospitals = await this.searchHospitals(searchCriteria.hospital.query, searchCriteria.hospital.filters);
            }

            if (searchCriteria.doctor && searchCriteria.doctor.query) {
                results.doctors = await this.searchDoctors(searchCriteria.doctor.query, searchCriteria.doctor.filters);
            }

            if (searchCriteria.treatment && searchCriteria.treatment.query) {
                results.treatments = await this.searchTreatments(searchCriteria.treatment.query, searchCriteria.treatment.filters);
            }

            if (searchCriteria.package && searchCriteria.package.query) {
                results.packages = await this.searchPackages(searchCriteria.package.query, searchCriteria.package.filters);
            }

            return { success: true, data: results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // AUTOCOMPLETE
    // ═══════════════════════════════════════════════════════════════════════════════

    async getAutocompleteSuggestions(query, entityType = 'all') {
        try {
            if (!query || query.length < 1) {
                return { success: false, error: 'Query required' };
            }

            const suggestions = {};

            if (entityType === 'all' || entityType === 'hospitals') {
                const hospitals = await prisma.hospital.findMany({
                    where: {
                        isActive: true,
                        hospitalName: { contains: query, mode: 'insensitive' }
                    },
                    select: { hospitalId: true, hospitalName: true },
                    take: 5
                });
                suggestions.hospitals = hospitals.map(h => ({ id: h.hospitalId, name: h.hospitalName }));
            }

            if (entityType === 'all' || entityType === 'doctors') {
                const doctors = await prisma.doctor.findMany({
                    where: {
                        isActive: true,
                        OR: [
                            { firstName: { contains: query, mode: 'insensitive' } },
                            { lastName: { contains: query, mode: 'insensitive' } }
                        ]
                    },
                    select: { doctorId: true, firstName: true, lastName: true },
                    take: 5
                });
                suggestions.doctors = doctors.map(d => ({ id: d.doctorId, name: d.firstName + ' ' + d.lastName }));
            }

            if (entityType === 'all' || entityType === 'treatments') {
                const treatments = await prisma.treatment.findMany({
                    where: {
                        isActive: true,
                        treatmentName: { contains: query, mode: 'insensitive' }
                    },
                    select: { treatmentId: true, treatmentName: true },
                    take: 5
                });
                suggestions.treatments = treatments.map(t => ({ id: t.treatmentId, name: t.treatmentName }));
            }

            return { success: true, suggestions: suggestions };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new SearchService();
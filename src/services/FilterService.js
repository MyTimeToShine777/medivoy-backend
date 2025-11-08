'use strict';

import { Op, sequelize } from 'sequelize';
import { Hospital, Doctor, Treatment, Package, Specialization, AuditLog } from '../models/index.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class FilterService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
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
                where.accreditation = {
                    [Op.like]: '%' + filters.accreditation + '%' };
            }
            if (filters.minRating) {
                where.averageRating = {
                    [Op.gte]: filters.minRating };
            }
            if (filters.maxRating) {
                if (!where.averageRating) where.averageRating = {};
                where.averageRating[Op.lte] = filters.maxRating;
            }
            if (filters.minBeds) {
                where.totalBeds = {
                    [Op.gte]: filters.minBeds };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const hospitals = await Hospital.findAll({
                where: where,
                include: [
                    { model: City },
                    { model: Country }
                ],
                order: [
                    [filters.sortBy || 'averageRating', filters.sortOrder || 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Hospital.count({ where: where });

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
            if (filters.minExperience) {
                where.experience = {
                    [Op.gte]: filters.minExperience };
            }
            if (filters.maxExperience) {
                if (!where.experience) where.experience = {};
                where.experience[Op.lte] = filters.maxExperience;
            }
            if (filters.minRating) {
                where.averageRating = {
                    [Op.gte]: filters.minRating };
            }
            if (filters.maxRating) {
                if (!where.averageRating) where.averageRating = {};
                where.averageRating[Op.lte] = filters.maxRating;
            }
            if (filters.availability === true) {
                where.isAvailable = true;
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const doctors = await Doctor.findAll({
                where: where,
                include: [
                    { model: Hospital },
                    { model: Specialization }
                ],
                order: [
                    [filters.sortBy || 'averageRating', filters.sortOrder || 'DESC'],
                    ['experience', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Doctor.count({ where: where });

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
                if (filters.minPrice) where.basePrice[Op.gte] = filters.minPrice;
                if (filters.maxPrice) where.basePrice[Op.lte] = filters.maxPrice;
            }
            if (filters.minRating) {
                where.averageRating = {
                    [Op.gte]: filters.minRating };
            }
            if (filters.minDuration) {
                where.duration = {
                    [Op.gte]: filters.minDuration };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const treatments = await Treatment.findAll({
                where: where,
                order: [
                    [filters.sortBy || 'basePrice', filters.sortOrder || 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Treatment.count({ where: where });

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
                if (filters.minPrice) where.finalPrice[Op.gte] = filters.minPrice;
                if (filters.maxPrice) where.finalPrice[Op.lte] = filters.maxPrice;
            }
            if (filters.minDiscount) {
                where.discountPercentage = {
                    [Op.gte]: filters.minDiscount };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const packages = await Package.findAll({
                where: where,
                include: [
                    { model: Treatment },
                    { model: Hospital }
                ],
                order: [
                    [filters.sortBy || 'finalPrice', filters.sortOrder || 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Package.count({ where: where });

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
                const specializations = await Specialization.findAll({
                    where: { isActive: true },
                    attributes: ['specializationId', 'specializationName']
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
                const categories = await Treatment.findAll({
                    attributes: ['category'],
                    where: { isActive: true },
                    group: ['category'],
                    raw: true
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
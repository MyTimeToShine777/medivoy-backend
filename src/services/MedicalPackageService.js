'use strict';

import { Op, sequelize } from 'sequelize';
import { Package, Treatment, Hospital, PackageAddOn, FeatureAddOn, AuditLog } from '../models/index.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class MedicalPackageService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PACKAGE CREATION & MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════════

    async createPackage(packageData) {
        const transaction = await sequelize.transaction();
        try {
            if (!packageData || !packageData.packageName) {
                throw new AppError('Package name required', 400);
            }

            if (!packageData.basePrice || !packageData.finalPrice) {
                throw new AppError('Base and final prices required', 400);
            }

            const package_record = await Package.create({
                packageId: this._generatePackageId(),
                packageName: packageData.packageName,
                description: packageData.description || null,
                basePrice: packageData.basePrice,
                discountPercentage: packageData.discountPercentage || 0,
                finalPrice: packageData.finalPrice,
                duration: packageData.duration,
                includedServices: packageData.includedServices || [],
                treatmentId: packageData.treatmentId,
                hospitalId: packageData.hospitalId,
                isActive: true,
                isFeatured: packageData.isFeatured || false,
                createdAt: new Date()
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'PACKAGE_CREATED',
                entityType: 'Package',
                entityId: package_record.packageId,
                userId: 'ADMIN',
                details: { packageName: packageData.packageName, price: packageData.finalPrice }
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Package created successfully',
                package: package_record
            };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    async getPackageById(packageId) {
        try {
            if (!packageId) {
                return { success: false, error: 'Package ID required' };
            }

            const package_record = await Package.findByPk(packageId, {
                include: [
                    { model: Treatment, attributes: ['treatmentName', 'category', 'description'] },
                    { model: Hospital, attributes: ['hospitalName', 'location', 'address'] },
                    {
                        model: PackageAddOn,
                        include: [{ model: FeatureAddOn }]
                    }
                ]
            });

            if (!package_record) {
                return { success: false, error: 'Package not found' };
            }

            return { success: true, package: package_record };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async listPackages(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.treatmentId) where.treatmentId = filters.treatmentId;
            if (filters.hospitalId) where.hospitalId = filters.hospitalId;
            if (filters.featured === true) where.isFeatured = true;
            if (filters.minPrice || filters.maxPrice) {
                where.finalPrice = {};
                if (filters.minPrice) where.finalPrice[Op.gte] = filters.minPrice;
                if (filters.maxPrice) where.finalPrice[Op.lte] = filters.maxPrice;
            }
            if (filters.search) {
                where[Op.or] = [
                    { packageName: {
                            [Op.like]: '%' + filters.search + '%' } },
                    { description: {
                            [Op.like]: '%' + filters.search + '%' } }
                ];
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
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updatePackage(packageId, updateData) {
        const transaction = await sequelize.transaction();
        try {
            if (!packageId || !updateData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const package_record = await Package.findByPk(packageId, { transaction: transaction });
            if (!package_record) {
                await transaction.rollback();
                return { success: false, error: 'Package not found' };
            }

            const allowedFields = ['description', 'basePrice', 'discountPercentage', 'finalPrice', 'duration', 'includedServices', 'isFeatured'];
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    package_record[field] = updateData[field];
                }
            }

            await package_record.save({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'PACKAGE_UPDATED',
                entityType: 'Package',
                entityId: packageId,
                userId: 'ADMIN',
                details: {}
            }, transaction);

            await transaction.commit();

            return {
                success: true,
                message: 'Package updated successfully',
                package: package_record
            };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PACKAGE ADD-ONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async addPackageAddOn(packageId, addOnData) {
        const transaction = await sequelize.transaction();
        try {
            if (!packageId || !addOnData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const package_record = await Package.findByPk(packageId, { transaction: transaction });
            if (!package_record) {
                await transaction.rollback();
                return { success: false, error: 'Package not found' };
            }

            const addOn = await PackageAddOn.create({
                addOnId: this._generateAddOnId(),
                packageId: packageId,
                featureAddOnId: addOnData.featureAddOnId,
                price: addOnData.price
            }, { transaction: transaction });

            await this.auditLogService.logAction({
                action: 'PACKAGE_ADDON_ADDED',
                entityType: 'PackageAddOn',
                entityId: addOn.addOnId,
                userId: 'ADMIN',
                details: { packageId: packageId }
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Add-on added', addOn: addOn };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    async getPackageAddOns(packageId) {
        try {
            if (!packageId) {
                return { success: false, error: 'Package ID required' };
            }

            const addOns = await PackageAddOn.findAll({
                where: { packageId: packageId },
                include: [{ model: FeatureAddOn }]
            });

            return { success: true, addOns: addOns, total: addOns.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async removePackageAddOn(addOnId) {
        const transaction = await sequelize.transaction();
        try {
            if (!addOnId) {
                return { success: false, error: 'Add-on ID required' };
            }

            const addOn = await PackageAddOn.findByPk(addOnId, { transaction: transaction });
            if (!addOn) {
                await transaction.rollback();
                return { success: false, error: 'Add-on not found' };
            }

            await addOn.destroy({ transaction: transaction });

            await this.auditLogService.logAction({
                action: 'PACKAGE_ADDON_REMOVED',
                entityType: 'PackageAddOn',
                entityId: addOnId,
                userId: 'ADMIN',
                details: {}
            }, transaction);

            await transaction.commit();

            return { success: true, message: 'Add-on removed' };
        } catch (error) {
            await transaction.rollback();
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PACKAGE STATISTICS & ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getPackageStats(packageId) {
        try {
            if (!packageId) {
                return { success: false, error: 'Package ID required' };
            }

            const package_record = await Package.findByPk(packageId);
            if (!package_record) {
                return { success: false, error: 'Package not found' };
            }

            return {
                success: true,
                stats: {
                    packageName: package_record.packageName,
                    basePrice: package_record.basePrice,
                    finalPrice: package_record.finalPrice,
                    discountPercentage: package_record.discountPercentage,
                    duration: package_record.duration,
                    isFeatured: package_record.isFeatured
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getFeaturedPackages(limit = 10) {
        try {
            const packages = await Package.findAll({
                where: { isFeatured: true, isActive: true },
                include: [
                    { model: Treatment },
                    { model: Hospital }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit
            });

            return { success: true, packages: packages };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getPackagesByTreatment(treatmentId, filters = {}) {
        try {
            if (!treatmentId) {
                return { success: false, error: 'Treatment ID required' };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const packages = await Package.findAll({
                where: { treatmentId: treatmentId, isActive: true },
                include: [{ model: Hospital }],
                order: [
                    ['finalPrice', 'ASC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Package.count({ where: { treatmentId: treatmentId, isActive: true } });

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
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    _generatePackageId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 10000).toString(36).toUpperCase();
        return 'PKG-' + ts + rnd;
    }

    _generateAddOnId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'ADDON-' + ts + rnd;
    }
}

export default new MedicalPackageService();
'use strict';

import prisma from '../config/prisma.js';
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
        // Using Prisma transaction
        try {
            if (!packageData || !packageData.packageName) {
                throw new AppError('Package name required', 400);
            }

            if (!packageData.basePrice || !packageData.finalPrice) {
                throw new AppError('Base and final prices required', 400);
            }

            const package_record = await prisma.package.create({ data: {
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
            });

            await this.auditLogService.logAction({
                action: 'PACKAGE_CREATED',
                entityType: 'Package',
                entityId: package_record.packageId,
                userId: 'ADMIN',
                details: { packageName: packageData.packageName, price: packageData.finalPrice }
            }, transaction);

            

            return {
                success: true,
                message: 'Package created successfully',
                package: package_record
            };
        } catch (error) {
            
            return { success: false, error: error.message };
        }
    }

    async getPackageById(packageId) {
        try {
            if (!packageId) {
                return { success: false, error: 'Package ID required' };
            }

            const package_record = await prisma.package.findUnique({ where: { id: packageId, {
                include: {
                    treatment: {
                        select: { treatmentName: true, category: true, description: true }
                    },
                    hospital: {
                        select: { hospitalName: true, location: true, address: true }
                    },
                    packageAddOn: true
                }
                    }
                ]
            } } });

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
                if (filters.minPrice) where.finalPrice = { gte: filters.minPrice };
                if (filters.maxPrice) where.finalPrice = { lte: filters.maxPrice };
            }
            if (filters.search) {
                where.OR = [
                    { packageName: {
                            { contains: '%' + filters.search + '%' } },
                    { description: {
                            { contains: '%' + filters.search + '%' } }
                ];
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const packages = await prisma.package.findMany({
                where: where,
                include: {
                    treatment: true,
                    hospital: true
                },
                orderBy: {
                    [filters.sortBy || 'finalPrice']: (filters.sortOrder || 'ASC').toLowerCase()
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.package.count({ where: where });

            return {
                success: true,
                packages: packages,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updatePackage(packageId, updateData) {
        // Using Prisma transaction
        try {
            if (!packageId || !updateData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const package_record = await prisma.package.findUnique({ where: { id: packageId } });
            if (!package_record) {
                
                return { success: false, error: 'Package not found' };
            }

            const allowedFields = ['description', 'basePrice', 'discountPercentage', 'finalPrice', 'duration', 'includedServices', 'isFeatured'];
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    package_record[field] = updateData[field];
                }
            }

            /* TODO: Convert to prisma update */ await package_record.save();

            await this.auditLogService.logAction({
                action: 'PACKAGE_UPDATED',
                entityType: 'Package',
                entityId: packageId,
                userId: 'ADMIN',
                details: {}
            }, transaction);

            

            return {
                success: true,
                message: 'Package updated successfully',
                package: package_record
            };
        } catch (error) {
            
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PACKAGE ADD-ONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async addPackageAddOn(packageId, addOnData) {
        // Using Prisma transaction
        try {
            if (!packageId || !addOnData) {
                return { success: false, error: 'Required parameters missing' };
            }

            const package_record = await prisma.package.findUnique({ where: { id: packageId } });
            if (!package_record) {
                
                return { success: false, error: 'Package not found' };
            }

            const addOn = await prisma.packageAddOn.create({ data: {
                addOnId: this._generateAddOnId(),
                packageId: packageId,
                featureAddOnId: addOnData.featureAddOnId,
                price: addOnData.price
            });

            await this.auditLogService.logAction({
                action: 'PACKAGE_ADDON_ADDED',
                entityType: 'PackageAddOn',
                entityId: addOn.addOnId,
                userId: 'ADMIN',
                details: { packageId: packageId }
            }, transaction);

            

            return { success: true, message: 'Add-on added', addOn: addOn };
        } catch (error) {
            
            return { success: false, error: error.message };
        }
    }

    async getPackageAddOns(packageId) {
        try {
            if (!packageId) {
                return { success: false, error: 'Package ID required' };
            }

            const addOns = await prisma.packageAddOn.findMany({
                where: { packageId: packageId },
                include: {
                    featureAddOn: true
                }
            });

            return { success: true, addOns: addOns, total: addOns.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async removePackageAddOn(addOnId) {
        // Using Prisma transaction
        try {
            if (!addOnId) {
                return { success: false, error: 'Add-on ID required' };
            }

            const addOn = await prisma.packageAddOn.findUnique({ where: { id: addOnId } });
            if (!addOn) {
                
                return { success: false, error: 'Add-on not found' };
            }

            await prisma.addOn.delete();

            await this.auditLogService.logAction({
                action: 'PACKAGE_ADDON_REMOVED',
                entityType: 'PackageAddOn',
                entityId: addOnId,
                userId: 'ADMIN',
                details: {}
            }, transaction);

            

            return { success: true, message: 'Add-on removed' };
        } catch (error) {
            
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

            const package_record = await prisma.package.findUnique({ where: { id: packageId } });
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
            const packages = await prisma.package.findMany({
                where: { isFeatured: true, isActive: true },
                include: {
                    treatment: true,
                    hospital: true
                },
                orderBy: { createdAt: 'desc' },
                take: limit
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

            const packages = await prisma.package.findMany({
                where: { treatmentId: treatmentId, isActive: true },
                include: {
                    hospital: true
                },
                orderBy: { finalPrice: 'asc' },
                take: limit,
                skip: offset
            });

            const total = await prisma.package.count({ where: { treatmentId: treatmentId, isActive: true } });

            return {
                success: true,
                packages: packages,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, take: limit }
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
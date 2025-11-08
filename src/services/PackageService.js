// Package Service - Treatment packages management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { Package, Treatment, Hospital, FeatureAddOn, Booking } from '../models/index.js';

class PackageService {
    // ========== CREATE PACKAGE ==========
    async createPackage(packageData) {
        try {
            const pkg = await Package.create({
                packageNumber: await this.generatePackageNumber(),
                ...packageData,
            });

            return {
                success: true,
                data: pkg,
                message: 'Package created successfully',
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET PACKAGE ==========
    async getPackageById(packageId) {
        try {
            const pkg = await Package.findByPk(packageId, {
                include: [
                    { model: Treatment, as: 'treatments' },
                    { model: Hospital, as: 'hospital' },
                    { model: FeatureAddOn, as: 'addOns' },
                ],
            });

            if (!pkg) return { success: false, error: 'Package not found' };
            return { success: true, data: pkg };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEARCH PACKAGES ==========
    async searchPackages(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.hospitalId) where.hospitalId = filters.hospitalId;
            if (filters.minPrice && filters.maxPrice) {
                where.price = {
                    [Op.between]: [filters.minPrice, filters.maxPrice]
                };
            }
            if (filters.search) {
                where[Op.or] = [{
                        name: {
                            [Op.iLike]: `%${filters.search}%`
                        }
                    },
                    {
                        description: {
                            [Op.iLike]: `%${filters.search}%`
                        }
                    },
                ];
            }

            const packages = await Package.findAll({
                where,
                include: [{ model: Treatment, as: 'treatments' }],
                order: [
                    ['rating', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            const total = await Package.count({ where });
            return { success: true, data: packages, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ADD TREATMENT TO PACKAGE ==========
    async addTreatmentToPackage(packageId, treatmentId) {
        try {
            const pkg = await Package.findByPk(packageId);
            if (!pkg) return { success: false, error: 'Package not found' };

            if (!pkg.treatmentIds) pkg.treatmentIds = [];
            if (!pkg.treatmentIds.includes(treatmentId)) {
                pkg.treatmentIds.push(treatmentId);
            }
            await pkg.save();

            return { success: true, data: pkg };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CALCULATE PACKAGE COST ==========
    async calculatePackageCost(packageId) {
        try {
            const pkg = await Package.findByPk(packageId, {
                include: [{ model: FeatureAddOn, as: 'addOns' }],
            });

            if (!pkg) return { success: false, error: 'Package not found' };

            let totalCost = pkg.price;
            let breakdown = { basePrice: pkg.price, addOns: {} };

            if (pkg.addOns) {
                pkg.addOns.forEach(addOn => {
                    breakdown.addOns[addOn.name] = addOn.cost;
                    totalCost += addOn.cost;
                });
            }

            return {
                success: true,
                data: { totalCost, breakdown, currency: 'USD' },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== PACKAGE STATISTICS ==========
    async getPackageStats(packageId) {
        try {
            const pkg = await Package.findByPk(packageId);
            if (!pkg) return { success: false, error: 'Package not found' };

            const bookings = await Booking.count({ where: { packageId } });

            return {
                success: true,
                data: {
                    packageName: pkg.name,
                    totalBookings: bookings,
                    price: pkg.price,
                    rating: pkg.rating,
                    durationDays: pkg.durationDays,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generatePackageNumber() {
        return `PKG-${Date.now()}-${Math.random() * 10000 | 0}`;
    }
}

export default new PackageService();
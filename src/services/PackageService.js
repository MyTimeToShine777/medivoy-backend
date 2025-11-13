// Package Service - Treatment packages management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class PackageService {
    // ========== CREATE PACKAGE ==========
    async createPackage(packageData) {
        try {
            const pkg = await prisma.package.create({
                data: {
                    packageNumber: await this.generatePackageNumber(),
                    ...packageData,
                }
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
            const pkg = await prisma.package.findUnique({
                where: { packageId },
                include: {
                    treatments: true,
                    hospital: true,
                    addOns: true
                }
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
                    gte: filters.minPrice,
                    lte: filters.maxPrice
                };
            }
            if (filters.search) {
                where.OR = [
                    {
                        name: {
                            contains: filters.search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: filters.search,
                            mode: 'insensitive'
                        }
                    }
                ];
            }

            const packages = await prisma.package.findMany({
                where,
                include: { treatments: true },
                orderBy: {
                    rating: 'desc'
                },
                take: filters.limit || 20,
                skip: filters.offset || 0,
            });

            const total = await prisma.package.count({ where });
            return { success: true, data: packages, total };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== ADD TREATMENT TO PACKAGE ==========
    async addTreatmentToPackage(packageId, treatmentId) {
        try {
            const pkg = await prisma.package.findUnique({
                where: { packageId }
            });
            if (!pkg) return { success: false, error: 'Package not found' };

            const treatmentIds = pkg.treatmentIds || [];
            if (!treatmentIds.includes(treatmentId)) {
                treatmentIds.push(treatmentId);
            }
            const updated = await prisma.package.update({
                where: { packageId },
                data: { treatmentIds }
            });

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
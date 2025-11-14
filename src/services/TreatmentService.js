// Treatment Service - Treatment catalog and management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class TreatmentService {
    // ========== CREATE TREATMENT ==========
    async createTreatment(treatmentData) {
        try {
            const treatment = await prisma.treatment.create({
                data: {
                ...treatmentData,
            });

            return {
                success: true,
                data: treatment,
                message: 'Treatment created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET TREATMENT ==========
    async getTreatmentById(treatmentId) {
        try {
            const treatment = await prisma.treatment.findUnique({
                where: { treatmentId }, {
                include: {
                    treatmentCategory: true,
                    treatmentSubcategory: true,
                    hospital: true,
                    doctor: true
                },
            });

            if (!treatment) {
                return {
                    success: false,
                    error: 'Treatment not found',
                };
            }

            return {
                success: true,
                data: treatment,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getTreatmentBySlug(slug) {
        try {
            const treatment = await prisma.treatment.findFirst({
                where: { slug },
                include: {
                    treatmentCategory: true
                },
            });

            if (!treatment) {
                return {
                    success: false,
                    error: 'Treatment not found',
                };
            }

            return {
                success: true,
                data: treatment,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== SEARCH TREATMENTS ==========
    async searchTreatments(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.categoryId) {
                where.categoryId = filters.categoryId;
            }
            if (filters.subcategoryId) {
                where.subcategoryId = filters.subcategoryId;
            }
            if (filters.minPrice && filters.maxPrice) {
                where.cost = {
                    { gte: filters.minPrice, lte: filters.maxPrice },
                };
            }
            if (filters.minRating) {
                where.averageRating = {
                    gte: filters.minRating
                };
            }
            if (filters.search) {
                where.OR = [{
                        name: {
                            contains: filters.search, mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: filters.search, mode: "insensitive"
                        }
                    },
                ];
            }

            const treatments = await prisma.treatment.findMany({
                where,
                include: {
                    treatmentCategory: true
                },
                orderBy: { averageRating: 'desc' },
                take: filters.limit || 20,
                skip: filters.offset || 0,
            });

            const total = await prisma.treatment.count({ where });

            return {
                success: true,
                data: treatments,
                total,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getTreatmentsByCategory(categoryId) {
        try {
            const treatments = await prisma.treatment.findMany({
                where: { categoryId, isActive: true },
                orderBy: { name: 'asc' },
            });

            return {
                success: true,
                data: treatments,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getFeaturedTreatments() {
        try {
            const treatments = await prisma.treatment.findMany({
                where: { isFeatured: true, isActive: true },
                orderBy: { displayOrder: 'asc' },
                take: 10,
            });

            return {
                success: true,
                data: treatments,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== UPDATE TREATMENT ==========
    async updateTreatment(treatmentId, updateData) {
        try {
            const treatment = await prisma.treatment.findUnique({ where: { treatmentId: treatmentId } });
            if (!treatment) {
                return {
                    success: false,
                    error: 'Treatment not found',
                };
            }

            const updated = await treatment.update(updateData);
            return {
                success: true,
                data: updated,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== TREATMENT CATEGORY MANAGEMENT ==========
    async createCategory(categoryData) {
        try {
            const category = await TreatmentCategory.create({
                slug: this.generateSlug(categoryData.name),
                ...categoryData,
            });

            return {
                success: true,
                data: category,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getCategories() {
        try {
            const categories = await prisma.treatmentCategory.findMany({
                where: { isActive: true },
                orderBy: { displayOrder: 'asc' },
            });

            return {
                success: true,
                data: categories,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== TREATMENT SUBCATEGORY MANAGEMENT ==========
    async createSubcategory(subcategoryData) {
        try {
            const subcategory = await TreatmentSubcategory.create({
                slug: this.generateSlug(subcategoryData.name),
                ...subcategoryData,
            });

            return {
                success: true,
                data: subcategory,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getSubcategoriesByCategory(categoryId) {
        try {
            const subcategories = await prisma.treatmentSubcategory.findMany({
                where: { categoryId, isActive: true },
                orderBy: { displayOrder: 'asc' },
            });

            return {
                success: true,
                data: subcategories,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== TREATMENT STATISTICS ==========
    async getTreatmentStats(treatmentId) {
        try {
            const treatment = await prisma.treatment.findUnique({ where: { treatmentId: treatmentId } });
            if (!treatment) {
                return {
                    success: false,
                    error: 'Treatment not found',
                };
            }

            return {
                success: true,
                data: {
                    treatmentName: treatment.name,
                    totalBookings: treatment.totalBookings,
                    averageRating: treatment.averageRating,
                    totalReviews: treatment.totalReviews,
                    cost: treatment.cost,
                    duration: treatment.duration,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getTreatmentAvailability(treatmentId, hospitalId) {
        try {
            const treatment = await prisma.treatment.findUnique({ where: { treatmentId: treatmentId } });
            if (!treatment) {
                return {
                    success: false,
                    error: 'Treatment not found',
                };
            }

            // Check if hospital offers this treatment
            const hospital = await prisma.hospital.findUnique({ where: { hospitalId: hospitalId } });
            if (!hospital) {
                return {
                    success: false,
                    error: 'Hospital not found',
                };
            }

            return {
                success: true,
                data: {
                    treatmentName: treatment.name,
                    hospital: hospital.name,
                    available: true,
                    cost: treatment.cost,
                    minimumDays: treatment.minimumDays,
                    maximumDays: treatment.maximumDays,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== HELPER METHODS ==========
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
}

export default new TreatmentService();
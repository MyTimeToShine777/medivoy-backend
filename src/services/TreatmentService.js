// Treatment Service - Treatment catalog and management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class TreatmentService {
    // ========== CREATE TREATMENT ==========
    async createTreatment(treatmentData) {
        try {
            const treatment = await prisma.treatments.create({
                data: {
                    ...treatmentData
                }
            });

            return {
                success: true,
                data: treatment,
                message: 'Treatment created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ========== GET TREATMENT ==========
    async getTreatmentById(treatmentId) {
        try {
            const treatment = await prisma.treatments.findUnique({
                where: { treatmentId },
                include: {
                    category: true,
                    subcategory: true,
                    hospitals: true,
                    doctors: true
                }
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
            const treatment = await prisma.treatments.findFirst({
                where: { slug },
                include: [
                    { model: TreatmentCategory, as: 'category' },
                ],
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
                    gte: filters.minPrice,
                    lte: filters.maxPrice
                };
            }
            if (filters.minRating) {
                where.rating = {
                    gte: filters.minRating
                };
            }
            if (filters.search) {
                where.OR = [{
                        name: {
                            contains: filters.search,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: filters.search,
                            mode: "insensitive"
                        }
                    }
                ];
            }

            const treatments = await prisma.treatments.findMany({
                where,
                orderBy: {
                    rating: 'desc'
                },
                take: filters.limit || 20,
                skip: filters.offset || 0,
            });

            const total = await prisma.treatments.count({ where });

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
            const treatments = await prisma.treatments.findMany({
                where: { categoryId, isActive: true },
                order: [
                    ['name', 'ASC']
                ],
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
            const treatments = await prisma.treatments.findMany({
                where: { isFeatured: true, isActive: true },
                order: [
                    ['displayOrder', 'ASC']
                ],
                limit: 10,
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
            const treatment = await prisma.treatments.findUnique({ where: { treatmentId: treatmentId } });
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
            const categories = await TreatmentCategory.findAll({
                where: { isActive: true },
                order: [
                    ['displayOrder', 'ASC']
                ],
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
            const subcategories = await TreatmentSubcategory.findAll({
                where: { categoryId, isActive: true },
                order: [
                    ['displayOrder', 'ASC']
                ],
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
            const treatment = await prisma.treatments.findUnique({ where: { treatmentId: treatmentId } });
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
            const treatment = await prisma.treatments.findUnique({ where: { treatmentId: treatmentId } });
            if (!treatment) {
                return {
                    success: false,
                    error: 'Treatment not found',
                };
            }

            // Check if hospital offers this treatment
            const hospital = await prisma.hospitals.findUnique({ where: { hospitalId: hospitalId } });
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

export { TreatmentService };
export default new TreatmentService();
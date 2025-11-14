'use strict';

import prisma from '../config/prisma.js';

export class RatingService {
    /**
     * CREATE RATING
     */
    async createRating(patientId, ratingData) {
        try {
            if (!patientId) {
                return { success: false, error: 'Patient ID is required' };
            }

            if (!ratingData.rating || ratingData.rating < 1 || ratingData.rating > 5) {
                return { success: false, error: 'Rating must be between 1 and 5' };
            }

            if (!ratingData.category) {
                return { success: false, error: 'Rating category is required' };
            }

            // Validate patient exists
            const patient = await prisma.patients.findUnique({
                where: { patientId }
            });
            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            // Validate doctor if provided
            if (ratingData.doctorId) {
                const doctor = await prisma.doctors.findUnique({
                    where: { doctorId: ratingData.doctorId }
                });
                if (!doctor) {
                    return { success: false, error: 'Doctor not found' };
                }
            }

            // Validate hospital if provided
            if (ratingData.hospitalId) {
                const hospital = await prisma.hospitals.findUnique({
                    where: { hospitalId: ratingData.hospitalId }
                });
                if (!hospital) {
                    return { success: false, error: 'Hospital not found' };
                }
            }

            // Create rating
            const rating = await prisma.rating.create({
                data: {
                    patientId,
                    ...ratingData
                }
            });

            return {
                success: true,
                data: rating,
                message: 'Rating submitted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET RATINGS BY DOCTOR
     */
    async getRatingsByDoctor(doctorId, options = {}) {
        try {
            if (!doctorId) {
                return { success: false, error: 'Doctor ID is required' };
            }

            const { page = 1, limit = 10 } = options;
            const skip = (page - 1) * limit;

            const [ratings, total] = await Promise.all([
                prisma.rating.findMany({
                    where: { doctorId },
                    include: {
                        patient: {
                            select: { patientId: true, firstName: true, lastName: true }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: parseInt(limit),
                    skip: parseInt(skip)
                }),
                prisma.rating.count({ where: { doctorId } })
            ]);

            return {
                success: true,
                data: ratings,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET RATINGS BY HOSPITAL
     */
    async getRatingsByHospital(hospitalId, options = {}) {
        try {
            if (!hospitalId) {
                return { success: false, error: 'Hospital ID is required' };
            }

            const { page = 1, limit = 10 } = options;
            const skip = (page - 1) * limit;

            const [ratings, total] = await Promise.all([
                prisma.rating.findMany({
                    where: { hospitalId },
                    include: {
                        patient: {
                            select: { patientId: true, firstName: true, lastName: true }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: parseInt(limit),
                    skip: parseInt(skip)
                }),
                prisma.rating.count({ where: { hospitalId } })
            ]);

            return {
                success: true,
                data: ratings,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET AVERAGE RATING
     */
    async getAverageRating(doctorId, hospitalId) {
        try {
            const where = {};
            if (doctorId) where.doctorId = doctorId;
            if (hospitalId) where.hospitalId = hospitalId;

            if (Object.keys(where).length === 0) {
                return { success: false, error: 'Doctor ID or Hospital ID is required' };
            }

            const ratings = await prisma.rating.findMany({ where });

            if (ratings.length === 0) {
                return {
                    success: true,
                    data: {
                        average: 0,
                        total: 0,
                        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                    }
                };
            }

            const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
            const average = (sum / ratings.length).toFixed(2);

            // Rating breakdown
            const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            ratings.forEach(r => {
                breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
            });

            return {
                success: true,
                data: {
                    average: parseFloat(average),
                    total: ratings.length,
                    breakdown
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET RATING BY ID
     */
    async getRatingById(ratingId) {
        try {
            if (!ratingId) {
                return { success: false, error: 'Rating ID is required' };
            }

            const rating = await prisma.rating.findUnique({
                where: { ratingId },
                include: {
                    patient: {
                        select: { patientId: true, firstName: true, lastName: true }
                    },
                    doctor: {
                        select: { doctorId: true, firstName: true, lastName: true }
                    },
                    hospital: {
                        select: { hospitalId: true, name: true }
                    }
                }
            });

            if (!rating) {
                return { success: false, error: 'Rating not found' };
            }

            return {
                success: true,
                data: rating
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * UPDATE RATING
     */
    async updateRating(ratingId, patientId, updateData) {
        try {
            if (!ratingId) {
                return { success: false, error: 'Rating ID is required' };
            }

            const rating = await prisma.rating.findUnique({
                where: { ratingId }
            });

            if (!rating) {
                return { success: false, error: 'Rating not found' };
            }

            // Check if patient owns this rating
            if (rating.patientId !== patientId) {
                return { success: false, error: 'Unauthorized to update this rating' };
            }

            const updated = await prisma.rating.update({
                where: { ratingId },
                data: updateData
            });

            return {
                success: true,
                data: updated,
                message: 'Rating updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * DELETE RATING
     */
    async deleteRating(ratingId, patientId) {
        try {
            if (!ratingId) {
                return { success: false, error: 'Rating ID is required' };
            }

            const rating = await prisma.rating.findUnique({
                where: { ratingId }
            });

            if (!rating) {
                return { success: false, error: 'Rating not found' };
            }

            // Check if patient owns this rating
            if (rating.patientId !== patientId) {
                return { success: false, error: 'Unauthorized to delete this rating' };
            }

            await prisma.rating.delete({
                where: { ratingId }
            });

            return {
                success: true,
                message: 'Rating deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new RatingService();
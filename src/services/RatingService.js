'use strict';

import { getModels } from '../models/index.js';
import { Op } from 'sequelize';

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

            const { Rating, Patient, Doctor, Hospital } = getModels();

            // Validate patient exists
            const patient = await Patient.findByPk(patientId);
            if (!patient) {
                return { success: false, error: 'Patient not found' };
            }

            // Validate doctor if provided
            if (ratingData.doctorId) {
                const doctor = await Doctor.findByPk(ratingData.doctorId);
                if (!doctor) {
                    return { success: false, error: 'Doctor not found' };
                }
            }

            // Validate hospital if provided
            if (ratingData.hospitalId) {
                const hospital = await Hospital.findByPk(ratingData.hospitalId);
                if (!hospital) {
                    return { success: false, error: 'Hospital not found' };
                }
            }

            // Create rating
            const rating = await Rating.create({
                patientId,
                ...ratingData
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

            const { Rating, Patient } = getModels();

            const { page = 1, limit = 10 } = options;
            const offset = (page - 1) * limit;

            const { rows: ratings, count: total } = await Rating.findAndCountAll({
                where: { doctorId },
                include: [{
                    model: Patient,
                    as: 'patient',
                    attributes: ['patientId', 'firstName', 'lastName']
                }],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

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

            const { Rating, Patient } = getModels();

            const { page = 1, limit = 10 } = options;
            const offset = (page - 1) * limit;

            const { rows: ratings, count: total } = await Rating.findAndCountAll({
                where: { hospitalId },
                include: [{
                    model: Patient,
                    as: 'patient',
                    attributes: ['patientId', 'firstName', 'lastName']
                }],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

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
            const { Rating } = getModels();

            const where = {};
            if (doctorId) where.doctorId = doctorId;
            if (hospitalId) where.hospitalId = hospitalId;

            if (Object.keys(where).length === 0) {
                return { success: false, error: 'Doctor ID or Hospital ID is required' };
            }

            const ratings = await Rating.findAll({ where });

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

            const { Rating, Patient, Doctor, Hospital } = getModels();

            const rating = await Rating.findByPk(ratingId, {
                include: [
                    { model: Patient, as: 'patient', attributes: ['patientId', 'firstName', 'lastName'] },
                    { model: Doctor, as: 'doctor', attributes: ['doctorId', 'firstName', 'lastName'] },
                    { model: Hospital, as: 'hospital', attributes: ['hospitalId', 'name'] }
                ]
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

            const { Rating } = getModels();

            const rating = await Rating.findByPk(ratingId);

            if (!rating) {
                return { success: false, error: 'Rating not found' };
            }

            // Check if patient owns this rating
            if (rating.patientId !== patientId) {
                return { success: false, error: 'Unauthorized to update this rating' };
            }

            await rating.update(updateData);

            return {
                success: true,
                data: rating,
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

            const { Rating } = getModels();

            const rating = await Rating.findByPk(ratingId);

            if (!rating) {
                return { success: false, error: 'Rating not found' };
            }

            // Check if patient owns this rating
            if (rating.patientId !== patientId) {
                return { success: false, error: 'Unauthorized to delete this rating' };
            }

            await rating.destroy();

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
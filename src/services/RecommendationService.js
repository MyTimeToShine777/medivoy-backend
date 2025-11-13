// Recommendation Service - Personalized recommendations
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class RecommendationService {
    // ========== RECOMMEND DOCTORS ==========
    async recommendDoctors(userId, limit = 5) {
        try {
            // Get user's booking history
            const userBookings = await prisma.booking.findMany({
                where: { userId },
                include: [
                    { model: Doctor, as: 'doctor' },
                    { model: Treatment, as: 'treatment' },
                ],
            });

            if (userBookings.length === 0) {
                // Return top-rated doctors if no booking history
                const topDoctors = await prisma.doctor.findMany({
                    where: { isActive: true },
                    order: [
                        ['averageRating', 'DESC']
                    ],
                    limit,
                });

                return { success: true, data: topDoctors };
            }

            // Get specializations from booking history
            const specializations = userBookings.map(b => {
                const doctor = b.doctor;
                return doctor && doctor.specialization ? doctor.specialization : null;
            }).filter(Boolean);

            // Recommend doctors with same specialization
            const recommendedDoctors = await prisma.doctor.findMany({
                where: {
                    specialization: {
                        [Op.in]: specializations
                    },
                    isActive: true,
                },
                order: [
                    ['averageRating', 'DESC']
                ],
                limit,
            });

            return { success: true, data: recommendedDoctors };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== RECOMMEND HOSPITALS ==========
    async recommendHospitals(userId, limit = 5) {
        try {
            const userBookings = await prisma.booking.findMany({
                where: { userId },
                include: [{ model: Hospital, as: 'hospital' }],
            });

            if (userBookings.length === 0) {
                const topHospitals = await prisma.hospital.findMany({
                    where: { isActive: true },
                    order: [
                        ['averageRating', 'DESC']
                    ],
                    limit,
                });

                return { success: true, data: topHospitals };
            }

            // Get cities from booking history
            const cities = userBookings.map(b => {
                const hospital = b.hospital;
                return hospital && hospital.city ? hospital.city : null;
            }).filter(Boolean);

            // Recommend hospitals in same cities
            const recommendedHospitals = await prisma.hospital.findMany({
                where: {
                    city: {
                        [Op.in]: cities
                    },
                    isActive: true,
                },
                order: [
                    ['averageRating', 'DESC']
                ],
                limit,
            });

            return { success: true, data: recommendedHospitals };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== RECOMMEND TREATMENTS ==========
    async recommendTreatments(userId, limit = 5) {
        try {
            const userBookings = await prisma.booking.findMany({
                where: { userId },
                include: [{ model: Treatment, as: 'treatment' }],
            });

            if (userBookings.length === 0) {
                const popularTreatments = await Treatment.findAll({
                    where: { isActive: true },
                    order: [
                        ['totalBookings', 'DESC']
                    ],
                    limit,
                });

                return { success: true, data: popularTreatments };
            }

            // Recommend similar treatments
            const treatmentIds = userBookings.map(b => {
                const treatment = b.treatment;
                return treatment ? treatment.treatmentId : null;
            }).filter(Boolean);

            const recommendedTreatments = await Treatment.findAll({
                where: {
                    treatmentId: {
                        [Op.notIn]: treatmentIds
                    },
                    isActive: true,
                },
                order: [
                    ['averageRating', 'DESC']
                ],
                limit,
            });

            return { success: true, data: recommendedTreatments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== PERSONALIZED RECOMMENDATIONS ==========
    async getPersonalizedRecommendations(userId) {
        try {
            const doctors = await this.recommendDoctors(userId, 3);
            const hospitals = await this.recommendHospitals(userId, 3);
            const treatments = await this.recommendTreatments(userId, 3);

            return {
                success: true,
                data: {
                    topDoctors: doctors.data || [],
                    topHospitals: hospitals.data || [],
                    topTreatments: treatments.data || [],
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new RecommendationService();
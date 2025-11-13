// Doctor Service - Doctor management and operations
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class DoctorService {
    // ========== CREATE DOCTOR ==========
    async createDoctor(doctorData) {
        try {
            const doctor = await prisma.doctor.create({
                data: {
                doctorNumber: await this.generateDoctorNumber(),
                ...doctorData,
            });

            return {
                success: true,
                data: doctor,
                message: 'Doctor created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== GET DOCTOR ==========
    async getDoctorById(doctorId) {
        try {
            const doctor = await prisma.doctor.findUnique({
                where: { doctorId }, {
                include: [
                    { model: DoctorSchedule, as: 'schedules' },
                    { model: Review, as: 'reviews' },
                ],
            });

            if (!doctor) {
                return {
                    success: false,
                    error: 'Doctor not found',
                };
            }

            return {
                success: true,
                data: doctor,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getDoctorByEmail(email) {
        try {
            const doctor = await prisma.doctor.findFirst({
                where: { email },
                include: [
                    { model: Hospital, as: 'hospitals' },
                ],
            });

            if (!doctor) {
                return {
                    success: false,
                    error: 'Doctor not found',
                };
            }

            return {
                success: true,
                data: doctor,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== SEARCH DOCTORS ==========
    async searchDoctors(filters = {}) {
        try {
            const where = { isActive: true };

            if (filters.specialization) {
                where.specialization = filters.specialization;
            }
            if (filters.hospitalId) {
                where.hospitalId = filters.hospitalId;
            }
            if (filters.minRating) {
                where.averageRating = {
                    gte: filters.minRating
                };
            }
            if (filters.search) {
                where.OR = [{
                        firstName: {
                            contains: filters.search, mode: "insensitive"
                        }
                    },
                    {
                        lastName: {
                            contains: filters.search, mode: "insensitive"
                        }
                    },
                    {
                        specialization: {
                            contains: filters.search, mode: "insensitive"
                        }
                    },
                ];
            }

            const doctors = await prisma.doctor.findMany({
                where,
                include: [
                    { model: Hospital, as: 'hospital' },
                ],
                order: [
                    ['averageRating', 'DESC']
                ],
                limit: filters.limit || 20,
                offset: filters.offset || 0,
            });

            const total = await Doctor.count({ where });

            return {
                success: true,
                data: doctors,
                total,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getDoctorsBySpecialization(specialization, hospitalId = null) {
        try {
            const where = { specialization, isActive: true };
            if (hospitalId) {
                where.hospitalId = hospitalId;
            }

            const doctors = await prisma.doctor.findMany({
                where,
                order: [
                    ['averageRating', 'DESC']
                ],
            });

            return {
                success: true,
                data: doctors,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== UPDATE DOCTOR ==========
    async updateDoctor(doctorId, updateData) {
        try {
            const doctor = await Doctor.findByPk(doctorId);
            if (!doctor) {
                return {
                    success: false,
                    error: 'Doctor not found',
                };
            }

            const updated = await doctor.update(updateData);
            return {
                success: true,
                data: updated,
                message: 'Doctor updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== DOCTOR SCHEDULE ==========
    async createSchedule(doctorId, scheduleData) {
        try {
            const doctor = await Doctor.findByPk(doctorId);
            if (!doctor) {
                return {
                    success: false,
                    error: 'Doctor not found',
                };
            }

            const schedule = await DoctorSchedule.create({
                doctorId,
                ...scheduleData,
            });

            return {
                success: true,
                data: schedule,
                message: 'Schedule created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async getDoctorSchedule(doctorId, date = null) {
        try {
            const where = { doctorId };

            if (date) {
                where.date = date;
            }

            const schedules = await DoctorSchedule.findAll({
                where,
                order: [
                    ['startTime', 'ASC']
                ],
            });

            return {
                success: true,
                data: schedules,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async updateSchedule(scheduleId, updateData) {
        try {
            const schedule = await DoctorSchedule.findByPk(scheduleId);
            if (!schedule) {
                return {
                    success: false,
                    error: 'Schedule not found',
                };
            }

            const updated = await schedule.update(updateData);
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

    // ========== AVAILABILITY CHECK ==========
    async checkAvailability(doctorId, date, timeSlot) {
        try {
            const schedule = await DoctorSchedule.findOne({
                where: {
                    doctorId,
                    date,
                    isAvailable: true,
                },
            });

            if (!schedule) {
                return {
                    success: false,
                    available: false,
                    message: 'Doctor not available at this time',
                };
            }

            // Check if slot is booked
            const bookedSlot = await Appointment.findOne({
                where: {
                    doctorId,
                    appointmentDate: date,
                    timeSlot,
                    status: {
                        not: 'cancelled'
                    },
                },
            });

            if (bookedSlot) {
                return {
                    success: false,
                    available: false,
                    message: 'Time slot is already booked',
                };
            }

            return {
                success: true,
                available: true,
                message: 'Time slot is available',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== DOCTOR RATINGS & REVIEWS ==========
    async getDoctorRatings(doctorId) {
        try {
            const doctor = await Doctor.findByPk(doctorId);
            if (!doctor) {
                return {
                    success: false,
                    error: 'Doctor not found',
                };
            }

            const reviews = await Review.findAll({
                where: { doctorId },
                order: [
                    ['createdAt', 'DESC']
                ],
            });

            return {
                success: true,
                data: {
                    averageRating: doctor.averageRating,
                    totalReviews: doctor.totalReviews,
                    reviews,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    async updateDoctorRating(doctorId) {
        try {
            const reviews = await Review.findAll({
                where: { doctorId },
            });

            if (reviews.length === 0) {
                return {
                    success: false,
                    error: 'No reviews found',
                };
            }

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = (totalRating / reviews.length).toFixed(2);

            await Doctor.update({
                averageRating,
                totalReviews: reviews.length,
            }, { where: { doctorId } });

            return {
                success: true,
                data: { averageRating, totalReviews: reviews.length },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ========== DOCTOR STATISTICS ==========
    async getDoctorStats(doctorId) {
        try {
            const doctor = await Doctor.findByPk(doctorId);
            if (!doctor) {
                return {
                    success: false,
                    error: 'Doctor not found',
                };
            }

            const totalAppointments = await Appointment.count({
                where: { doctorId },
            });

            const completedAppointments = await Appointment.count({
                where: {
                    doctorId,
                    status: 'completed',
                },
            });

            return {
                success: true,
                data: {
                    totalAppointments,
                    completedAppointments,
                    averageRating: doctor.averageRating,
                    totalReviews: doctor.totalReviews,
                    specialization: doctor.specialization,
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
    async generateDoctorNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `DOC-${timestamp}-${random}`;
    }
}

export default new DoctorService();
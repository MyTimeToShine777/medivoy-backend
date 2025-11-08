'use strict';

import { Op, sequelize } from 'sequelize';
import {
    Booking,
    Payment,
    Review,
    User,
    Doctor,
    Hospital,
    Appointment,
    LabOrder,
    AuditLog
} from '../models/index.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

export class StatisticsService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // USER STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserStatistics(userId) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID required' };
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return { success: false, error: 'User not found' };
            }

            const totalBookings = await Booking.count({ where: { userId: userId } });
            const completedBookings = await Booking.count({
                where: { userId: userId, status: 'completed' }
            });
            const cancelledBookings = await Booking.count({
                where: { userId: userId, status: 'cancelled' }
            });

            const totalSpent = await Payment.sum('amount', {
                where: {
                    userId: userId,
                    status: 'completed'
                }
            });

            const totalReviews = await Review.count({ where: { userId: userId, isPublished: true } });

            const appointments = await Appointment.count({ where: { userId: userId } });

            return {
                success: true,
                statistics: {
                    userId: userId,
                    userName: user.firstName + ' ' + user.lastName,
                    totalBookings: totalBookings,
                    completedBookings: completedBookings,
                    cancelledBookings: cancelledBookings,
                    completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(2) + '%' : '0%',
                    totalSpent: (totalSpent || 0).toFixed(2),
                    totalReviews: totalReviews,
                    totalAppointments: appointments,
                    accountCreatedAt: user.createdAt
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // BOOKING STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getBookingStatistics(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                return { success: false, error: 'Date range required' };
            }

            const where = {
                createdAt: {
                    [Op.between]: [startDate, endDate] }
            };

            const totalBookings = await Booking.count({ where: where });
            const confirmedBookings = await Booking.count({
                where: {...where, status: 'confirmed' }
            });
            const completedBookings = await Booking.count({
                where: {...where, status: 'completed' }
            });
            const cancelledBookings = await Booking.count({
                where: {...where, status: 'cancelled' }
            });
            const pendingBookings = await Booking.count({
                where: {...where, status: 'pending' }
            });

            const statusBreakdown = {
                confirmed: confirmedBookings,
                completed: completedBookings,
                cancelled: cancelledBookings,
                pending: pendingBookings
            };

            return {
                success: true,
                statistics: {
                    period: { startDate: startDate, endDate: endDate },
                    totalBookings: totalBookings,
                    statusBreakdown: statusBreakdown,
                    confirmationRate: totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(2) + '%' : '0%',
                    completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(2) + '%' : '0%',
                    cancellationRate: totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(2) + '%' : '0%'
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PAYMENT STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getPaymentStatistics(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                return { success: false, error: 'Date range required' };
            }

            const where = {
                createdAt: {
                    [Op.between]: [startDate, endDate] }
            };

            const totalTransactions = await Payment.count({ where: where });
            const completedTransactions = await Payment.count({
                where: {...where, status: 'completed' }
            });
            const failedTransactions = await Payment.count({
                where: {...where, status: 'failed' }
            });
            const refundedTransactions = await Payment.count({
                where: {...where, status: 'refunded' }
            });

            const totalRevenue = await Payment.sum('amount', {
                where: {...where, status: 'completed' }
            });

            const avgTransactionValue = completedTransactions > 0 ? (totalRevenue / completedTransactions).toFixed(2) : 0;

            const paymentsByGateway = await Payment.findAll({
                where: where,
                attributes: [
                    'gateway', [sequelize.fn('COUNT', sequelize.col('paymentId')), 'count'],
                    [sequelize.fn('SUM', sequelize.col('amount')), 'total']
                ],
                group: ['gateway'],
                raw: true
            });

            return {
                success: true,
                statistics: {
                    period: { startDate: startDate, endDate: endDate },
                    totalTransactions: totalTransactions,
                    completedTransactions: completedTransactions,
                    failedTransactions: failedTransactions,
                    refundedTransactions: refundedTransactions,
                    successRate: totalTransactions > 0 ? ((completedTransactions / totalTransactions) * 100).toFixed(2) + '%' : '0%',
                    totalRevenue: (totalRevenue || 0).toFixed(2),
                    avgTransactionValue: avgTransactionValue,
                    paymentsByGateway: paymentsByGateway
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DOCTOR STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getDoctorStatistics(doctorId) {
        try {
            if (!doctorId) {
                return { success: false, error: 'Doctor ID required' };
            }

            const doctor = await Doctor.findByPk(doctorId);
            if (!doctor) {
                return { success: false, error: 'Doctor not found' };
            }

            const totalAppointments = await Appointment.count({ where: { doctorId: doctorId } });
            const completedAppointments = await Appointment.count({
                where: { doctorId: doctorId, status: 'completed' }
            });
            const cancelledAppointments = await Appointment.count({
                where: { doctorId: doctorId, status: 'cancelled' }
            });

            const totalReviews = await Review.count({
                where: { doctorId: doctorId, isPublished: true }
            });

            return {
                success: true,
                statistics: {
                    doctorId: doctorId,
                    doctorName: doctor.firstName + ' ' + doctor.lastName,
                    specialization: doctor.specialization,
                    experience: doctor.experience,
                    totalAppointments: totalAppointments,
                    completedAppointments: completedAppointments,
                    cancelledAppointments: cancelledAppointments,
                    completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(2) + '%' : '0%',
                    averageRating: doctor.averageRating || 0,
                    totalReviews: totalReviews
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HOSPITAL STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getHospitalStatistics(hospitalId) {
        try {
            if (!hospitalId) {
                return { success: false, error: 'Hospital ID required' };
            }

            const hospital = await Hospital.findByPk(hospitalId);
            if (!hospital) {
                return { success: false, error: 'Hospital not found' };
            }

            const totalBookings = await Booking.count({ where: { hospitalId: hospitalId } });
            const completedBookings = await Booking.count({
                where: { hospitalId: hospitalId, status: 'completed' }
            });

            const totalDoctors = await Doctor.count({ where: { hospitalId: hospitalId, isActive: true } });

            const totalReviews = await Review.count({
                where: { hospitalId: hospitalId, isPublished: true }
            });

            const totalRevenue = await Payment.sum('amount', {
                where: { status: 'completed' }
            });

            return {
                success: true,
                statistics: {
                    hospitalId: hospitalId,
                    hospitalName: hospital.hospitalName,
                    location: hospital.location,
                    totalBeds: hospital.totalBeds,
                    totalBookings: totalBookings,
                    completedBookings: completedBookings,
                    completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(2) + '%' : '0%',
                    totalDoctors: totalDoctors,
                    averageRating: hospital.averageRating || 0,
                    totalReviews: totalReviews,
                    totalRevenue: (totalRevenue || 0).toFixed(2)
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TREATMENT STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getTreatmentStatistics(treatmentId) {
        try {
            if (!treatmentId) {
                return { success: false, error: 'Treatment ID required' };
            }

            const treatment = await Treatment.findByPk(treatmentId);
            if (!treatment) {
                return { success: false, error: 'Treatment not found' };
            }

            const totalBookings = await Booking.count({ where: { treatmentId: treatmentId } });
            const completedBookings = await Booking.count({
                where: { treatmentId: treatmentId, status: 'completed' }
            });

            const avgRating = await Review.findAll({
                where: { treatmentId: treatmentId },
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
                ],
                raw: true
            });

            return {
                success: true,
                statistics: {
                    treatmentId: treatmentId,
                    treatmentName: treatment.treatmentName,
                    category: treatment.category,
                    basePrice: treatment.basePrice,
                    totalBookings: totalBookings,
                    completedBookings: completedBookings,
                    completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(2) + '%' : '0%',
                    averageRating: avgRating && avgRating[0] ? parseFloat(avgRating[0].avgRating).toFixed(2) : 0
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // TIME-BASED ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getDailyStatistics(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                return { success: false, error: 'Date range required' };
            }

            const dailyStats = await Booking.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate] }
                },
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    'status', [sequelize.fn('COUNT', sequelize.col('bookingId')), 'count']
                ],
                group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'status'],
                order: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']
                ],
                raw: true
            });

            return { success: true, dailyStatistics: dailyStats };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getMonthlyStatistics(year) {
        try {
            if (!year) {
                return { success: false, error: 'Year required' };
            }

            const monthlyStats = await Booking.findAll({
                where: sequelize.where(
                    sequelize.fn('YEAR', sequelize.col('createdAt')),
                    Op.eq,
                    year
                ),
                attributes: [
                    [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('bookingId')), 'count'],
                    [sequelize.fn('SUM', sequelize.col('totalPrice')), 'total']
                ],
                group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
                order: [
                    [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']
                ],
                raw: true
            });

            return { success: true, monthlyStatistics: monthlyStats };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // COMPARISON ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async compareStatistics(entity1Type, entity1Id, entity2Type, entity2Id) {
        try {
            if (!entity1Type || !entity1Id || !entity2Type || !entity2Id) {
                return { success: false, error: 'All parameters required' };
            }

            let stats1, stats2;

            if (entity1Type === 'doctor') {
                stats1 = await this.getDoctorStatistics(entity1Id);
            } else if (entity1Type === 'hospital') {
                stats1 = await this.getHospitalStatistics(entity1Id);
            }

            if (entity2Type === 'doctor') {
                stats2 = await this.getDoctorStatistics(entity2Id);
            } else if (entity2Type === 'hospital') {
                stats2 = await this.getHospitalStatistics(entity2Id);
            }

            return {
                success: true,
                comparison: {
                    entity1: stats1.statistics,
                    entity2: stats2.statistics
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new StatisticsService();
'use strict';

import prisma from '../config/prisma.js';
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

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return { success: false, error: 'User not found' };
            }

            const totalBookings = await prisma.booking.count({ where: { userId: userId } });
            const completedBookings = await prisma.booking.count({
                where: { userId: userId, status: 'completed' }
            });
            const cancelledBookings = await prisma.booking.count({
                where: { userId: userId, status: 'cancelled' }
            });

            const totalSpent = await (await prisma.payment.aggregate({ where: {
                    userId: userId,
                    status: 'completed'
                }, _sum: { amount: true } }))._sum.amount;

            const totalReviews = await prisma.review.count({ where: { userId: userId, isPublished: true } });

            const appointments = await prisma.appointment.count({ where: { userId: userId } });

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
                    { gte: [startDate, endDate] }
            };

            const totalBookings = await prisma.booking.count({ where: where });
            const confirmedBookings = await prisma.booking.count({
                where: {...where, status: 'confirmed' }
            });
            const completedBookings = await prisma.booking.count({
                where: {...where, status: 'completed' }
            });
            const cancelledBookings = await prisma.booking.count({
                where: {...where, status: 'cancelled' }
            });
            const pendingBookings = await prisma.booking.count({
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
                    { gte: [startDate, endDate] }
            };

            const totalTransactions = await prisma.payment.count({ where: where });
            const completedTransactions = await prisma.payment.count({
                where: {...where, status: 'completed' }
            });
            const failedTransactions = await prisma.payment.count({
                where: {...where, status: 'failed' }
            });
            const refundedTransactions = await prisma.payment.count({
                where: {...where, status: 'refunded' }
            });

            const totalRevenue = await (await prisma.payment.aggregate({ where: {...where, status: 'completed' }, _sum: { amount: true } }))._sum.amount;

            const avgTransactionValue = completedTransactions > 0 ? (totalRevenue / completedTransactions).toFixed(2) : 0;

            const paymentsByGateway = await prisma.payment.findMany({
                where: where,
                attributes: [
                    'gateway', [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('paymentId')), 'count'],
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('SUM', /* TODO: Check field name */ sequelize.col('amount')), 'total']
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

            const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
            if (!doctor) {
                return { success: false, error: 'Doctor not found' };
            }

            const totalAppointments = await prisma.appointment.count({ where: { doctorId: doctorId } });
            const completedAppointments = await prisma.appointment.count({
                where: { doctorId: doctorId, status: 'completed' }
            });
            const cancelledAppointments = await prisma.appointment.count({
                where: { doctorId: doctorId, status: 'cancelled' }
            });

            const totalReviews = await prisma.review.count({
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

            const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
            if (!hospital) {
                return { success: false, error: 'Hospital not found' };
            }

            const totalBookings = await prisma.booking.count({ where: { hospitalId: hospitalId } });
            const completedBookings = await prisma.booking.count({
                where: { hospitalId: hospitalId, status: 'completed' }
            });

            const totalDoctors = await prisma.doctor.count({ where: { hospitalId: hospitalId, isActive: true } });

            const totalReviews = await prisma.review.count({
                where: { hospitalId: hospitalId, isPublished: true }
            });

            const totalRevenue = await (await prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }))._sum.amount;

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

            const treatment = await prisma.treatment.findUnique({ where: { id: treatmentId } });
            if (!treatment) {
                return { success: false, error: 'Treatment not found' };
            }

            const totalBookings = await prisma.booking.count({ where: { treatmentId: treatmentId } });
            const completedBookings = await prisma.booking.count({
                where: { treatmentId: treatmentId, status: 'completed' }
            });

            const avgRating = await prisma.review.findMany({
                where: { treatmentId: treatmentId },
                attributes: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('AVG', /* TODO: Check field name */ sequelize.col('rating')), 'avgRating']
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

            const dailyStats = await prisma.booking.findMany({
                where: {
                    createdAt: {
                        { gte: [startDate, endDate] }
                },
                attributes: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('DATE', /* TODO: Check field name */ sequelize.col('createdAt')), 'date'],
                    'status', [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('bookingId')), 'count']
                ],
                group: [/* TODO: Replace with Prisma aggregation */ sequelize.fn('DATE', /* TODO: Check field name */ sequelize.col('createdAt')), 'status'],
                order: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('DATE', /* TODO: Check field name */ sequelize.col('createdAt')), 'ASC']
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

            const monthlyStats = await prisma.booking.findMany({
                where: sequelize.where(
                    /* TODO: Replace with Prisma aggregation */ sequelize.fn('YEAR', /* TODO: Check field name */ sequelize.col('createdAt')),
                    Op.eq,
                    year
                ),
                attributes: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('MONTH', /* TODO: Check field name */ sequelize.col('createdAt')), 'month'],
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('bookingId')), 'count'],
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('SUM', /* TODO: Check field name */ sequelize.col('totalPrice')), 'total']
                ],
                group: [/* TODO: Replace with Prisma aggregation */ sequelize.fn('MONTH', /* TODO: Check field name */ sequelize.col('createdAt'))],
                order: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('MONTH', /* TODO: Check field name */ sequelize.col('createdAt')), 'ASC']
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
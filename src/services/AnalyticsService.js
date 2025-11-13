'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { AppError } from '../utils/errors/AppError.js';

// CONSOLIDATED: DashboardService + ReportService + AnalyticsService
export class AnalyticsService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DASHBOARD METRICS (from DashboardService)
    // ═══════════════════════════════════════════════════════════════════════════════

    async getDashboardMetrics() {
        try {
            const totalBookings = await prisma.booking.count();
            const totalRevenue = await (await prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }))._sum.amount;
            const totalUsers = await prisma.user.count();
            const totalDoctors = await prisma.doctor.count();
            const totalHospitals = await prisma.hospital.count();

            const pendingBookings = await prisma.booking.count({ where: { status: 'pending' } });
            const confirmedBookings = await prisma.booking.count({ where: { status: 'confirmed' } });
            const completedBookings = await prisma.booking.count({ where: { status: 'completed' } });
            const cancelledBookings = await prisma.booking.count({ where: { status: 'cancelled' } });

            const completedPayments = await prisma.payment.count({ where: { status: 'completed' } });
            const failedPayments = await prisma.payment.count({ where: { status: 'failed' } });
            const refundedPayments = await prisma.payment.count({ where: { status: 'refunded' } });

            const totalReviews = await prisma.review.count({ where: { isPublished: true } });
            const avgRating = await prisma.review.findMany({
                where: { isPublished: true },
                attributes: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('AVG', /* TODO: Check field name */ sequelize.col('rating')), 'avgRating']
                ],
                raw: true
            });

            const metrics = {
                bookings: {
                    total: totalBookings,
                    pending: pendingBookings,
                    confirmed: confirmedBookings,
                    completed: completedBookings,
                    cancelled: cancelledBookings
                },
                payments: {
                    totalRevenue: totalRevenue || 0,
                    completed: completedPayments,
                    failed: failedPayments,
                    refunded: refundedPayments,
                    avgTransactionValue: totalRevenue && completedPayments ? (totalRevenue / completedPayments).toFixed(2) : 0
                },
                reviews: {
                    total: totalReviews,
                    averageRating: avgRating && avgRating[0] && avgRating[0].avgRating ? parseFloat(avgRating[0].avgRating).toFixed(2) : 0
                },
                users: {
                    total: totalUsers,
                    doctors: totalDoctors,
                    hospitals: totalHospitals,
                    patients: totalUsers - totalDoctors
                }
            };

            return { success: true, metrics: metrics };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getRevenueAnalytics(startDate, endDate) {
        try {
            if (!startDate || !endDate) throw new AppError('Date range required', 400);

            const payments = await prisma.payment.findMany({
                where: {
                    status: 'completed',
                    createdAt: {
                        { gte: [startDate, endDate] }
                },
                attributes: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('DATE', /* TODO: Check field name */ sequelize.col('createdAt')), 'date'],
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('SUM', /* TODO: Check field name */ sequelize.col('amount')), 'totalAmount'],
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('paymentId')), 'transactionCount']
                ],
                group: [/* TODO: Replace with Prisma aggregation */ sequelize.fn('DATE', /* TODO: Check field name */ sequelize.col('createdAt'))],
                order: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('DATE', /* TODO: Check field name */ sequelize.col('createdAt')), 'ASC']
                ],
                raw: true
            });

            const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.totalAmount || 0), 0);
            const totalTransactions = payments.reduce((sum, p) => sum + p.transactionCount, 0);

            return {
                success: true,
                data: payments,
                summary: {
                    totalRevenue: totalRevenue.toFixed(2),
                    totalTransactions: totalTransactions,
                    avgDailyRevenue: (totalRevenue / payments.length).toFixed(2),
                    periodDays: payments.length
                }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getBookingTrendAnalytics(startDate, endDate) {
        try {
            if (!startDate || !endDate) throw new AppError('Date range required', 400);

            const bookingTrends = await prisma.booking.findMany({
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

            return {
                success: true,
                trends: bookingTrends,
                period: { startDate: startDate, endDate: endDate }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // REPORT GENERATION (from ReportService - MERGED)
    // ═══════════════════════════════════════════════════════════════════════════════

    async generateBookingReport(filters) {
        try {
            const where = {};

            if (filters && filters.startDate && filters.endDate) {
                where.createdAt = {
                    { gte: [filters.startDate, filters.endDate] };
            }

            if (filters && filters.status) {
                where.status = filters.status;
            }

            if (filters && filters.hospitalId) {
                where.hospitalId = filters.hospitalId;
            }

            const bookings = await prisma.booking.findMany({
                where: where,
                include: [
                    { model: User, attributes: ['firstName', 'lastName', 'email'] },
                    { model: Treatment, attributes: ['treatmentName'] },
                    { model: Hospital, attributes: ['hospitalName'] }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            const report = {
                reportType: 'Booking Report',
                generatedAt: new Date(),
                totalRecords: bookings.length,
                statusBreakdown: {
                    pending: bookings.filter(b => b.status === 'pending').length,
                    confirmed: bookings.filter(b => b.status === 'confirmed').length,
                    completed: bookings.filter(b => b.status === 'completed').length,
                    cancelled: bookings.filter(b => b.status === 'cancelled').length
                },
                data: bookings
            };

            return { success: true, report: report };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async generateRevenueReport(startDate, endDate) {
        try {
            if (!startDate || !endDate) throw new AppError('Date range required', 400);

            const payments = await prisma.payment.findMany({
                where: {
                    status: 'completed',
                    createdAt: {
                        { gte: [startDate, endDate] }
                },
                include: [
                    { model: Booking, attributes: ['bookingId'] }
                ]
            });

            const byGateway = {};
            const byStatus = {};
            let totalAmount = 0;

            for (const payment of payments) {
                totalAmount += payment.amount;

                if (!byGateway[payment.gateway]) {
                    byGateway[payment.gateway] = { count: 0, amount: 0 };
                }
                byGateway[payment.gateway].count++;
                byGateway[payment.gateway].amount += payment.amount;

                if (!byStatus[payment.status]) {
                    byStatus[payment.status] = { count: 0, amount: 0 };
                }
                byStatus[payment.status].count++;
                byStatus[payment.status].amount += payment.amount;
            }

            const report = {
                reportType: 'Revenue Report',
                generatedAt: new Date(),
                period: { startDate: startDate, endDate: endDate },
                totalPayments: payments.length,
                totalRevenue: totalAmount.toFixed(2),
                byGateway: byGateway,
                byStatus: byStatus,
                data: payments
            };

            return { success: true, report: report };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async generateUserReport(userType) {
        try {
            const where = {};

            if (userType === 'patient') {
                where.userType = 'patient';
            } else if (userType === 'doctor') {
                where.userType = 'doctor';
            }

            const users = await prisma.user.findMany({
                where: where,
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            const report = {
                reportType: 'User Report',
                userType: userType || 'all',
                generatedAt: new Date(),
                totalUsers: users.length,
                activeUsers: users.filter(u => u.isActive).length,
                inactiveUsers: users.filter(u => !u.isActive).length,
                data: users
            };

            return { success: true, report: report };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async generateHospitalPerformanceReport(hospitalId, startDate, endDate) {
        try {
            if (!hospitalId) throw new AppError('Hospital ID required', 400);

            const bookings = await prisma.booking.count({
                where: {
                    hospitalId: hospitalId,
                    createdAt: {
                        { gte: [startDate, endDate] }
                }
            });

            const completedBookings = await prisma.booking.count({
                where: {
                    hospitalId: hospitalId,
                    status: 'completed',
                    createdAt: {
                        { gte: [startDate, endDate] }
                }
            });

            const reviews = await prisma.review.findMany({
                where: {
                    hospitalId: hospitalId,
                    isPublished: true
                },
                attributes: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('AVG', /* TODO: Check field name */ sequelize.col('rating')), 'avgRating'],
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('reviewId')), 'totalReviews']
                ],
                raw: true
            });

            const revenue = await Payment.sum('amount', {
                where: {
                    status: 'completed',
                    createdAt: {
                        { gte: [startDate, endDate] }
                }
            });

            const report = {
                reportType: 'Hospital Performance Report',
                hospitalId: hospitalId,
                generatedAt: new Date(),
                period: { startDate: startDate, endDate: endDate },
                metrics: {
                    totalBookings: bookings,
                    completedBookings: completedBookings,
                    completionRate: bookings > 0 ? ((completedBookings / bookings) * 100).toFixed(2) + '%' : '0%',
                    averageRating: reviews[0] && reviews[0].avgRating ? parseFloat(reviews[0].avgRating).toFixed(2) : 0,
                    totalReviews: reviews[0] ? reviews[0].totalReviews : 0,
                    revenue: revenue || 0
                }
            };

            return { success: true, report: report };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ANALYTICS & STATISTICS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getTopHospitals(limit) {
        try {
            const hospitals = await prisma.hospital.findMany({
                attributes: {
                    include: [
                        [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('Bookings.bookingId')), 'bookingCount']
                    ]
                },
                include: [{
                    model: Booking,
                    attributes: [],
                    required: false
                }],
                group: ['Hospital.hospitalId'],
                order: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('Bookings.bookingId')), 'DESC']
                ],
                limit: limit || 10,
                raw: false,
                subQuery: false
            });

            return { success: true, hospitals: hospitals };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getTopDoctors(limit) {
        try {
            const doctors = await prisma.doctor.findMany({
                attributes: {
                    include: [
                        [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('Appointments.appointmentId')), 'appointmentCount']
                    ]
                },
                include: [{
                    model: Appointment,
                    attributes: [],
                    required: false
                }],
                group: ['Doctor.doctorId'],
                order: [
                    [/* TODO: Replace with Prisma aggregation */ sequelize.fn('COUNT', /* TODO: Check field name */ sequelize.col('Appointments.appointmentId')), 'DESC']
                ],
                limit: limit || 10,
                raw: false,
                subQuery: false
            });

            return { success: true, doctors: doctors };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getUserRetentionAnalytics(monthsBack) {
        try {
            const months = monthsBack || 12;
            const retention = {};

            for (let i = months; i > 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthKey = date.toISOString().substring(0, 7);

                const newUsers = await prisma.user.count({
                    where: {
                        createdAt: {
                            { gte: [new Date(monthKey + '-01'), new Date(monthKey + '-31')] }
                    }
                });

                retention[monthKey] = newUsers;
            }

            return { success: true, retention: retention };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════════

    async logAnalyticsAccess(userId, reportType) {
        try {
            await this.auditLogService.logAction({
                action: 'ANALYTICS_REPORT_ACCESSED',
                entityType: 'Report',
                entityId: reportType + '-' + Date.now(),
                userId: userId,
                details: { reportType: reportType }
            });
        } catch (error) {
            console.error('Failed to log analytics access:', error);
        }
    }
}

export default AnalyticsService;
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
            const avgRatingResult = await prisma.review.aggregate({
                where: { isPublished: true },
                _avg: { rating: true }
            });
            const avgRating = avgRatingResult._avg.rating;

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
                    averageRating: avgRating ? parseFloat(avgRating).toFixed(2) : 0
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

            // Fetch all payments in the date range
            const payments = await prisma.payment.findMany({
                where: {
                    status: 'completed',
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    }
                },
                select: {
                    createdAt: true,
                    amount: true,
                    paymentId: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });

            // Group by date manually since Prisma doesn't support GROUP BY with raw SQL functions
            const groupedByDate = payments.reduce((acc, payment) => {
                const date = payment.createdAt.toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = { date, totalAmount: 0, transactionCount: 0 };
                }
                acc[date].totalAmount += parseFloat(payment.amount);
                acc[date].transactionCount += 1;
                return acc;
            }, {});

            const revenueData = Object.values(groupedByDate);
            const totalRevenue = revenueData.reduce((sum, p) => sum + p.totalAmount, 0);
            const totalTransactions = revenueData.reduce((sum, p) => sum + p.transactionCount, 0);

            return {
                success: true,
                data: revenueData,
                summary: {
                    totalRevenue: totalRevenue.toFixed(2),
                    totalTransactions: totalTransactions,
                    avgDailyRevenue: revenueData.length > 0 ? (totalRevenue / revenueData.length).toFixed(2) : '0.00',
                    periodDays: revenueData.length
                }
            };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getBookingTrendAnalytics(startDate, endDate) {
        try {
            if (!startDate || !endDate) throw new AppError('Date range required', 400);

            // Fetch all bookings in the date range
            const bookings = await prisma.booking.findMany({
                where: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    }
                },
                select: {
                    createdAt: true,
                    status: true,
                    bookingId: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });

            // Group by date and status manually
            const groupedByDateStatus = bookings.reduce((acc, booking) => {
                const date = booking.createdAt.toISOString().split('T')[0];
                const key = `${date}_${booking.status}`;
                if (!acc[key]) {
                    acc[key] = { date, status: booking.status, count: 0 };
                }
                acc[key].count += 1;
                return acc;
            }, {});

            const bookingTrends = Object.values(groupedByDateStatus);

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
                    gte: new Date(filters.startDate),
                    lte: new Date(filters.endDate)
                };
            }

            if (filters && filters.status) {
                where.status = filters.status;
            }

            if (filters && filters.hospitalId) {
                where.hospitalId = filters.hospitalId;
            }

            const bookings = await prisma.booking.findMany({
                where: where,
                include: {
                    user: {
                        select: { firstName: true, lastName: true, email: true }
                    },
                    treatment: {
                        select: { treatmentName: true }
                    },
                    hospital: {
                        select: { hospitalName: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
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
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    }
                },
                include: {
                    booking: {
                        select: { bookingId: true }
                    }
                }
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
                orderBy: {
                    createdAt: 'desc'
                }
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

            const whereBase = {
                hospitalId: hospitalId
            };

            if (startDate && endDate) {
                whereBase.createdAt = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }

            const bookings = await prisma.booking.count({
                where: whereBase
            });

            const completedBookings = await prisma.booking.count({
                where: {
                    ...whereBase,
                    status: 'completed'
                }
            });

            const reviewAggregation = await prisma.review.aggregate({
                where: {
                    hospitalId: hospitalId,
                    isPublished: true
                },
                _avg: {
                    rating: true
                },
                _count: {
                    reviewId: true
                }
            });

            const revenueAggregation = await prisma.payment.aggregate({
                where: {
                    hospitalId: hospitalId,
                    status: 'completed',
                    ...(startDate && endDate ? {
                        createdAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate)
                        }
                    } : {})
                },
                _sum: {
                    amount: true
                }
            });

            const revenue = revenueAggregation._sum.amount || 0;

            const report = {
                reportType: 'Hospital Performance Report',
                hospitalId: hospitalId,
                generatedAt: new Date(),
                period: { startDate: startDate, endDate: endDate },
                metrics: {
                    totalBookings: bookings,
                    completedBookings: completedBookings,
                    completionRate: bookings > 0 ? ((completedBookings / bookings) * 100).toFixed(2) + '%' : '0%',
                    averageRating: reviewAggregation._avg.rating ? parseFloat(reviewAggregation._avg.rating).toFixed(2) : 0,
                    totalReviews: reviewAggregation._count.reviewId || 0,
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
            // Fetch all hospitals with their bookings
            const hospitals = await prisma.hospital.findMany({
                include: {
                    bookings: {
                        select: {
                            bookingId: true
                        }
                    }
                }
            });

            // Add booking count and sort
            const hospitalsWithCount = hospitals.map(hospital => ({
                ...hospital,
                bookingCount: hospital.bookings ? hospital.bookings.length : 0
            }));

            hospitalsWithCount.sort((a, b) => b.bookingCount - a.bookingCount);

            const topHospitals = hospitalsWithCount.slice(0, limit || 10);

            return { success: true, hospitals: topHospitals };
        } catch (error) {
            throw this.errorHandlingService.handleError(error);
        }
    }

    async getTopDoctors(limit) {
        try {
            // Fetch all doctors with their appointments
            const doctors = await prisma.doctor.findMany({
                include: {
                    appointments: {
                        select: {
                            appointmentId: true
                        }
                    }
                }
            });

            // Add appointment count and sort
            const doctorsWithCount = doctors.map(doctor => ({
                ...doctor,
                appointmentCount: doctor.appointments ? doctor.appointments.length : 0
            }));

            doctorsWithCount.sort((a, b) => b.appointmentCount - a.appointmentCount);

            const topDoctors = doctorsWithCount.slice(0, limit || 10);

            return { success: true, doctors: topDoctors };
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

                // Calculate first and last day of the month
                const year = parseInt(monthKey.split('-')[0]);
                const month = parseInt(monthKey.split('-')[1]);
                const firstDay = new Date(year, month - 1, 1);
                const lastDay = new Date(year, month, 0, 23, 59, 59, 999);

                const newUsers = await prisma.user.count({
                    where: {
                        createdAt: {
                            gte: firstDay,
                            lte: lastDay
                        }
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
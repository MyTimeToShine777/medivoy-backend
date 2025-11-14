'use strict';

import analyticsService from '../services/AnalyticsService.js';
import statisticsService from '../services/StatisticsService.js';

export class AnalyticsController {
    constructor() {
        this.analyticsService = analyticsService;
        this.statisticsService = statisticsService;
    }

    async getDashboardMetrics(req, res) {
        try {
            const result = await this.analyticsService.getDashboardMetrics();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.metrics
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getRevenueAnalytics(req, res) {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;

            const result = await this.analyticsService.getRevenueAnalytics(startDate, endDate);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                summary: result.summary
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getBookingTrendAnalytics(req, res) {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;

            const result = await this.analyticsService.getBookingTrendAnalytics(startDate, endDate);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                trends: result.trends,
                period: result.period
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async generateBookingReport(req, res) {
        try {
            const filters = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                status: req.query.status,
                hospitalId: req.query.hospitalId
            };

            const result = await this.analyticsService.generateBookingReport(filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                report: result.report
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getTopHospitals(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;

            const result = await this.analyticsService.getTopHospitals(limit);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.hospitals
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserStatistics(req, res) {
        try {
            const userId = req.user.userId;

            const result = await this.statisticsService.getUserStatistics(userId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.statistics
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getPaymentStatistics(req, res) {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;

            const result = await this.statisticsService.getPaymentStatistics(startDate, endDate);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.statistics
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new AnalyticsController();
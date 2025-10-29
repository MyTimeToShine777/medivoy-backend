/**
 * Analytics Routes
 */

const express = require('express');

const router = express.Router();
const analyticsController = require('../../controllers/analytics.controller');
const authenticate = require('../../middleware/auth.middleware');

// All analytics routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/analytics/dashboard:
 *   get:
 *     summary: Get overall dashboard statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: hospitalId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @swagger
 * /api/v1/analytics/bookings:
 *   get:
 *     summary: Get booking analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: hospitalId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *     responses:
 *       200:
 *         description: Booking analytics retrieved successfully
 */
router.get('/bookings', analyticsController.getBookingAnalytics);

/**
 * @swagger
 * /api/v1/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/revenue', analyticsController.getRevenueAnalytics);

/**
 * @swagger
 * /api/v1/analytics/hospitals/top:
 *   get:
 *     summary: Get top hospitals by bookings
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/hospitals/top', analyticsController.getTopHospitals);

/**
 * @swagger
 * /api/v1/analytics/treatments/top:
 *   get:
 *     summary: Get top treatments by bookings
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/treatments/top', analyticsController.getTopTreatments);

/**
 * @swagger
 * /api/v1/analytics/patients/demographics:
 *   get:
 *     summary: Get patient demographics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/patients/demographics', analyticsController.getPatientDemographics);

/**
 * @swagger
 * /api/v1/analytics/doctors:
 *   get:
 *     summary: Get doctor performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/doctors', analyticsController.getDoctorAnalytics);

module.exports = router;

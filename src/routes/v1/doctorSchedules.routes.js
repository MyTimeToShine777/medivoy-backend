/**
 * Doctor Schedule Routes
 */

const express = require('express');

const router = express.Router();
const doctorScheduleController = require('../../controllers/doctorSchedule.controller');
const auth = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/v1/doctor-schedules:
 *   post:
 *     summary: Create a new doctor schedule
 *     tags: [Doctor Schedules]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', doctorScheduleController.createSchedule);

/**
 * @swagger
 * /api/v1/doctor-schedules/bulk:
 *   post:
 *     summary: Bulk create doctor schedules
 *     tags: [Doctor Schedules]
 *     security:
 *       - bearerAuth: []
 */
router.post('/bulk', doctorScheduleController.bulkCreateSchedules);

/**
 * @swagger
 * /api/v1/doctor-schedules/doctor/{doctorId}:
 *   get:
 *     summary: Get all schedules for a doctor
 *     tags: [Doctor Schedules]
 *     security:
 *       - bearerAuth: []
 */
router.get('/doctor/:doctorId', doctorScheduleController.getDoctorSchedules);

/**
 * @swagger
 * /api/v1/doctor-schedules/doctor/{doctorId}/available-slots:
 *   get:
 *     summary: Get available time slots for a doctor
 *     tags: [Doctor Schedules]
 *     security:
 *       - bearerAuth: []
 */
router.get('/doctor/:doctorId/available-slots', doctorScheduleController.getAvailableSlots);

/**
 * @swagger
 * /api/v1/doctor-schedules/{id}:
 *   get:
 *     summary: Get a specific schedule
 *     tags: [Doctor Schedules]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', doctorScheduleController.getScheduleById);

/**
 * @swagger
 * /api/v1/doctor-schedules/{id}:
 *   put:
 *     summary: Update a doctor schedule
 *     tags: [Doctor Schedules]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', doctorScheduleController.updateSchedule);

/**
 * @swagger
 * /api/v1/doctor-schedules/{id}:
 *   delete:
 *     summary: Delete a doctor schedule
 *     tags: [Doctor Schedules]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', doctorScheduleController.deleteSchedule);

module.exports = router;

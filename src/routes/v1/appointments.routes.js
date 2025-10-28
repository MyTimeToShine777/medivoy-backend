const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointment.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, appointmentController.getAllAppointments);

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticate, appointmentController.getAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   put:
 *     summary: Update appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, appointmentController.updateAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', authenticate, authorize(['doctor']), appointmentController.updateAppointmentStatus);

/**
 * @swagger
 * /api/v1/appointments/{id}/cancel:
 *   post:
 *     summary: Cancel appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/cancel', authenticate, appointmentController.cancelAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/reschedule:
 *   post:
 *     summary: Reschedule appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/reschedule', authenticate, appointmentController.rescheduleAppointment);

module.exports = router;

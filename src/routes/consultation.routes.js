// Consultation Routes - Video Calls with Google Meet - NO optional chaining
import express from 'express';
import ConsultationController from '../controllers/ConsultationController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import Joi from 'joi';

const router = express.Router();

const scheduleConsultationSchema = Joi.object({
    bookingId: Joi.number().integer().required(),
    doctorId: Joi.number().integer().required(),
    consultationDate: Joi.string().isoDate().required(),
    type: Joi.string().valid('video', 'audio', 'text', 'in_person').required(),
});

const endConsultationSchema = Joi.object({
    notes: Joi.string().max(5000).optional(),
    prescription: Joi.string().max(5000).optional(),
});

/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Schedule new consultation
 *     description: Create a new consultation with doctor for booking
 *     tags:
 *       - Consultations
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - doctorId
 *               - consultationDate
 *               - type
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 2
 *               consultationDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-10T10:00:00Z"
 *               type:
 *                 type: string
 *                 enum: [video, audio, text, in_person]
 *                 example: video
 *     responses:
 *       201:
 *         description: Consultation scheduled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/',
    authMiddleware,
    validateRequest(scheduleConsultationSchema, 'body'),
    ConsultationController.scheduleConsultation
);

/**
 * @swagger
 * /consultations/{consultationId}/meeting-link:
 *   get:
 *     summary: Get meeting link for consultation
 *     description: Retrieve Google Meet link for video consultation
 *     tags:
 *       - Consultations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Meeting link retrieved
 *       404:
 *         description: Consultation not found
 */
router.get(
    '/:consultationId/meeting-link',
    authMiddleware,
    ConsultationController.getMeetingLink
);

/**
 * @swagger
 * /consultations/{consultationId}/start:
 *   post:
 *     summary: Start consultation
 *     description: Mark consultation as started
 *     tags:
 *       - Consultations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultation started
 *       404:
 *         description: Consultation not found
 */
router.post(
    '/:consultationId/start',
    authMiddleware,
    ConsultationController.startConsultation
);

/**
 * @swagger
 * /consultations/{consultationId}/end:
 *   post:
 *     summary: End consultation and save notes
 *     description: Mark consultation as completed and save doctor notes and prescription
 *     tags:
 *       - Consultations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Doctor notes from consultation
 *                 example: "Patient showed improvement in condition"
 *               prescription:
 *                 type: string
 *                 description: Prescription details
 *                 example: "Medication ABC - 2 tablets daily for 5 days"
 *     responses:
 *       200:
 *         description: Consultation ended
 *       404:
 *         description: Consultation not found
 */
router.post(
    '/:consultationId/end',
    authMiddleware,
    validateRequest(endConsultationSchema, 'body'),
    ConsultationController.endConsultation
);

/**
 * @swagger
 * /consultations/upcoming:
 *   get:
 *     summary: Get upcoming consultations
 *     description: Retrieve all upcoming consultations for the authenticated user (as doctor or patient)
 *     tags:
 *       - Consultations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Upcoming consultations retrieved
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/upcoming',
    authMiddleware,
    ConsultationController.getUpcomingConsultations
);

/**
 * @swagger
 * /consultations/{consultationId}/cancel:
 *   post:
 *     summary: Cancel consultation
 *     description: Cancel scheduled or ongoing consultation
 *     tags:
 *       - Consultations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 example: "Schedule conflict"
 *     responses:
 *       200:
 *         description: Consultation cancelled
 *       404:
 *         description: Consultation not found
 */
router.post(
    '/:consultationId/cancel',
    authMiddleware,
    ConsultationController.cancelConsultation
);

export default router;
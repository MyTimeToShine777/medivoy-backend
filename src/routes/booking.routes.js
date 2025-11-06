// Booking Routes with File Upload - NO optional chaining
import express from 'express';
import multer from 'multer';
import BookingController from '../controllers/BookingController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import Joi from 'joi';

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif',
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

// Validation schemas
const createBookingSchema = Joi.object({
    countryId: Joi.number().integer().required(),
    hospitalId: Joi.number().integer().required(),
    doctorId: Joi.number().integer().optional(),
    treatmentId: Joi.number().integer().optional(),
    packageTypeId: Joi.number().integer().required(),
    packageTierId: Joi.number().integer().optional(),
    totalCost: Joi.number().optional(),
    currency: Joi.string().default('INR'),
    notes: Joi.string().optional(),
    preferences: Joi.object().optional(),
});

const updateBookingStatusSchema = Joi.object({
    bookingStatus: Joi.string().required(),
});

const reviewBookingSchema = Joi.object({
    isApproved: Joi.boolean().optional(),
    reviewStatus: Joi.string().optional(),
    reviewNotes: Joi.string().optional(),
    reasonsForRejection: Joi.string().optional(),
    requiredInformation: Joi.string().optional(),
    estimatedTreatmentCost: Joi.number().optional(),
    estimatedDurationDays: Joi.number().integer().optional(),
});

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create new booking with preferences
 *     description: Create a booking with country, hospital, treatment, and package selection
 *     tags:
 *       - Bookings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - countryId
 *               - hospitalId
 *               - packageTypeId
 *             properties:
 *               countryId:
 *                 type: integer
 *                 example: 1
 *               hospitalId:
 *                 type: integer
 *                 example: 3
 *               doctorId:
 *                 type: integer
 *                 example: 2
 *               treatmentId:
 *                 type: integer
 *                 example: 4
 *               packageTypeId:
 *                 type: integer
 *                 example: 1
 *               packageTierId:
 *                 type: integer
 *                 example: 2
 *               totalCost:
 *                 type: number
 *                 example: 50000
 *               currency:
 *                 type: string
 *                 example: INR
 *               preferences:
 *                 type: object
 *                 properties:
 *                   medicalConditions:
 *                     type: string
 *                   allergies:
 *                     type: string
 *                   medications:
 *                     type: array
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/',
    authMiddleware,
    validateRequest(createBookingSchema, 'body'),
    BookingController.createBooking
);

/**
 * @swagger
 * /bookings/{bookingId}:
 *   get:
 *     summary: Get booking details
 *     description: Retrieve full booking details with preferences
 *     tags:
 *       - Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking details retrieved
 *       404:
 *         description: Booking not found
 */
router.get('/:bookingId', authMiddleware, BookingController.getBookingDetails);

/**
 * @swagger
 * /bookings/dashboard/pending:
 *   get:
 *     summary: Get pending bookings for dashboard
 *     description: Retrieve all pending bookings for staff review (internal dashboard)
 *     tags:
 *       - Bookings
 *       - Dashboard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Pending bookings retrieved
 */
router.get('/dashboard/pending', authMiddleware, BookingController.getPendingBookings);

/**
 * @swagger
 * /bookings/{bookingId}/status:
 *   put:
 *     summary: Update booking status
 *     description: Update booking status by staff
 *     tags:
 *       - Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingStatus:
 *                 type: string
 *                 enum: [inquiry, under_review, accepted, rejected, completed]
 *     responses:
 *       200:
 *         description: Booking status updated
 */
router.put(
    '/:bookingId/status',
    authMiddleware,
    authorize(['medivoy_staff', 'admin']),
    validateRequest(updateBookingStatusSchema, 'body'),
    BookingController.updateBookingStatus
);

/**
 * @swagger
 * /bookings/{bookingId}/review:
 *   post:
 *     summary: Review booking
 *     description: Service person reviews booking and uploads decision
 *     tags:
 *       - Bookings
 *       - Dashboard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApproved:
 *                 type: boolean
 *               reviewStatus:
 *                 type: string
 *               reviewNotes:
 *                 type: string
 *               estimatedTreatmentCost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Booking reviewed
 */
router.post(
    '/:bookingId/review',
    authMiddleware,
    authorize(['medivoy_staff', 'admin']),
    validateRequest(reviewBookingSchema, 'body'),
    BookingController.reviewBooking
);

/**
 * @swagger
 * /bookings/{bookingId}/insurance-documents:
 *   post:
 *     summary: Upload insurance document
 *     description: Patient uploads insurance document for booking
 *     tags:
 *       - Bookings
 *       - Documents
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               insuranceProviderName:
 *                 type: string
 *               policyNumber:
 *                 type: string
 *               coverageType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Insurance document uploaded
 */
router.post(
    '/:bookingId/insurance-documents',
    authMiddleware,
    upload.single('file'),
    BookingController.uploadInsuranceDocument
);

/**
 * @swagger
 * /bookings/{bookingId}/medical-documents:
 *   post:
 *     summary: Upload medical document
 *     description: Patient uploads medical records, lab reports, imaging, etc.
 *     tags:
 *       - Bookings
 *       - Documents
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               documentType:
 *                 type: string
 *                 enum: [medical_history, lab_reports, imaging_reports, discharge_summary, other]
 *               documentTitle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medical document uploaded
 */
router.post(
    '/:bookingId/medical-documents',
    authMiddleware,
    upload.single('file'),
    BookingController.uploadMedicalDocument
);

/**
 * @swagger
 * /bookings/{bookingId}/documents:
 *   get:
 *     summary: Get booking documents
 *     description: Retrieve all insurance and medical documents for booking
 *     tags:
 *       - Bookings
 *       - Documents
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Documents retrieved
 */
router.get('/:bookingId/documents', authMiddleware, BookingController.getBookingDocuments);

/**
 * @swagger
 * /bookings/{bookingId}/cancel:
 *   post:
 *     summary: Cancel booking
 *     description: Cancel a booking with reason
 *     tags:
 *       - Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.post('/:bookingId/cancel', authMiddleware, BookingController.cancelBooking);

export default router;
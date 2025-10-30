/**
 * Booking Status Routes
 */

const express = require('express');

const router = express.Router();
const bookingStatusController = require('../../controllers/bookingStatus.controller');
const auth = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/v1/booking-status/{id}:
 *   put:
 *     summary: Update booking status
 *     tags: [Booking Status]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', bookingStatusController.updateBookingStatus);

/**
 * @swagger
 * /api/v1/booking-status/{id}/history:
 *   get:
 *     summary: Get booking status history
 *     tags: [Booking Status]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/history', bookingStatusController.getBookingStatusHistory);

/**
 * @swagger
 * /api/v1/booking-status/{id}/coordinator:
 *   put:
 *     summary: Assign coordinator to booking
 *     tags: [Booking Status]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/coordinator', bookingStatusController.assignCoordinator);

/**
 * @swagger
 * /api/v1/booking-status/{id}/transitions:
 *   get:
 *     summary: Get valid status transitions
 *     tags: [Booking Status]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/transitions', bookingStatusController.getValidTransitions);

/**
 * @swagger
 * /api/v1/booking-status/status/{status}:
 *   get:
 *     summary: Get bookings by status
 *     tags: [Booking Status]
 *     security:
 *       - bearerAuth: []
 */
router.get('/status/:status', bookingStatusController.getBookingsByStatus);

/**
 * @swagger
 * /api/v1/booking-status/bulk-update:
 *   put:
 *     summary: Bulk update booking status
 *     tags: [Booking Status]
 *     security:
 *       - bearerAuth: []
 */
router.put('/bulk-update', bookingStatusController.bulkUpdateStatus);

/**
 * @swagger
 * /api/v1/booking-status/statistics:
 *   get:
 *     summary: Get booking status statistics
 *     tags: [Booking Status]
 *     security:
 *       - bearerAuth: []
 */
router.get('/statistics', bookingStatusController.getStatusStatistics);

router.get('/', auth, bookingStatusController.getAllBookingStatuses);

router.delete('/:id', auth, bookingStatusController.deleteBookingStatus);

module.exports = router;

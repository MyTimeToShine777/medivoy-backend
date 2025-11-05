/**
 * Bookings Routes - COMPLETE
 * 15 endpoints with proper authorization and middleware
 * Status: Production-Ready
 */

const express = require('express');
const BookingController = require('../../controllers/booking.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');
const { validateRequest } = require('../../middleware/validate.middleware');
const { bookingValidator } = require('../../validators');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * 1. POST /bookings
 * Create new booking inquiry (Patient only)
 */
router.post(
  '/',
  authorize(['patient']),
  validateRequest(bookingValidator.createBooking),
  BookingController.createBooking,
);

/**
 * 2. PATCH /bookings/:bookingId/assign-coordinator
 * Assign sales coordinator (Admin/Hospital Admin)
 */
router.patch(
  '/:bookingId/assign-coordinator',
  authorize(['admin', 'hospital_admin']),
  validateRequest(bookingValidator.assignCoordinator),
  BookingController.assignCoordinator,
);

/**
 * 3. PATCH /bookings/:bookingId/schedule-consultation
 * Schedule consultation (Doctor/Admin)
 */
router.patch(
  '/:bookingId/schedule-consultation',
  authorize(['doctor', 'admin', 'hospital_admin']),
  validateRequest(bookingValidator.scheduleConsultation),
  BookingController.scheduleConsultation,
);

/**
 * 4. PATCH /bookings/:bookingId/complete-consultation
 * Complete consultation (Doctor/Admin)
 */
router.patch(
  '/:bookingId/complete-consultation',
  authorize(['doctor', 'admin', 'hospital_admin']),
  validateRequest(bookingValidator.completeConsultation),
  BookingController.completeConsultation,
);

/**
 * 5. PATCH /bookings/:bookingId/approve-medical
 * Approve medical review (Admin/Hospital Admin)
 */
router.patch(
  '/:bookingId/approve-medical',
  authorize(['admin', 'hospital_admin']),
  validateRequest(bookingValidator.approveMedical),
  BookingController.approveMedical,
);

/**
 * 6. PATCH /bookings/:bookingId/reject-medical
 * Reject medical review (Admin/Hospital Admin)
 */
router.patch(
  '/:bookingId/reject-medical',
  authorize(['admin', 'hospital_admin']),
  validateRequest(bookingValidator.rejectMedical),
  BookingController.rejectMedical,
);

/**
 * 7. PATCH /bookings/:bookingId/payment
 * Process payment (Patient)
 */
router.patch(
  '/:bookingId/payment',
  authorize(['patient']),
  validateRequest(bookingValidator.processPayment),
  BookingController.processPayment,
);

/**
 * 8. PATCH /bookings/:bookingId/arrange-travel
 * Arrange travel (Admin/Hospital Admin)
 */
router.patch(
  '/:bookingId/arrange-travel',
  authorize(['admin', 'hospital_admin']),
  validateRequest(bookingValidator.arrangeTravel),
  BookingController.arrangeTravel,
);

/**
 * 9. PATCH /bookings/:bookingId/schedule-treatment
 * Schedule treatment (Doctor/Admin)
 */
router.patch(
  '/:bookingId/schedule-treatment',
  authorize(['doctor', 'admin', 'hospital_admin']),
  validateRequest(bookingValidator.scheduleTreatment),
  BookingController.scheduleTreatment,
);

/**
 * 10. PATCH /bookings/:bookingId/complete-treatment
 * Complete treatment (Doctor/Admin)
 */
router.patch(
  '/:bookingId/complete-treatment',
  authorize(['doctor', 'admin', 'hospital_admin']),
  validateRequest(bookingValidator.completeTreatment),
  BookingController.completeTreatment,
);

/**
 * 11. POST /bookings/:bookingId/feedback
 * Submit feedback (Patient)
 */
router.post(
  '/:bookingId/feedback',
  authorize(['patient']),
  validateRequest(bookingValidator.submitFeedback),
  BookingController.submitFeedback,
);

/**
 * 12. GET /bookings/:bookingId
 * Get booking details (All authenticated users)
 * Note: Move specific routes before generic parameter routes
 */
router.get('/patient/my-bookings', authorize(['patient']), BookingController.getPatientBookings);

router.get('/:bookingId', BookingController.getBooking);

/**
 * 13. GET /bookings
 * Get all bookings with pagination (Admin/Hospital Admin/Doctor)
 */
router.get('/', authorize(['admin', 'hospital_admin', 'doctor']), BookingController.getAllBookings);

/**
 * 15. PATCH /bookings/:bookingId/cancel
 * Cancel booking (Patient/Admin)
 */
router.patch(
  '/:bookingId/cancel',
  authorize(['patient', 'admin', 'hospital_admin']),
  validateRequest(bookingValidator.cancelBooking),
  BookingController.cancelBooking,
);

module.exports = router;

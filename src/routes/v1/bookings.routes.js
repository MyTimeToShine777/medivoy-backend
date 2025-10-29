const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create booking (patients)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['patient']),
  bookingController.createBooking,
);

// Get booking by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  bookingController.getBooking,
);

// Update booking (hospital admins, admin)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  bookingController.updateBooking,
);

// Update booking status (hospital admins, admin)
router.patch(
  '/:id/status',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  bookingController.updateBookingStatus,
);

// Get all bookings (admin, hospital admins)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  bookingController.getAllBookings,
);

// Get patient bookings (patients)
router.get(
  '/patient/:patientId',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'hospital_admin']),
  bookingController.getPatientBookings,
);

module.exports = router;
const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create booking (patients)
router.post(
  '/',
  auth,
  authorize(['patient']),
  bookingController.createBooking,
);

// Get booking by ID (authenticated users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  bookingController.getBooking,
);

// Update booking (hospital admins, admin)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'hospital_admin']),
  bookingController.updateBooking,
);

// Update booking status (hospital admins, admin)
router.patch(
  '/:id/status',
  auth,
  authorize(['admin', 'hospital_admin']),
  bookingController.updateBookingStatus,
);

// Get all bookings (admin, hospital admins)
router.get(
  '/',
  auth,
  authorize(['admin', 'hospital_admin']),
  bookingController.getAllBookings,
);

// Get patient bookings (patients)
router.get(

router.delete('/:id', authenticate, bookingController.delete);  '/patient/:patientId',
  auth,
  authorize(['admin', 'patient', 'hospital_admin']),
  bookingController.getPatientBookings,
);

module.exports = router;

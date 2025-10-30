// Delete booking
router.delete('/:id', authenticate, bookingController.delete);

// Get patient bookings (patients)
router.get(
  '/patient/:patientId',
  auth,
  authorize(['admin', 'patient', 'hospital_admin']),
  bookingController.getPatientBookings,
);

module.exports = router;
// Delete appointment
router.delete('/:id', auth, appointmentController.cancelAppointment);

// Get doctor appointments (doctors)
router.get(
  '/doctor/:doctorId',
  auth,
  authorize(['admin', 'doctor', 'hospital_admin']),
  appointmentController.getDoctorAppointments,
);

module.exports = router;
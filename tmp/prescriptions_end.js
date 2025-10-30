// Get all prescriptions for a patient (authenticated users)
router.get(
  '/patient/:patientId',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  prescriptionController.getPatientPrescriptions,
);

// Get all prescriptions (admin only)
router.get(
  '/',
  auth,
  authorize(['admin']),
  prescriptionController.getAllPrescriptions,
);

module.exports = router;
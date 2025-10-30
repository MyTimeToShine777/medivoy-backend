// Mark notification as read
router.patch(
  '/:id/read',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  notificationController.markAsRead,
);

// Get all notifications (admin only)
router.get(
  '/',
  auth,
  authorize(['admin']),
  notificationController.getAll,
);

module.exports = router;
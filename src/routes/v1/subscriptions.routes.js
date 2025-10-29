const express = require('express');
const subscriptionController = require('../../controllers/subscription.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create subscription (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  subscriptionController.createSubscription,
);

// Get subscription by ID (users can only access their own subscriptions)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  subscriptionController.getSubscription,
);

// Update subscription (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  subscriptionController.updateSubscription,
);

// Cancel subscription (users can only cancel their own subscriptions)
router.patch(
  '/:id/cancel',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  subscriptionController.cancelSubscription,
);

// Delete subscription (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  subscriptionController.deleteSubscription,
);

// Get all subscriptions for a user
router.get(
  '/user/:userId',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  subscriptionController.getUserSubscriptions,
);

module.exports = router;
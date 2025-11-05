const express = require('express');
const subscriptionController = require('../../controllers/subscription.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create subscription (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  subscriptionController.createSubscription
);

// Get subscription by ID (users can only access their own subscriptions)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  subscriptionController.getSubscription
);

// Update subscription (admin only)
router.put(
  '/:id',
  auth,
  authorize(['admin']),
  subscriptionController.updateSubscription
);

// Cancel subscription (users can only cancel their own subscriptions)
router.patch(
  '/:id/cancel',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  subscriptionController.cancelSubscription
);

// Delete subscription (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  subscriptionController.deleteSubscription
);

// Get all subscriptions for a user
router.get('/', auth, subscriptionController.getAll);

// Get all subscriptions for a user
router.get(
  '/user/:userId',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  subscriptionController.getUserSubscriptions
);

module.exports = router;

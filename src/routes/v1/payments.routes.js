const express = require('express');
const paymentController = require('../../controllers/payment.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create payment (patients, hospital admins, admin)
router.post(
  '/',
  auth,
  authorize(['admin', 'patient', 'hospital_admin']),
  paymentController.createPayment,
);

// Get payment by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  paymentController.getPayment,
);

// Update payment (admin only)
router.put(
  '/:id',
  auth,
  authorize(['admin']),
  paymentController.updatePayment,
);

// Delete payment (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  paymentController.deletePayment,
);

// Get all payments (admin, hospital admins)
router.get(
  '/',
  auth,
  authorize(['admin', 'hospital_admin']),
  paymentController.getAllPayments,
);

module.exports = router;

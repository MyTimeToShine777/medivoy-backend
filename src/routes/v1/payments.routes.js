const express = require('express');
const paymentController = require('../../controllers/payment.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create payment (patients, hospital admins, admin)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'hospital_admin']),
  paymentController.createPayment,
);

// Get payment by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  paymentController.getPayment,
);

// Update payment (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  paymentController.updatePayment,
);

// Delete payment (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  paymentController.deletePayment,
);

// Get all payments (admin, hospital admins)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  paymentController.getAllPayments,
);

module.exports = router;
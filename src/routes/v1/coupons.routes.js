const express = require('express');
const couponController = require('../../controllers/coupon.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create coupon (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  couponController.createCoupon,
);

// Get coupon by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  couponController.getCoupon,
);

// Get all coupons (authenticated users)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  couponController.getAllCoupons,
);

// Validate coupon (authenticated users)
router.get(
  '/validate/:code',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  couponController.validateCoupon,
);

// Apply coupon (patients, hospital admins, admin)
router.post(
  '/apply/:code',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'hospital_admin']),
  couponController.applyCoupon,
);

module.exports = router;
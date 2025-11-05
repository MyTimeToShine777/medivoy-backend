const express = require('express');
const couponController = require('../../controllers/coupon.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create coupon (admin only)
router.post('/', auth, authorize(['admin']), couponController.createCoupon);

// Get coupon by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  couponController.getCoupon
);

// Get all coupons (authd users)
router.get(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  couponController.getAllCoupons
);

// Validate coupon (authd users)
router.get(
  '/validate/:code',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  couponController.validateCoupon
);

// Apply coupon (patients, hospital admins, admin)
router.post(
  '/apply/:code',
  auth,
  authorize(['admin', 'patient', 'hospital_admin']),
  couponController.applyCoupon
);

// Delete coupon (admin only)
router.delete('/:id', auth, authorize('admin'), couponController.deleteCoupon);

module.exports = router;

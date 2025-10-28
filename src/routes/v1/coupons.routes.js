const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/coupon.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, authorize(['admin']), couponController.getAllCoupons);
router.post('/', authenticate, authorize(['admin']), couponController.createCoupon);
router.post('/validate', authenticate, couponController.validateCoupon);
router.post('/apply', authenticate, couponController.applyCoupon);
router.get('/:id', authenticate, authorize(['admin']), couponController.getCoupon);
router.put('/:id', authenticate, authorize(['admin']), couponController.updateCoupon);
router.delete('/:id', authenticate, authorize(['admin']), couponController.deleteCoupon);

module.exports = router;

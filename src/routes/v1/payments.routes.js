const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, authorize(['admin']), paymentController.getAllPayments);
router.post('/', authenticate, paymentController.createPayment);
router.get('/:id', authenticate, paymentController.getPayment);
router.post('/stripe', authenticate, paymentController.processStripePayment);
router.post('/razorpay', authenticate, paymentController.processRazorpayPayment);
router.post('/:id/refund', authenticate, authorize(['admin']), paymentController.refundPayment);
router.post('/:id/verify', authenticate, authorize(['admin']), paymentController.verifyPayment);

module.exports = router;

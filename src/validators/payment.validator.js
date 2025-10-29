const Joi = require('joi');

const createPaymentSchema = Joi.object({
  booking_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  payment_method: Joi.string().valid('stripe', 'razorpay', 'bank_transfer').required(),
});

const processStripePaymentSchema = Joi.object({
  booking_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  payment_method_id: Joi.string().required(),
});

const processRazorpayPaymentSchema = Joi.object({
  booking_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  razorpay_payment_id: Joi.string().required(),
});

const refundPaymentSchema = Joi.object({
  refundAmount: Joi.number().positive().required(),
  reason: Joi.string().required(),
});

module.exports = {
  createPaymentSchema,
  processStripePaymentSchema,
  processRazorpayPaymentSchema,
  refundPaymentSchema,
};

const Joi = require('joi');

const createCouponSchema = Joi.object({
  code: Joi.string().uppercase().min(3).max(20)
    .required(),
  discount_type: Joi.string().valid('percentage', 'fixed').required(),
  discount_value: Joi.number().positive().required(),
  min_amount: Joi.number().positive().optional(),
  max_discount: Joi.number().positive().optional(),
  max_uses: Joi.number().integer().positive().optional(),
  expiry_date: Joi.date().iso().optional(),
  is_active: Joi.boolean().optional(),
});

const updateCouponSchema = Joi.object({
  discount_type: Joi.string().valid('percentage', 'fixed').optional(),
  discount_value: Joi.number().positive().optional(),
  min_amount: Joi.number().positive().optional(),
  max_discount: Joi.number().positive().optional(),
  max_uses: Joi.number().integer().positive().optional(),
  expiry_date: Joi.date().iso().optional(),
  is_active: Joi.boolean().optional(),
});

const validateCouponSchema = Joi.object({
  code: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

const applyCouponSchema = Joi.object({
  code: Joi.string().required(),
});

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  applyCouponSchema,
};

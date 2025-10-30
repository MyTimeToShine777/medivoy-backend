const Joi = require("joi");

const createSubscriptionPlanSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().required(),
  plan_type: Joi.string().valid("monthly", "quarterly", "yearly").required(),
  price: Joi.number().precision(2).min(0).required(),
  currency: Joi.string().length(3).default("USD"),
  features: Joi.array().items(Joi.string()).default([]),
  max_bookings: Joi.number().integer().min(1).allow(null),
  max_appointments: Joi.number().integer().min(1).allow(null),
  discount_percentage: Joi.number().min(0).max(100).default(0),
  is_active: Joi.boolean().default(true),
  trial_days: Joi.number().integer().min(0).default(0),
});

const updateSubscriptionPlanSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string(),
  plan_type: Joi.string().valid("monthly", "quarterly", "yearly"),
  price: Joi.number().precision(2).min(0),
  currency: Joi.string().length(3),
  features: Joi.array().items(Joi.string()),
  max_bookings: Joi.number().integer().min(1).allow(null),
  max_appointments: Joi.number().integer().min(1).allow(null),
  discount_percentage: Joi.number().min(0).max(100),
  is_active: Joi.boolean(),
  trial_days: Joi.number().integer().min(0),
}).min(1);

const subscribeSchema = Joi.object({
  plan_id: Joi.number().integer().required(),
  payment_method: Joi.string().valid("stripe", "razorpay", "paypal").required(),
  auto_renew: Joi.boolean().default(true),
});

module.exports = {
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  subscribeSchema,
};

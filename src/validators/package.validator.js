const Joi = require("joi");

const createPackageSchema = Joi.object({
  name: Joi.string().max(200).required(),
  description: Joi.string().required(),
  treatment_id: Joi.number().integer().required(),
  hospital_id: Joi.number().integer().required(),
  duration_days: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).min(0).required(),
  inclusions: Joi.array().items(Joi.string()).default([]),
  exclusions: Joi.array().items(Joi.string()).default([]),
  accommodation_type: Joi.string().max(50).allow("", null),
  meals_included: Joi.boolean().default(false),
  airport_transfer: Joi.boolean().default(false),
  local_transport: Joi.boolean().default(false),
  interpreter_service: Joi.boolean().default(false),
  visa_assistance: Joi.boolean().default(false),
  max_bookings: Joi.number().integer().min(1).allow(null),
  is_active: Joi.boolean().default(true),
  valid_from: Joi.date().required(),
  valid_until: Joi.date().greater(Joi.ref("valid_from")).required(),
});

const updatePackageSchema = Joi.object({
  name: Joi.string().max(200),
  description: Joi.string(),
  treatment_id: Joi.number().integer(),
  hospital_id: Joi.number().integer(),
  duration_days: Joi.number().integer().min(1),
  price: Joi.number().precision(2).min(0),
  inclusions: Joi.array().items(Joi.string()),
  exclusions: Joi.array().items(Joi.string()),
  accommodation_type: Joi.string().max(50).allow("", null),
  meals_included: Joi.boolean(),
  airport_transfer: Joi.boolean(),
  local_transport: Joi.boolean(),
  interpreter_service: Joi.boolean(),
  visa_assistance: Joi.boolean(),
  max_bookings: Joi.number().integer().min(1).allow(null),
  is_active: Joi.boolean(),
  valid_from: Joi.date(),
  valid_until: Joi.date(),
}).min(1);

module.exports = {
  createPackageSchema,
  updatePackageSchema,
};

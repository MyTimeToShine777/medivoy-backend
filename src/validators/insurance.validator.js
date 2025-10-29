const Joi = require('joi');

const createInsuranceSchema = Joi.object({
  provider_name: Joi.string().max(200).required(),
  plan_name: Joi.string().max(200).required(),
  plan_type: Joi.string().valid('individual', 'family', 'group', 'corporate').required(),
  coverage_amount: Joi.number().precision(2).min(0).required(),
  premium_amount: Joi.number().precision(2).min(0).required(),
  deductible: Joi.number().precision(2).min(0).default(0),
  copay_percentage: Joi.number().min(0).max(100).default(0),
  coverage_details: Joi.string().allow('', null),
  exclusions: Joi.string().allow('', null),
  network_hospitals: Joi.array().items(Joi.number().integer()).default([]),
  is_active: Joi.boolean().default(true),
});

const updateInsuranceSchema = Joi.object({
  provider_name: Joi.string().max(200),
  plan_name: Joi.string().max(200),
  plan_type: Joi.string().valid('individual', 'family', 'group', 'corporate'),
  coverage_amount: Joi.number().precision(2).min(0),
  premium_amount: Joi.number().precision(2).min(0),
  deductible: Joi.number().precision(2).min(0),
  copay_percentage: Joi.number().min(0).max(100),
  coverage_details: Joi.string().allow('', null),
  exclusions: Joi.string().allow('', null),
  network_hospitals: Joi.array().items(Joi.number().integer()),
  is_active: Joi.boolean(),
}).min(1);

const checkCoverageSchema = Joi.object({
  insurance_id: Joi.number().integer().required(),
  treatment_id: Joi.number().integer().required(),
  hospital_id: Joi.number().integer().required(),
  estimated_cost: Joi.number().precision(2).min(0).required(),
});

module.exports = {
  createInsuranceSchema,
  updateInsuranceSchema,
  checkCoverageSchema,
};

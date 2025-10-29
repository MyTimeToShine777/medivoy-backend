const Joi = require('joi');

const createLaboratorySchema = Joi.object({
  name: Joi.string().max(200).required(),
  hospital_id: Joi.number().integer().required(),
  address: Joi.string().required(),
  city: Joi.string().max(100).required(),
  state: Joi.string().max(100).required(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(20).required(),
  phone: Joi.string().max(20).required(),
  email: Joi.string().email().max(100).required(),
  accreditation: Joi.string().max(100).allow('', null),
  certifications: Joi.array().items(Joi.string()).default([]),
  services: Joi.array().items(Joi.string()).default([]),
  operating_hours: Joi.object().default({}),
  is_active: Joi.boolean().default(true),
});

const updateLaboratorySchema = Joi.object({
  name: Joi.string().max(200),
  hospital_id: Joi.number().integer(),
  address: Joi.string(),
  city: Joi.string().max(100),
  state: Joi.string().max(100),
  country: Joi.string().max(100),
  postal_code: Joi.string().max(20),
  phone: Joi.string().max(20),
  email: Joi.string().email().max(100),
  accreditation: Joi.string().max(100).allow('', null),
  certifications: Joi.array().items(Joi.string()),
  services: Joi.array().items(Joi.string()),
  operating_hours: Joi.object(),
  is_active: Joi.boolean(),
}).min(1);

module.exports = {
  createLaboratorySchema,
  updateLaboratorySchema,
};

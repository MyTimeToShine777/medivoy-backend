const Joi = require('joi');

const createHospitalSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  postal_code: Joi.string().required(),
  phone: Joi.string().pattern(/^+?[1-9]d{1,14}$/).required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().optional(),
  established_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  bed_count: Joi.number().integer().min(0).optional(),
  specializations: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional()
});

const updateHospitalSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  phone: Joi.string().pattern(/^+?[1-9]d{1,14}$/).optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  established_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  bed_count: Joi.number().integer().min(0).optional(),
  specializations: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional()
});

const addDoctorSchema = Joi.object({
  doctorId: Joi.string().uuid().required()
});

const addTreatmentSchema = Joi.object({
  treatmentId: Joi.string().uuid().required()
});

module.exports = {
  createHospitalSchema,
  updateHospitalSchema,
  addDoctorSchema,
  addTreatmentSchema
};

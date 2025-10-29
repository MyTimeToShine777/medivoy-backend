const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('patient', 'doctor', 'hospital_admin', 'admin').required(),
  phone: Joi.string().pattern(/^\\+?[1-9]\\d{1,14}$/).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\\+?[1-9]\\d{1,14}$/).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
});

const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'suspended').required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
};

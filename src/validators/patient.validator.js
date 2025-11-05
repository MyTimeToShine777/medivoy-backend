const Joi = require('joi');

const createPatientSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  date_of_birth: Joi.date().max('now').required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  blood_group: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .allow(null),
  height: Joi.number().precision(2).min(0).allow(null),
  weight: Joi.number().precision(2).min(0).allow(null),
  medical_history: Joi.string().allow('', null),
  allergies: Joi.string().allow('', null),
  current_medications: Joi.string().allow('', null),
  emergency_contact_name: Joi.string().max(100).allow('', null),
  emergency_contact_phone: Joi.string().max(20).allow('', null),
  insurance_provider: Joi.string().max(100).allow('', null),
  insurance_policy_number: Joi.string().max(100).allow('', null),
});

const updatePatientSchema = Joi.object({
  date_of_birth: Joi.date().max('now'),
  gender: Joi.string().valid('male', 'female', 'other'),
  blood_group: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .allow(null),
  height: Joi.number().precision(2).min(0).allow(null),
  weight: Joi.number().precision(2).min(0).allow(null),
  medical_history: Joi.string().allow('', null),
  allergies: Joi.string().allow('', null),
  current_medications: Joi.string().allow('', null),
  emergency_contact_name: Joi.string().max(100).allow('', null),
  emergency_contact_phone: Joi.string().max(20).allow('', null),
  insurance_provider: Joi.string().max(100).allow('', null),
  insurance_policy_number: Joi.string().max(100).allow('', null),
}).min(1);

const medicalHistorySchema = Joi.object({
  condition: Joi.string().required(),
  diagnosed_date: Joi.date().max('now').required(),
  treatment: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  medicalHistorySchema,
};

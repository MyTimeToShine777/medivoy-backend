const Joi = require('joi');

const createMedicalRecordSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
  doctor_id: Joi.number().integer().allow(null),
  appointment_id: Joi.number().integer().allow(null),
  record_type: Joi.string().valid('consultation', 'lab_result', 'imaging', 'prescription', 'discharge_summary', 'other').required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().allow('', null),
  file_url: Joi.string().uri().allow('', null),
  file_type: Joi.string().max(50).allow('', null),
  file_size: Joi.number().integer().min(0).allow(null),
  record_date: Joi.date().default(Date.now),
  is_confidential: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).default([]),
});

const updateMedicalRecordSchema = Joi.object({
  record_type: Joi.string().valid('consultation', 'lab_result', 'imaging', 'prescription', 'discharge_summary', 'other'),
  title: Joi.string().max(200),
  description: Joi.string().allow('', null),
  file_url: Joi.string().uri().allow('', null),
  file_type: Joi.string().max(50).allow('', null),
  file_size: Joi.number().integer().min(0).allow(null),
  record_date: Joi.date(),
  is_confidential: Joi.boolean(),
  tags: Joi.array().items(Joi.string()),
}).min(1);

module.exports = {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
};

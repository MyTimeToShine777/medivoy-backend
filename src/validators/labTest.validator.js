const Joi = require("joi");

const createLabTestSchema = Joi.object({
  laboratory_id: Joi.number().integer().required(),
  patient_id: Joi.number().integer().required(),
  doctor_id: Joi.number().integer().allow(null),
  test_name: Joi.string().max(200).required(),
  test_type: Joi.string().max(100).required(),
  test_date: Joi.date().required(),
  status: Joi.string()
    .valid("pending", "in_progress", "completed", "cancelled")
    .default("pending"),
  results: Joi.string().allow("", null),
  result_file_url: Joi.string().uri().allow("", null),
  notes: Joi.string().allow("", null),
  cost: Joi.number().precision(2).min(0).required(),
});

const updateLabTestSchema = Joi.object({
  laboratory_id: Joi.number().integer(),
  patient_id: Joi.number().integer(),
  doctor_id: Joi.number().integer().allow(null),
  test_name: Joi.string().max(200),
  test_type: Joi.string().max(100),
  test_date: Joi.date(),
  status: Joi.string().valid(
    "pending",
    "in_progress",
    "completed",
    "cancelled",
  ),
  results: Joi.string().allow("", null),
  result_file_url: Joi.string().uri().allow("", null),
  notes: Joi.string().allow("", null),
  cost: Joi.number().precision(2).min(0),
}).min(1);

const updateResultsSchema = Joi.object({
  results: Joi.string().required(),
  result_file_url: Joi.string().uri().allow("", null),
  notes: Joi.string().allow("", null),
});

module.exports = {
  createLabTestSchema,
  updateLabTestSchema,
  updateResultsSchema,
};

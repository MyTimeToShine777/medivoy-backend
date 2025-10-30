const Joi = require("joi");

const createPrescriptionSchema = Joi.object({
  appointment_id: Joi.number().integer().required(),
  patient_id: Joi.number().integer().required(),
  doctor_id: Joi.number().integer().required(),
  diagnosis: Joi.string().required(),
  medications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().required(),
        duration: Joi.string().required(),
        instructions: Joi.string().allow("", null),
      }),
    )
    .min(1)
    .required(),
  lab_tests: Joi.array().items(Joi.string()).default([]),
  follow_up_date: Joi.date().greater("now").allow(null),
  notes: Joi.string().allow("", null),
});

const updatePrescriptionSchema = Joi.object({
  diagnosis: Joi.string(),
  medications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().required(),
        duration: Joi.string().required(),
        instructions: Joi.string().allow("", null),
      }),
    )
    .min(1),
  lab_tests: Joi.array().items(Joi.string()),
  follow_up_date: Joi.date().greater("now").allow(null),
  notes: Joi.string().allow("", null),
}).min(1);

const medicationSchema = Joi.object({
  name: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  duration: Joi.string().required(),
  instructions: Joi.string().allow("", null),
});

module.exports = {
  createPrescriptionSchema,
  updatePrescriptionSchema,
  medicationSchema,
};

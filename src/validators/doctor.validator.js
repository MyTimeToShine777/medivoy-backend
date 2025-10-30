const Joi = require("joi");

const createDoctorSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  specialty: Joi.string().max(100).required(),
  qualification: Joi.string().max(255).required(),
  experience_years: Joi.number().integer().min(0).required(),
  license_number: Joi.string().max(100).required(),
  consultation_fee: Joi.number().precision(2).min(0).required(),
  bio: Joi.string().allow("", null),
  languages: Joi.array().items(Joi.string()).default([]),
  availability: Joi.object().default({}),
  is_verified: Joi.boolean().default(false),
  rating: Joi.number().min(0).max(5).default(0),
  total_reviews: Joi.number().integer().min(0).default(0),
});

const updateDoctorSchema = Joi.object({
  specialty: Joi.string().max(100),
  qualification: Joi.string().max(255),
  experience_years: Joi.number().integer().min(0),
  license_number: Joi.string().max(100),
  consultation_fee: Joi.number().precision(2).min(0),
  bio: Joi.string().allow("", null),
  languages: Joi.array().items(Joi.string()),
  availability: Joi.object(),
  is_verified: Joi.boolean(),
  rating: Joi.number().min(0).max(5),
  total_reviews: Joi.number().integer().min(0),
}).min(1);

const availabilitySchema = Joi.object({
  day: Joi.string()
    .valid(
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    )
    .required(),
  slots: Joi.array()
    .items(
      Joi.object({
        start_time: Joi.string()
          .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        end_time: Joi.string()
          .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
      }),
    )
    .required(),
});

module.exports = {
  createDoctorSchema,
  updateDoctorSchema,
  availabilitySchema,
};

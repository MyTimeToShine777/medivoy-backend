const Joi = require('joi');

const createBookingSchema = Joi.object({
  patient_id: Joi.string().uuid().required(),
  hospital_id: Joi.string().uuid().required(),
  treatment_id: Joi.string().uuid().required(),
  preferred_date: Joi.date().iso().required(),
  notes: Joi.string().optional(),
  medical_details: Joi.object().optional()
});

const updateBookingSchema = Joi.object({
  preferred_date: Joi.date().iso().optional(),
  notes: Joi.string().optional(),
  medical_details: Joi.object().optional()
});

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid(
    'requested', 'under_review', 'accepted', 'rejected',
    'awaiting_medical_details', 'quotation_sent', 'confirmed',
    'payment_completed', 'invoice_sent', 'travel_arrangement',
    'in_treatment', 'completed', 'feedback_received'
  ).required(),
  notes: Joi.string().optional()
});

const cancelBookingSchema = Joi.object({
  reason: Joi.string().required()
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
  cancelBookingSchema
};

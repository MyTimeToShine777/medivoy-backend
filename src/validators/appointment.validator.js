const Joi = require('joi');

const createAppointmentSchema = Joi.object({
  patient_id: Joi.string().uuid().required(),
  doctor_id: Joi.string().uuid().required(),
  appointment_date: Joi.date().iso().required(),
  appointment_time: Joi.string()
    .pattern(/^([01]d|2[0-3]):([0-5]d)$/)
    .required(),
  type: Joi.string().valid('consultation', 'follow_up', 'emergency').required(),
  notes: Joi.string().optional(),
});

const updateAppointmentSchema = Joi.object({
  appointment_date: Joi.date().iso().optional(),
  appointment_time: Joi.string()
    .pattern(/^([01]d|2[0-3]):([0-5]d)$/)
    .optional(),
  type: Joi.string().valid('consultation', 'follow_up', 'emergency').optional(),
  notes: Joi.string().optional(),
});

const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      'requested',
      'confirmed',
      'awaiting_consultation',
      'in_progress',
      'prescription_provided',
      'follow_up_scheduled',
      'completed',
      'cancelled'
    )
    .required(),
  notes: Joi.string().optional(),
});

const rescheduleAppointmentSchema = Joi.object({
  newDate: Joi.date().iso().required(),
  newTime: Joi.string()
    .pattern(/^([01]d|2[0-3]):([0-5]d)$/)
    .required(),
});

const cancelAppointmentSchema = Joi.object({
  reason: Joi.string().required(),
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
  cancelAppointmentSchema,
};

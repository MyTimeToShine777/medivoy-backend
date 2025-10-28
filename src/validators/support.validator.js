const Joi = require('joi');

const createTicketSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  subject: Joi.string().max(200).required(),
  description: Joi.string().required(),
  category: Joi.string().valid('technical', 'billing', 'booking', 'medical', 'general', 'complaint').required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  attachments: Joi.array().items(Joi.string().uri()).default([])
});

const updateTicketSchema = Joi.object({
  subject: Joi.string().max(200),
  description: Joi.string(),
  category: Joi.string().valid('technical', 'billing', 'booking', 'medical', 'general', 'complaint'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  status: Joi.string().valid('open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed'),
  assigned_to: Joi.number().integer().allow(null)
}).min(1);

const addReplySchema = Joi.object({
  message: Joi.string().required(),
  attachments: Joi.array().items(Joi.string().uri()).default([]),
  is_internal: Joi.boolean().default(false)
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  addReplySchema
};
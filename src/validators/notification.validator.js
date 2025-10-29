const Joi = require('joi');

const createNotificationSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  title: Joi.string().max(200).required(),
  message: Joi.string().required(),
  type: Joi.string().valid('info', 'success', 'warning', 'error', 'booking', 'appointment', 'payment', 'system').required(),
  channel: Joi.string().valid('in_app', 'email', 'sms', 'push').default('in_app'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  data: Joi.object().default({}),
  action_url: Joi.string().uri().allow('', null),
});

const sendBulkNotificationSchema = Joi.object({
  user_ids: Joi.array().items(Joi.number().integer()).min(1).required(),
  title: Joi.string().max(200).required(),
  message: Joi.string().required(),
  type: Joi.string().valid('info', 'success', 'warning', 'error', 'booking', 'appointment', 'payment', 'system').required(),
  channel: Joi.string().valid('in_app', 'email', 'sms', 'push').default('in_app'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  data: Joi.object().default({}),
  action_url: Joi.string().uri().allow('', null),
});

const markAsReadSchema = Joi.object({
  notification_ids: Joi.array().items(Joi.number().integer()).min(1).required(),
});

module.exports = {
  createNotificationSchema,
  sendBulkNotificationSchema,
  markAsReadSchema,
};

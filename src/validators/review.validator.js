const Joi = require('joi');

const createReviewSchema = Joi.object({
  reviewable_type: Joi.string().valid('Hospital', 'Doctor').required(),
  reviewable_id: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(10).max(1000).required(),
  booking_id: Joi.string().uuid().optional()
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().min(10).max(1000).optional()
});

const rejectReviewSchema = Joi.object({
  reason: Joi.string().required()
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  rejectReviewSchema
};

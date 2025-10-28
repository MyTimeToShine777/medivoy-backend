const Joi = require('joi');

const createTreatmentSchema = Joi.object({
  name: Joi.string().max(200).required(),
  description: Joi.string().required(),
  category_id: Joi.number().integer().required(),
  subcategory_id: Joi.number().integer().allow(null),
  duration_days: Joi.number().integer().min(1).required(),
  base_price: Joi.number().precision(2).min(0).required(),
  success_rate: Joi.number().min(0).max(100).allow(null),
  recovery_time_days: Joi.number().integer().min(0).allow(null),
  requirements: Joi.string().allow('', null),
  side_effects: Joi.string().allow('', null),
  is_active: Joi.boolean().default(true),
  seo_title: Joi.string().max(255).allow('', null),
  seo_description: Joi.string().allow('', null),
  seo_keywords: Joi.string().allow('', null)
});

const updateTreatmentSchema = Joi.object({
  name: Joi.string().max(200),
  description: Joi.string(),
  category_id: Joi.number().integer(),
  subcategory_id: Joi.number().integer().allow(null),
  duration_days: Joi.number().integer().min(1),
  base_price: Joi.number().precision(2).min(0),
  success_rate: Joi.number().min(0).max(100).allow(null),
  recovery_time_days: Joi.number().integer().min(0).allow(null),
  requirements: Joi.string().allow('', null),
  side_effects: Joi.string().allow('', null),
  is_active: Joi.boolean(),
  seo_title: Joi.string().max(255).allow('', null),
  seo_description: Joi.string().allow('', null),
  seo_keywords: Joi.string().allow('', null)
}).min(1);

const categorySchema = Joi.object({
  name: Joi.string().max(100).required(),
  slug: Joi.string().max(150).required(),
  description: Joi.string().allow('', null),
  icon: Joi.string().max(255).allow('', null),
  sort_order: Joi.number().integer().default(0),
  is_active: Joi.boolean().default(true)
});

const subcategorySchema = Joi.object({
  category_id: Joi.number().integer().required(),
  name: Joi.string().max(100).required(),
  slug: Joi.string().max(150).required(),
  description: Joi.string().allow('', null),
  icon: Joi.string().max(255).allow('', null),
  sort_order: Joi.number().integer().default(0),
  is_active: Joi.boolean().default(true)
});

module.exports = {
  createTreatmentSchema,
  updateTreatmentSchema,
  categorySchema,
  subcategorySchema
};
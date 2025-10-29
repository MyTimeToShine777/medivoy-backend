const Joi = require('joi');

const createInvoiceSchema = Joi.object({
  booking_id: Joi.number().integer().required(),
  patient_id: Joi.number().integer().required(),
  hospital_id: Joi.number().integer().required(),
  invoice_number: Joi.string().max(50).required(),
  invoice_date: Joi.date().default(Date.now),
  due_date: Joi.date().greater(Joi.ref('invoice_date')).required(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      unit_price: Joi.number().precision(2).min(0).required(),
      amount: Joi.number().precision(2).min(0).required(),
    }),
  ).min(1).required(),
  subtotal: Joi.number().precision(2).min(0).required(),
  tax_amount: Joi.number().precision(2).min(0).default(0),
  discount_amount: Joi.number().precision(2).min(0).default(0),
  total_amount: Joi.number().precision(2).min(0).required(),
  currency: Joi.string().length(3).default('USD'),
  status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').default('draft'),
  notes: Joi.string().allow('', null),
});

const updateInvoiceSchema = Joi.object({
  due_date: Joi.date(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      unit_price: Joi.number().precision(2).min(0).required(),
      amount: Joi.number().precision(2).min(0).required(),
    }),
  ).min(1),
  subtotal: Joi.number().precision(2).min(0),
  tax_amount: Joi.number().precision(2).min(0),
  discount_amount: Joi.number().precision(2).min(0),
  total_amount: Joi.number().precision(2).min(0),
  status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled'),
  notes: Joi.string().allow('', null),
}).min(1);

const invoiceItemSchema = Joi.object({
  description: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  unit_price: Joi.number().precision(2).min(0).required(),
  amount: Joi.number().precision(2).min(0).required(),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceItemSchema,
};

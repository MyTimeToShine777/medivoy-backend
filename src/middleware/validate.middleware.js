const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/error-handler');

/**
 * Validation middleware - Check express-validator results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    throw new ValidationError('Validation failed', formattedErrors);
  }

  next();
};

/**
 * Joi validation middleware
 * @param {Object} schema - Joi schema
 * @param {String} property - Property to validate (body, query, params)
 */
const validateJoi =
  (schema, property = 'body') =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type,
      }));

      const validationError = new ValidationError('Validation failed');
      validationError.errors = formattedErrors;

      return next(validationError);
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };

/**
 * Helper to apply express-validator chains and then the validation result checker
 * Accepts an array of validator middlewares (or a single middleware) and returns
 * a composed middleware array that runs the validators first then the `validate` checker.
 */
const validateRequest = (validators) => {
  if (!validators) return validate;
  // allow either a single middleware or an array of middlewares
  const arr = Array.isArray(validators) ? validators : [validators];
  return [...arr, validate];
};

module.exports = {
  validate,
  validateJoi,
  validateRequest,
};

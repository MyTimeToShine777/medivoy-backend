const Joi = require('joi');
const { validateJoi } = require('../middleware/validate.middleware');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character'),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('patient', 'doctor', 'hospital_admin').required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
});

const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  date_of_birth: Joi.date().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string().optional(),
});

const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  register: validateJoi(registerSchema, 'body'),
  login: validateJoi(loginSchema, 'body'),
  forgotPassword: validateJoi(forgotPasswordSchema, 'body'),
  resetPassword: validateJoi(resetPasswordSchema, 'body'),
  changePassword: validateJoi(changePasswordSchema, 'body'),
  updateProfile: validateJoi(updateProfileSchema, 'body'),
  refresh: validateJoi(refreshSchema, 'body'),
  verifyEmail: validateJoi(verifyEmailSchema, 'body'),
  resendVerification: validateJoi(resendVerificationSchema, 'body'),
};

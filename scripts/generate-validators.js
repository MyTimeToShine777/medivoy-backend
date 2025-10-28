const fs = require('fs');
const path = require('path');

const validatorsDir = path.join(__dirname, '../src/validators');

// Ensure validators directory exists
if (!fs.existsSync(validatorsDir)) {
  fs.mkdirSync(validatorsDir, { recursive: true });
}

const validators = [
  {
    name: 'auth.validator.js',
    content: `const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character'),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('patient', 'doctor', 'hospital_admin').required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
};
`
  },
  {
    name: 'user.validator.js',
    content: `const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('patient', 'doctor', 'hospital_admin', 'admin').required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional()
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional()
});

const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'suspended').required()
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema
};
`
  },
  {
    name: 'hospital.validator.js',
    content: `const Joi = require('joi');

const createHospitalSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  postal_code: Joi.string().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().optional(),
  established_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  bed_count: Joi.number().integer().min(0).optional(),
  specializations: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional()
});

const updateHospitalSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  established_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  bed_count: Joi.number().integer().min(0).optional(),
  specializations: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional()
});

const addDoctorSchema = Joi.object({
  doctorId: Joi.string().uuid().required()
});

const addTreatmentSchema = Joi.object({
  treatmentId: Joi.string().uuid().required()
});

module.exports = {
  createHospitalSchema,
  updateHospitalSchema,
  addDoctorSchema,
  addTreatmentSchema
};
`
  },
  {
    name: 'booking.validator.js',
    content: `const Joi = require('joi');

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
`
  },
  {
    name: 'appointment.validator.js',
    content: `const Joi = require('joi');

const createAppointmentSchema = Joi.object({
  patient_id: Joi.string().uuid().required(),
  doctor_id: Joi.string().uuid().required(),
  appointment_date: Joi.date().iso().required(),
  appointment_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  type: Joi.string().valid('consultation', 'follow_up', 'emergency').required(),
  notes: Joi.string().optional()
});

const updateAppointmentSchema = Joi.object({
  appointment_date: Joi.date().iso().optional(),
  appointment_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  type: Joi.string().valid('consultation', 'follow_up', 'emergency').optional(),
  notes: Joi.string().optional()
});

const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string().valid(
    'requested', 'confirmed', 'awaiting_consultation',
    'in_progress', 'prescription_provided', 'follow_up_scheduled',
    'completed', 'cancelled'
  ).required(),
  notes: Joi.string().optional()
});

const rescheduleAppointmentSchema = Joi.object({
  newDate: Joi.date().iso().required(),
  newTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required()
});

const cancelAppointmentSchema = Joi.object({
  reason: Joi.string().required()
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
  cancelAppointmentSchema
};
`
  },
  {
    name: 'payment.validator.js',
    content: `const Joi = require('joi');

const createPaymentSchema = Joi.object({
  booking_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  payment_method: Joi.string().valid('stripe', 'razorpay', 'bank_transfer').required()
});

const processStripePaymentSchema = Joi.object({
  booking_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  payment_method_id: Joi.string().required()
});

const processRazorpayPaymentSchema = Joi.object({
  booking_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  razorpay_payment_id: Joi.string().required()
});

const refundPaymentSchema = Joi.object({
  refundAmount: Joi.number().positive().required(),
  reason: Joi.string().required()
});

module.exports = {
  createPaymentSchema,
  processStripePaymentSchema,
  processRazorpayPaymentSchema,
  refundPaymentSchema
};
`
  },
  {
    name: 'review.validator.js',
    content: `const Joi = require('joi');

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
`
  },
  {
    name: 'coupon.validator.js',
    content: `const Joi = require('joi');

const createCouponSchema = Joi.object({
  code: Joi.string().uppercase().min(3).max(20).required(),
  discount_type: Joi.string().valid('percentage', 'fixed').required(),
  discount_value: Joi.number().positive().required(),
  min_amount: Joi.number().positive().optional(),
  max_discount: Joi.number().positive().optional(),
  max_uses: Joi.number().integer().positive().optional(),
  expiry_date: Joi.date().iso().optional(),
  is_active: Joi.boolean().optional()
});

const updateCouponSchema = Joi.object({
  discount_type: Joi.string().valid('percentage', 'fixed').optional(),
  discount_value: Joi.number().positive().optional(),
  min_amount: Joi.number().positive().optional(),
  max_discount: Joi.number().positive().optional(),
  max_uses: Joi.number().integer().positive().optional(),
  expiry_date: Joi.date().iso().optional(),
  is_active: Joi.boolean().optional()
});

const validateCouponSchema = Joi.object({
  code: Joi.string().required(),
  amount: Joi.number().positive().required()
});

const applyCouponSchema = Joi.object({
  code: Joi.string().required()
});

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  applyCouponSchema
};
`
  }
];

// Generate all validator files
validators.forEach(validator => {
  const filePath = path.join(validatorsDir, validator.name);
  fs.writeFileSync(filePath, validator.content);
  console.log(`✓ Created ${validator.name}`);
});

console.log(`\n✓ Successfully generated ${validators.length} validator files!`);
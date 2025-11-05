/**
 * Validators index
 * Aggregates individual validator modules so callers can require('../validators')
 */

const bookingValidator = require('./booking.validator');
const authValidator = require('./auth.validator');
const userValidator = require('./user.validator');
const treatmentValidator = require('./treatment.validator');
const supportValidator = require('./support.validator');
const subscriptionValidator = require('./subscription.validator');
const reviewValidator = require('./review.validator');
const prescriptionValidator = require('./prescription.validator');
const paymentValidator = require('./payment.validator');
const patientValidator = require('./patient.validator');
const packageValidator = require('./package.validator');
const notificationValidator = require('./notification.validator');
const medicalRecordValidator = require('./medicalRecord.validator');
const labTestValidator = require('./labTest.validator');
const laboratoryValidator = require('./laboratory.validator');
const invoiceValidator = require('./invoice.validator');
const insuranceValidator = require('./insurance.validator');
const hospitalValidator = require('./hospital.validator');
const doctorValidator = require('./doctor.validator');
const couponValidator = require('./coupon.validator');
const appointmentValidator = require('./appointment.validator');

module.exports = {
  bookingValidator,
  authValidator,
  userValidator,
  treatmentValidator,
  supportValidator,
  subscriptionValidator,
  reviewValidator,
  prescriptionValidator,
  paymentValidator,
  patientValidator,
  packageValidator,
  notificationValidator,
  medicalRecordValidator,
  labTestValidator,
  laboratoryValidator,
  invoiceValidator,
  insuranceValidator,
  hospitalValidator,
  doctorValidator,
  couponValidator,
  appointmentValidator,
};

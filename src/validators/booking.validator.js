/**
 * Booking Request Validators - COMPLETE
 * Comprehensive validation for all booking endpoints
 * Status: Production-Ready
 */

const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }
    next();
};

const createBooking = [
    body('treatmentId')
    .isUUID()
    .withMessage('Invalid treatment ID'),
    body('hospitalId')
    .isUUID()
    .withMessage('Invalid hospital ID'),
    body('medicalHistory')
    .optional()
    .isString()
    .trim()
    .withMessage('Medical history must be a string'),
    body('allergies')
    .optional()
    .isString()
    .trim()
    .withMessage('Allergies must be a string'),
    body('currentMedications')
    .optional()
    .isArray()
    .withMessage('Current medications must be an array'),
    handleValidationErrors,
];

const assignCoordinator = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('coordinatorId')
    .isUUID()
    .withMessage('Invalid coordinator ID'),
    handleValidationErrors,
];

const scheduleConsultation = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('consultationDate')
    .isISO8601()
    .withMessage('Invalid consultation date'),
    body('doctorId')
    .isUUID()
    .withMessage('Invalid doctor ID'),
    handleValidationErrors,
];

const completeConsultation = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('notes')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Consultation notes are required'),
    handleValidationErrors,
];

const approveMedical = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('estimatedCost')
    .isFloat({ min: 0 })
    .withMessage('Estimated cost must be a positive number'),
    body('notes')
    .optional()
    .isString()
    .trim(),
    handleValidationErrors,
];

const rejectMedical = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('rejectionReason')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Rejection reason is required'),
    handleValidationErrors,
];

const processPayment = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
    body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'bank_transfer', 'wallet', 'insurance'])
    .withMessage('Invalid payment method'),
    body('paymentReference')
    .optional()
    .isString()
    .trim(),
    handleValidationErrors,
];

const arrangeTravel = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('departureDate')
    .isISO8601()
    .withMessage('Invalid departure date'),
    body('returnDate')
    .isISO8601()
    .withMessage('Invalid return date'),
    handleValidationErrors,
];

const scheduleTreatment = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('treatmentDate')
    .isISO8601()
    .withMessage('Invalid treatment date'),
    body('location')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Treatment location is required'),
    body('treatmentTime')
    .optional()
    .isString(),
    body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
    handleValidationErrors,
];

const completeTreatment = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('medicalOutcome')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Medical outcome is required'),
    handleValidationErrors,
];

const submitFeedback = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('ratings')
    .isObject()
    .withMessage('Ratings must be an object'),
    body('ratings.medical')
    .isInt({ min: 1, max: 5 })
    .withMessage('Medical rating must be between 1-5'),
    body('ratings.facility')
    .isInt({ min: 1, max: 5 })
    .withMessage('Facility rating must be between 1-5'),
    body('ratings.staff')
    .isInt({ min: 1, max: 5 })
    .withMessage('Staff rating must be between 1-5'),
    body('feedback')
    .optional()
    .isString()
    .trim(),
    handleValidationErrors,
];

const cancelBooking = [
    param('bookingId')
    .isUUID()
    .withMessage('Invalid booking ID'),
    body('reason')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Cancellation reason is required'),
    handleValidationErrors,
];

module.exports = {
    createBooking,
    assignCoordinator,
    scheduleConsultation,
    completeConsultation,
    approveMedical,
    rejectMedical,
    processPayment,
    arrangeTravel,
    scheduleTreatment,
    completeTreatment,
    submitFeedback,
    cancelBooking,
};
'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS INDEX - PRODUCTION READY
// ALL CONSTANTS - NO OPTIONAL CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

// BOOKING STATUSES
export const BOOKING_STATUSES = {
    PENDING: 'pending',
    EXPERT_REVIEW: 'expert_review',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
};

// BOOKING WORKFLOW STEPS
export const BOOKING_WORKFLOW_STEPS = {
    TREATMENT_SELECTION: 1,
    COUNTRY_SELECTION: 2,
    CITY_SELECTION: 3,
    HOSPITAL_SELECTION: 4,
    PACKAGE_SELECTION: 5,
    ADDON_SELECTION: 6,
    REVIEW_AND_SUBMIT: 7
};

// BOOKING STEP LABELS
export const BOOKING_STEP_LABELS = {
    1: 'Treatment Selection',
    2: 'Country Selection',
    3: 'City Selection',
    4: 'Hospital Selection',
    5: 'Package Selection',
    6: 'Add-ons Selection',
    7: 'Review & Submit'
};

// BOOKING STEP DESCRIPTIONS
export const BOOKING_STEP_DESCRIPTIONS = {
    1: 'Select the treatment you want',
    2: 'Choose the destination country',
    3: 'Pick your preferred city',
    4: 'Select a hospital',
    5: 'Choose a package',
    6: 'Add optional services',
    7: 'Review and submit your booking'
};

// COST ESTIMATION CONFIG
export const COST_ESTIMATION_CONFIG = {
    BASE_PRICE_MULTIPLIER: 1.0,
    TAX_PERCENTAGE: 10,
    PLATFORM_FEE_PERCENTAGE: 5,
    CURRENCY_BUFFER: 1.02
};

// APPOINTMENT STATUSES
export const APPOINTMENT_STATUSES = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
    RESCHEDULED: 'rescheduled'
};

// APPOINTMENT TYPES
export const APPOINTMENT_TYPES = {
    CONSULTATION: 'consultation',
    FOLLOW_UP: 'follow_up',
    CHECKUP: 'checkup',
    PROCEDURE: 'procedure',
    LAB_TEST: 'lab_test',
    VIDEO_CALL: 'video_call'
};

// PAYMENT STATUSES
export const PAYMENT_STATUSES = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
};

// PAYMENT METHODS
export const PAYMENT_METHODS = {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    NET_BANKING: 'net_banking',
    UPI: 'upi',
    WALLET: 'wallet',
    CASH: 'cash'
};

// USER ROLES
export const USER_ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    STAFF: 'staff',
    NURSE: 'nurse',
    RECEPTIONIST: 'receptionist',
    LAB_TECHNICIAN: 'lab_technician'
};

// USER STATUS
export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    DEACTIVATED: 'deactivated',
    PENDING_VERIFICATION: 'pending_verification'
};

// HTTP STATUS
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

// ERROR CODES
export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    CACHE_ERROR: 'CACHE_ERROR',
    FILE_ERROR: 'FILE_ERROR',
    PAYMENT_ERROR: 'PAYMENT_ERROR',
    EMAIL_ERROR: 'EMAIL_ERROR',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    USER_EXISTS: 'USER_EXISTS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USER_INACTIVE: 'USER_INACTIVE',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    BAD_REQUEST: 'BAD_REQUEST',
    GATEWAY_ERROR: 'GATEWAY_ERROR',
    INVALID_SIGNATURE: 'INVALID_SIGNATURE'
};

// CACHE KEYS
export const CACHE_KEYS = {
    USER_PROFILE: 'user_profile_',
    USER_ROLE: 'user_role_',
    USER_PERMISSIONS: 'user_permissions_',
    APPOINTMENTS: 'appointments_',
    PRESCRIPTIONS: 'prescriptions_',
    BOOKINGS: 'bookings_',
    SETTINGS: 'settings_'
};

// MESSAGES
export const MESSAGES = {
    SUCCESS: 'Operation successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error'
};

// NOTIFICATION TYPES
export const NOTIFICATION_TYPES = {
    APPOINTMENT: 'appointment',
    PRESCRIPTION: 'prescription',
    LAB_RESULT: 'lab_result',
    PAYMENT: 'payment',
    BOOKING: 'booking',
    SYSTEM: 'system',
    REMINDER: 'reminder'
};

// NOTIFICATION STATUS
export const NOTIFICATION_STATUS = {
    UNREAD: 'unread',
    READ: 'read',
    ARCHIVED: 'archived',
    DELETED: 'deleted'
};

// GENDER
export const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
    PREFER_NOT_TO_SAY: 'prefer_not_to_say'
};

// BLOOD GROUPS
export const BLOOD_GROUPS = {
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-'
};

// MARITAL STATUS
export const MARITAL_STATUS = {
    SINGLE: 'single',
    MARRIED: 'married',
    DIVORCED: 'divorced',
    WIDOWED: 'widowed',
    SEPARATED: 'separated'
};

// BOOKING STATUS LABELS
export const BOOKING_STATUS_LABELS = {
    pending: 'Pending Payment',
    expert_review: 'Under Expert Review',
    confirmed: 'Confirmed',
    in_progress: 'Treatment In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
};

// BOOKING STATUS DESCRIPTIONS
export const BOOKING_STATUS_DESCRIPTIONS = {
    pending: 'Booking created, awaiting payment',
    expert_review: 'Payment received, under expert medical review',
    confirmed: 'Expert review completed, booking confirmed',
    in_progress: 'Patient treatment has started',
    completed: 'Treatment completed successfully',
    cancelled: 'Booking has been cancelled',
    refunded: 'Payment has been refunded'
};

// BOOKING STATUS COLORS
export const BOOKING_STATUS_COLORS = {
    pending: '#FFA500',
    expert_review: '#1E90FF',
    confirmed: '#32CD32',
    in_progress: '#9370DB',
    completed: '#228B22',
    cancelled: '#DC143C',
    refunded: '#808080'
};

// BOOKING STATUS TRANSITIONS
export const BOOKING_STATUS_TRANSITIONS = {
    pending: ['expert_review', 'cancelled'],
    expert_review: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: ['refunded'],
    cancelled: ['refunded'],
    refunded: []
};

// CANCELLABLE STATUSES
export const CANCELLABLE_STATUSES = ['pending', 'expert_review', 'confirmed'];

// REFUNDABLE STATUSES
export const REFUNDABLE_STATUSES = ['cancelled', 'completed'];

// EDITABLE STATUSES
export const EDITABLE_STATUSES = ['pending'];

// FINAL STATUSES
export const FINAL_STATUSES = ['completed', 'refunded'];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const getStatusLabel = (status) => {
    return BOOKING_STATUS_LABELS[status] || status;
};

export const getStatusDescription = (status) => {
    return BOOKING_STATUS_DESCRIPTIONS[status] || '';
};

export const getStatusColor = (status) => {
    return BOOKING_STATUS_COLORS[status] || '#000000';
};

export const canCancelBooking = (status) => {
    return CANCELLABLE_STATUSES.includes(status);
};

export const canRefundBooking = (status) => {
    return REFUNDABLE_STATUSES.includes(status);
};

export const canEditBooking = (status) => {
    return EDITABLE_STATUSES.includes(status);
};

export const isFinalStatus = (status) => {
    return FINAL_STATUSES.includes(status);
};

export const canTransitionTo = (currentStatus, newStatus) => {
    const allowedTransitions = BOOKING_STATUS_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
};

export const isValidBookingStatus = (status) => {
    return Object.values(BOOKING_STATUSES).includes(status);
};

export const getBookingProgress = (status) => {
    const statusFlow = ['pending', 'expert_review', 'confirmed', 'in_progress', 'completed'];
    const index = statusFlow.indexOf(status);
    if (index === -1) return 0;
    return Math.round(((index + 1) / statusFlow.length) * 100);
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    BOOKING_STATUSES,
    BOOKING_WORKFLOW_STEPS,
    BOOKING_STEP_LABELS,
    BOOKING_STEP_DESCRIPTIONS,
    COST_ESTIMATION_CONFIG,
    APPOINTMENT_STATUSES,
    APPOINTMENT_TYPES,
    PAYMENT_STATUSES,
    PAYMENT_METHODS,
    USER_ROLES,
    USER_STATUS,
    HTTP_STATUS,
    ERROR_CODES,
    CACHE_KEYS,
    MESSAGES,
    NOTIFICATION_TYPES,
    NOTIFICATION_STATUS,
    GENDER,
    BLOOD_GROUPS,
    MARITAL_STATUS,
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_DESCRIPTIONS,
    BOOKING_STATUS_COLORS,
    BOOKING_STATUS_TRANSITIONS,
    CANCELLABLE_STATUSES,
    REFUNDABLE_STATUSES,
    EDITABLE_STATUSES,
    FINAL_STATUSES,
    getStatusLabel,
    getStatusDescription,
    getStatusColor,
    canCancelBooking,
    canRefundBooking,
    canEditBooking,
    isFinalStatus,
    canTransitionTo,
    isValidBookingStatus,
    getBookingProgress
};
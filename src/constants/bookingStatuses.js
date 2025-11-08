'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS - IMPORT FROM YOUR EXISTING FILES
// ═══════════════════════════════════════════════════════════════════════════════

// Import from your existing bookingStatuses.js
import {
    BOOKING_STATUSES,
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_DESCRIPTIONS,
    BOOKING_STATUS_COLORS,
    BOOKING_STATUS_FLOW,
    BOOKING_STATUS_TRANSITIONS,
    CANCELLABLE_STATUSES,
    REFUNDABLE_STATUSES,
    EDITABLE_STATUSES,
    FINAL_STATUSES,
    isValidBookingStatus,
    canTransitionTo,
    getNextStatus,
    getPreviousStatus,
    getStatusLabel,
    getStatusDescription,
    getStatusColor,
    canCancelBooking,
    canRefundBooking,
    canEditBooking,
    isFinalStatus,
    getBookingProgress
} from './bookingStatuses.js';

// Define other constants inline
export const APPOINTMENT_STATUSES = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
    RESCHEDULED: 'rescheduled'
};

export const PAYMENT_STATUSES = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
};

export const USER_ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    STAFF: 'staff',
    NURSE: 'nurse',
    RECEPTIONIST: 'receptionist'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500
};

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
    BAD_REQUEST: 'BAD_REQUEST'
};

export const CACHE_KEYS = {
    USER_PROFILE: 'user_profile_',
    USER_ROLE: 'user_role_',
    APPOINTMENTS: 'appointments_',
    PRESCRIPTIONS: 'prescriptions_',
    BOOKINGS: 'bookings_'
};

export const MESSAGES = {
    SUCCESS: 'Operation successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden'
};

export const APPOINTMENT_TYPES = {
    CONSULTATION: 'consultation',
    FOLLOW_UP: 'follow_up',
    CHECKUP: 'checkup',
    PROCEDURE: 'procedure',
    LAB_TEST: 'lab_test',
    VIDEO_CALL: 'video_call'
};

export const NOTIFICATION_TYPES = {
    APPOINTMENT: 'appointment',
    PRESCRIPTION: 'prescription',
    LAB_RESULT: 'lab_result',
    PAYMENT: 'payment',
    BOOKING: 'booking',
    SYSTEM: 'system'
};

export const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
};

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

// Re-export booking statuses and helper functions
export {
    BOOKING_STATUSES,
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_DESCRIPTIONS,
    BOOKING_STATUS_COLORS,
    BOOKING_STATUS_FLOW,
    BOOKING_STATUS_TRANSITIONS,
    CANCELLABLE_STATUSES,
    REFUNDABLE_STATUSES,
    EDITABLE_STATUSES,
    FINAL_STATUSES,
    isValidBookingStatus,
    canTransitionTo,
    getNextStatus,
    getPreviousStatus,
    getStatusLabel,
    getStatusDescription,
    getStatusColor,
    canCancelBooking,
    canRefundBooking,
    canEditBooking,
    isFinalStatus,
    getBookingProgress
};

export default {
    APPOINTMENT_STATUSES,
    BOOKING_STATUSES,
    PAYMENT_STATUSES,
    USER_ROLES,
    HTTP_STATUS,
    ERROR_CODES,
    CACHE_KEYS,
    MESSAGES,
    APPOINTMENT_TYPES,
    NOTIFICATION_TYPES,
    GENDER,
    BLOOD_GROUPS,
    // Booking status helpers
    BOOKING_STATUS_LABELS,
    BOOKING_STATUS_DESCRIPTIONS,
    BOOKING_STATUS_COLORS,
    BOOKING_STATUS_FLOW,
    BOOKING_STATUS_TRANSITIONS,
    CANCELLABLE_STATUSES,
    REFUNDABLE_STATUSES,
    EDITABLE_STATUSES,
    FINAL_STATUSES,
    isValidBookingStatus,
    canTransitionTo,
    getNextStatus,
    getPreviousStatus,
    getStatusLabel,
    getStatusDescription,
    getStatusColor,
    canCancelBooking,
    canRefundBooking,
    canEditBooking,
    isFinalStatus,
    getBookingProgress
};
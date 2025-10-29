// Custom error codes for the Medivoy Healthcare System
// Range: 1000-2099

module.exports = {
  // Authentication Errors (1000-1099)
  AUTH_INVALID_CREDENTIALS: {
    code: 1000,
    message: "Invalid credentials provided",
    httpStatus: 401,
  },
  AUTH_ACCOUNT_NOT_VERIFIED: {
    code: 1001,
    message: "Account not verified",
    httpStatus: 401,
  },
  AUTH_TOKEN_EXPIRED: {
    code: 1002,
    message: "Authentication token expired",
    httpStatus: 401,
  },
  AUTH_TOKEN_INVALID: {
    code: 1003,
    message: "Invalid authentication token",
    httpStatus: 401,
  },
  AUTH_NO_TOKEN: {
    code: 1004,
    message: "No authentication token provided",
    httpStatus: 401,
  },
  AUTH_INSUFFICIENT_PERMISSIONS: {
    code: 1005,
    message: "Insufficient permissions to perform this action",
    httpStatus: 403,
  },

  // User Errors (1100-1199)
  USER_NOT_FOUND: {
    code: 1100,
    message: "User not found",
    httpStatus: 404,
  },
  USER_EMAIL_EXISTS: {
    code: 1101,
    message: "User with this email already exists",
    httpStatus: 409,
  },
  USER_INVALID_ROLE: {
    code: 1102,
    message: "Invalid user role provided",
    httpStatus: 400,
  },

  // Validation Errors (1200-1299)
  VALIDATION_ERROR: {
    code: 1200,
    message: "Validation error occurred",
    httpStatus: 400,
  },
  VALIDATION_INVALID_EMAIL: {
    code: 1201,
    message: "Invalid email format",
    httpStatus: 400,
  },
  VALIDATION_PASSWORD_TOO_SHORT: {
    code: 1202,
    message: "Password must be at least 8 characters long",
    httpStatus: 400,
  },

  // Booking Errors (1300-1399)
  BOOKING_NOT_FOUND: {
    code: 1300,
    message: "Booking not found",
    httpStatus: 404,
  },
  BOOKING_INVALID_STATUS_TRANSITION: {
    code: 1301,
    message: "Invalid booking status transition",
    httpStatus: 400,
  },

  // Appointment Errors (1400-1499)
  APPOINTMENT_NOT_FOUND: {
    code: 1400,
    message: "Appointment not found",
    httpStatus: 404,
  },
  APPOINTMENT_INVALID_STATUS_TRANSITION: {
    code: 1401,
    message: "Invalid appointment status transition",
    httpStatus: 400,
  },
  APPOINTMENT_TIME_CONFLICT: {
    code: 1402,
    message: "Appointment time conflicts with existing appointment",
    httpStatus: 409,
  },

  // Payment Errors (1500-1599)
  PAYMENT_METHOD_INVALID: {
    code: 1500,
    message: "Invalid payment method",
    httpStatus: 400,
  },
  PAYMENT_FAILED: {
    code: 1501,
    message: "Payment processing failed",
    httpStatus: 400,
  },
  PAYMENT_ALREADY_PROCESSED: {
    code: 1502,
    message: "Payment has already been processed",
    httpStatus: 409,
  },

  // Database Errors (1600-1699)
  DATABASE_ERROR: {
    code: 1600,
    message: "Database operation failed",
    httpStatus: 500,
  },
  DATABASE_CONNECTION_FAILED: {
    code: 1601,
    message: "Database connection failed",
    httpStatus: 500,
  },

  // File Upload Errors (1700-1799)
  FILE_UPLOAD_FAILED: {
    code: 1700,
    message: "File upload failed",
    httpStatus: 500,
  },
  FILE_TYPE_NOT_ALLOWED: {
    code: 1701,
    message: "File type not allowed",
    httpStatus: 400,
  },
  FILE_SIZE_EXCEEDED: {
    code: 1702,
    message: "File size exceeds maximum allowed limit",
    httpStatus: 400,
  },

  // General Errors (2000-2099)
  INTERNAL_SERVER_ERROR: {
    code: 2000,
    message: "Internal server error",
    httpStatus: 500,
  },
  RESOURCE_NOT_FOUND: {
    code: 2001,
    message: "Requested resource not found",
    httpStatus: 404,
  },
  INVALID_REQUEST: {
    code: 2002,
    message: "Invalid request parameters",
    httpStatus: 400,
  },
};

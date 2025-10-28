/**
 * Custom error codes for the application
 */

const ERROR_CODES = {
  // Authentication errors (1000-1099)
  INVALID_CREDENTIALS: { code: 1001, message: 'Invalid email or password' },
  TOKEN_EXPIRED: { code: 1002, message: 'Token has expired' },
  TOKEN_INVALID: { code: 1003, message: 'Invalid token' },
  UNAUTHORIZED: { code: 1004, message: 'Unauthorized access' },
  EMAIL_NOT_VERIFIED: { code: 1005, message: 'Email not verified' },
  ACCOUNT_DISABLED: { code: 1006, message: 'Account has been disabled' },
  
  // Validation errors (1100-1199)
  VALIDATION_ERROR: { code: 1101, message: 'Validation failed' },
  REQUIRED_FIELD: { code: 1102, message: 'Required field missing' },
  INVALID_FORMAT: { code: 1103, message: 'Invalid format' },
  INVALID_EMAIL: { code: 1104, message: 'Invalid email format' },
  INVALID_PHONE: { code: 1105, message: 'Invalid phone number' },
  
  // Resource errors (1200-1299)
  RESOURCE_NOT_FOUND: { code: 1201, message: 'Resource not found' },
  RESOURCE_ALREADY_EXISTS: { code: 1202, message: 'Resource already exists' },
  DUPLICATE_ENTRY: { code: 1203, message: 'Duplicate entry' },
  
  // User errors (1300-1399)
  USER_NOT_FOUND: { code: 1301, message: 'User not found' },
  USER_ALREADY_EXISTS: { code: 1302, message: 'User already exists' },
  EMAIL_ALREADY_REGISTERED: { code: 1303, message: 'Email already registered' },
  
  // Permission errors (1400-1499)
  FORBIDDEN: { code: 1401, message: 'Access forbidden' },
  INSUFFICIENT_PERMISSIONS: { code: 1402, message: 'Insufficient permissions' },
  
  // Business logic errors (1500-1599)
  BOOKING_NOT_AVAILABLE: { code: 1501, message: 'Booking slot not available' },
  APPOINTMENT_CONFLICT: { code: 1502, message: 'Appointment time conflict' },
  INSUFFICIENT_BALANCE: { code: 1503, message: 'Insufficient balance' },
  INVALID_STATUS_TRANSITION: { code: 1504, message: 'Invalid status transition' },
  
  // Payment errors (1600-1699)
  PAYMENT_FAILED: { code: 1601, message: 'Payment processing failed' },
  PAYMENT_GATEWAY_ERROR: { code: 1602, message: 'Payment gateway error' },
  REFUND_FAILED: { code: 1603, message: 'Refund processing failed' },
  
  // File upload errors (1700-1799)
  FILE_TOO_LARGE: { code: 1701, message: 'File size exceeds limit' },
  INVALID_FILE_TYPE: { code: 1702, message: 'Invalid file type' },
  UPLOAD_FAILED: { code: 1703, message: 'File upload failed' },
  
  // External service errors (1800-1899)
  EMAIL_SERVICE_ERROR: { code: 1801, message: 'Email service error' },
  SMS_SERVICE_ERROR: { code: 1802, message: 'SMS service error' },
  NOTIFICATION_SERVICE_ERROR: { code: 1803, message: 'Notification service error' },
  
  // Database errors (1900-1999)
  DATABASE_ERROR: { code: 1901, message: 'Database error' },
  CONNECTION_ERROR: { code: 1902, message: 'Database connection error' },
  QUERY_ERROR: { code: 1903, message: 'Database query error' },
  
  // Server errors (2000-2099)
  INTERNAL_SERVER_ERROR: { code: 2001, message: 'Internal server error' },
  SERVICE_UNAVAILABLE: { code: 2002, message: 'Service temporarily unavailable' },
  RATE_LIMIT_EXCEEDED: { code: 2003, message: 'Rate limit exceeded' }
};

module.exports = ERROR_CODES;
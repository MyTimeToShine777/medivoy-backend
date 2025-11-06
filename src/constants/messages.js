// Messages - NO optional chaining
export const MESSAGES = {
    // Auth
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    USER_NOT_FOUND: 'User not found',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden',

    // Booking
    BOOKING_CREATED: 'Booking created successfully',
    BOOKING_UPDATED: 'Booking updated successfully',
    BOOKING_NOT_FOUND: 'Booking not found',
    BOOKING_CANCELLED: 'Booking cancelled successfully',
    INVALID_BOOKING_STATUS: 'Invalid booking status transition',

    // Payment
    PAYMENT_INITIATED: 'Payment initiated',
    PAYMENT_COMPLETED: 'Payment completed successfully',
    PAYMENT_FAILED: 'Payment failed',
    PAYMENT_PENDING: 'Payment is pending',

    // Documents
    DOCUMENT_UPLOADED: 'Document uploaded successfully',
    DOCUMENT_DELETED: 'Document deleted successfully',
    INVALID_FILE_TYPE: 'Invalid file type',
    FILE_TOO_LARGE: 'File size exceeds maximum limit',

    // Server
    INTERNAL_SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    NOT_FOUND: 'Not found',
    CONFLICT: 'Resource already exists',
};
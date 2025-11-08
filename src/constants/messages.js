// Messages - Comprehensive for New Workflow - NO optional chaining
export const MESSAGES = {
    // ============================================
    // AUTH & USER MANAGEMENT
    // ============================================
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    USER_NOT_FOUND: 'User not found',
    USER_CREATED: 'User account created successfully',
    USER_UPDATED: 'User profile updated successfully',
    USER_DELETED: 'User account deleted successfully',
    USER_DEACTIVATED: 'User account deactivated',
    USER_ACTIVATED: 'User account activated',
    TOKEN_EXPIRED: 'Authentication token has expired',
    INVALID_TOKEN: 'Invalid authentication token',
    TOKEN_MISSING: 'Authentication token is required',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden - insufficient permissions',
    ACCOUNT_LOCKED: 'Account has been locked due to multiple failed login attempts',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email',
    INVALID_RESET_TOKEN: 'Invalid or expired password reset token',
    EMAIL_VERIFIED: 'Email verified successfully',
    EMAIL_VERIFICATION_SENT: 'Verification email sent',
    PHONE_VERIFIED: 'Phone number verified successfully',
    OTP_SENT: 'OTP sent successfully',
    OTP_VERIFIED: 'OTP verified successfully',
    INVALID_OTP: 'Invalid or expired OTP',
    SESSION_EXPIRED: 'Your session has expired. Please login again',
    LOGOUT_SUCCESS: 'Logged out successfully',

    // ============================================
    // ROLE-BASED ACCESS
    // ============================================
    ROLE_REQUIRED: 'User role is required',
    INVALID_ROLE: 'Invalid user role',
    INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action',
    ADMIN_ONLY: 'This action is restricted to administrators only',
    SUPER_ADMIN_ONLY: 'This action is restricted to super administrators only',
    HOSPITAL_ADMIN_ONLY: 'This action is restricted to hospital administrators',
    STAFF_ONLY: 'This action is restricted to Medivoy staff',
    PATIENT_ONLY: 'This action is restricted to patients',
    ROLE_UPDATED: 'User role updated successfully',

    // ============================================
    // BOOKING WORKFLOW - STEP BY STEP
    // ============================================

    // Step 1: Treatment Selection
    TREATMENT_SELECTED: 'Treatment selected successfully',
    TREATMENT_NOT_FOUND: 'Treatment not found',
    TREATMENT_UNAVAILABLE: 'Selected treatment is currently unavailable',
    TREATMENT_REQUIRED: 'Please select a treatment to continue',
    INVALID_TREATMENT: 'Invalid treatment selection',

    // Step 2: Country Selection
    COUNTRY_SELECTED: 'Country selected successfully',
    COUNTRY_NOT_FOUND: 'Country not found',
    COUNTRY_UNAVAILABLE: 'Selected country is currently unavailable',
    COUNTRY_REQUIRED: 'Please select a country to continue',
    INVALID_COUNTRY: 'Invalid country selection',
    NO_HOSPITALS_IN_COUNTRY: 'No hospitals available in selected country',

    // Step 3: City Selection
    CITY_SELECTED: 'City selected successfully',
    CITY_NOT_FOUND: 'City not found',
    CITY_UNAVAILABLE: 'Selected city is currently unavailable',
    CITY_REQUIRED: 'Please select a city to continue',
    INVALID_CITY: 'Invalid city selection',
    CITY_NOT_IN_COUNTRY: 'Selected city does not belong to chosen country',
    NO_HOSPITALS_IN_CITY: 'No hospitals available in selected city',

    // Step 4: Hospital Selection
    HOSPITAL_SELECTED: 'Hospital selected successfully',
    HOSPITAL_NOT_FOUND: 'Hospital not found',
    HOSPITAL_UNAVAILABLE: 'Selected hospital is currently unavailable',
    HOSPITAL_REQUIRED: 'Please select a hospital to continue',
    INVALID_HOSPITAL: 'Invalid hospital selection',
    HOSPITAL_NOT_OFFER_TREATMENT: 'Selected hospital does not offer this treatment',
    HOSPITAL_NOT_IN_CITY: 'Selected hospital is not located in chosen city',

    // Step 5: Package Selection
    PACKAGE_SELECTED: 'Package selected successfully',
    PACKAGE_NOT_FOUND: 'Package not found',
    PACKAGE_UNAVAILABLE: 'Selected package is currently unavailable',
    PACKAGE_REQUIRED: 'Please select a package to continue',
    INVALID_PACKAGE: 'Invalid package selection',
    PACKAGE_NOT_IN_HOSPITAL: 'Selected package is not offered by chosen hospital',
    PACKAGE_PRICE_CHANGED: 'Package price has been updated',

    // Step 6: Feature Add-ons
    ADDONS_ADDED: 'Feature add-ons added successfully',
    ADDONS_UPDATED: 'Feature add-ons updated successfully',
    ADDON_NOT_FOUND: 'Feature add-on not found',
    ADDON_UNAVAILABLE: 'Selected add-on is currently unavailable',
    INVALID_ADDON: 'Invalid add-on selection',
    ADDON_ALREADY_SELECTED: 'This add-on has already been selected',
    MAX_ADDONS_REACHED: 'Maximum number of add-ons reached',
    CONFLICTING_ADDONS: 'Cannot select conflicting add-ons together',

    // Step 7: Cost Estimation
    COST_CALCULATED: 'Cost breakdown calculated successfully',
    COST_CALCULATION_FAILED: 'Failed to calculate cost',
    INVALID_COST_DATA: 'Invalid cost calculation data',
    COST_EXCEEDS_LIMIT: 'Total cost exceeds maximum allowed limit',

    // Step 8: Patient Information
    PATIENT_INFO_SAVED: 'Patient information saved successfully',
    PATIENT_INFO_UPDATED: 'Patient information updated successfully',
    PATIENT_INFO_INCOMPLETE: 'Please complete all required patient information',
    INVALID_PATIENT_AGE: 'Invalid patient age',
    INVALID_PATIENT_GENDER: 'Invalid patient gender',
    PATIENT_CITY_REQUIRED: 'Patient city is required',
    COMORBID_CONDITIONS_SAVED: 'Medical conditions saved successfully',

    // Step 9: Insurance
    INSURANCE_INFO_SAVED: 'Insurance information saved successfully',
    INSURANCE_INFO_UPDATED: 'Insurance information updated successfully',
    INSURANCE_NOT_FOUND: 'Insurance information not found',
    INVALID_INSURANCE: 'Invalid insurance information',
    INSURANCE_VERIFICATION_PENDING: 'Insurance verification pending',
    INSURANCE_VERIFIED: 'Insurance verified successfully',
    INSURANCE_REJECTED: 'Insurance verification rejected',

    // Step 10: Booking Confirmation
    BOOKING_CREATED: 'Booking created successfully',
    BOOKING_CONFIRMED: 'Booking confirmed successfully',
    BOOKING_UPDATED: 'Booking updated successfully',
    BOOKING_CANCELLED: 'Booking cancelled successfully',
    BOOKING_COMPLETED: 'Booking completed successfully',
    BOOKING_NOT_FOUND: 'Booking not found',
    BOOKING_ALREADY_EXISTS: 'An active booking already exists',
    BOOKING_EXPIRED: 'Booking has expired',
    INVALID_BOOKING_STATUS: 'Invalid booking status transition',
    CANNOT_CANCEL_BOOKING: 'Cannot cancel booking at this stage',
    BOOKING_UNDER_REVIEW: 'Your booking is under expert review',
    INCOMPLETE_BOOKING_DATA: 'Booking data is incomplete',
    BOOKING_REFUND_INITIATED: 'Booking refund has been initiated',
    BOOKING_REFUND_COMPLETED: 'Booking refund completed successfully',

    // ============================================
    // BOOKING WORKFLOW STEPS
    // ============================================
    STEP_1_TREATMENT_SELECT: 'Step 1: Select treatment type',
    STEP_2_COUNTRY_SELECT: 'Step 2: Select destination country',
    STEP_3_CITY_SELECT: 'Step 3: Choose city',
    STEP_4_HOSPITAL_SELECT: 'Step 4: Choose hospital',
    STEP_5_PACKAGE_SELECT: 'Step 5: Select package and view base price',
    STEP_6_ADDON_SELECT: 'Step 6: Add optional features (travel, accommodation, etc.)',
    STEP_7_COST_ESTIMATE: 'Step 7: Review cost estimation (10-20k range)',
    STEP_8_PATIENT_INFO: 'Step 8: Enter your information',
    STEP_9_INSURANCE: 'Step 9: Select insurance option',
    STEP_10_CONFIRM: 'Step 10: Confirm booking',
    STEP_11_EXPERT_CALL: 'Step 11: Schedule expert consultation',

    // Cost estimation specific
    COST_BREAKDOWN_TITLE: 'Cost Breakdown',
    PACKAGE_PRICE: 'Package Price (Base)',
    ADDONS_SUBTOTAL: 'Add-ons Subtotal',
    ESTIMATED_TAX: 'Estimated Tax (10%)',
    ESTIMATED_TOTAL: 'Estimated Total',
    COST_RANGE_TITLE: 'Estimated Cost Range',
    COST_RANGE_MIN: 'Minimum Range',
    COST_RANGE_MAX: 'Maximum Range',
    NO_ADDONS_SELECTED: 'No add-ons selected',
    ADDONS_WILL_ADD_COST: 'Add-ons will add to the package cost',

    // ============================================
    // EXPERT CALL
    // ============================================
    EXPERT_CALL_SCHEDULED: 'Expert call scheduled successfully',
    EXPERT_CALL_RESCHEDULED: 'Expert call rescheduled successfully',
    EXPERT_CALL_CANCELLED: 'Expert call cancelled successfully',
    EXPERT_CALL_COMPLETED: 'Expert call completed successfully',
    EXPERT_CALL_NOT_FOUND: 'Expert call not found',
    EXPERT_CALL_IN_PROGRESS: 'Expert call is in progress',
    EXPERT_NOT_AVAILABLE: 'Expert is not available at selected time',
    INVALID_CALL_TIME: 'Invalid call time selected',
    CALL_SLOT_NOT_AVAILABLE: 'Selected time slot is not available',
    EXPERT_ASSIGNED: 'Expert assigned to your booking',
    EXPERT_NOTES_ADDED: 'Expert notes added successfully',
    CALL_LINK_SENT: 'Call link sent to your email',
    CALL_REMINDER_SENT: 'Call reminder sent successfully',

    // ============================================
    // PAYMENT
    // ============================================
    PAYMENT_INITIATED: 'Payment initiated successfully',
    PAYMENT_PROCESSING: 'Payment is being processed',
    PAYMENT_COMPLETED: 'Payment completed successfully',
    PAYMENT_FAILED: 'Payment failed. Please try again',
    PAYMENT_PENDING: 'Payment is pending',
    PAYMENT_CANCELLED: 'Payment cancelled',
    PAYMENT_REFUNDED: 'Payment refunded successfully',
    PARTIAL_REFUND_COMPLETED: 'Partial refund completed successfully',
    PAYMENT_NOT_FOUND: 'Payment record not found',
    INVALID_PAYMENT_METHOD: 'Invalid payment method',
    INVALID_PAYMENT_AMOUNT: 'Invalid payment amount',
    PAYMENT_GATEWAY_ERROR: 'Payment gateway error. Please try again',
    PAYMENT_VERIFICATION_FAILED: 'Payment verification failed',
    INSUFFICIENT_FUNDS: 'Insufficient funds for transaction',
    PAYMENT_TIMEOUT: 'Payment request timed out',
    PAYMENT_ALREADY_COMPLETED: 'Payment has already been completed',
    REFUND_NOT_ALLOWED: 'Refund is not allowed for this payment',
    REFUND_LIMIT_EXCEEDED: 'Refund amount exceeds original payment',
    PAYMENT_RECEIPT_SENT: 'Payment receipt sent to your email',

    // ============================================
    // TREATMENT MANAGEMENT
    // ============================================
    TREATMENT_CREATED: 'Treatment created successfully',
    TREATMENT_UPDATED: 'Treatment updated successfully',
    TREATMENT_DELETED: 'Treatment deleted successfully',
    TREATMENT_ACTIVATED: 'Treatment activated successfully',
    TREATMENT_DEACTIVATED: 'Treatment deactivated successfully',
    DUPLICATE_TREATMENT: 'Treatment with this name already exists',
    TREATMENT_HAS_BOOKINGS: 'Cannot delete treatment with active bookings',

    // ============================================
    // HOSPITAL MANAGEMENT
    // ============================================
    HOSPITAL_CREATED: 'Hospital registered successfully',
    HOSPITAL_UPDATED: 'Hospital information updated successfully',
    HOSPITAL_DELETED: 'Hospital removed successfully',
    HOSPITAL_VERIFIED: 'Hospital verified successfully',
    HOSPITAL_VERIFICATION_PENDING: 'Hospital verification pending',
    HOSPITAL_REJECTED: 'Hospital verification rejected',
    HOSPITAL_ACTIVATED: 'Hospital activated successfully',
    HOSPITAL_DEACTIVATED: 'Hospital deactivated successfully',
    DUPLICATE_HOSPITAL: 'Hospital already exists',
    HOSPITAL_HAS_ACTIVE_BOOKINGS: 'Cannot delete hospital with active bookings',

    // ============================================
    // PACKAGE MANAGEMENT
    // ============================================
    PACKAGE_CREATED: 'Package created successfully',
    PACKAGE_UPDATED: 'Package updated successfully',
    PACKAGE_DELETED: 'Package deleted successfully',
    PACKAGE_ACTIVATED: 'Package activated successfully',
    PACKAGE_DEACTIVATED: 'Package deactivated successfully',
    DUPLICATE_PACKAGE: 'Package with this name already exists',
    PACKAGE_HAS_BOOKINGS: 'Cannot delete package with active bookings',

    // ============================================
    // FEATURE ADD-ONS MANAGEMENT
    // ============================================
    FEATURE_CREATED: 'Feature add-on created successfully',
    FEATURE_UPDATED: 'Feature add-on updated successfully',
    FEATURE_DELETED: 'Feature add-on deleted successfully',
    FEATURE_ACTIVATED: 'Feature add-on activated successfully',
    FEATURE_DEACTIVATED: 'Feature add-on deactivated successfully',
    DUPLICATE_FEATURE: 'Feature add-on already exists',

    // ============================================
    // COUNTRY & CITY MANAGEMENT
    // ============================================
    COUNTRY_CREATED: 'Country added successfully',
    COUNTRY_UPDATED: 'Country updated successfully',
    COUNTRY_DELETED: 'Country deleted successfully',
    CITY_CREATED: 'City added successfully',
    CITY_UPDATED: 'City updated successfully',
    CITY_DELETED: 'City deleted successfully',
    DUPLICATE_COUNTRY: 'Country already exists',
    DUPLICATE_CITY: 'City already exists in this country',
    COUNTRY_HAS_HOSPITALS: 'Cannot delete country with active hospitals',
    CITY_HAS_HOSPITALS: 'Cannot delete city with active hospitals',

    // ============================================
    // DOCTOR MANAGEMENT
    // ============================================
    DOCTOR_CREATED: 'Doctor added successfully',
    DOCTOR_UPDATED: 'Doctor information updated successfully',
    DOCTOR_DELETED: 'Doctor removed successfully',
    DOCTOR_VERIFIED: 'Doctor verified successfully',
    DOCTOR_ACTIVATED: 'Doctor activated successfully',
    DOCTOR_DEACTIVATED: 'Doctor deactivated successfully',
    DOCTOR_SCHEDULE_UPDATED: 'Doctor schedule updated successfully',
    DOCTOR_NOT_AVAILABLE: 'Doctor is not available',
    DUPLICATE_DOCTOR: 'Doctor already exists in hospital',

    // ============================================
    // STAFF MANAGEMENT
    // ============================================
    STAFF_CREATED: 'Staff member added successfully',
    STAFF_UPDATED: 'Staff information updated successfully',
    STAFF_DELETED: 'Staff member removed successfully',
    STAFF_ACTIVATED: 'Staff activated successfully',
    STAFF_DEACTIVATED: 'Staff deactivated successfully',
    DUPLICATE_STAFF: 'Staff member already exists',

    // ============================================
    // DOCUMENTS
    // ============================================
    DOCUMENT_UPLOADED: 'Document uploaded successfully',
    DOCUMENT_UPDATED: 'Document updated successfully',
    DOCUMENT_DELETED: 'Document deleted successfully',
    DOCUMENT_VERIFIED: 'Document verified successfully',
    DOCUMENT_REJECTED: 'Document verification rejected',
    INVALID_FILE_TYPE: 'Invalid file type. Allowed types: PDF, JPG, PNG',
    FILE_TOO_LARGE: 'File size exceeds maximum limit of 10MB',
    DOCUMENT_NOT_FOUND: 'Document not found',
    DOCUMENT_EXPIRED: 'Document has expired',
    MISSING_REQUIRED_DOCUMENT: 'Required document is missing',

    // ============================================
    // NOTIFICATIONS
    // ============================================
    NOTIFICATION_SENT: 'Notification sent successfully',
    NOTIFICATION_MARKED_READ: 'Notification marked as read',
    NOTIFICATION_DELETED: 'Notification deleted successfully',
    EMAIL_SENT: 'Email sent successfully',
    SMS_SENT: 'SMS sent successfully',
    PUSH_NOTIFICATION_SENT: 'Push notification sent successfully',
    NOTIFICATION_FAILED: 'Failed to send notification',

    // ============================================
    // ANALYTICS & REPORTS
    // ============================================
    REPORT_GENERATED: 'Report generated successfully',
    REPORT_GENERATION_FAILED: 'Failed to generate report',
    ANALYTICS_DATA_FETCHED: 'Analytics data retrieved successfully',
    INSUFFICIENT_DATA: 'Insufficient data for analytics',
    INVALID_DATE_RANGE: 'Invalid date range for report',

    // ============================================
    // APPOINTMENTS
    // ============================================
    APPOINTMENT_SCHEDULED: 'Appointment scheduled successfully',
    APPOINTMENT_RESCHEDULED: 'Appointment rescheduled successfully',
    APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
    APPOINTMENT_COMPLETED: 'Appointment completed successfully',
    APPOINTMENT_NOT_FOUND: 'Appointment not found',
    APPOINTMENT_SLOT_UNAVAILABLE: 'Selected appointment slot is not available',
    APPOINTMENT_REMINDER_SENT: 'Appointment reminder sent',

    // ============================================
    // INVOICE
    // ============================================
    INVOICE_GENERATED: 'Invoice generated successfully',
    INVOICE_SENT: 'Invoice sent to your email',
    INVOICE_UPDATED: 'Invoice updated successfully',
    INVOICE_NOT_FOUND: 'Invoice not found',
    INVOICE_ALREADY_PAID: 'Invoice has already been paid',

    // ============================================
    // VALIDATION ERRORS
    // ============================================
    VALIDATION_ERROR: 'Validation error',
    REQUIRED_FIELD_MISSING: 'Required field is missing',
    INVALID_EMAIL_FORMAT: 'Invalid email format',
    INVALID_PHONE_FORMAT: 'Invalid phone number format',
    INVALID_DATE_FORMAT: 'Invalid date format',
    INVALID_UUID: 'Invalid ID format',
    PASSWORD_TOO_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
    PASSWORD_MISMATCH: 'Passwords do not match',
    INVALID_AGE: 'Age must be between 1 and 120',
    INVALID_GENDER: 'Gender must be male, female, or other',
    INVALID_CURRENCY: 'Invalid currency code',
    INVALID_AMOUNT: 'Amount must be a positive number',

    // ============================================
    // SYSTEM & SERVER
    // ============================================
    INTERNAL_SERVER_ERROR: 'Internal server error. Please try again later',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    DATABASE_ERROR: 'Database error occurred',
    NETWORK_ERROR: 'Network error. Please check your connection',
    BAD_REQUEST: 'Bad request. Please check your input',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource already exists',
    UNPROCESSABLE_ENTITY: 'Unable to process request',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later',
    REQUEST_TIMEOUT: 'Request timeout. Please try again',
    MAINTENANCE_MODE: 'System is under maintenance. Please try again later',

    // ============================================
    // GENERAL SUCCESS
    // ============================================
    SUCCESS: 'Operation completed successfully',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    ACTIVATED: 'Resource activated successfully',
    DEACTIVATED: 'Resource deactivated successfully',
    SAVED: 'Changes saved successfully',
    OPERATION_COMPLETED: 'Operation completed successfully',
};

// Helper function to get message
export const getMessage = (key) => {
    return MESSAGES[key] || 'An error occurred';
};

// Helper function for custom messages
export const formatMessage = (template, ...args) => {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};
// Staff Types - Comprehensive - NO optional chaining
export const STAFF_TYPES = {
    CUSTOMER_SUPPORT: 'customer_support',
    MEDICAL_COORDINATOR: 'medical_coordinator',
    TRAVEL_COORDINATOR: 'travel_coordinator',
    INSURANCE_SPECIALIST: 'insurance_specialist',
    ACCOUNT_MANAGER: 'account_manager',
    BOOKING_SPECIALIST: 'booking_specialist',
    PATIENT_RELATIONS: 'patient_relations',
    FINANCIAL_COUNSELOR: 'financial_counselor',
};

export const STAFF_TYPE_LABELS = {
    customer_support: 'Customer Support Specialist',
    medical_coordinator: 'Medical Coordinator',
    travel_coordinator: 'Travel Coordinator',
    insurance_specialist: 'Insurance Specialist',
    account_manager: 'Account Manager',
    booking_specialist: 'Booking Specialist',
    patient_relations: 'Patient Relations Officer',
    financial_counselor: 'Financial Counselor',
};

export const STAFF_TYPE_DESCRIPTIONS = {
    customer_support: 'Handle patient inquiries, complaints, and general support',
    medical_coordinator: 'Coordinate medical appointments, treatments, and hospital communications',
    travel_coordinator: 'Arrange travel, accommodation, and local transportation for patients',
    insurance_specialist: 'Assist with insurance claims, verification, and coverage details',
    account_manager: 'Manage patient accounts and maintain ongoing relationships',
    booking_specialist: 'Process and manage booking requests and confirmations',
    patient_relations: 'Ensure patient satisfaction and handle escalations',
    financial_counselor: 'Provide financial guidance and payment plan assistance',
};

export const STAFF_RESPONSIBILITIES = {
    customer_support: [
        'Answer patient inquiries',
        'Resolve complaints',
        'Provide system support',
        'Handle phone and email communications',
    ],
    medical_coordinator: [
        'Schedule appointments',
        'Coordinate with hospitals',
        'Manage medical records',
        'Arrange expert consultations',
    ],
    travel_coordinator: [
        'Book flights and accommodation',
        'Arrange airport transfers',
        'Handle visa assistance',
        'Coordinate local transport',
    ],
    insurance_specialist: [
        'Verify insurance coverage',
        'Process insurance claims',
        'Liaise with insurance companies',
        'Provide coverage explanations',
    ],
    account_manager: [
        'Manage VIP patient accounts',
        'Maintain relationships',
        'Handle complex cases',
        'Ensure service quality',
    ],
    booking_specialist: [
        'Process booking requests',
        'Verify booking details',
        'Confirm payments',
        'Update booking status',
    ],
    patient_relations: [
        'Handle patient feedback',
        'Resolve escalations',
        'Ensure satisfaction',
        'Conduct follow-up calls',
    ],
    financial_counselor: [
        'Explain cost breakdowns',
        'Set up payment plans',
        'Process refunds',
        'Financial counseling',
    ],
};

export const STAFF_ACCESS_LEVELS = {
    customer_support: 2,
    medical_coordinator: 3,
    travel_coordinator: 2,
    insurance_specialist: 3,
    account_manager: 4,
    booking_specialist: 2,
    patient_relations: 3,
    financial_counselor: 3,
};

// Helper functions
export const isValidStaffType = (type) => {
    return Object.values(STAFF_TYPES).includes(type);
};

export const getStaffTypeLabel = (type) => {
    return STAFF_TYPE_LABELS[type] || type;
};

export const getStaffTypeDescription = (type) => {
    return STAFF_TYPE_DESCRIPTIONS[type] || '';
};

export const getStaffResponsibilities = (type) => {
    return STAFF_RESPONSIBILITIES[type] || [];
};

export const getStaffAccessLevel = (type) => {
    return STAFF_ACCESS_LEVELS[type] || 1;
};

export const canHandleBooking = (type) => {
    return ['booking_specialist', 'medical_coordinator', 'account_manager'].includes(type);
};

export const canHandlePayments = (type) => {
    return ['financial_counselor', 'account_manager', 'booking_specialist'].includes(type);
};
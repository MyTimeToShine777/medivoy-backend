// Appointment Types - Comprehensive for new workflow - NO optional chaining
export const APPOINTMENT_TYPES = {
    INITIAL_CONSULTATION: 'initial_consultation',
    FOLLOW_UP: 'follow_up',
    PRE_SURGERY_CONSULTATION: 'pre_surgery_consultation',
    POST_SURGERY_FOLLOW_UP: 'post_surgery_follow_up',
    DIAGNOSTIC_TEST: 'diagnostic_test',
    PROCEDURE: 'procedure',
    EMERGENCY: 'emergency',
    ROUTINE_CHECKUP: 'routine_checkup',
    SPECIALIST_CONSULTATION: 'specialist_consultation',
    LAB_TEST: 'lab_test',
    IMAGING: 'imaging',
    THERAPY_SESSION: 'therapy_session',
    VACCINATION: 'vaccination',
    SECOND_OPINION: 'second_opinion',
};

export const APPOINTMENT_TYPE_LABELS = {
    initial_consultation: 'Initial Consultation',
    follow_up: 'Follow-up Appointment',
    pre_surgery_consultation: 'Pre-Surgery Consultation',
    post_surgery_follow_up: 'Post-Surgery Follow-up',
    diagnostic_test: 'Diagnostic Test',
    procedure: 'Medical Procedure',
    emergency: 'Emergency Appointment',
    routine_checkup: 'Routine Check-up',
    specialist_consultation: 'Specialist Consultation',
    lab_test: 'Laboratory Test',
    imaging: 'Medical Imaging (X-Ray/MRI/CT)',
    therapy_session: 'Therapy Session',
    vaccination: 'Vaccination',
    second_opinion: 'Second Opinion Consultation',
};

export const APPOINTMENT_TYPE_DESCRIPTIONS = {
    initial_consultation: 'First consultation with doctor to assess condition and recommend treatment',
    follow_up: 'Follow-up visit to monitor progress and adjust treatment',
    pre_surgery_consultation: 'Pre-operative consultation and medical clearance',
    post_surgery_follow_up: 'Post-operative check-up and recovery monitoring',
    diagnostic_test: 'Diagnostic tests and examinations',
    procedure: 'Minor medical procedure or intervention',
    emergency: 'Urgent medical attention required',
    routine_checkup: 'Regular health check-up and screening',
    specialist_consultation: 'Consultation with medical specialist',
    lab_test: 'Laboratory blood/urine tests',
    imaging: 'X-Ray, MRI, CT scan, or ultrasound',
    therapy_session: 'Physiotherapy, occupational therapy, or other therapeutic session',
    vaccination: 'Immunization and vaccination appointment',
    second_opinion: 'Consultation for medical second opinion',
};

export const APPOINTMENT_DURATIONS = {
    initial_consultation: 45,
    follow_up: 30,
    pre_surgery_consultation: 60,
    post_surgery_follow_up: 30,
    diagnostic_test: 30,
    procedure: 90,
    emergency: 30,
    routine_checkup: 30,
    specialist_consultation: 45,
    lab_test: 20,
    imaging: 45,
    therapy_session: 60,
    vaccination: 15,
    second_opinion: 60,
};

export const APPOINTMENT_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

export const APPOINTMENT_PRIORITY_LABELS = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    urgent: 'Urgent',
};

export const APPOINTMENT_TYPE_PRIORITIES = {
    initial_consultation: 'medium',
    follow_up: 'medium',
    pre_surgery_consultation: 'high',
    post_surgery_follow_up: 'high',
    diagnostic_test: 'medium',
    procedure: 'high',
    emergency: 'urgent',
    routine_checkup: 'low',
    specialist_consultation: 'medium',
    lab_test: 'low',
    imaging: 'medium',
    therapy_session: 'medium',
    vaccination: 'low',
    second_opinion: 'medium',
};

export const REQUIRES_PREPARATION = {
    initial_consultation: false,
    follow_up: false,
    pre_surgery_consultation: true,
    post_surgery_follow_up: false,
    diagnostic_test: true,
    procedure: true,
    emergency: false,
    routine_checkup: false,
    specialist_consultation: false,
    lab_test: true,
    imaging: true,
    therapy_session: false,
    vaccination: false,
    second_opinion: false,
};

export const REQUIRES_FASTING = [
    'lab_test',
    'diagnostic_test',
    'procedure',
];

// Helper functions
export const isValidAppointmentType = (type) => {
    return Object.values(APPOINTMENT_TYPES).includes(type);
};

export const getAppointmentTypeLabel = (type) => {
    return APPOINTMENT_TYPE_LABELS[type] || type;
};

export const getAppointmentTypeDescription = (type) => {
    return APPOINTMENT_TYPE_DESCRIPTIONS[type] || '';
};

export const getAppointmentDuration = (type) => {
    return APPOINTMENT_DURATIONS[type] || 30;
};

export const getAppointmentPriority = (type) => {
    return APPOINTMENT_TYPE_PRIORITIES[type] || 'medium';
};

export const requiresPreparation = (type) => {
    return REQUIRES_PREPARATION[type] || false;
};

export const requiresFasting = (type) => {
    return REQUIRES_FASTING.includes(type);
};

export const isEmergency = (type) => {
    return type === APPOINTMENT_TYPES.EMERGENCY;
};

export const isConsultation = (type) => {
    return [
        APPOINTMENT_TYPES.INITIAL_CONSULTATION,
        APPOINTMENT_TYPES.SPECIALIST_CONSULTATION,
        APPOINTMENT_TYPES.SECOND_OPINION,
    ].includes(type);
};

export const isFollowUp = (type) => {
    return [
        APPOINTMENT_TYPES.FOLLOW_UP,
        APPOINTMENT_TYPES.POST_SURGERY_FOLLOW_UP,
    ].includes(type);
};

export const isDiagnostic = (type) => {
    return [
        APPOINTMENT_TYPES.DIAGNOSTIC_TEST,
        APPOINTMENT_TYPES.LAB_TEST,
        APPOINTMENT_TYPES.IMAGING,
    ].includes(type);
};
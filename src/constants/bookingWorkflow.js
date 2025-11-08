// Booking Workflow Steps - NO optional chaining
export const BOOKING_WORKFLOW_STEPS = {
    TREATMENT_SELECTION: 1,
    COUNTRY_SELECTION: 2,
    CITY_SELECTION: 3,
    HOSPITAL_SELECTION: 4,
    PACKAGE_SELECTION: 5, // ← PACKAGE FIRST
    FEATURE_ADDON_SELECTION: 6, // ← ADD-ONS AFTER
    COST_ESTIMATION: 7,
    PATIENT_INFO_SUBMISSION: 8,
    INSURANCE_SELECTION: 9,
    BOOKING_CONFIRMATION: 10,
    EXPERT_CALL_SCHEDULING: 11,
};

export const BOOKING_STEP_LABELS = {
    1: 'Select Treatment',
    2: 'Select Country',
    3: 'Select City',
    4: 'Select Hospital',
    5: 'Select Package',
    6: 'Add-ons (Travel, Accommodation, Visa, Insurance, Services)',
    7: 'Cost Estimation',
    8: 'Patient Information',
    9: 'Insurance Details',
    10: 'Confirm Booking',
    11: 'Schedule Expert Call',
};

export const BOOKING_STEP_DESCRIPTIONS = {
    1: 'Choose treatment type',
    2: 'Choose destination country',
    3: 'Choose city for treatment',
    4: 'Choose hospital',
    5: 'Select package (base price shown)',
    6: 'Add optional features (max 20)',
    7: 'View cost breakdown and estimation range',
    8: 'Provide your personal details',
    9: 'Add insurance information',
    10: 'Finalize and confirm booking',
    11: 'Schedule consultation with medical expert',
};

export const BOOKING_STEP_FLOW = [
    'treatment_selection',
    'country_selection',
    'city_selection',
    'hospital_selection',
    'package_selection',
    'feature_addon_selection',
    'cost_estimation',
    'patient_info_submission',
    'insurance_selection',
    'booking_confirmation',
    'expert_call_scheduling',
];

// Cost estimation range
export const COST_ESTIMATION_CONFIG = {
    MIN_RANGE: 10000, // $10k minimum
    MAX_RANGE: 20000, // $20k maximum
    TAX_PERCENTAGE: 10, // 10% tax
    MAX_ADDONS_ALLOWED: 20, // Maximum 20 add-ons
    ADDON_PRICE_MULTIPLIER: 1.0, // Can adjust add-on prices
};

// Addon categories order for display
export const ADDON_DISPLAY_ORDER = [
    'traveler',
    'travel',
    'accommodation',
    'visa',
    'insurance',
    'service',
];

export const isValidWorkflowStep = (step) => {
    return BOOKING_WORKFLOW_STEPS[step] !== undefined;
};

export const getNextStep = (currentStep) => {
    const steps = Object.values(BOOKING_WORKFLOW_STEPS);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
        return null;
    }
    return steps[currentIndex + 1];
};

export const getPreviousStep = (currentStep) => {
    const steps = Object.values(BOOKING_WORKFLOW_STEPS);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex <= 0) {
        return null;
    }
    return steps[currentIndex - 1];
};

export const getStepLabel = (step) => {
    return BOOKING_STEP_LABELS[step] || 'Unknown Step';
};

export const getStepDescription = (step) => {
    return BOOKING_STEP_DESCRIPTIONS[step] || '';
};
// Package Types - Comprehensive - NO optional chaining
export const PACKAGE_TYPES = {
    BASIC: 'basic',
    STANDARD: 'standard',
    PREMIUM: 'premium',
    DELUXE: 'deluxe',
    VIP: 'vip',
    CUSTOM: 'custom',
};

export const PACKAGE_TYPE_LABELS = {
    basic: 'Basic Package',
    standard: 'Standard Package',
    premium: 'Premium Package',
    deluxe: 'Deluxe Package',
    vip: 'VIP Package',
    custom: 'Custom Package',
};

export const PACKAGE_TYPE_DESCRIPTIONS = {
    basic: 'Essential treatment with standard hospital amenities',
    standard: 'Complete treatment package with comfortable stay',
    premium: 'Enhanced care with superior accommodations and services',
    deluxe: 'Luxury treatment experience with premium facilities',
    vip: 'Exclusive VIP treatment with personalized care and luxury amenities',
    custom: 'Tailored package designed to specific patient requirements',
};

export const PACKAGE_INCLUSIONS = {
    CONSULTATION: 'consultation',
    SURGERY: 'surgery',
    HOSPITALIZATION: 'hospitalization',
    MEDICATION: 'medication',
    TESTS: 'tests',
    FOLLOW_UP: 'follow_up',
    ACCOMMODATION: 'accommodation',
    MEALS: 'meals',
    TRANSPORT: 'transport',
    NURSING_CARE: 'nursing_care',
    ICU: 'icu',
    PHYSIOTHERAPY: 'physiotherapy',
    DIAGNOSTIC_IMAGING: 'diagnostic_imaging',
    LAB_TESTS: 'lab_tests',
    ANESTHESIA: 'anesthesia',
    MEDICAL_SUPPLIES: 'medical_supplies',
};

export const PACKAGE_INCLUSION_LABELS = {
    consultation: 'Doctor Consultations',
    surgery: 'Surgical Procedures',
    hospitalization: 'Hospital Room Stay',
    medication: 'Medications',
    tests: 'Medical Tests',
    follow_up: 'Follow-up Visits',
    accommodation: 'Patient Accommodation',
    meals: 'Meals',
    transport: 'Transport Services',
    nursing_care: '24/7 Nursing Care',
    icu: 'ICU Care (if required)',
    physiotherapy: 'Physiotherapy Sessions',
    diagnostic_imaging: 'X-Ray, MRI, CT Scans',
    lab_tests: 'Laboratory Tests',
    anesthesia: 'Anesthesia Services',
    medical_supplies: 'Medical Supplies & Equipment',
};

export const PACKAGE_FEATURES_BY_TYPE = {
    basic: [
        'consultation',
        'surgery',
        'hospitalization',
        'medication',
        'tests',
        'nursing_care',
    ],
    standard: [
        'consultation',
        'surgery',
        'hospitalization',
        'medication',
        'tests',
        'follow_up',
        'meals',
        'nursing_care',
        'lab_tests',
    ],
    premium: [
        'consultation',
        'surgery',
        'hospitalization',
        'medication',
        'tests',
        'follow_up',
        'accommodation',
        'meals',
        'transport',
        'nursing_care',
        'icu',
        'lab_tests',
        'diagnostic_imaging',
    ],
    deluxe: [
        'consultation',
        'surgery',
        'hospitalization',
        'medication',
        'tests',
        'follow_up',
        'accommodation',
        'meals',
        'transport',
        'nursing_care',
        'icu',
        'physiotherapy',
        'lab_tests',
        'diagnostic_imaging',
        'anesthesia',
    ],
    vip: [
        'consultation',
        'surgery',
        'hospitalization',
        'medication',
        'tests',
        'follow_up',
        'accommodation',
        'meals',
        'transport',
        'nursing_care',
        'icu',
        'physiotherapy',
        'lab_tests',
        'diagnostic_imaging',
        'anesthesia',
        'medical_supplies',
    ],
    custom: [],
};

export const PACKAGE_ROOM_TYPES = {
    GENERAL_WARD: 'general_ward',
    SHARED_ROOM: 'shared_room',
    PRIVATE_ROOM: 'private_room',
    DELUXE_ROOM: 'deluxe_room',
    SUITE: 'suite',
    VIP_SUITE: 'vip_suite',
};

export const PACKAGE_ROOM_TYPE_LABELS = {
    general_ward: 'General Ward',
    shared_room: 'Shared Room (2-4 beds)',
    private_room: 'Private Room',
    deluxe_room: 'Deluxe Private Room',
    suite: 'Executive Suite',
    vip_suite: 'VIP Suite',
};

export const PACKAGE_MEAL_PLANS = {
    BASIC: 'basic',
    STANDARD: 'standard',
    PREMIUM: 'premium',
    SPECIAL_DIET: 'special_diet',
};

// Helper functions
export const isValidPackageType = (type) => {
    return Object.values(PACKAGE_TYPES).includes(type);
};

export const isValidInclusion = (inclusion) => {
    return Object.values(PACKAGE_INCLUSIONS).includes(inclusion);
};

export const getPackageTypeLabel = (type) => {
    return PACKAGE_TYPE_LABELS[type] || type;
};

export const getPackageTypeDescription = (type) => {
    return PACKAGE_TYPE_DESCRIPTIONS[type] || '';
};

export const getPackageInclusions = (packageType) => {
    return PACKAGE_FEATURES_BY_TYPE[packageType] || [];
};

export const hasInclusion = (packageType, inclusion) => {
    const inclusions = getPackageInclusions(packageType);
    return inclusions.includes(inclusion);
};

export const getInclusionLabel = (inclusion) => {
    return PACKAGE_INCLUSION_LABELS[inclusion] || inclusion;
};

export const comparePackages = (type1, type2) => {
    const hierarchy = Object.keys(PACKAGE_TYPES);
    return hierarchy.indexOf(type1) - hierarchy.indexOf(type2);
};

export const isUpgrade = (currentType, newType) => {
    return comparePackages(currentType, newType) < 0;
};
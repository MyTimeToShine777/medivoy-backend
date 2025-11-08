// Feature Add-On Types - Comprehensive - NO optional chaining
export const FEATURE_TYPES = {
    // Traveler count
    TRAVELER_SELF: 'traveler_self_only',
    TRAVELER_COMPANION: 'traveler_with_companion',

    // Travel options
    TRAVEL_TRAIN: 'travel_train',
    TRAVEL_FLIGHT: 'travel_flight',
    TRAVEL_BUS: 'travel_bus',
    TRAVEL_PRIVATE_CAR: 'travel_private_car',

    // Accommodation
    ACCOMMODATION_STANDARD: 'accommodation_standard',
    ACCOMMODATION_LUXURY: 'accommodation_luxury',
    ACCOMMODATION_BUDGET: 'accommodation_budget',
    ACCOMMODATION_HOSPITAL_ROOM: 'accommodation_hospital_room',

    // Visa support
    VISA_ASSISTANCE: 'visa_assistance',
    VISA_ON_ARRIVAL: 'visa_on_arrival',
    VISA_EXPEDITED: 'visa_expedited',

    // Insurance
    INSURANCE_MEDICAL: 'insurance_medical',
    INSURANCE_TRAVEL: 'insurance_travel',
    INSURANCE_COMBO: 'insurance_combo',
    INSURANCE_EMERGENCY_EVACUATION: 'insurance_emergency_evacuation',

    // Additional services
    SERVICE_AIRPORT_TRANSFER: 'service_airport_transfer',
    SERVICE_TRANSLATOR: 'service_translator',
    SERVICE_COORDINATOR: 'service_coordinator',
    SERVICE_FOLLOW_UP: 'service_follow_up',
    SERVICE_LOCAL_SIM: 'service_local_sim',
    SERVICE_WHEELCHAIR: 'service_wheelchair',
    SERVICE_DIETARY_SPECIAL: 'service_dietary_special',
};

export const FEATURE_CATEGORIES = {
    TRAVELER: 'traveler',
    TRAVEL: 'travel',
    ACCOMMODATION: 'accommodation',
    VISA: 'visa',
    INSURANCE: 'insurance',
    SERVICE: 'service',
};

export const FEATURE_CATEGORY_LABELS = {
    traveler: 'Number of Travelers',
    travel: 'Travel Transportation',
    accommodation: 'Accommodation Options',
    visa: 'Visa Support Services',
    insurance: 'Insurance Coverage',
    service: 'Additional Services',
};

export const FEATURE_TYPE_LABELS = {
    traveler_self_only: 'You Only',
    traveler_with_companion: 'With Family/Companion',

    travel_train: 'Train Travel',
    travel_flight: 'Flight Travel',
    travel_bus: 'Bus Travel',
    travel_private_car: 'Private Car Service',

    accommodation_standard: 'Standard Hotel Stay',
    accommodation_luxury: 'Luxury Hotel Stay',
    accommodation_budget: 'Budget Accommodation',
    accommodation_hospital_room: 'Private Hospital Room',

    visa_assistance: 'Visa Assistance Service',
    visa_on_arrival: 'Visa On Arrival Support',
    visa_expedited: 'Expedited Visa Processing',

    insurance_medical: 'Medical Insurance',
    insurance_travel: 'Travel Insurance',
    insurance_combo: 'Comprehensive Insurance Package',
    insurance_emergency_evacuation: 'Emergency Medical Evacuation',

    service_airport_transfer: 'Airport Pickup & Drop-off',
    service_translator: 'Language Translator Service',
    service_coordinator: 'Dedicated Hospital Coordinator',
    service_follow_up: 'Post-Treatment Follow-up Care',
    service_local_sim: 'Local SIM Card & Data',
    service_wheelchair: 'Wheelchair Assistance',
    service_dietary_special: 'Special Dietary Arrangements',
};

export const FEATURE_TYPE_DESCRIPTIONS = {
    traveler_self_only: 'Single traveler package - optimized for solo patients',
    traveler_with_companion: 'Package including companion accommodation and support',

    travel_train: 'First/Business class train tickets with seat selection',
    travel_flight: 'Economy/Business class flight booking with meals',
    travel_bus: 'Comfortable bus transport with onboard amenities',
    travel_private_car: 'Private car with driver for complete travel',

    accommodation_standard: '3-star hotel near hospital with breakfast and WiFi',
    accommodation_luxury: '5-star hotel with suite, meals, spa access, and premium transfers',
    accommodation_budget: 'Clean 2-star guesthouse with basic amenities',
    accommodation_hospital_room: 'Private hospital room upgrade during treatment stay',

    visa_assistance: 'Complete documentation help and consulate support (2-4 weeks)',
    visa_on_arrival: 'Certificate of Invitation letter and airport pickup assistance',
    visa_expedited: 'Fast-track visa processing in 5-7 days',

    insurance_medical: 'Coverage for treatment and hospitalization costs (full stay + 30 days)',
    insurance_travel: 'Flight delays, baggage loss, trip cancellation protection',
    insurance_combo: 'Complete medical + travel insurance with emergency evacuation',
    insurance_emergency_evacuation: 'Air ambulance and emergency transport coverage',

    service_airport_transfer: 'Car with driver for airport pickup and drop-off with waiting time',
    service_translator: 'Professional translator available 24/7 during your stay',
    service_coordinator: 'Dedicated coordinator for hospital appointments and support',
    service_follow_up: '3 follow-up consultations and post-treatment tests',
    service_local_sim: 'Local SIM card with data plan for duration of stay',
    service_wheelchair: 'Wheelchair rental and assistance throughout treatment',
    service_dietary_special: 'Customized meal plans for dietary restrictions',
};

export const FEATURE_PRICING_STRUCTURE = {
    traveler_self_only: { type: 'multiplier', value: 1.0 },
    traveler_with_companion: { type: 'multiplier', value: 1.4 },

    travel_train: { type: 'range', min: 500, max: 1500 },
    travel_flight: { type: 'range', min: 800, max: 3000 },
    travel_bus: { type: 'range', min: 300, max: 800 },
    travel_private_car: { type: 'range', min: 1000, max: 2500 },

    accommodation_standard: { type: 'per_night', min: 50, max: 150 },
    accommodation_luxury: { type: 'per_night', min: 200, max: 500 },
    accommodation_budget: { type: 'per_night', min: 30, max: 80 },
    accommodation_hospital_room: { type: 'per_night', min: 100, max: 300 },

    visa_assistance: { type: 'one_time', value: 200 },
    visa_on_arrival: { type: 'one_time', value: 100 },
    visa_expedited: { type: 'one_time', value: 400 },

    insurance_medical: { type: 'range', min: 500, max: 2000 },
    insurance_travel: { type: 'range', min: 200, max: 800 },
    insurance_combo: { type: 'range', min: 1500, max: 3000 },
    insurance_emergency_evacuation: { type: 'one_time', value: 5000 },

    service_airport_transfer: { type: 'one_time', value: 50 },
    service_translator: { type: 'per_hour', value: 30 },
    service_coordinator: { type: 'one_time', value: 500 },
    service_follow_up: { type: 'one_time', value: 200 },
    service_local_sim: { type: 'one_time', value: 25 },
    service_wheelchair: { type: 'per_day', value: 15 },
    service_dietary_special: { type: 'per_day', value: 20 },
};

export const MUTUALLY_EXCLUSIVE_FEATURES = [
    ['traveler_self_only', 'traveler_with_companion'],
    ['travel_train', 'travel_flight', 'travel_bus', 'travel_private_car'],
    ['accommodation_standard', 'accommodation_luxury', 'accommodation_budget'],
    ['visa_assistance', 'visa_on_arrival', 'visa_expedited'],
    ['insurance_medical', 'insurance_travel', 'insurance_combo'],
];

export const REQUIRED_TOGETHER_FEATURES = [
    // If companion is selected, accommodation upgrade might be suggested
];

// Helper functions
export const getFeatureCategory = (featureType) => {
    if (featureType.startsWith('traveler_')) return FEATURE_CATEGORIES.TRAVELER;
    if (featureType.startsWith('travel_')) return FEATURE_CATEGORIES.TRAVEL;
    if (featureType.startsWith('accommodation_')) return FEATURE_CATEGORIES.ACCOMMODATION;
    if (featureType.startsWith('visa_')) return FEATURE_CATEGORIES.VISA;
    if (featureType.startsWith('insurance_')) return FEATURE_CATEGORIES.INSURANCE;
    if (featureType.startsWith('service_')) return FEATURE_CATEGORIES.SERVICE;
    return null;
};

export const isValidFeatureType = (type) => {
    return Object.values(FEATURE_TYPES).includes(type);
};

export const getFeatureTypeLabel = (type) => {
    return FEATURE_TYPE_LABELS[type] || type;
};

export const getFeatureTypeDescription = (type) => {
    return FEATURE_TYPE_DESCRIPTIONS[type] || '';
};

export const getFeatureCategoryLabel = (category) => {
    return FEATURE_CATEGORY_LABELS[category] || category;
};

export const getFeaturesByCategory = (category) => {
    return Object.values(FEATURE_TYPES).filter(type => getFeatureCategory(type) === category);
};

export const areFeaturesCompatible = (feature1, feature2) => {
    for (const group of MUTUALLY_EXCLUSIVE_FEATURES) {
        if (group.includes(feature1) && group.includes(feature2)) {
            return false;
        }
    }
    return true;
};

export const validateFeatureSelection = (selectedFeatures) => {
    for (let i = 0; i < selectedFeatures.length; i++) {
        for (let j = i + 1; j < selectedFeatures.length; j++) {
            if (!areFeaturesCompatible(selectedFeatures[i], selectedFeatures[j])) {
                return {
                    valid: false,
                    conflicting: [selectedFeatures[i], selectedFeatures[j]],
                };
            }
        }
    }
    return { valid: true };
};

export const getFeaturePricing = (featureType) => {
    return FEATURE_PRICING_STRUCTURE[featureType] || null;
};
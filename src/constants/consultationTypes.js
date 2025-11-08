// Consultation Types - Comprehensive for new workflow - NO optional chaining
export const CONSULTATION_TYPES = {
    IN_PERSON: 'in_person',
    VIDEO_CALL: 'video_call',
    PHONE_CALL: 'phone_call',
    CHAT: 'chat',
    EMAIL: 'email',
};

export const CONSULTATION_TYPE_LABELS = {
    in_person: 'In-Person Consultation',
    video_call: 'Video Call Consultation',
    phone_call: 'Phone Call Consultation',
    chat: 'Chat Consultation',
    email: 'Email Consultation',
};

export const CONSULTATION_TYPE_DESCRIPTIONS = {
    in_person: 'Face-to-face consultation at hospital or clinic',
    video_call: 'Real-time video consultation via secure platform',
    phone_call: 'Voice call consultation with doctor',
    chat: 'Text-based chat consultation',
    email: 'Consultation via email correspondence',
};

export const CONSULTATION_PLATFORMS = {
    VIDEO_CALL: ['zoom', 'google_meet', 'microsoft_teams', 'custom_platform'],
    PHONE_CALL: ['regular_phone', 'voip', 'whatsapp_call'],
    CHAT: ['in_app_chat', 'whatsapp', 'telegram'],
    EMAIL: ['email'],
};

export const CONSULTATION_DURATIONS = {
    in_person: 30,
    video_call: 30,
    phone_call: 20,
    chat: 30,
    email: null, // Asynchronous
};

export const CONSULTATION_COSTS = {
    in_person: { type: 'variable', basePrice: 50 },
    video_call: { type: 'fixed', basePrice: 30 },
    phone_call: { type: 'fixed', basePrice: 20 },
    chat: { type: 'fixed', basePrice: 15 },
    email: { type: 'fixed', basePrice: 10 },
};

export const REQUIRES_PHYSICAL_PRESENCE = [
    'in_person',
];

export const REMOTE_CONSULTATION_TYPES = [
    'video_call',
    'phone_call',
    'chat',
    'email',
];

export const REAL_TIME_CONSULTATION_TYPES = [
    'in_person',
    'video_call',
    'phone_call',
    'chat',
];

export const ASYNCHRONOUS_CONSULTATION_TYPES = [
    'email',
];

// Helper functions
export const isValidConsultationType = (type) => {
    return Object.values(CONSULTATION_TYPES).includes(type);
};

export const getConsultationTypeLabel = (type) => {
    return CONSULTATION_TYPE_LABELS[type] || type;
};

export const getConsultationTypeDescription = (type) => {
    return CONSULTATION_TYPE_DESCRIPTIONS[type] || '';
};

export const getConsultationDuration = (type) => {
    return CONSULTATION_DURATIONS[type] || 30;
};

export const getConsultationCost = (type) => {
    return CONSULTATION_COSTS[type] || null;
};

export const isRemoteConsultation = (type) => {
    return REMOTE_CONSULTATION_TYPES.includes(type);
};

export const isRealTimeConsultation = (type) => {
    return REAL_TIME_CONSULTATION_TYPES.includes(type);
};

export const isAsynchronousConsultation = (type) => {
    return ASYNCHRONOUS_CONSULTATION_TYPES.includes(type);
};

export const requiresPhysicalPresence = (type) => {
    return REQUIRES_PHYSICAL_PRESENCE.includes(type);
};

export const getSupportedPlatforms = (type) => {
    return CONSULTATION_PLATFORMS[type.toUpperCase()] || [];
};

export const canRecordConsultation = (type) => {
    return ['video_call', 'phone_call'].includes(type);
};

export const supportsFileSharing = (type) => {
    return ['video_call', 'chat', 'email'].includes(type);
};

export const supportsScreenSharing = (type) => {
    return type === 'video_call';
};
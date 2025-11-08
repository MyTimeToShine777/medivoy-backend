// Notification Channels - Comprehensive - NO optional chaining
export const NOTIFICATION_CHANNELS = {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    IN_APP: 'in_app',
    WHATSAPP: 'whatsapp',
};

export const NOTIFICATION_CHANNEL_LABELS = {
    email: 'Email',
    sms: 'SMS',
    push: 'Push Notification',
    in_app: 'In-App Notification',
    whatsapp: 'WhatsApp',
};

export const NOTIFICATION_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

export const NOTIFICATION_TYPES = {
    BOOKING_CONFIRMATION: 'booking_confirmation',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
    EXPERT_CALL_SCHEDULED: 'expert_call_scheduled',
    EXPERT_CALL_REMINDER: 'expert_call_reminder',
    BOOKING_CANCELLED: 'booking_cancelled',
    DOCUMENT_UPLOADED: 'document_uploaded',
    DOCUMENT_VERIFIED: 'document_verified',
    TREATMENT_UPDATE: 'treatment_update',
    SYSTEM_ALERT: 'system_alert',
};

export const NOTIFICATION_PREFERENCES = {
    ALL: 'all',
    IMPORTANT_ONLY: 'important_only',
    NONE: 'none',
};

// Helper functions
export const isValidChannel = (channel) => {
    return Object.values(NOTIFICATION_CHANNELS).includes(channel);
};

export const getChannelLabel = (channel) => {
    return NOTIFICATION_CHANNEL_LABELS[channel] || channel;
};

export const isValidPriority = (priority) => {
    return Object.values(NOTIFICATION_PRIORITIES).includes(priority);
};

export const isValidNotificationType = (type) => {
    return Object.values(NOTIFICATION_TYPES).includes(type);
};
// Expert Call Statuses - Comprehensive - NO optional chaining
export const EXPERT_CALL_STATUSES = {
    PENDING: 'pending',
    SCHEDULED: 'scheduled',
    REMINDER_SENT: 'reminder_sent',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'rescheduled',
    NO_SHOW: 'no_show',
};

export const EXPERT_CALL_STATUS_LABELS = {
    pending: 'Waiting to Schedule',
    scheduled: 'Scheduled',
    reminder_sent: 'Reminder Sent',
    ongoing: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rescheduled: 'Rescheduled',
    no_show: 'Patient No-Show',
};

export const EXPERT_CALL_STATUS_DESCRIPTIONS = {
    pending: 'Expert call not yet scheduled',
    scheduled: 'Expert call scheduled with date and time',
    reminder_sent: 'Reminder notification sent to patient',
    ongoing: 'Expert call currently in progress',
    completed: 'Expert call completed successfully',
    cancelled: 'Expert call has been cancelled',
    rescheduled: 'Expert call has been rescheduled',
    no_show: 'Patient did not attend scheduled call',
};

export const EXPERT_CALL_STATUS_COLORS = {
    pending: '#FFA500',
    scheduled: '#1E90FF',
    reminder_sent: '#4169E1',
    ongoing: '#9370DB',
    completed: '#32CD32',
    cancelled: '#DC143C',
    rescheduled: '#FF8C00',
    no_show: '#8B0000',
};

export const EXPERT_CALL_FLOW = [
    'pending',
    'scheduled',
    'reminder_sent',
    'ongoing',
    'completed',
];

export const EXPERT_CALL_TRANSITIONS = {
    pending: ['scheduled', 'cancelled'],
    scheduled: ['reminder_sent', 'ongoing', 'rescheduled', 'cancelled', 'no_show'],
    reminder_sent: ['ongoing', 'rescheduled', 'cancelled', 'no_show'],
    ongoing: ['completed', 'cancelled'],
    completed: [],
    cancelled: ['rescheduled'],
    rescheduled: ['scheduled'],
    no_show: ['rescheduled'],
};

export const CALL_DURATIONS = {
    SHORT: 15, // 15 minutes
    STANDARD: 30, // 30 minutes
    EXTENDED: 45, // 45 minutes
    LONG: 60, // 60 minutes
};

export const REMINDER_TIMES = {
    ONE_DAY_BEFORE: 24 * 60, // 24 hours in minutes
    SIX_HOURS_BEFORE: 6 * 60, // 6 hours
    ONE_HOUR_BEFORE: 60, // 1 hour
    THIRTY_MIN_BEFORE: 30, // 30 minutes
};

// Helper functions
export const isValidExpertCallStatus = (status) => {
    return Object.values(EXPERT_CALL_STATUSES).includes(status);
};

export const canTransitionExpertCallStatus = (currentStatus, newStatus) => {
    if (!isValidExpertCallStatus(currentStatus) || !isValidExpertCallStatus(newStatus)) {
        return false;
    }

    const allowedTransitions = EXPERT_CALL_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
};

export const getExpertCallStatusLabel = (status) => {
    return EXPERT_CALL_STATUS_LABELS[status] || status;
};

export const getExpertCallStatusDescription = (status) => {
    return EXPERT_CALL_STATUS_DESCRIPTIONS[status] || '';
};

export const getExpertCallStatusColor = (status) => {
    return EXPERT_CALL_STATUS_COLORS[status] || '#000000';
};

export const canRescheduleCall = (status) => {
    return ['scheduled', 'reminder_sent', 'no_show'].includes(status);
};

export const canCancelCall = (status) => {
    return ['pending', 'scheduled', 'reminder_sent'].includes(status);
};

export const shouldSendReminder = (status) => {
    return status === EXPERT_CALL_STATUSES.SCHEDULED;
};

export const isCallActive = (status) => {
    return status === EXPERT_CALL_STATUSES.ONGOING;
};

export const isCallFinished = (status) => {
    return [
        EXPERT_CALL_STATUSES.COMPLETED,
        EXPERT_CALL_STATUSES.CANCELLED,
        EXPERT_CALL_STATUSES.NO_SHOW
    ].includes(status);
};
// Appointment Statuses - Comprehensive for new workflow - NO optional chaining
export const APPOINTMENT_STATUSES = {
    REQUESTED: 'requested',
    PENDING_CONFIRMATION: 'pending_confirmation',
    CONFIRMED: 'confirmed',
    REMINDED: 'reminded',
    CHECKED_IN: 'checked_in',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'rescheduled',
    NO_SHOW: 'no_show',
    MISSED: 'missed',
};

export const APPOINTMENT_STATUS_LABELS = {
    requested: 'Appointment Requested',
    pending_confirmation: 'Pending Confirmation',
    confirmed: 'Confirmed',
    reminded: 'Reminder Sent',
    checked_in: 'Checked In',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rescheduled: 'Rescheduled',
    no_show: 'Patient No-Show',
    missed: 'Missed Appointment',
};

export const APPOINTMENT_STATUS_DESCRIPTIONS = {
    requested: 'Patient has requested an appointment',
    pending_confirmation: 'Awaiting hospital/doctor confirmation',
    confirmed: 'Appointment confirmed by hospital',
    reminded: 'Reminder sent to patient',
    checked_in: 'Patient checked in at hospital',
    in_progress: 'Appointment currently in progress',
    completed: 'Appointment completed successfully',
    cancelled: 'Appointment cancelled',
    rescheduled: 'Appointment rescheduled to new date/time',
    no_show: 'Patient did not show up for appointment',
    missed: 'Appointment was missed',
};

export const APPOINTMENT_STATUS_COLORS = {
    requested: '#FFA500',
    pending_confirmation: '#FFD700',
    confirmed: '#32CD32',
    reminded: '#1E90FF',
    checked_in: '#9370DB',
    in_progress: '#4169E1',
    completed: '#228B22',
    cancelled: '#DC143C',
    rescheduled: '#FF8C00',
    no_show: '#8B0000',
    missed: '#A9A9A9',
};

export const APPOINTMENT_STATUS_FLOW = [
    'requested',
    'pending_confirmation',
    'confirmed',
    'reminded',
    'checked_in',
    'in_progress',
    'completed',
];

export const APPOINTMENT_STATUS_TRANSITIONS = {
    requested: ['pending_confirmation', 'cancelled'],
    pending_confirmation: ['confirmed', 'cancelled'],
    confirmed: ['reminded', 'checked_in', 'rescheduled', 'cancelled', 'no_show'],
    reminded: ['checked_in', 'rescheduled', 'cancelled', 'no_show'],
    checked_in: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
    rescheduled: ['pending_confirmation'],
    no_show: ['rescheduled'],
    missed: ['rescheduled'],
};

export const CANCELLABLE_APPOINTMENT_STATUSES = [
    'requested',
    'pending_confirmation',
    'confirmed',
    'reminded',
];

export const RESCHEDULABLE_APPOINTMENT_STATUSES = [
    'confirmed',
    'reminded',
    'no_show',
    'missed',
];

export const FINAL_APPOINTMENT_STATUSES = [
    'completed',
    'cancelled',
];

// Helper functions
export const isValidAppointmentStatus = (status) => {
    return Object.values(APPOINTMENT_STATUSES).includes(status);
};

export const canTransitionAppointmentStatus = (currentStatus, newStatus) => {
    if (!isValidAppointmentStatus(currentStatus) || !isValidAppointmentStatus(newStatus)) {
        return false;
    }

    const allowedTransitions = APPOINTMENT_STATUS_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
};

export const getAppointmentStatusLabel = (status) => {
    return APPOINTMENT_STATUS_LABELS[status] || status;
};

export const getAppointmentStatusDescription = (status) => {
    return APPOINTMENT_STATUS_DESCRIPTIONS[status] || '';
};

export const getAppointmentStatusColor = (status) => {
    return APPOINTMENT_STATUS_COLORS[status] || '#000000';
};

export const canCancelAppointment = (status) => {
    return CANCELLABLE_APPOINTMENT_STATUSES.includes(status);
};

export const canRescheduleAppointment = (status) => {
    return RESCHEDULABLE_APPOINTMENT_STATUSES.includes(status);
};

export const isFinalAppointmentStatus = (status) => {
    return FINAL_APPOINTMENT_STATUSES.includes(status);
};

export const isAppointmentActive = (status) => {
    return ['checked_in', 'in_progress'].includes(status);
};

export const isAppointmentUpcoming = (status) => {
    return ['confirmed', 'reminded'].includes(status);
};

export const needsReminder = (status) => {
    return status === APPOINTMENT_STATUSES.CONFIRMED;
};

export const getAppointmentProgress = (status) => {
    const index = APPOINTMENT_STATUS_FLOW.indexOf(status);
    if (index === -1) return 0;
    return Math.round(((index + 1) / APPOINTMENT_STATUS_FLOW.length) * 100);
};
// Payment Statuses - NO optional chaining
// Perfect for new workflow - all statuses are relevant
export const PAYMENT_STATUSES = {
    PENDING: 'pending',
    INITIATED: 'initiated',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    PARTIAL_REFUND: 'partial_refund',
};

export const PAYMENT_GATEWAYS = {
    STRIPE: 'stripe',
    RAZORPAY: 'razorpay',
};

export const PAYMENT_METHODS = {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    UPI: 'upi',
    NET_BANKING: 'net_banking',
    WALLET: 'wallet',
};

// Helper functions for new workflow
export const isValidPaymentStatus = (status) => {
    return Object.values(PAYMENT_STATUSES).includes(status);
};

export const isValidPaymentGateway = (gateway) => {
    return Object.values(PAYMENT_GATEWAYS).includes(gateway);
};

export const isValidPaymentMethod = (method) => {
    return Object.values(PAYMENT_METHODS).includes(method);
};

// Payment status transitions for new workflow
export const PAYMENT_STATUS_FLOW = {
    [PAYMENT_STATUSES.PENDING]: [
        PAYMENT_STATUSES.INITIATED,
        PAYMENT_STATUSES.CANCELLED,
    ],
    [PAYMENT_STATUSES.INITIATED]: [
        PAYMENT_STATUSES.PROCESSING,
        PAYMENT_STATUSES.FAILED,
        PAYMENT_STATUSES.CANCELLED,
    ],
    [PAYMENT_STATUSES.PROCESSING]: [
        PAYMENT_STATUSES.COMPLETED,
        PAYMENT_STATUSES.FAILED,
    ],
    [PAYMENT_STATUSES.COMPLETED]: [
        PAYMENT_STATUSES.REFUNDED,
        PAYMENT_STATUSES.PARTIAL_REFUND,
    ],
    [PAYMENT_STATUSES.FAILED]: [
        PAYMENT_STATUSES.PENDING, // Allow retry
    ],
};

export const canTransitionPaymentStatus = (currentStatus, newStatus) => {
    if (!isValidPaymentStatus(currentStatus) || !isValidPaymentStatus(newStatus)) {
        return false;
    }

    const allowedTransitions = PAYMENT_STATUS_FLOW[currentStatus];
    if (!allowedTransitions) {
        return false;
    }

    return allowedTransitions.includes(newStatus);
};

// New workflow: Payment is linked to booking confirmation
export const PAYMENT_TRIGGERS = {
    BOOKING_CONFIRMATION: 'booking_confirmation',
    EXPERT_CALL_SCHEDULED: 'expert_call_scheduled',
    TREATMENT_STARTED: 'treatment_started',
    ADDITIONAL_SERVICES: 'additional_services',
};

export const isPaymentTriggerValid = (trigger) => {
    return Object.values(PAYMENT_TRIGGERS).includes(trigger);
};
// Payment Statuses - NO optional chaining
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
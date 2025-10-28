/**
 * Status codes for bookings and appointments
 */

const BOOKING_STATUS = {
  REQUESTED: 'requested',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  AWAITING_MEDICAL_DETAILS: 'awaiting_medical_details',
  QUOTATION_SENT: 'quotation_sent',
  CONFIRMED: 'confirmed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_COMPLETED: 'payment_completed',
  INVOICE_SENT: 'invoice_sent',
  TRAVEL_ARRANGEMENT: 'travel_arrangement',
  IN_TREATMENT: 'in_treatment',
  COMPLETED: 'completed',
  FEEDBACK_RECEIVED: 'feedback_received'
};

const APPOINTMENT_STATUS = {
  REQUESTED: 'requested',
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  AWAITING_CONSULTATION: 'awaiting_consultation',
  IN_PROGRESS: 'in_progress',
  PRESCRIPTION_PROVIDED: 'prescription_provided',
  FOLLOW_UP_SCHEDULED: 'follow_up_scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

const SUPPORT_TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  WAITING_FOR_CUSTOMER: 'waiting_for_customer',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

const SUPPORT_TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

module.exports = {
  BOOKING_STATUS,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  INVOICE_STATUS,
  SUPPORT_TICKET_STATUS,
  SUPPORT_TICKET_PRIORITY
};
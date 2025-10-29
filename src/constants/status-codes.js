// Status codes for bookings and appointments in the Medivoy Healthcare System

module.exports = {
  // Booking status codes (12-stage workflow)
  BOOKING_REQUESTED: 'requested',
  BOOKING_UNDER_REVIEW: 'under_review',
  BOOKING_ACCEPTED: 'accepted',
  BOOKING_REJECTED: 'rejected',
  BOOKING_AWAITING_MEDICAL_DETAILS: 'awaiting_medical_details',
  BOOKING_QUOTATION_SENT: 'quotation_sent',
  BOOKING_CONFIRMED: 'confirmed',
  BOOKING_PAYMENT_COMPLETED: 'payment_completed',
  BOOKING_INVOICE_SENT: 'invoice_sent',
  BOOKING_TRAVEL_ARRANGEMENT: 'travel_arrangement',
  BOOKING_IN_TREATMENT: 'in_treatment',
  BOOKING_COMPLETED: 'completed',
  BOOKING_FEEDBACK_RECEIVED: 'feedback_received',

  // Appointment status codes (9-stage workflow)
  APPOINTMENT_REQUESTED: 'requested',
  APPOINTMENT_CONFIRMED: 'confirmed',
  APPOINTMENT_AWAITING_CONSULTATION: 'awaiting_consultation',
  APPOINTMENT_IN_PROGRESS: 'in_progress',
  APPOINTMENT_PRESCRIPTION_PROVIDED: 'prescription_provided',
  APPOINTMENT_FOLLOW_UP_SCHEDULED: 'follow_up_scheduled',
  APPOINTMENT_COMPLETED: 'completed',
  APPOINTMENT_CANCELLED: 'cancelled',
  APPOINTMENT_NO_SHOW: 'no_show',

  // Treatment status codes
  TREATMENT_ACTIVE: 'active',
  TREATMENT_INACTIVE: 'inactive',

  // Hospital verification status codes
  HOSPITAL_UNVERIFIED: 'unverified',
  HOSPITAL_PENDING_VERIFICATION: 'pending_verification',
  HOSPITAL_VERIFIED: 'verified',
  HOSPITAL_REJECTED: 'rejected',
};
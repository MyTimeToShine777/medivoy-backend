/**
 * User roles constants
 */

const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  HOSPITAL_ADMIN: 'hospital_admin'
};

const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'manage_users',
    'manage_hospitals',
    'manage_doctors',
    'manage_patients',
    'manage_treatments',
    'manage_packages',
    'manage_bookings',
    'manage_appointments',
    'manage_insurance',
    'manage_subscriptions',
    'view_analytics',
    'manage_content'
  ],
  [USER_ROLES.HOSPITAL_ADMIN]: [
    'manage_hospital',
    'manage_doctors',
    'view_bookings',
    'view_appointments',
    'view_analytics'
  ],
  [USER_ROLES.DOCTOR]: [
    'view_appointments',
    'manage_appointments',
    'view_patients',
    'manage_prescriptions',
    'manage_medical_records'
  ],
  [USER_ROLES.PATIENT]: [
    'view_profile',
    'manage_profile',
    'create_appointments',
    'view_appointments',
    'view_medical_records',
    'create_bookings'
  ]
};

module.exports = {
  USER_ROLES,
  ROLE_PERMISSIONS
};
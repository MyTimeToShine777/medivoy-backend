// User Roles - NO optional chaining
export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    MEDIVOY_STAFF: 'medivoy_staff',
    PATIENT: 'patient',
};

export const ROLE_HIERARCHY = {
    super_admin: 5,
    admin: 4,
    doctor: 3,
    medivoy_staff: 2,
    patient: 1,
};

export const ROLE_DESCRIPTIONS = {
    super_admin: 'System administrator with full access',
    admin: 'Platform administrator',
    doctor: 'Medical doctor',
    medivoy_staff: 'Medivoy staff member',
    patient: 'Patient user',
};
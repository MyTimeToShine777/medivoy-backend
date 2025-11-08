// User Roles - Comprehensive - NO optional chaining
export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    HOSPITAL_ADMIN: 'hospital_admin',
    STAFF: 'staff',
    PATIENT: 'patient',
};

export const ROLE_HIERARCHY = {
    super_admin: 5,
    admin: 4,
    hospital_admin: 3,
    staff: 2,
    patient: 1,
};

export const ROLE_NAMES = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    hospital_admin: 'Hospital Administrator',
    staff: 'Medivoy Staff',
    patient: 'Patient',
};

export const ROLE_DESCRIPTIONS = {
    super_admin: 'Full system access with all administrative privileges',
    admin: 'System administration and configuration management',
    hospital_admin: 'Hospital management and operations',
    staff: 'Medivoy staff for customer support and coordination',
    patient: 'Patient access to booking and medical services',
};

export const ROLE_PERMISSIONS = {
    super_admin: [
        'system_management',
        'database_operations',
        'role_management',
        'audit_logs',
        'all_permissions',
    ],
    admin: [
        'user_management',
        'treatment_management',
        'hospital_management',
        'country_city_management',
        'feature_addon_management',
        'analytics_access',
        'settings_management',
    ],
    hospital_admin: [
        'hospital_profile_management',
        'doctor_management',
        'package_management',
        'booking_view',
        'hospital_analytics',
    ],
    staff: [
        'booking_management',
        'patient_support',
        'expert_call_management',
        'payment_verification',
        'report_generation',
    ],
    patient: [
        'booking_creation',
        'profile_management',
        'payment_initiation',
        'document_upload',
        'expert_call_scheduling',
    ],
};

export const ROLE_ACCESS_LEVELS = {
    PUBLIC: 0,
    PATIENT: 1,
    STAFF: 2,
    HOSPITAL_ADMIN: 3,
    ADMIN: 4,
    SUPER_ADMIN: 5,
};

// Helper functions
export const isValidRole = (role) => {
    return Object.values(USER_ROLES).includes(role);
};

export const hasHigherRole = (userRole, requiredRole) => {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
};

export const canAccessRole = (userRole, targetRole) => {
    return hasHigherRole(userRole, targetRole);
};

export const getRoleDisplayName = (role) => {
    return ROLE_NAMES[role] || role;
};

export const getRoleDescription = (role) => {
    return ROLE_DESCRIPTIONS[role] || '';
};

export const getRolePermissions = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};

export const hasPermission = (userRole, permission) => {
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission) || permissions.includes('all_permissions');
};

export const getAllRoles = () => {
    return Object.values(USER_ROLES);
};

export const getRolesByHierarchy = () => {
    return Object.entries(ROLE_HIERARCHY)
        .sort((a, b) => b[1] - a[1])
        .map(([role]) => role);
};
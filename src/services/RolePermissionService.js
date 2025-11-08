// Role Permission Service - Role & permission management
// NO optional chaining - Production Ready

class RolePermissionService {
    constructor() {
        this.roles = {
            ADMIN: 'admin',
            DOCTOR: 'doctor',
            PATIENT: 'patient',
            STAFF: 'staff',
            HOSPITAL_ADMIN: 'hospital_admin',
        };

        this.permissions = {
            // User permissions
            USER_CREATE: 'user:create',
            USER_READ: 'user:read',
            USER_UPDATE: 'user:update',
            USER_DELETE: 'user:delete',

            // Booking permissions
            BOOKING_CREATE: 'booking:create',
            BOOKING_READ: 'booking:read',
            BOOKING_UPDATE: 'booking:update',
            BOOKING_CANCEL: 'booking:cancel',

            // Payment permissions
            PAYMENT_CREATE: 'payment:create',
            PAYMENT_READ: 'payment:read',
            PAYMENT_REFUND: 'payment:refund',

            // Doctor permissions
            DOCTOR_CREATE: 'doctor:create',
            DOCTOR_UPDATE: 'doctor:update',
            DOCTOR_SCHEDULE: 'doctor:schedule',

            // Admin permissions
            ADMIN_ALL: 'admin:all',
        };

        this.rolePermissions = {
            [this.roles.ADMIN]: Object.values(this.permissions),
            [this.roles.DOCTOR]: [
                this.permissions.USER_READ,
                this.permissions.BOOKING_READ,
                this.permissions.DOCTOR_SCHEDULE,
                this.permissions.DOCTOR_UPDATE,
            ],
            [this.roles.PATIENT]: [
                this.permissions.USER_READ,
                this.permissions.USER_UPDATE,
                this.permissions.BOOKING_CREATE,
                this.permissions.BOOKING_READ,
            ],
            [this.roles.STAFF]: [
                this.permissions.USER_READ,
                this.permissions.BOOKING_READ,
                this.permissions.BOOKING_UPDATE,
            ],
            [this.roles.HOSPITAL_ADMIN]: [
                this.permissions.DOCTOR_CREATE,
                this.permissions.DOCTOR_UPDATE,
                this.permissions.BOOKING_READ,
                this.permissions.STAFF,
            ],
        };
    }

    // ========== CHECK PERMISSION ==========
    hasPermission(userRole, requiredPermission) {
        if (!userRole || !requiredPermission) {
            return false;
        }

        const permissions = this.rolePermissions[userRole];

        if (!permissions) {
            return false;
        }

        return permissions.includes(requiredPermission) || permissions.includes(this.permissions.ADMIN_ALL);
    }

    // ========== CHECK MULTIPLE PERMISSIONS ==========
    hasAnyPermission(userRole, permissions) {
        if (!userRole || !permissions || permissions.length === 0) {
            return false;
        }

        return permissions.some(permission => this.hasPermission(userRole, permission));
    }

    // ========== CHECK ALL PERMISSIONS ==========
    hasAllPermissions(userRole, permissions) {
        if (!userRole || !permissions || permissions.length === 0) {
            return false;
        }

        return permissions.every(permission => this.hasPermission(userRole, permission));
    }

    // ========== GET ROLE PERMISSIONS ==========
    getRolePermissions(role) {
        const permissions = this.rolePermissions[role];

        if (!permissions) {
            return { success: false, error: 'Role not found' };
        }

        return { success: true, data: permissions };
    }

    // ========== CHECK RESOURCE OWNERSHIP ==========
    canAccessResource(userRole, userId, resourceOwnerId) {
        if (userRole === this.roles.ADMIN) {
            return true;
        }

        return userId === resourceOwnerId;
    }

    // ========== GET ALL ROLES ==========
    getAllRoles() {
        return {
            success: true,
            data: Object.values(this.roles),
        };
    }

    // ========== GET ALL PERMISSIONS ==========
    getAllPermissions() {
        return {
            success: true,
            data: Object.values(this.permissions),
        };
    }
}

export default new RolePermissionService();
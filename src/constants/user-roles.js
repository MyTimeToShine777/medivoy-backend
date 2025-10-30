// User roles and permissions for the Medivoy Healthcare System

module.exports = {
  // User roles
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
  HOSPITAL_ADMIN: "hospital_admin",

  // Role hierarchy
  ROLE_HIERARCHY: {
    admin: 4,
    hospital_admin: 3,
    doctor: 2,
    patient: 1,
  },

  // Permissions
  PERMISSION_READ: "read",
  PERMISSION_WRITE: "write",
  PERMISSION_UPDATE: "update",
  PERMISSION_DELETE: "delete",

  // Default permissions by role
  DEFAULT_PERMISSIONS: {
    admin: ["read", "write", "update", "delete"],
    hospital_admin: ["read", "write", "update"],
    doctor: ["read", "write", "update"],
    patient: ["read", "write"],
  },
};

// User Model - Comprehensive with all patient/staff/admin fields
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';
import { USER_ROLES } from '../constants/userRoles.js';

export default (sequelize) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique user identifier',
        },

        // ========== AUTHENTICATION ==========
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Email already exists',
            },
            lowercase: true,
            trim: true,
            validate: {
                isEmail: {
                    msg: 'Must be a valid email address',
                },
            },
            index: true,
            comment: 'User email (must be unique)',
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Hashed password',
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Email verification status',
        },
        emailVerifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When email was verified',
        },

        // ========== PROFILE INFORMATION ==========
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'First name must be between 2 and 50 characters',
                },
            },
            comment: 'User first name',
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'Last name must be between 2 and 50 characters',
                },
            },
            comment: 'User last name',
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: {
                msg: 'Phone number already exists',
            },
            validate: {
                is: {
                    args: /^[+]?[0-9]{10,15}$/,
                    msg: 'Invalid phone number format',
                },
            },
            comment: 'Contact phone number',
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to profile picture',
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 500],
                    msg: 'Bio must not exceed 500 characters',
                },
            },
            comment: 'User biography',
        },

        // ========== ROLE MANAGEMENT ==========
        role: {
            type: DataTypes.ENUM(
                Object.values(USER_ROLES)
            ),
            defaultValue: USER_ROLES.PATIENT,
            comment: 'User role (patient/staff/admin/etc)',
        },
        permissions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Custom permissions array',
        },

        // ========== PATIENT-SPECIFIC FIELDS (WORKFLOW) ==========
        // Step 8 patient info
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isBefore: {
                    args: new Date().toISOString().split('T')[0],
                    msg: 'Date of birth must be in the past',
                },
            },
            comment: 'Patient date of birth',
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
            allowNull: true,
            comment: 'Patient gender',
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Patient home city (Step 8)',
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Patient state/province',
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Patient home country',
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Postal/ZIP code',
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Complete home address',
        },

        // ========== MEDICAL INFORMATION ==========
        bloodGroup: {
            type: DataTypes.ENUM('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'),
            allowNull: true,
            comment: 'Patient blood group',
        },
        allergies: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of medication/food allergies',
        },
        comorbidConditions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Pre-existing medical conditions (Step 8)',
        },
        currentMedications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of current medications',
        },
        medicalHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Past surgeries, treatments, hospitalizations',
        },

        // ========== INSURANCE INFORMATION ==========
        insuranceStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Has health insurance (Step 9)',
        },
        insuranceProvider: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Insurance company name',
        },
        insurancePolicyNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Insurance policy number',
        },
        insuranceExpireDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Insurance expiration date',
        },
        insuranceDocuments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'URLs to insurance documents',
        },

        // ========== EMERGENCY CONTACT ==========
        emergencyContactName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Emergency contact full name',
        },
        emergencyContactPhone: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Emergency contact phone number',
        },
        emergencyContactRelation: {
            type: DataTypes.ENUM('spouse', 'child', 'parent', 'sibling', 'friend', 'other'),
            allowNull: true,
            comment: 'Relationship to patient',
        },

        // ========== STAFF/ADMIN FIELDS ==========
        departmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'departments',
                key: 'departmentId',
            },
            comment: 'For staff/admin users',
        },
        staffType: {
            type: DataTypes.ENUM(
                'customer_support',
                'medical_coordinator',
                'travel_coordinator',
                'insurance_specialist',
                'account_manager',
                'booking_specialist',
                'patient_relations',
                'financial_counselor'
            ),
            allowNull: true,
            comment: 'Type of staff (if role is staff)',
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
            comment: 'Affiliated hospital (if applicable)',
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: {
                msg: 'Employee ID already exists',
            },
            comment: 'Staff employee ID',
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Staff designation/title',
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Staff department',
        },

        // ========== PREFERENCES ==========
        preferredLanguage: {
            type: DataTypes.STRING,
            defaultValue: 'en',
            comment: 'Preferred language code (en, hi, es, etc)',
        },
        notificationPreferences: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                email: true,
                sms: true,
                push: true,
                whatsapp: false,
            },
            comment: 'Notification channel preferences',
        },
        privacySettings: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                profileVisibility: 'private',
                shareWithHospitals: true,
                shareWithDoctors: true,
            },
            comment: 'Privacy settings',
        },

        // ========== ACCOUNT STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
            comment: 'Account active status',
        },
        isSuspended: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Account suspended status',
        },
        suspensionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for suspension',
        },
        suspendedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When account was suspended',
        },

        // ========== TRACKING ==========
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Last login timestamp',
        },
        lastLoginIP: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'IP address of last login',
        },
        loginAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Failed login attempts counter',
        },
        lockoutUntil: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Account locked until this date',
        },

        // ========== VERIFICATION ==========
        twoFactorEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        twoFactorSecret: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        backupCodes: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== METADATA ==========
        deviceTokens: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Push notification device tokens',
        },
        socialLinks: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Social media links',
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'User tags for segmentation',
        },
    }, {
        timestamps: true,
        tableName: 'users',
        indexes: [
            { unique: true, fields: ['email'] },
            { fields: ['role'] },
            { fields: ['isActive'] },
            { fields: ['isSuspended'] },
            { fields: ['createdAt'] },
            { fields: ['hospitalId'] },
        ],
        scopes: {
            active: {
                where: { isActive: true, isSuspended: false },
            },
            patients: {
                where: { role: USER_ROLES.PATIENT },
            },
            staff: {
                where: { role: USER_ROLES.STAFF },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    User.prototype.getFullName = function() {
        return `${this.firstName} ${this.lastName}`;
    };

    User.prototype.isPatient = function() {
        return this.role === USER_ROLES.PATIENT;
    };

    User.prototype.isStaff = function() {
        return this.role === USER_ROLES.STAFF;
    };

    User.prototype.isAdmin = function() {
        return [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.HOSPITAL_ADMIN].includes(this.role);
    };

    User.prototype.canManageBookings = function() {
        return this.role === USER_ROLES.STAFF || this.isAdmin();
    };

    User.prototype.getAge = function() {
        if (!this.dateOfBirth) return null;
        const today = new Date();
        let age = today.getFullYear() - this.dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
            age--;
        }
        return age;
    };

    // ========== CLASS METHODS ==========
    User.associate = (models) => {
        User.hasMany(models.Booking, { foreignKey: 'userId', as: 'bookings' });
        User.hasMany(models.Payment, { foreignKey: 'userId', as: 'payments' });
        User.hasMany(models.Document, { foreignKey: 'userId', as: 'documents' });
    };

    return User;
};
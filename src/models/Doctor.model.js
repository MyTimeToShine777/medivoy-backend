// Doctor Model - Hospital consultants and specialists - COMPREHENSIVE
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Doctor = sequelize.define('Doctor', {
        doctorId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique doctor identifier',
        },

        // ========== RELATIONSHIPS ==========
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
            index: true,
            comment: 'Hospital this doctor works at',
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Linked user account (if registered)',
        },
        departmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'departments',
                key: 'departmentId',
            },
            comment: 'Department affiliation',
        },

        // ========== PERSONAL INFORMATION ==========
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'First name must be between 2 and 50 characters',
                },
            },
            comment: 'Doctor first name',
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
            comment: 'Doctor last name',
        },
        middleName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isBefore: new Date().toISOString().split('T')[0],
            },
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: true,
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to doctor profile picture',
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 1000],
                    msg: 'Bio must not exceed 1000 characters',
                },
            },
            comment: 'Doctor biography',
        },

        // ========== CONTACT INFORMATION ==========
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Email already registered',
            },
            lowercase: true,
            trim: true,
            validate: {
                isEmail: {
                    msg: 'Must be a valid email address',
                },
            },
            comment: 'Doctor email address',
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^[+]?[0-9]{10,15}$/,
                    msg: 'Invalid phone number format',
                },
            },
        },
        mobilePhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        officePhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== PROFESSIONAL QUALIFICATIONS ==========
        qualification: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [2, 100],
                    msg: 'Qualification must be between 2 and 100 characters',
                },
            },
            comment: 'e.g., MBBS, MD, DM, PhD',
        },
        qualifications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of detailed qualifications with year and institution',
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [2, 100],
                    msg: 'Specialization must be between 2 and 100 characters',
                },
            },
            comment: 'Main specialization',
        },
        specializations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of specializations',
        },
        subSpecialization: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Secondary specialization',
        },
        subSpecializations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== PROFESSIONAL CREDENTIALS ==========
        registrationNumber: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Registration number already exists',
            },
            allowNull: true,
            comment: 'Medical council registration number',
        },
        registrationCouncil: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'e.g., GMC, NMC, etc',
        },
        registrationExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        licenseNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        licenseExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Medical license expiration date',
        },
        licenseDocumentUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== EXPERIENCE ==========
        yearsOfExperience: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
            comment: 'Total years of medical practice',
        },
        experienceDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Detailed employment history',
        },
        previousHospitals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'List of previous hospital affiliations',
        },
        joinDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When doctor joined this hospital',
        },

        // ========== CERTIFICATIONS & TRAINING ==========
        certifications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of certifications with dates',
        },
        trainingPrograms: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Training programs attended',
        },
        publications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Research publications',
        },
        awards: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Medical awards and recognitions',
        },

        // ========== CONSULTATION DETAILS ==========
        consultationFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0,
            },
            comment: 'Fee for expert consultation',
        },
        consultationDuration: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            validate: {
                min: 15,
                max: 120,
            },
            comment: 'Standard consultation duration in minutes',
        },
        availableForConsultation: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        consultationTypes: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['video', 'phone'],
            comment: 'Types of consultation available',
        },

        // ========== LANGUAGES ==========
        languages: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['english', 'hindi'],
            comment: 'Languages doctor speaks',
        },
        fluencyLevel: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Fluency level for each language (beginner/intermediate/fluent/native)',
        },

        // ========== STATISTICS & PERFORMANCE ==========
        totalExpertCalls: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Total number of consultations completed',
        },
        totalBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        completedBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
            validate: {
                min: 0,
                max: 5,
            },
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        responseTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Average response time in minutes',
        },
        cancellationRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Cancellation percentage',
        },

        // ========== SPECIALIZATIONS & EXPERTISE ==========
        treatmentSpecialties: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of treatments doctor specializes in',
        },
        proceduresPerformed: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Procedures the doctor performs',
        },
        successRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
            comment: 'Treatment success rate %',
        },
        complicationRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Complication rate %',
        },

        // ========== AVAILABILITY & SCHEDULING ==========
        workingDays: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            comment: 'Days doctor works',
        },
        workingHours: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                start: '09:00',
                end: '18:00',
            },
        },
        timeZone: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'UTC',
        },
        holidays: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Leave dates and holidays',
        },

        // ========== MEDIA & VERIFICATION ==========
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            index: true,
            comment: 'Doctor verification status',
        },
        verificationStatus: {
            type: DataTypes.ENUM('pending', 'verified', 'rejected'),
            defaultValue: 'pending',
        },
        verificationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verificationDocuments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Verification document URLs',
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            index: true,
        },
        featuredUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== STATUS & ACCOUNT ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
        isSuspended: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        suspensionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        suspendedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        suspendedUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== METADATA ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Hospital admin notes',
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lastActivityAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'doctors',
        indexes: [
            { fields: ['hospitalId'] },
            { fields: ['specialization'] },
            { fields: ['isActive'] },
            { fields: ['isVerified'] },
            { fields: ['isFeatured'] },
            { unique: true, fields: ['registrationNumber'] },
        ],
        scopes: {
            active: {
                where: { isActive: true, isSuspended: false },
            },
            verified: {
                where: { isVerified: true },
            },
            featured: {
                where: { isFeatured: true },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Doctor.prototype.getFullName = function() {
        const middle = this.middleName ? ` ${this.middleName}` : '';
        return `${this.firstName}${middle} ${this.lastName}`;
    };

    Doctor.prototype.getAge = function() {
        if (!this.dateOfBirth) return null;
        const today = new Date();
        let age = today.getFullYear() - this.dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
            age--;
        }
        return age;
    };

    Doctor.prototype.getExperienceLevel = function() {
        if (!this.yearsOfExperience) return 'Unknown';
        if (this.yearsOfExperience < 2) return 'Fresher';
        if (this.yearsOfExperience < 5) return 'Junior';
        if (this.yearsOfExperience < 10) return 'Mid-Level';
        if (this.yearsOfExperience < 20) return 'Senior';
        return 'Expert';
    };

    Doctor.prototype.isAvailableForConsultation = function() {
        return this.availableForConsultation && this.isActive && !this.isSuspended;
    };

    Doctor.prototype.canConsult = function(treatmentType) {
        return this.treatmentSpecialties.includes(treatmentType) && this.isAvailableForConsultation();
    };

    Doctor.prototype.getConsultationFee = function() {
        return {
            amount: this.consultationFee,
            duration: this.consultationDuration,
            types: this.consultationTypes,
        };
    };

    Doctor.prototype.getRating = function() {
        if (this.totalReviews === 0) return null;
        return {
            rating: this.averageRating,
            reviewCount: this.totalReviews,
            percentage: this.totalReviews > 0 ? ((this.totalReviews / this.totalExpertCalls) * 100).toFixed(2) : 0,
        };
    };

    Doctor.prototype.getPerformanceMetrics = function() {
        return {
            totalConsultations: this.totalExpertCalls,
            completedBookings: this.completedBookings,
            averageRating: this.averageRating,
            totalReviews: this.totalReviews,
            responseTime: this.responseTime,
            cancellationRate: this.cancellationRate,
            successRate: this.successRate,
        };
    };

    Doctor.prototype.isCertificateExpired = function() {
        if (!this.licenseExpiry) return false;
        return new Date(this.licenseExpiry) < new Date();
    };

    Doctor.prototype.getDaysUntilExpiry = function() {
        if (!this.licenseExpiry) return null;
        const today = new Date();
        const expiry = new Date(this.licenseExpiry);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // ========== CLASS METHODS ==========
    Doctor.findBySpecialization = async function(specialization) {
        return this.findAll({
            where: { specialization },
            scope: ['active', 'verified'],
        });
    };

    Doctor.findTopRatedDoctors = async function(limit = 10) {
        return this.findAll({
            scope: ['active'],
            order: [
                ['averageRating', 'DESC']
            ],
            limit,
        });
    };

    // ========== ASSOCIATIONS ==========
    Doctor.associate = (models) => {
        Doctor.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Doctor.belongsTo(models.User, { foreignKey: 'userId', as: 'account' });
        Doctor.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
        Doctor.hasMany(models.ExpertCall, { foreignKey: 'expertId', as: 'expertCalls' });
        Doctor.hasMany(models.DoctorSchedule, { foreignKey: 'doctorId', as: 'schedules' });
        Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId', as: 'appointments' });
    };

    return Doctor;
};
// Hospital Doctor Model - Junction table for doctors at hospitals
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const HospitalDoctor = sequelize.define('HospitalDoctor', {
        hospitalDoctorId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
            index: true,
        },
        departmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'departments',
                key: 'departmentId',
            },
        },

        // ========== AFFILIATION DETAILS ==========
        affiliationType: {
            type: DataTypes.ENUM('full_time', 'part_time', 'visiting', 'consultant', 'contract'),
            defaultValue: 'full_time',
        },
        joinDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isCurrentAffiliation: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== DESIGNATION AT HOSPITAL ==========
        designation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        position: {
            type: DataTypes.ENUM('junior', 'senior', 'consultant', 'head_of_department', 'director'),
            allowNull: true,
        },

        // ========== AVAILABILITY ==========
        availableForConsultation: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        consultationFeeAtHospital: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Hospital-specific fee if different',
        },
        availableForOnlineConsultation: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        onlineConsultationFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        // ========== SPECIALTIES AT THIS HOSPITAL ==========
        specialties: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        procedures: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        treatmentsOffered: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== AVAILABILITY SCHEDULE ==========
        availableDays: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        },
        consultationTiming: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                startTime: '09:00',
                endTime: '17:00',
            },
        },

        // ========== PERFORMANCE METRICS ==========
        totalAppointments: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        completedAppointments: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== CREDENTIALS AT HOSPITAL ==========
        credentialStatus: {
            type: DataTypes.ENUM('verified', 'pending', 'rejected', 'suspended'),
            defaultValue: 'verified',
        },
        credentialVerifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        credentialVerifiedDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        credentialExpiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== RESTRICTIONS ==========
        hasRestrictions: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        restrictionDetails: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== METADATA ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
    }, {
        timestamps: true,
        tableName: 'hospital_doctors',
        indexes: [
            { fields: ['hospitalId'] },
            { fields: ['doctorId'] },
            { fields: ['departmentId'] },
            { fields: ['isActive'] },
            { unique: true, fields: ['hospitalId', 'doctorId'] },
        ],
    });

    HospitalDoctor.prototype.isCurrentlyAffiliatedWith = function() {
        if (!this.isCurrentAffiliation) return false;
        if (this.endDate && new Date(this.endDate) < new Date()) return false;
        return this.isActive;
    };

    HospitalDoctor.prototype.getAffiliationDuration = function() {
        const start = new Date(this.joinDate);
        const end = this.endDate ? new Date(this.endDate) : new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return Math.floor(months);
    };

    HospitalDoctor.associate = (models) => {
        HospitalDoctor.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        HospitalDoctor.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        HospitalDoctor.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    };

    return HospitalDoctor;
};
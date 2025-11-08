// Patient Model - Extended patient-specific information
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Patient = sequelize.define('Patient', {
        patientId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            unique: true,
        },

        // ========== MEDICAL HISTORY ==========
        bloodType: {
            type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
            allowNull: true,
        },
        height: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Height in cm',
        },
        weight: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Weight in kg',
        },
        bmi: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },

        // ========== ALLERGIES & CONDITIONS ==========
        allergies: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'List of allergies',
        },
        chronicConditions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        familyMedicalHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        surgicalHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== MEDICATIONS ==========
        currentMedications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        pastMedications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== LIFESTYLE ==========
        smoker: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        alcoholUser: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        exerciseFrequency: {
            type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'rarely', 'never'),
            allowNull: true,
        },

        // ========== MEDICAL PREFERENCES ==========
        preferredLanguage: {
            type: DataTypes.STRING,
            defaultValue: 'en',
        },
        preferredGenderOfDoctor: {
            type: DataTypes.ENUM('male', 'female', 'no_preference'),
            defaultValue: 'no_preference',
        },
        hasInsurance: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== EMERGENCY CONTACT ==========
        emergencyContactName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        emergencyContactPhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        emergencyContactRelation: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== STATISTICS ==========
        totalConsultations: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalTreatments: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalHospitals: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    }, {
        timestamps: true,
        tableName: 'patients',
        indexes: [
            { unique: true, fields: ['userId'] },
            { fields: ['isActive'] },
        ],
    });

    Patient.prototype.calculateBMI = function() {
        if (!this.height || !this.weight) return null;
        const heightInM = this.height / 100;
        return (this.weight / (heightInM * heightInM)).toFixed(2);
    };

    Patient.associate = (models) => {
        Patient.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Patient;
};
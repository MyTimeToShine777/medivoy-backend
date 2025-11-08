// Consultation Model - Doctor consultations with patients
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Consultation = sequelize.define('Consultation', {
        consultationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            index: true,
        },
        appointmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'appointments',
                key: 'appointmentId',
            },
        },
        patientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
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
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
        },

        // ========== CONSULTATION DETAILS ==========
        consultationNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(
                'initial',
                'follow_up',
                'emergency',
                'remote',
                'in_person',
                'video_call',
                'phone_call'
            ),
            allowNull: false,
        },
        mode: {
            type: DataTypes.ENUM('in_person', 'video_call', 'phone_call', 'chat'),
            defaultValue: 'in_person',
        },

        // ========== TIMING ==========
        consultationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in minutes',
        },

        // ========== CHIEF COMPLAINT & HISTORY ==========
        chiefComplaint: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        historyOfPresentIllness: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        symptoms: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== CLINICAL EXAMINATION ==========
        physicalExamination: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        vitals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                temperature: null,
                bloodPressure: null,
                heartRate: null,
            },
        },

        // ========== FINDINGS & DIAGNOSIS ==========
        findings: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        differentialDiagnosis: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== RECOMMENDATIONS ==========
        treatment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        medications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        investigations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        referrals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== FOLLOW-UP ==========
        followUpRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        followUpDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        followUpInstructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== NOTES ==========
        doctorNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        patientNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'scheduled',
                'in_progress',
                'completed',
                'cancelled',
                'no_show'
            ),
            defaultValue: 'scheduled',
            index: true,
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== DOCUMENTS ==========
        consultationNoteUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'consultations',
        indexes: [
            { fields: ['patientId'] },
            { fields: ['doctorId'] },
            { fields: ['hospitalId'] },
            { fields: ['consultationDate'] },
            { fields: ['status'] },
            { unique: true, fields: ['consultationNumber'] },
        ],
    });

    Consultation.prototype.getDurationInMinutes = function() {
        if (!this.startTime || !this.endTime) return null;
        return this.duration;
    };

    // Rename helper to avoid collision with 'isCompleted' attribute
    Consultation.prototype.isCompletedStatus = function() {
        return this.status === 'completed';
    };

    Consultation.associate = (models) => {
        Consultation.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
        Consultation.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        Consultation.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Consultation.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Consultation.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
    };

    return Consultation;
};
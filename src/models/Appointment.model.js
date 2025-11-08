// Appointment Model - Medical appointments and consultations
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Appointment = sequelize.define('Appointment', {
        appointmentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique appointment identifier',
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
            comment: 'Related booking if from booking flow',
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Patient',
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
            index: true,
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
            comment: 'Hospital where appointment is',
        },
        departmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'departments',
                key: 'departmentId',
            },
        },

        // ========== APPOINTMENT TYPE & PURPOSE ==========
        type: {
            type: DataTypes.ENUM(
                'initial_consultation',
                'follow_up',
                'pre_surgery',
                'post_surgery',
                'diagnostic',
                'routine_checkup',
                'emergency',
                'remote_consultation',
                'video_call',
                'phone_call',
                'walk_in'
            ),
            defaultValue: 'initial_consultation',
            comment: 'Type of appointment',
        },
        purpose: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [5, 500],
                    msg: 'Purpose must be between 5 and 500 characters',
                },
            },
            comment: 'Reason for appointment',
        },

        // ========== APPOINTMENT SCHEDULING ==========
        appointmentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfter: new Date().toISOString().split('T')[0],
            },
            comment: 'Date and time of appointment',
        },
        appointmentTime: {
            type: DataTypes.TIME,
            allowNull: true,
            comment: 'Specific time (if different from date)',
        },
        timeSlot: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Time slot identifier',
        },
        duration: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            validate: {
                min: 15,
                max: 180,
            },
            comment: 'Duration in minutes',
        },
        estimatedEndTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        timeZone: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'UTC',
        },

        // ========== APPOINTMENT STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'requested',
                'pending',
                'confirmed',
                'check_in_pending',
                'checked_in',
                'in_progress',
                'completed',
                'cancelled',
                'rescheduled',
                'no_show',
                'failed'
            ),
            defaultValue: 'requested',
            index: true,
            comment: 'Appointment lifecycle status',
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'History of status changes with timestamps',
        },

        // ========== PATIENT INFORMATION COLLECTION ==========
        chiefComplaints: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Chief complaints (symptoms)',
        },
        symptoms: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Detailed symptoms reported',
        },
        symptomsDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        medicalHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Relevant medical history',
        },
        currentMedications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        allergies: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        preAppointmentQuestionnaire: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Pre-appointment form responses',
        },
        recentTestResults: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Recent test/lab results provided',
        },

        // ========== DOCTOR NOTES & OBSERVATIONS ==========
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Patient notes/concerns',
        },
        clinicalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Doctor clinical observations',
        },
        physicalExamination: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Physical exam findings',
        },
        vitals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                temperature: null,
                bloodPressure: null,
                heartRate: null,
                respiratoryRate: null,
                oxygen: null,
                weight: null,
                height: null,
                bmi: null,
            },
            comment: 'Vital signs recorded',
        },

        // ========== DIAGNOSIS & ASSESSMENT ==========
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Doctor diagnosis',
        },
        diagnosticImpressions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Preliminary diagnostic impressions',
        },
        severity: {
            type: DataTypes.ENUM('mild', 'moderate', 'severe', 'critical'),
            allowNull: true,
        },
        urgency: {
            type: DataTypes.ENUM('routine', 'urgent', 'emergency'),
            defaultValue: 'routine',
        },

        // ========== TREATMENT PLAN ==========
        treatmentPlan: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Overall treatment strategy',
        },
        recommendedTests: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Recommended diagnostic tests',
        },
        referrals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Referrals to specialists',
        },

        // ========== PRESCRIPTIONS ==========
        prescription: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of prescribed medications',
        },
        prescriptionDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Detailed prescription information',
        },
        prescriptionUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to prescription document',
        },

        // ========== FOLLOW-UP ==========
        followUpRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        followUpType: {
            type: DataTypes.ENUM('phone_call', 'video_call', 'in_person', 'email', 'sms'),
            allowNull: true,
        },
        followUpDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        followUpNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        followUpScheduledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== DOCUMENTS & ATTACHMENTS ==========
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Document URLs attached',
        },
        reportUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Appointment report/summary',
        },
        labReportUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== REMOTE CONSULTATION DETAILS ==========
        isRemote: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        meetingLink: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Video call link',
        },
        conferenceId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        callDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Actual call duration in minutes',
        },

        // ========== TIMING & HISTORY ==========
        requestedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        confirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        checkedInAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When appointment actually started',
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== CANCELLATION & RESCHEDULING ==========
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cancelledBy: {
            type: DataTypes.ENUM('patient', 'doctor', 'hospital', 'system'),
            allowNull: true,
        },
        rescheduledFrom: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Previous appointment ID if rescheduled',
        },
        rescheduledCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        isReschedulable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== REMINDERS & NOTIFICATIONS ==========
        reminderSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        reminderSentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reminderType: {
            type: DataTypes.ENUM('email', 'sms', 'push', 'whatsapp'),
            allowNull: true,
        },
        autoReminder: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        remindersBefore: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [24, 2],
            comment: 'Reminders in hours before appointment',
        },

        // ========== RATINGS & FEEDBACK ==========
        doctorRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        appointmentRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        hospitalRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Patient feedback',
        },
        feedbackSubmittedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== PAYMENT & COST ==========
        appointmentFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        additionalCharges: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
        },
        totalCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        paymentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'payments',
                key: 'paymentId',
            },
        },

        // ========== METADATA & CLASSIFICATION ==========
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
            defaultValue: 'normal',
        },
        isEmergency: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
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
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        timestamps: true,
        tableName: 'appointments',
        indexes: [
            { fields: ['userId'] },
            { fields: ['hospitalId'] },
            { fields: ['doctorId'] },
            { fields: ['status'] },
            { fields: ['appointmentDate'] },
            { fields: ['isActive'] },
        ],
        scopes: {
            upcoming: {
                where: {
                    appointmentDate: {
                        [sequelize.Sequelize.Op.gte]: new Date() },
                    status: ['confirmed', 'checked_in', 'in_progress'],
                },
            },
            completed: {
                where: { status: 'completed' },
            },
            cancelled: {
                where: { status: 'cancelled' },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Appointment.prototype.isUpcoming = function() {
        return new Date(this.appointmentDate) > new Date() && this.status !== 'cancelled';
    };

    Appointment.prototype.isPast = function() {
        return new Date(this.appointmentDate) < new Date();
    };

    Appointment.prototype.canBeCancelled = function() {
        const hoursUntilAppointment = (new Date(this.appointmentDate) - new Date()) / (1000 * 60 * 60);
        return hoursUntilAppointment > 2 && ['requested', 'pending', 'confirmed'].includes(this.status);
    };

    Appointment.prototype.canBeRescheduled = function() {
        return this.isReschedulable && this.canBeCancelled();
    };

    Appointment.prototype.getDuration = function() {
        if (!this.startedAt || !this.completedAt) return null;
        return Math.floor((new Date(this.completedAt) - new Date(this.startedAt)) / 60000);
    };

    Appointment.prototype.getAppointmentNumber = function() {
        return `APT-${this.appointmentId.slice(0, 8).toUpperCase()}`;
    };

    // ========== ASSOCIATIONS ==========
    Appointment.associate = (models) => {
        Appointment.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        Appointment.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        Appointment.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Appointment.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
        Appointment.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Appointment.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
    };

    return Appointment;
};
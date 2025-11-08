// Expert Call Model - Comprehensive expert consultation
// Used in Step 11
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const ExpertCall = sequelize.define('ExpertCall', {
        callId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            index: true,
        },
        expertId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
            comment: 'Assigned expert doctor',
        },

        // ========== SCHEDULING ==========
        scheduledAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When call is scheduled',
        },
        scheduleTime: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Formatted time',
        },
        scheduleTimeZone: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Timezone for scheduled time',
        },
        estimatedDuration: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            comment: 'Estimated duration in minutes',
        },

        // ========== EXECUTION TIMESTAMPS ==========
        remindedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When patient was reminded',
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When call actually started',
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When call ended',
        },

        // ========== CALL DETAILS ==========
        status: {
            type: DataTypes.ENUM(
                'pending',
                'scheduled',
                'reminder_sent',
                'ongoing',
                'completed',
                'cancelled',
                'rescheduled',
                'no_show',
                'failed'
            ),
            defaultValue: 'pending',
            index: true,
        },
        callType: {
            type: DataTypes.ENUM('video', 'phone', 'in_person'),
            defaultValue: 'video',
            comment: 'Type of consultation call',
        },
        actualDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Actual duration in minutes',
        },

        // ========== CALL CONNECTIVITY ==========
        meetingLink: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Video call link (Zoom, Meet, etc)',
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Phone number for call',
        },
        phonePin: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'PIN for conference call',
        },
        recordingUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Recording of the call if saved',
        },
        recordingConsent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Patient consent for recording',
        },

        // ========== COMMUNICATION ==========
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Patient notes/concerns shared',
        },
        expertNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Expert internal notes',
        },
        patientFeedback: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Patient feedback after call',
        },

        // ========== MEDICAL FINDINGS ==========
        findings: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Medical findings from consultation',
        },
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        recommendations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Expert recommendations',
        },
        nextSteps: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Recommended next steps',
        },

        // ========== PRESCRIPTIONS & DOCUMENTS ==========
        prescriptions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Prescribed medications',
        },
        testsRecommended: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Recommended tests',
        },
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Document IDs attached',
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
        followUpType: {
            type: DataTypes.ENUM('phone_call', 'video_call', 'in_person'),
            allowNull: true,
        },

        // ========== CANCELLATION & RESCHEDULING ==========
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        cancelledBy: {
            type: DataTypes.ENUM('patient', 'expert', 'system'),
            allowNull: true,
        },
        rescheduledFrom: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'If rescheduled, original call ID',
        },

        // ========== NO-SHOW HANDLING ==========
        noShowReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        patientResponded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        automaticReschedule: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== RATINGS & FEEDBACK ==========
        expertRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 5,
            },
        },
        patientRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 5,
            },
        },
        patientReview: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Patient review of the call',
        },

        // ========== METADATA ==========
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Patient IP for security',
        },
        deviceInfo: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Device information used for call',
        },
        reminderId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Related reminder notification',
        },
    }, {
        timestamps: true,
        tableName: 'expert_calls',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['expertId'] },
            { fields: ['status'] },
            { fields: ['scheduledAt'] },
            { fields: ['createdAt'] },
        ],
    });

    // ========== SCOPES ==========
    ExpertCall.addScope('scheduled', {
        where: { status: ['scheduled', 'reminder_sent'] },
    });

    ExpertCall.addScope('completed', {
        where: { status: 'completed' },
    });

    // ========== INSTANCE METHODS ==========
    ExpertCall.prototype.canBeCancelled = function() {
        return ['pending', 'scheduled', 'reminder_sent'].includes(this.status);
    };

    ExpertCall.prototype.canBeRescheduled = function() {
        return ['scheduled', 'reminder_sent', 'no_show'].includes(this.status);
    };

    ExpertCall.prototype.isUpcoming = function() {
        if (!this.scheduledAt) return false;
        return new Date(this.scheduledAt) > new Date();
    };

    // ========== ASSOCIATIONS ==========
    ExpertCall.associate = (models) => {
        ExpertCall.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        ExpertCall.belongsTo(models.Doctor, { foreignKey: 'expertId', as: 'expert' });
    };

    return ExpertCall;
};
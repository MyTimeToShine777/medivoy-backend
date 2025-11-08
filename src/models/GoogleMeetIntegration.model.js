// Google Meet Integration Model - Video consultation management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const GoogleMeetIntegration = sequelize.define('GoogleMeetIntegration', {
        integrationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        appointmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'appointments',
                key: 'appointmentId',
            },
            index: true,
        },
        expertCallId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'expert_calls',
                key: 'callId',
            },
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
        },
        patientId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },

        // ========== MEET DETAILS ==========
        meetCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: 'Google Meet code',
        },
        meetLink: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Full Google Meet URL',
        },
        eventId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Google Calendar event ID',
        },

        // ========== CONFIGURATION ==========
        conferenceType: {
            type: DataTypes.ENUM('one_to_one', 'group', 'broadcast'),
            defaultValue: 'one_to_one',
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        recordingEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        screenShareEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        chatEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        handRaiseEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        presentationMode: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== SCHEDULING ==========
        scheduledStartTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        scheduledEndTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        actualStartTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        actualEndTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Actual duration in minutes',
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'scheduled',
                'meeting_created',
                'in_progress',
                'completed',
                'cancelled',
                'rescheduled',
                'no_show'
            ),
            defaultValue: 'scheduled',
            index: true,
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== PARTICIPANTS ==========
        participants: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'List of participants with status',
        },
        doctorJoinedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        patientJoinedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        attendanceCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== RECORDING ==========
        recordingUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to recorded video',
        },
        recordingStatus: {
            type: DataTypes.ENUM('not_recorded', 'recording', 'recorded', 'processing', 'available'),
            defaultValue: 'not_recorded',
        },
        recordingStartedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        recordingSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Size in bytes',
        },
        recordingAccessLevel: {
            type: DataTypes.ENUM('private', 'doctor_only', 'patient_only', 'both'),
            defaultValue: 'private',
        },

        // ========== ANALYTICS ==========
        callDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in seconds',
        },
        connectionQuality: {
            type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
            allowNull: true,
        },
        issues: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== NOTES & FOLLOW-UP ==========
        consultationNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        followUpRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        followUpScheduledFor: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== SYNC WITH GOOGLE ==========
        googleSyncStatus: {
            type: DataTypes.ENUM('not_synced', 'syncing', 'synced', 'failed'),
            defaultValue: 'not_synced',
        },
        googleSyncedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        googleAccountEmail: {
            type: DataTypes.STRING,
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

    }, {
        timestamps: true,
        tableName: 'google_meet_integrations',
        indexes: [
            { fields: ['appointmentId'] },
            { fields: ['expertCallId'] },
            { fields: ['bookingId'] },
            { fields: ['doctorId'] },
            { fields: ['patientId'] },
            { unique: true, fields: ['meetCode'] },
            { fields: ['status'] },
        ],
    });

    GoogleMeetIntegration.prototype.isMeetingActive = function() {
        return this.status === 'in_progress';
    };

    GoogleMeetIntegration.prototype.getMeetingDuration = function() {
        if (!this.actualStartTime || !this.actualEndTime) return null;
        const duration = (new Date(this.actualEndTime) - new Date(this.actualStartTime)) / (1000 * 60);
        return Math.floor(duration);
    };

    GoogleMeetIntegration.prototype.canStartMeeting = function() {
        const now = new Date();
        const scheduled = new Date(this.scheduledStartTime);
        const timeDiff = (scheduled - now) / (1000 * 60);
        return timeDiff <= 15 && timeDiff > -5 && this.status === 'scheduled';
    };

    GoogleMeetIntegration.associate = (models) => {
        GoogleMeetIntegration.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
        GoogleMeetIntegration.belongsTo(models.ExpertCall, { foreignKey: 'expertCallId', as: 'expertCall' });
        GoogleMeetIntegration.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        GoogleMeetIntegration.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        GoogleMeetIntegration.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
    };

    return GoogleMeetIntegration;
};
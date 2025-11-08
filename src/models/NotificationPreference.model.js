// Notification Preference Model - User notification settings
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const NotificationPreference = sequelize.define('NotificationPreference', {
        preferenceId: {
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

        // ========== EMAIL PREFERENCES ==========
        emailNotifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        emailBookingUpdates: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        emailPaymentReminders: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        emailAppointmentReminders: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        emailPromotions: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailNewsletters: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== SMS PREFERENCES ==========
        smsNotifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        smsBookingUpdates: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        smsAppointmentReminders: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        smsPaymentReminders: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        smsPromotions: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== PUSH NOTIFICATIONS ==========
        pushNotifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        pushBookingUpdates: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        pushAppointmentReminders: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        pushMessages: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== WHATSAPP PREFERENCES ==========
        whatsappNotifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        whatsappBookingUpdates: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        whatsappAppointmentReminders: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== QUIET HOURS ==========
        quietHoursEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        quietHoursStart: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        quietHoursEnd: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        quietHoursDays: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== FREQUENCY SETTINGS ==========
        frequencyDigest: {
            type: DataTypes.ENUM('instant', 'daily', 'weekly', 'none'),
            defaultValue: 'instant',
        },
        frequencyReminders: {
            type: DataTypes.ENUM('all', 'important_only', 'none'),
            defaultValue: 'all',
        },

        // ========== LANGUAGE & TIMEZONE ==========
        notificationLanguage: {
            type: DataTypes.STRING,
            defaultValue: 'en',
        },
        timeZoneForNotifications: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== SPECIAL SETTINGS ==========
        urgentAlwaysEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        emergencyAlerts: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== METADATA ==========
        lastUpdated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

    }, {
        timestamps: true,
        tableName: 'notification_preferences',
        indexes: [
            { fields: ['userId'] },
        ],
    });

    NotificationPreference.prototype.isQuietHours = function() {
        if (!this.quietHoursEnabled) return false;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const day = now.toLocaleLowerCase().slice(0, 3);

        if (!this.quietHoursDays.includes(day)) return false;
        return currentTime >= this.quietHoursStart && currentTime <= this.quietHoursEnd;
    };

    NotificationPreference.prototype.canSendNotification = function(channel, type) {
        // Check if channel is enabled
        const channelKey = `${channel}Notifications`;
        if (!this[channelKey]) return false;

        // Check if specific type is enabled
        const typeKey = `${channel}${type.charAt(0).toUpperCase() + type.slice(1)}`;
        if (this[typeKey] === false) return false;

        // Check quiet hours
        if (!this.urgentAlwaysEnabled && this.isQuietHours()) return false;

        return true;
    };

    NotificationPreference.associate = (models) => {
        NotificationPreference.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return NotificationPreference;
};
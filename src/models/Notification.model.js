// Notification Model - Multi-channel notifications system
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Notification = sequelize.define('Notification', {
        notificationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique notification identifier',
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
            comment: 'Recipient user',
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            comment: 'Related booking if applicable',
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'User who triggered notification',
        },

        // ========== NOTIFICATION TYPE & CATEGORY ==========
        type: {
            type: DataTypes.ENUM(
                'booking_confirmation',
                'payment_success',
                'payment_failed',
                'refund_initiated',
                'refund_completed',
                'expert_call_scheduled',
                'expert_call_reminder',
                'expert_call_completed',
                'document_verified',
                'document_rejected',
                'appointment_confirmed',
                'appointment_reminder',
                'appointment_cancelled',
                'status_update',
                'urgent_reminder',
                'follow_up_reminder',
                'review_request',
                'feedback_request',
                'promotion',
                'offer',
                'system_maintenance',
                'system_alert',
                'security_alert',
                'account_update',
                'new_message',
                'chat_reply',
                'general_announcement',
                'other'
            ),
            allowNull: false,
            index: true,
            comment: 'Notification type',
        },

        // ========== DELIVERY CHANNELS ==========
        channel: {
            type: DataTypes.ENUM('email', 'sms', 'push', 'in_app', 'whatsapp', 'telegram', 'all'),
            allowNull: false,
            comment: 'Delivery channel',
        },
        channels: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['in_app'],
            comment: 'Array of channels to send',
        },

        // ========== CONTENT ==========
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                len: {
                    args: [3, 200],
                    msg: 'Title must be between 3 and 200 characters',
                },
            },
            comment: 'Notification title',
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 1000],
                    msg: 'Message must be between 5 and 1000 characters',
                },
            },
            comment: 'Notification message/body',
        },
        shortMessage: {
            type: DataTypes.STRING(160),
            allowNull: true,
            comment: 'SMS/Short message version',
        },
        htmlContent: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'HTML formatted content for email',
        },

        // ========== DATA & PAYLOAD ==========
        data: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional data/context',
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Notification metadata',
        },

        // ========== ACTIONS & LINKS ==========
        actionUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to perform action',
        },
        actionLabel: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'CTA button label',
        },
        actionType: {
            type: DataTypes.ENUM('link', 'deep_link', 'action', 'none'),
            defaultValue: 'link',
        },
        secondaryActionUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secondaryActionLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== PRIORITY & URGENCY ==========
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent', 'critical'),
            defaultValue: 'medium',
            comment: 'Notification priority',
        },
        isUrgent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== DELIVERY STATUS & TRACKING ==========
        status: {
            type: DataTypes.ENUM('pending', 'sent', 'failed', 'bounced', 'queued', 'delivery_failed'),
            defaultValue: 'pending',
            index: true,
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'History of status changes',
        },
        deliveryAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        maxDeliveryAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
        },
        nextRetryAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        failureReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        failureCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== TIMING & SCHEDULING ==========
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        scheduledFor: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When to send (for scheduled)',
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When notification was sent',
        },
        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        readAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        expiredAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== READ & INTERACTION STATUS ==========
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            index: true,
        },
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isSpam: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== INTERACTION TRACKING ==========
        openCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Times notification was opened/clicked',
        },
        clickCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lastOpenedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastClickedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== DEVICE & CLIENT INFO ==========
        deviceType: {
            type: DataTypes.ENUM('web', 'ios', 'android', 'sms', 'email', 'other'),
            allowNull: true,
        },
        deviceToken: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Push notification device token',
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== TEMPLATE & DYNAMIC CONTENT ==========
        templateId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Notification template used',
        },
        templateVariables: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Variables substituted in template',
        },

        // ========== LOCALIZATION ==========
        language: {
            type: DataTypes.STRING,
            defaultValue: 'en',
        },
        localizedContent: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Content in multiple languages',
        },

        // ========== CAMPAIGN & BATCH INFO ==========
        campaignId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'If part of marketing campaign',
        },
        batchId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Batch notification ID',
        },
        batchSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Total in batch',
        },

        // ========== PREFERENCES & SETTINGS ==========
        respectUserPreferences: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        respectQuietHours: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        canBeSnoozed: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        snoozedUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        frequencyCap: {
            type: DataTypes.ENUM('once', 'daily', 'weekly', 'none'),
            defaultValue: 'none',
        },

        // ========== ANALYTICS ==========
        conversionStatus: {
            type: DataTypes.ENUM('pending', 'converted', 'not_converted'),
            defaultValue: 'pending',
        },
        conversionDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        analyticsData: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== INTERNAL USE ==========
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
        },
    }, {
        timestamps: true,
        tableName: 'notifications',
        indexes: [
            { fields: ['userId'] },
            { fields: ['isRead'] },
            { fields: ['type'] },
            { fields: ['status'] },
            { fields: ['createdAt'] },
        ],
        scopes: {
            unread: {
                where: { isRead: false },
            },
            sent: {
                where: { status: 'sent' },
            },
            pending: {
                where: { status: 'pending' },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Notification.prototype.markAsRead = function() {
        this.isRead = true;
        this.readAt = new Date();
        return this.save();
    };

    Notification.prototype.markAsArchived = function() {
        this.isArchived = true;
        return this.save();
    };

    Notification.prototype.markAsDeleted = function() {
        this.isDeleted = true;
        return this.save();
    };

    Notification.prototype.markAsSpam = function() {
        this.isSpam = true;
        return this.save();
    };

    Notification.prototype.snooze = function(minutes) {
        this.snoozedUntil = new Date(Date.now() + minutes * 60 * 1000);
        return this.save();
    };

    Notification.prototype.getReadStatus = function() {
        return this.isRead ? 'read' : 'unread';
    };

    Notification.prototype.canBeDelivered = function() {
        return this.status === 'pending' && this.deliveryAttempts < this.maxDeliveryAttempts;
    };

    // ========== ASSOCIATIONS ==========
    Notification.associate = (models) => {
        Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'recipient' });
        Notification.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
        Notification.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
    };

    return Notification;
};
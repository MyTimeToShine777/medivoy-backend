// Booking Status History Model - Track all booking status changes
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const BookingStatusHistory = sequelize.define('BookingStatusHistory', {
        historyId: {
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

        // ========== STATUS CHANGE ==========
        previousStatus: {
            type: DataTypes.ENUM(
                'inquiry',
                'pending_confirmation',
                'confirmed',
                'payment_pending',
                'payment_received',
                'in_progress',
                'under_treatment',
                'completed',
                'cancelled',
                'refunded',
                'on_hold',
                'expired'
            ),
            allowNull: true,
        },
        newStatus: {
            type: DataTypes.ENUM(
                'inquiry',
                'pending_confirmation',
                'confirmed',
                'payment_pending',
                'payment_received',
                'in_progress',
                'under_treatment',
                'completed',
                'cancelled',
                'refunded',
                'on_hold',
                'expired'
            ),
            allowNull: false,
        },

        // ========== CHANGE DETAILS ==========
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for status change',
        },
        changedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Who made the change',
        },
        changedByRole: {
            type: DataTypes.ENUM('patient', 'staff', 'admin', 'system'),
            allowNull: true,
        },

        // ========== TIMESTAMPS ==========
        changedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        effectiveDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== ACTIONS & NOTIFICATIONS ==========
        notificationSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        notificationChannel: {
            type: DataTypes.ENUM('email', 'sms', 'push', 'in_app', 'whatsapp'),
            allowNull: true,
        },
        notificationSentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== METADATA ==========
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'booking_status_history',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['changedAt'] },
            { fields: ['newStatus'] },
        ],
    });

    BookingStatusHistory.prototype.getStatusTransition = function() {
        return `${this.previousStatus} → ${this.newStatus}`;
    };

    BookingStatusHistory.associate = (models) => {
        BookingStatusHistory.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        BookingStatusHistory.belongsTo(models.User, { foreignKey: 'changedBy', as: 'changedByUser' });
    };

    return BookingStatusHistory;
};
// Booking Review Model - NO optional chaining
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const BookingReview = sequelize.define('BookingReview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'id',
        },
    },
    reviewedByStaffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    reviewStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'needs_more_info'),
        defaultValue: 'pending',
    },
    reviewNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isValidBooking: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    reasonsForRejection: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    requiredInformation: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    recommendedPackageTier: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    recommendedAction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estimatedTreatmentCost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
    estimatedDurationDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'booking_reviews',
    timestamps: true,
    underscored: true,
});

export default BookingReview;
// Booking Preferences Model - NO optional chaining
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const BookingPreferences = sequelize.define('BookingPreferences', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'bookings',
            // Booking model uses `bookingId` (UUID) as its PK attribute.
            key: 'bookingId',
        },
    },
    preferredRoomType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    wheelchairAccessibility: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    dietaryPreference: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    languagePreference: {
        type: DataTypes.STRING,
        defaultValue: 'en',
    },
    companionRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    companionName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companionRelationship: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    medicalConditions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    allergies: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    medications: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    estimatedStayDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'booking_preferences',
    timestamps: true,
    underscored: true,
});

export default BookingPreferences;
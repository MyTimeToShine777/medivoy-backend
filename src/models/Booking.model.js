// Booking Model - NO optional chaining
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'countries',
            key: 'id',
        },
    },
    hospitalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'hospitals',
            key: 'id',
        },
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    treatmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    packageTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    packageTierId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    bookingReference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    bookingStatus: {
        type: DataTypes.ENUM(
            'inquiry',
            'under_review',
            'awaiting_documents',
            'documents_pending',
            'medical_review_pending',
            'accepted',
            'rejected',
            'quotation_pending',
            'quotation_sent',
            'payment_pending',
            'payment_completed',
            'in_treatment',
            'completed',
            'cancelled'
        ),
        defaultValue: 'inquiry',
    },
    preferences: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
    },
    totalCost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'INR',
    },
    assignedStaffId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'bookings',
    timestamps: true,
    underscored: true,
});

export default Booking;
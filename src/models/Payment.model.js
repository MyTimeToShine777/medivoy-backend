import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Payment = sequelize.define('Payment', {
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
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'INR',
    },
    gateway: {
        type: DataTypes.ENUM('stripe', 'razorpay'),
        allowNull: false,
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
    },
    paymentMethod: {
        type: DataTypes.ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'),
        allowNull: true,
    },
    paymentDetails: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    receiptUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
});

export default Payment;
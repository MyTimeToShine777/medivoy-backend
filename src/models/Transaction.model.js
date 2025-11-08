'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        transactionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique transaction identifier'
        },
        paymentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'payments',
                key: 'paymentId'
            },
            comment: 'Payment reference'
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId'
            },
            comment: 'Booking reference'
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId'
            },
            comment: 'User reference'
        },
        transactionNumber: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Transaction number'
        },
        transactionType: {
            type: DataTypes.ENUM('payment', 'refund', 'chargeback', 'adjustment'),
            defaultValue: 'payment',
            comment: 'Transaction type'
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            },
            comment: 'Transaction amount'
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
            comment: 'Currency code'
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
            defaultValue: 'pending',
            comment: 'Transaction status'
        },
        gateway: {
            type: DataTypes.ENUM('razorpay', 'stripe', 'paypal', 'bank_transfer', 'cash', 'other'),
            allowNull: true,
            comment: 'Payment gateway'
        },
        gatewayTransactionId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Gateway transaction ID'
        },
        gatewayResponse: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Full gateway response'
        },
        paymentMethod: {
            type: DataTypes.ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'bank_transfer', 'cash'),
            allowNull: true,
            comment: 'Payment method used'
        },
        cardLast4: {
            type: DataTypes.STRING(4),
            allowNull: true,
            comment: 'Last 4 digits of card'
        },
        cardBrand: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Card brand (Visa, Mastercard, etc)'
        },
        gatewayFee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            comment: 'Gateway processing fee'
        },
        netAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Net amount after fees'
        },
        failureReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Failure reason if failed'
        },
        failureCode: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Failure error code'
        },
        ipAddress: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Transaction IP address'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata'
        },
        processedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Processing timestamp'
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Completion timestamp'
        }
    }, {
        timestamps: true,
        tableName: 'transactions',
        indexes: [
            { fields: ['paymentId'] },
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['transactionNumber'], unique: true },
            { fields: ['gatewayTransactionId'] },
            { fields: ['status'] },
            { fields: ['gateway'] },
            { fields: ['createdAt'] }
        ],
        comment: 'Payment transactions log'
    });

    return Transaction;
};
'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const SMSLog = sequelize.define('SMSLog', {
        smsLogId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique SMS log identifier'
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
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId'
            },
            comment: 'Related booking'
        },
        smsType: {
            type: DataTypes.ENUM(
                'otp',
                'verification',
                'booking_confirmation',
                'payment_receipt',
                'appointment_reminder',
                'notification',
                'alert',
                'marketing',
                'other'
            ),
            defaultValue: 'notification',
            comment: 'SMS type/category'
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: 'Recipient phone number'
        },
        countryCode: {
            type: DataTypes.STRING(5),
            allowNull: true,
            comment: 'Country code'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'SMS message content'
        },
        messageLength: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Message character count'
        },
        segmentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: 'SMS segment count'
        },
        status: {
            type: DataTypes.ENUM('pending', 'queued', 'sent', 'delivered', 'failed', 'undelivered'),
            defaultValue: 'pending',
            comment: 'SMS status'
        },
        gateway: {
            type: DataTypes.ENUM('twilio', 'msg91', 'aws_sns', 'nexmo', 'other'),
            allowNull: true,
            comment: 'SMS gateway provider'
        },
        gatewayMessageId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Gateway message ID'
        },
        gatewayResponse: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Gateway response data'
        },
        cost: {
            type: DataTypes.DECIMAL(10, 4),
            allowNull: true,
            comment: 'SMS cost'
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
            comment: 'Cost currency'
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Sent timestamp'
        },
        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Delivered timestamp'
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if failed'
        },
        errorCode: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Error code'
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: 'Send attempts'
        },
        priority: {
            type: DataTypes.ENUM('high', 'normal', 'low'),
            defaultValue: 'normal',
            comment: 'SMS priority'
        },
        scheduledAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled send time'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata'
        }
    }, {
        timestamps: true,
        tableName: 'sms_logs',
        indexes: [
            { fields: ['userId'] },
            { fields: ['bookingId'] },
            { fields: ['phoneNumber'] },
            { fields: ['status'] },
            { fields: ['smsType'] },
            { fields: ['sentAt'] },
            { fields: ['createdAt'] }
        ],
        comment: 'SMS delivery logs and tracking'
    });

    return SMSLog;
};
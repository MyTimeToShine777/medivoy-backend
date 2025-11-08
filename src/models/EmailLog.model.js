'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const EmailLog = sequelize.define('EmailLog', {
        emailLogId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique email log identifier'
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
        emailType: {
            type: DataTypes.ENUM(
                'verification',
                'password_reset',
                'booking_confirmation',
                'payment_receipt',
                'appointment_reminder',
                'notification',
                'marketing',
                'support',
                'other'
            ),
            defaultValue: 'notification',
            comment: 'Email type/category'
        },
        recipient: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Recipient email address'
        },
        recipientName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Recipient name'
        },
        sender: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Sender email address'
        },
        senderName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Sender name'
        },
        replyTo: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Reply-to email'
        },
        subject: {
            type: DataTypes.STRING(500),
            allowNull: false,
            comment: 'Email subject'
        },
        bodyText: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Plain text body'
        },
        bodyHtml: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'HTML body'
        },
        template: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Email template used'
        },
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Attachment details'
        },
        status: {
            type: DataTypes.ENUM('pending', 'queued', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked'),
            defaultValue: 'pending',
            comment: 'Email status'
        },
        provider: {
            type: DataTypes.ENUM('smtp', 'sendgrid', 'mailgun', 'ses', 'other'),
            allowNull: true,
            comment: 'Email service provider'
        },
        providerId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Provider message ID'
        },
        providerResponse: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Provider response data'
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
        openedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'First opened timestamp'
        },
        clickedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'First clicked timestamp'
        },
        openCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Open count'
        },
        clickCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Click count'
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
            comment: 'Email priority'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata'
        }
    }, {
        timestamps: true,
        tableName: 'email_logs',
        indexes: [
            { fields: ['userId'] },
            { fields: ['bookingId'] },
            { fields: ['recipient'] },
            { fields: ['status'] },
            { fields: ['emailType'] },
            { fields: ['sentAt'] },
            { fields: ['createdAt'] }
        ],
        comment: 'Email delivery logs and tracking'
    });

    return EmailLog;
};
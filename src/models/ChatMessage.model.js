'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const ChatMessage = sequelize.define('ChatMessage', {
        messageId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique message identifier'
        },
        conversationId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'chatconversations',
                key: 'conversationId'
            },
            onDelete: 'CASCADE',
            comment: 'Conversation reference'
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId'
            },
            comment: 'Sender user reference'
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId'
            },
            comment: 'Receiver user reference'
        },
        messageText: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Message content'
        },
        messageType: {
            type: DataTypes.ENUM('text', 'image', 'file', 'voice', 'video', 'location', 'system'),
            defaultValue: 'text',
            comment: 'Message type'
        },
        fileUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Attached file URL'
        },
        fileName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Attached file name'
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'File size in bytes'
        },
        fileMimeType: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'File MIME type'
        },
        thumbnailUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Thumbnail URL for media'
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration for voice/video in seconds'
        },
        location: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Location data (lat, lng)'
        },
        replyToMessageId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'chatmessages',
                key: 'messageId'
            },
            comment: 'Reply to message reference'
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Read status'
        },
        readAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Read timestamp'
        },
        isDelivered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Delivery status'
        },
        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Delivered timestamp'
        },
        isEdited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Edited flag'
        },
        editedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Last edit timestamp'
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Soft delete flag'
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Deletion timestamp'
        },
        deletedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'User who deleted'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata'
        }
    }, {
        timestamps: true,
        tableName: 'chat_messages',
        indexes: [
            { fields: ['conversationId'] },
            { fields: ['senderId'] },
            { fields: ['receiverId'] },
            { fields: ['isRead'] },
            { fields: ['createdAt'] },
            { fields: ['replyToMessageId'] }
        ],
        comment: 'Chat messages'
    });

    return ChatMessage;
};
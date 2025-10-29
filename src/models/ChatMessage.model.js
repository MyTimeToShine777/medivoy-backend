/**
 * ChatMessage Model
 * Represents individual messages in chat conversations
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chat_conversations',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  sender_type: {
    type: DataTypes.ENUM('patient', 'doctor', 'staff', 'admin'),
    allowNull: false
  },
  message_type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'audio', 'video', 'system'),
    allowNull: false,
    defaultValue: 'text'
  },
  message_content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL for attached files/media'
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'File size in bytes'
  },
  file_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'MIME type of the file'
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Thumbnail for images/videos'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_delivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_edited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reply_to_message_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'chat_messages',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional message metadata'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'chat_messages',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['conversation_id']
    },
    {
      fields: ['sender_id']
    },
    {
      fields: ['is_read']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['message_type']
    }
  ]
});

module.exports = ChatMessage;
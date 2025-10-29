/**
 * ChatConversation Model
 * Represents chat conversations between users (patients, doctors, staff)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatConversation = sequelize.define('ChatConversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conversation_type: {
    type: DataTypes.ENUM('patient_doctor', 'patient_coordinator', 'patient_support', 'doctor_coordinator', 'group'),
    allowNull: false,
    defaultValue: 'patient_doctor'
  },
  participant_1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  participant_1_type: {
    type: DataTypes.ENUM('patient', 'doctor', 'staff', 'admin'),
    allowNull: false
  },
  participant_2_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  participant_2_type: {
    type: DataTypes.ENUM('patient', 'doctor', 'staff', 'admin'),
    allowNull: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'bookings',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'appointments',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  last_message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  last_message_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_message_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  unread_count_participant_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  unread_count_participant_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_archived_participant_1: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_archived_participant_2: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional conversation metadata'
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
  tableName: 'chat_conversations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['participant_1_id']
    },
    {
      fields: ['participant_2_id']
    },
    {
      fields: ['booking_id']
    },
    {
      fields: ['appointment_id']
    },
    {
      fields: ['conversation_type']
    },
    {
      fields: ['is_active']
    }
  ]
});

module.exports = ChatConversation;
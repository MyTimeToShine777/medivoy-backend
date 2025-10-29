/**
 * VideoCall Model
 * Represents video call sessions between patients and doctors
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VideoCall = sequelize.define('VideoCall', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'chat_conversations',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  host_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  host_type: {
    type: DataTypes.ENUM('patient', 'doctor', 'staff'),
    allowNull: false
  },
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  participant_type: {
    type: DataTypes.ENUM('patient', 'doctor', 'staff'),
    allowNull: false
  },
  call_type: {
    type: DataTypes.ENUM('consultation', 'follow_up', 'emergency', 'support'),
    allowNull: false,
    defaultValue: 'consultation'
  },
  call_status: {
    type: DataTypes.ENUM('scheduled', 'initiated', 'ringing', 'connected', 'ended', 'missed', 'cancelled', 'failed'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ended_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Call duration in seconds'
  },
  room_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Video call room/session ID from provider'
  },
  provider: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'agora',
    comment: 'Video call provider (agora, twilio, zoom, etc.)'
  },
  provider_session_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  host_token: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Access token for host'
  },
  participant_token: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Access token for participant'
  },
  recording_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  recording_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  recording_duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Recording duration in seconds'
  },
  quality_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  host_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  participant_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  connection_quality: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Network quality metrics'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellation_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancelled_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional call metadata'
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
  tableName: 'video_calls',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['appointment_id']
    },
    {
      fields: ['conversation_id']
    },
    {
      fields: ['host_id']
    },
    {
      fields: ['participant_id']
    },
    {
      fields: ['call_status']
    },
    {
      fields: ['scheduled_at']
    },
    {
      fields: ['room_id']
    }
  ]
});

module.exports = VideoCall;
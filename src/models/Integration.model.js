/**
 * Integration Model
 * Manages third-party integrations and API connections
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Integration = sequelize.define('Integration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Integration name'
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Unique slug identifier'
  },
  integration_type: {
    type: DataTypes.ENUM('payment', 'email', 'sms', 'video', 'storage', 'analytics', 'crm', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  provider: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Provider name (stripe, twilio, agora, etc.)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  api_key: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Encrypted API key'
  },
  api_secret: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Encrypted API secret'
  },
  api_endpoint: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'API base URL'
  },
  webhook_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Webhook endpoint URL'
  },
  webhook_secret: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Webhook verification secret'
  },
  configuration: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional configuration parameters'
  },
  credentials: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional credentials (encrypted)'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_sandbox: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether using sandbox/test mode'
  },
  last_sync_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last successful sync timestamp'
  },
  sync_status: {
    type: DataTypes.ENUM('success', 'failed', 'pending', 'never'),
    allowNull: false,
    defaultValue: 'never'
  },
  sync_error: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Last sync error message'
  },
  rate_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'API rate limit per minute'
  },
  usage_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total API calls made'
  },
  last_used_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'API key expiration date'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional integration metadata'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
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
  tableName: 'integrations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['slug'],
      unique: true
    },
    {
      fields: ['integration_type']
    },
    {
      fields: ['provider']
    },
    {
      fields: ['is_active']
    }
  ]
});

module.exports = Integration;
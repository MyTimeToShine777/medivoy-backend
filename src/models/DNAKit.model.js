/**
 * DNAKit Model
 * Manages DNA kit orders and genetic testing services
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DNAKit = sequelize.define('DNAKit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Unique order number'
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'patients',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  kit_type: {
    type: DataTypes.ENUM('ancestry', 'health', 'wellness', 'comprehensive', 'paternity', 'carrier_screening'),
    allowNull: false,
    defaultValue: 'health'
  },
  kit_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  kit_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  laboratory_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'laboratories',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  lab_partner_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: 'Kit barcode/serial number'
  },
  order_status: {
    type: DataTypes.ENUM('ordered', 'shipped', 'delivered', 'sample_received', 'processing', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'ordered'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  ordered_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sample_received_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  results_ready_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Shipping address details'
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  shipping_carrier: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sample_collection_method: {
    type: DataTypes.ENUM('saliva', 'blood', 'cheek_swab', 'other'),
    allowNull: true,
    defaultValue: 'saliva'
  },
  sample_quality: {
    type: DataTypes.ENUM('excellent', 'good', 'acceptable', 'poor', 'rejected'),
    allowNull: true
  },
  test_results: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Genetic test results data'
  },
  results_pdf_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL to downloadable PDF report'
  },
  raw_data_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL to raw genetic data file'
  },
  consent_given: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Patient consent for genetic testing'
  },
  consent_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  privacy_settings: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Privacy and data sharing preferences'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellation_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  refund_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional kit metadata'
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
  tableName: 'dna_kits',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['order_number'],
      unique: true
    },
    {
      fields: ['patient_id']
    },
    {
      fields: ['laboratory_id']
    },
    {
      fields: ['barcode'],
      unique: true
    },
    {
      fields: ['order_status']
    },
    {
      fields: ['payment_status']
    }
  ]
});

module.exports = DNAKit;
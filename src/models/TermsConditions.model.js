/**
 * TermsConditions Model
 * Manages terms and conditions with version control
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TermsConditions = sequelize.define(
  'TermsConditions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Version number (e.g., 1.0, 1.1, 2.0)',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      comment: 'Full terms and conditions content',
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
      comment: 'Language code (en, ar, fr, etc.)',
    },
    effective_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Date when this version becomes effective',
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when this version expires (null for current)',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the currently active version',
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Brief summary of changes',
    },
    change_log: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed change log from previous version',
    },
    acceptance_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether users must accept this version',
    },
    total_acceptances: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of users who accepted this version',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    published_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'terms_conditions',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['version', 'language'],
        unique: true,
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['is_published'],
      },
      {
        fields: ['effective_date'],
      },
      {
        fields: ['language'],
      },
    ],
  }
);

module.exports = TermsConditions;

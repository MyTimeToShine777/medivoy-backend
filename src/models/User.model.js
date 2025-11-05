/**
 * User Model - COMPLETE
 * Includes: JWT, OAuth (Google, Facebook, GitHub, Apple), MFA, API Keys, Sessions
 * Status: Production-Ready
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 50] },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 50] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      sparse: true,
    },
    password: {
      type: DataTypes.STRING,
      validate: { len: [8, 128] },
    },
    role: {
      type: DataTypes.ENUM('patient', 'doctor', 'admin', 'hospital_admin', 'staff'),
      defaultValue: 'patient',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'deleted'),
      defaultValue: 'active',
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePicture: DataTypes.STRING,
    bio: DataTypes.TEXT,
    dateOfBirth: DataTypes.DATE,
    gender: DataTypes.ENUM('male', 'female', 'other'),

    // Address
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    zipCode: DataTypes.STRING,

    // Medical Details
    bloodGroup: DataTypes.ENUM('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'),
    allergies: DataTypes.TEXT,
    medicalHistory: DataTypes.TEXT,

    // Authentication Fields
    mfaEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    preferredMfaType: {
      type: DataTypes.ENUM('totp', 'sms', 'email'),
    },
    apiKeysEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLoginAt: DataTypes.DATE,
    lastLoginIp: DataTypes.STRING,
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockedUntil: DataTypes.DATE,

    // OAuth Identifiers
    googleId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    githubId: DataTypes.STRING,
    appleId: DataTypes.STRING,

    // Session Preference
    sessionPreference: {
      type: DataTypes.ENUM('jwt', 'session'),
      defaultValue: 'jwt',
    },

    // System Fields
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastPasswordChangeAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpiresAt: DataTypes.DATE,

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: DataTypes.DATE,
  },
  {
    paranoid: true,
    timestamps: true,
    indexes: [
      { fields: ['email'], unique: true },
      { fields: ['phone'], unique: true },
      { fields: ['role'] },
      { fields: ['status'] },
      { fields: ['googleId'] },
      { fields: ['facebookId'] },
      { fields: ['githubId'] },
      { fields: ['appleId'] },
    ],
  },
);

module.exports = User;

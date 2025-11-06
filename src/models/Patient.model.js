import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
    },
    bloodGroup: {
        type: DataTypes.STRING(3),
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emergencyContact: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    medicalHistory: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    allergies: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    medications: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    insuranceProvider: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    insurancePolicyNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'patients',
    timestamps: true,
    underscored: true,
});

export default Patient;
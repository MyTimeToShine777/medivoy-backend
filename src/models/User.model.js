import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        lowercase: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('super_admin', 'admin', 'doctor', 'medivoy_staff', 'patient'),
        defaultValue: 'patient',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    phoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
});

export default User;
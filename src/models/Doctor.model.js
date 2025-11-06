import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Doctor = sequelize.define('Doctor', {
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
    medicalLicenseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    specializations: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    yearsOfExperience: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    qualifications: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'INR',
    },
    averageRating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
    },
    totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'doctors',
    timestamps: true,
    underscored: true,
});

export default Doctor;
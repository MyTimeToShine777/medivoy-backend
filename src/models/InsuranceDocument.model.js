// Insurance Document Model - NO optional chaining
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const InsuranceDocument = sequelize.define('InsuranceDocument', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'id',
        },
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    insuranceProviderName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    policyNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    groupNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    memberId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    coverageType: {
        type: DataTypes.ENUM('full', 'partial', 'none'),
        defaultValue: 'partial',
    },
    coverageAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
    deductible: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },
    coInsurancePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    documentUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    documentType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fileId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    validFrom: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    validTo: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    verificationStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
    },
    verificationNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'insurance_documents',
    timestamps: true,
    underscored: true,
});

export default InsuranceDocument;
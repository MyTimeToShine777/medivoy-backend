// Medical Document Model - NO optional chaining
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MedicalDocument = sequelize.define('MedicalDocument', {
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
    documentType: {
        type: DataTypes.ENUM(
            'medical_history',
            'lab_reports',
            'imaging_reports',
            'discharge_summary',
            'previous_treatment_records',
            'consultation_notes',
            'medication_list',
            'allergy_records',
            'vaccination_records',
            'prescription',
            'other'
        ),
        allowNull: false,
    },
    documentTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    documentUrl: {
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
    dateOfDocument: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    hospitalName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reviewStatus: {
        type: DataTypes.ENUM('pending', 'reviewed', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
    isRelevantForTreatment: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    reviewNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'medical_documents',
    timestamps: true,
    underscored: true,
});

export default MedicalDocument;
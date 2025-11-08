'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const ComorbidCondition = sequelize.define('ComorbidCondition', {
        conditionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique condition identifier'
        },
        patientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'patients',
                key: 'patientId'
            },
            onDelete: 'CASCADE',
            comment: 'Patient reference'
        },
        conditionName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Condition name'
        },
        conditionType: {
            type: DataTypes.ENUM('chronic', 'acute', 'genetic', 'lifestyle', 'other'),
            allowNull: true,
            comment: 'Condition type'
        },
        icdCode: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'ICD-10 diagnosis code'
        },
        diagnosedDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Diagnosis date'
        },
        diagnosedBy: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Diagnosing physician'
        },
        severity: {
            type: DataTypes.ENUM('mild', 'moderate', 'severe', 'critical'),
            allowNull: true,
            comment: 'Condition severity'
        },
        status: {
            type: DataTypes.ENUM('active', 'resolved', 'managed', 'under_treatment', 'monitoring'),
            defaultValue: 'active',
            comment: 'Current status'
        },
        symptoms: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'List of symptoms'
        },
        medications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Current medications'
        },
        treatmentPlan: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Treatment plan details'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional notes'
        },
        lastReviewDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Last review date'
        },
        nextReviewDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Next scheduled review'
        },
        affectsTreatment: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Affects proposed treatment'
        },
        requiresSpecialCare: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Needs special care'
        }
    }, {
        timestamps: true,
        tableName: 'comorbid_conditions',
        indexes: [
            { fields: ['patientId'] },
            { fields: ['status'] },
            { fields: ['severity'] },
            { fields: ['icdCode'] }
        ],
        comment: 'Patient comorbid conditions and health issues'
    });

    return ComorbidCondition;
};
'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const LabReport = sequelize.define('LabReport', {
        reportId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique report identifier'
        },
        patientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'patients',
                key: 'patientId'
            },
            comment: 'Patient reference'
        },
        labTestId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'labtests',
                key: 'testId'
            },
            comment: 'Lab test reference'
        },
        laboratoryId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'laboratories',
                key: 'labId'
            },
            comment: 'Laboratory reference'
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId'
            },
            comment: 'Ordering doctor'
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId'
            },
            comment: 'Related booking'
        },
        reportNumber: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Report number'
        },
        testName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Test name'
        },
        testType: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Test type/category'
        },
        testDate: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'Test conducted date'
        },
        reportDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Report generated date'
        },
        results: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Test results data'
        },
        normalRange: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Normal reference ranges'
        },
        interpretation: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Result interpretation'
        },
        fileUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Report file URL'
        },
        fileName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Report file name'
        },
        status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled', 'failed'),
            defaultValue: 'pending',
            comment: 'Report status'
        },
        priority: {
            type: DataTypes.ENUM('routine', 'urgent', 'stat'),
            defaultValue: 'routine',
            comment: 'Test priority'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional notes'
        },
        isAbnormal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Abnormal results flag'
        }
    }, {
        timestamps: true,
        tableName: 'lab_reports',
        indexes: [
            { fields: ['patientId'] },
            { fields: ['labTestId'] },
            { fields: ['laboratoryId'] },
            { fields: ['reportNumber'], unique: true },
            { fields: ['status'] },
            { fields: ['testDate'] }
        ],
        comment: 'Laboratory test reports'
    });

    return LabReport;
};
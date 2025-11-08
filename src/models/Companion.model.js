'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Companion = sequelize.define('Companion', {
        companionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique companion identifier'
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'bookingId'
            },
            onDelete: 'CASCADE',
            comment: 'Booking reference'
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
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'First name'
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Last name'
        },
        relationship: {
            type: DataTypes.ENUM('spouse', 'parent', 'child', 'sibling', 'friend', 'caregiver', 'relative', 'other'),
            allowNull: false,
            comment: 'Relationship to patient'
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Date of birth'
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Age in years'
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: true,
            comment: 'Gender'
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'Phone number'
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Email address'
        },
        passportNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Passport number'
        },
        nationality: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Nationality'
        },
        accommodationRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Needs accommodation'
        },
        travelRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Needs travel booking'
        },
        emergencyContact: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Is emergency contact'
        },
        medicalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Medical information'
        },
        specialRequirements: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Special requirements'
        }
    }, {
        timestamps: true,
        tableName: 'companions',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['patientId'] }
        ],
        comment: 'Patient companions/attendants'
    });

    return Companion;
};
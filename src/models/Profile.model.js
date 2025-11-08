'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Profile = sequelize.define('Profile', {
        profileId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique profile identifier'
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'userId'
            },
            onDelete: 'CASCADE',
            comment: 'User reference'
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'First name'
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Last name'
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Date of birth'
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
            allowNull: true,
            comment: 'Gender'
        },
        bloodGroup: {
            type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'),
            allowNull: true,
            comment: 'Blood group'
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'Primary phone'
        },
        alternatePhone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'Alternate phone'
        },
        avatar: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Profile picture URL'
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Biography'
        },
        addressLine1: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Address line 1'
        },
        addressLine2: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Address line 2'
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'City'
        },
        state: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'State'
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Country'
        },
        postalCode: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'Postal code'
        },
        emergencyContactName: {
            type: DataTypes.STRING(150),
            allowNull: true,
            comment: 'Emergency contact name'
        },
        emergencyContactPhone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: 'Emergency contact phone'
        },
        emergencyContactRelation: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Emergency contact relationship'
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Profile verified'
        },
        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Verification timestamp'
        }
    }, {
        timestamps: true,
        tableName: 'profiles',
        indexes: [
            { fields: ['userId'], unique: true },
            { fields: ['phoneNumber'] }
        ],
        comment: 'User profile information'
    });

    return Profile;
};
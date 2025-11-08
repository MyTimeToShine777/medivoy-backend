'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Rating = sequelize.define('Rating', {
        ratingId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique rating identifier'
        },
        patientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'patients',
                key: 'patientId'
            },
            comment: 'Patient who rated'
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId'
            },
            comment: 'Doctor being rated'
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId'
            },
            comment: 'Hospital being rated'
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
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            },
            comment: 'Rating value (1-5)'
        },
        category: {
            type: DataTypes.ENUM('doctor', 'hospital', 'service', 'overall', 'treatment', 'staff'),
            allowNull: false,
            comment: 'Rating category'
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Review comment'
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Verified review'
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Public visibility'
        },
        helpful: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Helpful count'
        },
        reported: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Report count'
        }
    }, {
        timestamps: true,
        tableName: 'ratings',
        indexes: [
            { fields: ['patientId'] },
            { fields: ['doctorId'] },
            { fields: ['hospitalId'] },
            { fields: ['bookingId'] },
            { fields: ['category'] },
            { fields: ['rating'] }
        ],
        comment: 'Ratings and reviews'
    });

    return Rating;
};
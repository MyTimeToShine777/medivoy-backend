// Booking Review Model - Reviews specific to bookings
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const BookingReview = sequelize.define('BookingReview', {
        reviewId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            index: true,
            unique: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
        },

        // ========== RATINGS ==========
        overallRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            validate: { min: 0, max: 5 },
        },
        treatmentQuality: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        doctorBehavior: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        hospitalFacilities: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        valueForMoney: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        travelExperience: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        accommodationQuality: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },

        // ========== REVIEW CONTENT ==========
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        bestAspects: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        improvementAreas: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== RESULTS & EXPERIENCE ==========
        treatmentOutcome: {
            type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'no_improvement'),
            defaultValue: 'good',
        },
        expectedResultsMet: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        recoveryStatus: {
            type: DataTypes.ENUM('fully_recovered', 'mostly_recovered', 'partially_recovered', 'not_recovered'),
            allowNull: true,
        },

        // ========== STATUS & MODERATION ==========
        status: {
            type: DataTypes.ENUM('draft', 'pending', 'published', 'rejected'),
            defaultValue: 'pending',
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== ENGAGEMENT ==========
        helpfulCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        unhelpfulCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== METADATA ==========
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'booking_reviews',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['hospitalId'] },
            { fields: ['doctorId'] },
            { fields: ['status'] },
        ],
    });

    BookingReview.prototype.getAverageRating = function() {
        const ratings = [
            this.treatmentQuality,
            this.doctorBehavior,
            this.hospitalFacilities,
            this.valueForMoney,
            this.travelExperience,
            this.accommodationQuality,
        ].filter(r => r !== null);
        if (ratings.length === 0) return this.overallRating;
        return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    };

    BookingReview.prototype.isHelpful = function() {
        if (this.helpfulCount === 0 && this.unhelpfulCount === 0) return null;
        return this.helpfulCount > this.unhelpfulCount;
    };

    BookingReview.associate = (models) => {
        BookingReview.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        BookingReview.belongsTo(models.User, { foreignKey: 'userId', as: 'reviewer' });
        BookingReview.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        BookingReview.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
    };

    return BookingReview;
};
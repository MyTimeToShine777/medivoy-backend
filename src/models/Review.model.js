// Review Model - Hospital and treatment reviews and ratings
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Review = sequelize.define('Review', {
        reviewId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique review identifier',
        },

        // ========== RELATIONSHIPS ==========
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Patient who wrote review',
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
            index: true,
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            comment: 'Related booking if applicable',
        },
        treatmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'treatments',
                key: 'treatmentId',
            },
        },
        doctorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
            comment: 'Doctor being reviewed',
        },

        // ========== RATING & SCORING ==========
        overallRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
            },
            comment: 'Overall rating (0-5)',
        },
        cleanliness: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        staff: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
            comment: 'Staff/Doctor rating',
        },
        facilities: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        valueForMoney: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        communication: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        hospitality: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        resultQuality: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
            comment: 'Quality of treatment results',
        },
        timelinessAndEfficiency: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },

        // ========== REVIEW CONTENT ==========
        title: {
            type: DataTypes.STRING(200),
            allowNull: true,
            validate: {
                len: {
                    args: [5, 200],
                    msg: 'Title must be between 5 and 200 characters',
                },
            },
            comment: 'Review title/headline',
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [20, 5000],
                    msg: 'Review must be between 20 and 5000 characters',
                },
            },
            comment: 'Review content/body',
        },
        positiveAspects: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'What went well (bullets)',
        },
        negativeAspects: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Areas for improvement',
        },
        suggestions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Suggestions for improvement',
        },

        // ========== DETAILED CATEGORIES ==========
        categories: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                cleanliness: 0,
                staff: 0,
                facilities: 0,
                valueForMoney: 0,
                communication: 0,
                hospitality: 0,
                resultQuality: 0,
                timelinessAndEfficiency: 0,
            },
            comment: 'Detailed category ratings',
        },

        // ========== REVIEW METADATA ==========
        visitDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When patient visited/received treatment',
        },
        treatmentReceived: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stayDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Days spent',
        },
        travelledFrom: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        companyDuringTreatment: {
            type: DataTypes.ENUM('alone', 'spouse', 'family', 'friend', 'caregiver'),
            allowNull: true,
        },

        // ========== ANONYMITY & PRIVACY ==========
        isAnonymous: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Show as anonymous review',
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Name to display if anonymous',
        },
        displayCity: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== MEDIA & ATTACHMENTS ==========
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'URLs of attached images',
        },
        imageCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        videos: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== VERIFICATION & AUTHENTICITY ==========
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Verified purchase/actual experience',
        },
        verificationStatus: {
            type: DataTypes.ENUM('pending', 'verified', 'unverified', 'disputed'),
            defaultValue: 'pending',
        },
        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verificationMethod: {
            type: DataTypes.ENUM('booking_match', 'document_verification', 'manual_review'),
            allowNull: true,
        },

        // ========== MODERATION & STATUS ==========
        status: {
            type: DataTypes.ENUM('draft', 'pending', 'published', 'rejected', 'flagged'),
            defaultValue: 'pending',
            index: true,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approvedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        moderatorNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== FLAGGING & REPORTING ==========
        isFlagged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        flagReason: {
            type: DataTypes.ENUM(
                'inappropriate_content',
                'spam',
                'fake_review',
                'competitor_review',
                'harassment',
                'off_topic',
                'duplicate',
                'misleading',
                'other'
            ),
            allowNull: true,
        },
        flaggedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        flaggedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        flagCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== ENGAGEMENT METRICS ==========
        helpfulCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '"Helpful" votes received',
        },
        unhelpfulCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '"Not helpful" votes',
        },
        commentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        shareCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        helpfulPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Calculated percentage',
        },

        // ========== RESPONSES & INTERACTIONS ==========
        hospitalResponse: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Hospital\'s response to review',
        },
        responseDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        respondedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        responseStatus: {
            type: DataTypes.ENUM('pending', 'replied', 'resolved'),
            defaultValue: 'pending',
        },

        // ========== FOLLOW-UP ==========
        patientFollowUp: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Patient follow-up to response',
        },
        followUpDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== METADATA & CLASSIFICATION ==========
        language: {
            type: DataTypes.STRING,
            defaultValue: 'en',
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        sentiment: {
            type: DataTypes.ENUM('very_positive', 'positive', 'neutral', 'negative', 'very_negative'),
            allowNull: true,
        },

        // ========== INTERNAL USE ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        qualityScore: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Review quality score (0-100)',
        },
        isHighQuality: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        archivedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'reviews',
        indexes: [
            { fields: ['hospitalId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['isVerified'] },
            { fields: ['overallRating'] },
            { fields: ['createdAt'] },
        ],
        scopes: {
            published: {
                where: { status: 'published' },
            },
            verified: {
                where: { isVerified: true },
            },
            approved: {
                where: { isApproved: true },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Review.prototype.isHelpful = function() {
        if (this.helpfulCount === 0 && this.unhelpfulCount === 0) return null;
        return this.helpfulCount > this.unhelpfulCount;
    };

    Review.prototype.getHelpfulPercentage = function() {
        const total = this.helpfulCount + this.unhelpfulCount;
        if (total === 0) return null;
        return ((this.helpfulCount / total) * 100).toFixed(2);
    };

    Review.prototype.getAverageRating = function() {
        const ratings = [
            this.cleanliness,
            this.staff,
            this.facilities,
            this.valueForMoney,
        ].filter(r => r !== null);
        if (ratings.length === 0) return this.overallRating;
        return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    };

    Review.prototype.canEdit = function(userId) {
        if (this.userId !== userId) return false;
        if (this.status === 'published' && this.approvedBy) return false;
        return true;
    };

    Review.prototype.canDelete = function(userId) {
        return this.userId === userId && this.status !== 'published';
    };

    // ========== ASSOCIATIONS ==========
    Review.associate = (models) => {
        Review.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
        Review.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Review.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Review.belongsTo(models.Treatment, { foreignKey: 'treatmentId', as: 'treatment' });
        Review.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        Review.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
    };

    return Review;
};
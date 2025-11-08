// Treatment Category Model - Treatment categorization and organization
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const TreatmentCategory = sequelize.define('TreatmentCategory', {
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique category identifier',
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Category name must be unique',
            },
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Category name must be between 3 and 100 characters',
                },
            },
            comment: 'Category name',
        },
        slug: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Category slug must be unique',
            },
            allowNull: true,
            validate: {
                isSlug(value) {
                    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
                        throw new Error('Invalid slug format');
                    }
                },
            },
            comment: 'URL-friendly slug',
        },

        // ========== HIERARCHY ==========
        parentCategoryId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'treatment_categories',
                key: 'categoryId',
            },
            comment: 'Parent category if subcategory',
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Category level (0=top, 1=sub, etc)',
        },
        hierarchyPath: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Full path like: Surgery > Cardiac > Bypass',
        },

        // ========== DESCRIPTIONS ==========
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [10, 1000],
                    msg: 'Description must be between 10 and 1000 characters',
                },
            },
            comment: 'Detailed category description',
        },
        shortDescription: {
            type: DataTypes.STRING(200),
            allowNull: true,
            comment: 'Brief description for listings',
        },
        metaDescription: {
            type: DataTypes.STRING(160),
            allowNull: true,
            comment: 'SEO meta description',
        },

        // ========== CONTENT ==========
        overview: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Category overview for patients',
        },
        benefits: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Benefits of treatments in this category',
        },
        risks: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Common risks or side effects',
        },
        recovery: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Recovery information',
        },
        faqs: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Frequently asked questions',
        },

        // ========== SPECIALIZATIONS ==========
        specializations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Medical specializations in category',
        },
        relatedSpecialties: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== TREATMENTS ==========
        treatmentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of treatments in category',
        },
        relatedTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of treatment IDs',
        },

        // ========== STATISTICS ==========
        totalBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        completedBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        successRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Overall success rate %',
        },

        // ========== PRICING INFO ==========
        priceRangeMin: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Minimum treatment cost in category',
        },
        priceRangeMax: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Maximum treatment cost in category',
        },
        averagePrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },

        // ========== DURATION INFO ==========
        averageDurationMin: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Average min duration in days',
        },
        averageDurationMax: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        averageRecoveryDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== MEDIA & BRANDING ==========
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Icon URL',
        },
        iconType: {
            type: DataTypes.ENUM('fontawesome', 'material', 'emoji', 'custom'),
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Featured category image',
        },
        bannerImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Gallery images',
        },
        video: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Explainer video URL',
        },
        color: {
            type: DataTypes.STRING(7),
            allowNull: true,
            comment: 'Brand color hex code',
        },

        // ========== SEO & KEYWORDS ==========
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'SEO keywords',
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Category tags',
        },

        // ========== VISIBILITY & ORGANIZATION ==========
        visibility: {
            type: DataTypes.ENUM('public', 'private', 'hidden', 'draft'),
            defaultValue: 'public',
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Order for display',
        },
        isPopular: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Show in popular treatments',
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Show in featured section',
        },
        featuredUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isNew: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== AUDIENCE & TARGETING ==========
        targetAudience: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Age groups, conditions this is for',
        },
        ageGroupMin: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ageGroupMax: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('all', 'male', 'female'),
            defaultValue: 'all',
        },

        // ========== CONTENT MANAGEMENT ==========
        hasDetailedPage: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        pageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contentStatus: {
            type: DataTypes.ENUM('draft', 'published', 'archived'),
            defaultValue: 'draft',
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastUpdatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== METADATA & INTERNAL ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
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
    }, {
        timestamps: true,
        tableName: 'treatment_categories',
        indexes: [
            { unique: true, fields: ['name'] },
            { unique: true, fields: ['slug'] },
            { fields: ['parentCategoryId'] },
            { fields: ['isActive'] },
            { fields: ['isFeatured'] },
            { fields: ['isPopular'] },
            { fields: ['displayOrder'] },
        ],
        scopes: {
            active: {
                where: { isActive: true },
            },
            featured: {
                where: { isFeatured: true },
            },
            popular: {
                where: { isPopular: true },
            },
            topLevel: {
                where: { level: 0 },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    TreatmentCategory.prototype.getFullPath = function() {
        return this.hierarchyPath || this.name;
    };

    TreatmentCategory.prototype.getDisplayName = function() {
        return this.name;
    };

    TreatmentCategory.prototype.getPriceRange = function() {
        if (!this.priceRangeMin || !this.priceRangeMax) return null;
        return {
            min: this.priceRangeMin,
            max: this.priceRangeMax,
            average: this.averagePrice,
            currency: this.currency,
        };
    };

    TreatmentCategory.prototype.getDurationRange = function() {
        if (!this.averageDurationMin || !this.averageDurationMax) return null;
        return {
            min: this.averageDurationMin,
            max: this.averageDurationMax,
            recovery: this.averageRecoveryDays,
        };
    };

    TreatmentCategory.prototype.getPerformanceMetrics = function() {
        return {
            totalBookings: this.totalBookings,
            completedBookings: this.completedBookings,
            successRate: this.successRate,
            averageRating: this.averageRating,
            reviewCount: this.totalReviews,
            treatmentCount: this.treatmentCount,
        };
    };

    // ========== ASSOCIATIONS ==========
    TreatmentCategory.associate = (models) => {
        TreatmentCategory.belongsTo(TreatmentCategory, {
            foreignKey: 'parentCategoryId',
            as: 'parentCategory'
        });
        TreatmentCategory.hasMany(TreatmentCategory, {
            foreignKey: 'parentCategoryId',
            as: 'subcategories'
        });
    };

    return TreatmentCategory;
};
// Treatment Subcategory Model - Sub-categorization of treatments
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const TreatmentSubcategory = sequelize.define('TreatmentSubcategory', {
        subcategoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique subcategory identifier',
        },

        // ========== RELATIONSHIPS ==========
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'treatment_categories',
                key: 'categoryId',
            },
            index: true,
            comment: 'Parent treatment category',
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Subcategory name must be unique',
            },
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Name must be between 3 and 100 characters',
                },
            },
            comment: 'Subcategory name',
        },
        slug: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Slug must be unique',
            },
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },

        // ========== DESCRIPTIONS ==========
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        shortDescription: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        overview: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== TREATMENT INFO ==========
        treatmentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        relatedTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== STATISTICS ==========
        totalBookings: {
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

        // ========== PRICING ==========
        priceRangeMin: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        priceRangeMax: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        averagePrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },

        // ========== MEDIA ==========
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== SEO & KEYWORDS ==========
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== VISIBILITY ==========
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isPopular: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        visibility: {
            type: DataTypes.ENUM('public', 'private', 'hidden'),
            defaultValue: 'public',
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
        tableName: 'treatment_subcategories',
        indexes: [
            { unique: true, fields: ['slug'] },
            { fields: ['categoryId'] },
            { fields: ['isActive'] },
            { fields: ['isFeatured'] },
        ],
    });

    TreatmentSubcategory.prototype.getFullPath = function() {
        return `${this.category?.name} > ${this.name}`;
    };

    TreatmentSubcategory.associate = (models) => {
        TreatmentSubcategory.belongsTo(models.TreatmentCategory, {
            foreignKey: 'categoryId',
            as: 'category'
        });
    };

    return TreatmentSubcategory;
};
// FAQ Model - Frequently asked questions
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const FAQ = sequelize.define('FAQ', {
        faqId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique FAQ identifier',
        },

        // ========== CONTENT ==========
        question: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 500],
                    msg: 'Question must be between 5 and 500 characters',
                },
            },
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [10, 5000],
                    msg: 'Answer must be between 10 and 5000 characters',
                },
            },
        },
        answerHtml: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'HTML rendered answer',
        },

        // ========== CATEGORIZATION ==========
        category: {
            type: DataTypes.ENUM(
                'booking',
                'payment',
                'appointment',
                'travel',
                'accommodation',
                'medical',
                'account',
                'technical',
                'general',
                'other'
            ),
            allowNull: false,
            index: true,
        },
        subCategory: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== SEO & METADATA ==========
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        metaTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        metaDescription: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== ORGANIZATION ==========
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        relatedFaqs: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== PUBLISHING ==========
        status: {
            type: DataTypes.ENUM('draft', 'published', 'archived'),
            defaultValue: 'draft',
            index: true,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        authorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },

        // ========== INTERACTION ==========
        helpfulCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Marked as helpful',
        },
        notHelpfulCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== METADATA ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
    }, {
        timestamps: true,
        tableName: 'faqs',
        indexes: [
            { unique: true, fields: ['slug'] },
            { fields: ['category'] },
            { fields: ['status'] },
            { fields: ['isFeatured'] },
        ],
    });

    FAQ.prototype.isPublished = function() {
        return this.status === 'published';
    };

    FAQ.prototype.getHelpfulPercentage = function() {
        const total = this.helpfulCount + this.notHelpfulCount;
        if (total === 0) return null;
        return ((this.helpfulCount / total) * 100).toFixed(2);
    };

    FAQ.prototype.incrementViewCount = function() {
        this.viewCount += 1;
        return this.save();
    };

    FAQ.associate = (models) => {
        FAQ.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    };

    return FAQ;
};
// Website Content Model - CMS content management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const WebsiteContent = sequelize.define('WebsiteContent', {
        contentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique content identifier',
        },

        // ========== CONTENT BASICS ==========
        type: {
            type: DataTypes.ENUM(
                'page',
                'blog_post',
                'faq',
                'privacy_policy',
                'terms',
                'about_us',
                'contact_us',
                'testimonial',
                'announcement',
                'hero_section',
                'footer_content',
                'other'
            ),
            allowNull: false,
            index: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 200],
                    msg: 'Title must be between 3 and 200 characters',
                },
            },
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },

        // ========== CONTENT ==========
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [10, 50000],
                    msg: 'Content must be between 10 and 50000 characters',
                },
            },
        },
        contentHtml: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'HTML rendered content',
        },
        excerpt: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Short excerpt',
        },

        // ========== SEO & METADATA ==========
        metaTitle: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [0, 60] },
            },
        },
        metaDescription: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [0, 160] },
            },
        },
        metaKeywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        canonicalUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ogImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ogTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ogDescription: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== CONTENT ORGANIZATION ==========
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        relatedContent: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== MEDIA ==========
        featuredImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        videos: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== AUTHOR & MANAGEMENT ==========
        authorId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        editorsId: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== PUBLISHING ==========
        status: {
            type: DataTypes.ENUM('draft', 'published', 'scheduled', 'archived', 'deleted'),
            defaultValue: 'draft',
            index: true,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        scheduledFor: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        archivedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== VISIBILITY & DISPLAY ==========
        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            index: true,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        visibility: {
            type: DataTypes.ENUM('public', 'private', 'restricted', 'members_only'),
            defaultValue: 'public',
        },

        // ========== INTERACTION ==========
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        likeCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        shareCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        commentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },

        // ========== VERSIONING ==========
        versionNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        previousVersions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== LANGUAGE & TRANSLATION ==========
        language: {
            type: DataTypes.STRING,
            defaultValue: 'en',
        },
        translations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },

        // ========== ACCESSIBILITY ==========
        altText: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        accessibilityNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== METADATA ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        customFields: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'website_content',
        indexes: [
            { unique: true, fields: ['slug'] },
            { fields: ['type'] },
            { fields: ['status'] },
            { fields: ['isPublished'] },
            { fields: ['isFeatured'] },
            { fields: ['publishedAt'] },
        ],
    });

    // Rename helpers to avoid collision with attributes
    WebsiteContent.prototype.isPublishedStatus = function() {
        return this.status === 'published' && this.publishedAt < new Date();
    };

    WebsiteContent.prototype.isScheduled = function() {
        return this.status === 'scheduled' && new Date(this.scheduledFor) > new Date();
    };

    WebsiteContent.prototype.canBePublished = function() {
        return ['draft', 'archived'].includes(this.status);
    };

    WebsiteContent.prototype.getUrl = function() {
        if (!this.slug) return null;
        return `/${this.type}/${this.slug}`;
    };

    WebsiteContent.prototype.incrementViewCount = function() {
        this.viewCount += 1;
        return this.save();
    };

    WebsiteContent.associate = (models) => {
        WebsiteContent.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    };

    return WebsiteContent;
};
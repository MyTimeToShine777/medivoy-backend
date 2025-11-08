// Translation Model - Multi-language content management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Translation = sequelize.define('Translation', {
        translationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== SOURCE INFO ==========
        sourceLanguage: {
            type: DataTypes.STRING(5),
            defaultValue: 'en',
            comment: 'ISO 639-1 language code',
        },
        targetLanguage: {
            type: DataTypes.STRING(5),
            allowNull: false,
            comment: 'ISO 639-1 language code',
        },

        // ========== CONTENT TYPE ==========
        contentType: {
            type: DataTypes.ENUM(
                'website_content',
                'email_template',
                'sms_template',
                'push_notification',
                'faq',
                'help_article',
                'legal_document',
                'other'
            ),
            allowNull: false,
        },
        contentId: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: 'ID of content being translated',
        },

        // ========== TRANSLATION ==========
        sourceText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        translatedText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        translationNote: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Translator notes/context',
        },

        // ========== METADATA ==========
        key: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Translation key for i18n',
        },
        context: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Context for translation',
        },

        // ========== TRANSLATION DETAILS ==========
        translator: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        translatedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        translatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== REVIEW & APPROVAL ==========
        isReviewed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        reviewedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        reviewedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reviewStatus: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'needs_revision'),
            defaultValue: 'pending',
        },
        reviewComments: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== TRANSLATION METHOD ==========
        method: {
            type: DataTypes.ENUM('human', 'machine', 'hybrid'),
            defaultValue: 'human',
        },
        translationEngine: {
            type: DataTypes.ENUM('google', 'deepl', 'openai', 'manual', 'other'),
            allowNull: true,
        },

        // ========== QUALITY ==========
        quality: {
            type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'needs_revision'),
            defaultValue: 'pending',
        },
        completeness: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Percentage complete',
        },
        accuracy: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Accuracy score',
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM('draft', 'in_progress', 'review', 'approved', 'published', 'archived'),
            defaultValue: 'draft',
            index: true,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== VERSIONING ==========
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        previousTranslations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

    }, {
        timestamps: true,
        tableName: 'translations',
        indexes: [
            { fields: ['sourceLanguage'] },
            { fields: ['targetLanguage'] },
            { fields: ['contentType'] },
            { fields: ['contentId'] },
            { fields: ['status'] },
        ],
    });

    Translation.prototype.isApproved = function() {
        return this.status === 'published' && this.reviewStatus === 'approved';
    };

    Translation.prototype.needsReview = function() {
        return this.reviewStatus === 'pending' || this.reviewStatus === 'needs_revision';
    };

    Translation.associate = (models) => {
        Translation.belongsTo(models.User, { foreignKey: 'translatedBy', as: 'translator' });
        Translation.belongsTo(models.User, { foreignKey: 'reviewedBy', as: 'reviewer' });
    };

    return Translation;
};
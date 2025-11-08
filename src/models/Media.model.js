// Media Model - Media file management and storage
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Media = sequelize.define('Media', {
        mediaId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== UPLOAD INFO ==========
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originalFilename: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'File size in bytes',
        },
        mimeType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileExtension: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== STORAGE ==========
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        storagePath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        storageProvider: {
            type: DataTypes.ENUM('local', 's3', 'cloudinary', 'imagekit', 'azure', 'gcs', 'other'),
            defaultValue: 's3',
        },
        storageKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== MEDIA TYPE ==========
        type: {
            type: DataTypes.ENUM(
                'image',
                'video',
                'audio',
                'document',
                'archive',
                'other'
            ),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM(
                'profile_picture',
                'hospital_image',
                'treatment_image',
                'medical_report',
                'prescription',
                'document',
                'banner',
                'thumbnail',
                'gallery',
                'video',
                'other'
            ),
            allowNull: true,
        },

        // ========== IMAGE SPECIFIC ==========
        width: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        aspectRatio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        thumbnailUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        optimizedUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== VIDEO SPECIFIC ==========
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in seconds',
        },
        videoCodec: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        audioCodec: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== UPLOAD DETAILS ==========
        uploadedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        uploadedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        // ========== USAGE & RELATIONSHIPS ==========
        relatedTo: {
            type: DataTypes.ENUM(
                'user',
                'hospital',
                'doctor',
                'treatment',
                'appointment',
                'review',
                'booking',
                'document',
                'other'
            ),
            allowNull: true,
        },
        relatedId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        usageCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== ACCESS & PERMISSIONS ==========
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        accessLevel: {
            type: DataTypes.ENUM('public', 'private', 'restricted', 'internal'),
            defaultValue: 'private',
        },
        sharedWith: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== METADATA & PROCESSING ==========
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        isProcessed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        processingStatus: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
            defaultValue: 'pending',
        },
        processingErrors: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== QUALITY & OPTIMIZATION ==========
        quality: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'original'),
            defaultValue: 'original',
        },
        isOptimized: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== EXPIRY & RETENTION ==========
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        retentionPolicy: {
            type: DataTypes.ENUM('permanent', '30_days', '90_days', 'custom'),
            defaultValue: 'permanent',
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'media',
        indexes: [
            { fields: ['uploadedBy'] },
            { fields: ['type'] },
            { fields: ['category'] },
            { fields: ['isPublic'] },
            { fields: ['createdAt'] },
        ],
    });

    Media.prototype.getFileSize = function() {
        const bytes = this.fileSize;
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    Media.prototype.isImage = function() {
        return this.type === 'image';
    };

    Media.prototype.isVideo = function() {
        return this.type === 'video';
    };

    Media.associate = (models) => {
        Media.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
    };

    return Media;
};
// DNA Kit Model - Genetic testing kits management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const DNAKit = sequelize.define('DNAKit', {
        kitId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== RELATIONSHIPS ==========
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            index: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
        },
        laboratoryId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'laboratories',
                key: 'laboratoryId',
            },
        },

        // ========== KIT DETAILS ==========
        kitNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        kitType: {
            type: DataTypes.ENUM(
                'ancestry',
                'health_screening',
                'carrier_screening',
                'pharmacogenomics',
                'wellness',
                'sports_genetics',
                'nutrition_genetics',
                'other'
            ),
            allowNull: false,
        },
        kitName: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'ordered',
                'shipped',
                'delivered',
                'sample_collected',
                'in_lab',
                'processing',
                'completed',
                'failed',
                'cancelled'
            ),
            defaultValue: 'ordered',
            index: true,
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== SHIPPING ==========
        shippingTrackingNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        shippedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        shippingAddress: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== SAMPLE ==========
        sampleCollectedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        sampleType: {
            type: DataTypes.ENUM('saliva', 'blood', 'buccal_swab'),
            defaultValue: 'saliva',
        },
        sampleQuality: {
            type: DataTypes.ENUM('good', 'fair', 'poor', 'rejected'),
            allowNull: true,
        },
        sampleId: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== RESULTS ==========
        resultsReady: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        resultsReadyAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reportUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reportDownloadedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        results: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Genetic test results',
        },

        // ========== PROCESSING ==========
        processingStatus: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'failed'),
            defaultValue: 'pending',
        },
        processingStartedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        processingCompletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        processingError: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== ANALYSIS ==========
        genesCovered: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        riskAssessment: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        recommendations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== GENETIC COUNSELING ==========
        counselingRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        counselorAssigned: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        counselingCompletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== CONSENT & PRIVACY ==========
        consentObtained: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        consentDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isResultsShared: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        sharedWith: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== METADATA ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

    }, {
        timestamps: true,
        tableName: 'dna_kits',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { unique: true, fields: ['kitNumber'] },
        ],
    });

    DNAKit.prototype.isCompleted = function() {
        return this.status === 'completed' && this.resultsReady;
    };

    DNAKit.prototype.canDownloadResults = function() {
        return this.resultsReady && this.reportUrl;
    };

    DNAKit.associate = (models) => {
        DNAKit.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        DNAKit.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        DNAKit.belongsTo(models.Laboratory, { foreignKey: 'laboratoryId', as: 'laboratory' });
        DNAKit.belongsTo(models.User, { foreignKey: 'counselorAssigned', as: 'counselor' });
    };

    return DNAKit;
};
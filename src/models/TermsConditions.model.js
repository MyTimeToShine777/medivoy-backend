// Terms & Conditions Model - Terms and service versioning
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const TermsConditions = sequelize.define('TermsConditions', {
        termsId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== VERSION INFO ==========
        version: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^\d+\.\d+(\.\d+)?$/,
                    msg: 'Version must be in format x.y or x.y.z',
                },
            },
        },
        versionNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== CONTENT ==========
        title: {
            type: DataTypes.STRING,
            defaultValue: 'Terms and Conditions',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        contentHtml: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== SECTIONS ==========
        sections: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        keyPoints: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== COMPLIANCE ==========
        applicableCountries: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        applicableRegions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        gdprCompliant: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        ccpaCompliant: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== DATES ==========
        effectiveDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        lastModifiedDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        nextReviewDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== STATUS & PUBLISHING ==========
        status: {
            type: DataTypes.ENUM('draft', 'active', 'archived', 'pending_review'),
            defaultValue: 'draft',
        },
        isCurrentVersion: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== APPROVAL ==========
        approvedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        legalReviewStatus: {
            type: DataTypes.ENUM('not_reviewed', 'in_review', 'approved', 'rejected'),
            defaultValue: 'not_reviewed',
        },
        legalReviewBy: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Legal reviewer name/firm',
        },

        // ========== CHANGES ==========
        changesFromPrevious: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        changesSummary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== USER ACCEPTANCE ==========
        requiresUserAcceptance: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        usersAcceptedCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalActiveUsers: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        acceptanceDeadline: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== DISPUTE & LEGAL ==========
        disputeResolutionMethod: {
            type: DataTypes.ENUM('arbitration', 'litigation', 'mediation'),
            defaultValue: 'arbitration',
        },
        jurisdiction: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        governingLaw: {
            type: DataTypes.STRING,
            allowNull: true,
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
        tableName: 'terms_conditions',
        indexes: [
            { fields: ['status'] },
            { fields: ['isCurrentVersion'] },
            { fields: ['effectiveDate'] },
        ],
    });

    TermsConditions.prototype.isActive = function() {
        return this.status === 'active' && new Date(this.effectiveDate) <= new Date();
    };

    TermsConditions.prototype.getAcceptanceRate = function() {
        if (this.totalActiveUsers === 0) return 0;
        return ((this.usersAcceptedCount / this.totalActiveUsers) * 100).toFixed(2);
    };

    TermsConditions.associate = (models) => {
        TermsConditions.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
    };

    return TermsConditions;
};
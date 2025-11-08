// Audit Log Model - Admin activity logging and compliance
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        logId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique audit log identifier',
        },

        // ========== ADMIN/USER INFORMATION ==========
        adminId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Admin who performed action',
        },
        adminName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Admin name snapshot',
        },
        adminEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        adminRole: {
            type: DataTypes.ENUM('super_admin', 'admin', 'hospital_admin', 'moderator'),
            allowNull: true,
        },

        // ========== ACTION INFORMATION ==========
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Action must be between 3 and 100 characters',
                },
            },
            index: true,
            comment: 'Action performed (e.g., "Create", "Update", "Delete")',
        },
        actionType: {
            type: DataTypes.ENUM(
                'create',
                'read',
                'update',
                'delete',
                'approve',
                'reject',
                'publish',
                'archive',
                'restore',
                'export',
                'import',
                'download',
                'upload',
                'login',
                'logout',
                'permission_change',
                'status_change',
                'mass_action',
                'bulk_import',
                'other'
            ),
            allowNull: false,
            index: true,
            comment: 'Type of action',
        },

        // ========== RESOURCE INFORMATION ==========
        module: {
            type: DataTypes.ENUM(
                'users',
                'bookings',
                'payments',
                'refunds',
                'hospitals',
                'doctors',
                'treatments',
                'packages',
                'coupons',
                'reviews',
                'documents',
                'insurance',
                'appointments',
                'settings',
                'content',
                'notifications',
                'communications',
                'analytics',
                'reports',
                'system',
                'security',
                'compliance',
                'other'
            ),
            allowNull: false,
            index: true,
            comment: 'Module/area being modified',
        },
        entityType: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Type of entity (Booking, User, etc)',
        },
        entityId: {
            type: DataTypes.UUID,
            allowNull: true,
            index: true,
            comment: 'ID of affected entity',
        },
        entityName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Name/title of affected entity',
        },

        // ========== CHANGE TRACKING ==========
        oldValues: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Previous values before change',
        },
        newValues: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'New values after change',
        },
        changedFields: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'List of fields that changed',
        },
        changes: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Detailed change records (field: old -> new)',
        },

        // ========== DESCRIPTION & CONTEXT ==========
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Human-readable description of action',
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for the action',
        },
        comments: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional comments/notes',
        },

        // ========== RESULT & STATUS ==========
        status: {
            type: DataTypes.ENUM('success', 'failed', 'attempted', 'unauthorized', 'error', 'pending'),
            defaultValue: 'success',
            index: true,
            comment: 'Outcome of action',
        },
        resultCode: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Result/error code',
        },
        resultMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Result message or error',
        },
        errorDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Detailed error information if failed',
        },

        // ========== SECURITY & AUDIT INFO ==========
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIP: true,
            },
            comment: 'Admin IP address',
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Browser/client user agent',
        },
        deviceInfo: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Device information',
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Session ID',
        },
        requestId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Request/transaction ID for tracking',
        },

        // ========== AFFECTED USERS ==========
        affectedUsers: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Users affected by this action',
        },
        affectedRecords: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of records affected (for bulk actions)',
        },

        // ========== APPROVAL & AUTHORIZATION ==========
        requiresApproval: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        approvedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Who approved this action',
        },
        approvalStatus: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowValue: true,
        },
        approvalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approvalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== AUDIT TRAIL DETAILS ==========
        auditLevel: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            defaultValue: 'medium',
            comment: 'Importance/sensitivity level',
        },
        isSensitiveData: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If contains sensitive data',
        },
        isHighRisk: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If high-risk operation',
        },
        complianceRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If compliance review needed',
        },

        // ========== RELATED ACTIONS ==========
        relatedLogIds: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Related audit log IDs',
        },
        triggeredBy: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Parent action that triggered this',
        },

        // ========== PERFORMANCE METRICS ==========
        executionTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Execution time in milliseconds',
        },
        queryCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of database queries',
        },
        recordsProcessed: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== RETENTION & ARCHIVAL ==========
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        archivedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        archiveReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When log should be deleted per retention policy',
        },

        // ========== COMPLIANCE & INVESTIGATION ==========
        complianceStatus: {
            type: DataTypes.ENUM('compliant', 'non_compliant', 'under_review', 'flagged'),
            defaultValue: 'compliant',
        },
        investigationStatus: {
            type: DataTypes.ENUM('none', 'pending', 'in_progress', 'completed', 'escalated'),
            defaultValue: 'none',
        },
        investigationNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        flaggedFor: {
            type: DataTypes.ENUM('review', 'investigation', 'compliance', 'security', 'fraud'),
            allowNull: true,
        },

        // ========== METADATA ==========
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Audit tags for categorization',
        },
        category: {
            type: DataTypes.ENUM('routine', 'sensitive', 'critical', 'suspicious', 'anomaly'),
            defaultValue: 'routine',
        },
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
            defaultValue: 'normal',
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'audit_logs',
        indexes: [
            { fields: ['adminId'] },
            { fields: ['module'] },
            { fields: ['action'] },
            { fields: ['entityId'] },
            { fields: ['status'] },
            { fields: ['createdAt'] },
            { fields: ['ipAddress'] },
            { fields: ['isHighRisk'] },
            { fields: ['complianceStatus'] },
        ],
        scopes: {
            failed: {
                where: { status: 'failed' },
            },
            critical: {
                where: { auditLevel: 'critical' },
            },
            highRisk: {
                where: { isHighRisk: true },
            },
            needsReview: {
                where: { complianceRequired: true },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    AuditLog.prototype.getChangesSummary = function() {
        if (!this.changes) return null;
        return Object.entries(this.changes).map(([field, change]) =>
            `${field}: ${change.old} → ${change.new}`
        ).join('; ');
    };

    AuditLog.prototype.isHighRiskOperation = function() {
        return this.isHighRisk || this.auditLevel === 'critical';
    };

    AuditLog.prototype.needsReview = function() {
        return this.complianceRequired || this.isHighRisk || this.isSensitiveData;
    };

    AuditLog.prototype.requiresApprovalFlow = function() {
        return this.requiresApproval && this.status === 'pending';
    };

    // ========== CLASS METHODS ==========
    AuditLog.getAdminActivity = async function(adminId, days = 7) {
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return this.findAll({
            where: {
                adminId,
                createdAt: {
                    [sequelize.Sequelize.Op.gte]: startDate },
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });
    };

    // ========== ASSOCIATIONS ==========
    AuditLog.associate = (models) => {
        AuditLog.belongsTo(models.User, { foreignKey: 'adminId', as: 'admin' });
        AuditLog.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
    };

    return AuditLog;
};
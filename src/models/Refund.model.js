// Refund Model - Refund processing and tracking
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Refund = sequelize.define('Refund', {
        refundId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique refund identifier',
        },

        // ========== RELATIONSHIPS ==========
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            index: true,
            comment: 'Booking being refunded',
        },
        paymentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'payments',
                key: 'paymentId',
            },
            index: true,
            comment: 'Original payment',
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Patient requesting refund',
        },

        // ========== REFUND DETAILS ==========
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
            comment: 'Refund amount',
        },
        originalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Original payment amount',
        },
        refundPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
            comment: 'Percentage of original amount',
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },

        // ========== REFUND REASON ==========
        reason: {
            type: DataTypes.ENUM(
                'booking_cancelled',
                'payment_error',
                'duplicate_charge',
                'service_not_rendered',
                'poor_experience',
                'patient_request',
                'medical_reasons',
                'financial_hardship',
                'schedule_change',
                'doctor_cancellation',
                'hospital_closure',
                'system_error',
                'adjustment',
                'discount_reversal',
                'other'
            ),
            allowNull: false,
            comment: 'Reason for refund',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [10, 500],
                    msg: 'Description must be between 10 and 500 characters',
                },
            },
            comment: 'Detailed reason description',
        },

        // ========== REFUND STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'requested',
                'pending',
                'approved',
                'rejected',
                'processing',
                'initiated',
                'completed',
                'failed',
                'cancelled'
            ),
            defaultValue: 'requested',
            index: true,
            comment: 'Refund lifecycle status',
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'History of status changes',
        },

        // ========== REFUND METHOD ==========
        refundMethod: {
            type: DataTypes.ENUM(
                'original_payment',
                'wallet',
                'bank_transfer',
                'check',
                'credit_to_account',
                'store_credit'
            ),
            allowNull: true,
            comment: 'How refund will be processed',
        },
        refundToWallet: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== BANK DETAILS (if bank transfer) ==========
        bankAccountName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bankAccountNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bankRoutingNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bankCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bankCountry: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        swiftCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        iban: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bankDetailsVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== TRANSACTION DETAILS ==========
        refundTransactionId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            comment: 'Gateway refund transaction ID',
        },
        refundReferenceId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gatewayResponse: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Response from payment gateway',
        },

        // ========== APPROVALS & AUTHORIZATION ==========
        approvalStatus: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
        },
        approvedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Admin who approved',
        },
        approvalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approvalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rejectedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== PROCESSING ==========
        initiatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When refund processing started',
        },
        processedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When refund was sent',
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When refund was confirmed received',
        },
        expectedCompletionDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        processingTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Time taken in hours',
        },

        // ========== FAILURE HANDLING ==========
        failureReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        failureCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        retryAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        maxRetryAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
        },
        nextRetryAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isRetryable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        failedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== DEDUCTIONS & CHARGES ==========
        deductionAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            comment: 'Amount deducted from refund',
        },
        deductionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cancellationFeeApplied: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        cancellationFeeAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        processingFee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
        },
        netRefundAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Final refund amount after deductions',
        },

        // ========== DOCUMENTATION ==========
        receiptUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        confirmationUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        documents: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Related document URLs',
        },

        // ========== COMMUNICATION ==========
        notificationSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        notificationSentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        confirmationEmailSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== DISPUTES & ESCALATION ==========
        isDisputed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        disputeReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        disputedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        disputedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        isEscalated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        escalatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== AUDIT TRAIL ==========
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Admin who initiated refund',
        },
        modifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        lastModifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== METADATA & NOTES ==========
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Internal staff notes',
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
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
    }, {
        timestamps: true,
        tableName: 'refunds',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['paymentId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['createdAt'] },
        ],
        scopes: {
            pending: {
                where: { status: 'pending' },
            },
            completed: {
                where: { status: 'completed' },
            },
            failed: {
                where: { status: 'failed' },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Refund.prototype.getRefundNumber = function() {
        return `REF-${this.refundId.slice(0, 8).toUpperCase()}`;
    };

    Refund.prototype.canBeApproved = function() {
        return this.status === 'requested' && this.approvalStatus === 'pending';
    };

    Refund.prototype.canBeRetried = function() {
        return this.isRetryable && this.retryAttempts < this.maxRetryAttempts && this.status === 'failed';
    };

    Refund.prototype.getRefundSummary = function() {
        return {
            originalAmount: this.originalAmount,
            deductions: this.deductionAmount + this.processingFee,
            netAmount: this.netRefundAmount,
            method: this.refundMethod,
            status: this.status,
            estimatedDate: this.expectedCompletionDate,
        };
    };

    Refund.prototype.getProcessingTimeInHours = function() {
        if (!this.initiatedAt || !this.completedAt) return null;
        return Math.floor((new Date(this.completedAt) - new Date(this.initiatedAt)) / (1000 * 60 * 60));
    };

    Refund.prototype.requiresApproval = function() {
        return this.amount > 5000; // High-value refunds need approval
    };

    // ========== ASSOCIATIONS ==========
    Refund.associate = (models) => {
        Refund.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Refund.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
        Refund.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        Refund.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
    };

    return Refund;
};
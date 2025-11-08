// Insurance Model - Patient insurance records and claims
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Insurance = sequelize.define('Insurance', {
        insuranceId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique insurance record identifier',
        },

        // ========== RELATIONSHIPS ==========
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Patient who owns insurance',
        },

        // ========== INSURANCE BASIC INFO ==========
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Provider name must be between 3 and 100 characters',
                },
            },
            comment: 'Insurance company name',
        },
        providerCode: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Insurance company code',
        },
        providerContact: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                phone: '',
                email: '',
                website: '',
            },
            comment: 'Insurance provider contact info',
        },
        policyNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 50],
                    msg: 'Policy number must be between 5 and 50 characters',
                },
            },
            unique: {
                msg: 'Policy number already registered',
            },
            comment: 'Insurance policy number',
        },
        groupPolicyNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Group policy number if applicable',
        },

        // ========== POLICY DETAILS ==========
        policyType: {
            type: DataTypes.ENUM(
                'health',
                'travel',
                'medical_tourism',
                'critical_illness',
                'accident',
                'hospitalization',
                'dental',
                'vision',
                'maternity',
                'senior_citizen',
                'combo',
                'other'
            ),
            allowNull: false,
            comment: 'Type of insurance policy',
        },
        policyName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        policyDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        policyDocumentUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to policy document PDF',
        },
        policyDocumentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'documents',
                key: 'documentId',
            },
        },

        // ========== COVERAGE DETAILS ==========
        coverageAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            validate: {
                min: 0,
            },
            comment: 'Total coverage amount',
        },
        deductible: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            comment: 'Deductible amount per claim',
        },
        copay: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            comment: 'Co-payment percentage or amount',
        },
        coinsurance: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Co-insurance percentage',
        },
        outOfPocketMax: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Maximum out-of-pocket amount',
        },
        remainingCoverage: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Remaining coverage amount',
        },

        // ========== COVERAGE DETAILS (DETAILED) ==========
        coverageDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                hospitalization: true,
                surgery: true,
                medicines: true,
                diagnostics: true,
                outpatient: false,
                dental: false,
                vision: false,
                maternity: false,
                preExisting: false,
            },
            comment: 'What is covered',
        },
        exclusions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'What is NOT covered',
        },
        restrictions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Policy restrictions and limitations',
        },
        waitingPeriod: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Waiting period in days',
        },

        // ========== COVERAGE FOR TREATMENTS ==========
        applicableTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Which treatments are covered',
        },
        applicableCountries: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Countries where coverage applies',
        },
        networkHospitals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'List of network hospitals',
        },

        // ========== DATES & VALIDITY ==========
        issueDate: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isBefore: new Date().toISOString().split('T')[0],
            },
            comment: 'When policy was issued',
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When coverage starts',
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isAfter: new Date().toISOString().split('T')[0],
            },
            comment: 'When policy expires',
        },
        renewalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'expired', 'suspended', 'cancelled', 'pending'),
            defaultValue: 'active',
            index: true,
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'History of status changes',
        },

        // ========== MEMBER & DEPENDENT INFO ==========
        memberName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Name on policy (may differ from user)',
        },
        memberId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Member ID on policy',
        },
        relationshipToHolders: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Other covered members/dependents',
        },
        dependentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== PREMIUM DETAILS ==========
        premiumAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Annual premium',
        },
        premiumFrequency: {
            type: DataTypes.ENUM('monthly', 'quarterly', 'semi-annual', 'annual'),
            defaultValue: 'annual',
        },
        premiumPaidUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        nextPremiumDue: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isAutoRenewal: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== CLAIMS & USAGE ==========
        totalClaimsSubmitted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalClaimsApproved: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalClaimsRejected: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalClaimsAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
            comment: 'Total amount claimed',
        },
        totalClaimsApprovedAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
            comment: 'Total amount approved',
        },
        totalClaimsPaidAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.0,
            comment: 'Total amount actually paid',
        },
        lastClaimDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        pendingClaims: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== CLAIM HISTORY & DOCUMENTS ==========
        claimsHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Claim records with amounts and status',
        },
        claimDocuments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of document IDs for claims',
        },

        // ========== AUTHORIZATION & VERIFICATION ==========
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verificationStatus: {
            type: DataTypes.ENUM('pending', 'verified', 'rejected', 'expired'),
            defaultValue: 'pending',
        },
        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        authorizationRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        authorizationCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        preAuthorizationNeeded: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== COMMUNICATION ==========
        insuredEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isEmail: true },
        },
        insuredPhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        agentName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Insurance agent name',
        },
        agentContact: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== PREMIUM & PAYMENT TRACKING ==========
        lastPremiumPaidAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastPremiumPaidAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        paymentMethod: {
            type: DataTypes.ENUM('credit_card', 'debit_card', 'net_banking', 'auto_pay', 'cheque'),
            allowNull: true,
        },
        isPremiumPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

        // ========== COMPLIANCE & AUDIT ==========
        complianceStatus: {
            type: DataTypes.ENUM('compliant', 'non_compliant', 'under_review'),
            defaultValue: 'compliant',
        },
        lastAuditDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        auditNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
        isPrimary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Primary insurance for this patient',
        },
    }, {
        timestamps: true,
        tableName: 'insurances',
        indexes: [
            { fields: ['userId'] },
            { fields: ['policyNumber'] },
            { fields: ['status'] },
            { fields: ['isActive'] },
            { fields: ['expiryDate'] },
        ],
        scopes: {
            active: {
                where: { status: 'active' },
            },
            expired: {
                where: { status: 'expired' },
            },
            verified: {
                where: { isVerified: true },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Insurance.prototype.isExpired = function() {
        if (!this.expiryDate) return false;
        return new Date(this.expiryDate) < new Date();
    };

    Insurance.prototype.getDaysUntilExpiry = function() {
        if (!this.expiryDate) return null;
        const today = new Date();
        const expiry = new Date(this.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    Insurance.prototype.isExpiringSoon = function(days = 30) {
        const daysLeft = this.getDaysUntilExpiry();
        return daysLeft && daysLeft <= days && daysLeft > 0;
    };

    Insurance.prototype.canUseCoverage = function(treatmentType) {
        if (!this.status === 'active' || this.isExpired()) return false;
        return this.applicableTreatments.includes(treatmentType);
    };

    Insurance.prototype.getRemainingCoverage = function() {
        return this.coverageAmount - this.totalClaimsApprovedAmount;
    };

    Insurance.prototype.getClaimsSummary = function() {
        return {
            submitted: this.totalClaimsSubmitted,
            approved: this.totalClaimsApproved,
            rejected: this.totalClaimsRejected,
            pending: this.pendingClaims,
            totalAmount: this.totalClaimsAmount,
            approvedAmount: this.totalClaimsApprovedAmount,
            paidAmount: this.totalClaimsPaidAmount,
            approvalRate: this.totalClaimsSubmitted > 0 ?
                ((this.totalClaimsApproved / this.totalClaimsSubmitted) * 100).toFixed(2) :
                0,
        };
    };

    Insurance.prototype.getNetworkHospitalCount = function() {
        return this.networkHospitals ? this.networkHospitals.length : 0;
    };

    Insurance.prototype.requiresAuthorization = function(treatmentType) {
        return this.authorizationRequired && this.applicableTreatments.includes(treatmentType);
    };

    // ========== ASSOCIATIONS ==========
    Insurance.associate = (models) => {
        Insurance.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        Insurance.belongsTo(models.Document, { foreignKey: 'policyDocumentId', as: 'policyDocument' });
        Insurance.belongsTo(models.User, { foreignKey: 'verifiedBy', as: 'verifier' });
    };

    return Insurance;
};
// Document Model - Patient medical and travel documents
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Document = sequelize.define('Document', {
        documentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique document identifier',
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
            comment: 'Patient who owns document',
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            index: true,
            comment: 'Related booking if applicable',
        },

        // ========== DOCUMENT CLASSIFICATION ==========
        type: {
            type: DataTypes.ENUM(
                'passport',
                'visa',
                'visa_approval',
                'travel_insurance',
                'medical_report',
                'test_report',
                'lab_report',
                'imaging_report',
                'prescription',
                'discharge_summary',
                'surgery_report',
                'pathology_report',
                'vaccination_certificate',
                'allergy_report',
                'medication_list',
                'medical_history',
                'previous_surgery',
                'insurance_card',
                'insurance_policy',
                'id_proof',
                'driving_license',
                'govt_id',
                'aadhar',
                'passport_scan',
                'photo',
                'consent_form',
                'release_form',
                'medical_questionnaire',
                'accommodation_booking',
                'flight_ticket',
                'invoice',
                'receipt',
                'payment_proof',
                'affidavit',
                'authorization_letter',
                'power_of_attorney',
                'medical_certificate',
                'fitness_certificate',
                'transfer_letter',
                'recommendation_letter',
                'other'
            ),
            allowNull: false,
            index: true,
            comment: 'Document type classification',
        },
        category: {
            type: DataTypes.ENUM(
                'medical',
                'travel',
                'insurance',
                'identification',
                'legal',
                'financial',
                'administrative',
                'other'
            ),
            allowNull: false,
            comment: 'Document category',
        },

        // ========== FILE INFORMATION ==========
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 255],
                    msg: 'Filename must be between 3 and 255 characters',
                },
            },
            comment: 'Original filename',
        },
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {
                    msg: 'Invalid URL format',
                },
            },
            comment: 'URL to document file',
        },
        thumbnailUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to document thumbnail',
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 104857600, // 100MB max
            },
            comment: 'File size in bytes',
        },
        mimeType: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'File MIME type (PDF, JPG, PNG, etc)',
        },
        fileExtension: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIn: {
                    args: [
                        ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']
                    ],
                },
            },
            comment: 'File extension',
        },
        pageCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of pages (for PDFs)',
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Duration in seconds (for videos)',
        },

        // ========== DOCUMENT METADATA ==========
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 1000],
                    msg: 'Description must not exceed 1000 characters',
                },
            },
            comment: 'Document description',
        },
        issuedDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When document was issued',
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When document expires',
        },
        issuerName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Who issued the document',
        },
        issuerAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        documentNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Document reference number',
        },
        referenceNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            comment: 'System reference number',
        },

        // ========== MEDICAL DOCUMENT SPECIFIC ==========
        doctorandName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hospitalName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        testName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'For lab/test reports',
        },
        testResult: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        diagnosis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        recommendations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== TRAVEL DOCUMENT SPECIFIC ==========
        travelFrom: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        travelTo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        travelDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        ticketNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== VISIBILITY & ACCESS CONTROL ==========
        visibility: {
            type: DataTypes.ENUM('private', 'hospital_staff', 'doctors', 'insurance', 'specific_users'),
            defaultValue: 'private',
            comment: 'Who can view this document',
        },
        sharedWith: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of user IDs document is shared with',
        },
        allowDownload: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        allowShare: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        downloadCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lastDownloadedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== UPLOAD & VERIFICATION ==========
        uploadedBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'User who uploaded (if staff)',
        },
        uploadedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verificationStatus: {
            type: DataTypes.ENUM('pending', 'verified', 'rejected', 'expired'),
            defaultValue: 'pending',
            index: true,
            comment: 'Verification status',
        },
        verificationNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
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
            comment: 'Staff who verified',
        },
        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Why document was rejected',
        },
        rejectedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== COMPLIANCE & REQUIREMENTS ==========
        requiredFor: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Required for which processes',
        },
        isMandatory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isProcessingRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        processingStatus: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
            defaultValue: 'pending',
        },

        // ========== ENCRYPTION & SECURITY ==========
        isEncrypted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        encryptionMethod: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        passwordProtected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        accessLog: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Access history',
        },

        // ========== STORAGE INFO ==========
        storagePath: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Storage location',
        },
        backupLocation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ocrData: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'OCR extracted text',
        },

        // ========== METADATA & TAGGING ==========
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        archivedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isDuplicate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If this is a duplicate upload',
        },
        duplicateOfId: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'ID of original document if duplicate',
        },
    }, {
        timestamps: true,
        tableName: 'documents',
        indexes: [
            { fields: ['userId'] },
            { fields: ['bookingId'] },
            { fields: ['type'] },
            { fields: ['category'] },
            { fields: ['verificationStatus'] },
            { fields: ['isActive'] },
            { unique: true, fields: ['referenceNumber'] },
        ],
        scopes: {
            verified: {
                where: { verificationStatus: 'verified' },
            },
            pending: {
                where: { verificationStatus: 'pending' },
            },
            rejected: {
                where: { verificationStatus: 'rejected' },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    Document.prototype.isExpired = function() {
        if (!this.expiryDate) return false;
        return new Date(this.expiryDate) < new Date();
    };

    Document.prototype.getDaysUntilExpiry = function() {
        if (!this.expiryDate) return null;
        const today = new Date();
        const expiry = new Date(this.expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    Document.prototype.isVerified = function() {
        return this.verificationStatus === 'verified';
    };

    Document.prototype.canDownload = function(userId) {
        if (!this.allowDownload) return false;
        if (this.userId === userId) return true;
        return this.sharedWith.includes(userId);
    };

    Document.prototype.canShare = function(userId) {
        return this.allowShare && this.userId === userId;
    };

    Document.prototype.getShareableLink = function() {
        if (!this.allowShare) return null;
        // Generate shareable link
        return `${process.env.APP_URL}/documents/shared/${this.documentId}`;
    };

    Document.prototype.addAccessLog = function(userId, action) {
        const log = {
            userId,
            action,
            timestamp: new Date(),
        };
        if (!this.accessLog) this.accessLog = [];
        this.accessLog.push(log);
    };

    // ========== ASSOCIATIONS ==========
    Document.associate = (models) => {
        Document.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
        Document.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Document.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploadedByUser' });
        Document.belongsTo(models.User, { foreignKey: 'verifiedBy', as: 'verifier' });
    };

    return Document;
};
// Invoice Model - Billing and invoicing
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Invoice = sequelize.define('Invoice', {
        invoiceId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique invoice identifier',
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
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Patient/Customer',
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
        },
        paymentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'payments',
                key: 'paymentId',
            },
        },

        // ========== INVOICE DETAILS ==========
        invoiceNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        invoiceDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('draft', 'issued', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled'),
            defaultValue: 'draft',
            index: true,
        },
        type: {
            type: DataTypes.ENUM('invoice', 'credit_note', 'debit_note', 'estimate', 'receipt'),
            defaultValue: 'invoice',
        },

        // ========== PARTY DETAILS ==========
        billTo: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {
                name: '',
                email: '',
                phone: '',
                address: '',
            },
        },
        shipTo: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        billFrom: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                name: '',
                address: '',
                email: '',
                phone: '',
            },
        },

        // ========== LINE ITEMS ==========
        lineItems: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of line items {description, quantity, unitPrice, amount}',
        },
        itemCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== AMOUNTS ==========
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        taxable: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        discountPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        discountReason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        taxAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        taxRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        shippingCharges: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        otherCharges: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },

        // ========== PAYMENT DETAILS ==========
        amountPaid: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        amountDue: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        paymentTerms: {
            type: DataTypes.ENUM('immediate', 'net_7', 'net_14', 'net_30', 'net_60', 'custom'),
            defaultValue: 'immediate',
        },
        paymentMethod: {
            type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'upi', 'net_banking', 'cash', 'cheque'),
            allowNull: true,
        },
        paymentDueDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== TIMING ==========
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        viewedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== NOTES & REFERENCES ==========
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        purchaseOrderNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        referenceNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        terms: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== TAX DETAILS ==========
        taxId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hsn: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'HSN codes for GST',
        },
        gst: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'GST details',
        },

        // ========== DOCUMENTS ==========
        invoicePdf: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        attachment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        receipt: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== AUDIT & HISTORY ==========
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        lastModifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        modificationHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== STATUS TRACKING ==========
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isCancelled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== REMINDERS ==========
        paymentReminderSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        reminderSentAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dueReminderSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        overdueReminderSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== METADATA ==========
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

    }, {
        timestamps: true,
        tableName: 'invoices',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { unique: true, fields: ['invoiceNumber'] },
            { fields: ['invoiceDate'] },
        ],
    });

    Invoice.prototype.isOverdue = function() {
        if (!this.paymentDueDate || this.status === 'paid') return false;
        return new Date(this.paymentDueDate) < new Date();
    };

    Invoice.prototype.isPaid = function() {
        return this.status === 'paid';
    };

    Invoice.prototype.calculateAmountDue = function() {
        return this.totalAmount - this.amountPaid;
    };

    Invoice.prototype.getInvoiceDisplay = function() {
        return {
            number: this.invoiceNumber,
            date: this.invoiceDate,
            total: this.totalAmount,
            paid: this.amountPaid,
            due: this.calculateAmountDue(),
            status: this.status,
        };
    };

    Invoice.associate = (models) => {
        Invoice.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Invoice.belongsTo(models.User, { foreignKey: 'userId', as: 'customer' });
        Invoice.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Invoice.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
    };

    return Invoice;
};
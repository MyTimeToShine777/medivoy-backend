import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'id',
        },
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    tax: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
    },
    discount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
    },
    total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'INR',
    },
    status: {
        type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
        defaultValue: 'draft',
    },
    items: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pdfUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
});

export default Invoice;
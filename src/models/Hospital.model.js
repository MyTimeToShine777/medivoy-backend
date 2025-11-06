// Hospital Model - NO optional chaining
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Hospital = sequelize.define('Hospital', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'countries',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    accreditation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    totalBeds: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'hospitals',
    timestamps: true,
    underscored: true,
});

export default Hospital;
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
        planId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        billingCycle: {
            type: DataTypes.ENUM('monthly', 'yearly', 'one_time'),
            defaultValue: 'monthly',
        },
        features: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'subscription_plans',
        timestamps: true,
    });

    return SubscriptionPlan;
};
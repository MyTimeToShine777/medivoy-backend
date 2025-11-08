// Train Model - Train bookings and transportation
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Train = sequelize.define('Train', {
        trainId: {
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

        // ========== TRAIN DETAILS ==========
        trainNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trainName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        trainType: {
            type: DataTypes.ENUM(
                'high_speed',
                'express',
                'local',
                'regional',
                'intercity',
                'sleeper',
                'metro'
            ),
            allowNull: true,
        },

        // ========== ROUTE ==========
        departureCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        departureStation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrivalCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrivalStation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stops: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== TIMING ==========
        departureDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        departureTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        arrivalDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        arrivalTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        journeyDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'In minutes',
        },

        // ========== PASSENGER & SEAT ==========
        numberOfPassengers: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        passengerNames: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        seatClass: {
            type: DataTypes.ENUM('sleeper', 'ac_3_tier', 'ac_2_tier', 'first_ac', 'chair_car', 'unreserved'),
            defaultValue: 'ac_2_tier',
        },
        seatNumbers: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== PRICING ==========
        basePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        taxes: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        totalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },

        // ========== BOOKING STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'pending',
                'confirmed',
                'ticket_issued',
                'cancelled',
                'completed',
                'no_show'
            ),
            defaultValue: 'pending',
            index: true,
        },
        bookingReference: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        ticketNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== PAYMENT ==========
        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        paymentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'payments',
                key: 'paymentId',
            },
        },

        // ========== DOCUMENTS ==========
        ticketUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bookingConfirmation: {
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

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        timestamps: true,
        tableName: 'trains',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['departureDate'] },
        ],
    });

    Train.prototype.getTrainNumber = function() {
        return this.trainNumber;
    };

    Train.prototype.isUpcoming = function() {
        return new Date(this.departureDate) > new Date() && this.status !== 'cancelled';
    };

    Train.associate = (models) => {
        Train.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Train.belongsTo(models.User, { foreignKey: 'userId', as: 'passenger' });
        Train.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
    };

    return Train;
};
// Flight Model - Flight bookings and arrangements
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Flight = sequelize.define('Flight', {
        flightId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique flight booking identifier',
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
        travelArrangementId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'travel_arrangements',
                key: 'arrangementId',
            },
        },

        // ========== FLIGHT DETAILS ==========
        type: {
            type: DataTypes.ENUM('outbound', 'return', 'multi_city', 'connecting'),
            allowNull: false,
        },
        airline: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Airline name',
        },
        airlineCode: {
            type: DataTypes.STRING(2),
            allowNull: true,
        },
        flightNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        aircraftType: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== ROUTE DETAILS ==========
        departureAirport: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        departureAirportCode: {
            type: DataTypes.STRING(3),
            allowNull: true,
        },
        departureCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        departureCountry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrivalAirport: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrivalAirportCode: {
            type: DataTypes.STRING(3),
            allowNull: true,
        },
        arrivalCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrivalCountry: {
            type: DataTypes.STRING,
            allowNull: false,
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
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Flight duration in minutes',
        },
        flightHours: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: true,
            comment: 'Flight hours with decimals',
        },
        numberOfStops: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        stopDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== PASSENGER INFORMATION ==========
        numberOfPassengers: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        passengerNames: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        passengerDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Full passenger details',
        },

        // ========== SEAT & CLASS ==========
        travelClass: {
            type: DataTypes.ENUM('economy', 'premium_economy', 'business', 'first'),
            defaultValue: 'economy',
        },
        seatNumbers: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        seatingPreference: {
            type: DataTypes.ENUM('window', 'middle', 'aisle', 'any'),
            defaultValue: 'any',
        },
        mealService: {
            type: DataTypes.ENUM('none', 'beverage', 'light_meal', 'full_meal'),
            defaultValue: 'beverage',
        },

        // ========== BAGGAGE ==========
        checkInBaggage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Weight in kg',
        },
        cabinBaggage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        additionalBaggage: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        baggageAllowance: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Description of baggage allowance',
        },

        // ========== PRICING ==========
        basePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        taxes: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        fees: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        discount: {
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
        pricePerPerson: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        // ========== BOOKING STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'pending',
                'confirmed',
                'cancelled',
                'refunded',
                'checked_in',
                'boarded',
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
            comment: 'Airline booking reference',
        },
        bookingConfirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        checkedInAt: {
            type: DataTypes.DATE,
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
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== DOCUMENTS ==========
        ticketNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ticketUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bookingConfirmation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        boardingPass: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== SPECIAL SERVICES ==========
        specialServices: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Wheelchair, Unaccompanied minor, etc',
        },
        specialMeals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Vegetarian, Diabetic, etc',
        },
        wheelchairRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== CANCELLATION & CHANGES ==========
        cancellationPolicy: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isCancellable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        cancellationFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        canBeModified: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        modificationFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        // ========== RATINGS & FEEDBACK ==========
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        feedback: {
            type: DataTypes.TEXT,
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
        tableName: 'flights',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['departureDate'] },
        ],
    });

    Flight.prototype.getFlightNumber = function() {
        return `${this.airlineCode}${this.flightNumber}`;
    };

    Flight.prototype.isUpcoming = function() {
        return new Date(this.departureDate) > new Date() && this.status !== 'cancelled';
    };

    Flight.prototype.canCheckIn = function() {
        const hoursUntilFlight = (new Date(this.departureDate) - new Date()) / (1000 * 60 * 60);
        return hoursUntilFlight <= 24 && hoursUntilFlight > 0 && this.status === 'confirmed';
    };

    Flight.associate = (models) => {
        Flight.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Flight.belongsTo(models.User, { foreignKey: 'userId', as: 'passenger' });
        Flight.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
    };

    return Flight;
};
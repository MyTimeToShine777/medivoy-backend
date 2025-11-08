// Travel Arrangement Model - Complete travel coordination
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const TravelArrangement = sequelize.define('TravelArrangement', {
        arrangementId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique arrangement identifier',
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
        },

        // ========== TRAVEL DETAILS ==========
        status: {
            type: DataTypes.ENUM(
                'inquiry',
                'planning',
                'booked',
                'confirmed',
                'in_transit',
                'completed',
                'cancelled'
            ),
            defaultValue: 'inquiry',
            index: true,
        },
        travelType: {
            type: DataTypes.ENUM(
                'air',
                'train',
                'road',
                'combination',
                'local'
            ),
            allowNull: true,
        },

        // ========== ORIGIN & DESTINATION ==========
        originCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originCountry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destinationCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destinationCountry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        intermediateStops: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== DATES & TIMING ==========
        departureDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        returnDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        totalDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        estimatedTravelTime: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'e.g., 12 hours',
        },

        // ========== TRAVELERS ==========
        numberOfTravelers: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        travelers: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Names and details of travelers',
        },
        infantCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        childrenCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== TRANSPORTATION OPTIONS ==========
        flights: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of flight IDs',
        },
        trains: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of train IDs',
        },
        groundTransport: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Bus, Taxi, Car rental',
        },
        carRental: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        carRentalDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== ACCOMMODATIONS ==========
        accommodations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of accommodation IDs',
        },

        // ========== VISA & DOCUMENTATION ==========
        visaRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        visaStatus: {
            type: DataTypes.ENUM(
                'not_required',
                'pending',
                'applied',
                'approved',
                'rejected',
                'visa_on_arrival'
            ),
            defaultValue: 'not_required',
        },
        visaApplicationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        visaApprovalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        visaReferenceNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        passportExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        passportValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== INSURANCE ==========
        travelInsuranceRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        travelInsuranceId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'insurances',
                key: 'insuranceId',
            },
        },
        travelInsuranceStatus: {
            type: DataTypes.ENUM('pending', 'booked', 'confirmed', 'expired'),
            defaultValue: 'pending',
        },

        // ========== AIRPORT/STATION TRANSFER ==========
        airportTransferRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        pickupFromAirport: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        pickupDateTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dropToAirport: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        dropDateTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        transferDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== SPECIAL SERVICES ==========
        wheelchairAssistance: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        interpreterServices: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        interpreterLanguage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mobileConnection: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        guidedTourRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        meals: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== PRICING ==========
        flightCost: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        accommodationCost: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        transportCost: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        insuranceCost: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        visaCost: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        otherCost: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        totalCost: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },

        // ========== DOCUMENTS ==========
        bookingConfirmations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        itinerary: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to detailed itinerary',
        },
        travelDocuments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== COORDINATION ==========
        assignedCoordinator: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Travel coordinator',
        },
        coordinatorNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        emergencyContact: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        emergencyContactNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== SPECIAL REQUIREMENTS ==========
        specialRequirements: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        medicalRequirements: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        dietaryPreferences: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
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
        tableName: 'travel_arrangements',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['departureDate'] },
        ],
    });

    TravelArrangement.prototype.getTravelArrangementNumber = function() {
        return `TRV-${this.arrangementId.slice(0, 8).toUpperCase()}`;
    };

    TravelArrangement.prototype.calculateTotalCost = function() {
        return this.flightCost + this.accommodationCost + this.transportCost +
            this.insuranceCost + this.visaCost + this.otherCost;
    };

    TravelArrangement.prototype.getAllDocuments = function() {
        return [
            ...this.bookingConfirmations,
            ...this.travelDocuments,
        ];
    };

    TravelArrangement.associate = (models) => {
        TravelArrangement.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        TravelArrangement.belongsTo(models.User, { foreignKey: 'userId', as: 'traveler' });
        TravelArrangement.belongsTo(models.User, { foreignKey: 'assignedCoordinator', as: 'coordinator' });
        TravelArrangement.belongsTo(models.Insurance, { foreignKey: 'travelInsuranceId', as: 'travelInsurance' });
    };

    return TravelArrangement;
};
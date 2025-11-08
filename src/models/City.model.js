// City Model - Comprehensive city/location management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const City = sequelize.define('City', {
        cityId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 100],
                    msg: 'City name must be between 2 and 100 characters',
                },
            },
            comment: 'City name',
        },
        countryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'countries',
                key: 'countryId',
            },
            comment: 'Country this city belongs to',
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'State/Province name',
        },
        stateCode: {
            type: DataTypes.STRING(3),
            allowNull: true,
            comment: 'State code',
        },

        // ========== GEOGRAPHY ==========
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
            comment: 'Geographic latitude',
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
            comment: 'Geographic longitude',
        },
        altitude: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Altitude in meters',
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Timezone (e.g., Asia/Kolkata)',
        },

        // ========== CITY CHARACTERISTICS ==========
        populationMillions: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Population in millions',
        },
        area: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Area in square kilometers',
        },
        type: {
            type: DataTypes.ENUM('metropolitan', 'major_city', 'city', 'town'),
            defaultValue: 'city',
            comment: 'City classification',
        },
        developmentLevel: {
            type: DataTypes.ENUM('highly_developed', 'developed', 'developing'),
            allowNull: true,
        },

        // ========== HEALTHCARE & MEDICAL TOURISM ==========
        totalHospitals: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        medicalSpecialties: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Available medical specialties',
        },
        medicalTourismReputation: {
            type: DataTypes.ENUM('world_class', 'excellent', 'good', 'developing'),
            allowValue: true,
        },
        healthcareRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        averageTreatmentCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Average treatment cost (USD)',
        },

        // ========== TRAVEL & TOURISM ==========
        travelSafety: {
            type: DataTypes.ENUM('very_safe', 'safe', 'moderate', 'unsafe'),
            defaultValue: 'safe',
        },
        travelDifficulty: {
            type: DataTypes.ENUM('very_easy', 'easy', 'moderate', 'difficult'),
            defaultValue: 'easy',
            comment: 'Ease of getting around city',
        },
        tourismRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        mainAirport: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Main airport code',
        },
        airportDistance: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Distance from airport in km',
        },
        transportModes: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['metro', 'bus', 'taxi', 'auto'],
            comment: 'Available transport modes',
        },

        // ========== ACCOMMODATION & STAY ==========
        totalHotels: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        averageHotelPrice: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            comment: '5-star hotel avg price per night',
        },
        accommodationOptions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['5_star_hotel', '3_star_hotel', 'guest_house', 'rental_apartment'],
        },

        // ========== COMMUNICATION & SERVICES ==========
        languages: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Languages spoken',
        },
        currency: {
            type: DataTypes.STRING(3),
            allowNull: true,
        },
        internetSpeed: {
            type: DataTypes.ENUM('very_slow', 'slow', 'moderate', 'fast', 'very_fast'),
            defaultValue: 'fast',
        },
        hasEnglishSignage: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== VISA & DOCUMENTATION ==========
        visaRequirement: {
            type: DataTypes.ENUM('visa_required', 'visa_on_arrival', 'e-visa', 'visa_free'),
            allowNull: true,
        },
        visaProcessingDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== REPUTATION & RANKINGS ==========
        isPopular: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            index: true,
        },
        popularityRank: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Global medical tourism ranking',
        },
        medicalTourismRank: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Rank among medical tourism destinations',
        },

        // ========== MEDIA & DESCRIPTION ==========
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'City overview for patients',
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        landmarks: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Notable landmarks',
        },

        // ========== PATIENT INFORMATION ==========
        bestFor: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Best medical treatments available',
        },
        attractions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Tourism attractions',
        },
        localTips: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Tips for visitors',
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
        tableName: 'cities',
        indexes: [
            { fields: ['countryId'] },
            { fields: ['isPopular'] },
            { fields: ['isActive'] },
            { fields: ['medicalTourismRank'] },
        ],
    });

    // ========== SCOPES ==========
    City.addScope('active', {
        where: { isActive: true },
    });

    City.addScope('featured', {
        where: { isFeatured: true },
    });

    City.addScope('popular', {
        where: { isPopular: true },
        order: [
            ['medicalTourismRank', 'ASC']
        ],
    });

    // ========== INSTANCE METHODS ==========
    City.prototype.getFullLocation = function() {
        return `${this.name}, ${this.state || ''}`.trim();
    };

    City.prototype.isSafeForTravel = function() {
        return ['very_safe', 'safe'].includes(this.travelSafety);
    };

    City.prototype.getCoordinates = function() {
        return {
            lat: this.latitude,
            lng: this.longitude,
        };
    };

    // ========== ASSOCIATIONS ==========
    City.associate = (models) => {
        City.belongsTo(models.Country, { foreignKey: 'countryId', as: 'country' });
        City.hasMany(models.Hospital, { foreignKey: 'cityId', as: 'hospitals' });
        City.hasMany(models.Booking, { foreignKey: 'cityId', as: 'bookings' });
    };

    return City;
};
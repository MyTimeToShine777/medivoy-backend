// Country Model - Comprehensive location management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Country = sequelize.define('Country', {
        countryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique country identifier',
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Country name must be unique',
            },
            validate: {
                len: {
                    args: [2, 100],
                    msg: 'Country name must be between 2 and 100 characters',
                },
            },
            comment: 'Country name',
        },
        commonName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Alternative name (e.g., USA for United States)',
        },
        countryCode: {
            type: DataTypes.STRING(2),
            unique: {
                msg: 'Country code must be unique',
            },
            allowNull: false,
            uppercase: true,
            validate: {
                len: {
                    args: [2, 2],
                    msg: 'Country code must be 2 characters (ISO 3166-1 alpha-2)',
                },
            },
            comment: 'ISO 2 letter code (US, UK, IN, etc)',
        },
        countryCode3: {
            type: DataTypes.STRING(3),
            allowNull: true,
            comment: 'ISO 3 letter code',
        },
        countryNumber: {
            type: DataTypes.STRING(3),
            allowNull: true,
            comment: 'ISO numeric code',
        },

        // ========== LOCATION & GEOGRAPHY ==========
        continent: {
            type: DataTypes.ENUM(
                'Africa',
                'Antarctica',
                'Asia',
                'Europe',
                'North America',
                'Oceania',
                'South America'
            ),
            allowNull: true,
            comment: 'Continent',
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Geographic region',
        },
        subregion: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Subregion classification',
        },
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
        timezones: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of timezones',
        },

        // ========== CURRENCY & ECONOMICS ==========
        currencyCode: {
            type: DataTypes.STRING(3),
            allowNull: true,
            validate: {
                len: {
                    args: [3, 3],
                    msg: 'Currency code must be 3 characters (ISO 4217)',
                },
            },
            comment: 'ISO 4217 currency code (USD, GBP, INR, etc)',
        },
        currencyName: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Currency name',
        },
        currencySymbol: {
            type: DataTypes.STRING(5),
            allowNull: true,
            comment: '$, £, ₹, etc',
        },
        currencyRate: {
            type: DataTypes.DECIMAL(12, 4),
            defaultValue: 1.0,
            comment: 'Exchange rate to USD',
        },
        currencyRateLastUpdated: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When exchange rate was last updated',
        },
        economyLevel: {
            type: DataTypes.ENUM('developing', 'developed', 'transitional'),
            allowNull: true,
            comment: 'Economic development level',
        },

        // ========== COMMUNICATION ==========
        dialingCode: {
            type: DataTypes.STRING(5),
            allowNull: true,
            comment: 'International dialing code',
        },
        languages: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of language codes spoken',
        },
        primaryLanguage: {
            type: DataTypes.STRING(5),
            defaultValue: 'en',
            comment: 'Primary language code',
        },

        // ========== TRAVEL & HEALTHCARE ==========
        visaRequirementForIndians: {
            type: DataTypes.ENUM('visa_required', 'visa_on_arrival', 'e-visa', 'visa_free'),
            allowNull: true,
            comment: 'Visa requirements for Indian citizens',
        },
        visaDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Visa application details',
        },
        healthcareRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 5,
            },
            comment: 'Healthcare quality rating (out of 5)',
        },
        travelSafety: {
            type: DataTypes.ENUM('very_safe', 'safe', 'moderate', 'unsafe', 'very_unsafe'),
            defaultValue: 'safe',
            comment: 'Travel safety rating',
        },
        travelAdvice: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'General travel advice',
        },

        // ========== HOSPITAL & TREATMENT INFO ==========
        totalHospitals: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of registered hospitals',
        },
        medicalSpecialties: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of available medical specialties',
        },
        medicalTourismRanking: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'World ranking for medical tourism',
        },
        costOfTreatment: {
            type: DataTypes.ENUM('very_cheap', 'cheap', 'moderate', 'expensive', 'very_expensive'),
            allowNull: true,
            comment: 'Relative cost of treatment',
        },
        averageTreatmentCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Average treatment cost (in USD)',
        },

        // ========== MEDIA & BRANDING ==========
        flagUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Country flag image URL',
        },
        flagEmoji: {
            type: DataTypes.STRING(10),
            allowNull: true,
            comment: 'Country flag emoji',
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Country scenic image',
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of country images',
        },

        // ========== METADATA ==========
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'SEO keywords',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Country description for patients',
        },
        populationMillions: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Population in millions',
        },
        area: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            comment: 'Area in square kilometers',
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
        travelWarning: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Any travel warnings',
        },
    }, {
        timestamps: true,
        tableName: 'countries',
        indexes: [
            { unique: true, fields: ['countryCode'] },
            { fields: ['continent'] },
            { fields: ['isActive'] },
            { fields: ['isFeatured'] },
        ],
    });

    // ========== SCOPES ==========
    Country.addScope('active', {
        where: { isActive: true },
    });

    Country.addScope('featured', {
        where: { isFeatured: true },
    });

    // ========== INSTANCE METHODS ==========
    Country.prototype.getDisplayName = function() {
        return this.commonName || this.name;
    };

    Country.prototype.canTravelTo = function() {
        return this.travelSafety !== 'very_unsafe';
    };

    Country.prototype.getCurrencyInfo = function() {
        return {
            code: this.currencyCode,
            name: this.currencyName,
            symbol: this.currencySymbol,
            rate: this.currencyRate,
        };
    };

    // ========== ASSOCIATIONS ==========
    Country.associate = (models) => {
        Country.hasMany(models.City, { foreignKey: 'countryId', as: 'cities' });
        Country.hasMany(models.Hospital, { foreignKey: 'countryId', as: 'hospitals' });
        Country.hasMany(models.Booking, { foreignKey: 'countryId', as: 'bookings' });
    };

    return Country;
};
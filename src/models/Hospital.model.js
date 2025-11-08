// Hospital Model - Comprehensive hospital details
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Hospital = sequelize.define('Hospital', {
        hospitalId: {
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
                    args: [3, 200],
                    msg: 'Hospital name must be between 3 and 200 characters',
                },
            },
            comment: 'Hospital official name',
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            comment: 'URL-friendly slug',
        },
        registrationNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            comment: 'Government registration number',
        },

        // ========== LOCATION ==========
        countryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'countries',
                key: 'countryId',
            },
        },
        cityId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'cities',
                key: 'cityId',
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Complete street address',
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
        },

        // ========== CONTACT INFO ==========
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^[+]?[0-9]{10,15}$/,
                    msg: 'Invalid phone number',
                },
            },
        },
        phone2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isEmail: true },
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isUrl: true },
        },
        emergencyPhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== HOSPITAL INFO ==========
        establishmentYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1800,
                max: new Date().getFullYear(),
            },
        },
        type: {
            type: DataTypes.ENUM(
                'government',
                'private',
                'charity',
                'corporate',
                'academic',
                'teaching'
            ),
            allowNull: true,
        },
        ownership: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Ownership details',
        },

        // ========== INFRASTRUCTURE ==========
        totalBeds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 10 },
        },
        generalWards: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        privateRooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        icuBeds: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        piuBeds: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        nicu: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        operationTheatres: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        laboratories: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        diagnosticCenters: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        ambulances: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== DEPARTMENTS & SPECIALTIES ==========
        departments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of departments',
        },
        specialties: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Medical specialties offered',
        },
        advancedTreatments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Advanced treatments available',
        },

        // ========== STAFF ==========
        totalDoctors: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalNurses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalParamedical: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalStaff: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== ACCREDITATIONS & CERTIFICATIONS ==========
        accreditations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Certifications (JCI, ISO, etc)',
        },
        certifications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        awards: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Awards and recognitions',
        },

        // ========== RATINGS & REVIEWS ==========
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
            validate: {
                min: 0,
                max: 5,
            },
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        cleanliness: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        staff: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            comment: 'Staff rating',
        },
        facilities: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        valueForMoney: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },

        // ========== PATIENT CAPACITY & EXPERIENCE ==========
        internationationalPatientsFacility: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        interpreterServices: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['english', 'hindi'],
            comment: 'Languages of interpreter available',
        },
        visaAssistance: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        travelAssistance: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        accommodationAssistance: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        companionStay: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        companionFood: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== TECHNOLOGY & FACILITIES ==========
        hasEmr: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Electronic Medical Records',
        },
        hasRoboticsurgery: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        hasMri: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        hasCt: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        hasPet: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        modernEquipment: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Modern equipment list',
        },

        // ========== INSURANCE & PAYMENT ==========
        acceptedInsurance: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Insurance providers accepted',
        },
        paymentModes: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['cash', 'card', 'bank_transfer'],
        },
        cashless: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== DESCRIPTION & MEDIA ==========
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        aboutHospital: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        visionStatement: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        missionStatement: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Featured hospital image',
        },
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Gallery images',
        },
        virtualTour: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Virtual tour URL',
        },
        videos: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'YouTube video URLs',
        },

        // ========== SEO & METADATA ==========
        keywords: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== VERIFICATION & STATUS ==========
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            index: true,
        },
        verificationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
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
        infoLastUpdated: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'hospitals',
        indexes: [
            { fields: ['countryId'] },
            { fields: ['cityId'] },
            { fields: ['isVerified'] },
            { fields: ['isActive'] },
            { fields: ['isFeatured'] },
            { unique: true, fields: ['slug'] },
        ],
    });

    // ========== SCOPES ==========
    Hospital.addScope('verified', {
        where: { isVerified: true },
    });

    Hospital.addScope('active', {
        where: { isActive: true },
    });

    Hospital.addScope('featured', {
        where: { isFeatured: true },
    });

    // ========== INSTANCE METHODS ==========
    Hospital.prototype.getFullAddress = function() {
        return `${this.address}, ${this.postalCode}`;
    };

    Hospital.prototype.getCoordinates = function() {
        return {
            lat: this.latitude,
            lng: this.longitude,
        };
    };

    Hospital.prototype.getAverageRating = function() {
        if (this.totalReviews === 0) return null;
        return this.rating;
    };

    Hospital.prototype.hasSpecialty = function(specialty) {
        return this.specialties.includes(specialty);
    };

    Hospital.prototype.isInternationalFriendly = function() {
        return this.internationationalPatientsFacility === true;
    };

    // ========== ASSOCIATIONS ==========
    Hospital.associate = (models) => {
        Hospital.belongsTo(models.Country, { foreignKey: 'countryId', as: 'country' });
        Hospital.belongsTo(models.City, { foreignKey: 'cityId', as: 'city' });
        Hospital.hasMany(models.Package, { foreignKey: 'hospitalId', as: 'packages' });
        Hospital.hasMany(models.Doctor, { foreignKey: 'hospitalId', as: 'doctors' });
        Hospital.hasMany(models.Booking, { foreignKey: 'hospitalId', as: 'bookings' });
    };

    return Hospital;
};
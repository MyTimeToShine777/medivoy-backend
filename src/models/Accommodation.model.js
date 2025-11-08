// Accommodation Model - Accommodation bookings for patients
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Accommodation = sequelize.define('Accommodation', {
        accommodationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique accommodation identifier',
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
            comment: 'Related medical booking',
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Patient/Guest',
        },
        cityId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'cities',
                key: 'cityId',
            },
            comment: 'City where accommodation is',
        },
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
        },

        // ========== ACCOMMODATION DETAILS ==========
        type: {
            type: DataTypes.ENUM(
                'hotel',
                'guest_house',
                'airbnb',
                'apartment',
                'homestay',
                'resort',
                'serviced_apartment',
                'hostel',
                'hospital_accommodation',
                'other'
            ),
            allowNull: false,
            comment: 'Type of accommodation',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 150],
                    msg: 'Name must be between 3 and 150 characters',
                },
            },
            comment: 'Accommodation name/title',
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Full address',
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
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
        distanceFromHospital: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Distance in km',
        },

        // ========== CONTACT ==========
        phone: {
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
        },
        contactPerson: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== BOOKING DATES ==========
        checkInDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        checkOutDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        numberOfNights: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        numberOfRooms: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        numberOfGuests: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        companionNames: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== ROOM DETAILS ==========
        roomType: {
            type: DataTypes.ENUM(
                'single',
                'double',
                'twin',
                'suite',
                'deluxe_suite',
                'apartment',
                'dormitory',
                'other'
            ),
            allowNull: true,
        },
        bedType: {
            type: DataTypes.ENUM('single', 'double', 'twin', 'king', 'queen', 'other'),
            allowNull: true,
        },
        roomAmenities: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'AC, WiFi, TV, etc',
        },
        mealInclusion: {
            type: DataTypes.ENUM('none', 'breakfast', 'half_board', 'full_board'),
            defaultValue: 'breakfast',
        },
        mealDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== PRICING ==========
        pricePerNight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        totalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        tax: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        finalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        cancellationPolicy: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== BOOKING STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'inquiry',
                'pending',
                'confirmed',
                'checked_in',
                'checked_out',
                'cancelled',
                'no_show'
            ),
            defaultValue: 'pending',
            index: true,
        },
        confirmationNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        bookingConfirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        checkedInAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        checkedOutAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== AMENITIES & SERVICES ==========
        amenities: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Parking, Gym, Laundry, etc',
        },
        availableServices: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Airport transfer, Meals, etc',
        },

        // ========== SPECIAL REQUIREMENTS ==========
        specialRequirements: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        accessibilityRequirements: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        dietaryRestrictions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== RATINGS & FEEDBACK ==========
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        cleanliness: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        comfort: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        service: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        valueForMoney: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reviewSubmittedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== PAYMENT ==========
        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        paymentMethod: {
            type: DataTypes.ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'bank_transfer'),
            allowNull: true,
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

        // ========== DOCUMENTS & MEDIA ==========
        images: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        bookingConfirmation: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to confirmation document',
        },
        guestId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Guest ID from accommodation provider',
        },

        // ========== METADATA & NOTES ==========
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
        tableName: 'accommodations',
        indexes: [
            { fields: ['bookingId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['checkInDate'] },
        ],
    });

    Accommodation.prototype.getDaysOfStay = function() {
        if (!this.checkInDate || !this.checkOutDate) return 0;
        const days = Math.ceil((new Date(this.checkOutDate) - new Date(this.checkInDate)) / (1000 * 60 * 60 * 24));
        return days;
    };

    Accommodation.prototype.isCheckInToday = function() {
        const today = new Date();
        const checkIn = new Date(this.checkInDate);
        return today.toDateString() === checkIn.toDateString();
    };

    Accommodation.prototype.getAccommodationNumber = function() {
        return `ACC-${this.accommodationId.slice(0, 8).toUpperCase()}`;
    };

    Accommodation.associate = (models) => {
        Accommodation.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
        Accommodation.belongsTo(models.User, { foreignKey: 'userId', as: 'guest' });
        Accommodation.belongsTo(models.City, { foreignKey: 'cityId', as: 'city' });
        Accommodation.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Accommodation.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
    };

    return Accommodation;
};
// Laboratory Model - Lab facilities and management
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Laboratory = sequelize.define('Laboratory', {
        laboratoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique laboratory identifier',
        },

        // ========== RELATIONSHIPS ==========
        hospitalId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hospitals',
                key: 'hospitalId',
            },
            index: true,
            comment: 'Parent hospital',
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 150],
                    msg: 'Name must be between 3 and 150 characters',
                },
            },
            comment: 'Laboratory name',
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            comment: 'Lab code',
        },
        type: {
            type: DataTypes.ENUM(
                'pathology',
                'microbiology',
                'hematology',
                'biochemistry',
                'immunology',
                'virology',
                'clinical_chemistry',
                'molecular',
                'genetics',
                'other'
            ),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== LOCATION ==========
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        floor: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        wing: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        roomNumber: {
            type: DataTypes.STRING,
            allowNull: true,
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
        headOfLab: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Lab director name',
        },

        // ========== OPERATING HOURS ==========
        operatingHours: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                monday: { open: '06:00', close: '18:00' },
                tuesday: { open: '06:00', close: '18:00' },
                wednesday: { open: '06:00', close: '18:00' },
                thursday: { open: '06:00', close: '18:00' },
                friday: { open: '06:00', close: '18:00' },
                saturday: { open: '08:00', close: '14:00' },
                sunday: { open: null, close: null },
            },
        },
        is24Hours: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== EQUIPMENT & CAPABILITIES ==========
        equipment: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'List of laboratory equipment',
        },
        capabilities: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Types of tests available',
        },
        accreditations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'ISO, CAP, etc',
        },

        // ========== TESTS & SERVICES ==========
        testsAvailable: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of test IDs',
        },
        totalTestTypes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        homeCollectionAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        reportFormat: {
            type: DataTypes.ENUM('digital', 'physical', 'both'),
            defaultValue: 'digital',
        },

        // ========== TURNAROUND TIME ==========
        averageTurnaroundTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'In hours',
        },
        fastTrackAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        fastTrackTurnaroundTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // ========== STAFF ==========
        totalTechnicians: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalPathologists: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalStaff: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== SPECIMEN COLLECTION ==========
        collectionMethods: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Blood draw, Stool, Urine, etc',
        },
        storageCapacity: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Specimen storage capacity',
        },
        temperatureControlled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== QUALITY MANAGEMENT ==========
        qualityAssurance: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        internalQC: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        externalQC: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        proficiencyTesting: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== STATISTICS ==========
        testsPerMonth: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalTestsCompleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        accuracyRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Test accuracy percentage',
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
        },

        // ========== PRICING ==========
        averageTestCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        discountForBulkTests: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== DIGITAL SERVICES ==========
        onlineReportAccess: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        mobileApp: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        apiAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        ehr_integration: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
            index: true,
        },
    }, {
        timestamps: true,
        tableName: 'laboratories',
        indexes: [
            { fields: ['hospitalId'] },
            { fields: ['type'] },
            { fields: ['isActive'] },
        ],
    });

    Laboratory.prototype.isOpen = function() {
        const now = new Date();
        const day = now.toLocaleLowerCase().slice(0, 3);
        if (this.is24Hours) return true;
        const hours = this.operatingHours[day];
        if (!hours || !hours.open) return false;
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return currentTime >= hours.open && currentTime <= hours.close;
    };

    Laboratory.associate = (models) => {
        Laboratory.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Laboratory.hasMany(models.LabTest, { foreignKey: 'laboratoryId', as: 'tests' });
    };

    return Laboratory;
};
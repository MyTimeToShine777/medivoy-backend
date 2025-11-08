// Department Model - Hospital departments
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Department = sequelize.define('Department', {
        departmentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique department identifier',
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
            comment: 'Hospital this department belongs to',
        },

        // ========== BASIC INFO ==========
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'Department name must be between 3 and 100 characters',
                },
            },
            comment: 'Department name',
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            uppercase: true,
            comment: 'Department code (e.g., CARDIO)',
        },
        type: {
            type: DataTypes.ENUM(
                'cardiology',
                'orthopedics',
                'neurology',
                'oncology',
                'gastroenterology',
                'urology',
                'gynecology',
                'ent',
                'ophthalmology',
                'dermatology',
                'pulmonology',
                'nephrology',
                'rheumatology',
                'infectious_disease',
                'endocrinology',
                'psychiatry',
                'pediatrics',
                'surgery',
                'emergency',
                'icu',
                'administration',
                'other'
            ),
            allowNull: true,
        },

        // ========== DESCRIPTIONS ==========
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Department description',
        },
        specialization: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Main specializations',
        },
        subspecializations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== CONTACT & LOCATION ==========
        headOfDepartment: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Name of department head',
        },
        headOfDepartmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isEmail: true },
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Building/Floor location',
        },
        floorNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        roomNumbers: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== INFRASTRUCTURE ==========
        totalBeds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 0 },
        },
        availableBeds: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        totalRooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        operationTheatres: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        consultationRooms: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        diagnosticUnits: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        procedureRooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        totalTechnicians: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalStaff: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        staffList: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== EQUIPMENT ==========
        equipment: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Medical equipment list',
        },
        modernEquipment: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Advanced/modern equipment',
        },

        // ========== SERVICES & TREATMENTS ==========
        servicesOffered: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        treatmentsOffered: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        procedures: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        diagnosticServices: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== HOURS & AVAILABILITY ==========
        operatingHours: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                monday: { open: '08:00', close: '20:00' },
                tuesday: { open: '08:00', close: '20:00' },
                wednesday: { open: '08:00', close: '20:00' },
                thursday: { open: '08:00', close: '20:00' },
                friday: { open: '08:00', close: '20:00' },
                saturday: { open: '08:00', close: '16:00' },
                sunday: { open: null, close: null },
            },
        },
        isOpen24Hours: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        hasEmergencyService: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        availableForBooking: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // ========== STATISTICS ==========
        totalConsultations: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalProcedures: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalPatients: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.0,
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        successRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },

        // ========== CERTIFICATIONS ==========
        certifications: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        accreditations: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== INTERNATIONAL SERVICES ==========
        supportsInternationalPatients: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        interpreterLanguages: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['english', 'hindi'],
        },

        // ========== MEDIA & BRANDING ==========
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        departmentUrl: {
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
            index: true,
        },
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        timestamps: true,
        tableName: 'departments',
        indexes: [
            { fields: ['hospitalId'] },
            { unique: true, fields: ['code'] },
            { fields: ['isActive'] },
            { fields: ['type'] },
        ],
    });

    // ========== INSTANCE METHODS ==========
    Department.prototype.getTotalCapacity = function() {
        return {
            beds: this.totalBeds,
            operationTheatres: this.operationTheatres,
            consultationRooms: this.consultationRooms,
        };
    };

    Department.prototype.getStaffSummary = function() {
        return {
            doctors: this.totalDoctors,
            nurses: this.totalNurses,
            paramedical: this.totalParamedical,
            total: this.totalStaff,
        };
    };

    Department.prototype.isOperatingNow = function() {
        const now = new Date();
        const day = now.toLocaleLowerCase().slice(0, 3);
        const hours = this.operatingHours;
        if (!hours[day] || !hours[day].open) return false;
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return currentTime >= hours[day].open && currentTime <= hours[day].close;
    };

    // ========== ASSOCIATIONS ==========
    Department.associate = (models) => {
        Department.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        Department.belongsTo(models.Doctor, { foreignKey: 'headOfDepartmentId', as: 'headDoctor' });
    };

    return Department;
};
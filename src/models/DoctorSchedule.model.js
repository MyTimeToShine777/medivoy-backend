// Doctor Schedule Model - Doctor availability and scheduling
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const DoctorSchedule = sequelize.define('DoctorSchedule', {
        scheduleId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique schedule identifier',
        },

        // ========== RELATIONSHIPS ==========
        doctorId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'doctors',
                key: 'doctorId',
            },
            index: true,
            comment: 'Doctor this schedule belongs to',
        },

        // ========== SCHEDULE TYPE ==========
        scheduleType: {
            type: DataTypes.ENUM('recurring_weekly', 'specific_date', 'one_time'),
            defaultValue: 'recurring_weekly',
            comment: 'Type of schedule',
        },

        // ========== DATE & TIME ==========
        dayOfWeek: {
            type: DataTypes.ENUM(
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday'
            ),
            allowNull: true,
            comment: 'For recurring weekly schedules',
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Specific date for one-time or date-specific slots',
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                isValidTime(value) {
                    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
                    if (!timeRegex.test(value)) {
                        throw new Error('Invalid time format (HH:MM)');
                    }
                },
            },
            comment: 'Schedule start time (HH:MM)',
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                isValidTime(value) {
                    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
                    if (!timeRegex.test(value)) {
                        throw new Error('Invalid time format (HH:MM)');
                    }
                },
            },
            comment: 'Schedule end time (HH:MM)',
        },
        timeZone: {
            type: DataTypes.STRING,
            defaultValue: 'UTC',
            comment: 'Timezone for the schedule',
        },

        // ========== SLOT CONFIGURATION ==========
        slotDuration: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            validate: {
                min: 15,
                max: 120,
            },
            comment: 'Duration of each consultation slot in minutes',
        },
        breakDuration: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Break time between slots in minutes',
        },
        maxSlots: {
            type: DataTypes.INTEGER,
            defaultValue: 10,
            validate: {
                min: 1,
                max: 100,
            },
            comment: 'Maximum number of slots available',
        },
        bookedSlots: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min: 0 },
            comment: 'Number of slots already booked',
        },
        availableSlots: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Calculated: maxSlots - bookedSlots',
        },
        consultationTypes: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: ['video', 'phone'],
            comment: 'Types of consultations available for this slot',
        },

        // ========== RECURRING SETTINGS ==========
        isRecurring: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'If schedule repeats every week',
        },
        recurringUntil: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Until when the recurring schedule is valid',
        },
        repeatEveryWeek: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            validate: {
                min: 1,
                max: 52,
            },
            comment: 'Repeat every X weeks (for advanced scheduling)',
        },
        excludeDates: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of dates to exclude from recurring schedule',
        },
        occurrences: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Number of occurrences (if set, overrides recurringUntil)',
        },

        // ========== PRICING & RATES ==========
        consultationFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Specific fee for this time slot (overrides doctor default)',
        },
        useDefaultFee: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'If true, use doctor\'s default fee',
        },
        rushChargePercentage: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0,
            comment: 'Extra charge for rush/premium slots (%)',
        },

        // ========== PRIORITY & VISIBILITY ==========
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
            defaultValue: 'normal',
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'If visible to patients for booking',
        },
        visibleToPatients: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Array of patient IDs if restricted visibility',
        },

        // ========== REQUIREMENTS & CONSTRAINTS ==========
        minAgeRequirement: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Minimum patient age for this slot',
        },
        maxAgeRequirement: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum patient age for this slot',
        },
        treatmentSpecialties: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Treatments/specialties for this slot',
        },
        previousPatientOnly: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Only for follow-up/existing patients',
        },
        newPatientOnly: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Only for new patient consultations',
        },

        // ========== REQUIREMENTS FOR BOOKING ==========
        requiresDocuments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Document types required before booking',
        },
        requiresPreConsultation: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        preConsultationLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // ========== STATISTICS & MONITORING ==========
        totalBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        completedBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        cancelledBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        noShowBookings: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        totalReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        // ========== NOTES & METADATA ==========
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Admin notes for this schedule',
        },
        specialInstructions: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Special instructions for patients',
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
        isSuspended: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        suspensionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: 'Admin who created this schedule',
        },
        lastModifiedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    }, {
        timestamps: true,
        tableName: 'doctor_schedules',
        indexes: [
            { fields: ['doctorId'] },
            { fields: ['date'] },
            { fields: ['isActive'] },
            { fields: ['dayOfWeek'] },
        ],
    });

    // ========== INSTANCE METHODS ==========
    DoctorSchedule.prototype.getAvailableSlots = function() {
        return this.maxSlots - this.bookedSlots;
    };

    DoctorSchedule.prototype.isSlotAvailable = function() {
        return this.getAvailableSlots() > 0 && this.isActive && !this.isSuspended;
    };

    DoctorSchedule.prototype.getSlotTimes = function() {
        const slots = [];
        const [startHour, startMin] = this.startTime.split(':');
        const [endHour, endMin] = this.endTime.split(':');

        let current = new Date();
        current.setHours(parseInt(startHour), parseInt(startMin), 0);

        const end = new Date();
        end.setHours(parseInt(endHour), parseInt(endMin), 0);

        while (current < end) {
            slots.push(new Date(current));
            current.setMinutes(current.getMinutes() + this.slotDuration + this.breakDuration);
        }

        return slots;
    };

    DoctorSchedule.prototype.bookSlot = function() {
        if (this.isSlotAvailable()) {
            this.bookedSlots += 1;
            this.availableSlots = this.getAvailableSlots();
            return true;
        }
        return false;
    };

    DoctorSchedule.prototype.cancelSlot = function() {
        if (this.bookedSlots > 0) {
            this.bookedSlots -= 1;
            this.availableSlots = this.getAvailableSlots();
            return true;
        }
        return false;
    };

    DoctorSchedule.prototype.getScheduleDisplay = function() {
        if (this.scheduleType === 'recurring_weekly') {
            return `Every ${this.dayOfWeek} from ${this.startTime} to ${this.endTime}`;
        } else if (this.scheduleType === 'specific_date') {
            return `On ${this.date} from ${this.startTime} to ${this.endTime}`;
        }
        return `${this.startTime} to ${this.endTime}`;
    };

    DoctorSchedule.prototype.getOccurrenceCount = function() {
        if (!this.isRecurring) return 1;
        if (this.occurrences) return this.occurrences;

        if (this.recurringUntil) {
            const start = new Date();
            const end = new Date(this.recurringUntil);
            const weeks = Math.ceil((end - start) / (7 * 24 * 60 * 60 * 1000));
            return Math.ceil(weeks / this.repeatEveryWeek);
        }

        return null;
    };

    DoctorSchedule.prototype.getBookingPercentage = function() {
        if (this.maxSlots === 0) return 0;
        return Math.round((this.bookedSlots / this.maxSlots) * 100);
    };

    DoctorSchedule.prototype.getCompletionRate = function() {
        if (this.totalBookings === 0) return null;
        const rate = (this.completedBookings / this.totalBookings) * 100;
        return rate.toFixed(2);
    };

    // ========== ASSOCIATIONS ==========
    DoctorSchedule.associate = (models) => {
        DoctorSchedule.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
    };

    return DoctorSchedule;
};
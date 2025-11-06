import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Consultation = sequelize.define('Consultation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'id',
        },
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    consultationType: {
        type: DataTypes.ENUM('video', 'audio', 'text', 'in_person'),
        defaultValue: 'video',
    },
    consultationDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
    },
    meetingLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    agoraChannelId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    prescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'consultations',
    timestamps: true,
    underscored: true,
});

export default Consultation;
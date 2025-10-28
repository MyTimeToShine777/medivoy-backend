const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../src/services');

// Ensure services directory exists
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

// Service templates
const services = [
  {
    name: 'user.service.js',
    content: `const { User, Patient, Doctor } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class UserService {
  async createUser(userData) {
    try {
      const user = await User.create(userData);
      logger.info(\`User created: \${user.id}\`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ]
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await this.getUserById(userId);
    await user.update(updateData);
    logger.info(\`User updated: \${userId}\`);
    return user;
  }

  async deleteUser(userId) {
    const user = await this.getUserById(userId);
    await user.destroy();
    logger.info(\`User deleted: \${userId}\`);
    return { message: 'User deleted successfully' };
  }

  async getAllUsers(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      users: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async updateUserStatus(userId, status) {
    const user = await this.getUserById(userId);
    await user.update({ status });
    logger.info(\`User status updated: \${userId} - \${status}\`);
    return user;
  }
}

module.exports = new UserService();
`
  },
  {
    name: 'hospital.service.js',
    content: `const { Hospital, Doctor, Treatment, HospitalDoctor, HospitalTreatment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class HospitalService {
  async createHospital(hospitalData) {
    try {
      const slug = generateSlug(hospitalData.name);
      const hospital = await Hospital.create({ ...hospitalData, slug });
      logger.info(\`Hospital created: \${hospital.id}\`);
      return hospital;
    } catch (error) {
      logger.error('Error creating hospital:', error);
      throw new AppError('Failed to create hospital', 500);
    }
  }

  async getHospitalById(hospitalId) {
    const hospital = await Hospital.findByPk(hospitalId, {
      include: [
        { model: Doctor, as: 'doctors', through: { attributes: [] } },
        { model: Treatment, as: 'treatments', through: { attributes: [] } }
      ]
    });
    
    if (!hospital) {
      throw new AppError('Hospital not found', 404);
    }
    
    return hospital;
  }

  async updateHospital(hospitalId, updateData) {
    const hospital = await this.getHospitalById(hospitalId);
    
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }
    
    await hospital.update(updateData);
    logger.info(\`Hospital updated: \${hospitalId}\`);
    return hospital;
  }

  async deleteHospital(hospitalId) {
    const hospital = await this.getHospitalById(hospitalId);
    await hospital.destroy();
    logger.info(\`Hospital deleted: \${hospitalId}\`);
    return { message: 'Hospital deleted successfully' };
  }

  async getAllHospitals(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Hospital.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Doctor, as: 'doctors', through: { attributes: [] } },
        { model: Treatment, as: 'treatments', through: { attributes: [] } }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      hospitals: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async addDoctorToHospital(hospitalId, doctorId) {
    const hospital = await this.getHospitalById(hospitalId);
    await HospitalDoctor.create({ hospital_id: hospitalId, doctor_id: doctorId });
    logger.info(\`Doctor \${doctorId} added to hospital \${hospitalId}\`);
    return hospital;
  }

  async removeDoctorFromHospital(hospitalId, doctorId) {
    await HospitalDoctor.destroy({
      where: { hospital_id: hospitalId, doctor_id: doctorId }
    });
    logger.info(\`Doctor \${doctorId} removed from hospital \${hospitalId}\`);
    return { message: 'Doctor removed from hospital' };
  }

  async addTreatmentToHospital(hospitalId, treatmentId) {
    const hospital = await this.getHospitalById(hospitalId);
    await HospitalTreatment.create({ hospital_id: hospitalId, treatment_id: treatmentId });
    logger.info(\`Treatment \${treatmentId} added to hospital \${hospitalId}\`);
    return hospital;
  }

  async verifyHospital(hospitalId, verificationData) {
    const hospital = await this.getHospitalById(hospitalId);
    await hospital.update({
      is_verified: true,
      verification_status: 'verified',
      ...verificationData
    });
    logger.info(\`Hospital verified: \${hospitalId}\`);
    return hospital;
  }
}

module.exports = new HospitalService();
`
  },
  {
    name: 'doctor.service.js',
    content: `const { Doctor, User, Hospital, Appointment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class DoctorService {
  async createDoctor(doctorData) {
    try {
      const doctor = await Doctor.create(doctorData);
      logger.info(\`Doctor created: \${doctor.id}\`);
      return doctor;
    } catch (error) {
      logger.error('Error creating doctor:', error);
      throw new AppError('Failed to create doctor', 500);
    }
  }

  async getDoctorById(doctorId) {
    const doctor = await Doctor.findByPk(doctorId, {
      include: [
        { model: User, as: 'user' },
        { model: Hospital, as: 'hospitals', through: { attributes: [] } }
      ]
    });
    
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }
    
    return doctor;
  }

  async updateDoctor(doctorId, updateData) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.update(updateData);
    logger.info(\`Doctor updated: \${doctorId}\`);
    return doctor;
  }

  async deleteDoctor(doctorId) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.destroy();
    logger.info(\`Doctor deleted: \${doctorId}\`);
    return { message: 'Doctor deleted successfully' };
  }

  async getAllDoctors(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Doctor.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: User, as: 'user' },
        { model: Hospital, as: 'hospitals', through: { attributes: [] } }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      doctors: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateAvailability(doctorId, availabilityData) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.update({ availability: availabilityData });
    logger.info(\`Doctor availability updated: \${doctorId}\`);
    return doctor;
  }

  async getDoctorAppointments(doctorId, filters = {}) {
    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId, ...filters },
      order: [['appointment_date', 'ASC']]
    });
    return appointments;
  }

  async verifyDoctor(doctorId, verificationData) {
    const doctor = await this.getDoctorById(doctorId);
    await doctor.update({
      is_verified: true,
      verification_status: 'verified',
      ...verificationData
    });
    logger.info(\`Doctor verified: \${doctorId}\`);
    return doctor;
  }
}

module.exports = new DoctorService();
`
  },
  {
    name: 'patient.service.js',
    content: `const { Patient, User, MedicalRecord, Appointment, Booking } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class PatientService {
  async createPatient(patientData) {
    try {
      const patient = await Patient.create(patientData);
      logger.info(\`Patient created: \${patient.id}\`);
      return patient;
    } catch (error) {
      logger.error('Error creating patient:', error);
      throw new AppError('Failed to create patient', 500);
    }
  }

  async getPatientById(patientId) {
    const patient = await Patient.findByPk(patientId, {
      include: [
        { model: User, as: 'user' },
        { model: MedicalRecord, as: 'medical_records' }
      ]
    });
    
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    
    return patient;
  }

  async updatePatient(patientId, updateData) {
    const patient = await this.getPatientById(patientId);
    await patient.update(updateData);
    logger.info(\`Patient updated: \${patientId}\`);
    return patient;
  }

  async deletePatient(patientId) {
    const patient = await this.getPatientById(patientId);
    await patient.destroy();
    logger.info(\`Patient deleted: \${patientId}\`);
    return { message: 'Patient deleted successfully' };
  }

  async getAllPatients(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Patient.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']]
    });

    return {
      patients: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateMedicalHistory(patientId, medicalHistoryData) {
    const patient = await this.getPatientById(patientId);
    await patient.update({ medical_history: medicalHistoryData });
    logger.info(\`Patient medical history updated: \${patientId}\`);
    return patient;
  }

  async getPatientAppointments(patientId, filters = {}) {
    const appointments = await Appointment.findAll({
      where: { patient_id: patientId, ...filters },
      order: [['appointment_date', 'DESC']]
    });
    return appointments;
  }

  async getPatientBookings(patientId, filters = {}) {
    const bookings = await Booking.findAll({
      where: { patient_id: patientId, ...filters },
      order: [['created_at', 'DESC']]
    });
    return bookings;
  }
}

module.exports = new PatientService();
`
  },
  {
    name: 'treatment.service.js',
    content: `const { Treatment, TreatmentCategory, TreatmentSubcategory, Hospital } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class TreatmentService {
  async createTreatment(treatmentData) {
    try {
      const slug = generateSlug(treatmentData.name);
      const treatment = await Treatment.create({ ...treatmentData, slug });
      logger.info(\`Treatment created: \${treatment.id}\`);
      return treatment;
    } catch (error) {
      logger.error('Error creating treatment:', error);
      throw new AppError('Failed to create treatment', 500);
    }
  }

  async getTreatmentById(treatmentId) {
    const treatment = await Treatment.findByPk(treatmentId, {
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' },
        { model: Hospital, as: 'hospitals', through: { attributes: [] } }
      ]
    });
    
    if (!treatment) {
      throw new AppError('Treatment not found', 404);
    }
    
    return treatment;
  }

  async updateTreatment(treatmentId, updateData) {
    const treatment = await this.getTreatmentById(treatmentId);
    
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }
    
    await treatment.update(updateData);
    logger.info(\`Treatment updated: \${treatmentId}\`);
    return treatment;
  }

  async deleteTreatment(treatmentId) {
    const treatment = await this.getTreatmentById(treatmentId);
    await treatment.destroy();
    logger.info(\`Treatment deleted: \${treatmentId}\`);
    return { message: 'Treatment deleted successfully' };
  }

  async getAllTreatments(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Treatment.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      treatments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getTreatmentsByCategory(categoryId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Treatment.findAndCountAll({
      where: { category_id: categoryId },
      limit,
      offset,
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' }
      ],
      order: [['name', 'ASC']]
    });

    return {
      treatments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getTreatmentsBySubcategory(subcategoryId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Treatment.findAndCountAll({
      where: { subcategory_id: subcategoryId },
      limit,
      offset,
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' }
      ],
      order: [['name', 'ASC']]
    });

    return {
      treatments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = new TreatmentService();
`
  },
  {
    name: 'booking.service.js',
    content: `const { Booking, Patient, Hospital, Treatment, Payment } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateBookingNumber } = require('../utils/helpers');
const { BOOKING_STATUS } = require('../constants/status-codes');
const logger = require('../utils/logger');

class BookingService {
  async createBooking(bookingData) {
    try {
      const booking_number = generateBookingNumber();
      const booking = await Booking.create({
        ...bookingData,
        booking_number,
        status: BOOKING_STATUS.REQUESTED
      });
      logger.info(\`Booking created: \${booking.id}\`);
      return booking;
    } catch (error) {
      logger.error('Error creating booking:', error);
      throw new AppError('Failed to create booking', 500);
    }
  }

  async getBookingById(bookingId) {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Hospital, as: 'hospital' },
        { model: Treatment, as: 'treatment' },
        { model: Payment, as: 'payments' }
      ]
    });
    
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }
    
    return booking;
  }

  async updateBooking(bookingId, updateData) {
    const booking = await this.getBookingById(bookingId);
    await booking.update(updateData);
    logger.info(\`Booking updated: \${bookingId}\`);
    return booking;
  }

  async updateBookingStatus(bookingId, status, notes = null) {
    const booking = await this.getBookingById(bookingId);
    
    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(booking.status);
    if (!validTransitions.includes(status)) {
      throw new AppError(\`Invalid status transition from \${booking.status} to \${status}\`, 400);
    }
    
    await booking.update({ status, status_notes: notes });
    logger.info(\`Booking status updated: \${bookingId} - \${status}\`);
    return booking;
  }

  getValidStatusTransitions(currentStatus) {
    const transitions = {
      [BOOKING_STATUS.REQUESTED]: [BOOKING_STATUS.UNDER_REVIEW, BOOKING_STATUS.REJECTED],
      [BOOKING_STATUS.UNDER_REVIEW]: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED],
      [BOOKING_STATUS.ACCEPTED]: [BOOKING_STATUS.AWAITING_MEDICAL_DETAILS],
      [BOOKING_STATUS.AWAITING_MEDICAL_DETAILS]: [BOOKING_STATUS.QUOTATION_SENT],
      [BOOKING_STATUS.QUOTATION_SENT]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.REJECTED],
      [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.PAYMENT_COMPLETED],
      [BOOKING_STATUS.PAYMENT_COMPLETED]: [BOOKING_STATUS.INVOICE_SENT],
      [BOOKING_STATUS.INVOICE_SENT]: [BOOKING_STATUS.TRAVEL_ARRANGEMENT],
      [BOOKING_STATUS.TRAVEL_ARRANGEMENT]: [BOOKING_STATUS.IN_TREATMENT],
      [BOOKING_STATUS.IN_TREATMENT]: [BOOKING_STATUS.COMPLETED],
      [BOOKING_STATUS.COMPLETED]: [BOOKING_STATUS.FEEDBACK_RECEIVED]
    };
    
    return transitions[currentStatus] || [];
  }

  async getAllBookings(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Patient, as: 'patient' },
        { model: Hospital, as: 'hospital' },
        { model: Treatment, as: 'treatment' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      bookings: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async cancelBooking(bookingId, reason) {
    const booking = await this.getBookingById(bookingId);
    await booking.update({
      status: BOOKING_STATUS.REJECTED,
      cancellation_reason: reason
    });
    logger.info(\`Booking cancelled: \${bookingId}\`);
    return booking;
  }
}

module.exports = new BookingService();
`
  },
  {
    name: 'appointment.service.js',
    content: `const { Appointment, Patient, Doctor, Prescription } = require('../models');
const { AppError } = require('../utils/error-handler');
const { APPOINTMENT_STATUS } = require('../constants/status-codes');
const logger = require('../utils/logger');

class AppointmentService {
  async createAppointment(appointmentData) {
    try {
      const appointment = await Appointment.create({
        ...appointmentData,
        status: APPOINTMENT_STATUS.REQUESTED
      });
      logger.info(\`Appointment created: \${appointment.id}\`);
      return appointment;
    } catch (error) {
      logger.error('Error creating appointment:', error);
      throw new AppError('Failed to create appointment', 500);
    }
  }

  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' },
        { model: Prescription, as: 'prescriptions' }
      ]
    });
    
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }
    
    return appointment;
  }

  async updateAppointment(appointmentId, updateData) {
    const appointment = await this.getAppointmentById(appointmentId);
    await appointment.update(updateData);
    logger.info(\`Appointment updated: \${appointmentId}\`);
    return appointment;
  }

  async updateAppointmentStatus(appointmentId, status, notes = null) {
    const appointment = await this.getAppointmentById(appointmentId);
    
    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(appointment.status);
    if (!validTransitions.includes(status)) {
      throw new AppError(\`Invalid status transition from \${appointment.status} to \${status}\`, 400);
    }
    
    await appointment.update({ status, notes });
    logger.info(\`Appointment status updated: \${appointmentId} - \${status}\`);
    return appointment;
  }

  getValidStatusTransitions(currentStatus) {
    const transitions = {
      [APPOINTMENT_STATUS.REQUESTED]: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.CANCELLED],
      [APPOINTMENT_STATUS.CONFIRMED]: [APPOINTMENT_STATUS.AWAITING_CONSULTATION, APPOINTMENT_STATUS.CANCELLED],
      [APPOINTMENT_STATUS.AWAITING_CONSULTATION]: [APPOINTMENT_STATUS.IN_PROGRESS],
      [APPOINTMENT_STATUS.IN_PROGRESS]: [APPOINTMENT_STATUS.PRESCRIPTION_PROVIDED],
      [APPOINTMENT_STATUS.PRESCRIPTION_PROVIDED]: [APPOINTMENT_STATUS.FOLLOW_UP_SCHEDULED, APPOINTMENT_STATUS.COMPLETED],
      [APPOINTMENT_STATUS.FOLLOW_UP_SCHEDULED]: [APPOINTMENT_STATUS.COMPLETED],
      [APPOINTMENT_STATUS.COMPLETED]: []
    };
    
    return transitions[currentStatus] || [];
  }

  async getAllAppointments(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Appointment.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ],
      order: [['appointment_date', 'ASC']]
    });

    return {
      appointments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async cancelAppointment(appointmentId, reason) {
    const appointment = await this.getAppointmentById(appointmentId);
    await appointment.update({
      status: APPOINTMENT_STATUS.CANCELLED,
      cancellation_reason: reason
    });
    logger.info(\`Appointment cancelled: \${appointmentId}\`);
    return appointment;
  }

  async rescheduleAppointment(appointmentId, newDate, newTime) {
    const appointment = await this.getAppointmentById(appointmentId);
    await appointment.update({
      appointment_date: newDate,
      appointment_time: newTime
    });
    logger.info(\`Appointment rescheduled: \${appointmentId}\`);
    return appointment;
  }
}

module.exports = new AppointmentService();
`
  }
];

// Generate all service files
services.forEach(service => {
  const filePath = path.join(servicesDir, service.name);
  fs.writeFileSync(filePath, service.content);
  console.log(`✓ Created ${service.name}`);
});

console.log(`\n✓ Successfully generated ${services.length} service files!`);
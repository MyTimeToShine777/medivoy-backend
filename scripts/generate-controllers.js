const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../src/controllers');

const controllers = [
  {
    name: 'user.controller.js',
    content: `const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response');
const { AppError } = require('../utils/error-handler');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id);
      return successResponse(res, result, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await userService.getAllUsers(filters, { page, limit });
      return successResponse(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { status } = req.body;
      const user = await userService.updateUserStatus(req.params.id, status);
      return successResponse(res, user, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      return successResponse(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateUser(req.user.id, req.body);
      return successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
`
  },
  {
    name: 'hospital.controller.js',
    content: `const hospitalService = require('../services/hospital.service');
const { successResponse } = require('../utils/response');

class HospitalController {
  async createHospital(req, res, next) {
    try {
      const hospital = await hospitalService.createHospital(req.body);
      return successResponse(res, hospital, 'Hospital created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getHospital(req, res, next) {
    try {
      const hospital = await hospitalService.getHospitalById(req.params.id);
      return successResponse(res, hospital, 'Hospital retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateHospital(req, res, next) {
    try {
      const hospital = await hospitalService.updateHospital(req.params.id, req.body);
      return successResponse(res, hospital, 'Hospital updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteHospital(req, res, next) {
    try {
      const result = await hospitalService.deleteHospital(req.params.id);
      return successResponse(res, result, 'Hospital deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllHospitals(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await hospitalService.getAllHospitals(filters, { page, limit });
      return successResponse(res, result, 'Hospitals retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addDoctor(req, res, next) {
    try {
      const { doctorId } = req.body;
      const hospital = await hospitalService.addDoctorToHospital(req.params.id, doctorId);
      return successResponse(res, hospital, 'Doctor added to hospital successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeDoctor(req, res, next) {
    try {
      const result = await hospitalService.removeDoctorFromHospital(req.params.id, req.params.doctorId);
      return successResponse(res, result, 'Doctor removed from hospital successfully');
    } catch (error) {
      next(error);
    }
  }

  async addTreatment(req, res, next) {
    try {
      const { treatmentId } = req.body;
      const hospital = await hospitalService.addTreatmentToHospital(req.params.id, treatmentId);
      return successResponse(res, hospital, 'Treatment added to hospital successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyHospital(req, res, next) {
    try {
      const hospital = await hospitalService.verifyHospital(req.params.id, req.body);
      return successResponse(res, hospital, 'Hospital verified successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HospitalController();
`
  },
  {
    name: 'doctor.controller.js',
    content: `const doctorService = require('../services/doctor.service');
const { successResponse } = require('../utils/response');

class DoctorController {
  async createDoctor(req, res, next) {
    try {
      const doctor = await doctorService.createDoctor(req.body);
      return successResponse(res, doctor, 'Doctor created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getDoctor(req, res, next) {
    try {
      const doctor = await doctorService.getDoctorById(req.params.id);
      return successResponse(res, doctor, 'Doctor retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateDoctor(req, res, next) {
    try {
      const doctor = await doctorService.updateDoctor(req.params.id, req.body);
      return successResponse(res, doctor, 'Doctor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctor(req, res, next) {
    try {
      const result = await doctorService.deleteDoctor(req.params.id);
      return successResponse(res, result, 'Doctor deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllDoctors(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await doctorService.getAllDoctors(filters, { page, limit });
      return successResponse(res, result, 'Doctors retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(req, res, next) {
    try {
      const doctor = await doctorService.updateAvailability(req.params.id, req.body);
      return successResponse(res, doctor, 'Doctor availability updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAppointments(req, res, next) {
    try {
      const appointments = await doctorService.getDoctorAppointments(req.params.id, req.query);
      return successResponse(res, appointments, 'Doctor appointments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyDoctor(req, res, next) {
    try {
      const doctor = await doctorService.verifyDoctor(req.params.id, req.body);
      return successResponse(res, doctor, 'Doctor verified successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoctorController();
`
  },
  {
    name: 'patient.controller.js',
    content: `const patientService = require('../services/patient.service');
const { successResponse } = require('../utils/response');

class PatientController {
  async createPatient(req, res, next) {
    try {
      const patient = await patientService.createPatient(req.body);
      return successResponse(res, patient, 'Patient created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPatient(req, res, next) {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      return successResponse(res, patient, 'Patient retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePatient(req, res, next) {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      return successResponse(res, patient, 'Patient updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePatient(req, res, next) {
    try {
      const result = await patientService.deletePatient(req.params.id);
      return successResponse(res, result, 'Patient deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPatients(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await patientService.getAllPatients(filters, { page, limit });
      return successResponse(res, result, 'Patients retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateMedicalHistory(req, res, next) {
    try {
      const patient = await patientService.updateMedicalHistory(req.params.id, req.body);
      return successResponse(res, patient, 'Medical history updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAppointments(req, res, next) {
    try {
      const appointments = await patientService.getPatientAppointments(req.params.id, req.query);
      return successResponse(res, appointments, 'Patient appointments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req, res, next) {
    try {
      const bookings = await patientService.getPatientBookings(req.params.id, req.query);
      return successResponse(res, bookings, 'Patient bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PatientController();
`
  },
  {
    name: 'treatment.controller.js',
    content: `const treatmentService = require('../services/treatment.service');
const { successResponse } = require('../utils/response');

class TreatmentController {
  async createTreatment(req, res, next) {
    try {
      const treatment = await treatmentService.createTreatment(req.body);
      return successResponse(res, treatment, 'Treatment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTreatment(req, res, next) {
    try {
      const treatment = await treatmentService.getTreatmentById(req.params.id);
      return successResponse(res, treatment, 'Treatment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTreatment(req, res, next) {
    try {
      const treatment = await treatmentService.updateTreatment(req.params.id, req.body);
      return successResponse(res, treatment, 'Treatment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTreatment(req, res, next) {
    try {
      const result = await treatmentService.deleteTreatment(req.params.id);
      return successResponse(res, result, 'Treatment deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllTreatments(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await treatmentService.getAllTreatments(filters, { page, limit });
      return successResponse(res, result, 'Treatments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTreatmentsByCategory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await treatmentService.getTreatmentsByCategory(req.params.categoryId, { page, limit });
      return successResponse(res, result, 'Treatments by category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTreatmentsBySubcategory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await treatmentService.getTreatmentsBySubcategory(req.params.subcategoryId, { page, limit });
      return successResponse(res, result, 'Treatments by subcategory retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TreatmentController();
`
  },
  {
    name: 'booking.controller.js',
    content: `const bookingService = require('../services/booking.service');
const { successResponse } = require('../utils/response');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.body);
      return successResponse(res, booking, 'Booking created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getBooking(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      return successResponse(res, booking, 'Booking retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req, res, next) {
    try {
      const booking = await bookingService.updateBooking(req.params.id, req.body);
      return successResponse(res, booking, 'Booking updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateBookingStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const booking = await bookingService.updateBookingStatus(req.params.id, status, notes);
      return successResponse(res, booking, 'Booking status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await bookingService.getAllBookings(filters, { page, limit });
      return successResponse(res, result, 'Bookings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const { reason } = req.body;
      const booking = await bookingService.cancelBooking(req.params.id, reason);
      return successResponse(res, booking, 'Booking cancelled successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
`
  },
  {
    name: 'appointment.controller.js',
    content: `const appointmentService = require('../services/appointment.service');
const { successResponse } = require('../utils/response');

class AppointmentController {
  async createAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      return successResponse(res, appointment, 'Appointment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);
      return successResponse(res, appointment, 'Appointment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
      return successResponse(res, appointment, 'Appointment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAppointmentStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status, notes);
      return successResponse(res, appointment, 'Appointment status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllAppointments(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await appointmentService.getAllAppointments(filters, { page, limit });
      return successResponse(res, result, 'Appointments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelAppointment(req, res, next) {
    try {
      const { reason } = req.body;
      const appointment = await appointmentService.cancelAppointment(req.params.id, reason);
      return successResponse(res, appointment, 'Appointment cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async rescheduleAppointment(req, res, next) {
    try {
      const { newDate, newTime } = req.body;
      const appointment = await appointmentService.rescheduleAppointment(req.params.id, newDate, newTime);
      return successResponse(res, appointment, 'Appointment rescheduled successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();
`
  }
];

// Generate all controller files
controllers.forEach(controller => {
  const filePath = path.join(controllersDir, controller.name);
  fs.writeFileSync(filePath, controller.content);
  console.log(`✓ Created ${controller.name}`);
});

console.log(`\n✓ Successfully generated ${controllers.length} controller files!`);
const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../src/routes/v1');

// Ensure routes directory exists
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
}

const routes = [
  {
    name: 'auth.routes.js',
    content: `const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validateRequest } = require('../../middleware/validate.middleware');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, hospital_admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
`
  },
  {
    name: 'users.routes.js',
    content: `const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, authorize(['admin']), userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['admin']), userController.createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticate, userController.getUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, userController.updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

/**
 * @swagger
 * /api/v1/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', authenticate, authorize(['admin']), userController.updateUserStatus);

module.exports = router;
`
  },
  {
    name: 'hospitals.routes.js',
    content: `const express = require('express');
const router = express.Router();
const hospitalController = require('../../controllers/hospital.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 */
router.get('/', hospitalController.getAllHospitals);

/**
 * @swagger
 * /api/v1/hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.createHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 */
router.get('/:id', hospitalController.getHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}:
 *   put:
 *     summary: Update hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.updateHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}:
 *   delete:
 *     summary: Delete hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), hospitalController.deleteHospital);

/**
 * @swagger
 * /api/v1/hospitals/{id}/doctors:
 *   post:
 *     summary: Add doctor to hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/doctors', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.addDoctor);

/**
 * @swagger
 * /api/v1/hospitals/{id}/doctors/{doctorId}:
 *   delete:
 *     summary: Remove doctor from hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/doctors/:doctorId', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.removeDoctor);

/**
 * @swagger
 * /api/v1/hospitals/{id}/treatments:
 *   post:
 *     summary: Add treatment to hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/treatments', authenticate, authorize(['admin', 'hospital_admin']), hospitalController.addTreatment);

/**
 * @swagger
 * /api/v1/hospitals/{id}/verify:
 *   post:
 *     summary: Verify hospital
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/verify', authenticate, authorize(['admin']), hospitalController.verifyHospital);

module.exports = router;
`
  },
  {
    name: 'doctors.routes.js',
    content: `const express = require('express');
const router = express.Router();
const doctorController = require('../../controllers/doctor.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @swagger
 * /api/v1/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['admin']), doctorController.createDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
 */
router.get('/:id', doctorController.getDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   put:
 *     summary: Update doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize(['admin', 'doctor']), doctorController.updateDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   delete:
 *     summary: Delete doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), doctorController.deleteDoctor);

/**
 * @swagger
 * /api/v1/doctors/{id}/availability:
 *   put:
 *     summary: Update doctor availability
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/availability', authenticate, authorize(['doctor']), doctorController.updateAvailability);

/**
 * @swagger
 * /api/v1/doctors/{id}/appointments:
 *   get:
 *     summary: Get doctor appointments
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/appointments', authenticate, doctorController.getAppointments);

/**
 * @swagger
 * /api/v1/doctors/{id}/verify:
 *   post:
 *     summary: Verify doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/verify', authenticate, authorize(['admin']), doctorController.verifyDoctor);

module.exports = router;
`
  },
  {
    name: 'patients.routes.js',
    content: `const express = require('express');
const router = express.Router();
const patientController = require('../../controllers/patient.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, authorize(['admin', 'doctor']), patientController.getAllPatients);

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, patientController.createPatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticate, patientController.getPatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, patientController.updatePatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Delete patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), patientController.deletePatient);

/**
 * @swagger
 * /api/v1/patients/{id}/medical-history:
 *   put:
 *     summary: Update patient medical history
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/medical-history', authenticate, patientController.updateMedicalHistory);

/**
 * @swagger
 * /api/v1/patients/{id}/appointments:
 *   get:
 *     summary: Get patient appointments
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/appointments', authenticate, patientController.getAppointments);

/**
 * @swagger
 * /api/v1/patients/{id}/bookings:
 *   get:
 *     summary: Get patient bookings
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/bookings', authenticate, patientController.getBookings);

module.exports = router;
`
  },
  {
    name: 'treatments.routes.js',
    content: `const express = require('express');
const router = express.Router();
const treatmentController = require('../../controllers/treatment.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/treatments:
 *   get:
 *     summary: Get all treatments
 *     tags: [Treatments]
 */
router.get('/', treatmentController.getAllTreatments);

/**
 * @swagger
 * /api/v1/treatments:
 *   post:
 *     summary: Create a new treatment
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, authorize(['admin']), treatmentController.createTreatment);

/**
 * @swagger
 * /api/v1/treatments/{id}:
 *   get:
 *     summary: Get treatment by ID
 *     tags: [Treatments]
 */
router.get('/:id', treatmentController.getTreatment);

/**
 * @swagger
 * /api/v1/treatments/{id}:
 *   put:
 *     summary: Update treatment
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, authorize(['admin']), treatmentController.updateTreatment);

/**
 * @swagger
 * /api/v1/treatments/{id}:
 *   delete:
 *     summary: Delete treatment
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize(['admin']), treatmentController.deleteTreatment);

/**
 * @swagger
 * /api/v1/treatments/category/{categoryId}:
 *   get:
 *     summary: Get treatments by category
 *     tags: [Treatments]
 */
router.get('/category/:categoryId', treatmentController.getTreatmentsByCategory);

/**
 * @swagger
 * /api/v1/treatments/subcategory/{subcategoryId}:
 *   get:
 *     summary: Get treatments by subcategory
 *     tags: [Treatments]
 */
router.get('/subcategory/:subcategoryId', treatmentController.getTreatmentsBySubcategory);

module.exports = router;
`
  },
  {
    name: 'bookings.routes.js',
    content: `const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/booking.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, bookingController.getAllBookings);

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, bookingController.createBooking);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticate, bookingController.getBooking);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, bookingController.updateBooking);

/**
 * @swagger
 * /api/v1/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', authenticate, authorize(['admin', 'hospital_admin']), bookingController.updateBookingStatus);

/**
 * @swagger
 * /api/v1/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

module.exports = router;
`
  },
  {
    name: 'appointments.routes.js',
    content: `const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointment.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, appointmentController.getAllAppointments);

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticate, appointmentController.getAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   put:
 *     summary: Update appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, appointmentController.updateAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', authenticate, authorize(['doctor']), appointmentController.updateAppointmentStatus);

/**
 * @swagger
 * /api/v1/appointments/{id}/cancel:
 *   post:
 *     summary: Cancel appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/cancel', authenticate, appointmentController.cancelAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/reschedule:
 *   post:
 *     summary: Reschedule appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/reschedule', authenticate, appointmentController.rescheduleAppointment);

module.exports = router;
`
  }
];

// Generate all route files
routes.forEach(route => {
  const filePath = path.join(routesDir, route.name);
  fs.writeFileSync(filePath, route.content);
  console.log(`✓ Created ${route.name}`);
});

console.log(`\n✓ Successfully generated ${routes.length} route files!`);
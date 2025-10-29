/**
 * @swagger
 * components:
 *   schemas:
 *     # This file contains comprehensive Swagger documentation for ALL API endpoints
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Users
 *     description: User management endpoints
 *   - name: Patients
 *     description: Patient profile management
 *   - name: Doctors
 *     description: Doctor profile management
 *   - name: Hospitals
 *     description: Hospital management
 *   - name: Treatments
 *     description: Medical treatment information
 *   - name: Treatment Categories
 *     description: Treatment category management
 *   - name: Packages
 *     description: Treatment package offerings
 *   - name: Bookings
 *     description: Booking management system
 *   - name: Appointments
 *     description: Appointment scheduling
 *   - name: Payments
 *     description: Payment processing
 *   - name: Invoices
 *     description: Invoice management
 *   - name: Reviews
 *     description: Review and rating system
 *   - name: Notifications
 *     description: Notification management
 *   - name: Support Tickets
 *     description: Customer support system
 *   - name: FAQs
 *     description: Frequently asked questions
 *   - name: Website Content
 *     description: CMS content management
 *   - name: Translations
 *     description: Multi-language support
 *   - name: Subscriptions
 *     description: Subscription management
 *   - name: Coupons
 *     description: Coupon and discount management
 *   - name: Insurance
 *     description: Insurance management
 *   - name: Lab Tests
 *     description: Laboratory test management
 *   - name: Laboratories
 *     description: Laboratory management
 *   - name: Medical Records
 *     description: Patient medical records
 *   - name: Prescriptions
 *     description: Prescription management
 *   - name: Uploads
 *     description: File upload management
 */

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: user@example.com
 *             password: Password123!
 *             firstName: John
 *             lastName: Doe
 *             phone: +1234567890
 *             role: patient
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and receive JWT tokens
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: user@example.com
 *             password: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

// ============================================================================
// FAQ ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: Get all FAQs
 *     description: Retrieve a paginated list of frequently asked questions
 *     tags: [FAQs]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: FAQs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *             example:
 *               success: true
 *               message: FAQs retrieved successfully
 *               data: []
 *               pagination:
 *                 currentPage: 1
 *                 totalPages: 0
 *                 totalRecords: 0
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create a new FAQ
 *     description: Add a new frequently asked question (admin only)
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               category:
 *                 type: string
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /faqs/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     tags: [FAQs]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: FAQ retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

// ============================================================================
// TREATMENT ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /treatments:
 *   get:
 *     summary: Get all treatments
 *     description: Retrieve a paginated list of medical treatments
 *     tags: [Treatments]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: subcategoryId
 *         schema:
 *           type: integer
 *         description: Filter by subcategory ID
 *     responses:
 *       200:
 *         description: Treatments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create a new treatment
 *     description: Add a new medical treatment (admin only)
 *     tags: [Treatments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               subcategoryId:
 *                 type: integer
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               successRate:
 *                 type: number
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /treatments/{id}:
 *   get:
 *     summary: Get treatment by ID
 *     tags: [Treatments]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Treatment retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update treatment
 *     tags: [Treatments]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete treatment
 *     tags: [Treatments]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// TREATMENT CATEGORY ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /treatment-categories:
 *   get:
 *     summary: Get all treatment categories
 *     description: Retrieve all treatment categories
 *     tags: [Treatment Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TreatmentCategory'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create treatment category
 *     tags: [Treatment Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /treatment-categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Treatment Categories]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update category
 *     tags: [Treatment Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete category
 *     tags: [Treatment Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// HOSPITAL ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Get all hospitals
 *     description: Retrieve a paginated list of hospitals (requires authentication)
 *     tags: [Hospitals]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: Hospitals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a new hospital
 *     description: Register a new hospital (admin only)
 *     tags: [Hospitals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - city
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Hospital retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// DOCTOR ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Retrieve a paginated list of doctors (requires authentication)
 *     tags: [Doctors]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter by specialization
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create doctor profile
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - specialization
 *               - licenseNumber
 *             properties:
 *               userId:
 *                 type: integer
 *               specialization:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               experience:
 *                 type: integer
 *               consultationFee:
 *                 type: number
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Doctor retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update doctor profile
 *     tags: [Doctors]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete doctor profile
 *     tags: [Doctors]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// PATIENT ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve a paginated list of patients (admin only)
 *     tags: [Patients]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create patient profile
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               bloodGroup:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update patient profile
 *     tags: [Patients]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete patient profile
 *     tags: [Patients]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// BOOKING ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve user's bookings (requires authentication)
 *     tags: [Bookings]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a new booking
 *     description: Book a treatment at a hospital
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hospitalId
 *               - treatmentId
 *               - bookingDate
 *             properties:
 *               hospitalId:
 *                 type: integer
 *               treatmentId:
 *                 type: integer
 *               packageId:
 *                 type: integer
 *               bookingDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// APPOINTMENT ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Retrieve user's appointments (requires authentication)
 *     tags: [Appointments]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, cancelled, completed, no_show]
 *         description: Filter by status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a new appointment
 *     description: Schedule an appointment with a doctor
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - appointmentDate
 *             properties:
 *               doctorId:
 *                 type: integer
 *               bookingId:
 *                 type: integer
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [consultation, follow_up, procedure]
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update appointment
 *     tags: [Appointments]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Cancel appointment
 *     tags: [Appointments]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// PAYMENT ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     description: Retrieve user's payment history (requires authentication)
 *     tags: [Payments]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Process a payment
 *     description: Process payment for a booking
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - amount
 *               - paymentMethod
 *             properties:
 *               bookingId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 default: USD
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, paypal, stripe, razorpay]
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// REVIEW ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve reviews (requires authentication)
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *           enum: [doctor, hospital, treatment]
 *         description: Filter by entity type
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: integer
 *         description: Filter by entity ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a review
 *     description: Submit a review for a doctor, hospital, or treatment
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityType
 *               - entityId
 *               - rating
 *             properties:
 *               entityType:
 *                 type: string
 *                 enum: [doctor, hospital, treatment]
 *               entityId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// PACKAGE ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all packages
 *     description: Retrieve treatment packages (requires authentication)
 *     tags: [Packages]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: hospitalId
 *         schema:
 *           type: integer
 *         description: Filter by hospital
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a package
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - hospitalId
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               hospitalId:
 *                 type: integer
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// INVOICE ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     description: Retrieve user's invoices
 *     tags: [Invoices]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create an invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - amount
 *             properties:
 *               bookingId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// NOTIFICATION ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Retrieve user's notifications
 *     tags: [Notifications]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// SUPPORT TICKET ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /support:
 *   get:
 *     summary: Get all support tickets
 *     description: Retrieve user's support tickets
 *     tags: [Support Tickets]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in_progress, resolved, closed]
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a support ticket
 *     tags: [Support Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// WEBSITE CONTENT ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /website-content:
 *   get:
 *     summary: Get website content
 *     description: Retrieve CMS content for website pages
 *     tags: [Website Content]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Page slug
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create website content
 *     tags: [Website Content]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageSlug
 *               - title
 *               - content
 *             properties:
 *               pageSlug:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// USER ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users (admin only)
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, doctor, patient, hospital_admin]
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// COUPON ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Coupons retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// SUBSCRIPTION ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Subscriptions retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: integer
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// TRANSLATION ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /translations:
 *   get:
 *     summary: Get all translations
 *     description: Retrieve translations for multi-language support
 *     tags: [Translations]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Language code (e.g., en, es, fr)
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         description: Translation key
 *     responses:
 *       200:
 *         description: Translations retrieved successfully
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

// ============================================================================
// INSURANCE ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /insurance:
 *   get:
 *     summary: Get insurance information
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: Insurance info retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// LAB TEST ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /lab-tests:
 *   get:
 *     summary: Get all lab tests
 *     tags: [Lab Tests]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Lab tests retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// LABORATORY ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /laboratories:
 *   get:
 *     summary: Get all laboratories
 *     tags: [Laboratories]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Laboratories retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// MEDICAL RECORD ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /medical-records:
 *   get:
 *     summary: Get medical records
 *     tags: [Medical Records]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// PRESCRIPTION ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /prescriptions:
 *   get:
 *     summary: Get all prescriptions
 *     tags: [Prescriptions]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Prescriptions retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// ============================================================================
// UPLOAD ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Upload a file
 *     description: Upload files (images, documents, etc.)
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

module.exports = {};

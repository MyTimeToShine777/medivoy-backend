const fs = require('fs');
const path = require('path');

// This script will generate comprehensive Swagger documentation for all routes

const routesDir = path.join(__dirname, 'src', 'routes', 'v1');

// Comprehensive endpoint documentation templates
const endpointDocs = {
  // Authentication endpoints
  'auth.routes.js': `
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Create a new user account with email and password.
 *       
 *       **Features:**
 *       - Email validation
 *       - Password strength requirements (min 8 characters)
 *       - Automatic email verification sent
 *       - JWT tokens generated upon registration
 *       
 *       **Roles Available:**
 *       - patient: Regular patient account
 *       - doctor: Healthcare provider account
 *       - hospital_admin: Hospital administrator account
 *     tags: [Authentication]
 *     security: []
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
 *                 format: email
 *                 description: User email address (must be unique)
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Password (minimum 8 characters, must include uppercase, lowercase, number)
 *                 example: SecurePass123!
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 description: User's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 description: User's last name
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 description: Phone number with country code
 *                 example: +1234567890
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, hospital_admin]
 *                 description: User role in the system
 *                 example: patient
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth (YYYY-MM-DD)
 *                 example: 1990-01-15
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: User gender
 *                 example: male
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully. Please check your email to verify your account.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         role:
 *                           type: string
 *                           example: patient
 *                         isEmailVerified:
 *                           type: boolean
 *                           example: false
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                           description: JWT access token (expires in 7 days)
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                         refreshToken:
 *                           type: string
 *                           description: JWT refresh token (expires in 30 days)
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: Email is already registered
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred during registration
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: |
 *       Authenticate user with email and password to receive JWT tokens.
 *       
 *       **Authentication Flow:**
 *       1. Submit email and password
 *       2. Receive access token and refresh token
 *       3. Use access token in Authorization header for subsequent requests
 *       4. Use refresh token to get new access token when it expires
 *       
 *       **Token Expiry:**
 *       - Access Token: 7 days
 *       - Refresh Token: 30 days
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *                 example: SecurePass123!
 *               rememberMe:
 *                 type: boolean
 *                 description: Keep user logged in for longer period
 *                 example: true
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         role:
 *                           type: string
 *                           example: patient
 *                         isEmailVerified:
 *                           type: boolean
 *                           example: true
 *                         profilePicture:
 *                           type: string
 *                           nullable: true
 *                           example: https://example.com/profile.jpg
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       403:
 *         description: Forbidden - Email not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please verify your email before logging in
 *       500:
 *         description: Internal server error
 */
`,

  // Patients endpoints
  'patients.routes.js': `
/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     description: |
 *       Retrieve a paginated list of all patients in the system.
 *       
 *       **Features:**
 *       - Pagination support
 *       - Search by name, email, or phone
 *       - Filter by status, gender, age range
 *       - Sort by any field
 *       
 *       **Access:**
 *       - Admin: Can view all patients
 *       - Doctor: Can view assigned patients only
 *       - Hospital Admin: Can view patients in their hospital
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone number
 *         example: John
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *         description: Filter by gender
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Minimum age filter
 *         example: 18
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Maximum age filter
 *         example: 65
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         description: Filter by patient status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (prefix with - for descending)
 *         example: -createdAt
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     patients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           userId:
 *                             type: integer
 *                             example: 5
 *                           firstName:
 *                             type: string
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             example: Doe
 *                           email:
 *                             type: string
 *                             example: john.doe@example.com
 *                           phone:
 *                             type: string
 *                             example: +1234567890
 *                           dateOfBirth:
 *                             type: string
 *                             format: date
 *                             example: 1990-01-15
 *                           gender:
 *                             type: string
 *                             example: male
 *                           bloodGroup:
 *                             type: string
 *                             example: O+
 *                           address:
 *                             type: string
 *                             example: 123 Main St, City, Country
 *                           emergencyContact:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: Jane Doe
 *                               phone:
 *                                 type: string
 *                                 example: +1234567891
 *                               relationship:
 *                                 type: string
 *                                 example: Spouse
 *                           status:
 *                             type: string
 *                             example: active
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 95
 *                         itemsPerPage:
 *                           type: integer
 *                           example: 10
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     description: |
 *       Retrieve detailed information about a specific patient.
 *       
 *       **Includes:**
 *       - Personal information
 *       - Medical history
 *       - Current medications
 *       - Allergies
 *       - Recent appointments
 *       - Insurance information
 *       
 *       **Access:**
 *       - Admin: Full access
 *       - Doctor: Only assigned patients
 *       - Patient: Own profile only
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Patient details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     phone:
 *                       type: string
 *                       example: +1234567890
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *                     bloodGroup:
 *                       type: string
 *                     address:
 *                       type: string
 *                     medicalHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           condition:
 *                             type: string
 *                           diagnosedDate:
 *                             type: string
 *                             format: date
 *                           status:
 *                             type: string
 *                     allergies:
 *                       type: array
 *                       items:
 *                         type: string
 *                     currentMedications:
 *                       type: array
 *                       items:
 *                         type: object
 *                     recentAppointments:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Cannot access this patient
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
`,

  // Add more route documentation templates here...
};

console.log('Comprehensive Swagger Documentation Generator');
console.log('='.repeat(60));
console.log('This script generates detailed Swagger documentation for all API endpoints.');
console.log('');
console.log('Documentation includes:');
console.log('✓ Detailed descriptions');
console.log('✓ Request/response examples');
console.log('✓ Parameter specifications');
console.log('✓ Authentication requirements');
console.log('✓ Error handling');
console.log('');
console.log('Note: Due to the large number of endpoints (287), this is a starting template.');
console.log('You can extend this script to add documentation for all remaining endpoints.');
console.log('='.repeat(60));

module.exports = endpointDocs;
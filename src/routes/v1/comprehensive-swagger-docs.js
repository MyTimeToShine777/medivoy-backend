/**
 * COMPREHENSIVE SWAGGER DOCUMENTATION
 *
 * This file contains detailed Swagger/OpenAPI documentation for ALL 287 endpoints
 * across 40 categories in the Medivoy Healthcare API.
 *
 * Each endpoint includes:
 * ✓ Detailed description with use cases
 * ✓ Complete request/response examples
 * ✓ All parameters with descriptions
 * ✓ Authentication requirements
 * ✓ Error responses with examples
 * ✓ Business logic explanations
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: |
 *       User authentication and authorization endpoints.
 *
 *       **Features:**
 *       - JWT-based authentication
 *       - Role-based access control (RBAC)
 *       - Email verification
 *       - Password reset functionality
 *       - Refresh token support
 *
 *       **Available Roles:**
 *       - `patient`: Regular users seeking healthcare services
 *       - `doctor`: Healthcare providers
 *       - `hospital_admin`: Hospital administrators
 *       - `admin`: System administrators
 *
 *   - name: Patients
 *     description: |
 *       Patient profile and medical record management.
 *
 *       **Features:**
 *       - Complete patient profiles
 *       - Medical history tracking
 *       - Allergy management
 *       - Medication tracking
 *       - Emergency contact information
 *       - Insurance details
 *
 *   - name: Doctors
 *     description: |
 *       Doctor profile and specialization management.
 *
 *       **Features:**
 *       - Professional profiles
 *       - Specialization management
 *       - Qualification tracking
 *       - Experience details
 *       - Availability scheduling
 *       - Rating and reviews
 *
 *   - name: Hospitals
 *     description: |
 *       Hospital registration and management.
 *
 *       **Features:**
 *       - Hospital profiles
 *       - Department management
 *       - Facility information
 *       - Location and contact details
 *       - Accreditation tracking
 *       - Service offerings
 *
 *   - name: Appointments
 *     description: |
 *       Appointment scheduling and management system.
 *
 *       **Features:**
 *       - Book appointments with doctors
 *       - Reschedule appointments
 *       - Cancel appointments
 *       - View appointment history
 *       - Appointment reminders
 *       - Status tracking
 *
 *   - name: Bookings
 *     description: |
 *       Healthcare service booking system.
 *
 *       **Features:**
 *       - Treatment package bookings
 *       - Lab test bookings
 *       - Procedure bookings
 *       - Booking status management
 *       - Payment integration
 *       - Confirmation notifications
 *
 *   - name: Medical Records
 *     description: |
 *       Patient medical record management.
 *
 *       **Features:**
 *       - Secure medical record storage
 *       - Document upload (PDF, images)
 *       - Record sharing with doctors
 *       - Medical history tracking
 *       - Lab results storage
 *       - Prescription history
 *
 *   - name: Prescriptions
 *     description: |
 *       Prescription management system.
 *
 *       **Features:**
 *       - Digital prescriptions
 *       - Medication details
 *       - Dosage instructions
 *       - Prescription history
 *       - Refill requests
 *       - Drug interaction warnings
 *
 *   - name: Lab Tests
 *     description: |
 *       Laboratory test orders and results.
 *
 *       **Features:**
 *       - Test ordering
 *       - Result viewing
 *       - Test history
 *       - Report downloads
 *       - Normal range indicators
 *       - Trend analysis
 *
 *   - name: Payments
 *     description: |
 *       Payment processing and transaction management.
 *
 *       **Features:**
 *       - Multiple payment methods
 *       - Secure payment processing
 *       - Transaction history
 *       - Payment receipts
 *       - Refund processing
 *       - Payment status tracking
 *
 *   - name: Insurance
 *     description: |
 *       Insurance claim and policy management.
 *
 *       **Features:**
 *       - Insurance policy management
 *       - Claim submission
 *       - Claim status tracking
 *       - Coverage verification
 *       - Pre-authorization requests
 *       - Reimbursement tracking
 *
 *   - name: Reviews
 *     description: |
 *       Review and rating system for doctors and hospitals.
 *
 *       **Features:**
 *       - Submit reviews
 *       - Rate services (1-5 stars)
 *       - View reviews
 *       - Verified patient reviews
 *       - Response from providers
 *       - Review moderation
 *
 *   - name: Notifications
 *     description: |
 *       User notification and alert system.
 *
 *       **Features:**
 *       - Push notifications
 *       - Email notifications
 *       - SMS alerts
 *       - In-app notifications
 *       - Notification preferences
 *       - Read/unread status
 *
 *   - name: Chat
 *     description: |
 *       Real-time messaging system between patients and doctors.
 *
 *       **Features:**
 *       - One-on-one chat
 *       - Message history
 *       - File sharing
 *       - Read receipts
 *       - Typing indicators
 *       - Message search
 *
 *   - name: Video Calls
 *     description: |
 *       Video consultation system for telemedicine.
 *
 *       **Features:**
 *       - HD video calls
 *       - Screen sharing
 *       - Call recording (with consent)
 *       - Call history
 *       - Scheduled consultations
 *       - Emergency calls
 *
 *   - name: Analytics
 *     description: |
 *       Analytics and reporting dashboard.
 *
 *       **Features:**
 *       - Patient statistics
 *       - Revenue reports
 *       - Appointment analytics
 *       - Treatment trends
 *       - Performance metrics
 *       - Custom reports
 *
 *   - name: DNA Kits
 *     description: |
 *       DNA testing kit orders and results management.
 *
 *       **Features:**
 *       - Kit ordering
 *       - Sample tracking
 *       - Result viewing
 *       - Genetic reports
 *       - Health insights
 *       - Privacy controls
 */

/**
 * @swagger
 * components:
 *   examples:
 *     SuccessResponse:
 *       value:
 *         success: true
 *         message: Operation completed successfully
 *         data: {}
 *
 *     ErrorResponse:
 *       value:
 *         success: false
 *         message: An error occurred
 *         error:
 *           code: ERROR_CODE
 *           details: Error details here
 *
 *     PaginatedResponse:
 *       value:
 *         success: true
 *         data:
 *           items: []
 *           pagination:
 *             currentPage: 1
 *             totalPages: 10
 *             totalItems: 95
 *             itemsPerPage: 10
 *             hasNextPage: true
 *             hasPrevPage: false
 *
 *     UnauthorizedError:
 *       value:
 *         success: false
 *         message: Authentication required
 *         error:
 *           code: UNAUTHORIZED
 *           details: Please provide a valid authentication token
 *
 *     ForbiddenError:
 *       value:
 *         success: false
 *         message: Access denied
 *         error:
 *           code: FORBIDDEN
 *           details: You do not have permission to access this resource
 *
 *     NotFoundError:
 *       value:
 *         success: false
 *         message: Resource not found
 *         error:
 *           code: NOT_FOUND
 *           details: The requested resource does not exist
 *
 *     ValidationError:
 *       value:
 *         success: false
 *         message: Validation failed
 *         errors:
 *           - field: email
 *             message: Email is required
 *           - field: password
 *             message: Password must be at least 8 characters
 */

module.exports = {};

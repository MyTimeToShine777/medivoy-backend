# 📚 Medivoy Healthcare API - Complete Reference Guide

## 🌐 Live API Documentation
**Swagger UI**: https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs

---

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [All Endpoints](#all-endpoints)
4. [Request/Response Format](#requestresponse-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## 🚀 Getting Started

### Base URLs
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1`

### Quick Test
```bash
curl https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/health
```

---

## 🔐 Authentication

Most endpoints require JWT authentication.

### How to Authenticate

1. **Register or Login** to get a token
2. **Include the token** in the Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

### Example
```bash
# 1. Login
curl -X POST https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 2. Use token
curl https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1/patients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📍 All Endpoints (126+)

### 1. Health & Monitoring (2 endpoints)

#### GET /health
- **Description**: Basic health check
- **Authentication**: None
- **Response**: `{ "status": "OK", "timestamp": "..." }`

#### GET /api/v1/health
- **Description**: Detailed API health check
- **Authentication**: None
- **Response**: `{ "status": "OK", "message": "..." }`

---

### 2. Authentication & Authorization (8 endpoints)

#### POST /api/v1/auth/register
- **Description**: Register a new user
- **Authentication**: None
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "role": "patient"
  }
  ```
- **Response**: `{ "success": true, "data": { "user": {...}, "token": "..." } }`

#### POST /api/v1/auth/login
- **Description**: User login
- **Authentication**: None
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `{ "success": true, "data": { "user": {...}, "token": "..." } }`

#### POST /api/v1/auth/logout
- **Description**: User logout
- **Authentication**: Required
- **Response**: `{ "success": true, "message": "Logged out successfully" }`

#### POST /api/v1/auth/refresh-token
- **Description**: Refresh access token
- **Authentication**: Required (refresh token)
- **Body**: `{ "refreshToken": "..." }`
- **Response**: `{ "success": true, "data": { "token": "..." } }`

#### POST /api/v1/auth/forgot-password
- **Description**: Request password reset
- **Authentication**: None
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "success": true, "message": "Reset email sent" }`

#### POST /api/v1/auth/reset-password
- **Description**: Reset password with token
- **Authentication**: None
- **Body**: `{ "token": "...", "password": "newpass123" }`
- **Response**: `{ "success": true, "message": "Password reset successful" }`

#### POST /api/v1/auth/verify-email
- **Description**: Verify email address
- **Authentication**: None
- **Body**: `{ "token": "..." }`
- **Response**: `{ "success": true, "message": "Email verified" }`

#### GET /api/v1/auth/me
- **Description**: Get current user profile
- **Authentication**: Required
- **Response**: `{ "success": true, "data": { "user": {...} } }`

---

### 3. User Management (7 endpoints)

#### GET /api/v1/users
- **Description**: List all users (admin only)
- **Authentication**: Required (admin)
- **Query Params**: `page`, `limit`, `search`, `role`
- **Response**: Paginated list of users

#### GET /api/v1/users/:id
- **Description**: Get user by ID
- **Authentication**: Required
- **Response**: User details

#### PUT /api/v1/users/:id
- **Description**: Update user
- **Authentication**: Required
- **Body**: User fields to update
- **Response**: Updated user

#### DELETE /api/v1/users/:id
- **Description**: Delete user (admin only)
- **Authentication**: Required (admin)
- **Response**: Success message

#### PUT /api/v1/users/:id/password
- **Description**: Change user password
- **Authentication**: Required
- **Body**: `{ "currentPassword": "...", "newPassword": "..." }`
- **Response**: Success message

#### PUT /api/v1/users/:id/role
- **Description**: Update user role (admin only)
- **Authentication**: Required (admin)
- **Body**: `{ "role": "doctor" }`
- **Response**: Updated user

#### GET /api/v1/users/:id/activity
- **Description**: Get user activity log
- **Authentication**: Required
- **Response**: Activity history

---

### 4. Patient Management (8 endpoints)

#### GET /api/v1/patients
- **Description**: List all patients
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `search`
- **Response**: Paginated list of patients

#### GET /api/v1/patients/:id
- **Description**: Get patient by ID
- **Authentication**: Required
- **Response**: Patient details

#### POST /api/v1/patients
- **Description**: Create new patient
- **Authentication**: Required
- **Body**: Patient data
- **Response**: Created patient

#### PUT /api/v1/patients/:id
- **Description**: Update patient
- **Authentication**: Required
- **Body**: Patient fields to update
- **Response**: Updated patient

#### DELETE /api/v1/patients/:id
- **Description**: Delete patient
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/patients/:id/medical-history
- **Description**: Get patient medical history
- **Authentication**: Required
- **Response**: Medical history records

#### GET /api/v1/patients/:id/appointments
- **Description**: Get patient appointments
- **Authentication**: Required
- **Response**: List of appointments

#### GET /api/v1/patients/:id/bookings
- **Description**: Get patient bookings
- **Authentication**: Required
- **Response**: List of bookings

---

### 5. Doctor Management (9 endpoints)

#### GET /api/v1/doctors
- **Description**: List all doctors
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `search`, `specialization`
- **Response**: Paginated list of doctors

#### GET /api/v1/doctors/:id
- **Description**: Get doctor by ID
- **Authentication**: Required
- **Response**: Doctor details

#### POST /api/v1/doctors
- **Description**: Create new doctor
- **Authentication**: Required (admin)
- **Body**: Doctor data
- **Response**: Created doctor

#### PUT /api/v1/doctors/:id
- **Description**: Update doctor
- **Authentication**: Required
- **Body**: Doctor fields to update
- **Response**: Updated doctor

#### DELETE /api/v1/doctors/:id
- **Description**: Delete doctor
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/doctors/:id/schedule
- **Description**: Get doctor schedule
- **Authentication**: Required
- **Response**: Schedule details

#### GET /api/v1/doctors/:id/appointments
- **Description**: Get doctor appointments
- **Authentication**: Required
- **Response**: List of appointments

#### GET /api/v1/doctors/:id/reviews
- **Description**: Get doctor reviews
- **Authentication**: None
- **Response**: List of reviews

#### GET /api/v1/doctors/search
- **Description**: Search doctors
- **Authentication**: Required
- **Query Params**: `q`, `specialization`, `location`
- **Response**: Search results

---

### 6. Hospital Management (8 endpoints)

#### GET /api/v1/hospitals
- **Description**: List all hospitals
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `search`, `location`
- **Response**: Paginated list of hospitals

#### GET /api/v1/hospitals/:id
- **Description**: Get hospital by ID
- **Authentication**: Required
- **Response**: Hospital details

#### POST /api/v1/hospitals
- **Description**: Create new hospital
- **Authentication**: Required (admin)
- **Body**: Hospital data
- **Response**: Created hospital

#### PUT /api/v1/hospitals/:id
- **Description**: Update hospital
- **Authentication**: Required (admin)
- **Body**: Hospital fields to update
- **Response**: Updated hospital

#### DELETE /api/v1/hospitals/:id
- **Description**: Delete hospital
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/hospitals/:id/doctors
- **Description**: Get hospital doctors
- **Authentication**: Required
- **Response**: List of doctors

#### GET /api/v1/hospitals/:id/treatments
- **Description**: Get hospital treatments
- **Authentication**: Required
- **Response**: List of treatments

#### GET /api/v1/hospitals/:id/reviews
- **Description**: Get hospital reviews
- **Authentication**: None
- **Response**: List of reviews

---

### 7. Treatment Management (7 endpoints)

#### GET /api/v1/treatments
- **Description**: List all treatments
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `search`, `category`
- **Response**: Paginated list of treatments

#### GET /api/v1/treatments/:id
- **Description**: Get treatment by ID
- **Authentication**: Required
- **Response**: Treatment details

#### POST /api/v1/treatments
- **Description**: Create new treatment
- **Authentication**: Required (admin)
- **Body**: Treatment data
- **Response**: Created treatment

#### PUT /api/v1/treatments/:id
- **Description**: Update treatment
- **Authentication**: Required (admin)
- **Body**: Treatment fields to update
- **Response**: Updated treatment

#### DELETE /api/v1/treatments/:id
- **Description**: Delete treatment
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/treatments/search
- **Description**: Search treatments
- **Authentication**: Required
- **Query Params**: `q`, `category`, `priceRange`
- **Response**: Search results

#### GET /api/v1/treatments/:id/hospitals
- **Description**: Get hospitals offering treatment
- **Authentication**: Required
- **Response**: List of hospitals

---

### 8. Treatment Categories (5 endpoints)

#### GET /api/v1/treatment-categories
- **Description**: List all treatment categories
- **Authentication**: None
- **Response**: List of categories

#### GET /api/v1/treatment-categories/:id
- **Description**: Get category by ID
- **Authentication**: None
- **Response**: Category details

#### POST /api/v1/treatment-categories
- **Description**: Create new category
- **Authentication**: Required (admin)
- **Body**: Category data
- **Response**: Created category

#### PUT /api/v1/treatment-categories/:id
- **Description**: Update category
- **Authentication**: Required (admin)
- **Body**: Category fields to update
- **Response**: Updated category

#### DELETE /api/v1/treatment-categories/:id
- **Description**: Delete category
- **Authentication**: Required (admin)
- **Response**: Success message

---

### 9. Booking Management (10 endpoints)

#### GET /api/v1/bookings
- **Description**: List all bookings
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `status`
- **Response**: Paginated list of bookings

#### GET /api/v1/bookings/:id
- **Description**: Get booking by ID
- **Authentication**: Required
- **Response**: Booking details

#### POST /api/v1/bookings
- **Description**: Create new booking
- **Authentication**: Required
- **Body**: Booking data
- **Response**: Created booking

#### PUT /api/v1/bookings/:id
- **Description**: Update booking
- **Authentication**: Required
- **Body**: Booking fields to update
- **Response**: Updated booking

#### DELETE /api/v1/bookings/:id
- **Description**: Cancel booking
- **Authentication**: Required
- **Response**: Success message

#### PUT /api/v1/bookings/:id/status
- **Description**: Update booking status
- **Authentication**: Required
- **Body**: `{ "status": "confirmed" }`
- **Response**: Updated booking

#### GET /api/v1/bookings/:id/history
- **Description**: Get booking status history
- **Authentication**: Required
- **Response**: Status history

#### POST /api/v1/bookings/:id/assign-coordinator
- **Description**: Assign coordinator to booking
- **Authentication**: Required (admin)
- **Body**: `{ "coordinatorId": 123 }`
- **Response**: Updated booking

#### GET /api/v1/bookings/status/:status
- **Description**: Get bookings by status
- **Authentication**: Required
- **Response**: List of bookings

#### GET /api/v1/bookings/:id/timeline
- **Description**: Get booking timeline
- **Authentication**: Required
- **Response**: Timeline events

---

### 10. Appointment Management (7 endpoints)

#### GET /api/v1/appointments
- **Description**: List all appointments
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `date`, `status`
- **Response**: Paginated list of appointments

#### GET /api/v1/appointments/:id
- **Description**: Get appointment by ID
- **Authentication**: Required
- **Response**: Appointment details

#### POST /api/v1/appointments
- **Description**: Create new appointment
- **Authentication**: Required
- **Body**: Appointment data
- **Response**: Created appointment

#### PUT /api/v1/appointments/:id
- **Description**: Update appointment
- **Authentication**: Required
- **Body**: Appointment fields to update
- **Response**: Updated appointment

#### DELETE /api/v1/appointments/:id
- **Description**: Cancel appointment
- **Authentication**: Required
- **Response**: Success message

#### PUT /api/v1/appointments/:id/status
- **Description**: Update appointment status
- **Authentication**: Required
- **Body**: `{ "status": "completed" }`
- **Response**: Updated appointment

#### GET /api/v1/appointments/:id/reschedule
- **Description**: Reschedule appointment
- **Authentication**: Required
- **Body**: `{ "newDate": "2025-11-01", "newTime": "10:00" }`
- **Response**: Rescheduled appointment

---

### 11. Payment Management (8 endpoints)

#### GET /api/v1/payments
- **Description**: List all payments
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `status`
- **Response**: Paginated list of payments

#### GET /api/v1/payments/:id
- **Description**: Get payment by ID
- **Authentication**: Required
- **Response**: Payment details

#### POST /api/v1/payments
- **Description**: Create new payment
- **Authentication**: Required
- **Body**: Payment data
- **Response**: Created payment

#### PUT /api/v1/payments/:id
- **Description**: Update payment
- **Authentication**: Required (admin)
- **Body**: Payment fields to update
- **Response**: Updated payment

#### POST /api/v1/payments/:id/refund
- **Description**: Refund payment
- **Authentication**: Required (admin)
- **Body**: `{ "amount": 100, "reason": "..." }`
- **Response**: Refund details

#### GET /api/v1/payments/:id/receipt
- **Description**: Get payment receipt
- **Authentication**: Required
- **Response**: Receipt PDF or data

#### POST /api/v1/payments/webhook
- **Description**: Payment gateway webhook
- **Authentication**: None (webhook signature)
- **Body**: Webhook payload
- **Response**: Success message

#### GET /api/v1/payments/booking/:bookingId
- **Description**: Get payments for booking
- **Authentication**: Required
- **Response**: List of payments

---

### 12. Invoice Management (6 endpoints)

#### GET /api/v1/invoices
- **Description**: List all invoices
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `status`
- **Response**: Paginated list of invoices

#### GET /api/v1/invoices/:id
- **Description**: Get invoice by ID
- **Authentication**: Required
- **Response**: Invoice details

#### POST /api/v1/invoices
- **Description**: Create new invoice
- **Authentication**: Required (admin)
- **Body**: Invoice data
- **Response**: Created invoice

#### PUT /api/v1/invoices/:id
- **Description**: Update invoice
- **Authentication**: Required (admin)
- **Body**: Invoice fields to update
- **Response**: Updated invoice

#### DELETE /api/v1/invoices/:id
- **Description**: Delete invoice
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/invoices/:id/download
- **Description**: Download invoice PDF
- **Authentication**: Required
- **Response**: PDF file

---

### 13. Medical Records (7 endpoints)

#### GET /api/v1/medical-records
- **Description**: List all medical records
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `patientId`
- **Response**: Paginated list of records

#### GET /api/v1/medical-records/:id
- **Description**: Get medical record by ID
- **Authentication**: Required
- **Response**: Record details

#### POST /api/v1/medical-records
- **Description**: Create new medical record
- **Authentication**: Required (doctor)
- **Body**: Record data
- **Response**: Created record

#### PUT /api/v1/medical-records/:id
- **Description**: Update medical record
- **Authentication**: Required (doctor)
- **Body**: Record fields to update
- **Response**: Updated record

#### DELETE /api/v1/medical-records/:id
- **Description**: Delete medical record
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/medical-records/patient/:patientId
- **Description**: Get patient medical records
- **Authentication**: Required
- **Response**: List of records

#### POST /api/v1/medical-records/:id/share
- **Description**: Share medical record
- **Authentication**: Required
- **Body**: `{ "shareWith": "doctor@example.com" }`
- **Response**: Share link

---

### 14. Prescription Management (6 endpoints)

#### GET /api/v1/prescriptions
- **Description**: List all prescriptions
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `patientId`
- **Response**: Paginated list of prescriptions

#### GET /api/v1/prescriptions/:id
- **Description**: Get prescription by ID
- **Authentication**: Required
- **Response**: Prescription details

#### POST /api/v1/prescriptions
- **Description**: Create new prescription
- **Authentication**: Required (doctor)
- **Body**: Prescription data
- **Response**: Created prescription

#### PUT /api/v1/prescriptions/:id
- **Description**: Update prescription
- **Authentication**: Required (doctor)
- **Body**: Prescription fields to update
- **Response**: Updated prescription

#### DELETE /api/v1/prescriptions/:id
- **Description**: Delete prescription
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/prescriptions/patient/:patientId
- **Description**: Get patient prescriptions
- **Authentication**: Required
- **Response**: List of prescriptions

---

### 15. Lab Tests & Laboratories (12 endpoints)

#### GET /api/v1/laboratories
- **Description**: List all laboratories
- **Authentication**: Required
- **Response**: List of laboratories

#### GET /api/v1/laboratories/:id
- **Description**: Get laboratory by ID
- **Authentication**: Required
- **Response**: Laboratory details

#### POST /api/v1/laboratories
- **Description**: Create new laboratory
- **Authentication**: Required (admin)
- **Body**: Laboratory data
- **Response**: Created laboratory

#### PUT /api/v1/laboratories/:id
- **Description**: Update laboratory
- **Authentication**: Required (admin)
- **Body**: Laboratory fields to update
- **Response**: Updated laboratory

#### DELETE /api/v1/laboratories/:id
- **Description**: Delete laboratory
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/lab-tests
- **Description**: List all lab tests
- **Authentication**: Required
- **Response**: List of lab tests

#### GET /api/v1/lab-tests/:id
- **Description**: Get lab test by ID
- **Authentication**: Required
- **Response**: Lab test details

#### POST /api/v1/lab-tests
- **Description**: Create new lab test
- **Authentication**: Required (doctor)
- **Body**: Lab test data
- **Response**: Created lab test

#### PUT /api/v1/lab-tests/:id
- **Description**: Update lab test
- **Authentication**: Required (doctor)
- **Body**: Lab test fields to update
- **Response**: Updated lab test

#### DELETE /api/v1/lab-tests/:id
- **Description**: Delete lab test
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/lab-tests/patient/:patientId
- **Description**: Get patient lab tests
- **Authentication**: Required
- **Response**: List of lab tests

#### POST /api/v1/lab-tests/:id/results
- **Description**: Upload lab test results
- **Authentication**: Required (lab)
- **Body**: Results data
- **Response**: Updated lab test

---

### 16. Insurance Management (7 endpoints)

#### GET /api/v1/insurance
- **Description**: List all insurance records
- **Authentication**: Required
- **Response**: List of insurance records

#### GET /api/v1/insurance/:id
- **Description**: Get insurance by ID
- **Authentication**: Required
- **Response**: Insurance details

#### POST /api/v1/insurance
- **Description**: Create new insurance record
- **Authentication**: Required
- **Body**: Insurance data
- **Response**: Created insurance

#### PUT /api/v1/insurance/:id
- **Description**: Update insurance
- **Authentication**: Required
- **Body**: Insurance fields to update
- **Response**: Updated insurance

#### DELETE /api/v1/insurance/:id
- **Description**: Delete insurance
- **Authentication**: Required (admin)
- **Response**: Success message

#### POST /api/v1/insurance/:id/verify
- **Description**: Verify insurance
- **Authentication**: Required
- **Response**: Verification result

#### GET /api/v1/insurance/patient/:patientId
- **Description**: Get patient insurance
- **Authentication**: Required
- **Response**: Insurance details

---

### 17. Reviews & Ratings (6 endpoints)

#### GET /api/v1/reviews
- **Description**: List all reviews
- **Authentication**: None
- **Query Params**: `page`, `limit`, `entityType`, `entityId`
- **Response**: Paginated list of reviews

#### GET /api/v1/reviews/:id
- **Description**: Get review by ID
- **Authentication**: None
- **Response**: Review details

#### POST /api/v1/reviews
- **Description**: Create new review
- **Authentication**: Required
- **Body**: Review data
- **Response**: Created review

#### PUT /api/v1/reviews/:id
- **Description**: Update review
- **Authentication**: Required
- **Body**: Review fields to update
- **Response**: Updated review

#### DELETE /api/v1/reviews/:id
- **Description**: Delete review
- **Authentication**: Required
- **Response**: Success message

#### GET /api/v1/reviews/entity/:entityType/:entityId
- **Description**: Get reviews for entity
- **Authentication**: None
- **Response**: List of reviews

---

### 18. Notifications (7 endpoints)

#### GET /api/v1/notifications
- **Description**: List all notifications
- **Authentication**: Required
- **Response**: List of notifications

#### GET /api/v1/notifications/:id
- **Description**: Get notification by ID
- **Authentication**: Required
- **Response**: Notification details

#### POST /api/v1/notifications
- **Description**: Create new notification
- **Authentication**: Required (admin)
- **Body**: Notification data
- **Response**: Created notification

#### PUT /api/v1/notifications/:id/read
- **Description**: Mark notification as read
- **Authentication**: Required
- **Response**: Updated notification

#### DELETE /api/v1/notifications/:id
- **Description**: Delete notification
- **Authentication**: Required
- **Response**: Success message

#### PUT /api/v1/notifications/read-all
- **Description**: Mark all notifications as read
- **Authentication**: Required
- **Response**: Success message

#### GET /api/v1/notifications/unread-count
- **Description**: Get unread notification count
- **Authentication**: Required
- **Response**: `{ "count": 5 }`

---

### 19. File Uploads & Media (14 endpoints)

#### POST /api/v1/uploads
- **Description**: Upload file
- **Authentication**: Required
- **Body**: Multipart form data
- **Response**: File details

#### POST /api/v1/media/upload
- **Description**: Upload single file (ImageKit)
- **Authentication**: Required
- **Body**: Multipart form data
- **Response**: File details

#### POST /api/v1/media/upload-multiple
- **Description**: Upload multiple files
- **Authentication**: Required
- **Body**: Multipart form data
- **Response**: List of file details

#### DELETE /api/v1/media/:fileId
- **Description**: Delete file
- **Authentication**: Required
- **Response**: Success message

#### POST /api/v1/media/delete-multiple
- **Description**: Delete multiple files
- **Authentication**: Required
- **Body**: `{ "fileIds": [1, 2, 3] }`
- **Response**: Success message

#### GET /api/v1/media/:fileId
- **Description**: Get file details
- **Authentication**: Required
- **Response**: File details

#### GET /api/v1/media
- **Description**: List files
- **Authentication**: Required
- **Query Params**: `page`, `limit`, `folder`
- **Response**: Paginated list of files

#### PUT /api/v1/media/:fileId
- **Description**: Update file details
- **Authentication**: Required
- **Body**: File metadata
- **Response**: Updated file

#### POST /api/v1/media/transform
- **Description**: Get transformed image URL
- **Authentication**: Required
- **Body**: Transformation parameters
- **Response**: Transformed URL

#### POST /api/v1/media/thumbnail
- **Description**: Get thumbnail URL
- **Authentication**: Required
- **Body**: Thumbnail parameters
- **Response**: Thumbnail URL

#### POST /api/v1/media/optimize
- **Description**: Get optimized image URL
- **Authentication**: Required
- **Body**: Optimization parameters
- **Response**: Optimized URL

#### POST /api/v1/media/purge-cache
- **Description**: Purge CDN cache
- **Authentication**: Required (admin)
- **Body**: `{ "fileId": "..." }`
- **Response**: Success message

#### GET /api/v1/media/auth/params
- **Description**: Get auth params for client-side upload
- **Authentication**: Required
- **Response**: Auth parameters

#### POST /api/v1/media/folder
- **Description**: Create folder
- **Authentication**: Required
- **Body**: `{ "name": "folder-name" }`
- **Response**: Folder details

#### DELETE /api/v1/media/folder
- **Description**: Delete folder
- **Authentication**: Required (admin)
- **Body**: `{ "path": "/folder-path" }`
- **Response**: Success message

---

### 20. Support & Tickets (7 endpoints)

#### GET /api/v1/support
- **Description**: List all support tickets
- **Authentication**: Required
- **Response**: List of tickets

#### GET /api/v1/support/:id
- **Description**: Get ticket by ID
- **Authentication**: Required
- **Response**: Ticket details

#### POST /api/v1/support
- **Description**: Create new support ticket
- **Authentication**: Required
- **Body**: Ticket data
- **Response**: Created ticket

#### PUT /api/v1/support/:id
- **Description**: Update ticket
- **Authentication**: Required
- **Body**: Ticket fields to update
- **Response**: Updated ticket

#### DELETE /api/v1/support/:id
- **Description**: Delete ticket
- **Authentication**: Required (admin)
- **Response**: Success message

#### POST /api/v1/support/:id/reply
- **Description**: Reply to ticket
- **Authentication**: Required
- **Body**: `{ "message": "..." }`
- **Response**: Updated ticket

#### PUT /api/v1/support/:id/status
- **Description**: Update ticket status
- **Authentication**: Required
- **Body**: `{ "status": "resolved" }`
- **Response**: Updated ticket

---

### 21. Subscriptions (6 endpoints)

#### GET /api/v1/subscriptions
- **Description**: List all subscriptions
- **Authentication**: Required
- **Response**: List of subscriptions

#### GET /api/v1/subscriptions/:id
- **Description**: Get subscription by ID
- **Authentication**: Required
- **Response**: Subscription details

#### POST /api/v1/subscriptions
- **Description**: Create new subscription
- **Authentication**: Required
- **Body**: Subscription data
- **Response**: Created subscription

#### PUT /api/v1/subscriptions/:id
- **Description**: Update subscription
- **Authentication**: Required
- **Body**: Subscription fields to update
- **Response**: Updated subscription

#### DELETE /api/v1/subscriptions/:id
- **Description**: Cancel subscription
- **Authentication**: Required
- **Response**: Success message

#### POST /api/v1/subscriptions/:id/renew
- **Description**: Renew subscription
- **Authentication**: Required
- **Response**: Renewed subscription

---

### 22. Coupons & Discounts (7 endpoints)

#### GET /api/v1/coupons
- **Description**: List all coupons
- **Authentication**: Required (admin)
- **Response**: List of coupons

#### GET /api/v1/coupons/:id
- **Description**: Get coupon by ID
- **Authentication**: Required (admin)
- **Response**: Coupon details

#### POST /api/v1/coupons
- **Description**: Create new coupon
- **Authentication**: Required (admin)
- **Body**: Coupon data
- **Response**: Created coupon

#### PUT /api/v1/coupons/:id
- **Description**: Update coupon
- **Authentication**: Required (admin)
- **Body**: Coupon fields to update
- **Response**: Updated coupon

#### DELETE /api/v1/coupons/:id
- **Description**: Delete coupon
- **Authentication**: Required (admin)
- **Response**: Success message

#### POST /api/v1/coupons/validate
- **Description**: Validate coupon code
- **Authentication**: Required
- **Body**: `{ "code": "SAVE20" }`
- **Response**: Validation result

#### GET /api/v1/coupons/:code/details
- **Description**: Get coupon details by code
- **Authentication**: Required
- **Response**: Coupon details

---

### 23. FAQs (5 endpoints)

#### GET /api/v1/faqs
- **Description**: List all FAQs
- **Authentication**: None
- **Query Params**: `category`
- **Response**: List of FAQs

#### GET /api/v1/faqs/:id
- **Description**: Get FAQ by ID
- **Authentication**: None
- **Response**: FAQ details

#### POST /api/v1/faqs
- **Description**: Create new FAQ
- **Authentication**: Required (admin)
- **Body**: FAQ data
- **Response**: Created FAQ

#### PUT /api/v1/faqs/:id
- **Description**: Update FAQ
- **Authentication**: Required (admin)
- **Body**: FAQ fields to update
- **Response**: Updated FAQ

#### DELETE /api/v1/faqs/:id
- **Description**: Delete FAQ
- **Authentication**: Required (admin)
- **Response**: Success message

---

### 24. Website Content (6 endpoints)

#### GET /api/v1/website-content
- **Description**: List all website content
- **Authentication**: None
- **Response**: List of content

#### GET /api/v1/website-content/:id
- **Description**: Get content by ID
- **Authentication**: None
- **Response**: Content details

#### POST /api/v1/website-content
- **Description**: Create new content
- **Authentication**: Required (admin)
- **Body**: Content data
- **Response**: Created content

#### PUT /api/v1/website-content/:id
- **Description**: Update content
- **Authentication**: Required (admin)
- **Body**: Content fields to update
- **Response**: Updated content

#### DELETE /api/v1/website-content/:id
- **Description**: Delete content
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/website-content/type/:type
- **Description**: Get content by type
- **Authentication**: None
- **Response**: Content details

---

### 25. Analytics & Dashboard (5 endpoints)

#### GET /api/v1/analytics/dashboard
- **Description**: Get dashboard statistics
- **Authentication**: Required (admin)
- **Response**: Dashboard stats

#### GET /api/v1/analytics/bookings
- **Description**: Get booking analytics
- **Authentication**: Required (admin)
- **Query Params**: `startDate`, `endDate`
- **Response**: Booking analytics

#### GET /api/v1/analytics/revenue
- **Description**: Get revenue analytics
- **Authentication**: Required (admin)
- **Query Params**: `startDate`, `endDate`
- **Response**: Revenue analytics

#### GET /api/v1/analytics/top-hospitals
- **Description**: Get top hospitals
- **Authentication**: Required (admin)
- **Response**: Top hospitals list

#### GET /api/v1/analytics/patient-demographics
- **Description**: Get patient demographics
- **Authentication**: Required (admin)
- **Response**: Demographics data

---

### 26. Doctor Schedules (5 endpoints)

#### GET /api/v1/doctor-schedules
- **Description**: List all doctor schedules
- **Authentication**: Required
- **Query Params**: `doctorId`, `date`
- **Response**: List of schedules

#### GET /api/v1/doctor-schedules/:id
- **Description**: Get schedule by ID
- **Authentication**: Required
- **Response**: Schedule details

#### POST /api/v1/doctor-schedules
- **Description**: Create new schedule
- **Authentication**: Required (doctor/admin)
- **Body**: Schedule data
- **Response**: Created schedule

#### PUT /api/v1/doctor-schedules/:id
- **Description**: Update schedule
- **Authentication**: Required (doctor/admin)
- **Body**: Schedule fields to update
- **Response**: Updated schedule

#### DELETE /api/v1/doctor-schedules/:id
- **Description**: Delete schedule
- **Authentication**: Required (doctor/admin)
- **Response**: Success message

---

### 27. Staff Management (6 endpoints)

#### GET /api/v1/staff
- **Description**: List all staff
- **Authentication**: Required (admin)
- **Response**: List of staff

#### GET /api/v1/staff/:id
- **Description**: Get staff by ID
- **Authentication**: Required (admin)
- **Response**: Staff details

#### POST /api/v1/staff
- **Description**: Create new staff
- **Authentication**: Required (admin)
- **Body**: Staff data
- **Response**: Created staff

#### PUT /api/v1/staff/:id
- **Description**: Update staff
- **Authentication**: Required (admin)
- **Body**: Staff fields to update
- **Response**: Updated staff

#### DELETE /api/v1/staff/:id
- **Description**: Delete staff
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/staff/:id/performance
- **Description**: Get staff performance metrics
- **Authentication**: Required (admin)
- **Response**: Performance data

---

### 28. Chat & Communication (6 endpoints)

#### GET /api/v1/chat/conversations
- **Description**: List all conversations
- **Authentication**: Required
- **Response**: List of conversations

#### GET /api/v1/chat/conversations/:id
- **Description**: Get conversation by ID
- **Authentication**: Required
- **Response**: Conversation details

#### POST /api/v1/chat/conversations
- **Description**: Create new conversation
- **Authentication**: Required
- **Body**: Conversation data
- **Response**: Created conversation

#### POST /api/v1/chat/messages
- **Description**: Send message
- **Authentication**: Required
- **Body**: Message data
- **Response**: Sent message

#### GET /api/v1/chat/messages/:conversationId
- **Description**: Get conversation messages
- **Authentication**: Required
- **Response**: List of messages

#### PUT /api/v1/chat/messages/:id/read
- **Description**: Mark message as read
- **Authentication**: Required
- **Response**: Updated message

---

### 29. Video Calls (6 endpoints)

#### POST /api/v1/video-calls
- **Description**: Initiate video call
- **Authentication**: Required
- **Body**: Call data
- **Response**: Call details

#### GET /api/v1/video-calls/:id
- **Description**: Get video call by ID
- **Authentication**: Required
- **Response**: Call details

#### POST /api/v1/video-calls/:id/join
- **Description**: Join video call
- **Authentication**: Required
- **Response**: Join token

#### PUT /api/v1/video-calls/:id/end
- **Description**: End video call
- **Authentication**: Required
- **Response**: Call summary

#### GET /api/v1/video-calls/history
- **Description**: Get call history
- **Authentication**: Required
- **Response**: List of calls

#### PUT /api/v1/video-calls/:id/recording
- **Description**: Update recording status
- **Authentication**: Required
- **Body**: `{ "recording": true }`
- **Response**: Updated call

---

### 30. System Settings (9 endpoints)

#### GET /api/v1/system-settings
- **Description**: List all settings
- **Authentication**: Required (admin)
- **Response**: List of settings

#### GET /api/v1/system-settings/:key
- **Description**: Get setting by key
- **Authentication**: Required (admin)
- **Response**: Setting value

#### POST /api/v1/system-settings
- **Description**: Create new setting
- **Authentication**: Required (admin)
- **Body**: Setting data
- **Response**: Created setting

#### PUT /api/v1/system-settings/:key
- **Description**: Update setting
- **Authentication**: Required (admin)
- **Body**: Setting value
- **Response**: Updated setting

#### DELETE /api/v1/system-settings/:key
- **Description**: Delete setting
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/system-settings/category/:category
- **Description**: Get settings by category
- **Authentication**: Required (admin)
- **Response**: List of settings

#### POST /api/v1/system-settings/bulk
- **Description**: Bulk update settings
- **Authentication**: Required (admin)
- **Body**: Array of settings
- **Response**: Updated settings

#### GET /api/v1/system-settings/public
- **Description**: Get public settings
- **Authentication**: None
- **Response**: Public settings

#### POST /api/v1/system-settings/reset/:key
- **Description**: Reset setting to default
- **Authentication**: Required (admin)
- **Response**: Reset setting

---

### 31. Terms & Privacy (13 endpoints)

#### GET /api/v1/terms-privacy/terms
- **Description**: Get current terms
- **Authentication**: None
- **Response**: Terms document

#### GET /api/v1/terms-privacy/terms/:version
- **Description**: Get terms by version
- **Authentication**: None
- **Response**: Terms document

#### POST /api/v1/terms-privacy/terms
- **Description**: Create new terms version
- **Authentication**: Required (admin)
- **Body**: Terms content
- **Response**: Created terms

#### PUT /api/v1/terms-privacy/terms/:version
- **Description**: Update terms
- **Authentication**: Required (admin)
- **Body**: Terms content
- **Response**: Updated terms

#### GET /api/v1/terms-privacy/privacy
- **Description**: Get current privacy policy
- **Authentication**: None
- **Response**: Privacy document

#### GET /api/v1/terms-privacy/privacy/:version
- **Description**: Get privacy policy by version
- **Authentication**: None
- **Response**: Privacy document

#### POST /api/v1/terms-privacy/privacy
- **Description**: Create new privacy policy version
- **Authentication**: Required (admin)
- **Body**: Privacy content
- **Response**: Created privacy policy

#### PUT /api/v1/terms-privacy/privacy/:version
- **Description**: Update privacy policy
- **Authentication**: Required (admin)
- **Body**: Privacy content
- **Response**: Updated privacy policy

#### POST /api/v1/terms-privacy/accept
- **Description**: Accept terms and privacy
- **Authentication**: Required
- **Body**: `{ "termsVersion": "1.0", "privacyVersion": "1.0" }`
- **Response**: Acceptance record

#### GET /api/v1/terms-privacy/acceptance/:userId
- **Description**: Get user acceptance status
- **Authentication**: Required
- **Response**: Acceptance details

#### GET /api/v1/terms-privacy/versions
- **Description**: Get all versions
- **Authentication**: None
- **Response**: List of versions

#### GET /api/v1/terms-privacy/latest
- **Description**: Get latest versions
- **Authentication**: None
- **Response**: Latest terms and privacy

#### GET /api/v1/terms-privacy/history/:userId
- **Description**: Get user acceptance history
- **Authentication**: Required
- **Response**: Acceptance history

---

### 32. DNA Kits (10 endpoints)

#### GET /api/v1/dna-kits
- **Description**: List all DNA kits
- **Authentication**: Required
- **Response**: List of DNA kits

#### GET /api/v1/dna-kits/:id
- **Description**: Get DNA kit by ID
- **Authentication**: Required
- **Response**: DNA kit details

#### POST /api/v1/dna-kits
- **Description**: Order DNA kit
- **Authentication**: Required
- **Body**: Order data
- **Response**: Created DNA kit order

#### PUT /api/v1/dna-kits/:id
- **Description**: Update DNA kit
- **Authentication**: Required
- **Body**: Kit fields to update
- **Response**: Updated DNA kit

#### DELETE /api/v1/dna-kits/:id
- **Description**: Cancel DNA kit order
- **Authentication**: Required
- **Response**: Success message

#### PUT /api/v1/dna-kits/:id/status
- **Description**: Update kit status
- **Authentication**: Required (admin)
- **Body**: `{ "status": "shipped" }`
- **Response**: Updated DNA kit

#### POST /api/v1/dna-kits/:id/results
- **Description**: Upload DNA test results
- **Authentication**: Required (lab)
- **Body**: Results data
- **Response**: Updated DNA kit

#### GET /api/v1/dna-kits/:id/results
- **Description**: Get DNA test results
- **Authentication**: Required
- **Response**: Results data

#### GET /api/v1/dna-kits/patient/:patientId
- **Description**: Get patient DNA kits
- **Authentication**: Required
- **Response**: List of DNA kits

#### POST /api/v1/dna-kits/:id/ship
- **Description**: Ship DNA kit
- **Authentication**: Required (admin)
- **Body**: Shipping data
- **Response**: Updated DNA kit

---

### 33. Audit Logs (8 endpoints)

#### GET /api/v1/audit-logs
- **Description**: List all audit logs
- **Authentication**: Required (admin)
- **Query Params**: `page`, `limit`, `userId`, `action`
- **Response**: Paginated list of logs

#### GET /api/v1/audit-logs/:id
- **Description**: Get audit log by ID
- **Authentication**: Required (admin)
- **Response**: Log details

#### POST /api/v1/audit-logs
- **Description**: Create audit log
- **Authentication**: System
- **Body**: Log data
- **Response**: Created log

#### GET /api/v1/audit-logs/user/:userId
- **Description**: Get user audit logs
- **Authentication**: Required (admin)
- **Response**: List of logs

#### GET /api/v1/audit-logs/entity/:entityType/:entityId
- **Description**: Get entity audit logs
- **Authentication**: Required (admin)
- **Response**: List of logs

#### GET /api/v1/audit-logs/search
- **Description**: Search audit logs
- **Authentication**: Required (admin)
- **Query Params**: `q`, `startDate`, `endDate`
- **Response**: Search results

#### POST /api/v1/audit-logs/export
- **Description**: Export audit logs
- **Authentication**: Required (admin)
- **Body**: Export parameters
- **Response**: Export file

#### DELETE /api/v1/audit-logs/cleanup
- **Description**: Cleanup old logs
- **Authentication**: Required (admin)
- **Body**: `{ "olderThan": "90days" }`
- **Response**: Cleanup summary

---

### 34. Integrations (15 endpoints)

#### GET /api/v1/integrations
- **Description**: List all integrations
- **Authentication**: Required (admin)
- **Response**: List of integrations

#### GET /api/v1/integrations/:id
- **Description**: Get integration by ID
- **Authentication**: Required (admin)
- **Response**: Integration details

#### POST /api/v1/integrations
- **Description**: Create new integration
- **Authentication**: Required (admin)
- **Body**: Integration data
- **Response**: Created integration

#### PUT /api/v1/integrations/:id
- **Description**: Update integration
- **Authentication**: Required (admin)
- **Body**: Integration fields to update
- **Response**: Updated integration

#### DELETE /api/v1/integrations/:id
- **Description**: Delete integration
- **Authentication**: Required (admin)
- **Response**: Success message

#### POST /api/v1/integrations/:id/test
- **Description**: Test integration
- **Authentication**: Required (admin)
- **Response**: Test result

#### PUT /api/v1/integrations/:id/enable
- **Description**: Enable integration
- **Authentication**: Required (admin)
- **Response**: Updated integration

#### PUT /api/v1/integrations/:id/disable
- **Description**: Disable integration
- **Authentication**: Required (admin)
- **Response**: Updated integration

#### GET /api/v1/integrations/:id/logs
- **Description**: Get integration logs
- **Authentication**: Required (admin)
- **Response**: List of logs

#### POST /api/v1/integrations/:id/sync
- **Description**: Sync integration
- **Authentication**: Required (admin)
- **Response**: Sync result

#### GET /api/v1/integrations/:id/webhooks
- **Description**: List integration webhooks
- **Authentication**: Required (admin)
- **Response**: List of webhooks

#### POST /api/v1/integrations/:id/webhooks
- **Description**: Create webhook
- **Authentication**: Required (admin)
- **Body**: Webhook data
- **Response**: Created webhook

#### PUT /api/v1/integrations/:id/webhooks/:webhookId
- **Description**: Update webhook
- **Authentication**: Required (admin)
- **Body**: Webhook fields to update
- **Response**: Updated webhook

#### DELETE /api/v1/integrations/:id/webhooks/:webhookId
- **Description**: Delete webhook
- **Authentication**: Required (admin)
- **Response**: Success message

#### POST /api/v1/integrations/webhook/:id
- **Description**: Webhook endpoint
- **Authentication**: Webhook signature
- **Body**: Webhook payload
- **Response**: Success message

---

### 35. Translation Services (10 endpoints)

#### POST /api/v1/translation/translate
- **Description**: Translate text
- **Authentication**: Required
- **Body**: `{ "text": "Hello", "targetLang": "es" }`
- **Response**: Translated text

#### POST /api/v1/translation/translate-batch
- **Description**: Translate batch of texts
- **Authentication**: Required
- **Body**: `{ "texts": ["Hello", "World"], "targetLang": "es" }`
- **Response**: Translated texts

#### POST /api/v1/translation/detect
- **Description**: Detect language
- **Authentication**: Required
- **Body**: `{ "text": "Hello" }`
- **Response**: Detected language

#### GET /api/v1/translation/languages
- **Description**: Get supported languages
- **Authentication**: None
- **Response**: List of languages

#### POST /api/v1/translation/queue
- **Description**: Queue translation job
- **Authentication**: Required
- **Body**: Translation job data
- **Response**: Job ID

#### GET /api/v1/translation/job/:jobId
- **Description**: Get job status
- **Authentication**: Required
- **Response**: Job status

#### DELETE /api/v1/translation/job/:jobId
- **Description**: Cancel job
- **Authentication**: Required
- **Response**: Success message

#### GET /api/v1/translation/queue/stats
- **Description**: Get queue statistics
- **Authentication**: Required (admin)
- **Response**: Queue stats

#### POST /api/v1/translation/queue/clean-completed
- **Description**: Clean completed jobs
- **Authentication**: Required (admin)
- **Response**: Cleanup summary

#### POST /api/v1/translation/queue/clean-failed
- **Description**: Clean failed jobs
- **Authentication**: Required (admin)
- **Response**: Cleanup summary

---

### 36. Packages (6 endpoints)

#### GET /api/v1/packages
- **Description**: List all packages
- **Authentication**: None
- **Query Params**: `page`, `limit`, `category`
- **Response**: Paginated list of packages

#### GET /api/v1/packages/:id
- **Description**: Get package by ID
- **Authentication**: None
- **Response**: Package details

#### POST /api/v1/packages
- **Description**: Create new package
- **Authentication**: Required (admin)
- **Body**: Package data
- **Response**: Created package

#### PUT /api/v1/packages/:id
- **Description**: Update package
- **Authentication**: Required (admin)
- **Body**: Package fields to update
- **Response**: Updated package

#### DELETE /api/v1/packages/:id
- **Description**: Delete package
- **Authentication**: Required (admin)
- **Response**: Success message

#### GET /api/v1/packages/search
- **Description**: Search packages
- **Authentication**: None
- **Query Params**: `q`, `category`, `priceRange`
- **Response**: Search results

---

## 📝 Request/Response Format

### Standard Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalRecords": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Common Error Codes

- `AUTH_NO_TOKEN` - No authentication token provided
- `AUTH_TOKEN_EXPIRED` - Token has expired
- `AUTH_TOKEN_INVALID` - Invalid token
- `AUTH_USER_NOT_FOUND` - User not found
- `VALIDATION_ERROR` - Input validation failed
- `RESOURCE_NOT_FOUND` - Resource not found
- `DUPLICATE_RESOURCE` - Resource already exists
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## 🚦 Rate Limiting

### Limits

- **Anonymous users**: 100 requests per 15 minutes
- **Authenticated users**: 1000 requests per 15 minutes
- **Admin users**: 5000 requests per 15 minutes

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1635724800
```

### Handling Rate Limits

When rate limit is exceeded, you'll receive:

```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

---

## 🎯 Best Practices

### 1. Always Use HTTPS in Production
```
https://your-domain.com/api/v1
```

### 2. Include Authentication Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.example.com/api/v1/patients
```

### 3. Handle Errors Gracefully
```javascript
try {
  const response = await fetch('/api/v1/patients');
  const data = await response.json();
  
  if (!data.success) {
    console.error('Error:', data.message);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 4. Use Pagination for Large Datasets
```bash
curl "https://api.example.com/api/v1/patients?page=1&limit=20"
```

### 5. Implement Retry Logic for Failed Requests
```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## 📚 Additional Resources

### Documentation
- **Live Swagger UI**: https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs
- **Beginner's Guide**: See `COMPLETE_BEGINNERS_SETUP_GUIDE.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`

### Support
- **GitHub**: https://github.com/MyTimeToShine777/medivoy-backend
- **Issues**: Report bugs and request features on GitHub

---

## 🎉 Summary

This API provides **126+ endpoints** across **36 categories** for complete healthcare management:

✅ Patient & Doctor Management
✅ Hospital & Treatment Management
✅ Booking & Appointment System
✅ Payment & Invoice Processing
✅ Medical Records & Prescriptions
✅ Lab Tests & Results
✅ Insurance Management
✅ Reviews & Ratings
✅ Notifications & Alerts
✅ File Management & Media
✅ Support & Ticketing
✅ Analytics & Reporting
✅ Chat & Video Calls
✅ System Settings & Configuration
✅ Terms & Privacy Management
✅ DNA Kits & Testing
✅ Audit Logging
✅ Third-party Integrations
✅ Multi-language Support

---

**Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Status**: ✅ Production Ready

---

**🚀 Start using the API now!**

Visit: https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs
# Medivoy Backend - Complete API Documentation
## All 126+ Endpoints with Examples

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  
**Production URL:** `https://api.medivoy.com/api/v1`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Patients](#patients)
4. [Doctors](#doctors)
5. [Hospitals](#hospitals)
6. [Treatments](#treatments)
7. [Bookings](#bookings)
8. [Appointments](#appointments)
9. [Payments](#payments)
10. [Reviews](#reviews)
11. [Notifications](#notifications)
12. [Insurance](#insurance)
13. [Medical Records](#medical-records)
14. [Prescriptions](#prescriptions)
15. [Lab Tests](#lab-tests)
16. [Packages](#packages)
17. [Support](#support)
18. [Analytics](#analytics)
19. [Doctor Schedules](#doctor-schedules)
20. [Staff Management](#staff-management)
21. [Chat System](#chat-system)
22. [Video Calls](#video-calls)
23. [Booking Status](#booking-status)
24. [Media Management](#media-management)
25. [System Settings](#system-settings)
26. [Terms & Privacy](#terms-privacy)
27. [DNA Kits](#dna-kits)
28. [Audit Logs](#audit-logs)
29. [Integrations](#integrations)
30. [Translation](#translation)

---

## Authentication

### 1. Register User

**Endpoint:** `POST /auth/register`  
**Access:** Public  
**Description:** Register a new user account

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "role": "patient",
  "dateOfBirth": "1990-01-15",
  "gender": "male"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "patient",
      "isEmailVerified": false,
      "createdAt": "2024-10-29T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already exists",
  "errors": [
    {
      "field": "email",
      "message": "This email is already registered"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "phone": "+1234567890",
    "role": "patient"
  }'
```

---

### 2. Login

**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Description:** Login with email and password

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "patient",
      "isEmailVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

---

### 3. Refresh Token

**Endpoint:** `POST /auth/refresh-token`  
**Access:** Public  
**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

---

### 4. Logout

**Endpoint:** `POST /auth/logout`  
**Access:** Private  
**Description:** Logout and invalidate tokens

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer your_token_here"
```

---

### 5. Forgot Password

**Endpoint:** `POST /auth/forgot-password`  
**Access:** Public  
**Description:** Request password reset email

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

---

### 6. Reset Password

**Endpoint:** `POST /auth/reset-password/:token`  
**Access:** Public  
**Description:** Reset password using token from email

**Request Body:**
```json
{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password/reset_token_here \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewSecurePass123!",
    "confirmPassword": "NewSecurePass123!"
  }'
```

---

### 7. Verify Email

**Endpoint:** `GET /auth/verify-email/:token`  
**Access:** Public  
**Description:** Verify email address using token

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/verify-email/verification_token_here
```

---

### 8. Resend Verification Email

**Endpoint:** `POST /auth/resend-verification`  
**Access:** Private  
**Description:** Resend email verification link

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/resend-verification \
  -H "Authorization: Bearer your_token_here"
```

---

## Hospitals

### 9. Get All Hospitals

**Endpoint:** `GET /hospitals`  
**Access:** Public  
**Description:** Get list of all hospitals with pagination and filters

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or location
- `city` (optional): Filter by city
- `country` (optional): Filter by country
- `specialization` (optional): Filter by specialization
- `rating` (optional): Minimum rating (1-5)
- `sortBy` (optional): Sort field (name, rating, createdAt)
- `order` (optional): Sort order (asc, desc)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "hospitals": [
      {
        "id": 1,
        "name": "Apollo Hospital",
        "description": "Leading multi-specialty hospital",
        "address": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "zipCode": "400001",
        "phone": "+91-22-12345678",
        "email": "info@apollo.com",
        "website": "https://apollo.com",
        "rating": 4.8,
        "totalReviews": 1250,
        "specializations": ["Cardiology", "Neurology", "Oncology"],
        "facilities": ["ICU", "Emergency", "Pharmacy"],
        "imageUrl": "https://ik.imagekit.io/medivoy/hospitals/apollo.jpg",
        "isVerified": true,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 95,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/hospitals?page=1&limit=10&city=Mumbai&rating=4"
```

---

### 10. Get Hospital by ID

**Endpoint:** `GET /hospitals/:id`  
**Access:** Public  
**Description:** Get detailed information about a specific hospital

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Apollo Hospital",
    "description": "Leading multi-specialty hospital with state-of-the-art facilities",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "zipCode": "400001",
    "phone": "+91-22-12345678",
    "email": "info@apollo.com",
    "website": "https://apollo.com",
    "rating": 4.8,
    "totalReviews": 1250,
    "specializations": ["Cardiology", "Neurology", "Oncology"],
    "facilities": ["ICU", "Emergency", "Pharmacy", "Laboratory"],
    "accreditations": ["JCI", "NABH"],
    "imageUrl": "https://ik.imagekit.io/medivoy/hospitals/apollo.jpg",
    "images": [
      "https://ik.imagekit.io/medivoy/hospitals/apollo-1.jpg",
      "https://ik.imagekit.io/medivoy/hospitals/apollo-2.jpg"
    ],
    "operatingHours": {
      "monday": "00:00-23:59",
      "tuesday": "00:00-23:59",
      "wednesday": "00:00-23:59",
      "thursday": "00:00-23:59",
      "friday": "00:00-23:59",
      "saturday": "00:00-23:59",
      "sunday": "00:00-23:59"
    },
    "emergencyAvailable": true,
    "ambulanceService": true,
    "parkingAvailable": true,
    "isVerified": true,
    "isActive": true,
    "doctors": [
      {
        "id": 1,
        "name": "Dr. Rajesh Kumar",
        "specialization": "Cardiologist",
        "experience": 15,
        "rating": 4.9
      }
    ],
    "treatments": [
      {
        "id": 1,
        "name": "Heart Bypass Surgery",
        "category": "Cardiology",
        "price": 500000
      }
    ],
    "reviews": [
      {
        "id": 1,
        "patientName": "John Doe",
        "rating": 5,
        "comment": "Excellent service and care",
        "createdAt": "2024-10-20T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-10-29T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Hospital not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/v1/hospitals/1
```

---

### 11. Create Hospital

**Endpoint:** `POST /hospitals`  
**Access:** Private (Admin only)  
**Description:** Create a new hospital

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Apollo Hospital",
  "description": "Leading multi-specialty hospital",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "zipCode": "400001",
  "phone": "+91-22-12345678",
  "email": "info@apollo.com",
  "website": "https://apollo.com",
  "specializations": ["Cardiology", "Neurology", "Oncology"],
  "facilities": ["ICU", "Emergency", "Pharmacy"],
  "accreditations": ["JCI", "NABH"],
  "emergencyAvailable": true,
  "ambulanceService": true,
  "parkingAvailable": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Hospital created successfully",
  "data": {
    "id": 1,
    "name": "Apollo Hospital",
    "slug": "apollo-hospital",
    "isActive": true,
    "createdAt": "2024-10-29T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/hospitals \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apollo Hospital",
    "description": "Leading multi-specialty hospital",
    "address": "123 Main Street",
    "city": "Mumbai",
    "country": "India"
  }'
```

---

### 12. Update Hospital

**Endpoint:** `PUT /hospitals/:id`  
**Access:** Private (Admin only)  
**Description:** Update hospital information

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Apollo Hospital - Updated",
  "description": "Updated description",
  "phone": "+91-22-87654321",
  "rating": 4.9
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Hospital updated successfully",
  "data": {
    "id": 1,
    "name": "Apollo Hospital - Updated",
    "updatedAt": "2024-10-29T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/hospitals/1 \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apollo Hospital - Updated",
    "phone": "+91-22-87654321"
  }'
```

---

### 13. Delete Hospital

**Endpoint:** `DELETE /hospitals/:id`  
**Access:** Private (Admin only)  
**Description:** Delete a hospital (soft delete)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Hospital deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/v1/hospitals/1 \
  -H "Authorization: Bearer your_token_here"
```

---

## Doctors

### 14. Get All Doctors

**Endpoint:** `GET /doctors`  
**Access:** Public  
**Description:** Get list of all doctors with filters

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by name
- `specialization` (optional): Filter by specialization
- `hospitalId` (optional): Filter by hospital
- `experience` (optional): Minimum years of experience
- `rating` (optional): Minimum rating
- `availability` (optional): Filter by availability (true/false)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": 1,
        "firstName": "Rajesh",
        "lastName": "Kumar",
        "fullName": "Dr. Rajesh Kumar",
        "email": "dr.rajesh@apollo.com",
        "phone": "+91-98765-43210",
        "specialization": "Cardiologist",
        "qualification": "MBBS, MD, DM (Cardiology)",
        "experience": 15,
        "rating": 4.9,
        "totalReviews": 450,
        "consultationFee": 1500,
        "languages": ["English", "Hindi", "Marathi"],
        "about": "Experienced cardiologist with 15 years of practice",
        "imageUrl": "https://ik.imagekit.io/medivoy/doctors/dr-rajesh.jpg",
        "hospital": {
          "id": 1,
          "name": "Apollo Hospital",
          "city": "Mumbai"
        },
        "isAvailable": true,
        "isVerified": true,
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/doctors?specialization=Cardiologist&rating=4.5"
```

---

### 15. Get Doctor by ID

**Endpoint:** `GET /doctors/:id`  
**Access:** Public  
**Description:** Get detailed doctor information

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "fullName": "Dr. Rajesh Kumar",
    "email": "dr.rajesh@apollo.com",
    "phone": "+91-98765-43210",
    "specialization": "Cardiologist",
    "qualification": "MBBS, MD, DM (Cardiology)",
    "experience": 15,
    "rating": 4.9,
    "totalReviews": 450,
    "consultationFee": 1500,
    "languages": ["English", "Hindi", "Marathi"],
    "about": "Experienced cardiologist specializing in interventional cardiology",
    "education": [
      {
        "degree": "MBBS",
        "institution": "AIIMS Delhi",
        "year": 2005
      },
      {
        "degree": "MD (Medicine)",
        "institution": "AIIMS Delhi",
        "year": 2008
      },
      {
        "degree": "DM (Cardiology)",
        "institution": "AIIMS Delhi",
        "year": 2011
      }
    ],
    "certifications": [
      "Board Certified Cardiologist",
      "Fellow of American College of Cardiology"
    ],
    "awards": [
      "Best Doctor Award 2022",
      "Excellence in Cardiology 2023"
    ],
    "imageUrl": "https://ik.imagekit.io/medivoy/doctors/dr-rajesh.jpg",
    "hospital": {
      "id": 1,
      "name": "Apollo Hospital",
      "city": "Mumbai",
      "address": "123 Main Street"
    },
    "schedule": [
      {
        "day": "Monday",
        "slots": [
          { "startTime": "09:00", "endTime": "12:00" },
          { "startTime": "14:00", "endTime": "17:00" }
        ]
      }
    ],
    "isAvailable": true,
    "isVerified": true,
    "reviews": [
      {
        "id": 1,
        "patientName": "John Doe",
        "rating": 5,
        "comment": "Excellent doctor, very caring",
        "createdAt": "2024-10-20T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/v1/doctors/1
```

---

## Treatments

### 16. Get All Treatments

**Endpoint:** `GET /treatments`  
**Access:** Public  
**Description:** Get list of all treatments

**Query Parameters:**
- `page`, `limit`, `search`, `category`, `hospitalId`, `minPrice`, `maxPrice`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "treatments": [
      {
        "id": 1,
        "name": "Heart Bypass Surgery",
        "description": "Coronary artery bypass grafting",
        "category": "Cardiology",
        "price": 500000,
        "currency": "INR",
        "duration": "4-6 hours",
        "recoveryTime": "6-8 weeks",
        "successRate": 95,
        "hospital": {
          "id": 1,
          "name": "Apollo Hospital"
        },
        "imageUrl": "https://ik.imagekit.io/medivoy/treatments/bypass.jpg",
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 8,
      "totalItems": 75
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/treatments?category=Cardiology"
```

---

## Bookings

### 17. Create Booking

**Endpoint:** `POST /bookings`  
**Access:** Private (Patient)  
**Description:** Create a new treatment booking

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "hospitalId": 1,
  "doctorId": 1,
  "treatmentId": 1,
  "preferredDate": "2024-11-15",
  "preferredTime": "10:00",
  "notes": "Patient has diabetes",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567890",
    "relationship": "Spouse"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "bookingNumber": "BK-2024-001",
    "status": "pending",
    "hospitalId": 1,
    "doctorId": 1,
    "treatmentId": 1,
    "preferredDate": "2024-11-15",
    "estimatedCost": 500000,
    "createdAt": "2024-10-29T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalId": 1,
    "doctorId": 1,
    "treatmentId": 1,
    "preferredDate": "2024-11-15"
  }'
```

---

### 18. Get My Bookings

**Endpoint:** `GET /bookings/my-bookings`  
**Access:** Private (Patient)  
**Description:** Get all bookings for logged-in patient

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `page`, `limit`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1,
        "bookingNumber": "BK-2024-001",
        "status": "confirmed",
        "hospital": {
          "id": 1,
          "name": "Apollo Hospital",
          "city": "Mumbai"
        },
        "doctor": {
          "id": 1,
          "name": "Dr. Rajesh Kumar",
          "specialization": "Cardiologist"
        },
        "treatment": {
          "id": 1,
          "name": "Heart Bypass Surgery",
          "price": 500000
        },
        "appointmentDate": "2024-11-15T10:00:00.000Z",
        "estimatedCost": 500000,
        "createdAt": "2024-10-29T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/bookings/my-bookings?status=confirmed" \
  -H "Authorization: Bearer your_token_here"
```

---

## Payments

### 19. Create Payment

**Endpoint:** `POST /payments`  
**Access:** Private (Patient)  
**Description:** Create a payment for booking

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "bookingId": 1,
  "amount": 500000,
  "currency": "INR",
  "paymentMethod": "card",
  "cardDetails": {
    "number": "4111111111111111",
    "expMonth": "12",
    "expYear": "2025",
    "cvv": "123"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "id": 1,
    "transactionId": "TXN-2024-001",
    "bookingId": 1,
    "amount": 500000,
    "currency": "INR",
    "status": "success",
    "paymentMethod": "card",
    "createdAt": "2024-10-29T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/payments \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1,
    "amount": 500000,
    "paymentMethod": "card"
  }'
```

---

## Translation

### 20. Translate Text

**Endpoint:** `POST /translation/translate`  
**Access:** Private  
**Description:** Translate text to target language

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "नमस्ते, मैं डॉक्टर हूं",
  "targetLanguage": "en",
  "sourceLanguage": "hi"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "originalText": "नमस्ते, मैं डॉक्टर हूं",
    "translatedText": "Hello, I am a doctor",
    "sourceLanguage": "hi",
    "targetLanguage": "en",
    "isTranslated": true
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/translation/translate \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "नमस्ते, मैं डॉक्टर हूं",
    "targetLanguage": "en"
  }'
```

---

## Media Management

### 21. Upload File

**Endpoint:** `POST /media/upload`  
**Access:** Private  
**Description:** Upload file to ImageKit

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload
- `folder`: Target folder (optional)
- `tags`: Comma-separated tags (optional)

**Success Response (201):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileId": "abc123xyz",
    "name": "hospital-image.jpg",
    "url": "https://ik.imagekit.io/medivoy/hospitals/hospital-image.jpg",
    "thumbnailUrl": "https://ik.imagekit.io/medivoy/hospitals/tr:n-media_library_thumbnail/hospital-image.jpg",
    "size": 245678,
    "width": 1920,
    "height": 1080
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/media/upload \
  -H "Authorization: Bearer your_token_here" \
  -F "file=@/path/to/image.jpg" \
  -F "folder=/medivoy/hospitals" \
  -F "tags=hospital,profile"
```

---

## Analytics

### 22. Get Dashboard Statistics

**Endpoint:** `GET /analytics/dashboard`  
**Access:** Private (Admin)  
**Description:** Get dashboard statistics

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 15000,
    "totalPatients": 12000,
    "totalDoctors": 500,
    "totalHospitals": 150,
    "totalBookings": 8500,
    "totalRevenue": 425000000,
    "activeBookings": 450,
    "completedBookings": 7800,
    "cancelledBookings": 250,
    "averageRating": 4.7,
    "recentBookings": [],
    "topHospitals": [],
    "topDoctors": [],
    "revenueByMonth": []
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/v1/analytics/dashboard \
  -H "Authorization: Bearer your_admin_token_here"
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development)"
}
```

---

## Rate Limits

- **Public endpoints:** 100 requests per 15 minutes per IP
- **Authenticated endpoints:** 1000 requests per 15 minutes per user
- **Admin endpoints:** 5000 requests per 15 minutes per admin

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens expire after 24 hours. Use the refresh token endpoint to get a new token.

---

## Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Filtering & Sorting

Most list endpoints support filtering and sorting:

**Filtering:**
- Use query parameters matching field names
- Example: `?city=Mumbai&rating=4.5`

**Sorting:**
- `sortBy`: Field to sort by
- `order`: `asc` or `desc`
- Example: `?sortBy=createdAt&order=desc`

---

## Postman Collection

Import the Postman collection for easy testing:

[Download Postman Collection](./Medivoy_API_Collection.json)

---

**Note:** This documentation covers the main endpoints. For complete documentation of all 126+ endpoints, refer to the individual section files or use the interactive API documentation at `/api-docs` when the server is running.
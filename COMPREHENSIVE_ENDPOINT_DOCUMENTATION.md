# 📚 Medivoy Healthcare API - Complete Endpoint Documentation

## 🎯 Overview

This document provides comprehensive documentation for all **287 endpoints** across the Medivoy Healthcare API. Each endpoint includes detailed descriptions, parameters, examples, and error handling.

## 📊 API Statistics

- **Total Endpoints:** 287
- **Categories:** 40
- **Authentication:** JWT Bearer Token required for most endpoints
- **Rate Limiting:** 100-1000 requests per minute based on user tier

## 📋 Table of Contents

1. [ANALYTICS](#analytics) (7 endpoints)
2. [APPOINTMENTS](#appointments) (8 endpoints)
3. [AUDITLOGS](#auditLogs) (8 endpoints)
4. [AUTH](#auth) (11 endpoints)
5. [BOOKINGSTATUS](#bookingStatus) (9 endpoints)
6. [BOOKINGS](#bookings) (7 endpoints)
7. [CHAT](#chat) (11 endpoints)
8. [COUPONS](#coupons) (6 endpoints)
9. [DNAKITS](#dnaKits) (10 endpoints)
10. [DOCTORSCHEDULES](#doctorSchedules) (7 endpoints)
11. [DOCTORS](#doctors) (6 endpoints)
12. [FAQS](#faqs) (6 endpoints)
13. [HEALTH](#health) (1 endpoints)
14. [HOSPITALS](#hospitals) (6 endpoints)
15. [INSURANCE](#insurance) (5 endpoints)
16. [INTEGRATIONS](#integrations) (7 endpoints)
17. [INVOICES](#invoices) (5 endpoints)
18. [LABTESTS](#labTests) (5 endpoints)
19. [LABORATORIES](#laboratories) (5 endpoints)
20. [MEDIA](#media) (15 endpoints)
21. [MEDICALRECORDS](#medicalRecords) (5 endpoints)
22. [NOTIFICATIONS](#notifications) (7 endpoints)
23. [PACKAGES](#packages) (5 endpoints)
24. [PATIENTS](#patients) (5 endpoints)
25. [PAYMENTS](#payments) (5 endpoints)
26. [PRESCRIPTIONS](#prescriptions) (5 endpoints)
27. [REVIEWS](#reviews) (6 endpoints)
28. [STAFF](#staff) (8 endpoints)
29. [SUBSCRIPTIONS](#subscriptions) (7 endpoints)
30. [SUPPORT](#support) (6 endpoints)
31. [SYSTEMSETTINGS](#systemSettings) (10 endpoints)
32. [TERMSPRIVACY](#termsPrivacy) (15 endpoints)
33. [TRANSLATION](#translation) (10 endpoints)
34. [TRANSLATIONS](#translations) (6 endpoints)
35. [TREATMENTCATEGORIES](#treatmentCategories) (5 endpoints)
36. [TREATMENTS](#treatments) (7 endpoints)
37. [UPLOADS](#uploads) (7 endpoints)
38. [USERS](#users) (5 endpoints)
39. [VIDEOCALLS](#videoCalls) (11 endpoints)
40. [WEBSITECONTENT](#websiteContent) (7 endpoints)

---

## ANALYTICS

**Business analytics and reporting**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | /dashboard | Get all analytics with pagination | Required |
| GET | /bookings | Get all analytics with pagination | Required |
| GET | /revenue | Get all analytics with pagination | Required |
| GET | /hospitals/top | Get all analytics with pagination | Required |
| GET | /treatments/top | Get all analytics with pagination | Required |
| GET | /patients/demographics | Get all analytics with pagination | Required |
| GET | /doctors | Get all analytics with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/dashboard?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample analytic",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## APPOINTMENTS

**Appointment scheduling and booking**

**Statistics:** 8 endpoints

### 🚀 Features

- ✅ Real-time availability checking
- ✅ Multiple booking types
- ✅ Automated reminders
- ✅ Cancellation and rescheduling
- ✅ Calendar integration
- ✅ Payment processing

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new appointment | Required |
| GET | /:id | Get appointment by ID | Required |
| PUT | /:id | Update appointment | Required |
| PATCH | /:id/status | Partially update appointment | Required |
| GET | / | Get all appointments with pagination | Required |
| GET | /patient/:patientId | Get all appointments with pagination | Required |
| DELETE | /:id | Delete appointment | Required |
| GET | /doctor/:doctorId | Get all appointments with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "patientId": "pat_123",
  "doctorId": "doc_123",
  "hospitalId": "hosp_123",
  "appointmentDate": "2024-01-15T10:00:00Z",
  "duration": 30,
  "appointmentType": "consultation",
  "notes": "Regular checkup"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample appointment",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## AUDITLOGS

**auditLogs management endpoints**

**Statistics:** 8 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | / | Get all auditLogs with pagination | Required |
| POST | / | Create new auditLog | Required |
| GET | /user/:userId | Get all auditLogs with pagination | Required |
| GET | /entity/:entityType/:entityId | Get all auditLogs with pagination | Required |
| GET | /statistics | Get all auditLogs with pagination | Required |
| GET | /security-events | Get all auditLogs with pagination | Required |
| GET | /export | Get all auditLogs with pagination | Required |
| GET | /:id | Get auditLog by ID | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample auditLog",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample auditLog",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## AUTH

**Authentication and authorization endpoints**

**Statistics:** 11 endpoints

### 🚀 Features

- ✅ JWT-based authentication
- ✅ Multi-factor authentication support
- ✅ Role-based access control
- ✅ Password reset functionality
- ✅ Session management
- ✅ Token refresh mechanisms

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /register | Create new aut | None |
| POST | /login | Create new aut | None |
| POST | /logout | Create new aut | Required |
| POST | /refresh | Create new aut | Required |
| GET | /profile | Get all auth with pagination | Required |
| PUT | /profile | PUT /profile | Required |
| PUT | /change-password | PUT /change-password | Required |
| POST | /forgot-password | Create new aut | Required |
| POST | /reset-password | Create new aut | Required |
| POST | /verify-email | Create new aut | Required |
| POST | /resend-verification | Create new aut | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/profile?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/register
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample aut",
  "description": "Sample description",
  "status": "active"
}
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample aut",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## BOOKINGSTATUS

**bookingStatus management endpoints**

**Statistics:** 9 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| PUT | /:id | Update bookingStatu | Required |
| GET | /:id/history | Get bookingStatu by ID | Required |
| PUT | /:id/coordinator | Update bookingStatu | Required |
| GET | /:id/transitions | Get bookingStatu by ID | Required |
| GET | /status/:status | Get all bookingStatus with pagination | Required |
| PUT | /bulk-update | PUT /bulk-update | Required |
| GET | /statistics | Get all bookingStatus with pagination | Required |
| GET | / | Get all bookingStatus with pagination | Required |
| DELETE | /:id | Delete bookingStatu | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/status/:status?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
GET /api/v1/123/history
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample bookingStatu",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## BOOKINGS

**General booking management**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new booking | Required |
| GET | /:id | Get booking by ID | Required |
| PUT | /:id | Update booking | Required |
| PATCH | /:id/status | Partially update booking | Required |
| GET | / | Get all bookings with pagination | Required |
| DELETE | /:id | Delete booking | Required |
| GET | /patient/:patientId | Get all bookings with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample booking",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample booking",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## CHAT

**Real-time chat and messaging**

**Statistics:** 11 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /conversations | Create new cha | Required |
| GET | /conversations/user/:userId | Get all chat with pagination | Required |
| GET | /conversations/:id | Get cha by ID | Required |
| PUT | /conversations/:id/archive | Update cha | Required |
| POST | /messages | Create new cha | Required |
| GET | /messages/conversation/:conversationId | Get all chat with pagination | Required |
| DELETE | /messages/:id | Delete cha | Required |
| PUT | /messages/conversation/:conversationId/read | PUT /messages/conversation/:conversationId/read | Required |
| GET | /unread/:userId | Get all chat with pagination | Required |
| GET | / | Get all chat with pagination | Required |
| GET | /:id | Get cha by ID | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/conversations/user/:userId?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/conversations
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample cha",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/conversations/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample cha",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## COUPONS

**Promotional coupon management**

**Statistics:** 6 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new coupon | Required |
| GET | /:id | Get coupon by ID | Required |
| GET | / | Get all coupons with pagination | Required |
| GET | /validate/:code | Get all coupons with pagination | Required |
| POST | /apply/:code | Create new coupon | Required |
| DELETE | /:id | Delete coupon | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample coupon",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample coupon",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## DNAKITS

**dnaKits management endpoints**

**Statistics:** 10 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | / | Get all dnaKits with pagination | Required |
| POST | / | Create new dnaKit | Required |
| GET | /patient/:patientId | Get all dnaKits with pagination | Required |
| GET | /statistics | Get all dnaKits with pagination | Required |
| GET | /:id | Get dnaKit by ID | Required |
| PUT | /:id | Update dnaKit | Required |
| PUT | /:id/status | Update dnaKit | Required |
| PUT | /:id/results | Update dnaKit | Required |
| PUT | /:id/cancel | Update dnaKit | Required |
| DELETE | /:id | Delete dnaKit | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample dnaKit",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample dnaKit",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## DOCTORSCHEDULES

**doctorSchedules management endpoints**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new doctorSchedule | Required |
| POST | /bulk | Create new doctorSchedule | Required |
| GET | /doctor/:doctorId | Get all doctorSchedules with pagination | Required |
| GET | /doctor/:doctorId/available-slots | Get all doctorSchedules with pagination | Required |
| GET | /:id | Get doctorSchedule by ID | Required |
| PUT | /:id | Update doctorSchedule | Required |
| DELETE | /:id | Delete doctorSchedule | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/doctor/:doctorId?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample doctorSchedule",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample doctorSchedule",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## DOCTORS

**Healthcare provider management**

**Statistics:** 6 endpoints

### 🚀 Features

- ✅ Professional profile management
- ✅ Specialization tracking
- ✅ Schedule management
- ✅ Performance analytics
- ✅ License verification
- ✅ Multi-hospital affiliation

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new doctor | Required |
| GET | /:id | Get doctor by ID | Required |
| PUT | /:id | Update doctor | Required |
| DELETE | /:id | Delete doctor | Required |
| GET | / | Get all doctors with pagination | Required |
| PATCH | /:id/verify | Partially update doctor | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "firstName": "Dr. Sarah",
  "lastName": "Smith",
  "email": "sarah.smith@hospital.com",
  "phone": "+1234567890",
  "specialization": "Cardiology",
  "licenseNumber": "MD123456",
  "experience": "10 years",
  "hospitalId": "hosp_123"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample doctor",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## FAQS

**faqs management endpoints**

**Statistics:** 6 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new faq | Required |
| GET | /:id | Get faq by ID | Required |
| GET | / | Get all faqs with pagination | Required |
| GET | /category/:category | Get all faqs with pagination | Required |
| PUT | /:id | Update faq | Required |
| DELETE | /:id | Delete faq | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample faq",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample faq",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## HEALTH

**System health monitoring**

**Statistics:** 1 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | / | Get all health with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample healt",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## HOSPITALS

**Hospital and facility management**

**Statistics:** 6 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new hospital | Required |
| GET | /:id | Get hospital by ID | Required |
| PUT | /:id | Update hospital | Required |
| DELETE | /:id | Delete hospital | Required |
| GET | / | Get all hospitals with pagination | Required |
| PATCH | /:id/verify | Partially update hospital | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample hospital",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample hospital",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## INSURANCE

**Insurance verification and claims**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new insuranc | Required |
| GET | /:id | Get insuranc by ID | Required |
| PUT | /:id | Update insuranc | Required |
| DELETE | /:id | Delete insuranc | Required |
| GET | / | Get all insurance with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample insuranc",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample insuranc",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## INTEGRATIONS

**Third-party integrations**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | / | Get all integrations with pagination | Required |
| POST | / | Create new integration | Required |
| GET | /:id | Get integration by ID | Required |
| PUT | /:id | Update integration | Required |
| DELETE | /:id | Delete integration | Required |
| POST | /:id/test | POST /:id/test | Required |
| POST | /:id/sync | POST /:id/sync | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample integration",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample integration",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## INVOICES

**Invoice generation and billing**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new invoice | Required |
| GET | /:id | Get invoice by ID | Required |
| PUT | /:id | Update invoice | Required |
| DELETE | /:id | Delete invoice | Required |
| GET | / | Get all invoices with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample invoice",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample invoice",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## LABTESTS

**labTests management endpoints**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new labTest | Required |
| GET | /:id | Get labTest by ID | Required |
| PUT | /:id | Update labTest | Required |
| DELETE | /:id | Delete labTest | Required |
| GET | / | Get all labTests with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample labTest",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample labTest",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## LABORATORIES

**Laboratory services and results**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new laboratorie | Required |
| GET | /:id | Get laboratorie by ID | Required |
| PUT | /:id | Update laboratorie | Required |
| DELETE | /:id | Delete laboratorie | Required |
| GET | / | Get all laboratories with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample laboratorie",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample laboratorie",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## MEDIA

**media management endpoints**

**Statistics:** 15 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /upload | Create new medi | Required |
| POST | /upload-multiple | Create new medi | Required |
| DELETE | /:fileId | DELETE /:fileId | Required |
| POST | /delete-multiple | Create new medi | Required |
| GET | /:fileId | Get all media with pagination | Required |
| GET | / | Get all media with pagination | Required |
| PUT | /:fileId | PUT /:fileId | Required |
| POST | /transform | Create new medi | Required |
| POST | /thumbnail | Create new medi | Required |
| POST | /optimize | Create new medi | Required |
| POST | /purge-cache | Create new medi | Required |
| GET | /auth/params | Get all media with pagination | Required |
| POST | /folder | Create new medi | Required |
| DELETE | /folder | DELETE /folder | Required |
| GET | /:id | Get medi by ID | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/:fileId?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/upload
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample medi",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample medi",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## MEDICALRECORDS

**medicalRecords management endpoints**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new medicalRecord | Required |
| GET | /:id | Get medicalRecord by ID | Required |
| PUT | /:id | Update medicalRecord | Required |
| DELETE | /:id | Delete medicalRecord | Required |
| GET | /patient/:patientId | Get all medicalRecords with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/patient/:patientId?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample medicalRecord",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample medicalRecord",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## NOTIFICATIONS

**Notification and messaging system**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new notification | Required |
| GET | /:id | Get notification by ID | Required |
| PUT | /:id | Update notification | Required |
| DELETE | /:id | Delete notification | Required |
| GET | /user/:userId | Get all notifications with pagination | Required |
| GET | / | Get all notifications with pagination | Required |
| PATCH | /:id/read | Partially update notification | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/user/:userId?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample notification",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample notification",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## PACKAGES

**Service package management**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new package | Required |
| GET | /:id | Get package by ID | Required |
| PUT | /:id | Update package | Required |
| DELETE | /:id | Delete package | Required |
| GET | / | Get all packages with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample package",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample package",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## PATIENTS

**Patient management and medical records**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ Complete patient profiles
- ✅ Medical history tracking
- ✅ Appointment integration
- ✅ Privacy compliance (HIPAA)
- ✅ Emergency contact management
- ✅ Insurance information

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new patient | Required |
| GET | /:id | Get patient by ID | Required |
| PUT | /:id | Update patient | Required |
| DELETE | /:id | Delete patient | Required |
| GET | / | Get all patients with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample patient",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## PAYMENTS

**Payment processing and billing**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new payment | Required |
| GET | /:id | Get payment by ID | Required |
| PUT | /:id | Update payment | Required |
| DELETE | /:id | Delete payment | Required |
| GET | / | Get all payments with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample payment",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample payment",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## PRESCRIPTIONS

**Medical prescription management**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new prescription | Required |
| GET | /:id | Get prescription by ID | Required |
| PUT | /:id | Update prescription | Required |
| DELETE | /:id | Delete prescription | Required |
| GET | /patient/:patientId | Get all prescriptions with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/patient/:patientId?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample prescription",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample prescription",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## REVIEWS

**Patient reviews and ratings**

**Statistics:** 6 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new review | Required |
| GET | /:id | Get review by ID | Required |
| PUT | /:id | Update review | Required |
| DELETE | /:id | Delete review | Required |
| GET | / | Get all reviews with pagination | Required |
| PATCH | /:id/verify | Partially update review | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample review",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample review",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## STAFF

**Staff management and operations**

**Statistics:** 8 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | / | Get all staff with pagination | Required |
| POST | / | Create new staf | Required |
| GET | /hospital/:hospitalId | Get all staff with pagination | Required |
| GET | /:id | Get staf by ID | Required |
| PUT | /:id | Update staf | Required |
| DELETE | /:id | Delete staf | Required |
| GET | /:id/performance | Get staf by ID | Required |
| PUT | /:id/permissions | Update staf | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample staf",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample staf",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## SUBSCRIPTIONS

**Subscription management**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new subscription | Required |
| GET | /:id | Get subscription by ID | Required |
| PUT | /:id | Update subscription | Required |
| PATCH | /:id/cancel | Partially update subscription | Required |
| DELETE | /:id | Delete subscription | Required |
| GET | / | Get all subscriptions with pagination | Required |
| GET | /user/:userId | Get all subscriptions with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample subscription",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample subscription",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## SUPPORT

**Customer support and helpdesk**

**Statistics:** 6 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new suppor | Required |
| GET | /:id | Get suppor by ID | Required |
| PUT | /:id | Update suppor | Required |
| DELETE | /:id | Delete suppor | Required |
| GET | /:id | Get suppor by ID | Required |
| GET | / | Get all support with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample suppor",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample suppor",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## SYSTEMSETTINGS

**systemSettings management endpoints**

**Statistics:** 10 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | / | Get all systemSettings with pagination | Required |
| GET | /public | Get all systemSettings with pagination | Required |
| GET | /category/:category | Get all systemSettings with pagination | Required |
| GET | /key/:key | Get all systemSettings with pagination | Required |
| POST | / | Create new systemSetting | Required |
| PUT | /key/:key | PUT /key/:key | Required |
| DELETE | /key/:key | DELETE /key/:key | Required |
| PUT | /bulk | PUT /bulk | Required |
| PUT | /key/:key/reset | PUT /key/:key/reset | Required |
| GET | /:id | Get systemSetting by ID | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample systemSetting",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample systemSetting",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## TERMSPRIVACY

**termsPrivacy management endpoints**

**Statistics:** 15 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | /terms | Get all termsPrivacy with pagination | Required |
| GET | /terms/active | Get all termsPrivacy with pagination | Required |
| POST | /terms | Create new termsPrivac | Required |
| PUT | /terms/:id | Update termsPrivac | Required |
| PUT | /terms/:id/publish | Update termsPrivac | Required |
| GET | /privacy | Get all termsPrivacy with pagination | Required |
| GET | /privacy/active | Get all termsPrivacy with pagination | Required |
| POST | /privacy | Create new termsPrivac | Required |
| PUT | /privacy/:id | Update termsPrivac | Required |
| PUT | /privacy/:id/publish | Update termsPrivac | Required |
| POST | /acceptance | Create new termsPrivac | Required |
| GET | /acceptance/user/:userId | Get all termsPrivacy with pagination | Required |
| GET | /acceptance/check/:userId | Get all termsPrivacy with pagination | Required |
| GET | /:id | Get termsPrivac by ID | Required |
| DELETE | /:id | Delete termsPrivac | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/terms?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/terms
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample termsPrivac",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample termsPrivac",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## TRANSLATION

**translation management endpoints**

**Statistics:** 10 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /translate | Create new translatio | Required |
| POST | /translate-batch | Create new translatio | Required |
| POST | /detect | Create new translatio | Required |
| GET | /languages | Get all translation with pagination | Required |
| POST | /queue | Create new translatio | Required |
| GET | /job/:jobId | Get all translation with pagination | Required |
| DELETE | /job/:jobId | DELETE /job/:jobId | Required |
| GET | /queue/stats | Get all translation with pagination | Required |
| POST | /queue/clean-completed | Create new translatio | Required |
| POST | /queue/clean-failed | Create new translatio | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/languages?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/translate
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample translatio",
  "description": "Sample description",
  "status": "active"
}
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample translatio",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## TRANSLATIONS

**translations management endpoints**

**Statistics:** 6 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new translation | Required |
| GET | /:id | Get translation by ID | Required |
| PUT | /:id | Update translation | Required |
| DELETE | /:id | Delete translation | Required |
| GET | / | Get all translations with pagination | Required |
| GET | /:key/:language | Get all translations with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample translation",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample translation",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## TREATMENTCATEGORIES

**treatmentCategories management endpoints**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new treatmentCategorie | Required |
| GET | /:id | Get treatmentCategorie by ID | Required |
| PUT | /:id | Update treatmentCategorie | Required |
| DELETE | /:id | Delete treatmentCategorie | Required |
| GET | / | Get all treatmentCategories with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample treatmentCategorie",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample treatmentCategorie",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## TREATMENTS

**treatments management endpoints**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new treatment | Required |
| GET | /:id | Get treatment by ID | Required |
| PUT | /:id | Update treatment | Required |
| DELETE | /:id | Delete treatment | Required |
| GET | / | Get all treatments with pagination | Required |
| GET | /category/:categoryId | Get all treatments with pagination | Required |
| GET | /subcategory/:subcategoryId | Get all treatments with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample treatment",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample treatment",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## UPLOADS

**File upload and media management**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new upload | Required |
| GET | /:id | Get upload by ID | Required |
| PUT | /:id | Update upload | Required |
| DELETE | /:id | Delete upload | Required |
| GET | / | Get all uploads with pagination | Required |
| GET | /:id | Get upload by ID | Required |
| GET | /entity/:entityType/:entityId | Get all uploads with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample upload",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample upload",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## USERS

**User account management**

**Statistics:** 5 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new user | Required |
| GET | /:id | Get user by ID | Required |
| PUT | /:id | Update user | Required |
| DELETE | /:id | Delete user | Required |
| GET | / | Get all users with pagination | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample user",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample user",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## VIDEOCALLS

**videoCalls management endpoints**

**Statistics:** 11 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new videoCall | Required |
| POST | /:id/join | POST /:id/join | Required |
| PUT | /:id/start | Update videoCall | Required |
| PUT | /:id/end | Update videoCall | Required |
| PUT | /:id/cancel | Update videoCall | Required |
| PUT | /:id/recording | Update videoCall | Required |
| GET | /user/:userId/history | Get all videoCalls with pagination | Required |
| GET | /user/:userId/upcoming | Get all videoCalls with pagination | Required |
| GET | /:id | Get videoCall by ID | Required |
| GET | / | Get all videoCalls with pagination | Required |
| DELETE | /:id | Delete videoCall | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/user/:userId/history?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample videoCall",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample videoCall",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---

## WEBSITECONTENT

**websiteContent management endpoints**

**Statistics:** 7 endpoints

### 🚀 Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Performance optimization

### 📋 Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | / | Create new websiteConten | Required |
| GET | /:id | Get websiteConten by ID | Required |
| GET | /slug/:slug | Get all websiteContent with pagination | Required |
| PUT | /:id | Update websiteConten | Required |
| DELETE | /:id | Delete websiteConten | Required |
| GET | / | Get all websiteContent with pagination | Required |
| GET | /:id | Get websiteConten by ID | Required |

### 🔐 Authentication & Authorization

Most endpoints in this category require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- `patient` - Can access own data
- `doctor` - Can access assigned patient data
- `admin` - Full system access
- `hospital` - Hospital-specific access

### 📡 Example Requests

```http
GET /api/v1/slug/:slug?page=1&limit=10&search=keyword
Authorization: Bearer <your-jwt-token>
```

```http
POST /api/v1/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Sample websiteConten",
  "description": "Sample description",
  "status": "active"
}
```

```http
GET /api/v1/123
Authorization: Bearer <your-jwt-token>
```

### 📤 Example Responses

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Sample websiteConten",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Resource retrieved successfully"
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Specific validation error"
      }
    ],
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - No authentication token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_SERVER_ERROR` - Unexpected server error

---


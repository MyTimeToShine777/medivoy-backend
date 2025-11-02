# Medivoy Backend API - Complete Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  
**Last Updated:** 2024-10-30

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Getting Started](#getting-started)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Postman Collection](#postman-collection)

---

## Overview

The Medivoy Backend API is a comprehensive healthcare management system providing endpoints for:

- **Patient Management** - Patient records, medical history, appointments
- **Doctor Management** - Doctor profiles, schedules, specializations
- **Hospital Management** - Hospital information, departments, facilities
- **Appointment System** - Booking, scheduling, status tracking
- **Medical Records** - Patient records, prescriptions, lab tests
- **Billing & Payments** - Invoices, payments, insurance claims
- **Communication** - Chat, video calls, notifications
- **Analytics** - Dashboard metrics, reports, insights

**Total Endpoints:** 287 across 40 categories

---

## Authentication

### Authentication Flow

The API uses JWT (JSON Web Token) based authentication.

#### 1. Register a New User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 2. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "patient"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 3. Using Access Token

Include the access token in the Authorization header for all protected endpoints:

```http
GET /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Refresh Token

When the access token expires, use the refresh token to get a new one:

```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Getting Started

### Prerequisites

- Node.js 14+ installed
- PostgreSQL database (optional for testing)
- Redis (optional for caching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MyTimeToShine777/medivoy-backend.git
cd medivoy-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
```

The server will start on `http://localhost:5000`

### Health Check

Test if the server is running:

```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Medivoy Backend API is running",
  "timestamp": "2024-10-30T12:00:00.000Z",
  "uptime": 123.456
}
```

---

## API Endpoints

### Summary by Category

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Authentication | 11 | User registration, login, password reset |
| Users | 5 | User profile management |
| Doctors | 6 | Doctor profiles and management |
| Hospitals | 6 | Hospital information and management |
| Patients | 5 | Patient records and management |
| Appointments | 8 | Appointment booking and scheduling |
| Bookings | 7 | Booking management and status |
| Medical Records | 5 | Patient medical history |
| Prescriptions | 5 | Prescription management |
| Lab Tests | 5 | Laboratory test orders |
| Laboratories | 5 | Laboratory management |
| DNA Kits | 10 | DNA kit orders and results |
| Payments | 5 | Payment processing |
| Invoices | 5 | Invoice generation and management |
| Insurance | 5 | Insurance claims and verification |
| Subscriptions | 7 | Subscription plans and management |
| Packages | 5 | Healthcare packages |
| Coupons | 6 | Discount coupons and validation |
| Reviews | 6 | Doctor and service reviews |
| Notifications | 7 | User notifications |
| Chat | 11 | Real-time messaging |
| Video Calls | 11 | Video consultation |
| Support | 6 | Customer support tickets |
| FAQs | 6 | Frequently asked questions |
| Media | 15 | File uploads and media management |
| Analytics | 7 | Dashboard and reports |
| System Settings | 10 | Application configuration |
| Terms & Privacy | 15 | Legal documents |
| Website Content | 7 | CMS content management |
| Treatments | 7 | Treatment information |
| Treatment Categories | 5 | Treatment categorization |
| Doctor Schedules | 7 | Doctor availability |
| Integrations | 7 | Third-party integrations |
| Audit Logs | 8 | System audit trail |
| Staff | 8 | Staff management |
| Translations | 6 | Multi-language support |
| Uploads | 7 | File upload handling |

### Detailed Endpoint Documentation

For complete endpoint details, see:
- [API_ENDPOINTS_COMPLETE.md](./API_ENDPOINTS_COMPLETE.md) - Full endpoint list with descriptions
- [Medivoy_API_Postman_Collection.json](./Medivoy_API_Postman_Collection.json) - Postman collection for testing

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Server error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

### Example Error Responses

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

**Authentication Error:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default Limit:** 100 requests per 15 minutes per IP
- **Authenticated Users:** Higher limits based on subscription tier

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635724800
```

When rate limit is exceeded:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
  }
}
```

---

## Postman Collection

### Import Instructions

1. Download `Medivoy_API_Postman_Collection.json`
2. Open Postman
3. Click "Import" button
4. Select the downloaded file
5. The collection will be imported with all 287 endpoints organized by category

### Collection Features

- **Pre-configured requests** for all 287 endpoints
- **Environment variables** for base URL and tokens
- **Sample request bodies** for POST/PUT/PATCH requests
- **Organized folders** by category (40 folders)
- **Bearer token authentication** pre-configured

### Using the Collection

1. **Set Environment Variables:**
   - `base_url`: `http://localhost:5000/api/v1`
   - `access_token`: Your JWT token (obtained from login)

2. **Login First:**
   - Navigate to `Authentication` folder
   - Run the `Login` request
   - Copy the `accessToken` from response
   - Set it as `access_token` environment variable

3. **Test Endpoints:**
   - All requests will automatically use the token
   - Customize request bodies as needed
   - Check responses for success/error

---

## Additional Resources

- **GitHub Repository:** https://github.com/MyTimeToShine777/medivoy-backend
- **API Endpoint List:** [API_ENDPOINTS_COMPLETE.md](./API_ENDPOINTS_COMPLETE.md)
- **Postman Collection:** [Medivoy_API_Postman_Collection.json](./Medivoy_API_Postman_Collection.json)
- **Deployment Guide:** [BEGINNER_FRIENDLY_DEPLOYMENT_GUIDE.md](./BEGINNER_FRIENDLY_DEPLOYMENT_GUIDE.md)

---

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Contact: support@medivoy.com
- Documentation: https://docs.medivoy.com

---

**Last Updated:** 2024-10-30  
**API Version:** 1.0.0  
**Total Endpoints:** 287
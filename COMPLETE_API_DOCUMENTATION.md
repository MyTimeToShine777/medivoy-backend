# 🏥 Medivoy Healthcare API - Complete Documentation

> **📚 Comprehensive API Reference for All 288 Endpoints**

---

## 📋 **Table of Contents**

1. [🔐 **Authentication Endpoints**](#authentication-endpoints)
2. [👥 **User Management**](#user-management)
3. [🏥 **Healthcare Core**](#healthcare-core)
4. [💰 **Business Operations**](#business-operations)
5. [🔧 **System Management**](#system-management)
6. [📊 **API Examples**](#api-examples)

---

## 🔐 **Authentication Endpoints**

### **POST /api/v1/auth/register**
Register a new user account.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "role": "patient"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 123,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **POST /api/v1/auth/login**
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 123,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👥 **User Management**

### **GET /api/v1/users**
Get all users (admin only).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "patient",
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalUsers": 100
    }
  }
}
```

---

## 🏥 **Healthcare Core**

### **Patients**

#### **GET /api/v1/patients**
Get all patients with pagination and search.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for patient names

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 1,
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "dateOfBirth": "1990-01-15",
        "bloodType": "O+",
        "gender": "male",
        "emergencyContactName": "Jane Doe",
        "emergencyContactPhone": "+1234567891"
      }
    ]
  }
}
```

#### **POST /api/v1/patients**
Create a new patient profile.

**Request:**
```json
{
  "userId": 456,
  "dateOfBirth": "1990-01-15",
  "bloodType": "O+",
  "gender": "male",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567891",
  "allergies": ["Penicillin"],
  "currentMedications": ["Lisinopril 10mg"]
}
```

### **Doctors**

#### **GET /api/v1/doctors**
Get all doctors with filters.

**Query Parameters:**
- `specialization`: Filter by doctor specialization
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": 1,
        "user": {
          "firstName": "Dr. Sarah",
          "lastName": "Smith",
          "email": "sarah@hospital.com"
        },
        "specialization": "Cardiologist",
        "licenseNumber": "MD123456",
        "yearsExperience": 15,
        "consultationFee": 150.00,
        "availableDays": ["Monday", "Wednesday", "Friday"],
        "rating": 4.8,
        "totalReviews": 127
      }
    ]
  }
}
```

#### **GET /api/v1/doctors/:id/availability**
Get doctor availability for specific date.

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": {
    "doctorId": 123,
    "date": "2024-01-15",
    "availableSlots": [
      {
        "time": "09:00 AM",
        "available": true
      },
      {
        "time": "09:30 AM",
        "available": true
      },
      {
        "time": "10:00 AM",
        "available": false
      }
    ]
  }
}
```

### **Appointments**

#### **GET /api/v1/appointments**
Get appointments with filters.

**Query Parameters:**
- `status`: Filter by status (scheduled, confirmed, cancelled, completed)
- `patientId`: Filter by patient
- `doctorId`: Filter by doctor
- `date`: Filter by date

**Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": 1001,
        "patient": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "doctor": {
          "firstName": "Dr. Sarah",
          "lastName": "Smith",
          "specialization": "Cardiologist"
        },
        "hospital": {
          "name": "City General Hospital",
          "address": "123 Main St"
        },
        "appointmentDate": "2024-01-15T10:00:00Z",
        "status": "confirmed",
        "consultationFee": 150.00
      }
    ]
  }
}
```

#### **POST /api/v1/appointments**
Book a new appointment.

**Request:**
```json
{
  "patientId": 123,
  "doctorId": 456,
  "hospitalId": 789,
  "appointmentDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T10:30:00Z",
  "reason": "Annual checkup",
  "notes": "Patient has mild chest discomfort",
  "consultationFee": 150.00
}
```

---

## 💰 **Business Operations**

### **Payments**

#### **POST /api/v1/payments/process**
Process a payment for appointment.

**Request:**
```json
{
  "appointmentId": 1001,
  "amount": 150.00,
  "paymentMethod": "credit_card",
  "cardDetails": {
    "number": "4242424242424242",
    "expiry": "12/25",
    "cvv": "123",
    "holderName": "John Doe"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "paymentId": "PAY-2024-1001",
    "transactionId": "txn_3O9fX72eZvKYlo2C0TmOxJ2z",
    "amount": 150.00,
    "currency": "USD",
    "status": "completed",
    "paidAt": "2024-01-15T10:05:00Z"
  }
}
```

### **Invoices**

#### **GET /api/v1/invoices**
Get all invoices.

**Response:**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": 1,
        "invoiceNumber": "INV-2024-1001",
        "patient": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "amount": 150.00,
        "status": "paid",
        "dueDate": "2024-02-15T00:00:00Z",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

## 🔧 **System Management**

### **Health Check**

#### **GET /health**
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

### **Analytics**

#### **GET /api/v1/analytics/dashboard**
Get dashboard analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "appointments": 25,
      "revenue": 3750.00
    },
    "week": {
      "appointments": 150,
      "revenue": 22500.00
    },
    "month": {
      "appointments": 600,
      "revenue": 90000.00
    },
    "live": {
      "activePatients": 45,
      "onlineDoctors": 12
    }
  }
}
```

---

## 📊 **API Examples**

### **Complete Patient Flow**

#### **1. Register and Login**
```bash
# Register patient
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "role": "patient"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

#### **2. Create Patient Profile**
```bash
curl -X POST http://localhost:3000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": 1,
    "dateOfBirth": "1990-01-15",
    "bloodType": "O+",
    "gender": "male",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1234567891"
  }'
```

#### **3. Book Appointment**
```bash
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "patientId": 1,
    "doctorId": 1,
    "hospitalId": 1,
    "appointmentDate": "2024-01-15T10:00:00Z",
    "reason": "Annual checkup",
    "consultationFee": 150.00
  }'
```

### **Error Handling Examples**

#### **Authentication Error**
```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "error": "Unauthorized"
}
```

#### **Validation Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

#### **Not Found Error**
```json
{
  "success": false,
  "message": "Patient not found",
  "error": "Not Found"
}
```

---

## 🔗 **Interactive Documentation**

**Live Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

- **Interactive Testing** - Try any endpoint directly
- **Real-time Examples** - See request/response formats
- **Authentication Setup** - Configure JWT tokens
- **Error Documentation** - View all possible errors

---

## 📱 **Postman Collection**

Import the provided `ENHANCED_POSTMAN_COLLECTION.json` file to get:

- **All 288 endpoints** pre-configured
- **Authentication flows** set up
- **Example requests** for each endpoint
- **Environment variables** for easy testing

---

## 🎯 **Quick Start**

1. **Start Server:** `npm start`
2. **Open Documentation:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
3. **Test Health:** `curl http://localhost:3000/health`
4. **Register User:** Use auth endpoints to create account
5. **Explore API:** Try any endpoint from the documentation

---

## 📞 **Support**

For questions or issues:

1. **Check the Beginner Guide** - Comprehensive setup instructions
2. **Review Swagger Docs** - Interactive API documentation
3. **Test with Examples** - Use provided cURL commands
4. **Check Logs** - Review application logs for errors

---

*Last Updated:* January 2024  
*Version:* 1.0.0
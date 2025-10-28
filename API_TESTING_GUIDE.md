# API Testing Guide - Medivoy Healthcare Backend

This guide provides ready-to-use curl commands and Postman examples for testing all available API endpoints.

---

## 🔧 Setup

### Base URL
```
http://localhost:5000/api/v1
```

### Environment Variables
Create these variables in Postman or export them in your terminal:
```bash
export BASE_URL="http://localhost:5000/api/v1"
export TOKEN="your_jwt_token_here"
```

---

## 🔐 Authentication Endpoints

### 1. Register User
```bash
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Password123!",
    "first_name": "John",
    "last_name": "Doe",
    "role": "patient",
    "phone": "+1234567890"
  }'
```

### 2. Login
```bash
curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Password123!"
  }'
```

**Save the returned token for subsequent requests!**

### 3. Get Profile
```bash
curl -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update Profile
```bash
curl -X PUT $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "phone": "+9876543210"
  }'
```

### 5. Change Password
```bash
curl -X POST $BASE_URL/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "Password123!",
    "new_password": "NewPassword123!"
  }'
```

### 6. Forgot Password
```bash
curl -X POST $BASE_URL/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com"
  }'
```

### 7. Refresh Token
```bash
curl -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your_refresh_token"
  }'
```

### 8. Logout
```bash
curl -X POST $BASE_URL/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

## 👥 User Management

### 1. Get All Users (Admin Only)
```bash
curl -X GET "$BASE_URL/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Get User by ID
```bash
curl -X GET $BASE_URL/users/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Create User (Admin Only)
```bash
curl -X POST $BASE_URL/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Password123!",
    "first_name": "New",
    "last_name": "User",
    "role": "patient"
  }'
```

### 4. Update User
```bash
curl -X PUT $BASE_URL/users/USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated",
    "last_name": "Name"
  }'
```

### 5. Update User Status (Admin Only)
```bash
curl -X PATCH $BASE_URL/users/USER_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

### 6. Delete User (Admin Only)
```bash
curl -X DELETE $BASE_URL/users/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏥 Hospital Management

### 1. Get All Hospitals
```bash
curl -X GET "$BASE_URL/hospitals?page=1&limit=10" \
  -H "Content-Type: application/json"
```

### 2. Get Hospital by ID
```bash
curl -X GET $BASE_URL/hospitals/HOSPITAL_ID
```

### 3. Create Hospital
```bash
curl -X POST $BASE_URL/hospitals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "City General Hospital",
    "description": "Leading healthcare provider",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postal_code": "10001",
    "phone": "+1234567890",
    "email": "info@cityhospital.com",
    "website": "https://cityhospital.com"
  }'
```

### 4. Update Hospital
```bash
curl -X PUT $BASE_URL/hospitals/HOSPITAL_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Hospital Name",
    "description": "Updated description"
  }'
```

### 5. Add Doctor to Hospital
```bash
curl -X POST $BASE_URL/hospitals/HOSPITAL_ID/doctors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "DOCTOR_ID"
  }'
```

### 6. Add Treatment to Hospital
```bash
curl -X POST $BASE_URL/hospitals/HOSPITAL_ID/treatments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "treatmentId": "TREATMENT_ID"
  }'
```

### 7. Verify Hospital (Admin Only)
```bash
curl -X POST $BASE_URL/hospitals/HOSPITAL_ID/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verification_notes": "All documents verified"
  }'
```

---

## 👨‍⚕️ Doctor Management

### 1. Get All Doctors
```bash
curl -X GET "$BASE_URL/doctors?page=1&limit=10&specialty=Cardiology"
```

### 2. Get Doctor by ID
```bash
curl -X GET $BASE_URL/doctors/DOCTOR_ID
```

### 3. Create Doctor (Admin Only)
```bash
curl -X POST $BASE_URL/doctors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_ID",
    "specialty": "Cardiology",
    "license_number": "LIC123456",
    "years_of_experience": 10,
    "education": "MD from Harvard Medical School",
    "bio": "Experienced cardiologist"
  }'
```

### 4. Update Doctor Availability
```bash
curl -X PUT $BASE_URL/doctors/DOCTOR_ID/availability \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": {
      "monday": ["09:00-12:00", "14:00-17:00"],
      "tuesday": ["09:00-12:00", "14:00-17:00"],
      "wednesday": ["09:00-12:00"],
      "thursday": ["09:00-12:00", "14:00-17:00"],
      "friday": ["09:00-12:00"]
    }
  }'
```

### 5. Get Doctor Appointments
```bash
curl -X GET "$BASE_URL/doctors/DOCTOR_ID/appointments?status=confirmed" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🤒 Patient Management

### 1. Get All Patients (Admin/Doctor Only)
```bash
curl -X GET "$BASE_URL/patients?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Create Patient
```bash
curl -X POST $BASE_URL/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_ID",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "blood_group": "O+",
    "allergies": ["Penicillin"],
    "medical_history": "No major illnesses"
  }'
```

### 3. Update Medical History
```bash
curl -X PUT $BASE_URL/patients/PATIENT_ID/medical-history \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medical_history": "Updated medical history",
    "allergies": ["Penicillin", "Peanuts"],
    "current_medications": ["Aspirin"]
  }'
```

### 4. Get Patient Appointments
```bash
curl -X GET $BASE_URL/patients/PATIENT_ID/appointments \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Get Patient Bookings
```bash
curl -X GET $BASE_URL/patients/PATIENT_ID/bookings \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💊 Treatment Management

### 1. Get All Treatments
```bash
curl -X GET "$BASE_URL/treatments?page=1&limit=10"
```

### 2. Get Treatment by ID
```bash
curl -X GET $BASE_URL/treatments/TREATMENT_ID
```

### 3. Create Treatment (Admin Only)
```bash
curl -X POST $BASE_URL/treatments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cardiac Surgery",
    "description": "Advanced cardiac surgical procedures",
    "category_id": "CATEGORY_ID",
    "subcategory_id": "SUBCATEGORY_ID",
    "estimated_cost": 50000,
    "duration_days": 7
  }'
```

### 4. Get Treatments by Category
```bash
curl -X GET $BASE_URL/treatments/category/CATEGORY_ID
```

---

## 📅 Booking Management

### 1. Create Booking
```bash
curl -X POST $BASE_URL/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "PATIENT_ID",
    "hospital_id": "HOSPITAL_ID",
    "treatment_id": "TREATMENT_ID",
    "preferred_date": "2024-12-01",
    "notes": "Urgent case"
  }'
```

### 2. Get All Bookings
```bash
curl -X GET "$BASE_URL/bookings?status=confirmed" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get Booking by ID
```bash
curl -X GET $BASE_URL/bookings/BOOKING_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update Booking Status
```bash
curl -X PATCH $BASE_URL/bookings/BOOKING_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Booking confirmed"
  }'
```

### 5. Cancel Booking
```bash
curl -X POST $BASE_URL/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Patient request"
  }'
```

---

## 🗓️ Appointment Management

### 1. Create Appointment
```bash
curl -X POST $BASE_URL/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "PATIENT_ID",
    "doctor_id": "DOCTOR_ID",
    "appointment_date": "2024-12-01",
    "appointment_time": "10:00",
    "type": "consultation",
    "notes": "Follow-up consultation"
  }'
```

### 2. Get All Appointments
```bash
curl -X GET "$BASE_URL/appointments?status=confirmed" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Update Appointment Status
```bash
curl -X PATCH $BASE_URL/appointments/APPOINTMENT_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "notes": "Consultation started"
  }'
```

### 4. Reschedule Appointment
```bash
curl -X POST $BASE_URL/appointments/APPOINTMENT_ID/reschedule \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newDate": "2024-12-05",
    "newTime": "14:00"
  }'
```

---

## 💳 Payment Management

### 1. Process Stripe Payment
```bash
curl -X POST $BASE_URL/payments/stripe \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "BOOKING_ID",
    "amount": 50000,
    "currency": "USD",
    "payment_method_id": "pm_card_visa"
  }'
```

### 2. Process Razorpay Payment
```bash
curl -X POST $BASE_URL/payments/razorpay \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "BOOKING_ID",
    "amount": 50000,
    "currency": "INR",
    "razorpay_payment_id": "pay_xxxxx"
  }'
```

### 3. Get All Payments (Admin Only)
```bash
curl -X GET "$BASE_URL/payments?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Refund Payment (Admin Only)
```bash
curl -X POST $BASE_URL/payments/PAYMENT_ID/refund \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refundAmount": 50000,
    "reason": "Service not provided"
  }'
```

---

## 📋 Prescription Management

### 1. Create Prescription (Doctor Only)
```bash
curl -X POST $BASE_URL/prescriptions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "PATIENT_ID",
    "doctor_id": "DOCTOR_ID",
    "appointment_id": "APPOINTMENT_ID",
    "medications": [
      {
        "name": "Aspirin",
        "dosage": "100mg",
        "frequency": "Once daily",
        "duration": "30 days"
      }
    ],
    "instructions": "Take with food"
  }'
```

### 2. Get Patient Prescriptions
```bash
curl -X GET $BASE_URL/prescriptions/patient/PATIENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Generate Prescription PDF
```bash
curl -X GET $BASE_URL/prescriptions/PRESCRIPTION_ID/pdf \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⭐ Review Management

### 1. Create Review
```bash
curl -X POST $BASE_URL/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewable_type": "Hospital",
    "reviewable_id": "HOSPITAL_ID",
    "rating": 5,
    "comment": "Excellent service and care",
    "booking_id": "BOOKING_ID"
  }'
```

### 2. Get Entity Reviews
```bash
curl -X GET $BASE_URL/reviews/Hospital/HOSPITAL_ID
```

### 3. Approve Review (Admin Only)
```bash
curl -X POST $BASE_URL/reviews/REVIEW_ID/approve \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔔 Notification Management

### 1. Get User Notifications
```bash
curl -X GET $BASE_URL/notifications \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Mark Notification as Read
```bash
curl -X PATCH $BASE_URL/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Mark All as Read
```bash
curl -X PATCH $BASE_URL/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 File Upload

### 1. Upload Single File
```bash
curl -X POST $BASE_URL/uploads/single \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "folder=medical-records"
```

### 2. Upload Multiple Files
```bash
curl -X POST $BASE_URL/uploads/multiple \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/file1.pdf" \
  -F "files=@/path/to/file2.jpg" \
  -F "folder=documents"
```

### 3. Get All Media
```bash
curl -X GET "$BASE_URL/uploads?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Delete File
```bash
curl -X DELETE $BASE_URL/uploads/MEDIA_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏥 Insurance Management

### 1. Create Insurance
```bash
curl -X POST $BASE_URL/insurance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "PATIENT_ID",
    "provider_name": "Blue Cross",
    "policy_number": "POL123456",
    "coverage_type": "comprehensive",
    "coverage_limit": 100000,
    "expiry_date": "2025-12-31"
  }'
```

### 2. Check Coverage
```bash
curl -X POST $BASE_URL/insurance/INSURANCE_ID/check-coverage \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "treatmentId": "TREATMENT_ID"
  }'
```

---

## 🏥 Health Checks

### 1. API Health Check
```bash
curl -X GET $BASE_URL/health
```

### 2. Database Health Check
```bash
curl -X GET $BASE_URL/health/db
```

---

## 📊 Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Medivoy Healthcare API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 🔍 Testing Workflow

### Complete Testing Flow:

1. **Register a User**
2. **Login** (save the token)
3. **Create a Hospital**
4. **Create a Doctor**
5. **Create a Patient**
6. **Create a Treatment**
7. **Create a Booking**
8. **Create an Appointment**
9. **Process Payment**
10. **Create Prescription**
11. **Add Review**
12. **Upload Files**

---

## 📝 Notes

- Replace `USER_ID`, `HOSPITAL_ID`, `DOCTOR_ID`, etc. with actual IDs from your database
- Save the JWT token from login response for authenticated requests
- Use `$TOKEN` environment variable or replace with actual token
- All timestamps should be in ISO 8601 format
- File uploads require `multipart/form-data` content type

---

## 🎯 Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api/v1"

# Register
echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "first_name": "Test",
    "last_name": "User",
    "role": "patient"
  }')

echo $REGISTER_RESPONSE | jq '.'

# Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

# Get Profile
echo "3. Getting profile..."
curl -s -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo "API testing complete!"
```

Run with: `chmod +x test-api.sh && ./test-api.sh`

---

Happy Testing! 🚀
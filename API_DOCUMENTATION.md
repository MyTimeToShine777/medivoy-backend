# Medivoy Backend API - Complete Documentation

## 🚀 Overview

The Medivoy Backend API is a comprehensive healthcare management system providing 140+ endpoints for managing patients, doctors, hospitals, appointments, bookings, payments, and more.

**Base URL:** `http://localhost:5000/api/v1`  
**API Documentation:** `http://localhost:5000/api-docs`  
**Version:** 1.0.0

---

## 🔐 Authentication

All endpoints (except public endpoints) require JWT authentication.

### Authentication Header:
```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token:
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

---

## 📊 NEW ENDPOINTS (Phases 3, 4, 5)

### Analytics & Dashboard

#### Get Dashboard Statistics
```bash
GET /api/v1/analytics/dashboard
Query Parameters:
  - startDate: string (optional) - Start date for filtering
  - endDate: string (optional) - End date for filtering
  - hospitalId: integer (optional) - Filter by hospital
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 150,
      "totalAppointments": 200,
      "totalPatients": 500,
      "totalDoctors": 50,
      "totalHospitals": 10,
      "totalRevenue": 250000,
      "pendingBookings": 20,
      "completedBookings": 100,
      "cancelledBookings": 10
    },
    "recentBookings": [...],
    "statusDistribution": [...],
    "monthlyRevenue": [...]
  }
}
```

#### Get Booking Analytics
```bash
GET /api/v1/analytics/bookings
Query Parameters:
  - startDate: string (optional)
  - endDate: string (optional)
  - hospitalId: integer (optional)
  - groupBy: string (optional) - day, week, month, year
```

#### Get Revenue Analytics
```bash
GET /api/v1/analytics/revenue
Query Parameters:
  - startDate: string (optional)
  - endDate: string (optional)
  - groupBy: string (optional) - day, week, month, year
```

#### Get Top Hospitals
```bash
GET /api/v1/analytics/hospitals/top
Query Parameters:
  - limit: integer (default: 10)
  - startDate: string (optional)
  - endDate: string (optional)
```

#### Get Top Treatments
```bash
GET /api/v1/analytics/treatments/top
Query Parameters:
  - limit: integer (default: 10)
  - startDate: string (optional)
  - endDate: string (optional)
```

#### Get Patient Demographics
```bash
GET /api/v1/analytics/patients/demographics
```

#### Get Doctor Analytics
```bash
GET /api/v1/analytics/doctors
Query Parameters:
  - doctorId: integer (optional)
  - startDate: string (optional)
  - endDate: string (optional)
```

---

### Doctor Schedules

#### Create Doctor Schedule
```bash
POST /api/v1/doctor-schedules
Content-Type: application/json

{
  "doctor_id": 1,
  "hospital_id": 1,
  "day_of_week": "monday",
  "start_time": "09:00",
  "end_time": "17:00",
  "slot_duration": 30,
  "consultation_type": "both",
  "consultation_fee": 100,
  "currency": "USD"
}
```

#### Get Doctor Schedules
```bash
GET /api/v1/doctor-schedules/doctor/:doctorId
Query Parameters:
  - hospitalId: integer (optional)
  - isActive: boolean (optional)
```

#### Get Available Slots
```bash
GET /api/v1/doctor-schedules/doctor/:doctorId/available-slots
Query Parameters:
  - date: string (required) - YYYY-MM-DD format
  - hospitalId: integer (optional)
  - consultationType: string (optional) - in_person, video
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "schedule_id": 1,
      "hospital_id": 1,
      "consultation_type": "both",
      "consultation_fee": 100,
      "currency": "USD",
      "slots": ["09:00", "09:30", "10:00", "10:30", ...]
    }
  ]
}
```

#### Update Schedule
```bash
PUT /api/v1/doctor-schedules/:id
```

#### Delete Schedule
```bash
DELETE /api/v1/doctor-schedules/:id
```

#### Bulk Create Schedules
```bash
POST /api/v1/doctor-schedules/bulk
Content-Type: application/json

{
  "schedules": [
    { "doctor_id": 1, "day_of_week": "monday", ... },
    { "doctor_id": 1, "day_of_week": "tuesday", ... }
  ]
}
```

---

### Staff Management

#### Get All Staff
```bash
GET /api/v1/staff
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 10)
  - search: string (optional)
  - staffType: string (optional) - coordinator, administrator, support, manager
  - hospitalId: integer (optional)
  - employmentStatus: string (optional) - active, inactive, on_leave, terminated
  - sortBy: string (default: created_at)
  - sortOrder: string (default: DESC)
```

#### Create Staff Member
```bash
POST /api/v1/staff
Content-Type: application/json

{
  "user_id": 1,
  "staff_type": "coordinator",
  "department": "Patient Relations",
  "designation": "Senior Coordinator",
  "hospital_id": 1,
  "date_of_joining": "2025-01-01",
  "employment_status": "active"
}
```

#### Get Staff by ID
```bash
GET /api/v1/staff/:id
```

#### Update Staff
```bash
PUT /api/v1/staff/:id
```

#### Delete Staff
```bash
DELETE /api/v1/staff/:id
```

#### Get Staff Performance
```bash
GET /api/v1/staff/:id/performance
```

#### Update Staff Permissions
```bash
PUT /api/v1/staff/:id/permissions
Content-Type: application/json

{
  "permissions": {
    "can_approve_bookings": true,
    "can_assign_doctors": true,
    "can_view_analytics": true
  }
}
```

#### Get Staff by Hospital
```bash
GET /api/v1/staff/hospital/:hospitalId
Query Parameters:
  - staffType: string (optional)
  - employmentStatus: string (optional)
```

---

### Booking Status Management

#### Update Booking Status
```bash
PUT /api/v1/booking-status/:id
Content-Type: application/json

{
  "status": "accepted",
  "sub_status": "awaiting_payment",
  "reason": "Booking approved by coordinator",
  "notes": "Patient confirmed availability",
  "changed_by": 1,
  "changed_by_type": "staff"
}
```

**Valid Status Transitions:**
- requested → under_review, rejected, cancelled
- under_review → accepted, rejected, cancelled
- accepted → quotation_sent, cancelled
- quotation_sent → payment_details, cancelled
- payment_details → confirmation_sent, cancelled
- confirmation_sent → payment_received, cancelled
- payment_received → confirmation_completed, cancelled
- confirmation_completed → invoice_sent, cancelled
- invoice_sent → travel_arrangements, cancelled
- travel_arrangements → consultation_scheduled, cancelled
- consultation_scheduled → in_progress, cancelled
- in_progress → completed, cancelled
- completed → feedback_received

#### Get Booking Status History
```bash
GET /api/v1/booking-status/:id/history
```

#### Assign Coordinator
```bash
PUT /api/v1/booking-status/:id/coordinator
Content-Type: application/json

{
  "coordinator_id": 5,
  "notes": "Assigned to senior coordinator"
}
```

#### Get Valid Transitions
```bash
GET /api/v1/booking-status/:id/transitions
```

#### Get Bookings by Status
```bash
GET /api/v1/booking-status/status/:status
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 10)
  - hospitalId: integer (optional)
  - coordinatorId: integer (optional)
```

#### Bulk Update Status
```bash
PUT /api/v1/booking-status/bulk-update
Content-Type: application/json

{
  "booking_ids": [1, 2, 3],
  "status": "accepted",
  "reason": "Bulk approval",
  "changed_by": 1,
  "changed_by_type": "admin"
}
```

#### Get Status Statistics
```bash
GET /api/v1/booking-status/statistics
Query Parameters:
  - hospitalId: integer (optional)
  - startDate: string (optional)
  - endDate: string (optional)
```

---

### Chat & Messaging

#### Create Conversation
```bash
POST /api/v1/chat/conversations
Content-Type: application/json

{
  "conversation_type": "patient_doctor",
  "participant_1_id": 1,
  "participant_1_type": "patient",
  "participant_2_id": 2,
  "participant_2_type": "doctor",
  "booking_id": 1,
  "title": "Consultation Discussion"
}
```

#### Get User Conversations
```bash
GET /api/v1/chat/conversations/user/:userId
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 20)
  - isArchived: boolean (default: false)
```

#### Send Message
```bash
POST /api/v1/chat/messages
Content-Type: application/json

{
  "conversation_id": 1,
  "sender_id": 1,
  "sender_type": "patient",
  "message_type": "text",
  "message_content": "Hello, I have a question about my appointment"
}
```

#### Get Conversation Messages
```bash
GET /api/v1/chat/messages/conversation/:conversationId
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 50)
  - before: string (optional) - ISO date for pagination
```

#### Mark Messages as Read
```bash
PUT /api/v1/chat/messages/conversation/:conversationId/read
Content-Type: application/json

{
  "userId": 1
}
```

#### Delete Message
```bash
DELETE /api/v1/chat/messages/:id
Content-Type: application/json

{
  "userId": 1
}
```

#### Archive Conversation
```bash
PUT /api/v1/chat/conversations/:id/archive
Content-Type: application/json

{
  "userId": 1,
  "archive": true
}
```

#### Get Unread Count
```bash
GET /api/v1/chat/unread/:userId
```

---

### Video Calls

#### Initiate Video Call
```bash
POST /api/v1/video-calls
Content-Type: application/json

{
  "appointment_id": 1,
  "host_id": 2,
  "host_type": "doctor",
  "participant_id": 1,
  "participant_type": "patient",
  "call_type": "consultation",
  "scheduled_at": "2025-11-01T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "room_id": "room_1234567890_abc123",
    "host_token": "host_token_...",
    "participant_token": "participant_token_...",
    "joinUrl": "/video-call/room_1234567890_abc123",
    ...
  }
}
```

#### Join Call
```bash
POST /api/v1/video-calls/:id/join
Content-Type: application/json

{
  "userId": 1
}
```

#### Start Call
```bash
PUT /api/v1/video-calls/:id/start
```

#### End Call
```bash
PUT /api/v1/video-calls/:id/end
Content-Type: application/json

{
  "userId": 1,
  "quality_rating": 5,
  "feedback": "Great call quality"
}
```

#### Cancel Call
```bash
PUT /api/v1/video-calls/:id/cancel
Content-Type: application/json

{
  "userId": 1,
  "cancellation_reason": "Patient unavailable"
}
```

#### Get Call History
```bash
GET /api/v1/video-calls/user/:userId/history
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 20)
  - status: string (optional)
  - callType: string (optional)
```

#### Get Upcoming Calls
```bash
GET /api/v1/video-calls/user/:userId/upcoming
Query Parameters:
  - limit: integer (default: 10)
```

---

### Media Management

#### Get All Media
```bash
GET /api/v1/media
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 20)
  - search: string (optional)
  - category: string (optional)
  - type: string (optional)
  - sortBy: string (default: created_at)
  - sortOrder: string (default: DESC)
```

#### Create Media Record
```bash
POST /api/v1/media
Content-Type: application/json

{
  "title": "Hospital Tour Video",
  "description": "Virtual tour of our facilities",
  "file_url": "https://example.com/video.mp4",
  "file_name": "hospital-tour.mp4",
  "file_size": 50000000,
  "file_type": "video",
  "mime_type": "video/mp4",
  "category": "promotional",
  "tags": ["tour", "facilities", "video"],
  "uploaded_by_user_id": 1
}
```

#### Get Media by Category
```bash
GET /api/v1/media/category/:category
```

#### Search Media by Tags
```bash
GET /api/v1/media/search/tags?tags=tour,video,promotional
```

#### Get Media Statistics
```bash
GET /api/v1/media/statistics
```

---

### System Settings

#### Get All Settings
```bash
GET /api/v1/system-settings
Query Parameters:
  - category: string (optional)
  - isPublic: boolean (optional)
```

#### Get Public Settings (No Auth Required)
```bash
GET /api/v1/system-settings/public
```

#### Get Settings by Category
```bash
GET /api/v1/system-settings/category/:category
```

#### Get Setting by Key
```bash
GET /api/v1/system-settings/key/:key
```

#### Create/Update Setting
```bash
POST /api/v1/system-settings
Content-Type: application/json

{
  "setting_key": "site_name",
  "setting_value": "Medivoy Healthcare",
  "setting_type": "string",
  "category": "general",
  "description": "Website name",
  "is_public": true,
  "updated_by": 1
}
```

#### Update Setting Value
```bash
PUT /api/v1/system-settings/key/:key
Content-Type: application/json

{
  "setting_value": "New Value",
  "updated_by": 1
}
```

#### Bulk Update Settings
```bash
PUT /api/v1/system-settings/bulk
Content-Type: application/json

{
  "settings": [
    { "setting_key": "key1", "setting_value": "value1" },
    { "setting_key": "key2", "setting_value": "value2" }
  ],
  "updated_by": 1
}
```

#### Reset to Default
```bash
PUT /api/v1/system-settings/key/:key/reset
Content-Type: application/json

{
  "updated_by": 1
}
```

---

### Terms & Privacy

#### Get All Terms Versions
```bash
GET /api/v1/terms-privacy/terms
Query Parameters:
  - language: string (default: en)
  - isActive: boolean (optional)
  - isPublished: boolean (optional)
```

#### Get Active Terms (No Auth Required)
```bash
GET /api/v1/terms-privacy/terms/active?language=en
```

#### Create Terms
```bash
POST /api/v1/terms-privacy/terms
Content-Type: application/json

{
  "version": "1.0",
  "title": "Terms and Conditions",
  "content": "Full terms content...",
  "language": "en",
  "effective_date": "2025-01-01",
  "summary": "Initial version",
  "created_by": 1
}
```

#### Publish Terms
```bash
PUT /api/v1/terms-privacy/terms/:id/publish
Content-Type: application/json

{
  "published_by": 1
}
```

#### Get Active Privacy Policy (No Auth Required)
```bash
GET /api/v1/terms-privacy/privacy/active?language=en
```

#### Record User Acceptance
```bash
POST /api/v1/terms-privacy/acceptance
Content-Type: application/json

{
  "user_id": 1,
  "document_type": "terms_conditions",
  "document_id": 1,
  "version": "1.0",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

#### Check User Acceptance
```bash
GET /api/v1/terms-privacy/acceptance/check/:userId
Query Parameters:
  - documentType: string (required) - terms_conditions or privacy_policy
  - language: string (default: en)
```

---

### DNA Kits

#### Get All DNA Kit Orders
```bash
GET /api/v1/dna-kits
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 20)
  - search: string (optional)
  - kitType: string (optional)
  - orderStatus: string (optional)
  - paymentStatus: string (optional)
  - patientId: integer (optional)
```

#### Create DNA Kit Order
```bash
POST /api/v1/dna-kits
Content-Type: application/json

{
  "patient_id": 1,
  "kit_type": "health",
  "kit_name": "Comprehensive Health DNA Test",
  "laboratory_id": 1,
  "amount": 299.99,
  "currency": "USD",
  "shipping_address": {
    "street": "123 Main St",
    "city": "Dubai",
    "country": "UAE",
    "postal_code": "12345"
  },
  "consent_given": true
}
```

#### Update Order Status
```bash
PUT /api/v1/dna-kits/:id/status
Content-Type: application/json

{
  "order_status": "shipped",
  "tracking_number": "TRACK123456",
  "shipping_carrier": "DHL"
}
```

#### Upload Test Results
```bash
PUT /api/v1/dna-kits/:id/results
Content-Type: application/json

{
  "test_results": { ... },
  "results_pdf_url": "https://example.com/results.pdf",
  "sample_quality": "excellent"
}
```

#### Cancel Order
```bash
PUT /api/v1/dna-kits/:id/cancel
Content-Type: application/json

{
  "cancellation_reason": "Patient request"
}
```

#### Get Patient DNA Kits
```bash
GET /api/v1/dna-kits/patient/:patientId
```

#### Get DNA Kit Statistics
```bash
GET /api/v1/dna-kits/statistics
```

---

### Audit Logs

#### Get All Audit Logs
```bash
GET /api/v1/audit-logs
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 50)
  - userId: integer (optional)
  - action: string (optional)
  - actionType: string (optional)
  - entityType: string (optional)
  - entityId: integer (optional)
  - severity: string (optional)
  - status: string (optional)
  - startDate: string (optional)
  - endDate: string (optional)
```

#### Create Audit Log
```bash
POST /api/v1/audit-logs
Content-Type: application/json

{
  "user_id": 1,
  "action": "update_patient",
  "action_type": "update",
  "entity_type": "patient",
  "entity_id": 5,
  "description": "Updated patient contact information",
  "old_values": { "phone": "123456" },
  "new_values": { "phone": "789012" },
  "severity": "low",
  "status": "success"
}
```

#### Get User Activity Logs
```bash
GET /api/v1/audit-logs/user/:userId
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 50)
  - actionType: string (optional)
  - startDate: string (optional)
  - endDate: string (optional)
```

#### Get Entity Audit Trail
```bash
GET /api/v1/audit-logs/entity/:entityType/:entityId
```

#### Get Audit Log Statistics
```bash
GET /api/v1/audit-logs/statistics
Query Parameters:
  - startDate: string (optional)
  - endDate: string (optional)
```

#### Get Security Events
```bash
GET /api/v1/audit-logs/security-events
Query Parameters:
  - page: integer (default: 1)
  - limit: integer (default: 50)
  - startDate: string (optional)
  - endDate: string (optional)
```

#### Export Audit Logs
```bash
GET /api/v1/audit-logs/export
Query Parameters:
  - startDate: string (optional)
  - endDate: string (optional)
  - format: string (default: json) - json or csv
```

---

### Integrations

#### Get All Integrations
```bash
GET /api/v1/integrations
Query Parameters:
  - integrationType: string (optional)
  - isActive: boolean (optional)
  - provider: string (optional)
```

#### Create Integration
```bash
POST /api/v1/integrations
Content-Type: application/json

{
  "name": "Stripe Payment Gateway",
  "slug": "stripe-payment",
  "integration_type": "payment",
  "provider": "stripe",
  "description": "Stripe payment processing",
  "api_key": "sk_test_...",
  "api_secret": "...",
  "api_endpoint": "https://api.stripe.com",
  "is_sandbox": true,
  "created_by": 1
}
```

#### Get Integration by ID
```bash
GET /api/v1/integrations/:id
```

#### Get Integration by Slug
```bash
GET /api/v1/integrations/slug/:slug
```

#### Update Integration
```bash
PUT /api/v1/integrations/:id
```

#### Delete Integration
```bash
DELETE /api/v1/integrations/:id
```

#### Toggle Integration Status
```bash
PUT /api/v1/integrations/:id/toggle
Content-Type: application/json

{
  "is_active": true
}
```

#### Test Integration Connection
```bash
POST /api/v1/integrations/:id/test
```

#### Sync Integration
```bash
POST /api/v1/integrations/:id/sync
```

#### Get Integration Statistics
```bash
GET /api/v1/integrations/statistics
```

---

## 📝 Response Format

All API responses follow a consistent format:

### Success Response:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## 🔒 Security

- All endpoints require JWT authentication (except public endpoints)
- Passwords are hashed using bcrypt
- Sensitive data is excluded from responses
- IP address and user agent tracking
- Audit logging for all critical operations
- Rate limiting (to be implemented)

---

## 🌐 CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

## 📊 Rate Limiting

Rate limiting will be implemented in production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## 🎯 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 📞 Support

For API support and questions:
- Review this documentation
- Check Swagger docs at `/api-docs`
- Refer to the gap analysis document
- Review controller code for implementation details

---

**Last Updated:** Current Session  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
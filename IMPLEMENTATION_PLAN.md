# Medivoy Healthcare Backend - Complete Implementation Plan

## 📋 Project Overview

**Project Name:** Medivoy Healthcare Management System Backend  
**Technology Stack:** Node.js + Express.js + JavaScript  
**Package Manager:** pnpm  
**Platform:** Windows  
**Databases:** PostgreSQL (primary), MongoDB (logs/analytics), Redis (caching)  
**Documentation:** Swagger/OpenAPI 3.0

---

## 🎯 Key Features

### Core Modules
1. **Authentication & Authorization** - JWT-based with refresh tokens
2. **User Management** - Multi-role system (admin, doctor, patient, hospital_admin)
3. **Hospital Management** - Hospital profiles, verification, analytics
4. **Doctor Management** - Profiles, schedules, availability, specializations
5. **Patient Management** - Medical history, insurance, records
6. **Treatment Catalog** - Treatments with category/subcategory taxonomy
7. **Medical Tour Packages** - Package management with pricing
8. **Booking System** - Complete workflow (12 status stages)
9. **Appointment System** - Scheduling with video call integration
10. **Medical Records** - Document upload/download with file management
11. **Prescriptions** - Digital prescriptions with PDF generation
12. **Laboratory Management** - Lab facilities and test management
13. **Insurance Module** - Provider management with plans
14. **Payment Processing** - Stripe & Razorpay integration
15. **Invoice Generation** - Automated invoicing with PDF
16. **Reviews & Ratings** - Verified reviews for doctors/hospitals
17. **Notifications** - Multi-channel (email, SMS, push)
18. **Support Tickets** - Customer support system
19. **Subscriptions** - Subscription plans for hospitals/doctors
20. **Multi-language** - Translation system with auto-translate
21. **Analytics & Reporting** - Dashboard analytics
22. **Media Management** - Cloudinary integration
23. **Coupons & Discounts** - Promotional code system
24. **FAQs & Content** - CMS for website content

### NEW: Treatment Taxonomy System
- **Treatment Categories** - Top-level categorization with icons, images, sorting
- **Treatment Subcategories** - Nested categorization under categories
- **Taxonomy Endpoints** - Convenience endpoints for flat lists and filtering
- **SEO Optimization** - Slug-based URLs, sitemap generation
- **Caching** - Redis caching for taxonomy endpoints

---

## 📊 Database Schema

### PostgreSQL Tables (31 Tables)

1. **users** - User accounts with authentication
2. **patients** - Patient profiles and medical history
3. **doctors** - Doctor profiles and credentials
4. **hospitals** - Hospital information and facilities
5. **hospital_doctors** - Junction table (many-to-many)
6. **treatments** - Treatment catalog with taxonomy links
7. **treatment_categories** - NEW: Top-level treatment categories
8. **treatment_subcategories** - NEW: Nested subcategories
9. **hospital_treatments** - Junction table with pricing
10. **packages** - Medical tour packages
11. **bookings** - Booking management with workflow
12. **appointments** - Appointment scheduling
13. **medical_records** - Patient medical documents
14. **prescriptions** - Digital prescriptions
15. **laboratories** - Laboratory facilities
16. **lab_tests** - Lab test requests and results
17. **insurance_providers** - Insurance companies and plans
18. **payments** - Payment transactions
19. **invoices** - Invoice records
20. **reviews** - Reviews and ratings
21. **notifications** - Notification queue
22. **support_tickets** - Support system
23. **subscription_plans** - Subscription offerings
24. **subscriptions** - Active subscriptions
25. **translations** - Multi-language content
26. **coupons** - Discount codes
27. **faqs** - FAQ content
28. **website_content** - CMS pages
29. **media** - Media file references
30. **password_resets** - Password reset tokens
31. **refresh_tokens** - JWT refresh tokens

### MongoDB Collections (3 Collections)

1. **audit_logs** - Audit trail for all actions
2. **analytics** - Aggregated analytics data
3. **sessions** - User session management

---

## 🔌 API Endpoints (200+ Endpoints)

### Authentication (10 endpoints)
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password
- GET /api/v1/auth/profile
- PATCH /api/v1/auth/profile
- POST /api/v1/auth/verify-email
- POST /api/v1/auth/resend-verification

### Treatment Categories (8 endpoints) - NEW
- GET /api/v1/treatment-categories
- GET /api/v1/treatment-categories/:id
- POST /api/v1/treatment-categories (admin)
- PATCH /api/v1/treatment-categories/:id (admin)
- PATCH /api/v1/treatment-categories/:id/publish (admin)
- PATCH /api/v1/treatment-categories/reorder (admin)
- GET /api/v1/treatment-categories/:id/subcategories
- POST /api/v1/treatment-categories/:id/subcategories (admin)

### Treatment Subcategories (6 endpoints) - NEW
- GET /api/v1/treatment-subcategories
- GET /api/v1/treatment-subcategories/:id
- POST /api/v1/treatment-subcategories (admin)
- PATCH /api/v1/treatment-subcategories/:id (admin)
- PATCH /api/v1/treatment-subcategories/:id/publish (admin)
- PATCH /api/v1/treatment-subcategories/reorder (admin)

### Taxonomy Convenience (2 endpoints) - NEW
- GET /api/v1/treatments/taxonomy (flat list with counts)
- GET /api/v1/treatments/by-taxonomy?category_slug=&subcategory_slug=

### Users, Hospitals, Doctors, Patients, Treatments, Packages, Bookings, Appointments, etc.
(See complete list in PDF documentation - 180+ additional endpoints)

---

## 🏗️ Project Structure

```
medivoy-backend/
├── src/
│   ├── config/
│   │   ├── index.js
│   │   ├── database.js (PostgreSQL)
│   │   ├── mongodb.js
│   │   ├── redis.js
│   │   ├── cloudinary.js
│   │   ├── email.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── hospitals.controller.js
│   │   ├── doctors.controller.js
│   │   ├── patients.controller.js
│   │   ├── treatments.controller.js
│   │   ├── treatment-categories.controller.js (NEW)
│   │   ├── treatment-subcategories.controller.js (NEW)
│   │   ├── packages.controller.js
│   │   ├── bookings.controller.js
│   │   ├── appointments.controller.js
│   │   ├── medical-records.controller.js
│   │   ├── prescriptions.controller.js
│   │   ├── laboratories.controller.js
│   │   ├── lab-tests.controller.js
│   │   ├── insurance.controller.js
│   │   ├── payments.controller.js
│   │   ├── invoices.controller.js
│   │   ├── reviews.controller.js
│   │   ├── notifications.controller.js
│   │   ├── support.controller.js
│   │   ├── subscriptions.controller.js
│   │   ├── translations.controller.js
│   │   ├── analytics.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── media.controller.js
│   │   ├── coupons.controller.js
│   │   └── faqs.controller.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Patient.model.js
│   │   ├── Doctor.model.js
│   │   ├── Hospital.model.js
│   │   ├── Treatment.model.js
│   │   ├── TreatmentCategory.model.js (NEW)
│   │   ├── TreatmentSubcategory.model.js (NEW)
│   │   ├── Package.model.js
│   │   ├── Booking.model.js
│   │   ├── Appointment.model.js
│   │   ├── MedicalRecord.model.js
│   │   ├── Prescription.model.js
│   │   ├── Laboratory.model.js
│   │   ├── LabTest.model.js
│   │   ├── Insurance.model.js
│   │   ├── Payment.model.js
│   │   ├── Invoice.model.js
│   │   ├── Review.model.js
│   │   ├── Notification.model.js
│   │   ├── SupportTicket.model.js
│   │   ├── SubscriptionPlan.model.js
│   │   ├── Subscription.model.js
│   │   ├── Translation.model.js
│   │   ├── Coupon.model.js
│   │   ├── FAQ.model.js
│   │   ├── WebsiteContent.model.js
│   │   ├── Media.model.js
│   │   ├── PasswordReset.model.js
│   │   ├── RefreshToken.model.js
│   │   └── index.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── sms.service.js
│   │   ├── upload.service.js
│   │   ├── payment.service.js
│   │   ├── notification.service.js
│   │   ├── treatment-category.service.js (NEW)
│   │   ├── treatment-subcategory.service.js (NEW)
│   │   └── ... (20+ more services)
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── auth.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── hospitals.routes.js
│   │   │   ├── doctors.routes.js
│   │   │   ├── patients.routes.js
│   │   │   ├── treatments.routes.js
│   │   │   ├── treatment-categories.routes.js (NEW)
│   │   │   ├── treatment-subcategories.routes.js (NEW)
│   │   │   ├── packages.routes.js
│   │   │   ├── bookings.routes.js
│   │   │   ├── appointments.routes.js
│   │   │   └── ... (20+ more route files)
│   │   ├── webhooks/
│   │   │   ├── stripe.webhook.js
│   │   │   └── razorpay.webhook.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── cache.middleware.js
│   │   ├── rate-limit.middleware.js
│   │   ├── error.middleware.js
│   │   ├── logger.middleware.js
│   │   ├── security.middleware.js
│   │   ├── cors.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── audit.middleware.js
│   │   └── locale.middleware.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── treatment-category.validator.js (NEW)
│   │   ├── treatment-subcategory.validator.js (NEW)
│   │   └── ... (18+ more validators)
│   ├── utils/
│   │   ├── response.js
│   │   ├── logger.js
│   │   ├── jwt.js
│   │   ├── encryption.js
│   │   ├── helpers.js
│   │   ├── email-templates.js
│   │   ├── pdf-generator.js
│   │   ├── error-handler.js
│   │   └── slug-generator.js (NEW)
│   ├── jobs/
│   │   ├── email.job.js
│   │   ├── sms.job.js
│   │   ├── notification.job.js
│   │   ├── translation.job.js
│   │   ├── backup.job.js
│   │   ├── cleanup.job.js
│   │   ├── analytics.job.js
│   │   ├── appointment-reminder.job.js
│   │   ├── payment-reminder.job.js
│   │   ├── subscription-renewal.job.js
│   │   └── queue.js
│   ├── constants/
│   │   ├── status-codes.js
│   │   ├── user-roles.js
│   │   ├── error-codes.js
│   │   ├── file-types.js
│   │   └── locales.js
│   ├── app.js
│   └── server.js
├── migrations/
│   ├── 001-create-users.sql
│   ├── 002-create-patients.sql
│   ├── 003-create-doctors.sql
│   ├── 004-create-hospitals.sql
│   ├── 005-create-hospital-doctors.sql
│   ├── 006-create-treatments.sql
│   ├── 007-create-treatment-categories.sql (NEW)
│   ├── 008-create-treatment-subcategories.sql (NEW)
│   ├── 009-alter-treatments-add-taxonomy.sql (NEW)
│   └── ... (23+ more migrations)
├── seeds/
│   ├── treatment-categories.seed.js (NEW)
│   ├── treatment-subcategories.seed.js (NEW)
│   └── ... (other seed files)
├── scripts/
│   ├── run-migrations.js
│   └── seed-database.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   └── swagger/
├── logs/
├── uploads/
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── docker-compose.yml
├── ecosystem.config.js (PM2)
├── README.md
└── IMPLEMENTATION_PLAN.md (this file)
```

---

## 🚀 Implementation Phases

### Phase 1: Project Setup (Day 1)
- Initialize pnpm project
- Install all dependencies
- Set up folder structure
- Configure environment variables
- Set up Docker Compose for databases

### Phase 2: Database Layer (Days 2-3)
- Create all 32 PostgreSQL migrations
- Set up MongoDB schemas
- Configure Redis connection
- Create all 31 Sequelize models
- Set up model associations
- Create migration runner script

### Phase 3: Core Infrastructure (Days 4-5)
- Express app setup with middleware
- JWT authentication utilities
- Error handling system
- Logging system (Winston)
- Response formatters
- Validation middleware

### Phase 4: Authentication Module (Day 6)
- Auth controller and service
- JWT token generation/verification
- Password hashing
- Refresh token mechanism
- Email verification
- Password reset flow

### Phase 5: Core Controllers & Services (Days 7-12)
- Users, Patients, Doctors, Hospitals
- Treatments with taxonomy (NEW)
- Treatment Categories (NEW)
- Treatment Subcategories (NEW)
- Packages, Bookings, Appointments
- Medical Records, Prescriptions
- Laboratories, Lab Tests
- Insurance providers
- All remaining controllers

### Phase 6: Advanced Features (Days 13-15)
- Payment integration (Stripe, Razorpay)
- Invoice generation with PDF
- Email service (SendGrid/Nodemailer)
- SMS service (Twilio)
- File upload (Cloudinary)
- Notification system
- Background jobs (Bull)

### Phase 7: Swagger Documentation (Day 16)
- Set up Swagger UI
- Document all 200+ endpoints
- Add request/response schemas
- Add authentication examples
- Add error response documentation

### Phase 8: Testing (Days 17-18)
- Unit tests for services
- Integration tests for APIs
- E2E tests for workflows
- Test coverage reporting

### Phase 9: Optimization & Security (Day 19)
- Redis caching implementation
- Rate limiting
- Security headers
- Input sanitization
- SQL injection prevention
- XSS protection

### Phase 10: Deployment Setup (Day 20)
- Docker configuration
- PM2 setup for production
- CI/CD pipeline
- Environment configurations
- Deployment documentation

---

## 📦 Dependencies

### Core Dependencies
- express - Web framework
- sequelize - PostgreSQL ORM
- mongoose - MongoDB ODM
- ioredis - Redis client
- jsonwebtoken - JWT authentication
- bcrypt - Password hashing
- joi - Input validation
- multer - File upload
- cloudinary - Image hosting
- nodemailer - Email service
- winston - Logging
- swagger-ui-express - API documentation
- helmet - Security headers
- cors - CORS handling
- compression - Response compression
- express-rate-limit - Rate limiting
- node-cron - Scheduled jobs
- bull - Job queue

### Payment & Communication
- stripe - Payment processing
- razorpay - Payment processing (India)
- twilio - SMS service
- @sendgrid/mail - Email service
- firebase-admin - Push notifications

### Development Dependencies
- nodemon - Development server
- jest - Testing framework
- supertest - API testing
- eslint - Code linting
- prettier - Code formatting

---

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt with salt rounds
3. **Rate Limiting** - Prevent brute force attacks
4. **Helmet** - Security headers
5. **CORS** - Cross-origin resource sharing
6. **Input Validation** - Joi validation
7. **SQL Injection Prevention** - Parameterized queries
8. **XSS Protection** - Input sanitization
9. **Audit Logging** - Track all actions
10. **Role-Based Access Control** - Fine-grained permissions

---

## 📈 Performance Optimizations

1. **Redis Caching** - Cache frequently accessed data
2. **Database Indexing** - Optimize query performance
3. **Connection Pooling** - Efficient database connections
4. **Compression** - Gzip response compression
5. **Pagination** - Limit result sets
6. **Lazy Loading** - Load related data on demand
7. **Query Optimization** - Efficient SQL queries
8. **CDN Integration** - Cloudinary for media

---

## 🧪 Testing Strategy

1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test API endpoints
3. **E2E Tests** - Test complete workflows
4. **Load Testing** - Performance testing
5. **Security Testing** - Vulnerability scanning

---

## 📚 Documentation

1. **API Documentation** - Swagger/OpenAPI
2. **Code Documentation** - JSDoc comments
3. **README** - Setup and usage guide
4. **Architecture Docs** - System design
5. **Deployment Guide** - Production setup

---

## 🎯 Success Criteria

- ✅ All 200+ API endpoints implemented
- ✅ Complete Swagger documentation
- ✅ 80%+ test coverage
- ✅ Production-ready code
- ✅ Docker deployment ready
- ✅ PM2 configuration
- ✅ Security best practices
- ✅ Performance optimized
- ✅ Error handling complete
- ✅ Logging implemented

---

## 📞 Support

For questions or issues during implementation, refer to:
- PDF documentation (both files)
- This implementation plan
- Inline code comments
- Swagger API documentation
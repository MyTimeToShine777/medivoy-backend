# Medivoy Backend API - Complete Endpoint List

**Total Endpoints:** 287

**Generated:** 2025-10-30T12:41:06.677Z

---

## 📋 Table of Contents

1. [Analytics](#analytics)
2. [Appointments](#appointments)
3. [AuditLogs](#auditLogs)
4. [Auth](#auth)
5. [BookingStatus](#bookingStatus)
6. [Bookings](#bookings)
7. [Chat](#chat)
8. [Coupons](#coupons)
9. [DnaKits](#dnaKits)
10. [DoctorSchedules](#doctorSchedules)
11. [Doctors](#doctors)
12. [Faqs](#faqs)
13. [Health](#health)
14. [Hospitals](#hospitals)
15. [Insurance](#insurance)
16. [Integrations](#integrations)
17. [Invoices](#invoices)
18. [LabTests](#labTests)
19. [Laboratories](#laboratories)
20. [Media](#media)
21. [MedicalRecords](#medicalRecords)
22. [Notifications](#notifications)
23. [Packages](#packages)
24. [Patients](#patients)
25. [Payments](#payments)
26. [Prescriptions](#prescriptions)
27. [Reviews](#reviews)
28. [Staff](#staff)
29. [Subscriptions](#subscriptions)
30. [Support](#support)
31. [SystemSettings](#systemSettings)
32. [TermsPrivacy](#termsPrivacy)
33. [Translation](#translation)
34. [Translations](#translations)
35. [TreatmentCategories](#treatmentCategories)
36. [Treatments](#treatments)
37. [Uploads](#uploads)
38. [Users](#users)
39. [VideoCalls](#videoCalls)
40. [WebsiteContent](#websiteContent)

---

## Analytics

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/dashboard` | Get all dashboard or list |
| GET | `/api/v1/analytics/bookings` | Get all bookings or list |
| GET | `/api/v1/analytics/revenue` | Get all revenue or list |
| GET | `/api/v1/analytics/hospitals/top` | Get all top or list |
| GET | `/api/v1/analytics/treatments/top` | Get all top or list |
| GET | `/api/v1/analytics/patients/demographics` | Get all demographics or list |
| GET | `/api/v1/analytics/doctors` | Get all doctors or list |

## Appointments

**Total Endpoints:** 8

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/appointments` | Create new appointments |
| GET | `/api/v1/appointments/:id` | Get specific :id by ID |
| PUT | `/api/v1/appointments/:id` | Update :id by ID |
| PATCH | `/api/v1/appointments/:id/status` | Partially update status by ID |
| GET | `/api/v1/appointments` | Get all appointments or list |
| GET | `/api/v1/appointments/patient/:patientId` | Get all :patientId or list |
| DELETE | `/api/v1/appointments/:id` | Delete :id by ID |
| GET | `/api/v1/appointments/doctor/:doctorId` | Get all :doctorId or list |

## AuditLogs

**Total Endpoints:** 8

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auditLogs` | Get all auditLogs or list |
| POST | `/api/v1/auditLogs` | Create new auditLogs |
| GET | `/api/v1/auditLogs/user/:userId` | Get all :userId or list |
| GET | `/api/v1/auditLogs/entity/:entityType/:entityId` | Get all :entityId or list |
| GET | `/api/v1/auditLogs/statistics` | Get all statistics or list |
| GET | `/api/v1/auditLogs/security-events` | Get all security-events or list |
| GET | `/api/v1/auditLogs/export` | Get all export or list |
| GET | `/api/v1/auditLogs/:id` | Get specific :id by ID |

## Auth

**Total Endpoints:** 11

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create new register |
| POST | `/api/v1/auth/login` | Create new login |
| POST | `/api/v1/auth/logout` | Create new logout |
| POST | `/api/v1/auth/refresh` | Create new refresh |
| GET | `/api/v1/auth/profile` | Get all profile or list |
| PUT | `/api/v1/auth/profile` | Update profile |
| PUT | `/api/v1/auth/change-password` | Update change-password |
| POST | `/api/v1/auth/forgot-password` | Create new forgot-password |
| POST | `/api/v1/auth/reset-password` | Create new reset-password |
| POST | `/api/v1/auth/verify-email` | Create new verify-email |
| POST | `/api/v1/auth/resend-verification` | Create new resend-verification |

## BookingStatus

**Total Endpoints:** 9

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/v1/bookingStatus/:id` | Update :id by ID |
| GET | `/api/v1/bookingStatus/:id/history` | Get specific history by ID |
| PUT | `/api/v1/bookingStatus/:id/coordinator` | Update coordinator by ID |
| GET | `/api/v1/bookingStatus/:id/transitions` | Get specific transitions by ID |
| GET | `/api/v1/bookingStatus/status/:status` | Get all :status or list |
| PUT | `/api/v1/bookingStatus/bulk-update` | Update bulk-update |
| GET | `/api/v1/bookingStatus/statistics` | Get all statistics or list |
| GET | `/api/v1/bookingStatus` | Get all bookingStatus or list |
| DELETE | `/api/v1/bookingStatus/:id` | Delete :id by ID |

## Bookings

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/bookings` | Create new bookings |
| GET | `/api/v1/bookings/:id` | Get specific :id by ID |
| PUT | `/api/v1/bookings/:id` | Update :id by ID |
| PATCH | `/api/v1/bookings/:id/status` | Partially update status by ID |
| GET | `/api/v1/bookings` | Get all bookings or list |
| DELETE | `/api/v1/bookings/:id` | Delete :id by ID |
| GET | `/api/v1/bookings/patient/:patientId` | Get all :patientId or list |

## Chat

**Total Endpoints:** 11

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/chat/conversations` | Create new conversations |
| GET | `/api/v1/chat/conversations/user/:userId` | Get all :userId or list |
| GET | `/api/v1/chat/conversations/:id` | Get specific :id by ID |
| PUT | `/api/v1/chat/conversations/:id/archive` | Update archive by ID |
| POST | `/api/v1/chat/messages` | Create new messages |
| GET | `/api/v1/chat/messages/conversation/:conversationId` | Get all :conversationId or list |
| DELETE | `/api/v1/chat/messages/:id` | Delete :id by ID |
| PUT | `/api/v1/chat/messages/conversation/:conversationId/read` | Update read |
| GET | `/api/v1/chat/unread/:userId` | Get all :userId or list |
| GET | `/api/v1/chat` | Get all chat or list |
| GET | `/api/v1/chat/:id` | Get specific :id by ID |

## Coupons

**Total Endpoints:** 6

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/coupons` | Create new coupons |
| GET | `/api/v1/coupons/:id` | Get specific :id by ID |
| GET | `/api/v1/coupons` | Get all coupons or list |
| GET | `/api/v1/coupons/validate/:code` | Get all :code or list |
| POST | `/api/v1/coupons/apply/:code` | Create new :code |
| DELETE | `/api/v1/coupons/:id` | Delete :id by ID |

## DnaKits

**Total Endpoints:** 10

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dnaKits` | Get all dnaKits or list |
| POST | `/api/v1/dnaKits` | Create new dnaKits |
| GET | `/api/v1/dnaKits/patient/:patientId` | Get all :patientId or list |
| GET | `/api/v1/dnaKits/statistics` | Get all statistics or list |
| GET | `/api/v1/dnaKits/:id` | Get specific :id by ID |
| PUT | `/api/v1/dnaKits/:id` | Update :id by ID |
| PUT | `/api/v1/dnaKits/:id/status` | Update status by ID |
| PUT | `/api/v1/dnaKits/:id/results` | Update results by ID |
| PUT | `/api/v1/dnaKits/:id/cancel` | Update cancel by ID |
| DELETE | `/api/v1/dnaKits/:id` | Delete :id by ID |

## DoctorSchedules

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/doctorSchedules` | Create new doctorSchedules |
| POST | `/api/v1/doctorSchedules/bulk` | Create new bulk |
| GET | `/api/v1/doctorSchedules/doctor/:doctorId` | Get all :doctorId or list |
| GET | `/api/v1/doctorSchedules/doctor/:doctorId/available-slots` | Get all available-slots or list |
| GET | `/api/v1/doctorSchedules/:id` | Get specific :id by ID |
| PUT | `/api/v1/doctorSchedules/:id` | Update :id by ID |
| DELETE | `/api/v1/doctorSchedules/:id` | Delete :id by ID |

## Doctors

**Total Endpoints:** 6

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/doctors` | Create new doctors |
| GET | `/api/v1/doctors/:id` | Get specific :id by ID |
| PUT | `/api/v1/doctors/:id` | Update :id by ID |
| DELETE | `/api/v1/doctors/:id` | Delete :id by ID |
| GET | `/api/v1/doctors` | Get all doctors or list |
| PATCH | `/api/v1/doctors/:id/verify` | Partially update verify by ID |

## Faqs

**Total Endpoints:** 6

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/faqs` | Create new faqs |
| GET | `/api/v1/faqs/:id` | Get specific :id by ID |
| GET | `/api/v1/faqs` | Get all faqs or list |
| GET | `/api/v1/faqs/category/:category` | Get all :category or list |
| PUT | `/api/v1/faqs/:id` | Update :id by ID |
| DELETE | `/api/v1/faqs/:id` | Delete :id by ID |

## Health

**Total Endpoints:** 1

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Get all health or list |

## Hospitals

**Total Endpoints:** 6

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/hospitals` | Create new hospitals |
| GET | `/api/v1/hospitals/:id` | Get specific :id by ID |
| PUT | `/api/v1/hospitals/:id` | Update :id by ID |
| DELETE | `/api/v1/hospitals/:id` | Delete :id by ID |
| GET | `/api/v1/hospitals` | Get all hospitals or list |
| PATCH | `/api/v1/hospitals/:id/verify` | Partially update verify by ID |

## Insurance

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/insurance` | Create new insurance |
| GET | `/api/v1/insurance/:id` | Get specific :id by ID |
| PUT | `/api/v1/insurance/:id` | Update :id by ID |
| DELETE | `/api/v1/insurance/:id` | Delete :id by ID |
| GET | `/api/v1/insurance` | Get all insurance or list |

## Integrations

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/integrations` | Get all integrations or list |
| POST | `/api/v1/integrations` | Create new integrations |
| GET | `/api/v1/integrations/:id` | Get specific :id by ID |
| PUT | `/api/v1/integrations/:id` | Update :id by ID |
| DELETE | `/api/v1/integrations/:id` | Delete :id by ID |
| POST | `/api/v1/integrations/:id/test` | Create new test |
| POST | `/api/v1/integrations/:id/sync` | Create new sync |

## Invoices

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/invoices` | Create new invoices |
| GET | `/api/v1/invoices/:id` | Get specific :id by ID |
| PUT | `/api/v1/invoices/:id` | Update :id by ID |
| DELETE | `/api/v1/invoices/:id` | Delete :id by ID |
| GET | `/api/v1/invoices` | Get all invoices or list |

## LabTests

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/labTests` | Create new labTests |
| GET | `/api/v1/labTests/:id` | Get specific :id by ID |
| PUT | `/api/v1/labTests/:id` | Update :id by ID |
| DELETE | `/api/v1/labTests/:id` | Delete :id by ID |
| GET | `/api/v1/labTests` | Get all labTests or list |

## Laboratories

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/laboratories` | Create new laboratories |
| GET | `/api/v1/laboratories/:id` | Get specific :id by ID |
| PUT | `/api/v1/laboratories/:id` | Update :id by ID |
| DELETE | `/api/v1/laboratories/:id` | Delete :id by ID |
| GET | `/api/v1/laboratories` | Get all laboratories or list |

## Media

**Total Endpoints:** 15

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/media/upload` | Create new upload |
| POST | `/api/v1/media/upload-multiple` | Create new upload-multiple |
| DELETE | `/api/v1/media/:fileId` | Delete :fileId |
| POST | `/api/v1/media/delete-multiple` | Create new delete-multiple |
| GET | `/api/v1/media/:fileId` | Get all :fileId or list |
| GET | `/api/v1/media` | Get all media or list |
| PUT | `/api/v1/media/:fileId` | Update :fileId |
| POST | `/api/v1/media/transform` | Create new transform |
| POST | `/api/v1/media/thumbnail` | Create new thumbnail |
| POST | `/api/v1/media/optimize` | Create new optimize |
| POST | `/api/v1/media/purge-cache` | Create new purge-cache |
| GET | `/api/v1/media/auth/params` | Get all params or list |
| POST | `/api/v1/media/folder` | Create new folder |
| DELETE | `/api/v1/media/folder` | Delete folder |
| GET | `/api/v1/media/:id` | Get specific :id by ID |

## MedicalRecords

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/medicalRecords` | Create new medicalRecords |
| GET | `/api/v1/medicalRecords/:id` | Get specific :id by ID |
| PUT | `/api/v1/medicalRecords/:id` | Update :id by ID |
| DELETE | `/api/v1/medicalRecords/:id` | Delete :id by ID |
| GET | `/api/v1/medicalRecords/patient/:patientId` | Get all :patientId or list |

## Notifications

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/notifications` | Create new notifications |
| GET | `/api/v1/notifications/:id` | Get specific :id by ID |
| PUT | `/api/v1/notifications/:id` | Update :id by ID |
| DELETE | `/api/v1/notifications/:id` | Delete :id by ID |
| GET | `/api/v1/notifications/user/:userId` | Get all :userId or list |
| GET | `/api/v1/notifications` | Get all notifications or list |
| PATCH | `/api/v1/notifications/:id/read` | Partially update read by ID |

## Packages

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/packages` | Create new packages |
| GET | `/api/v1/packages/:id` | Get specific :id by ID |
| PUT | `/api/v1/packages/:id` | Update :id by ID |
| DELETE | `/api/v1/packages/:id` | Delete :id by ID |
| GET | `/api/v1/packages` | Get all packages or list |

## Patients

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/patients` | Create new patients |
| GET | `/api/v1/patients/:id` | Get specific :id by ID |
| PUT | `/api/v1/patients/:id` | Update :id by ID |
| DELETE | `/api/v1/patients/:id` | Delete :id by ID |
| GET | `/api/v1/patients` | Get all patients or list |

## Payments

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments` | Create new payments |
| GET | `/api/v1/payments/:id` | Get specific :id by ID |
| PUT | `/api/v1/payments/:id` | Update :id by ID |
| DELETE | `/api/v1/payments/:id` | Delete :id by ID |
| GET | `/api/v1/payments` | Get all payments or list |

## Prescriptions

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/prescriptions` | Create new prescriptions |
| GET | `/api/v1/prescriptions/:id` | Get specific :id by ID |
| PUT | `/api/v1/prescriptions/:id` | Update :id by ID |
| DELETE | `/api/v1/prescriptions/:id` | Delete :id by ID |
| GET | `/api/v1/prescriptions/patient/:patientId` | Get all :patientId or list |

## Reviews

**Total Endpoints:** 6

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/reviews` | Create new reviews |
| GET | `/api/v1/reviews/:id` | Get specific :id by ID |
| PUT | `/api/v1/reviews/:id` | Update :id by ID |
| DELETE | `/api/v1/reviews/:id` | Delete :id by ID |
| GET | `/api/v1/reviews` | Get all reviews or list |
| PATCH | `/api/v1/reviews/:id/verify` | Partially update verify by ID |

## Staff

**Total Endpoints:** 8

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/staff` | Get all staff or list |
| POST | `/api/v1/staff` | Create new staff |
| GET | `/api/v1/staff/hospital/:hospitalId` | Get all :hospitalId or list |
| GET | `/api/v1/staff/:id` | Get specific :id by ID |
| PUT | `/api/v1/staff/:id` | Update :id by ID |
| DELETE | `/api/v1/staff/:id` | Delete :id by ID |
| GET | `/api/v1/staff/:id/performance` | Get specific performance by ID |
| PUT | `/api/v1/staff/:id/permissions` | Update permissions by ID |

## Subscriptions

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscriptions` | Create new subscriptions |
| GET | `/api/v1/subscriptions/:id` | Get specific :id by ID |
| PUT | `/api/v1/subscriptions/:id` | Update :id by ID |
| PATCH | `/api/v1/subscriptions/:id/cancel` | Partially update cancel by ID |
| DELETE | `/api/v1/subscriptions/:id` | Delete :id by ID |
| GET | `/api/v1/subscriptions` | Get all subscriptions or list |
| GET | `/api/v1/subscriptions/user/:userId` | Get all :userId or list |

## Support

**Total Endpoints:** 6

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/support` | Create new support |
| GET | `/api/v1/support/:id` | Get specific :id by ID |
| PUT | `/api/v1/support/:id` | Update :id by ID |
| DELETE | `/api/v1/support/:id` | Delete :id by ID |
| GET | `/api/v1/support/:id` | Get specific :id by ID |
| GET | `/api/v1/support` | Get all support or list |

## SystemSettings

**Total Endpoints:** 10

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/systemSettings` | Get all systemSettings or list |
| GET | `/api/v1/systemSettings/public` | Get all public or list |
| GET | `/api/v1/systemSettings/category/:category` | Get all :category or list |
| GET | `/api/v1/systemSettings/key/:key` | Get all :key or list |
| POST | `/api/v1/systemSettings` | Create new systemSettings |
| PUT | `/api/v1/systemSettings/key/:key` | Update :key |
| DELETE | `/api/v1/systemSettings/key/:key` | Delete :key |
| PUT | `/api/v1/systemSettings/bulk` | Update bulk |
| PUT | `/api/v1/systemSettings/key/:key/reset` | Update reset |
| GET | `/api/v1/systemSettings/:id` | Get specific :id by ID |

## TermsPrivacy

**Total Endpoints:** 15

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/termsPrivacy/terms` | Get all terms or list |
| GET | `/api/v1/termsPrivacy/terms/active` | Get all active or list |
| POST | `/api/v1/termsPrivacy/terms` | Create new terms |
| PUT | `/api/v1/termsPrivacy/terms/:id` | Update :id by ID |
| PUT | `/api/v1/termsPrivacy/terms/:id/publish` | Update publish by ID |
| GET | `/api/v1/termsPrivacy/privacy` | Get all privacy or list |
| GET | `/api/v1/termsPrivacy/privacy/active` | Get all active or list |
| POST | `/api/v1/termsPrivacy/privacy` | Create new privacy |
| PUT | `/api/v1/termsPrivacy/privacy/:id` | Update :id by ID |
| PUT | `/api/v1/termsPrivacy/privacy/:id/publish` | Update publish by ID |
| POST | `/api/v1/termsPrivacy/acceptance` | Create new acceptance |
| GET | `/api/v1/termsPrivacy/acceptance/user/:userId` | Get all :userId or list |
| GET | `/api/v1/termsPrivacy/acceptance/check/:userId` | Get all :userId or list |
| GET | `/api/v1/termsPrivacy/:id` | Get specific :id by ID |
| DELETE | `/api/v1/termsPrivacy/:id` | Delete :id by ID |

## Translation

**Total Endpoints:** 10

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/translation/translate` | Create new translate |
| POST | `/api/v1/translation/translate-batch` | Create new translate-batch |
| POST | `/api/v1/translation/detect` | Create new detect |
| GET | `/api/v1/translation/languages` | Get all languages or list |
| POST | `/api/v1/translation/queue` | Create new queue |
| GET | `/api/v1/translation/job/:jobId` | Get all :jobId or list |
| DELETE | `/api/v1/translation/job/:jobId` | Delete :jobId |
| GET | `/api/v1/translation/queue/stats` | Get all stats or list |
| POST | `/api/v1/translation/queue/clean-completed` | Create new clean-completed |
| POST | `/api/v1/translation/queue/clean-failed` | Create new clean-failed |

## Translations

**Total Endpoints:** 6

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/translations` | Create new translations |
| GET | `/api/v1/translations/:id` | Get specific :id by ID |
| PUT | `/api/v1/translations/:id` | Update :id by ID |
| DELETE | `/api/v1/translations/:id` | Delete :id by ID |
| GET | `/api/v1/translations` | Get all translations or list |
| GET | `/api/v1/translations/:key/:language` | Get all :language or list |

## TreatmentCategories

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/treatmentCategories` | Create new treatmentCategories |
| GET | `/api/v1/treatmentCategories/:id` | Get specific :id by ID |
| PUT | `/api/v1/treatmentCategories/:id` | Update :id by ID |
| DELETE | `/api/v1/treatmentCategories/:id` | Delete :id by ID |
| GET | `/api/v1/treatmentCategories` | Get all treatmentCategories or list |

## Treatments

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/treatments` | Create new treatments |
| GET | `/api/v1/treatments/:id` | Get specific :id by ID |
| PUT | `/api/v1/treatments/:id` | Update :id by ID |
| DELETE | `/api/v1/treatments/:id` | Delete :id by ID |
| GET | `/api/v1/treatments` | Get all treatments or list |
| GET | `/api/v1/treatments/category/:categoryId` | Get all :categoryId or list |
| GET | `/api/v1/treatments/subcategory/:subcategoryId` | Get all :subcategoryId or list |

## Uploads

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/uploads` | Create new uploads |
| GET | `/api/v1/uploads/:id` | Get specific :id by ID |
| PUT | `/api/v1/uploads/:id` | Update :id by ID |
| DELETE | `/api/v1/uploads/:id` | Delete :id by ID |
| GET | `/api/v1/uploads` | Get all uploads or list |
| GET | `/api/v1/uploads/:id` | Get specific :id by ID |
| GET | `/api/v1/uploads/entity/:entityType/:entityId` | Get all :entityId or list |

## Users

**Total Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users` | Create new users |
| GET | `/api/v1/users/:id` | Get specific :id by ID |
| PUT | `/api/v1/users/:id` | Update :id by ID |
| DELETE | `/api/v1/users/:id` | Delete :id by ID |
| GET | `/api/v1/users` | Get all users or list |

## VideoCalls

**Total Endpoints:** 11

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/videoCalls` | Create new videoCalls |
| POST | `/api/v1/videoCalls/:id/join` | Create new join |
| PUT | `/api/v1/videoCalls/:id/start` | Update start by ID |
| PUT | `/api/v1/videoCalls/:id/end` | Update end by ID |
| PUT | `/api/v1/videoCalls/:id/cancel` | Update cancel by ID |
| PUT | `/api/v1/videoCalls/:id/recording` | Update recording by ID |
| GET | `/api/v1/videoCalls/user/:userId/history` | Get all history or list |
| GET | `/api/v1/videoCalls/user/:userId/upcoming` | Get all upcoming or list |
| GET | `/api/v1/videoCalls/:id` | Get specific :id by ID |
| GET | `/api/v1/videoCalls` | Get all videoCalls or list |
| DELETE | `/api/v1/videoCalls/:id` | Delete :id by ID |

## WebsiteContent

**Total Endpoints:** 7

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/websiteContent` | Create new websiteContent |
| GET | `/api/v1/websiteContent/:id` | Get specific :id by ID |
| GET | `/api/v1/websiteContent/slug/:slug` | Get all :slug or list |
| PUT | `/api/v1/websiteContent/:id` | Update :id by ID |
| DELETE | `/api/v1/websiteContent/:id` | Delete :id by ID |
| GET | `/api/v1/websiteContent` | Get all websiteContent or list |
| GET | `/api/v1/websiteContent/:id` | Get specific :id by ID |


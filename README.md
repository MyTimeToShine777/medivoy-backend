# 🏥 Medivoy Healthcare Backend API

Complete healthcare management system backend built with Node.js, Express, PostgreSQL, MongoDB, and Redis.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Core Modules
- ✅ **Authentication & Authorization** - JWT-based with refresh tokens
- ✅ **User Management** - Multi-role system (admin, doctor, patient, hospital_admin, staff)
- ✅ **Hospital Management** - Profiles, verification, analytics
- ✅ **Doctor Management** - Schedules, availability, specializations
- ✅ **Patient Management** - Medical history, insurance integration
- ✅ **Treatment Catalog** - With category/subcategory taxonomy
- ✅ **Medical Tour Packages** - Package management with pricing
- ✅ **Booking System** - 16-stage workflow management with status history
- ✅ **Appointment System** - Scheduling with video calls
- ✅ **Medical Records** - Secure document management
- ✅ **Prescriptions** - Digital prescriptions with PDF generation
- ✅ **Laboratory Management** - Lab facilities and tests
- ✅ **Insurance Module** - Provider and plan management
- ✅ **Payment Processing** - Stripe &amp; Razorpay integration
- ✅ **Invoice Generation** - Automated invoicing with PDF
- ✅ **Reviews &amp; Ratings** - Verified reviews system
- ✅ **Notifications** - Multi-channel (email, SMS, push)
- ✅ **Support Tickets** - Customer support system
- ✅ **Subscriptions** - Subscription plans management
- ✅ **Multi-language** - Translation system
- ✅ **Coupons &amp; Discounts** - Promotional codes
- ✅ **FAQs &amp; CMS** - Content management

### 🆕 NEW Advanced Features (94 Endpoints Added)
- ✅ **Analytics &amp; Dashboard** - Real-time business intelligence (7 endpoints)
- ✅ **Doctor Schedules** - Complete availability management (7 endpoints)
- ✅ **Staff Management** - Coordinator and staff system (8 endpoints)
- ✅ **Enhanced Booking Status** - 16-stage workflow with history (7 endpoints)
- ✅ **Chat &amp; Messaging** - Real-time communication platform (9 endpoints)
- ✅ **Video Calls** - Telemedicine video consultations (9 endpoints)
- ✅ **Media Library** - Complete media management (8 endpoints)
- ✅ **System Settings** - Configuration management (9 endpoints)
- ✅ **Terms &amp; Privacy** - Legal document versioning (11 endpoints)
- ✅ **DNA Kits** - Genetic testing services (9 endpoints)
- ✅ **Audit Logging** - Complete activity tracking (8 endpoints)
- ✅ **Integrations** - Third-party API management (11 endpoints)

### Advanced Features
- 🔐 **Security** - Helmet, CORS, rate limiting, input validation
- 📊 **Caching** - Redis caching for performance
- 📝 **Logging** - Winston with daily rotation
- 📧 **Email** - SendGrid/Nodemailer integration
- 📱 **SMS** - Twilio integration
- 🔔 **Push Notifications** - Firebase integration
- 📄 **PDF Generation** - Invoice and prescription PDFs
- 🖼️ **Image Upload** - Cloudinary integration
- 🔄 **Background Jobs** - Bull queue for async tasks
- 📚 **API Documentation** - Swagger/OpenAPI 3.0
- 🧪 **Testing** - Jest for unit and integration tests
- 🐳 **Docker** - Docker Compose for development
- 🚀 **PM2** - Production process management

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** JavaScript (ES6+)

### Databases
- **Primary:** PostgreSQL 15 (Sequelize ORM)
- **Logs/Analytics:** MongoDB 7 (Mongoose ODM)
- **Caching:** Redis 7

### External Services
- **Image Hosting:** Cloudinary
- **Email:** SendGrid / Nodemailer
- **SMS:** Twilio
- **Push Notifications:** Firebase
- **Payments:** Stripe, Razorpay
- **Video Calls:** NextCloud (planned)

### DevOps
- **Package Manager:** pnpm
- **Containerization:** Docker & Docker Compose
- **Process Manager:** PM2
- **CI/CD:** GitHub Actions (planned)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **PostgreSQL** >= 15
- **MongoDB** >= 7
- **Redis** >= 7
- **Docker** (optional, for containerized setup)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/medivoy-backend.git
cd medivoy-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file with your configuration (see [Configuration](#configuration) section).

## ⚙️ Configuration

### Required Environment Variables

```env
# Application
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=medivoydb

MONGODB_URI=mongodb://localhost:27017/medivoy_logs

REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Choose one)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# OR SendGrid
SENDGRID_API_KEY=your_sendgrid_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

## 🗄️ Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start all databases
pnpm run docker:up

# Stop databases
pnpm run docker:down
```

### Option 2: Manual Setup

1. **Install PostgreSQL, MongoDB, and Redis** on your system

2. **Create PostgreSQL Database:**
```bash
createdb medivoydb
```

3. **Run Migrations:**
```bash
pnpm run migrate
```

4. **Seed Database (Optional):**
```bash
pnpm run seed
```

## 🏃 Running the Application

### Development Mode

```bash
pnpm run dev
```

The server will start on `http://localhost:5000`

### Production Mode

```bash
# Using Node.js
pnpm start

# Using PM2 (Recommended)
pnpm run pm2:start
```

### PM2 Commands

```bash
# Start
pnpm run pm2:start

# Stop
pnpm run pm2:stop

# Restart
pnpm run pm2:restart

# View logs
pnpm run pm2:logs

# Monitor
pm2 monit
```

## 📚 API Documentation

### Swagger UI

Once the server is running, access the interactive API documentation at:

```
http://localhost:5000/api-docs
```

### API Base URL

```
http://localhost:5000/api/v1
```

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/refresh` - Refresh access token

#### Patients
- `GET /api/v1/patients` - Get all patients
- `GET /api/v1/patients/:id` - Get patient by ID
- `POST /api/v1/patients` - Create patient
- `PUT /api/v1/patients/:id` - Update patient
- `DELETE /api/v1/patients/:id` - Delete patient

#### Doctors
- `GET /api/v1/doctors` - Get all doctors
- `GET /api/v1/doctors/:id` - Get doctor by ID
- `POST /api/v1/doctors` - Create doctor
- `PUT /api/v1/doctors/:id` - Update doctor

#### Hospitals
- `GET /api/v1/hospitals` - Get all hospitals
- `GET /api/v1/hospitals/:id` - Get hospital by ID
- `POST /api/v1/hospitals` - Create hospital

#### Treatment Categories (NEW)
- `GET /api/v1/treatment-categories` - Get all categories
- `POST /api/v1/treatment-categories` - Create category
- `PATCH /api/v1/treatment-categories/:id` - Update category
- `PATCH /api/v1/treatment-categories/reorder` - Reorder categories

#### Appointments
- `GET /api/v1/appointments` - Get all appointments
- `POST /api/v1/appointments` - Create appointment
- `PUT /api/v1/appointments/:id` - Update appointment

#### Insurance
- `GET /api/v1/insurances` - Get all insurance providers
- `GET /api/v1/insurances/stats` - Get statistics
- `POST /api/v1/insurances` - Create insurance provider

*See Swagger documentation for complete endpoint list (200+ endpoints)*

## 📁 Project Structure

```
medivoy-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── index.js
│   │   ├── database.js
│   │   ├── mongodb.js
│   │   ├── redis.js
│   │   └── swagger.js
│   ├── controllers/         # Request handlers (28 controllers)
│   ├── models/              # Database models (31 models)
│   ├── services/            # Business logic (30+ services)
│   ├── routes/              # API routes
│   │   ├── v1/             # Version 1 routes
│   │   └── webhooks/       # Webhook handlers
│   ├── middleware/          # Custom middleware (12 files)
│   ├── validators/          # Input validation (20+ validators)
│   ├── utils/               # Utility functions
│   ├── jobs/                # Background jobs
│   ├── constants/           # Application constants
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── migrations/              # Database migrations (32 files)
├── seeds/                   # Database seeders
├── scripts/                 # Utility scripts
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                    # Documentation
├── logs/                    # Application logs
├── uploads/                 # Uploaded files
├── .env.example            # Environment template
├── .gitignore
├── docker-compose.yml      # Docker configuration
├── ecosystem.config.js     # PM2 configuration
├── package.json
└── README.md
```

## 🧪 Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm run test:watch
```

### Generate Coverage Report

```bash
pnpm test
```

Coverage reports will be generated in the `coverage/` directory.

## 🚀 Deployment

### Using Docker

```bash
# Build image
docker build -t medivoy-backend .

# Run container
docker run -p 5000:5000 --env-file .env medivoy-backend
```

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Environment-Specific Configurations

- **Development:** `.env` with development settings
- **Staging:** `.env.staging` with staging settings
- **Production:** `.env.production` with production settings

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:5000/health
```

### PM2 Monitoring

```bash
pm2 monit
```

### Logs

```bash
# Application logs
tail -f logs/combined-2024-01-15.log

# Error logs
tail -f logs/error-2024-01-15.log

# PM2 logs
pm2 logs medivoy-backend
```

## 🔒 Security

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent brute force attacks
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Input Validation** - Joi validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Team** - Initial work
- **DevOps Team** - Deployment and infrastructure

## 📞 Support

For support, email support@medivoy.com or join our Slack channel.

## 🙏 Acknowledgments

- Express.js team
- Sequelize team
- All open-source contributors

---

**Built with ❤️ by the Medivoy Team**
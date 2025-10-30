# Medivoy Healthcare API - Complete A-Z Beginner Guide

## 🏥 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Setup & Installation](#setup--installation)
4. [Project Structure](#project-structure)
5. [Authentication System](#authentication-system)
6. [API Endpoints Documentation](#api-endpoints-documentation)
7. [Database Models](#database-models)
8. [Environment Configuration](#environment-configuration)
9. [Testing the API](#testing-the-api)
10. [Deployment Guide](#deployment-guide)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## 🎯 Project Overview

Medivoy Healthcare API is a comprehensive backend system designed to manage healthcare operations including:
- **Patient Management**: Complete patient records and profiles
- **Doctor & Hospital Networks**: Multi-tenant healthcare provider management
- **Appointment Booking**: Real-time appointment scheduling system
- **Treatment Management**: Medical procedures and treatment tracking
- **Insurance Integration**: Insurance claims and coverage verification
- **Prescription Management**: Digital prescription system
- **Billing & Payments**: Financial transaction processing
- **Audit & Compliance**: Comprehensive logging and audit trails

---

## 🏗️ Architecture & Technology Stack

### Backend Technologies
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **JWT** - Authentication token management
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Database Support
- **PostgreSQL** - Primary relational database
- **MongoDB** - Document storage for complex data
- **Redis** - Caching and session management

### External Integrations
- **SendGrid** - Email services
- **ImageKit** - Image processing and CDN
- **Google Translate** - Multi-language support

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development auto-restart
- **Jest** - Testing framework
- **Swagger** - API documentation

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (for production)
- MongoDB (optional, for document storage)
- Redis (optional, for caching)

### Step 1: Clone the Repository
```bash
git clone https://github.com/MyTimeToShine777/medivoy-backend.git
cd medivoy-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Step 4: Database Setup
```bash
# For PostgreSQL
createdb medivoy_healthcare

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed
```

### Step 5: Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Environment Variables Explained
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database URLs
DATABASE_URL=postgresql://username:password@localhost:5432/medivoy_healthcare
MONGODB_URL=mongodb://localhost:27017/medivoy_healthcare
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@medivoy.com

# File Upload (ImageKit)
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=your-imagekit-endpoint

# Google Translate
GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key
```

---

## 📁 Project Structure

```
medivoy-backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database configuration
│   │   ├── redis.js      # Redis setup
│   │   └── swagger.js    # API documentation config
│   ├── controllers/      # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── doctor.controller.js
│   │   └── ...
│   ├── middleware/       # Custom middleware
│   │   ├── auth.middleware.js    # Authentication logic
│   │   ├── authorize.middleware.js # Role-based access
│   │   └── validation.middleware.js
│   ├── models/          # Database models
│   │   ├── User.model.js
│   │   ├── Patient.model.js
│   │   ├── Doctor.model.js
│   │   └── ...
│   ├── routes/          # API route definitions
│   │   └── v1/          # API version 1
│   │       ├── auth.routes.js
│   │       ├── patients.routes.js
│   │       └── ...
│   ├── services/        # External service integrations
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation schemas
│   └── workers/         # Background job processors
├── tests/               # Test files
├── docs/                # Documentation
├── migrations/          # Database migrations
├── seeders/             # Database seed data
├── .env.example         # Environment template
├── package.json         # Project dependencies
└── server.js            # Application entry point
```

---

## 🔐 Authentication System

### JWT-Based Authentication
The API uses JSON Web Tokens (JWT) for authentication:

#### Login Flow
1. User sends credentials to `/api/v1/auth/login`
2. Server validates credentials
3. Server generates JWT token with user info
4. Client receives token and stores it
5. Client includes token in `Authorization: Bearer <token>` header

#### Token Structure
```json
{
  "userId": "12345",
  "email": "user@example.com",
  "role": "patient",
  "iat": 1640995200,
  "exp": 1641600000
}
```

#### User Roles
- **admin**: Full system access
- **patient**: Limited to own data
- **doctor**: Access to patient data assigned to them
- **hospital_admin**: Hospital-specific management

#### Authentication Middleware
```javascript
// Apply authentication to routes
const auth = require('../middleware/auth.middleware');

router.get('/profile', auth, userController.getProfile);
```

#### Authorization (Role-Based)
```javascript
// Apply role-based authorization
const authorize = require('../middleware/authorize.middleware');

router.get('/admin-data', auth, authorize(['admin']), adminController.getData);
```

---

## 🛡️ API Endpoints Documentation

### Authentication Endpoints
```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/profile
PUT  /api/v1/auth/profile
```

### Patient Management
```http
GET    /api/v1/patients          # List patients (admin/doctor)
POST   /api/v1/patients          # Create patient
GET    /api/v1/patients/:id      # Get patient by ID
PUT    /api/v1/patients/:id      # Update patient
DELETE /api/v1/patients/:id      # Delete patient
GET    /api/v1/patients/me       # Get current user profile (patient)
PUT    /api/v1/patients/me       # Update current user profile
```

### Doctor Management
```http
GET    /api/v1/doctors           # List doctors
POST   /api/v1/doctors           # Add doctor (admin)
GET    /api/v1/doctors/:id       # Get doctor details
PUT    /api/v1/doctors/:id       # Update doctor
DELETE /api/v1/doctors/:id       # Remove doctor
GET    /api/v1/doctors/specializations # Get specializations
```

### Hospital Management
```http
GET    /api/v1/hospitals         # List hospitals
POST   /api/v1/hospitals         # Add hospital
GET    /api/v1/hospitals/:id     # Get hospital details
PUT    /api/v1/hospitals/:id     # Update hospital
DELETE /api/v1/hospitals/:id     # Remove hospital
GET    /api/v1/hospitals/:id/doctors # Get hospital doctors
```

### Appointments
```http
GET    /api/v1/appointments           # List appointments
POST   /api/v1/appointments           # Book appointment
GET    /api/v1/appointments/:id       # Get appointment details
PUT    /api/v1/appointments/:id       # Update appointment
DELETE /api/v1/appointments/:id       # Cancel appointment
PATCH  /api/v1/appointments/:id/status # Update status
GET    /api/v1/appointments/patient/:patientId # Patient appointments
GET    /api/v1/appointments/doctor/:doctorId   # Doctor appointments
```

### Bookings
```http
GET    /api/v1/bookings             # List bookings
POST   /api/v1/bookings             # Create booking
GET    /api/v1/bookings/:id         # Get booking
PUT    /api/v1/bookings/:id         # Update booking
DELETE /api/v1/bookings/:id         # Cancel booking
GET    /api/v1/bookings/patient/:patientId # Patient bookings
```

### Treatments & Services
```http
GET    /api/v1/treatments           # List treatments
POST   /api/v1/treatments           # Add treatment
GET    /api/v1/treatments/:id       # Get treatment
PUT    /api/v1/treatments/:id       # Update treatment
DELETE /api/v1/treatments/:id       # Remove treatment
GET    /api/v1/treatment-categories # List categories
```

### Prescriptions
```http
GET    /api/v1/prescriptions           # List prescriptions
POST   /api/v1/prescriptions           # Create prescription
GET    /api/v1/prescriptions/:id       # Get prescription
PUT    /api/v1/prescriptions/:id       # Update prescription
DELETE /api/v1/prescriptions/:id       # Delete prescription
GET    /api/v1/prescriptions/patient/:patientId # Patient prescriptions
```

### Payments & Billing
```http
GET    /api/v1/payments             # List payments
POST   /api/v1/payments             # Process payment
GET    /api/v1/payments/:id         # Get payment details
GET    /api/v1/invoices             # List invoices
POST   /api/v1/invoices             # Create invoice
GET    /api/v1/invoices/:id         # Get invoice
```

### Health Check
```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Medivoy Healthcare API is running",
  "timestamp": "2025-10-30T11:40:00.000Z"
}
```

---

## 🗄️ Database Models

### Core Models

#### User Model
```javascript
{
  id: UUID,
  email: String (unique),
  password: String (hashed),
  role: Enum ['admin', 'patient', 'doctor', 'hospital_admin'],
  isActive: Boolean,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Patient Model
```javascript
{
  id: UUID,
  userId: UUID (references User),
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: Enum ['male', 'female', 'other'],
  phone: String,
  address: Object,
  medicalHistory: Object,
  insuranceId: UUID (references Insurance),
  createdAt: Date,
  updatedAt: Date
}
```

#### Doctor Model
```javascript
{
  id: UUID,
  userId: UUID (references User),
  firstName: String,
  lastName: String,
  specialization: String,
  licenseNumber: String,
  experience: Number,
  hospitalId: UUID (references Hospital),
  availability: Object,
  rating: Number,
  consultationFee: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Hospital Model
```javascript
{
  id: UUID,
  name: String,
  address: Object,
  phone: String,
  email: String,
  type: Enum ['general', 'specialty', 'clinic'],
  facilities: Array,
  operatingHours: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Appointment Model
```javascript
{
  id: UUID,
  patientId: UUID (references Patient),
  doctorId: UUID (references Doctor),
  hospitalId: UUID (references Hospital),
  appointmentDate: Date,
  duration: Number,
  status: Enum ['scheduled', 'confirmed', 'completed', 'cancelled'],
  notes: String,
  consultationFee: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Booking Model
```javascript
{
  id: UUID,
  patientId: UUID (references Patient),
  treatmentId: UUID (references Treatment),
  hospitalId: UUID (references Hospital),
  bookingDate: Date,
  status: Enum ['pending', 'confirmed', 'completed', 'cancelled'],
  totalPrice: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚙️ Environment Configuration

### Development Environment (.env.development)
```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://dev_user:dev_pass@localhost:5432/medivoy_dev
REDIS_URL=redis://localhost:6379/0

# JWT (Development keys - change for production)
JWT_SECRET=dev-secret-key-not-for-production
JWT_EXPIRES_IN=24h

# External Services (Development)
SENDGRID_API_KEY=test-key
IMAGEKIT_PUBLIC_KEY=test-public-key
IMAGEKIT_PRIVATE_KEY=test-private-key
```

### Production Environment (.env.production)
```env
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Database (Production)
DATABASE_URL=postgresql://prod_user:secure_pass@prod-db:5432/medivoy_prod
MONGODB_URL=mongodb://prod-db:27017/medivoy_prod
REDIS_URL=redis://prod-redis:6379/0

# JWT (Production - use strong secrets)
JWT_SECRET=super-secure-production-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# External Services (Production)
SENDGRID_API_KEY=prod-sendgrid-key
IMAGEKIT_PUBLIC_KEY=prod-imagekit-public
IMAGEKIT_PRIVATE_KEY=prod-imagekit-private
```

---

## 🧪 Testing the API

### Setting Up Test Environment
```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Example API Tests

#### Test Authentication
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Authentication', () => {
  test('User can register', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'patient'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  test('User can login', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

#### Test Protected Routes
```javascript
// tests/patients.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Patients API', () => {
  let token;
  
  beforeEach(async () => {
    // Login and get token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'patient@example.com',
        password: 'password123'
      });
    token = response.body.token;
  });

  test('Get patient profile', async () => {
    const response = await request(app)
      .get('/api/v1/patients/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('firstName');
  });
});
```

### Manual Testing with curl

#### Health Check
```bash
curl -X GET http://localhost:5000/api/v1/health
```

#### User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'
```

#### Access Protected Route
```bash
# Replace YOUR_TOKEN_HERE with actual JWT token
curl -X GET http://localhost:5000/api/v1/patients/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Deployment Guide

### Docker Deployment

#### Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/medivoy
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: medivoy
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine

volumes:
  postgres_data:
```

#### Deploy with Docker
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f app

# Run migrations
docker-compose exec app npm run migrate

# Stop services
docker-compose down
```

### Cloud Deployment (Heroku)

#### Preparation
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-medivoy-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-jwt-secret
heroku config:set DATABASE_URL=your-production-database-url
```

#### Deploy
```bash
# Add Heroku remote
git remote add heroku https://git.heroku.com/your-medivoy-api.git

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate

# Scale dynos
heroku ps:scale web=1
```

### Cloud Deployment (AWS/EC2)

#### Security Setup
```bash
# Create EC2 instance
# Configure security groups (open ports 80, 443, 22)
# Setup SSL certificate with Let's Encrypt

# Install dependencies on server
sudo apt update
sudo apt install -y nodejs npm postgresql redis-server

# Clone repository
git clone https://github.com/MyTimeToShine777/medivoy-backend.git
cd medivoy-backend

# Install dependencies
npm install --production

# Setup PM2 for process management
npm install -g pm2
pm2 start src/server.js --name "medivoy-api"

# Setup nginx reverse proxy
sudo apt install nginx
sudo systemctl enable nginx
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/medivoy-api
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Database Connection Issues
```bash
# Error: ECONNREFUSED
Solution: Check if PostgreSQL is running
sudo systemctl status postgresql

# Error: Authentication failed
Solution: Check database credentials in .env file
```

#### JWT Token Issues
```bash
# Error: JsonWebTokenError
Solution: Check JWT_SECRET is set correctly
# Verify token format: Authorization: Bearer <token>
```

#### Port Already in Use
```bash
# Error: listen EADDRINUSE :::5000
Solution: Kill existing process or change port
lsof -ti:5000 | xargs kill -9
# or change PORT in .env
```

#### Module Not Found Errors
```bash
# Error: Cannot find module
Solution: Install missing dependencies
npm install
# Check if node_modules exists and has correct permissions
```

#### CORS Issues
```bash
# Error: No 'Access-Control-Allow-Origin' header
Solution: Check CORS configuration in app.js
# Ensure your frontend URL is in allowed origins
```

### Debugging Tips

#### Enable Debug Logging
```javascript
// Add to .env
DEBUG=medivoy:*
LOG_LEVEL=debug
```

#### Check Application Logs
```bash
# PM2 logs
pm2 logs medivoy-api

# Docker logs
docker-compose logs app

# Heroku logs
heroku logs --tail
```

#### Database Query Debugging
```bash
# Enable Sequelize logging
# In config/database.js
logging: console.log,
logQueryParameters: true
```

---

## 📋 Best Practices

### Security Best Practices

#### Password Security
```javascript
// Always hash passwords
const bcrypt = require('bcrypt');
const saltRounds = 12;

const hashedPassword = await bcrypt.hash(password, saltRounds);
```

#### Input Validation
```javascript
// Use validation middleware
const { body, validationResult } = require('express-validator');

// Example validation
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

#### Rate Limiting
```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Performance Best Practices

#### Database Optimization
```javascript
// Use database indexes
// In model definitions
User.init({
  email: {
    type: DataTypes.STRING,
    unique: true,
    index: true
  }
});

// Use pagination in queries
const patients = await Patient.findAndCountAll({
  limit: 10,
  offset: (page - 1) * 10
});
```

#### Caching Strategy
```javascript
// Cache frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache doctor list
app.get('/api/v1/doctors', async (req, res) => {
  const cacheKey = 'doctors:list';
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const doctors = await Doctor.findAll();
  await client.setex(cacheKey, 3600, JSON.stringify(doctors));
  res.json(doctors);
});
```

### Code Organization Best Practices

#### Error Handling
```javascript
// Centralized error handling
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Global error handler
app.use((err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

#### Response Format Consistency
```javascript
// Use consistent response format
const response = require('../utils/response');

// Success response
res.status(200).json(response.success(data, 'Operation successful'));

// Error response
res.status(400).json(response.error('Validation failed', errors));
```

---

## 📚 Additional Resources

### API Documentation
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Postman Collection**: Available in `/docs/postman-collection.json`

### Learning Resources
- [Express.js Official Documentation](https://expressjs.com/)
- [Sequelize ORM Guide](https://sequelize.org/)
- [JWT Authentication Best Practices](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Support
- **GitHub Issues**: [Report bugs here](https://github.com/MyTimeToShine777/medivoy-backend/issues)
- **Documentation**: Check `/docs` folder for detailed API documentation

---

## 🎉 Conclusion

This comprehensive guide covers everything you need to understand, set up, develop, and deploy the Medivoy Healthcare API. The system is designed with scalability, security, and maintainability in mind, following industry best practices for healthcare application development.

### Next Steps
1. Set up your development environment
2. Run the initial migration and seed data
3. Explore the API endpoints using the documentation
4. Customize the system for your specific healthcare needs
5. Deploy to your preferred cloud platform

Happy coding! 🚀
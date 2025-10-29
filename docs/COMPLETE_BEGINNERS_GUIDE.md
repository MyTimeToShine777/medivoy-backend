# Medivoy Backend - Complete A-Z Beginner's Guide
## Your First Big Backend Project Made Easy

**Welcome!** 🎉 This guide will walk you through everything you need to know to set up, understand, and run the Medivoy Healthcare Backend API. Don't worry if you're new to backend development - we'll explain everything step by step!

---

## Table of Contents

1. [What is Medivoy?](#what-is-medivoy)
2. [Prerequisites](#prerequisites)
3. [Understanding the Project Structure](#understanding-the-project-structure)
4. [Installation Guide](#installation-guide)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Running the Application](#running-the-application)
8. [Testing the API](#testing-the-api)
9. [Understanding Key Concepts](#understanding-key-concepts)
10. [Common Issues & Solutions](#common-issues-solutions)
11. [Deployment Guide](#deployment-guide)
12. [Next Steps](#next-steps)

---

## What is Medivoy?

Medivoy is a **complete healthcare management system backend** that helps:
- **Patients** find hospitals, doctors, and book treatments
- **Hospitals** manage their services and patients
- **Doctors** manage appointments and patient records
- **Admins** oversee the entire system

### Key Features:
- 🏥 Hospital & Doctor Management
- 📅 Appointment Booking System
- 💳 Payment Processing
- 🌍 Multilingual Support (12 languages)
- 📸 Image Management with CDN
- 💬 Chat & Video Call System
- 📊 Analytics Dashboard
- 🔒 Secure Authentication
- 📱 RESTful API

---

## Prerequisites

Before you start, you need to install these tools on your computer:

### 1. Node.js (JavaScript Runtime)
**What it is:** Node.js lets you run JavaScript on your computer (not just in browsers)

**Installation:**
- Go to [nodejs.org](https://nodejs.org/)
- Download the **LTS version** (Long Term Support)
- Install it (just click Next, Next, Finish)
- Verify installation:
  ```bash
  node --version
  # Should show: v18.x.x or higher
  
  npm --version
  # Should show: 9.x.x or higher
  ```

### 2. PostgreSQL (Database)
**What it is:** PostgreSQL stores all your data (users, hospitals, bookings, etc.)

**Installation:**

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Remember the password you set for the `postgres` user!
4. Default port: 5432

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Verify:**
```bash
psql --version
# Should show: psql (PostgreSQL) 14.x
```

### 3. Redis (Cache & Queue System)
**What it is:** Redis is super-fast storage for temporary data and background jobs

**Installation:**

**Windows:**
1. Download from [redis.io](https://redis.io/download)
2. Or use WSL (Windows Subsystem for Linux)

**Mac:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

**Verify:**
```bash
redis-cli ping
# Should show: PONG
```

### 4. Git (Version Control)
**What it is:** Git tracks changes in your code

**Installation:**
- Download from [git-scm.com](https://git-scm.com/)
- Install with default settings

**Verify:**
```bash
git --version
# Should show: git version 2.x.x
```

### 5. Code Editor (VS Code Recommended)
**What it is:** Where you'll write and edit code

**Installation:**
- Download [VS Code](https://code.visualstudio.com/)
- Install these extensions:
  - ESLint
  - Prettier
  - REST Client
  - GitLens

---

## Understanding the Project Structure

Let's understand what each folder does:

```
medivoy-backend/
├── src/                          # Main source code
│   ├── config/                   # Configuration files
│   │   ├── database.js          # Database connection
│   │   ├── redis.js             # Redis connection
│   │   └── logger.js            # Logging setup
│   │
│   ├── controllers/              # Handle requests (business logic)
│   │   ├── auth.controller.js   # Login, register, etc.
│   │   ├── hospital.controller.js
│   │   ├── doctor.controller.js
│   │   └── ...
│   │
│   ├── models/                   # Database tables (schemas)
│   │   ├── User.model.js        # User table
│   │   ├── Hospital.model.js    # Hospital table
│   │   └── ...
│   │
│   ├── routes/                   # API endpoints (URLs)
│   │   ├── index.js             # Main router
│   │   └── v1/                  # Version 1 routes
│   │       ├── auth.routes.js
│   │       ├── hospitals.routes.js
│   │       └── ...
│   │
│   ├── middleware/               # Functions that run before controllers
│   │   ├── auth.middleware.js   # Check if user is logged in
│   │   ├── validation.middleware.js
│   │   └── ...
│   │
│   ├── services/                 # Reusable business logic
│   │   ├── email.service.js     # Send emails
│   │   ├── googleTranslate.service.js
│   │   ├── imagekit.service.js
│   │   └── ...
│   │
│   ├── workers/                  # Background jobs
│   │   └── translation.worker.js
│   │
│   ├── utils/                    # Helper functions
│   │   ├── logger.js
│   │   └── helpers.js
│   │
│   └── server.js                 # Main application file
│
├── tests/                        # Test files
│   ├── unit/
│   └── integration/
│
├── docs/                         # Documentation
│   ├── API_DOCUMENTATION.md
│   └── ...
│
├── migrations/                   # Database changes
│   └── ...
│
├── .env                          # Environment variables (secrets)
├── .env.example                  # Example environment file
├── package.json                  # Project dependencies
└── README.md                     # Project overview
```

### Key Concepts:

**Controllers:** Handle incoming requests and send responses
```javascript
// Example: When user visits /api/v1/hospitals
exports.getAllHospitals = async (req, res) => {
  const hospitals = await Hospital.findAll();
  res.json({ success: true, data: hospitals });
};
```

**Models:** Define database tables
```javascript
// Example: Hospital table structure
const Hospital = sequelize.define('Hospital', {
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING
});
```

**Routes:** Map URLs to controllers
```javascript
// Example: Define what happens at /api/v1/hospitals
router.get('/hospitals', hospitalController.getAllHospitals);
```

**Middleware:** Functions that run before controllers
```javascript
// Example: Check if user is logged in
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  next(); // Continue to controller
};
```

---

## Installation Guide

### Step 1: Clone the Repository

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux):

```bash
# Navigate to where you want the project
cd Desktop

# Clone the repository
git clone https://github.com/MyTimeToShine777/medivoy-backend.git

# Enter the project folder
cd medivoy-backend

# You should see all the project files now
ls  # Mac/Linux
dir # Windows
```

### Step 2: Install Dependencies

**What are dependencies?** These are pre-built code packages that our project needs to work.

```bash
# Install all dependencies (this might take 2-3 minutes)
npm install

# You should see a progress bar and then "added XXX packages"
```

**What just happened?**
- npm read `package.json` to see what packages we need
- It downloaded all packages from the internet
- Packages are stored in `node_modules` folder

### Step 3: Verify Installation

```bash
# Check if everything installed correctly
npm list --depth=0

# You should see a list of packages like:
# ├── express@4.18.2
# ├── sequelize@6.35.2
# ├── etc...
```

---

## Environment Configuration

### What are Environment Variables?

Environment variables are **secret settings** that change based on where your app runs (development, production, etc.). They include:
- Database passwords
- API keys
- Secret tokens

**Why not put them in code?**
- Security: Passwords shouldn't be in code
- Flexibility: Different settings for dev/production
- Safety: Can't accidentally share secrets on GitHub

### Step 1: Create .env File

```bash
# Copy the example file
cp .env.example .env

# On Windows, use:
copy .env.example .env
```

### Step 2: Edit .env File

Open `.env` in your code editor and fill in the values:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=5000
API_VERSION=v1

# ============================================
# DATABASE CONFIGURATION (PostgreSQL)
# ============================================
# This is where your data is stored
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medivoy_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here  # ⚠️ CHANGE THIS!
DB_DIALECT=postgres

# ============================================
# JWT (Authentication Tokens)
# ============================================
# These are used to create secure login tokens
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random  # ⚠️ CHANGE THIS!
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=another_super_secret_key_for_refresh_tokens  # ⚠️ CHANGE THIS!
JWT_REFRESH_EXPIRES_IN=7d

# ============================================
# REDIS CONFIGURATION (Cache & Queues)
# ============================================
# Redis stores temporary data and handles background jobs
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Leave empty if no password

# ============================================
# EMAIL CONFIGURATION (SendGrid)
# ============================================
# For sending emails (verification, password reset, etc.)
SENDGRID_API_KEY=your_sendgrid_api_key_here  # Get from sendgrid.com
EMAIL_FROM=noreply@medivoy.com
EMAIL_FROM_NAME=Medivoy Healthcare

# ============================================
# GOOGLE TRANSLATE API
# ============================================
# For automatic translation to multiple languages
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key  # Get from Google Cloud
# OR use service account:
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# ============================================
# IMAGEKIT (Image Storage & CDN)
# ============================================
# For storing and delivering images fast worldwide
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key  # Get from imagekit.io
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# ============================================
# PAYMENT GATEWAYS
# ============================================
# Stripe (International payments)
STRIPE_SECRET_KEY=your_stripe_secret_key  # Get from stripe.com
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Razorpay (Indian payments)
RAZORPAY_KEY_ID=your_razorpay_key_id  # Get from razorpay.com
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ============================================
# TWILIO (SMS & Video Calls)
# ============================================
TWILIO_ACCOUNT_SID=your_twilio_account_sid  # Get from twilio.com
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# CLOUDINARY (Alternative Image Storage)
# ============================================
CLOUDINARY_CLOUD_NAME=your_cloud_name  # Get from cloudinary.com
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ============================================
# CORS (Cross-Origin Resource Sharing)
# ============================================
# Which websites can access your API
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# ============================================
# RATE LIMITING
# ============================================
# Prevent abuse by limiting requests
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window

# ============================================
# FILE UPLOAD LIMITS
# ============================================
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp,svg,pdf

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=debug  # debug, info, warn, error
LOG_FILE=logs/app.log
```

### Step 3: Get API Keys

You'll need to sign up for these services (all have free tiers):

#### 1. SendGrid (Email Service)
1. Go to [sendgrid.com](https://sendgrid.com/)
2. Sign up for free account
3. Verify your email
4. Go to Settings → API Keys
5. Create new API key
6. Copy and paste into `.env`

#### 2. Google Translate API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable "Cloud Translation API"
4. Create credentials (API Key)
5. Copy and paste into `.env`

#### 3. ImageKit (Image CDN)
1. Go to [imagekit.io](https://imagekit.io/)
2. Sign up for free account
3. Go to Developer Options
4. Copy Public Key, Private Key, and URL Endpoint
5. Paste into `.env`

#### 4. Stripe (Payments) - Optional
1. Go to [stripe.com](https://stripe.com/)
2. Sign up
3. Get test API keys from Dashboard
4. Paste into `.env`

**Don't worry!** You can start without these API keys. The app will work, but some features (email, translation, image upload) won't work until you add them.

---

## Database Setup

### Step 1: Create Database

Open your terminal and connect to PostgreSQL:

```bash
# Connect to PostgreSQL
psql -U postgres

# You'll be asked for the password you set during installation
```

Inside PostgreSQL, create the database:

```sql
-- Create database
CREATE DATABASE medivoy_db;

-- Verify it was created
\l

-- You should see medivoy_db in the list

-- Exit PostgreSQL
\q
```

### Step 2: Run Migrations

**What are migrations?** They create all the tables in your database.

```bash
# Run migrations to create tables
npm run migrate

# You should see:
# == 20240101000000-create-users: migrating =======
# == 20240101000000-create-users: migrated (0.123s)
# ... (more migrations)
```

**What just happened?**
- Migrations created tables like: users, hospitals, doctors, bookings, etc.
- Each table has columns (fields) defined in the migration files

### Step 3: Verify Tables

```bash
# Connect to database
psql -U postgres -d medivoy_db

# List all tables
\dt

# You should see tables like:
# users
# hospitals
# doctors
# bookings
# treatments
# etc...

# Exit
\q
```

### Step 4: Seed Database (Optional)

**What is seeding?** Adding sample data for testing.

```bash
# Add sample data
npm run seed

# This adds:
# - Sample users
# - Sample hospitals
# - Sample doctors
# - Sample treatments
```

---

## Running the Application

### Development Mode (with auto-restart)

```bash
# Start the server in development mode
npm run dev

# You should see:
# [INFO] Server running on port 5000
# [INFO] Database connected successfully
# [INFO] Redis connected successfully
```

**What's happening?**
- Server starts on `http://localhost:5000`
- Watches for file changes
- Auto-restarts when you save files
- Shows detailed logs

### Production Mode

```bash
# Start in production mode
npm start

# Less verbose logging
# No auto-restart
```

### Verify It's Working

Open your browser and go to:
```
http://localhost:5000/api/v1
```

You should see:
```json
{
  "status": "success",
  "message": "Medivoy Healthcare API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/v1/auth",
    "hospitals": "/api/v1/hospitals",
    ...
  }
}
```

🎉 **Congratulations!** Your backend is running!

---

## Testing the API

### Method 1: Using cURL (Command Line)

```bash
# Test registration
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "patient"
  }'

# Test login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Test getting hospitals
curl http://localhost:5000/api/v1/hospitals
```

### Method 2: Using Postman (Recommended for Beginners)

1. **Download Postman:**
   - Go to [postman.com](https://www.postman.com/)
   - Download and install

2. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `Medivoy_API_Collection.json` from the project
   - All endpoints are now ready to test!

3. **Test an Endpoint:**
   - Select "Auth → Register"
   - Click "Send"
   - See the response

### Method 3: Using VS Code REST Client

1. **Install Extension:**
   - Open VS Code
   - Install "REST Client" extension

2. **Create Test File:**
   ```http
   ### Register User
   POST http://localhost:5000/api/v1/auth/register
   Content-Type: application/json

   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "password": "SecurePass123!",
     "role": "patient"
   }

   ### Login
   POST http://localhost:5000/api/v1/auth/login
   Content-Type: application/json

   {
     "email": "john@example.com",
     "password": "SecurePass123!"
   }
   ```

3. **Run Request:**
   - Click "Send Request" above each request
   - See response below

---

## Understanding Key Concepts

### 1. RESTful API

**What is REST?**
REST (Representational State Transfer) is a way to design APIs using HTTP methods:

- **GET:** Retrieve data (like viewing a webpage)
- **POST:** Create new data (like submitting a form)
- **PUT:** Update existing data (like editing a profile)
- **DELETE:** Remove data (like deleting a post)

**Example:**
```
GET    /api/v1/hospitals     → Get all hospitals
GET    /api/v1/hospitals/1   → Get hospital with ID 1
POST   /api/v1/hospitals     → Create new hospital
PUT    /api/v1/hospitals/1   → Update hospital with ID 1
DELETE /api/v1/hospitals/1   → Delete hospital with ID 1
```

### 2. Authentication & Authorization

**Authentication:** Proving who you are (login)
**Authorization:** Checking what you can do (permissions)

**How it works:**
1. User logs in with email/password
2. Server creates a JWT token (like a digital ID card)
3. User sends token with each request
4. Server verifies token and allows/denies access

**Example:**
```javascript
// Login returns a token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Use token in subsequent requests
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Database Relationships

**One-to-Many:** One hospital has many doctors
```javascript
Hospital (1) ←→ (Many) Doctors
```

**Many-to-Many:** Doctors can work at multiple hospitals
```javascript
Doctors (Many) ←→ (Many) Hospitals
```

**One-to-One:** User has one profile
```javascript
User (1) ←→ (1) Profile
```

### 4. Middleware

Middleware functions run **before** your controller:

```javascript
Request → Middleware 1 → Middleware 2 → Controller → Response
```

**Common middleware:**
- Authentication: Check if user is logged in
- Validation: Check if data is correct
- Logging: Record what happened
- Error handling: Catch and handle errors

### 5. Async/Await

**Why?** Database operations take time. We don't want to freeze the app.

```javascript
// ❌ Wrong (synchronous - freezes app)
const hospitals = getHospitals();
console.log(hospitals);

// ✅ Correct (asynchronous - doesn't freeze)
const hospitals = await getHospitals();
console.log(hospitals);
```

### 6. Error Handling

Always handle errors gracefully:

```javascript
try {
  const hospital = await Hospital.findByPk(id);
  if (!hospital) {
    return res.status(404).json({
      success: false,
      message: 'Hospital not found'
    });
  }
  res.json({ success: true, data: hospital });
} catch (error) {
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: error.message
  });
}
```

---

## Common Issues & Solutions

### Issue 1: "Port 5000 already in use"

**Problem:** Another app is using port 5000

**Solution:**
```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process using port 5000
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 2: "Database connection failed"

**Problem:** Can't connect to PostgreSQL

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # Mac/Linux
   sudo systemctl status postgresql
   
   # Windows
   # Check Services app
   ```

2. Verify credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password  # ⚠️ Check this!
   ```

3. Test connection:
   ```bash
   psql -U postgres -d medivoy_db
   ```

### Issue 3: "Redis connection failed"

**Problem:** Redis not running

**Solution:**
```bash
# Start Redis
# Mac/Linux:
redis-server

# Or as service:
sudo systemctl start redis

# Windows:
# Start Redis from installation folder
```

### Issue 4: "Module not found"

**Problem:** Missing dependencies

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue 5: "JWT token invalid"

**Problem:** Token expired or wrong secret

**Solutions:**
1. Login again to get new token
2. Check `JWT_SECRET` in `.env`
3. Token expires after 24 hours (default)

### Issue 6: "Migration failed"

**Problem:** Database migration error

**Solution:**
```bash
# Undo all migrations
npm run migrate:undo:all

# Run migrations again
npm run migrate
```

### Issue 7: "Cannot upload images"

**Problem:** ImageKit not configured

**Solution:**
1. Sign up at [imagekit.io](https://imagekit.io/)
2. Get API keys
3. Add to `.env`:
   ```env
   IMAGEKIT_PUBLIC_KEY=your_key
   IMAGEKIT_PRIVATE_KEY=your_key
   IMAGEKIT_URL_ENDPOINT=your_endpoint
   ```

---

## Deployment Guide

### Option 1: Deploy to Heroku (Easiest)

1. **Install Heroku CLI:**
   ```bash
   # Mac
   brew install heroku/brew/heroku
   
   # Windows
   # Download from heroku.com
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   heroku create medivoy-backend
   ```

4. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Add Redis:**
   ```bash
   heroku addons:create heroku-redis:hobby-dev
   ```

6. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   # ... set all other variables
   ```

7. **Deploy:**
   ```bash
   git push heroku main
   ```

8. **Run Migrations:**
   ```bash
   heroku run npm run migrate
   ```

9. **Open App:**
   ```bash
   heroku open
   ```

### Option 2: Deploy to AWS (Advanced)

See `DEPLOYMENT_GUIDE.md` for detailed AWS deployment instructions.

### Option 3: Deploy to DigitalOcean (Intermediate)

See `DEPLOYMENT_GUIDE.md` for DigitalOcean deployment instructions.

---

## Next Steps

### 1. Learn More

**Recommended Resources:**
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [Sequelize Documentation](https://sequelize.org/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

### 2. Customize the Project

**Ideas:**
- Add new features (e.g., pharmacy module)
- Customize email templates
- Add more payment gateways
- Implement real-time notifications

### 3. Build the Frontend

**Technologies:**
- React.js
- Next.js
- Vue.js
- React Native (mobile)

### 4. Add More Tests

```bash
# Run tests
npm test

# Add new tests in tests/ folder
```

### 5. Improve Performance

- Add caching with Redis
- Optimize database queries
- Use CDN for static files
- Implement pagination

### 6. Enhance Security

- Add rate limiting
- Implement 2FA
- Add CAPTCHA
- Regular security audits

---

## Getting Help

### Documentation
- **API Docs:** `docs/COMPLETE_API_DOCUMENTATION.md`
- **Multilingual Guide:** `docs/MULTILINGUAL_SYSTEM.md`
- **ImageKit Guide:** `docs/IMAGEKIT_INTEGRATION.md`

### Community
- **GitHub Issues:** Report bugs or ask questions
- **Stack Overflow:** Search for solutions
- **Discord/Slack:** Join developer communities

### Contact
- **Email:** support@medivoy.com
- **GitHub:** [MyTimeToShine777/medivoy-backend](https://github.com/MyTimeToShine777/medivoy-backend)

---

## Congratulations! 🎉

You've successfully set up your first big backend project! You now have:

✅ A complete healthcare management system  
✅ RESTful API with 126+ endpoints  
✅ Authentication & authorization  
✅ Database with relationships  
✅ Multilingual support  
✅ Image management with CDN  
✅ Payment processing  
✅ Real-time features  

**Keep learning, keep building!** 🚀

---

**Last Updated:** October 29, 2024  
**Version:** 1.0.0  
**Author:** Medivoy Team
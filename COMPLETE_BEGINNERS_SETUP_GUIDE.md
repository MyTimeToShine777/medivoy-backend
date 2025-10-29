# 🚀 Medivoy Backend - Complete Beginner's Setup Guide

## Welcome! 👋

This guide will help you set up and run the Medivoy Healthcare Backend API from scratch, even if you're completely new to backend development.

---

## 📋 Table of Contents

1. [What You'll Need](#what-youll-need)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Understanding the Project](#understanding-the-project)
4. [Testing the API](#testing-the-api)
5. [Using the API Documentation](#using-the-api-documentation)
6. [Common Issues and Solutions](#common-issues-and-solutions)
7. [Next Steps](#next-steps)

---

## 🛠️ What You'll Need

### Required Software (Must Have)
1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - This runs JavaScript on your computer
   - Check if installed: Open terminal and type `node --version`

2. **Git** (for downloading the code)
   - Download from: https://git-scm.com/
   - This helps you manage code versions
   - Check if installed: Type `git --version`

3. **A Code Editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/
   - This is where you'll view and edit code

### Optional Software (Nice to Have)
1. **PostgreSQL** (database)
   - Download from: https://www.postgresql.org/
   - The API works WITHOUT this, but you'll see empty data
   - Only install if you want to store real data

2. **Postman** (for testing API)
   - Download from: https://www.postman.com/
   - Makes testing API endpoints easier
   - Not required - you can use the built-in Swagger UI

---

## 📥 Step-by-Step Setup

### Step 1: Download the Code

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
# Navigate to where you want to store the project
cd Desktop  # or any folder you prefer

# Download the code from GitHub
git clone https://github.com/MyTimeToShine777/medivoy-backend.git

# Enter the project folder
cd medivoy-backend
```

**What just happened?**
- You downloaded all the code files to your computer
- You're now inside the project folder

---

### Step 2: Install Dependencies

Dependencies are pre-built code packages that our project needs to work.

```bash
# Install all required packages
npm install
```

**What's happening?**
- npm (Node Package Manager) is downloading all required packages
- This might take 2-5 minutes
- You'll see a progress bar

**Expected output:**
```
added 1000+ packages in 2m
```

---

### Step 3: Configure Environment Variables

Environment variables are settings that tell the app how to run.

```bash
# Copy the example environment file
cp .env.example .env
```

**What's in the .env file?**
- Database connection settings (optional)
- API keys for external services (optional)
- Port number (where the API runs)

**Important:** The API works WITHOUT configuring these! You'll just see empty data until you set up a database.

---

### Step 4: Start the Server

Now let's run the API!

```bash
# Start the development server
npm run dev
```

**What you'll see:**
```
🚀 Server running on http://localhost:5000
📚 API Documentation: http://localhost:5000/api-docs
🏥 API Base URL: http://localhost:5000/api/v1
🌍 Environment: development
⏰ Started at: 2025-10-29T18:55:00.000Z

⚠️  Note: Some database connections are not available:
   - PostgreSQL: Not connected
   - MongoDB: Not connected
   - Redis: Not connected

✅ Server will continue with available connections
```

**Don't worry about the warnings!** The API is designed to work without databases. You'll just see empty data until you configure them.

---

### Step 5: Verify It's Working

Open your web browser and visit:

**Health Check:**
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-10-29T18:55:00.763Z",
  "uptime": 47.359056247,
  "environment": "development",
  "version": "1.0.0"
}
```

**✅ Success!** Your API is running!

---

## 📚 Understanding the Project

### Project Structure

```
medivoy-backend/
├── src/                    # All source code
│   ├── controllers/        # Handle API requests
│   ├── routes/            # Define API endpoints
│   ├── models/            # Database structure
│   ├── middleware/        # Security & validation
│   ├── services/          # Business logic
│   └── utils/             # Helper functions
├── .env                   # Configuration (you created this)
├── package.json           # Project dependencies
└── README.md             # Project information
```

### What Each Part Does

**Controllers** 📋
- Handle incoming requests
- Process data
- Send responses
- Example: `src/controllers/auth.controller.js` handles login/register

**Routes** 🛣️
- Define API endpoints (URLs)
- Connect URLs to controllers
- Example: `/api/v1/auth/login` → auth controller

**Models** 🗄️
- Define database structure
- Represent data (users, patients, doctors, etc.)
- Example: `User.model.js` defines user data structure

**Middleware** 🛡️
- Security checks (authentication)
- Data validation
- Error handling
- Example: Check if user is logged in before allowing access

**Services** ⚙️
- Business logic
- Complex operations
- External API calls
- Example: Send emails, process payments

---

## 🧪 Testing the API

### Method 1: Using Swagger UI (Easiest)

1. **Open Swagger UI:**
   ```
   http://localhost:5000/api-docs
   ```

2. **Browse Endpoints:**
   - You'll see all 126+ endpoints organized by category
   - Click on any endpoint to expand it

3. **Try an Endpoint:**
   - Click "Try it out"
   - Fill in any required parameters
   - Click "Execute"
   - See the response below

**Example: Test Health Endpoint**
1. Find "Health & Monitoring" section
2. Click on `GET /api/v1/health`
3. Click "Try it out"
4. Click "Execute"
5. See the response!

---

### Method 2: Using cURL (Command Line)

Open a new terminal window (keep the server running in the first one):

**Test Health:**
```bash
curl http://localhost:5000/health
```

**Test API Health:**
```bash
curl http://localhost:5000/api/v1/health
```

**Test Register (will show validation error - that's expected!):**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

### Method 3: Using Postman

1. **Open Postman**
2. **Create a new request:**
   - Method: GET
   - URL: `http://localhost:5000/api/v1/health`
3. **Click "Send"**
4. **See the response**

---

## 📖 Using the API Documentation

### Accessing Documentation

**Swagger UI (Interactive):**
```
http://localhost:5000/api-docs
```

**Features:**
- ✅ Browse all 126+ endpoints
- ✅ See request/response examples
- ✅ Test endpoints directly
- ✅ View data schemas
- ✅ Authentication examples

### Understanding Endpoints

Each endpoint shows:

1. **HTTP Method** (GET, POST, PUT, DELETE)
   - GET: Retrieve data
   - POST: Create new data
   - PUT: Update existing data
   - DELETE: Remove data

2. **URL Path**
   - Example: `/api/v1/patients`

3. **Parameters**
   - What data you need to send

4. **Responses**
   - What you'll get back

5. **Authentication**
   - 🔒 = Requires login
   - 🔓 = Public access

---

### Example: Understanding an Endpoint

**Endpoint:** `GET /api/v1/patients`

**What it does:** Get a list of all patients

**Authentication:** Required (🔒)

**Parameters:**
- `page` (optional): Which page of results (default: 1)
- `limit` (optional): How many results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Patients retrieved successfully",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 0,
    "totalRecords": 0
  }
}
```

**Why is data empty?**
- No database configured yet
- No patients created yet
- This is normal for a fresh installation!

---

## 🔐 Authentication Flow

Most endpoints require authentication. Here's how it works:

### Step 1: Register a User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "role": "patient"
  }'
```

**Note:** This will fail without a database, but shows you the format!

### Step 2: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (if database was configured):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "patient"
    }
  }
}
```

### Step 3: Use the Token

Copy the token and use it in subsequent requests:

```bash
curl http://localhost:5000/api/v1/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Common Issues and Solutions

### Issue 1: "Port 5000 is already in use"

**Problem:** Another application is using port 5000

**Solution:**
```bash
# Option 1: Stop the other application
# Option 2: Use a different port
PORT=3000 npm run dev
```

---

### Issue 2: "Cannot find module"

**Problem:** Dependencies not installed

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

### Issue 3: "Database connection error"

**Problem:** PostgreSQL not configured

**Solution:** This is normal! The API works without a database. You'll just see empty data.

**To fix (optional):**
1. Install PostgreSQL
2. Create a database
3. Update `.env` file with database credentials
4. Run migrations: `npm run migrate`

---

### Issue 4: "npm: command not found"

**Problem:** Node.js not installed

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install it
3. Restart your terminal
4. Try again

---

### Issue 5: Server won't start

**Problem:** Various reasons

**Solution:**
```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Check if port is available
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Try running with more details
npm run dev --verbose
```

---

## 🎯 Next Steps

### For Learning

1. **Explore the API:**
   - Open Swagger UI: http://localhost:5000/api-docs
   - Try different endpoints
   - See what data they return

2. **Read the Code:**
   - Open `src/controllers/auth.controller.js`
   - See how login works
   - Try to understand the flow

3. **Make Changes:**
   - Edit a controller
   - Add a console.log()
   - See your changes in action

### For Development

1. **Set Up Database:**
   - Install PostgreSQL
   - Create a database
   - Update `.env` file
   - Run migrations

2. **Add Sample Data:**
   - Run seeders: `npm run seed`
   - Now you'll see real data!

3. **Test with Frontend:**
   - Connect your frontend app
   - Use the API base URL: `http://localhost:5000/api/v1`

### For Production

1. **Configure Environment:**
   - Set up production database
   - Add API keys for external services
   - Set strong JWT secrets

2. **Deploy:**
   - Choose a hosting provider (Heroku, AWS, DigitalOcean)
   - Follow deployment guide
   - Configure domain and SSL

3. **Monitor:**
   - Set up logging
   - Monitor errors
   - Track performance

---

## 📞 Getting Help

### Documentation

- **API Documentation:** http://localhost:5000/api-docs
- **Complete Guide:** See `COMPLETE_API_DOCUMENTATION.md`
- **Deployment Guide:** See `DEPLOYMENT_GUIDE.md`

### Resources

- **Node.js Docs:** https://nodejs.org/docs/
- **Express.js Docs:** https://expressjs.com/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## 🎉 Congratulations!

You've successfully set up the Medivoy Healthcare Backend API!

### What You've Learned

✅ How to download code from GitHub
✅ How to install dependencies
✅ How to start a Node.js server
✅ How to test API endpoints
✅ How to read API documentation
✅ How to troubleshoot common issues

### What You Can Do Now

✅ Explore all 126+ API endpoints
✅ Test endpoints using Swagger UI
✅ Understand how the API works
✅ Make changes and see results
✅ Connect a frontend application
✅ Deploy to production

---

## 🚀 Quick Reference

### Start Server
```bash
npm run dev
```

### Stop Server
```
Press Ctrl+C in the terminal
```

### View Documentation
```
http://localhost:5000/api-docs
```

### Test Health
```
http://localhost:5000/health
```

### API Base URL
```
http://localhost:5000/api/v1
```

---

## 📝 Summary

**What is this project?**
- A complete healthcare management API
- 126+ endpoints for managing patients, doctors, hospitals, appointments, etc.
- Built with Node.js and Express.js
- Production-ready and fully documented

**What can you do with it?**
- Build a healthcare management system
- Create a patient portal
- Develop a doctor booking app
- Integrate with existing healthcare software

**What's included?**
- ✅ User authentication and authorization
- ✅ Patient management
- ✅ Doctor management
- ✅ Hospital management
- ✅ Appointment booking
- ✅ Payment processing
- ✅ Medical records
- ✅ Prescriptions
- ✅ Lab tests
- ✅ Insurance management
- ✅ Reviews and ratings
- ✅ Notifications
- ✅ File uploads
- ✅ Chat system
- ✅ Video calls
- ✅ Analytics
- ✅ And much more!

---

**Happy Coding! 🎉**

If you have any questions, check the documentation or explore the code. Everything is designed to be beginner-friendly!

---

**Version:** 1.0.0  
**Last Updated:** October 29, 2025  
**Status:** ✅ Production Ready
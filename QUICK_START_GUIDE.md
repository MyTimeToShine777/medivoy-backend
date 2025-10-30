# 🚀 Medivoy Backend API - Quick Start Guide

**Get started in 5 minutes!**

---

## 📦 What You Have Now

✅ **Clean Codebase** - No duplicates, organized structure  
✅ **287 Endpoints** - Fully documented across 40 categories  
✅ **Complete Documentation** - API guide with examples  
✅ **Postman Collection** - Ready-to-import testing tool  
✅ **Testing Scripts** - Automated endpoint discovery  

---

## ⚡ Quick Start (3 Steps)

### Step 1: Start the Server (30 seconds)

```bash
cd /workspace
npm start
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
✅ Health check available at: http://localhost:5000/api/v1/health
```

### Step 2: Test Health Endpoint (10 seconds)

```bash
curl http://localhost:5000/api/v1/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Medivoy Backend API is running",
  "timestamp": "2024-10-30T12:00:00.000Z",
  "uptime": 123.456
}
```

### Step 3: Import Postman Collection (2 minutes)

1. Open Postman
2. Click **"Import"**
3. Select `Medivoy_API_Postman_Collection.json`
4. Done! You now have 287 ready-to-test endpoints

---

## 📚 Documentation Files

| File | Purpose | Size |
|------|---------|------|
| **COMPLETE_API_DOCUMENTATION.md** | Full API guide with examples | Comprehensive |
| **API_ENDPOINTS_COMPLETE.md** | List of all 287 endpoints | Reference |
| **PROJECT_FINAL_SUMMARY.md** | Project completion details | Summary |
| **Medivoy_API_Postman_Collection.json** | Postman testing collection | 287 requests |

---

## 🎯 Key Endpoints to Try First

### 1. Health Check (No Auth Required)
```http
GET /api/v1/health
```

### 2. Register a User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient"
}
```

### 3. Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

### 4. Get User Profile (Requires Token)
```http
GET /api/v1/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📊 Endpoint Categories (287 Total)

<details>
<summary><b>Click to expand all categories</b></summary>

- **Authentication** (11) - Register, login, password reset
- **Users** (5) - User management
- **Doctors** (6) - Doctor profiles
- **Hospitals** (6) - Hospital management
- **Patients** (5) - Patient records
- **Appointments** (8) - Booking and scheduling
- **Bookings** (7) - Booking management
- **Medical Records** (5) - Patient history
- **Prescriptions** (5) - Prescription management
- **Lab Tests** (5) - Laboratory orders
- **Laboratories** (5) - Lab management
- **DNA Kits** (10) - DNA testing
- **Payments** (5) - Payment processing
- **Invoices** (5) - Invoice management
- **Insurance** (5) - Insurance claims
- **Subscriptions** (7) - Subscription plans
- **Packages** (5) - Healthcare packages
- **Coupons** (6) - Discount codes
- **Reviews** (6) - Ratings and reviews
- **Notifications** (7) - User notifications
- **Chat** (11) - Messaging system
- **Video Calls** (11) - Video consultations
- **Support** (6) - Customer support
- **FAQs** (6) - Help articles
- **Media** (15) - File uploads
- **Analytics** (7) - Dashboard metrics
- **System Settings** (10) - Configuration
- **Terms & Privacy** (15) - Legal documents
- **Website Content** (7) - CMS
- **Treatments** (7) - Treatment info
- **Treatment Categories** (5) - Categorization
- **Doctor Schedules** (7) - Availability
- **Integrations** (7) - Third-party APIs
- **Audit Logs** (8) - System logs
- **Staff** (8) - Staff management
- **Translations** (6) - Multi-language
- **Uploads** (7) - File handling
- **Booking Status** (9) - Status tracking

</details>

---

## 🔧 Useful Commands

### Server Management
```bash
# Start server
npm start

# Start in development mode
npm run dev

# Run tests
npm test
```

### Documentation
```bash
# Regenerate endpoint list
node test_all_endpoints.js

# Regenerate Postman collection
node generate_postman_collection.js
```

### Git Operations
```bash
# Check status
git status

# View recent commits
git log --oneline -5

# Pull latest changes
git pull origin main
```

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 5000 is in use
lsof -ti:5000

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Try starting again
npm start
```

### Database Connection Issues
- Server works without database (graceful degradation)
- Configure `.env` file for production database
- Check PostgreSQL connection settings

### Redis Connection Issues
- Server works without Redis (uses memory store)
- Configure `.env` file for production Redis
- Check Redis connection settings

---

## 📞 Need Help?

1. **Documentation:** Read `COMPLETE_API_DOCUMENTATION.md`
2. **Endpoints:** Check `API_ENDPOINTS_COMPLETE.md`
3. **Summary:** Review `PROJECT_FINAL_SUMMARY.md`
4. **GitHub:** https://github.com/MyTimeToShine777/medivoy-backend

---

## ✨ What's Next?

### For Development:
- [ ] Test endpoints using Postman
- [ ] Configure database connection
- [ ] Set up Redis for caching
- [ ] Customize endpoints as needed

### For Production:
- [ ] Configure production environment
- [ ] Set up SSL certificates
- [ ] Configure domain and DNS
- [ ] Deploy to cloud platform
- [ ] Set up monitoring and logging

---

**🎉 You're all set! Happy coding!**

---

**Last Updated:** October 30, 2024  
**API Version:** 1.0.0  
**Total Endpoints:** 287
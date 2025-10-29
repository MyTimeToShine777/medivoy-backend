# Medivoy Backend - Quick Start Guide
## Get Up and Running in 10 Minutes! ⚡

This is the **fastest way** to get your Medivoy backend running. Perfect for beginners!

---

## 🎯 What You'll Need (5 minutes to install)

1. **Node.js** - [Download here](https://nodejs.org/) (Choose LTS version)
2. **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
3. **Redis** - [Download here](https://redis.io/download)
4. **Git** - [Download here](https://git-scm.com/)

**Install them all, then come back here!**

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get the Code
```bash
# Open your terminal and run:
git clone https://github.com/MyTimeToShine777/medivoy-backend.git
cd medivoy-backend
```

### Step 2: Install Dependencies
```bash
npm install
```
*This will take 2-3 minutes. Go grab a coffee! ☕*

### Step 3: Setup Environment
```bash
# Copy the example environment file
cp .env.example .env

# On Windows, use:
copy .env.example .env
```

**Edit `.env` file and change these 3 things:**
```env
DB_PASSWORD=your_postgres_password  # ⚠️ CHANGE THIS!
JWT_SECRET=make_this_a_long_random_string  # ⚠️ CHANGE THIS!
JWT_REFRESH_SECRET=another_long_random_string  # ⚠️ CHANGE THIS!
```

### Step 4: Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside PostgreSQL, run:
CREATE DATABASE medivoy_db;
\q
```

### Step 5: Setup Tables
```bash
npm run migrate
```

### Step 6: Start the Server
```bash
npm run dev
```

**🎉 Done! Your server is running at http://localhost:5000**

---

## ✅ Test It Works

Open your browser and go to:
```
http://localhost:5000/api/v1
```

You should see:
```json
{
  "status": "success",
  "message": "Medivoy Healthcare API",
  "version": "1.0.0"
}
```

**Success!** 🎊

---

## 🧪 Try Your First API Call

### Using cURL (Terminal):
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "patient"
  }'
```

### Using Browser (Postman):
1. Download [Postman](https://www.postman.com/)
2. Import `Medivoy_API_Collection.json`
3. Click "Auth → Register"
4. Click "Send"

---

## 📚 What's Next?

### For Complete Setup:
Read: `docs/COMPLETE_BEGINNERS_GUIDE.md`

### For API Documentation:
Read: `docs/COMPLETE_API_DOCUMENTATION.md`

### For Advanced Features:
- **Multilingual System:** `docs/MULTILINGUAL_SYSTEM.md`
- **Image Management:** `docs/IMAGEKIT_INTEGRATION.md`

---

## 🆘 Having Issues?

### "Port 5000 already in use"
```bash
# Change port in .env
PORT=5001
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
# Mac/Linux:
sudo systemctl status postgresql

# Windows: Check Services app
```

### "Redis connection failed"
```bash
# Start Redis
redis-server
```

### Still stuck?
Check: `docs/COMPLETE_BEGINNERS_GUIDE.md` → "Common Issues & Solutions"

---

## 🎓 Learning Resources

**New to Backend Development?**
1. Start with: `docs/COMPLETE_BEGINNERS_GUIDE.md`
2. Understand concepts: REST API, Authentication, Databases
3. Try all endpoints in Postman
4. Read the code and comments

**Want to Deploy?**
See: `docs/DEPLOYMENT_GUIDE.md`

---

## 📞 Get Help

- **Documentation:** Check `docs/` folder
- **Issues:** [GitHub Issues](https://github.com/MyTimeToShine777/medivoy-backend/issues)
- **Email:** support@medivoy.com

---

**Happy Coding!** 🚀

*Made with ❤️ by the Medivoy Team*
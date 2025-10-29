# Running Medivoy Backend Without Docker

This guide explains how to run the Medivoy Healthcare Backend without Docker.

## 🔧 Changes Made

### 1. Replaced bcrypt with bcryptjs
- **Why**: `bcrypt` requires native compilation which can cause issues on Windows
- **Solution**: Replaced with `bcryptjs` (pure JavaScript implementation)
- **Files Updated**:
  - `package.json`
  - `src/controllers/auth.controller.js`
  - `src/models/User.model.js`
  - `src/seeders/01-admin-user.js`

### 2. Made Database Connections Optional
- **Why**: Allow the server to run without database connections
- **Solution**: Updated database configuration files to warn instead of exit
- **Files Updated**:
  - `src/config/database.js` - PostgreSQL connection now optional
  - `src/config/mongodb.js` - MongoDB connection now optional
  - `src/config/redis.js` - Redis connection now optional with mock fallback
  - `src/server.js` - Graceful handling of missing connections

## 🚀 Quick Start (Without Docker)

### Step 1: Install Dependencies

```bash
# Remove old node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Install dependencies with bcryptjs
pnpm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file (optional - server will run without databases)
# You can leave database settings as-is or configure them later
```

### Step 3: Start the Server

```bash
# Start development server
pnpm run dev
```

The server will start even without database connections!

## ⚠️ Expected Warnings

When running without databases, you'll see warnings like:

```
⚠️  Unable to connect to PostgreSQL: connection refused
⚠️  Application will continue without database connection
⚠️  Please configure database settings in .env file

⚠️  MongoDB connection error: connection refused
⚠️  Application will continue without MongoDB connection

⚠️  Redis not available: connection refused
⚠️  Application will continue without Redis caching
```

**This is normal!** The server will continue running with limited functionality.

## 📊 What Works Without Databases?

### ✅ Working Features:
- Server starts successfully
- API documentation accessible at http://localhost:5000/api-docs
- Health check endpoint works
- All routes are registered
- Swagger UI is available

### ⚠️ Limited Features:
- Authentication endpoints (require PostgreSQL)
- User management (require PostgreSQL)
- Data storage and retrieval (require PostgreSQL/MongoDB)
- Caching (requires Redis)
- Session management (requires Redis)

## 🗄️ Setting Up Databases (Optional)

If you want full functionality, you have two options:

### Option 1: Use Docker (Recommended)

```bash
# Start all databases
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Install Locally

#### PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE medivoy_db;
```

#### MongoDB
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath C:\data\db
```

#### Redis
```bash
# Windows (using Chocolatey)
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server
```

### Update .env File

After installing databases, update your `.env` file:

```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=medivoy_db

# MongoDB
MONGODB_URI=mongodb://localhost:27017/medivoy

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## 🔍 Verification

### Check Server Status

```bash
# Health check
curl http://localhost:5000/health

# API documentation
# Open in browser: http://localhost:5000/api-docs
```

### Check Database Connections

Look for these messages in the console:

```
✅ PostgreSQL connection established successfully
✅ MongoDB connected successfully
✅ Redis connected successfully
```

Or warnings if not connected:

```
⚠️  PostgreSQL: Not connected
⚠️  MongoDB: Not connected
⚠️  Redis: Not connected
```

## 🐛 Troubleshooting

### Issue: bcrypt Error

**Error**: `Cannot find module 'bcrypt_lib.node'`

**Solution**: 
```bash
# Remove node_modules
rm -rf node_modules pnpm-lock.yaml

# Reinstall with bcryptjs
pnpm install
```

### Issue: Database Connection Errors

**Error**: Connection refused or timeout

**Solution**: 
- The server will continue running with warnings
- Install databases locally or use Docker
- Update .env with correct connection details

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Change port in .env
PORT=3000

# Or kill the process using the port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

## 📝 Development Workflow

### Without Databases (Testing/Development)

```bash
# Start server
pnpm run dev

# Server runs with warnings
# Test API documentation and routes
# Develop frontend integration
```

### With Databases (Full Functionality)

```bash
# Option 1: Start Docker databases
docker-compose up -d

# Option 2: Start local databases
# (PostgreSQL, MongoDB, Redis services)

# Start server
pnpm run dev

# All features available
```

## 🎯 Next Steps

1. **Test the Server**: Visit http://localhost:5000/api-docs
2. **Set Up Databases**: Choose Docker or local installation
3. **Configure Environment**: Update .env with your settings
4. **Run Migrations**: `pnpm run migrate` (when database is ready)
5. **Seed Data**: `pnpm run seed` (when database is ready)
6. **Start Development**: Begin building your application

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Need Help?

If you encounter issues:

1. Check the console logs for specific error messages
2. Verify your .env configuration
3. Ensure all dependencies are installed: `pnpm install`
4. Try removing node_modules and reinstalling
5. Check if ports are available (5000, 5432, 27017, 6379)

---

**Status**: ✅ Server can now run without Docker!

**Date**: October 29, 2024
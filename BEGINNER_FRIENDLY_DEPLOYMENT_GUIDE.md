# 🚀 Medivoy Healthcare Backend - Beginner Friendly Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [API Testing](#api-testing)
7. [Common Issues & Solutions](#common-issues--solutions)
8. [Production Deployment](#production-deployment)

## 🔧 Prerequisites

### Required Software:
1. **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download PostgreSQL](https://www.postgresql.org/download/)
3. **Redis** (v6 or higher) - [Download Redis](https://redis.io/download)
4. **Git** - [Download Git](https://git-scm.com/downloads)
5. **Code Editor** - Recommended: VS Code

### Optional but Recommended:
- **Postman** - For API testing
- **Docker** - For easier deployment
- **PM2** - Process manager for production

## 🚀 Quick Start (5 Minute Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/MyTimeToShine777/medivoy-backend.git
cd medivoy-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Basic Configuration
```bash
# Copy environment template
cp .env.example .env
```

### 4. Quick Test Run (Development Mode)
```bash
# Start without database (for testing)
npm start
```

**That's it!** Your API is running at `http://localhost:5000`

## 🛠️ Complete Environment Setup

### Step 1: Database Setup

#### PostgreSQL Setup:
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE medivoydb;
CREATE USER medivoy_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE medivoydb TO medivoy_user;
\q
```

#### Redis Setup:
```bash
# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

### Step 2: Environment Configuration

Edit the `.env` file with your settings:

```env
# Application Settings
NODE_ENV=development
PORT=5000
APP_NAME=Medivoy Healthcare System

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=medivoy_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=medivoydb

# Redis Configuration  
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# Email Configuration
EMAIL_VERIFICATION_DISABLED=true  # Set to false for production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=Medivoy <noreply@medivoy.com>

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Settings
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Install Additional Dependencies

```bash
# Install process manager for production
npm install -g pm2

# Install database CLI tools (optional)
npm install -g sequelize-cli
```

## 🏃‍♂️ Running the Application

### Development Mode:
```bash
# Start with auto-reload
npm run dev

# Or start normally
npm start
```

### Production Mode:
```bash
# Start with PM2
pm2 start src/server.js --name "medivoy-backend"

# Check status
pm2 status

# View logs
pm2 logs medivoy-backend

# Restart application
pm2 restart medivoy-backend

# Stop application
pm2 stop medivoy-backend
```

## 🧪 API Testing Guide

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "first_name": "John",
    "last_name": "Doe",
    "role": "patient",
    "phone": "+1234567890"
  }'
```

### 3. User Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 4. Access Protected Endpoint
```bash
# First get your token from login response, then:
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. View All Available Endpoints
```bash
curl http://localhost:5000/api/v1/
```

### Using Postman:
1. Import this collection: `[Postman Collection Link]`
2. Set environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: Your JWT token from login
3. Start testing endpoints!

## 🔍 Common Issues & Solutions

### Issue 1: Database Connection Failed
**Error**: `ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Check your .env file for correct database credentials
```

### Issue 2: Redis Connection Failed
**Error**: `Redis connection error`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping

# Start Redis if not running
sudo systemctl start redis-server

# For development, you can also run without Redis
# (the app will use memory storage)
```

### Issue 3: JWT Token Invalid
**Error**: `JsonWebTokenError: invalid signature`

**Solution**:
1. Make sure `JWT_SECRET` is set in `.env`
2. Check that you're using the correct token
3. Token expires after `JWT_EXPIRE` duration

### Issue 4: Port Already in Use
**Error**: `EADDRINUSE :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)

# Or change port in .env
PORT=3000
```

### Issue 5: Module Not Found
**Error**: `MODULE_NOT_FOUND`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

## 🌐 Production Deployment

### Option 1: Traditional Server (Ubuntu/CentOS)

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Install Nginx (for reverse proxy)
sudo apt install nginx
```

#### Step 2: Application Deployment
```bash
# Clone repository
git clone https://github.com/MyTimeToShine777/medivoy-backend.git
cd medivoy-backend

# Install dependencies
npm ci --production

# Configure production environment
cp .env.example .env
# Edit .env with production settings

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 3: Nginx Configuration
```nginx
# /etc/nginx/sites-available/medivoy
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

### Option 2: Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - POSTGRES_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: medivoydb
      POSTGRES_USER: medivoy_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Step 3: Run Docker
```bash
# Build and start
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 3: Cloud Deployment (AWS/DigitalOcean/Azure)

#### AWS EC2 Deployment:
1. Launch EC2 instance (Ubuntu 20.04 LTS)
2. Follow traditional server setup steps
3. Configure security groups (ports 22, 80, 443)
4. Set up domain and SSL certificate
5. Deploy application with PM2

#### DigitalOcean App Platform:
1. Connect GitHub repository
2. Configure environment variables
3. Set up database (DigitalOcean Managed Database)
4. Deploy with automatic scaling

## 📊 Monitoring & Maintenance

### Application Monitoring:
```bash
# PM2 Monitoring
pm2 monit

# Check logs
pm2 logs medivoy-backend --lines 100

# Application metrics
curl http://localhost:5000/health
```

### Database Monitoring:
```bash
# PostgreSQL connection status
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Redis monitoring
redis-cli info stats
```

### Log Management:
```bash
# Application logs
tail -f logs/app.log

# Error logs
tail -f logs/error.log

# System logs
journalctl -u medivoy-backend -f
```

## 🔐 Security Best Practices

### 1. Environment Security:
- Never commit `.env` files to version control
- Use strong, unique passwords for database
- Change default JWT secrets
- Use HTTPS in production

### 2. Application Security:
```bash
# Install security updates
npm audit fix

# Set proper file permissions
chmod 600 .env
chmod 755 scripts/*.sh

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. Database Security:
```sql
-- Create limited database user
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Enable SSL connections
ALTER SYSTEM SET ssl = 'on';
```

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** - Use tools like New Relic, DataDog, or open-source alternatives
2. **Configure backups** - Automated database backups
3. **Set up CI/CD** - GitHub Actions or Jenkins for automated deployments
4. **Add load testing** - Tools like Artillery or K6
5. **Implement analytics** - Track API usage and performance

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Look at [GitHub Issues](https://github.com/MyTimeToShine777/medivoy-backend/issues)
3. Review the [API Documentation](http://localhost:5000/api-docs)
4. Check application logs for detailed error messages

## 🎉 Congratulations!

You've successfully set up the Medivoy Healthcare Backend! The API is now ready to power healthcare applications with features like:

- ✅ User authentication and authorization
- ✅ Patient and doctor management
- ✅ Appointment scheduling
- ✅ Medical records management
- ✅ Payment processing
- ✅ Real-time notifications
- ✅ File uploads and media management
- ✅ Comprehensive API documentation

Happy coding! 🚀
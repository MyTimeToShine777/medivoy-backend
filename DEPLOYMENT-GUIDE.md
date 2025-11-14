# Medivoy Backend - Deployment Guide

## Prerequisites

### Required
- Node.js v18+ or v20+
- PostgreSQL 14+ database
- npm or pnpm package manager

### Optional (for full functionality)
- Redis (for caching and distributed rate limiting)
- MongoDB (for secondary storage if needed)
- Payment Gateway credentials (Razorpay/Stripe)
- ImageKit credentials (for file uploads)
- Twilio credentials (for SMS notifications)

---

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd medivoy-backend
npm install  # or pnpm install
```

### 2. Configure Environment

Copy the `.env.example` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=production
PORT=5000
APP_NAME="Medivoy Healthcare System"
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-frontend-domain.com

# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@localhost:5432/medivoy?schema=public"

# JWT Secrets (REQUIRED - must be 32+ characters)
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-secure-refresh-secret-minimum-32-characters
JWT_REFRESH_EXPIRE=30d

# Encryption (REQUIRED - must be 32+ characters)
ENCRYPTION_KEY=your-encryption-key-minimum-32-characters-long
BCRYPT_ROUNDS=10

# Session
SESSION_SECRET=your-session-secret-change-in-production

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Optional: Redis (for caching)
REDIS_URL=redis://localhost:6379

# Optional: MongoDB (for secondary storage)
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/medivoy

# Optional: Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Payment Gateways
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-public-key

# Optional: File Storage
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Optional: SMS
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Or push schema directly (for development):

```bash
npm run prisma:push
```

### 4. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

---

## Deployment Options

### Option 1: Traditional VPS/Server

1. Set up server (Ubuntu/Debian recommended)
2. Install Node.js, PostgreSQL, Redis
3. Clone repository and install dependencies
4. Configure .env file
5. Set up systemd service or PM2
6. Configure reverse proxy (Nginx/Apache)
7. Set up SSL certificates (Let's Encrypt)

#### Example PM2 Setup

```bash
npm install -g pm2
pm2 start npm --name "medivoy-backend" -- start
pm2 save
pm2 startup
```

#### Example Nginx Config

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run prisma:generate
EXPOSE 5000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/medivoy
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=medivoy
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Heroku
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy: `git push heroku main`

#### Railway
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically on push

#### AWS/GCP/Azure
1. Set up EC2/Compute Engine/VM
2. Follow VPS instructions above
3. Configure security groups/firewall
4. Set up load balancer if needed

---

## Health Checks

### Application Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-14T14:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### Database Connection
Check server logs on startup for:
- ✅ PostgreSQL connected successfully
- ✅ Redis connected successfully (if configured)
- ✅ MongoDB connected successfully (if configured)

---

## Monitoring

### Logs
- Application logs: Console output or PM2 logs
- Database logs: PostgreSQL logs
- Nginx logs: `/var/log/nginx/`

### Metrics
Consider setting up:
- Application Performance Monitoring (APM) like New Relic, Datadog
- Log aggregation like ELK stack, Papertrail
- Uptime monitoring like Uptime Robot, Pingdom

---

## Security Checklist

Before deploying to production:

- [ ] Change all default secrets in .env
- [ ] JWT_SECRET is 32+ characters and random
- [ ] ENCRYPTION_KEY is 32+ characters and random
- [ ] DATABASE_URL uses strong password
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN set to your frontend domain
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules configured
- [ ] Database backups configured
- [ ] Rate limiting enabled (Redis recommended)
- [ ] Security headers enabled (Helmet)
- [ ] Input validation active
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection active

---

## Troubleshooting

### Database Connection Issues
```
Error: Can't reach database server
```
**Solution**: 
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Check firewall rules
- Verify network connectivity

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**:
- Change PORT in .env
- Stop other process using port: `lsof -ti:5000 | xargs kill`

### Redis Connection Errors
```
redis client error ECONNREFUSED
```
**Solution**:
- If Redis not needed, remove REDIS_URL from .env
- If needed, verify Redis is running
- Check Redis connection string

### Module Not Found
```
Error: Cannot find module
```
**Solution**:
- Run `npm install` again
- Delete node_modules and package-lock.json, reinstall
- Run `npm run prisma:generate`

---

## Support

For issues or questions:
1. Check logs for detailed error messages
2. Review this deployment guide
3. Check ENDPOINT-TEST-RESULTS.md for endpoint status
4. Consult Prisma documentation for database issues
5. Open an issue in the repository

---

## Performance Tuning

### Database
- Enable connection pooling in DATABASE_URL
- Add database indexes for frequently queried fields
- Configure Prisma query optimization

### Caching
- Enable Redis for caching
- Configure cache TTLs appropriately
- Use cache warming for critical data

### Node.js
- Use cluster mode for multi-core utilization
- Configure appropriate memory limits
- Enable gzip compression (already configured)

### Monitoring
- Set up APM for performance insights
- Monitor response times and error rates
- Track database query performance

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Reverse proxy configured
- [ ] Process manager configured (PM2/systemd)
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Security headers verified
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment process


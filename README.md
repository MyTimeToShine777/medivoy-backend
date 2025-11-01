# 🏥 Medivoy Healthcare API Backend

## 📋 Overview

The Medivoy Healthcare API is a comprehensive, production-ready backend system designed for modern healthcare applications. Built with Node.js, Express, and Sequelize, it provides complete functionality for managing patients, doctors, hospitals, appointments, payments, and more.

## 🚀 Features

### 🏥 **Core Healthcare Features**
- **Patient Management**: Complete patient registration, profiles, and medical records
- **Doctor & Hospital Management**: Healthcare provider profiles and scheduling
- **Appointment System**: Booking, scheduling, and calendar management
- **Medical Records**: Comprehensive patient history and document management
- **Prescription Management**: Digital prescriptions and medication tracking

### 💼 **Business Operations**
- **Payment Processing**: Multi-gateway support (Stripe, Razorpay)
- **Insurance Management**: Insurance provider integration and claims
- **Subscription Plans**: Flexible pricing and subscription management
- **Billing & Invoices**: Automated invoicing and financial tracking

### 🔐 **Security & Authentication**
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions for different user types
- **Rate Limiting**: Redis-based rate limiting for API protection
- **Input Validation**: Comprehensive data validation with Joi schemas

### 📧 **Communication & Notifications**
- **Email Service**: Transactional emails with template support
- **SMS Notifications**: Twilio integration for appointment reminders
- **Push Notifications**: Firebase FCM for real-time alerts
- **In-App Notifications**: Database-driven notification system

### 📊 **Analytics & Reporting**
- **Dashboard Analytics**: Real-time metrics and KPIs
- **Custom Reports**: CSV, Excel, PDF generation
- **Performance Tracking**: Patient trends, revenue analytics

### 🖼️ **Media Storage**
- **ImageKit.io Integration**: Modern image and file upload service
- **File Management**: Secure media upload, storage, and retrieval
- **Image Optimization**: Automatic image resizing and optimization

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Cache**: Redis
- **File Storage**: ImageKit.io
- **Email**: SendGrid, SMTP
- **SMS**: Twilio
- **Payments**: Stripe, Razorpay
- **Documentation**: Swagger/OpenAPI 3.0

## 📚 API Documentation

### 🌐 Live Documentation
- **Swagger UI**: [Interactive API Documentation](https://3000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api-docs)
- **Health Check**: [Server Status](https://3000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/health)

### 📖 Complete Documentation
- **Comprehensive API Guide**: [COMPREHENSIVE_MEDIVOY_API_GUIDE.md](./COMPREHENSIVE_MEDIVOY_API_GUIDE.md)
- **API Reference**: [COMPLETE_API_DOCUMENTATION.md](./COMPLETE_API_DOCUMENTATION.md)
- **Beginner's Guide**: [MEDIVOY_BACKEND_COMPLETE_BEGINNER_GUIDE.md](./MEDIVOY_BACKEND_COMPLETE_BEGINNER_GUIDE.md)

### 📊 API Statistics
- **Total Endpoints**: 288 endpoints
- **Categories**: 41 categories
- **Coverage**: 100% documented with examples
- **Authentication**: JWT Bearer token required

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL (production) or SQLite (development)
- Redis (for caching and sessions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MyTimeToShine777/medivoy-backend.git
   cd medivoy-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   npm run migrate
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The server will be running on `http://localhost:3000`

## ⚙️ Environment Variables

### Core Configuration
```env
NODE_ENV=development
PORT=3000
APP_NAME=Medivoy Healthcare System
FRONTEND_URL=http://localhost:3000
```

### Database Configuration
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=medivoydb
```

### Authentication
```env
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d
```

### ImageKit.io Configuration
```env
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### External Services
```env
# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@medivoy.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Payments (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run test suite
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm run lint` - Run ESLint code quality checks

### Database Migrations
```bash
# Create new migration
npx sequelize-cli migration:generate --name migration_name

# Run migrations
npm run migrate

# Undo last migration
npx sequelize-cli db:migrate:undo
```

### API Testing
Use the included Postman collection or the interactive Swagger UI:
```bash
# Import Postman collection
# File: ENHANCED_POSTMAN_COLLECTION.json
```

## 📋 API Categories

### Authentication (11 endpoints)
- User registration and login
- Password reset and management
- Refresh token handling
- Role-based authentication

### Healthcare Management (156 endpoints)
- Patient registration and profiles
- Doctor and hospital management
- Appointment scheduling
- Medical records and prescriptions
- Laboratory tests and results

### Business Operations (58 endpoints)
- Payment processing and refunds
- Insurance management
- Subscription plans
- Invoices and billing

### System Administration (62 endpoints)
- User management and roles
- Analytics and reporting
- Notifications and messaging
- File and media management
- System configuration

## 🔐 Security Features

### Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt
- Session management with Redis

### API Security
- Rate limiting by user and endpoint
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

### Data Protection
- Environment variable management
- Encrypted sensitive data storage
- Secure file uploads with validation
- Audit logging for all operations

## 🚀 Production Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Setup
1. Set production environment variables
2. Configure PostgreSQL database
3. Set up Redis for caching
4. Configure ImageKit.io for file storage
5. Set up external service API keys

### Performance Optimization
- Enable Redis caching
- Configure database connection pooling
- Set up CDN for static assets
- Monitor with application logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@medivoy.com
- 📚 Documentation: [API Documentation](./COMPREHENSIVE_MEDIVOY_API_GUIDE.md)
- 🐛 Issues: [GitHub Issues](https://github.com/MyTimeToShine777/medivoy-backend/issues)

## 🎯 Roadmap

### Upcoming Features
- [ ] Telemedicine integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app API optimization
- [ ] Multi-language support
- [ ] Advanced reporting features

### Current Status
✅ Production-ready backend system  
✅ Complete API documentation  
✅ Comprehensive testing coverage  
✅ Security best practices  
✅ Scalable architecture  

---

**Built with ❤️ for the healthcare industry**

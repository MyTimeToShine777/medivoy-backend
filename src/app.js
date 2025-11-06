// Express App Configuration - NO optional chaining
// Production-Ready with Swagger, CORS, Security, Error Handling
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware.js';
import rateLimit from './middleware/rateLimit.middleware.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import consultationRoutes from './routes/consultation.routes.js';



const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================
app.use(helmet());

// ============================================================================
// CORS CONFIGURATION
// ============================================================================
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
}));

// ============================================================================
// RATE LIMITING
// ============================================================================
app.use(rateLimit);

// ============================================================================
// BODY PARSER MIDDLEWARE
// ============================================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// REQUEST LOGGING MIDDLEWARE
// ============================================================================
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    logger.debug(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ============================================================================
// API DOCUMENTATION - SWAGGER
// ============================================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Medivoy API Documentation',
}));

// ============================================================================
// API INFO ENDPOINT
// ============================================================================
app.get('/api/info', (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Medivoy API Information',
            app: {
                name: config.appName,
                version: '1.0.0',
                environment: config.nodeEnv,
                url: config.appUrl,
            },
            documentation: {
                swagger: `${config.appUrl}/api-docs`,
                postman: 'Import collection from Swagger docs',
            },
            endpoints: {
                auth: '/api/auth',
                users: '/api/users',
                bookings: '/api/bookings',
                payments: '/api/payments',
                consultations: '/api/consultations',
            },
            support: {
                email: 'support@medivoy.com',
                docs: 'https://docs.medivoy.com',
            },
        });
    } catch (error) {
        logger.error('Info endpoint error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================
app.get('/health', (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: config.nodeEnv,
            port: config.port,
        });
    } catch (error) {
        logger.error('Health check error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Health check failed',
        });
    }
});

// ============================================================================
// API VERSION ROOT
// ============================================================================
app.get('/api', (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Medivoy Medical Tourism Backend API',
            version: '1.0.0',
            routes: {
                auth: 'POST /api/auth/register, /api/auth/login, /api/auth/logout',
                users: 'GET/POST /api/users',
                bookings: 'GET/POST /api/bookings',
                payments: 'POST /api/payments',
                consultations: 'GET/POST /api/consultations',
                documentation: 'GET /api-docs',
                health: 'GET /health',
            },
        });
    } catch (error) {
        logger.error('Root API endpoint error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error',
        });
    }
});

// ============================================================================
// AUTH ROUTES
// ============================================================================
app.use('/api/auth', authRoutes);

// ============================================================================
// FUTURE ROUTES PLACEHOLDER
// ============================================================================
// app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/consultations', consultationRoutes);
// app.use('/api/medical-records', medicalRecordRoutes);
// app.use('/api/hospitals', hospitalRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/treatments', treatmentRoutes);
// app.use('/api/packages', packageRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/notifications', notificationRoutes);

// ============================================================================
// 404 NOT FOUND HANDLER
// ============================================================================
app.use((req, res) => {
    try {
        logger.warn(`404 Not Found: ${req.method} ${req.path}`);
        return res.status(404).json({
            success: false,
            message: 'Route not found',
            path: req.path,
            method: req.method,
            suggestions: [
                'Check the endpoint URL',
                'Verify the HTTP method',
                'See documentation at /api-docs',
                'Check /api for available routes',
            ],
        });
    } catch (error) {
        logger.error('404 handler error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE (MUST BE LAST)
// ============================================================================
app.use(errorHandlerMiddleware);

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

export default app;
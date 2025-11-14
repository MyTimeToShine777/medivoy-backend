'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';

// Initialize Express app
const app = express();

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

// Helmet - Security headers
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Prevent parameter pollution
app.use(hpp());

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// ═══════════════════════════════════════════════════════════════════════════════
// BODY PARSING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION & PASSPORT
// ═══════════════════════════════════════════════════════════════════════════════

app.use(session({
    secret: process.env.SESSION_SECRET || 'medivoy-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPRESSION
// ═══════════════════════════════════════════════════════════════════════════════

app.use(compression());

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Medivoy Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            api: '/api'
        }
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

import routes from './routes/index.js';
app.use('/', routes);

// ═══════════════════════════════════════════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;
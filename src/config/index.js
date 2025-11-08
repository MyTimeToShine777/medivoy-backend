'use strict';

import dotenv from 'dotenv';

dotenv.config();

/**
 * ULTRA-COMPREHENSIVE CONFIGURATION
 * All third-party services: ImageKit, Twilio, Stripe, Razorpay, SendGrid, etc.
 */

const config = {
    // ═══════════════════════════════════════════════════════════════════════════════
    // SERVER
    // ═══════════════════════════════════════════════════════════════════════════════
    server: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT, 10) || 5000,
        appName: process.env.APP_NAME || 'Medivoy',
        appVersion: process.env.APP_VERSION || '1.0.0',
        appUrl: process.env.APP_URL || 'http://localhost:5000',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production'
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // DATABASE
    // ═══════════════════════════════════════════════════════════════════════════════
    database: {
        url: process.env.DATABASE_URL || '',
        dialect: 'postgres',
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
            evict: 30000
        },
        retry: {
            max: 3,
            timeout: 3000,
            match: [/timeout/i, /ETIMEDOUT/, /ECONNREFUSED/]
        },
        dialectOptions: {
            connectTimeout: 20000,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // REDIS
    // ═══════════════════════════════════════════════════════════════════════════════
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        enabled: process.env.REDIS_ENABLED !== 'false',
        db: 0,
        prefix: 'medivoy:'
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // JWT
    // ═══════════════════════════════════════════════════════════════════════════════
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || '',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        algorithm: 'HS256'
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // IMAGEKIT (FILE UPLOADS)
    // ═══════════════════════════════════════════════════════════════════════════════
    imageKit: {
        enabled: !!(process.env.IMAGEKIT_PUBLIC_KEY &&
            process.env.IMAGEKIT_PRIVATE_KEY &&
            process.env.IMAGEKIT_URL_ENDPOINT),
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
        maxFileSize: 10485760, // 10MB
        folder: process.env.IMAGEKIT_FOLDER || '/medivoy'
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // TWILIO (SMS)
    // ═══════════════════════════════════════════════════════════════════════════════
    twilio: {
        enabled: !!(process.env.TWILIO_ACCOUNT_SID &&
            process.env.TWILIO_AUTH_TOKEN &&
            process.env.TWILIO_PHONE_NUMBER),
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // STRIPE PAYMENT
    // ═══════════════════════════════════════════════════════════════════════════════
    stripe: {
        enabled: !!(process.env.STRIPE_PUBLIC_KEY && process.env.STRIPE_SECRET_KEY),
        publicKey: process.env.STRIPE_PUBLIC_KEY || '',
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // RAZORPAY PAYMENT
    // ═══════════════════════════════════════════════════════════════════════════════
    razorpay: {
        enabled: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // SENDGRID EMAIL
    // ═══════════════════════════════════════════════════════════════════════════════
    sendGrid: {
        enabled: !!process.env.SENDGRID_API_KEY,
        apiKey: process.env.SENDGRID_API_KEY || '',
        fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@medivoy.com',
        fromName: process.env.SENDGRID_FROM_NAME || 'Medivoy'
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // GOOGLE OAUTH
    // ═══════════════════════════════════════════════════════════════════════════════
    googleOAuth: {
        enabled: !!(process.env.GOOGLE_OAUTH_CLIENT_ID &&
            process.env.GOOGLE_OAUTH_CLIENT_SECRET),
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
        redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // AGORA VIDEO
    // ═══════════════════════════════════════════════════════════════════════════════
    agora: {
        enabled: !!(process.env.AGORA_APP_ID && process.env.AGORA_APP_CERTIFICATE),
        appId: process.env.AGORA_APP_ID || '',
        appCertificate: process.env.AGORA_APP_CERTIFICATE || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // AWS S3
    // ═══════════════════════════════════════════════════════════════════════════════
    awsS3: {
        enabled: !!(process.env.AWS_ACCESS_KEY_ID &&
            process.env.AWS_SECRET_ACCESS_KEY &&
            process.env.AWS_S3_BUCKET_NAME),
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION || 'us-east-1',
        bucketName: process.env.AWS_S3_BUCKET_NAME || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // FIREBASE
    // ═══════════════════════════════════════════════════════════════════════════════
    firebase: {
        enabled: !!(process.env.FIREBASE_PROJECT_ID &&
            process.env.FIREBASE_PRIVATE_KEY),
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // CLOUDINARY
    // ═══════════════════════════════════════════════════════════════════════════════
    cloudinary: {
        enabled: !!(process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // CORS
    // ═══════════════════════════════════════════════════════════════════════════════
    cors: {
        origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // RATE LIMITING
    // ═══════════════════════════════════════════════════════════════════════════════
    rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000,
        maxRequests: 100
    }
};

export default config;
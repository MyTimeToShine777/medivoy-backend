// Main configuration aggregator
import dotenv from 'dotenv';

dotenv.config();

const config = {
    // Server
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,
    appName: process.env.APP_NAME || 'Medivoy',
    appUrl: process.env.APP_URL || 'http://localhost:5000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Database
    database: {
        url: process.env.DATABASE_URL || '',
        dialect: 'postgres',
        logging: process.env.DB_LOG === 'true',
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
    },

    // Redis
    redis: {
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    // ImageKit
    imageKit: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    },

    // Stripe
    stripe: {
        publicKey: process.env.STRIPE_PUBLIC_KEY || '',
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },

    // Razorpay
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || '',
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    },

    // SendGrid
    sendGrid: {
        apiKey: process.env.SENDGRID_API_KEY || '',
        fromEmail: process.env.SENDGRID_FROM_EMAIL || '',
        fromName: process.env.SENDGRID_FROM_NAME || 'Medivoy',
    },

    // Twilio
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },

    // Google Translate
    googleTranslate: {
        apiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '',
        projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID || '',
        supportedLanguages: process.env.SUPPORTED_LANGUAGES || 'en,hi,es,fr,de,it,pt,ru,ja,ko,zh,ar',
    },

    // Google Meet
    googleMeet: {
        enabled: process.env.GOOGLE_MEET_ENABLED === 'true',
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
        redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI || '',
    },

    // Agora
    agora: {
        appId: process.env.AGORA_APP_ID || '',
        appCertificate: process.env.AGORA_APP_CERTIFICATE || '',
        customerKey: process.env.AGORA_CUSTOMER_KEY || '',
        customerSecret: process.env.AGORA_CUSTOMER_SECRET || '',
    },

    // Cache
    cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        ttl: {
            short: parseInt(process.env.CACHE_TTL_SHORT) || 300,
            medium: parseInt(process.env.CACHE_TTL_MEDIUM) || 1800,
            long: parseInt(process.env.CACHE_TTL_LONG) || 3600,
            veryLong: parseInt(process.env.CACHE_TTL_VERY_LONG) || 86400,
        },
    },

    // Security
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
        encryptionKey: process.env.ENCRYPTION_KEY || 'default-key-change-in-production',
        encryptionAlgorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    },

    // CORS
    cors: {
        origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
        credentials: process.env.CORS_CREDENTIALS === 'true',
    },

    // Features
    features: {
        bookingEnabled: process.env.FEATURE_BOOKING_ENABLED === 'true',
        paymentsEnabled: process.env.FEATURE_PAYMENTS_ENABLED === 'true',
        consultationsEnabled: process.env.FEATURE_CONSULTATIONS_ENABLED === 'true',
        medicalRecordsEnabled: process.env.FEATURE_MEDICAL_RECORDS_ENABLED === 'true',
        multilingualEnabled: process.env.FEATURE_MULTILINGUAL_ENABLED === 'true',
        videoCallsEnabled: process.env.FEATURE_VIDEO_CALLS_ENABLED === 'true',
        insuranceEnabled: process.env.FEATURE_INSURANCE_ENABLED === 'true',
    },
};

export default config;
/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./config');
const loggerMiddleware = require('./middleware/logger.middleware');
const { apiLimiter } = require('./middleware/rate-limit.middleware');
const { errorMiddleware, notFoundHandler } = require('./middleware/error.middleware');
const routes = require('./routes');

// Create Express app
const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: config.env === 'production',
  crossOriginEmbedderPolicy: config.env === 'production'
}));

// CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================================================
// BODY PARSING MIDDLEWARE
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// COMPRESSION
// ============================================================================

app.use(compression());

// ============================================================================
// LOGGING
// ============================================================================

if (config.env === 'development') {
  app.use(loggerMiddleware);
}

// ============================================================================
// RATE LIMITING
// ============================================================================

app.use('/api', apiLimiter);

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Medivoy Healthcare API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// ============================================================================
// API ROUTES
// ============================================================================

app.use(`/api/${config.apiVersion}`, routes);

// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================

if (config.swagger.enabled) {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger');
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Medivoy API Documentation'
  }));
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorMiddleware);

// ============================================================================
// EXPORT APP
// ============================================================================

module.exports = app;
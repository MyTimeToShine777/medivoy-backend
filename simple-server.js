const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./ENHANCED_OPENAPI_SPEC.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Medivoy Healthcare API is running'
  });
});

// API routes (without database)
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// Mock authentication endpoint for testing
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.json({
      success: true,
      message: 'Login successful (mock)',
      data: {
        user: {
          id: 1,
          email: email,
          firstName: 'Test',
          lastName: 'User',
          role: 'patient'
        },
        token: 'mock_jwt_token_for_testing'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password required'
    });
  }
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Medivoy Healthcare API Documentation"
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Medivoy Healthcare API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      documentation: '/api-docs'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API base: http://localhost:${PORT}/api/v1`);
});
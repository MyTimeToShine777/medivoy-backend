const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');
const schemas = require('./swagger-schemas');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medivoy Healthcare API',
      version: '1.0.0',
      description: `
# Medivoy Healthcare Management System API

Complete REST API for healthcare management including:
- Patient Management
- Doctor Management
- Hospital Management
- Treatment & Package Management
- Booking & Appointment System
- Payment Processing
- Review & Rating System
- And much more...

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

## Base URL
- Development: http://localhost:${config.port}/api/${config.apiVersion}
- Production: ${config.frontendUrl}/api/${config.apiVersion}
      `,
      contact: {
        name: 'Medivoy API Support',
        email: 'support@medivoy.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Development server',
      },
      {
        url: `https://5000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/${config.apiVersion}`,
        description: 'Public sandbox server',
      },
      {
        url: `${config.frontendUrl}/api/${config.apiVersion}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer {token}',
        },
      },
      schemas: schemas,
      parameters: {
        pageParam: {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
          description: 'Page number for pagination',
        },
        limitParam: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 },
          description: 'Number of items per page',
        },
        searchParam: {
          in: 'query',
          name: 'search',
          schema: { type: 'string' },
          description: 'Search query',
        },
        sortParam: {
          in: 'query',
          name: 'sort',
          schema: { type: 'string' },
          description: 'Sort field (prefix with - for descending)',
        },
        idParam: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Resource ID',
        },
      },
      responses: {
        Success: {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        Created: {
          description: 'Resource created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        BadRequest: {
          description: 'Bad request - Invalid input',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Users', description: 'User management' },
      { name: 'Patients', description: 'Patient management' },
      { name: 'Doctors', description: 'Doctor management' },
      { name: 'Hospitals', description: 'Hospital management' },
      { name: 'Treatments', description: 'Treatment management' },
      { name: 'Treatment Categories', description: 'Treatment category management' },
      { name: 'Packages', description: 'Treatment package management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Appointments', description: 'Appointment management' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Invoices', description: 'Invoice management' },
      { name: 'Reviews', description: 'Review and rating system' },
      { name: 'Notifications', description: 'Notification management' },
      { name: 'Support Tickets', description: 'Customer support system' },
      { name: 'FAQs', description: 'Frequently asked questions' },
      { name: 'Website Content', description: 'Website content management' },
      { name: 'Translations', description: 'Multi-language support' },
      { name: 'Subscriptions', description: 'Subscription management' },
      { name: 'Media', description: 'File upload and management' },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/v1/*.js',
    './src/routes/**/*.js',
    './src/models/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
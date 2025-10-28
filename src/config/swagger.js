/**
 * Swagger/OpenAPI Configuration
 */

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medivoy Healthcare API',
      version: '1.0.0',
      description: 'Complete Healthcare Management System API - Production Ready',
      contact: {
        name: 'Medivoy Team',
        email: 'support@medivoy.com',
        url: 'https://medivoy.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Development server'
      },
      {
        url: `https://api.medivoy.com/api/${config.apiVersion}`,
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Success message'
            },
            data: {
              type: 'object'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              example: 100
            },
            page: {
              type: 'integer',
              example: 1
            },
            limit: {
              type: 'integer',
              example: 10
            },
            totalPages: {
              type: 'integer',
              example: 10
            },
            hasNextPage: {
              type: 'boolean',
              example: true
            },
            hasPrevPage: {
              type: 'boolean',
              example: false
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Patients', description: 'Patient management' },
      { name: 'Doctors', description: 'Doctor management' },
      { name: 'Hospitals', description: 'Hospital management' },
      { name: 'Treatments', description: 'Treatment catalog' },
      { name: 'Treatment Categories', description: 'Treatment taxonomy - Categories' },
      { name: 'Treatment Subcategories', description: 'Treatment taxonomy - Subcategories' },
      { name: 'Packages', description: 'Medical tour packages' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Appointments', description: 'Appointment scheduling' },
      { name: 'Medical Records', description: 'Medical document management' },
      { name: 'Prescriptions', description: 'Prescription management' },
      { name: 'Laboratories', description: 'Laboratory management' },
      { name: 'Lab Tests', description: 'Lab test management' },
      { name: 'Insurance', description: 'Insurance provider management' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Invoices', description: 'Invoice management' },
      { name: 'Reviews', description: 'Reviews and ratings' },
      { name: 'Notifications', description: 'Notification system' },
      { name: 'Support', description: 'Support ticket system' },
      { name: 'Subscriptions', description: 'Subscription management' },
      { name: 'Translations', description: 'Multi-language support' },
      { name: 'Analytics', description: 'Analytics and reporting' },
      { name: 'Dashboard', description: 'Dashboard data' },
      { name: 'Media', description: 'Media management' },
      { name: 'Coupons', description: 'Coupon management' },
      { name: 'FAQs', description: 'FAQ management' }
    ]
  },
  apis: [
    './src/routes/v1/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
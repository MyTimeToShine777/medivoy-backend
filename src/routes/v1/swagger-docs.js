const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Complete OpenAPI specification with all 288 endpoints
const completeSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Medivoy Healthcare API - Complete Documentation',
    version: '2.0.0',
    description:
      'Comprehensive healthcare management API with complete documentation for all 288 endpoints.\n\nThis API provides full functionality for:\n- Patient Management\n- Doctor Management  \n- Hospital Operations\n- Appointment Scheduling\n- Payment Processing\n- Medical Records\n- And much more...\n\n## Authentication\nMost endpoints require JWT authentication. Include the token in the Authorization header:\n```\nAuthorization: Bearer YOUR_JWT_TOKEN\n```',
    contact: {
      name: 'Medivoy API Team',
      email: 'api@medivoy.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server',
    },
    {
      url: 'https://3000-d3911e85-31b9-4b01-9734-b7792b2ea6a4.proxy.daytona.works/api/v1',
      description: 'Public sandbox server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authentication token',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
              },
              message: {
                type: 'string',
              },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                },
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
              },
              requestId: {
                type: 'string',
              },
            },
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
          },
          message: {
            type: 'string',
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
              },
              limit: {
                type: 'integer',
              },
              total: {
                type: 'integer',
              },
              totalPages: {
                type: 'integer',
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/analytics/dashboard': {
      get: {
        tags: ['analytics'],
        summary: 'GET analytics - dashboard',
        description:
          'GET operation for analytics\n\n**Category:** analytics\n**Method:** GET\n**Path:** /api/v1/analytics/dashboard',
        operationId: 'get_analytics__dashboard',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/analytics/bookings': {
      get: {
        tags: ['analytics'],
        summary: 'GET analytics - bookings',
        description:
          'GET operation for analytics\n\n**Category:** analytics\n**Method:** GET\n**Path:** /api/v1/analytics/bookings',
        operationId: 'get_analytics__bookings',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/analytics/revenue': {
      get: {
        tags: ['analytics'],
        summary: 'GET analytics - revenue',
        description:
          'GET operation for analytics\n\n**Category:** analytics\n**Method:** GET\n**Path:** /api/v1/analytics/revenue',
        operationId: 'get_analytics__revenue',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/analytics/hospitals/top': {
      get: {
        tags: ['analytics'],
        summary: 'GET analytics - top',
        description:
          'GET operation for analytics\n\n**Category:** analytics\n**Method:** GET\n**Path:** /api/v1/analytics/hospitals/top',
        operationId: 'get_analytics__hospitals_top',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/analytics/treatments/top': {
      get: {
        tags: ['analytics'],
        summary: 'GET analytics - top',
        description:
          'GET operation for analytics\n\n**Category:** analytics\n**Method:** GET\n**Path:** /api/v1/analytics/treatments/top',
        operationId: 'get_analytics__treatments_top',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/analytics/patients/demographics': {
      get: {
        tags: ['analytics'],
        summary: 'GET analytics - demographics',
        description:
          'GET operation for analytics\n\n**Category:** analytics\n**Method:** GET\n**Path:** /api/v1/analytics/patients/demographics',
        operationId: 'get_analytics__patients_demographics',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/analytics/doctors': {
      get: {
        tags: ['analytics'],
        summary: 'GET analytics - doctors',
        description:
          'GET operation for analytics\n\n**Category:** analytics\n**Method:** GET\n**Path:** /api/v1/analytics/doctors',
        operationId: 'get_analytics__doctors',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/appointments/': {
      post: {
        tags: ['appointments'],
        summary: 'Create new appointment',
        description:
          'Create a new appointment with the provided data. Validates all required fields.\n\n**Category:** appointments\n**Method:** POST\n**Path:** /api/v1/appointments/',
        operationId: 'post_appointments__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample appointment',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['appointments'],
        summary: 'Get all appointments',
        description:
          'Retrieve a paginated list of appointments. Supports filtering, searching, and sorting.\n\n**Category:** appointments\n**Method:** GET\n**Path:** /api/v1/appointments/',
        operationId: 'get_appointments__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/appointments/:id': {
      get: {
        tags: ['appointments'],
        summary: 'Get appointment by ID',
        description:
          'Retrieve detailed information about a specific appointment by their unique identifier.\n\n**Category:** appointments\n**Method:** GET\n**Path:** /api/v1/appointments/:id',
        operationId: 'get_appointments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['appointments'],
        summary: 'Update appointment',
        description:
          'Update all fields of an existing appointment. Requires all fields to be provided.\n\n**Category:** appointments\n**Method:** PUT\n**Path:** /api/v1/appointments/:id',
        operationId: 'put_appointments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample appointment',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['appointments'],
        summary: 'Delete appointment',
        description:
          'Permanently delete a appointment from the system. This action cannot be undone.\n\n**Category:** appointments\n**Method:** DELETE\n**Path:** /api/v1/appointments/:id',
        operationId: 'delete_appointments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/appointments/:id/status': {
      patch: {
        tags: ['appointments'],
        summary: 'Partially update appointment',
        description:
          'Partially update an existing appointment. Only provided fields will be updated.\n\n**Category:** appointments\n**Method:** PATCH\n**Path:** /api/v1/appointments/:id/status',
        operationId: 'patch_appointments___id_status',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample appointment',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/appointments/patient/:patientId': {
      get: {
        tags: ['appointments'],
        summary: 'GET appointments - patientId',
        description:
          'GET operation for appointments\n\n**Category:** appointments\n**Method:** GET\n**Path:** /api/v1/appointments/patient/:patientId',
        operationId: 'get_appointments__patient__patientId',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'patientId identifier',
            example: 'patientId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/appointments/doctor/:doctorId': {
      get: {
        tags: ['appointments'],
        summary: 'GET appointments - doctorId',
        description:
          'GET operation for appointments\n\n**Category:** appointments\n**Method:** GET\n**Path:** /api/v1/appointments/doctor/:doctorId',
        operationId: 'get_appointments__doctor__doctorId',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'doctorId identifier',
            example: 'doctorId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/auditLogs/': {
      get: {
        tags: ['auditLogs'],
        summary: 'Get all auditLogs',
        description:
          'Retrieve a paginated list of auditLogs. Supports filtering, searching, and sorting.\n\n**Category:** auditLogs\n**Method:** GET\n**Path:** /api/v1/auditLogs/',
        operationId: 'get_auditLogs__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ['auditLogs'],
        summary: 'Create new auditLog',
        description:
          'Create a new auditLog with the provided data. Validates all required fields.\n\n**Category:** auditLogs\n**Method:** POST\n**Path:** /api/v1/auditLogs/',
        operationId: 'post_auditLogs__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample auditLog',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auditLogs/user/:userId': {
      get: {
        tags: ['auditLogs'],
        summary: 'GET auditLogs - userId',
        description:
          'GET operation for auditLogs\n\n**Category:** auditLogs\n**Method:** GET\n**Path:** /api/v1/auditLogs/user/:userId',
        operationId: 'get_auditLogs__user__userId',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/auditLogs/entity/:entityType/:entityId': {
      get: {
        tags: ['auditLogs'],
        summary: 'GET auditLogs - entityId',
        description:
          'GET operation for auditLogs\n\n**Category:** auditLogs\n**Method:** GET\n**Path:** /api/v1/auditLogs/entity/:entityType/:entityId',
        operationId: 'get_auditLogs__entity__entityType__entityId',
        parameters: [
          {
            name: 'entityType',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'entityType identifier',
            example: 'entityType_123',
          },
          {
            name: 'entityId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'entityId identifier',
            example: 'entityId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/auditLogs/statistics': {
      get: {
        tags: ['auditLogs'],
        summary: 'GET auditLogs - statistics',
        description:
          'GET operation for auditLogs\n\n**Category:** auditLogs\n**Method:** GET\n**Path:** /api/v1/auditLogs/statistics',
        operationId: 'get_auditLogs__statistics',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/auditLogs/security-events': {
      get: {
        tags: ['auditLogs'],
        summary: 'GET auditLogs - security-events',
        description:
          'GET operation for auditLogs\n\n**Category:** auditLogs\n**Method:** GET\n**Path:** /api/v1/auditLogs/security-events',
        operationId: 'get_auditLogs__security-events',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/auditLogs/export': {
      get: {
        tags: ['auditLogs'],
        summary: 'GET auditLogs - export',
        description:
          'GET operation for auditLogs\n\n**Category:** auditLogs\n**Method:** GET\n**Path:** /api/v1/auditLogs/export',
        operationId: 'get_auditLogs__export',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/auditLogs/:id': {
      get: {
        tags: ['auditLogs'],
        summary: 'Get auditLog by ID',
        description:
          'Retrieve detailed information about a specific auditLog by their unique identifier.\n\n**Category:** auditLogs\n**Method:** GET\n**Path:** /api/v1/auditLogs/:id',
        operationId: 'get_auditLogs___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - register',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/register',
        operationId: 'post_auth__register',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - login',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/login',
        operationId: 'post_auth__login',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - logout',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/logout',
        operationId: 'post_auth__logout',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - refresh',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/refresh',
        operationId: 'post_auth__refresh',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['auth'],
        summary: 'GET auth - profile',
        description:
          'GET operation for auth\n\n**Category:** auth\n**Method:** GET\n**Path:** /api/v1/auth/profile',
        operationId: 'get_auth__profile',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['auth'],
        summary: 'PUT auth - profile',
        description:
          'PUT operation for auth\n\n**Category:** auth\n**Method:** PUT\n**Path:** /api/v1/auth/profile',
        operationId: 'put_auth__profile',
        parameters: [],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/change-password': {
      put: {
        tags: ['auth'],
        summary: 'PUT auth - change-password',
        description:
          'PUT operation for auth\n\n**Category:** auth\n**Method:** PUT\n**Path:** /api/v1/auth/change-password',
        operationId: 'put_auth__change-password',
        parameters: [],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - forgot-password',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/forgot-password',
        operationId: 'post_auth__forgot-password',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - reset-password',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/reset-password',
        operationId: 'post_auth__reset-password',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/verify-email': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - verify-email',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/verify-email',
        operationId: 'post_auth__verify-email',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/auth/resend-verification': {
      post: {
        tags: ['auth'],
        summary: 'POST auth - resend-verification',
        description:
          'POST operation for auth\n\n**Category:** auth\n**Method:** POST\n**Path:** /api/v1/auth/resend-verification',
        operationId: 'post_auth__resend-verification',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample aut',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/bookingStatus/:id': {
      put: {
        tags: ['bookingStatus'],
        summary: 'Update bookingStatu',
        description:
          'Update all fields of an existing bookingStatu. Requires all fields to be provided.\n\n**Category:** bookingStatus\n**Method:** PUT\n**Path:** /api/v1/bookingStatus/:id',
        operationId: 'put_bookingStatus___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample bookingStatu',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['bookingStatus'],
        summary: 'Delete bookingStatu',
        description:
          'Permanently delete a bookingStatu from the system. This action cannot be undone.\n\n**Category:** bookingStatus\n**Method:** DELETE\n**Path:** /api/v1/bookingStatus/:id',
        operationId: 'delete_bookingStatus___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookingStatus/:id/history': {
      get: {
        tags: ['bookingStatus'],
        summary: 'Get bookingStatu by ID',
        description:
          'Retrieve detailed information about a specific bookingStatu by their unique identifier.\n\n**Category:** bookingStatus\n**Method:** GET\n**Path:** /api/v1/bookingStatus/:id/history',
        operationId: 'get_bookingStatus___id_history',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookingStatus/:id/coordinator': {
      put: {
        tags: ['bookingStatus'],
        summary: 'Update bookingStatu',
        description:
          'Update all fields of an existing bookingStatu. Requires all fields to be provided.\n\n**Category:** bookingStatus\n**Method:** PUT\n**Path:** /api/v1/bookingStatus/:id/coordinator',
        operationId: 'put_bookingStatus___id_coordinator',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample bookingStatu',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/bookingStatus/:id/transitions': {
      get: {
        tags: ['bookingStatus'],
        summary: 'Get bookingStatu by ID',
        description:
          'Retrieve detailed information about a specific bookingStatu by their unique identifier.\n\n**Category:** bookingStatus\n**Method:** GET\n**Path:** /api/v1/bookingStatus/:id/transitions',
        operationId: 'get_bookingStatus___id_transitions',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookingStatus/status/:status': {
      get: {
        tags: ['bookingStatus'],
        summary: 'GET bookingStatus - status',
        description:
          'GET operation for bookingStatus\n\n**Category:** bookingStatus\n**Method:** GET\n**Path:** /api/v1/bookingStatus/status/:status',
        operationId: 'get_bookingStatus__status__status',
        parameters: [
          {
            name: 'status',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'status identifier',
            example: 'status_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookingStatus/bulk-update': {
      put: {
        tags: ['bookingStatus'],
        summary: 'PUT bookingStatus - bulk-update',
        description:
          'PUT operation for bookingStatus\n\n**Category:** bookingStatus\n**Method:** PUT\n**Path:** /api/v1/bookingStatus/bulk-update',
        operationId: 'put_bookingStatus__bulk-update',
        parameters: [],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample bookingStatu',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/bookingStatus/statistics': {
      get: {
        tags: ['bookingStatus'],
        summary: 'GET bookingStatus - statistics',
        description:
          'GET operation for bookingStatus\n\n**Category:** bookingStatus\n**Method:** GET\n**Path:** /api/v1/bookingStatus/statistics',
        operationId: 'get_bookingStatus__statistics',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookingStatus/': {
      get: {
        tags: ['bookingStatus'],
        summary: 'Get all bookingStatus',
        description:
          'Retrieve a paginated list of bookingStatus. Supports filtering, searching, and sorting.\n\n**Category:** bookingStatus\n**Method:** GET\n**Path:** /api/v1/bookingStatus/',
        operationId: 'get_bookingStatus__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookings/': {
      post: {
        tags: ['bookings'],
        summary: 'Create new booking',
        description:
          'Create a new booking with the provided data. Validates all required fields.\n\n**Category:** bookings\n**Method:** POST\n**Path:** /api/v1/bookings/',
        operationId: 'post_bookings__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample booking',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['bookings'],
        summary: 'Get all bookings',
        description:
          'Retrieve a paginated list of bookings. Supports filtering, searching, and sorting.\n\n**Category:** bookings\n**Method:** GET\n**Path:** /api/v1/bookings/',
        operationId: 'get_bookings__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookings/:id': {
      get: {
        tags: ['bookings'],
        summary: 'Get booking by ID',
        description:
          'Retrieve detailed information about a specific booking by their unique identifier.\n\n**Category:** bookings\n**Method:** GET\n**Path:** /api/v1/bookings/:id',
        operationId: 'get_bookings___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['bookings'],
        summary: 'Update booking',
        description:
          'Update all fields of an existing booking. Requires all fields to be provided.\n\n**Category:** bookings\n**Method:** PUT\n**Path:** /api/v1/bookings/:id',
        operationId: 'put_bookings___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample booking',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['bookings'],
        summary: 'Delete booking',
        description:
          'Permanently delete a booking from the system. This action cannot be undone.\n\n**Category:** bookings\n**Method:** DELETE\n**Path:** /api/v1/bookings/:id',
        operationId: 'delete_bookings___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/bookings/:id/status': {
      patch: {
        tags: ['bookings'],
        summary: 'Partially update booking',
        description:
          'Partially update an existing booking. Only provided fields will be updated.\n\n**Category:** bookings\n**Method:** PATCH\n**Path:** /api/v1/bookings/:id/status',
        operationId: 'patch_bookings___id_status',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample booking',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/bookings/patient/:patientId': {
      get: {
        tags: ['bookings'],
        summary: 'GET bookings - patientId',
        description:
          'GET operation for bookings\n\n**Category:** bookings\n**Method:** GET\n**Path:** /api/v1/bookings/patient/:patientId',
        operationId: 'get_bookings__patient__patientId',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'patientId identifier',
            example: 'patientId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/chat/conversations': {
      post: {
        tags: ['chat'],
        summary: 'POST chat - conversations',
        description:
          'POST operation for chat\n\n**Category:** chat\n**Method:** POST\n**Path:** /api/v1/chat/conversations',
        operationId: 'post_chat__conversations',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample cha',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/chat/conversations/user/:userId': {
      get: {
        tags: ['chat'],
        summary: 'GET chat - userId',
        description:
          'GET operation for chat\n\n**Category:** chat\n**Method:** GET\n**Path:** /api/v1/chat/conversations/user/:userId',
        operationId: 'get_chat__conversations_user__userId',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/chat/conversations/:id': {
      get: {
        tags: ['chat'],
        summary: 'Get cha by ID',
        description:
          'Retrieve detailed information about a specific cha by their unique identifier.\n\n**Category:** chat\n**Method:** GET\n**Path:** /api/v1/chat/conversations/:id',
        operationId: 'get_chat__conversations__id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/chat/conversations/:id/archive': {
      put: {
        tags: ['chat'],
        summary: 'Update cha',
        description:
          'Update all fields of an existing cha. Requires all fields to be provided.\n\n**Category:** chat\n**Method:** PUT\n**Path:** /api/v1/chat/conversations/:id/archive',
        operationId: 'put_chat__conversations__id_archive',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample cha',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/chat/messages': {
      post: {
        tags: ['chat'],
        summary: 'POST chat - messages',
        description:
          'POST operation for chat\n\n**Category:** chat\n**Method:** POST\n**Path:** /api/v1/chat/messages',
        operationId: 'post_chat__messages',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample cha',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/chat/messages/conversation/:conversationId': {
      get: {
        tags: ['chat'],
        summary: 'GET chat - conversationId',
        description:
          'GET operation for chat\n\n**Category:** chat\n**Method:** GET\n**Path:** /api/v1/chat/messages/conversation/:conversationId',
        operationId: 'get_chat__messages_conversation__conversationId',
        parameters: [
          {
            name: 'conversationId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'conversationId identifier',
            example: 'conversationId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/chat/messages/:id': {
      delete: {
        tags: ['chat'],
        summary: 'Delete cha',
        description:
          'Permanently delete a cha from the system. This action cannot be undone.\n\n**Category:** chat\n**Method:** DELETE\n**Path:** /api/v1/chat/messages/:id',
        operationId: 'delete_chat__messages__id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/chat/messages/conversation/:conversationId/read': {
      put: {
        tags: ['chat'],
        summary: 'PUT chat - read',
        description:
          'PUT operation for chat\n\n**Category:** chat\n**Method:** PUT\n**Path:** /api/v1/chat/messages/conversation/:conversationId/read',
        operationId: 'put_chat__messages_conversation__conversationId_read',
        parameters: [
          {
            name: 'conversationId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'conversationId identifier',
            example: 'conversationId_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample cha',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/chat/unread/:userId': {
      get: {
        tags: ['chat'],
        summary: 'GET chat - userId',
        description:
          'GET operation for chat\n\n**Category:** chat\n**Method:** GET\n**Path:** /api/v1/chat/unread/:userId',
        operationId: 'get_chat__unread__userId',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/chat/': {
      get: {
        tags: ['chat'],
        summary: 'Get all chat',
        description:
          'Retrieve a paginated list of chat. Supports filtering, searching, and sorting.\n\n**Category:** chat\n**Method:** GET\n**Path:** /api/v1/chat/',
        operationId: 'get_chat__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/chat/:id': {
      get: {
        tags: ['chat'],
        summary: 'Get cha by ID',
        description:
          'Retrieve detailed information about a specific cha by their unique identifier.\n\n**Category:** chat\n**Method:** GET\n**Path:** /api/v1/chat/:id',
        operationId: 'get_chat___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/coupons/': {
      post: {
        tags: ['coupons'],
        summary: 'Create new coupon',
        description:
          'Create a new coupon with the provided data. Validates all required fields.\n\n**Category:** coupons\n**Method:** POST\n**Path:** /api/v1/coupons/',
        operationId: 'post_coupons__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample coupon',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['coupons'],
        summary: 'Get all coupons',
        description:
          'Retrieve a paginated list of coupons. Supports filtering, searching, and sorting.\n\n**Category:** coupons\n**Method:** GET\n**Path:** /api/v1/coupons/',
        operationId: 'get_coupons__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/coupons/:id': {
      get: {
        tags: ['coupons'],
        summary: 'Get coupon by ID',
        description:
          'Retrieve detailed information about a specific coupon by their unique identifier.\n\n**Category:** coupons\n**Method:** GET\n**Path:** /api/v1/coupons/:id',
        operationId: 'get_coupons___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      delete: {
        tags: ['coupons'],
        summary: 'Delete coupon',
        description:
          'Permanently delete a coupon from the system. This action cannot be undone.\n\n**Category:** coupons\n**Method:** DELETE\n**Path:** /api/v1/coupons/:id',
        operationId: 'delete_coupons___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/coupons/validate/:code': {
      get: {
        tags: ['coupons'],
        summary: 'GET coupons - code',
        description:
          'GET operation for coupons\n\n**Category:** coupons\n**Method:** GET\n**Path:** /api/v1/coupons/validate/:code',
        operationId: 'get_coupons__validate__code',
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'code identifier',
            example: 'code_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/coupons/apply/:code': {
      post: {
        tags: ['coupons'],
        summary: 'POST coupons - code',
        description:
          'POST operation for coupons\n\n**Category:** coupons\n**Method:** POST\n**Path:** /api/v1/coupons/apply/:code',
        operationId: 'post_coupons__apply__code',
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'code identifier',
            example: 'code_123',
          },
        ],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample coupon',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/dnaKits/': {
      get: {
        tags: ['dnaKits'],
        summary: 'Get all dnaKits',
        description:
          'Retrieve a paginated list of dnaKits. Supports filtering, searching, and sorting.\n\n**Category:** dnaKits\n**Method:** GET\n**Path:** /api/v1/dnaKits/',
        operationId: 'get_dnaKits__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ['dnaKits'],
        summary: 'Create new dnaKit',
        description:
          'Create a new dnaKit with the provided data. Validates all required fields.\n\n**Category:** dnaKits\n**Method:** POST\n**Path:** /api/v1/dnaKits/',
        operationId: 'post_dnaKits__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample dnaKit',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/dnaKits/patient/:patientId': {
      get: {
        tags: ['dnaKits'],
        summary: 'GET dnaKits - patientId',
        description:
          'GET operation for dnaKits\n\n**Category:** dnaKits\n**Method:** GET\n**Path:** /api/v1/dnaKits/patient/:patientId',
        operationId: 'get_dnaKits__patient__patientId',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'patientId identifier',
            example: 'patientId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/dnaKits/statistics': {
      get: {
        tags: ['dnaKits'],
        summary: 'GET dnaKits - statistics',
        description:
          'GET operation for dnaKits\n\n**Category:** dnaKits\n**Method:** GET\n**Path:** /api/v1/dnaKits/statistics',
        operationId: 'get_dnaKits__statistics',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/dnaKits/:id': {
      get: {
        tags: ['dnaKits'],
        summary: 'Get dnaKit by ID',
        description:
          'Retrieve detailed information about a specific dnaKit by their unique identifier.\n\n**Category:** dnaKits\n**Method:** GET\n**Path:** /api/v1/dnaKits/:id',
        operationId: 'get_dnaKits___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['dnaKits'],
        summary: 'Update dnaKit',
        description:
          'Update all fields of an existing dnaKit. Requires all fields to be provided.\n\n**Category:** dnaKits\n**Method:** PUT\n**Path:** /api/v1/dnaKits/:id',
        operationId: 'put_dnaKits___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample dnaKit',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['dnaKits'],
        summary: 'Delete dnaKit',
        description:
          'Permanently delete a dnaKit from the system. This action cannot be undone.\n\n**Category:** dnaKits\n**Method:** DELETE\n**Path:** /api/v1/dnaKits/:id',
        operationId: 'delete_dnaKits___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/dnaKits/:id/status': {
      put: {
        tags: ['dnaKits'],
        summary: 'Update dnaKit',
        description:
          'Update all fields of an existing dnaKit. Requires all fields to be provided.\n\n**Category:** dnaKits\n**Method:** PUT\n**Path:** /api/v1/dnaKits/:id/status',
        operationId: 'put_dnaKits___id_status',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample dnaKit',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/dnaKits/:id/results': {
      put: {
        tags: ['dnaKits'],
        summary: 'Update dnaKit',
        description:
          'Update all fields of an existing dnaKit. Requires all fields to be provided.\n\n**Category:** dnaKits\n**Method:** PUT\n**Path:** /api/v1/dnaKits/:id/results',
        operationId: 'put_dnaKits___id_results',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample dnaKit',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/dnaKits/:id/cancel': {
      put: {
        tags: ['dnaKits'],
        summary: 'Update dnaKit',
        description:
          'Update all fields of an existing dnaKit. Requires all fields to be provided.\n\n**Category:** dnaKits\n**Method:** PUT\n**Path:** /api/v1/dnaKits/:id/cancel',
        operationId: 'put_dnaKits___id_cancel',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample dnaKit',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/doctorSchedules/': {
      post: {
        tags: ['doctorSchedules'],
        summary: 'Create new doctorSchedule',
        description:
          'Create a new doctorSchedule with the provided data. Validates all required fields.\n\n**Category:** doctorSchedules\n**Method:** POST\n**Path:** /api/v1/doctorSchedules/',
        operationId: 'post_doctorSchedules__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample doctorSchedule',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/doctorSchedules/bulk': {
      post: {
        tags: ['doctorSchedules'],
        summary: 'POST doctorSchedules - bulk',
        description:
          'POST operation for doctorSchedules\n\n**Category:** doctorSchedules\n**Method:** POST\n**Path:** /api/v1/doctorSchedules/bulk',
        operationId: 'post_doctorSchedules__bulk',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample doctorSchedule',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/doctorSchedules/doctor/:doctorId': {
      get: {
        tags: ['doctorSchedules'],
        summary: 'GET doctorSchedules - doctorId',
        description:
          'GET operation for doctorSchedules\n\n**Category:** doctorSchedules\n**Method:** GET\n**Path:** /api/v1/doctorSchedules/doctor/:doctorId',
        operationId: 'get_doctorSchedules__doctor__doctorId',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'doctorId identifier',
            example: 'doctorId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/doctorSchedules/doctor/:doctorId/available-slots': {
      get: {
        tags: ['doctorSchedules'],
        summary: 'GET doctorSchedules - available-slots',
        description:
          'GET operation for doctorSchedules\n\n**Category:** doctorSchedules\n**Method:** GET\n**Path:** /api/v1/doctorSchedules/doctor/:doctorId/available-slots',
        operationId: 'get_doctorSchedules__doctor__doctorId_available-slots',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'doctorId identifier',
            example: 'doctorId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/doctorSchedules/:id': {
      get: {
        tags: ['doctorSchedules'],
        summary: 'Get doctorSchedule by ID',
        description:
          'Retrieve detailed information about a specific doctorSchedule by their unique identifier.\n\n**Category:** doctorSchedules\n**Method:** GET\n**Path:** /api/v1/doctorSchedules/:id',
        operationId: 'get_doctorSchedules___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['doctorSchedules'],
        summary: 'Update doctorSchedule',
        description:
          'Update all fields of an existing doctorSchedule. Requires all fields to be provided.\n\n**Category:** doctorSchedules\n**Method:** PUT\n**Path:** /api/v1/doctorSchedules/:id',
        operationId: 'put_doctorSchedules___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample doctorSchedule',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['doctorSchedules'],
        summary: 'Delete doctorSchedule',
        description:
          'Permanently delete a doctorSchedule from the system. This action cannot be undone.\n\n**Category:** doctorSchedules\n**Method:** DELETE\n**Path:** /api/v1/doctorSchedules/:id',
        operationId: 'delete_doctorSchedules___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/doctors/': {
      post: {
        tags: ['doctors'],
        summary: 'Create new doctor',
        description:
          'Create a new doctor with the provided data. Validates all required fields.\n\n**Category:** doctors\n**Method:** POST\n**Path:** /api/v1/doctors/',
        operationId: 'post_doctors__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample doctor',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['doctors'],
        summary: 'Get all doctors',
        description:
          'Retrieve a paginated list of doctors. Supports filtering, searching, and sorting.\n\n**Category:** doctors\n**Method:** GET\n**Path:** /api/v1/doctors/',
        operationId: 'get_doctors__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/doctors/:id': {
      get: {
        tags: ['doctors'],
        summary: 'Get doctor by ID',
        description:
          'Retrieve detailed information about a specific doctor by their unique identifier.\n\n**Category:** doctors\n**Method:** GET\n**Path:** /api/v1/doctors/:id',
        operationId: 'get_doctors___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['doctors'],
        summary: 'Update doctor',
        description:
          'Update all fields of an existing doctor. Requires all fields to be provided.\n\n**Category:** doctors\n**Method:** PUT\n**Path:** /api/v1/doctors/:id',
        operationId: 'put_doctors___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample doctor',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['doctors'],
        summary: 'Delete doctor',
        description:
          'Permanently delete a doctor from the system. This action cannot be undone.\n\n**Category:** doctors\n**Method:** DELETE\n**Path:** /api/v1/doctors/:id',
        operationId: 'delete_doctors___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/doctors/:id/verify': {
      patch: {
        tags: ['doctors'],
        summary: 'Partially update doctor',
        description:
          'Partially update an existing doctor. Only provided fields will be updated.\n\n**Category:** doctors\n**Method:** PATCH\n**Path:** /api/v1/doctors/:id/verify',
        operationId: 'patch_doctors___id_verify',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample doctor',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/faqs/': {
      post: {
        tags: ['faqs'],
        summary: 'Create new faq',
        description:
          'Create a new faq with the provided data. Validates all required fields.\n\n**Category:** faqs\n**Method:** POST\n**Path:** /api/v1/faqs/',
        operationId: 'post_faqs__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample faq',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['faqs'],
        summary: 'Get all faqs',
        description:
          'Retrieve a paginated list of faqs. Supports filtering, searching, and sorting.\n\n**Category:** faqs\n**Method:** GET\n**Path:** /api/v1/faqs/',
        operationId: 'get_faqs__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/faqs/:id': {
      get: {
        tags: ['faqs'],
        summary: 'Get faq by ID',
        description:
          'Retrieve detailed information about a specific faq by their unique identifier.\n\n**Category:** faqs\n**Method:** GET\n**Path:** /api/v1/faqs/:id',
        operationId: 'get_faqs___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['faqs'],
        summary: 'Update faq',
        description:
          'Update all fields of an existing faq. Requires all fields to be provided.\n\n**Category:** faqs\n**Method:** PUT\n**Path:** /api/v1/faqs/:id',
        operationId: 'put_faqs___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample faq',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['faqs'],
        summary: 'Delete faq',
        description:
          'Permanently delete a faq from the system. This action cannot be undone.\n\n**Category:** faqs\n**Method:** DELETE\n**Path:** /api/v1/faqs/:id',
        operationId: 'delete_faqs___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/faqs/category/:category': {
      get: {
        tags: ['faqs'],
        summary: 'GET faqs - category',
        description:
          'GET operation for faqs\n\n**Category:** faqs\n**Method:** GET\n**Path:** /api/v1/faqs/category/:category',
        operationId: 'get_faqs__category__category',
        parameters: [
          {
            name: 'category',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'category identifier',
            example: 'category_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/health/': {
      get: {
        tags: ['health'],
        summary: 'Get all health',
        description:
          'Retrieve a paginated list of health. Supports filtering, searching, and sorting.\n\n**Category:** health\n**Method:** GET\n**Path:** /api/v1/health/',
        operationId: 'get_health__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/hospitals/': {
      post: {
        tags: ['hospitals'],
        summary: 'Create new hospital',
        description:
          'Create a new hospital with the provided data. Validates all required fields.\n\n**Category:** hospitals\n**Method:** POST\n**Path:** /api/v1/hospitals/',
        operationId: 'post_hospitals__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample hospital',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['hospitals'],
        summary: 'Get all hospitals',
        description:
          'Retrieve a paginated list of hospitals. Supports filtering, searching, and sorting.\n\n**Category:** hospitals\n**Method:** GET\n**Path:** /api/v1/hospitals/',
        operationId: 'get_hospitals__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/hospitals/:id': {
      get: {
        tags: ['hospitals'],
        summary: 'Get hospital by ID',
        description:
          'Retrieve detailed information about a specific hospital by their unique identifier.\n\n**Category:** hospitals\n**Method:** GET\n**Path:** /api/v1/hospitals/:id',
        operationId: 'get_hospitals___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['hospitals'],
        summary: 'Update hospital',
        description:
          'Update all fields of an existing hospital. Requires all fields to be provided.\n\n**Category:** hospitals\n**Method:** PUT\n**Path:** /api/v1/hospitals/:id',
        operationId: 'put_hospitals___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample hospital',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['hospitals'],
        summary: 'Delete hospital',
        description:
          'Permanently delete a hospital from the system. This action cannot be undone.\n\n**Category:** hospitals\n**Method:** DELETE\n**Path:** /api/v1/hospitals/:id',
        operationId: 'delete_hospitals___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/hospitals/:id/verify': {
      patch: {
        tags: ['hospitals'],
        summary: 'Partially update hospital',
        description:
          'Partially update an existing hospital. Only provided fields will be updated.\n\n**Category:** hospitals\n**Method:** PATCH\n**Path:** /api/v1/hospitals/:id/verify',
        operationId: 'patch_hospitals___id_verify',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample hospital',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/insurance/': {
      post: {
        tags: ['insurance'],
        summary: 'Create new insuranc',
        description:
          'Create a new insuranc with the provided data. Validates all required fields.\n\n**Category:** insurance\n**Method:** POST\n**Path:** /api/v1/insurance/',
        operationId: 'post_insurance__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample insuranc',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['insurance'],
        summary: 'Get all insurance',
        description:
          'Retrieve a paginated list of insurance. Supports filtering, searching, and sorting.\n\n**Category:** insurance\n**Method:** GET\n**Path:** /api/v1/insurance/',
        operationId: 'get_insurance__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/insurance/:id': {
      get: {
        tags: ['insurance'],
        summary: 'Get insuranc by ID',
        description:
          'Retrieve detailed information about a specific insuranc by their unique identifier.\n\n**Category:** insurance\n**Method:** GET\n**Path:** /api/v1/insurance/:id',
        operationId: 'get_insurance___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['insurance'],
        summary: 'Update insuranc',
        description:
          'Update all fields of an existing insuranc. Requires all fields to be provided.\n\n**Category:** insurance\n**Method:** PUT\n**Path:** /api/v1/insurance/:id',
        operationId: 'put_insurance___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample insuranc',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['insurance'],
        summary: 'Delete insuranc',
        description:
          'Permanently delete a insuranc from the system. This action cannot be undone.\n\n**Category:** insurance\n**Method:** DELETE\n**Path:** /api/v1/insurance/:id',
        operationId: 'delete_insurance___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/integrations/': {
      get: {
        tags: ['integrations'],
        summary: 'Get all integrations',
        description:
          'Retrieve a paginated list of integrations. Supports filtering, searching, and sorting.\n\n**Category:** integrations\n**Method:** GET\n**Path:** /api/v1/integrations/',
        operationId: 'get_integrations__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ['integrations'],
        summary: 'Create new integration',
        description:
          'Create a new integration with the provided data. Validates all required fields.\n\n**Category:** integrations\n**Method:** POST\n**Path:** /api/v1/integrations/',
        operationId: 'post_integrations__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample integration',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/integrations/:id': {
      get: {
        tags: ['integrations'],
        summary: 'Get integration by ID',
        description:
          'Retrieve detailed information about a specific integration by their unique identifier.\n\n**Category:** integrations\n**Method:** GET\n**Path:** /api/v1/integrations/:id',
        operationId: 'get_integrations___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['integrations'],
        summary: 'Update integration',
        description:
          'Update all fields of an existing integration. Requires all fields to be provided.\n\n**Category:** integrations\n**Method:** PUT\n**Path:** /api/v1/integrations/:id',
        operationId: 'put_integrations___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample integration',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['integrations'],
        summary: 'Delete integration',
        description:
          'Permanently delete a integration from the system. This action cannot be undone.\n\n**Category:** integrations\n**Method:** DELETE\n**Path:** /api/v1/integrations/:id',
        operationId: 'delete_integrations___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/integrations/:id/test': {
      post: {
        tags: ['integrations'],
        summary: 'POST integrations - test',
        description:
          'POST operation for integrations\n\n**Category:** integrations\n**Method:** POST\n**Path:** /api/v1/integrations/:id/test',
        operationId: 'post_integrations___id_test',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample integration',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/integrations/:id/sync': {
      post: {
        tags: ['integrations'],
        summary: 'POST integrations - sync',
        description:
          'POST operation for integrations\n\n**Category:** integrations\n**Method:** POST\n**Path:** /api/v1/integrations/:id/sync',
        operationId: 'post_integrations___id_sync',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample integration',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/invoices/': {
      post: {
        tags: ['invoices'],
        summary: 'Create new invoice',
        description:
          'Create a new invoice with the provided data. Validates all required fields.\n\n**Category:** invoices\n**Method:** POST\n**Path:** /api/v1/invoices/',
        operationId: 'post_invoices__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample invoice',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['invoices'],
        summary: 'Get all invoices',
        description:
          'Retrieve a paginated list of invoices. Supports filtering, searching, and sorting.\n\n**Category:** invoices\n**Method:** GET\n**Path:** /api/v1/invoices/',
        operationId: 'get_invoices__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/invoices/:id': {
      get: {
        tags: ['invoices'],
        summary: 'Get invoice by ID',
        description:
          'Retrieve detailed information about a specific invoice by their unique identifier.\n\n**Category:** invoices\n**Method:** GET\n**Path:** /api/v1/invoices/:id',
        operationId: 'get_invoices___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['invoices'],
        summary: 'Update invoice',
        description:
          'Update all fields of an existing invoice. Requires all fields to be provided.\n\n**Category:** invoices\n**Method:** PUT\n**Path:** /api/v1/invoices/:id',
        operationId: 'put_invoices___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample invoice',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['invoices'],
        summary: 'Delete invoice',
        description:
          'Permanently delete a invoice from the system. This action cannot be undone.\n\n**Category:** invoices\n**Method:** DELETE\n**Path:** /api/v1/invoices/:id',
        operationId: 'delete_invoices___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/labTests/': {
      post: {
        tags: ['labTests'],
        summary: 'Create new labTest',
        description:
          'Create a new labTest with the provided data. Validates all required fields.\n\n**Category:** labTests\n**Method:** POST\n**Path:** /api/v1/labTests/',
        operationId: 'post_labTests__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample labTest',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['labTests'],
        summary: 'Get all labTests',
        description:
          'Retrieve a paginated list of labTests. Supports filtering, searching, and sorting.\n\n**Category:** labTests\n**Method:** GET\n**Path:** /api/v1/labTests/',
        operationId: 'get_labTests__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/labTests/:id': {
      get: {
        tags: ['labTests'],
        summary: 'Get labTest by ID',
        description:
          'Retrieve detailed information about a specific labTest by their unique identifier.\n\n**Category:** labTests\n**Method:** GET\n**Path:** /api/v1/labTests/:id',
        operationId: 'get_labTests___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['labTests'],
        summary: 'Update labTest',
        description:
          'Update all fields of an existing labTest. Requires all fields to be provided.\n\n**Category:** labTests\n**Method:** PUT\n**Path:** /api/v1/labTests/:id',
        operationId: 'put_labTests___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample labTest',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['labTests'],
        summary: 'Delete labTest',
        description:
          'Permanently delete a labTest from the system. This action cannot be undone.\n\n**Category:** labTests\n**Method:** DELETE\n**Path:** /api/v1/labTests/:id',
        operationId: 'delete_labTests___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/laboratories/': {
      post: {
        tags: ['laboratories'],
        summary: 'Create new laboratorie',
        description:
          'Create a new laboratorie with the provided data. Validates all required fields.\n\n**Category:** laboratories\n**Method:** POST\n**Path:** /api/v1/laboratories/',
        operationId: 'post_laboratories__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample laboratorie',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['laboratories'],
        summary: 'Get all laboratories',
        description:
          'Retrieve a paginated list of laboratories. Supports filtering, searching, and sorting.\n\n**Category:** laboratories\n**Method:** GET\n**Path:** /api/v1/laboratories/',
        operationId: 'get_laboratories__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/laboratories/:id': {
      get: {
        tags: ['laboratories'],
        summary: 'Get laboratorie by ID',
        description:
          'Retrieve detailed information about a specific laboratorie by their unique identifier.\n\n**Category:** laboratories\n**Method:** GET\n**Path:** /api/v1/laboratories/:id',
        operationId: 'get_laboratories___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['laboratories'],
        summary: 'Update laboratorie',
        description:
          'Update all fields of an existing laboratorie. Requires all fields to be provided.\n\n**Category:** laboratories\n**Method:** PUT\n**Path:** /api/v1/laboratories/:id',
        operationId: 'put_laboratories___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample laboratorie',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['laboratories'],
        summary: 'Delete laboratorie',
        description:
          'Permanently delete a laboratorie from the system. This action cannot be undone.\n\n**Category:** laboratories\n**Method:** DELETE\n**Path:** /api/v1/laboratories/:id',
        operationId: 'delete_laboratories___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/media/upload': {
      post: {
        tags: ['media'],
        summary: 'POST media - upload',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/upload',
        operationId: 'post_media__upload',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/upload-multiple': {
      post: {
        tags: ['media'],
        summary: 'POST media - upload-multiple',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/upload-multiple',
        operationId: 'post_media__upload-multiple',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/:fileId': {
      delete: {
        tags: ['media'],
        summary: 'DELETE media - fileId',
        description:
          'DELETE operation for media\n\n**Category:** media\n**Method:** DELETE\n**Path:** /api/v1/media/:fileId',
        operationId: 'delete_media___fileId',
        parameters: [
          {
            name: 'fileId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'fileId identifier',
            example: 'fileId_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      get: {
        tags: ['media'],
        summary: 'GET media - fileId',
        description:
          'GET operation for media\n\n**Category:** media\n**Method:** GET\n**Path:** /api/v1/media/:fileId',
        operationId: 'get_media___fileId',
        parameters: [
          {
            name: 'fileId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'fileId identifier',
            example: 'fileId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['media'],
        summary: 'PUT media - fileId',
        description:
          'PUT operation for media\n\n**Category:** media\n**Method:** PUT\n**Path:** /api/v1/media/:fileId',
        operationId: 'put_media___fileId',
        parameters: [
          {
            name: 'fileId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'fileId identifier',
            example: 'fileId_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/delete-multiple': {
      post: {
        tags: ['media'],
        summary: 'POST media - delete-multiple',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/delete-multiple',
        operationId: 'post_media__delete-multiple',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/': {
      get: {
        tags: ['media'],
        summary: 'Get all media',
        description:
          'Retrieve a paginated list of media. Supports filtering, searching, and sorting.\n\n**Category:** media\n**Method:** GET\n**Path:** /api/v1/media/',
        operationId: 'get_media__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/media/transform': {
      post: {
        tags: ['media'],
        summary: 'POST media - transform',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/transform',
        operationId: 'post_media__transform',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/thumbnail': {
      post: {
        tags: ['media'],
        summary: 'POST media - thumbnail',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/thumbnail',
        operationId: 'post_media__thumbnail',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/optimize': {
      post: {
        tags: ['media'],
        summary: 'POST media - optimize',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/optimize',
        operationId: 'post_media__optimize',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/purge-cache': {
      post: {
        tags: ['media'],
        summary: 'POST media - purge-cache',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/purge-cache',
        operationId: 'post_media__purge-cache',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/media/auth/params': {
      get: {
        tags: ['media'],
        summary: 'GET media - params',
        description:
          'GET operation for media\n\n**Category:** media\n**Method:** GET\n**Path:** /api/v1/media/auth/params',
        operationId: 'get_media__auth_params',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/media/folder': {
      post: {
        tags: ['media'],
        summary: 'POST media - folder',
        description:
          'POST operation for media\n\n**Category:** media\n**Method:** POST\n**Path:** /api/v1/media/folder',
        operationId: 'post_media__folder',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medi',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['media'],
        summary: 'DELETE media - folder',
        description:
          'DELETE operation for media\n\n**Category:** media\n**Method:** DELETE\n**Path:** /api/v1/media/folder',
        operationId: 'delete_media__folder',
        parameters: [],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/media/:id': {
      get: {
        tags: ['media'],
        summary: 'Get medi by ID',
        description:
          'Retrieve detailed information about a specific medi by their unique identifier.\n\n**Category:** media\n**Method:** GET\n**Path:** /api/v1/media/:id',
        operationId: 'get_media___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/medicalRecords/': {
      post: {
        tags: ['medicalRecords'],
        summary: 'Create new medicalRecord',
        description:
          'Create a new medicalRecord with the provided data. Validates all required fields.\n\n**Category:** medicalRecords\n**Method:** POST\n**Path:** /api/v1/medicalRecords/',
        operationId: 'post_medicalRecords__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medicalRecord',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/medicalRecords/:id': {
      get: {
        tags: ['medicalRecords'],
        summary: 'Get medicalRecord by ID',
        description:
          'Retrieve detailed information about a specific medicalRecord by their unique identifier.\n\n**Category:** medicalRecords\n**Method:** GET\n**Path:** /api/v1/medicalRecords/:id',
        operationId: 'get_medicalRecords___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['medicalRecords'],
        summary: 'Update medicalRecord',
        description:
          'Update all fields of an existing medicalRecord. Requires all fields to be provided.\n\n**Category:** medicalRecords\n**Method:** PUT\n**Path:** /api/v1/medicalRecords/:id',
        operationId: 'put_medicalRecords___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample medicalRecord',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['medicalRecords'],
        summary: 'Delete medicalRecord',
        description:
          'Permanently delete a medicalRecord from the system. This action cannot be undone.\n\n**Category:** medicalRecords\n**Method:** DELETE\n**Path:** /api/v1/medicalRecords/:id',
        operationId: 'delete_medicalRecords___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/medicalRecords/patient/:patientId': {
      get: {
        tags: ['medicalRecords'],
        summary: 'GET medicalRecords - patientId',
        description:
          'GET operation for medicalRecords\n\n**Category:** medicalRecords\n**Method:** GET\n**Path:** /api/v1/medicalRecords/patient/:patientId',
        operationId: 'get_medicalRecords__patient__patientId',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'patientId identifier',
            example: 'patientId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/notifications/': {
      post: {
        tags: ['notifications'],
        summary: 'Create new notification',
        description:
          'Create a new notification with the provided data. Validates all required fields.\n\n**Category:** notifications\n**Method:** POST\n**Path:** /api/v1/notifications/',
        operationId: 'post_notifications__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample notification',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['notifications'],
        summary: 'Get all notifications',
        description:
          'Retrieve a paginated list of notifications. Supports filtering, searching, and sorting.\n\n**Category:** notifications\n**Method:** GET\n**Path:** /api/v1/notifications/',
        operationId: 'get_notifications__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/notifications/:id': {
      get: {
        tags: ['notifications'],
        summary: 'Get notification by ID',
        description:
          'Retrieve detailed information about a specific notification by their unique identifier.\n\n**Category:** notifications\n**Method:** GET\n**Path:** /api/v1/notifications/:id',
        operationId: 'get_notifications___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['notifications'],
        summary: 'Update notification',
        description:
          'Update all fields of an existing notification. Requires all fields to be provided.\n\n**Category:** notifications\n**Method:** PUT\n**Path:** /api/v1/notifications/:id',
        operationId: 'put_notifications___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample notification',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['notifications'],
        summary: 'Delete notification',
        description:
          'Permanently delete a notification from the system. This action cannot be undone.\n\n**Category:** notifications\n**Method:** DELETE\n**Path:** /api/v1/notifications/:id',
        operationId: 'delete_notifications___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/notifications/user/:userId': {
      get: {
        tags: ['notifications'],
        summary: 'GET notifications - userId',
        description:
          'GET operation for notifications\n\n**Category:** notifications\n**Method:** GET\n**Path:** /api/v1/notifications/user/:userId',
        operationId: 'get_notifications__user__userId',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/notifications/:id/read': {
      patch: {
        tags: ['notifications'],
        summary: 'Partially update notification',
        description:
          'Partially update an existing notification. Only provided fields will be updated.\n\n**Category:** notifications\n**Method:** PATCH\n**Path:** /api/v1/notifications/:id/read',
        operationId: 'patch_notifications___id_read',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample notification',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/packages/': {
      post: {
        tags: ['packages'],
        summary: 'Create new package',
        description:
          'Create a new package with the provided data. Validates all required fields.\n\n**Category:** packages\n**Method:** POST\n**Path:** /api/v1/packages/',
        operationId: 'post_packages__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample package',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['packages'],
        summary: 'Get all packages',
        description:
          'Retrieve a paginated list of packages. Supports filtering, searching, and sorting.\n\n**Category:** packages\n**Method:** GET\n**Path:** /api/v1/packages/',
        operationId: 'get_packages__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/packages/:id': {
      get: {
        tags: ['packages'],
        summary: 'Get package by ID',
        description:
          'Retrieve detailed information about a specific package by their unique identifier.\n\n**Category:** packages\n**Method:** GET\n**Path:** /api/v1/packages/:id',
        operationId: 'get_packages___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['packages'],
        summary: 'Update package',
        description:
          'Update all fields of an existing package. Requires all fields to be provided.\n\n**Category:** packages\n**Method:** PUT\n**Path:** /api/v1/packages/:id',
        operationId: 'put_packages___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample package',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['packages'],
        summary: 'Delete package',
        description:
          'Permanently delete a package from the system. This action cannot be undone.\n\n**Category:** packages\n**Method:** DELETE\n**Path:** /api/v1/packages/:id',
        operationId: 'delete_packages___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/patients/': {
      post: {
        tags: ['patients'],
        summary: 'Create new patient',
        description:
          'Create a new patient with the provided data. Validates all required fields.\n\n**Category:** patients\n**Method:** POST\n**Path:** /api/v1/patients/',
        operationId: 'post_patients__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample patient',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['patients'],
        summary: 'Get all patients',
        description:
          'Retrieve a paginated list of patients. Supports filtering, searching, and sorting.\n\n**Category:** patients\n**Method:** GET\n**Path:** /api/v1/patients/',
        operationId: 'get_patients__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/patients/:id': {
      get: {
        tags: ['patients'],
        summary: 'Get patient by ID',
        description:
          'Retrieve detailed information about a specific patient by their unique identifier.\n\n**Category:** patients\n**Method:** GET\n**Path:** /api/v1/patients/:id',
        operationId: 'get_patients___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['patients'],
        summary: 'Update patient',
        description:
          'Update all fields of an existing patient. Requires all fields to be provided.\n\n**Category:** patients\n**Method:** PUT\n**Path:** /api/v1/patients/:id',
        operationId: 'put_patients___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample patient',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['patients'],
        summary: 'Delete patient',
        description:
          'Permanently delete a patient from the system. This action cannot be undone.\n\n**Category:** patients\n**Method:** DELETE\n**Path:** /api/v1/patients/:id',
        operationId: 'delete_patients___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/payments/': {
      post: {
        tags: ['payments'],
        summary: 'Create new payment',
        description:
          'Create a new payment with the provided data. Validates all required fields.\n\n**Category:** payments\n**Method:** POST\n**Path:** /api/v1/payments/',
        operationId: 'post_payments__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample payment',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['payments'],
        summary: 'Get all payments',
        description:
          'Retrieve a paginated list of payments. Supports filtering, searching, and sorting.\n\n**Category:** payments\n**Method:** GET\n**Path:** /api/v1/payments/',
        operationId: 'get_payments__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/payments/:id': {
      get: {
        tags: ['payments'],
        summary: 'Get payment by ID',
        description:
          'Retrieve detailed information about a specific payment by their unique identifier.\n\n**Category:** payments\n**Method:** GET\n**Path:** /api/v1/payments/:id',
        operationId: 'get_payments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['payments'],
        summary: 'Update payment',
        description:
          'Update all fields of an existing payment. Requires all fields to be provided.\n\n**Category:** payments\n**Method:** PUT\n**Path:** /api/v1/payments/:id',
        operationId: 'put_payments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample payment',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['payments'],
        summary: 'Delete payment',
        description:
          'Permanently delete a payment from the system. This action cannot be undone.\n\n**Category:** payments\n**Method:** DELETE\n**Path:** /api/v1/payments/:id',
        operationId: 'delete_payments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/prescriptions/': {
      post: {
        tags: ['prescriptions'],
        summary: 'Create new prescription',
        description:
          'Create a new prescription with the provided data. Validates all required fields.\n\n**Category:** prescriptions\n**Method:** POST\n**Path:** /api/v1/prescriptions/',
        operationId: 'post_prescriptions__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample prescription',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/prescriptions/:id': {
      get: {
        tags: ['prescriptions'],
        summary: 'Get prescription by ID',
        description:
          'Retrieve detailed information about a specific prescription by their unique identifier.\n\n**Category:** prescriptions\n**Method:** GET\n**Path:** /api/v1/prescriptions/:id',
        operationId: 'get_prescriptions___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['prescriptions'],
        summary: 'Update prescription',
        description:
          'Update all fields of an existing prescription. Requires all fields to be provided.\n\n**Category:** prescriptions\n**Method:** PUT\n**Path:** /api/v1/prescriptions/:id',
        operationId: 'put_prescriptions___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample prescription',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['prescriptions'],
        summary: 'Delete prescription',
        description:
          'Permanently delete a prescription from the system. This action cannot be undone.\n\n**Category:** prescriptions\n**Method:** DELETE\n**Path:** /api/v1/prescriptions/:id',
        operationId: 'delete_prescriptions___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/prescriptions/patient/:patientId': {
      get: {
        tags: ['prescriptions'],
        summary: 'GET prescriptions - patientId',
        description:
          'GET operation for prescriptions\n\n**Category:** prescriptions\n**Method:** GET\n**Path:** /api/v1/prescriptions/patient/:patientId',
        operationId: 'get_prescriptions__patient__patientId',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'patientId identifier',
            example: 'patientId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/reviews/': {
      post: {
        tags: ['reviews'],
        summary: 'Create new review',
        description:
          'Create a new review with the provided data. Validates all required fields.\n\n**Category:** reviews\n**Method:** POST\n**Path:** /api/v1/reviews/',
        operationId: 'post_reviews__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample review',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['reviews'],
        summary: 'Get all reviews',
        description:
          'Retrieve a paginated list of reviews. Supports filtering, searching, and sorting.\n\n**Category:** reviews\n**Method:** GET\n**Path:** /api/v1/reviews/',
        operationId: 'get_reviews__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/reviews/:id': {
      get: {
        tags: ['reviews'],
        summary: 'Get review by ID',
        description:
          'Retrieve detailed information about a specific review by their unique identifier.\n\n**Category:** reviews\n**Method:** GET\n**Path:** /api/v1/reviews/:id',
        operationId: 'get_reviews___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['reviews'],
        summary: 'Update review',
        description:
          'Update all fields of an existing review. Requires all fields to be provided.\n\n**Category:** reviews\n**Method:** PUT\n**Path:** /api/v1/reviews/:id',
        operationId: 'put_reviews___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample review',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['reviews'],
        summary: 'Delete review',
        description:
          'Permanently delete a review from the system. This action cannot be undone.\n\n**Category:** reviews\n**Method:** DELETE\n**Path:** /api/v1/reviews/:id',
        operationId: 'delete_reviews___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/reviews/:id/verify': {
      patch: {
        tags: ['reviews'],
        summary: 'Partially update review',
        description:
          'Partially update an existing review. Only provided fields will be updated.\n\n**Category:** reviews\n**Method:** PATCH\n**Path:** /api/v1/reviews/:id/verify',
        operationId: 'patch_reviews___id_verify',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample review',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/staff/': {
      get: {
        tags: ['staff'],
        summary: 'Get all staff',
        description:
          'Retrieve a paginated list of staff. Supports filtering, searching, and sorting.\n\n**Category:** staff\n**Method:** GET\n**Path:** /api/v1/staff/',
        operationId: 'get_staff__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ['staff'],
        summary: 'Create new staf',
        description:
          'Create a new staf with the provided data. Validates all required fields.\n\n**Category:** staff\n**Method:** POST\n**Path:** /api/v1/staff/',
        operationId: 'post_staff__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample staf',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/staff/hospital/:hospitalId': {
      get: {
        tags: ['staff'],
        summary: 'GET staff - hospitalId',
        description:
          'GET operation for staff\n\n**Category:** staff\n**Method:** GET\n**Path:** /api/v1/staff/hospital/:hospitalId',
        operationId: 'get_staff__hospital__hospitalId',
        parameters: [
          {
            name: 'hospitalId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'hospitalId identifier',
            example: 'hospitalId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/staff/:id': {
      get: {
        tags: ['staff'],
        summary: 'Get staf by ID',
        description:
          'Retrieve detailed information about a specific staf by their unique identifier.\n\n**Category:** staff\n**Method:** GET\n**Path:** /api/v1/staff/:id',
        operationId: 'get_staff___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['staff'],
        summary: 'Update staf',
        description:
          'Update all fields of an existing staf. Requires all fields to be provided.\n\n**Category:** staff\n**Method:** PUT\n**Path:** /api/v1/staff/:id',
        operationId: 'put_staff___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample staf',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['staff'],
        summary: 'Delete staf',
        description:
          'Permanently delete a staf from the system. This action cannot be undone.\n\n**Category:** staff\n**Method:** DELETE\n**Path:** /api/v1/staff/:id',
        operationId: 'delete_staff___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/staff/:id/performance': {
      get: {
        tags: ['staff'],
        summary: 'Get staf by ID',
        description:
          'Retrieve detailed information about a specific staf by their unique identifier.\n\n**Category:** staff\n**Method:** GET\n**Path:** /api/v1/staff/:id/performance',
        operationId: 'get_staff___id_performance',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/staff/:id/permissions': {
      put: {
        tags: ['staff'],
        summary: 'Update staf',
        description:
          'Update all fields of an existing staf. Requires all fields to be provided.\n\n**Category:** staff\n**Method:** PUT\n**Path:** /api/v1/staff/:id/permissions',
        operationId: 'put_staff___id_permissions',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample staf',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/subscriptions/': {
      post: {
        tags: ['subscriptions'],
        summary: 'Create new subscription',
        description:
          'Create a new subscription with the provided data. Validates all required fields.\n\n**Category:** subscriptions\n**Method:** POST\n**Path:** /api/v1/subscriptions/',
        operationId: 'post_subscriptions__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample subscription',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['subscriptions'],
        summary: 'Get all subscriptions',
        description:
          'Retrieve a paginated list of subscriptions. Supports filtering, searching, and sorting.\n\n**Category:** subscriptions\n**Method:** GET\n**Path:** /api/v1/subscriptions/',
        operationId: 'get_subscriptions__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/subscriptions/:id': {
      get: {
        tags: ['subscriptions'],
        summary: 'Get subscription by ID',
        description:
          'Retrieve detailed information about a specific subscription by their unique identifier.\n\n**Category:** subscriptions\n**Method:** GET\n**Path:** /api/v1/subscriptions/:id',
        operationId: 'get_subscriptions___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['subscriptions'],
        summary: 'Update subscription',
        description:
          'Update all fields of an existing subscription. Requires all fields to be provided.\n\n**Category:** subscriptions\n**Method:** PUT\n**Path:** /api/v1/subscriptions/:id',
        operationId: 'put_subscriptions___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample subscription',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['subscriptions'],
        summary: 'Delete subscription',
        description:
          'Permanently delete a subscription from the system. This action cannot be undone.\n\n**Category:** subscriptions\n**Method:** DELETE\n**Path:** /api/v1/subscriptions/:id',
        operationId: 'delete_subscriptions___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/subscriptions/:id/cancel': {
      patch: {
        tags: ['subscriptions'],
        summary: 'Partially update subscription',
        description:
          'Partially update an existing subscription. Only provided fields will be updated.\n\n**Category:** subscriptions\n**Method:** PATCH\n**Path:** /api/v1/subscriptions/:id/cancel',
        operationId: 'patch_subscriptions___id_cancel',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample subscription',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/subscriptions/user/:userId': {
      get: {
        tags: ['subscriptions'],
        summary: 'GET subscriptions - userId',
        description:
          'GET operation for subscriptions\n\n**Category:** subscriptions\n**Method:** GET\n**Path:** /api/v1/subscriptions/user/:userId',
        operationId: 'get_subscriptions__user__userId',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/support/': {
      post: {
        tags: ['support'],
        summary: 'Create new suppor',
        description:
          'Create a new suppor with the provided data. Validates all required fields.\n\n**Category:** support\n**Method:** POST\n**Path:** /api/v1/support/',
        operationId: 'post_support__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample suppor',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['support'],
        summary: 'Get all support',
        description:
          'Retrieve a paginated list of support. Supports filtering, searching, and sorting.\n\n**Category:** support\n**Method:** GET\n**Path:** /api/v1/support/',
        operationId: 'get_support__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/support/:id': {
      get: {
        tags: ['support'],
        summary: 'Get suppor by ID',
        description:
          'Retrieve detailed information about a specific suppor by their unique identifier.\n\n**Category:** support\n**Method:** GET\n**Path:** /api/v1/support/:id',
        operationId: 'get_support___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['support'],
        summary: 'Update suppor',
        description:
          'Update all fields of an existing suppor. Requires all fields to be provided.\n\n**Category:** support\n**Method:** PUT\n**Path:** /api/v1/support/:id',
        operationId: 'put_support___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample suppor',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['support'],
        summary: 'Delete suppor',
        description:
          'Permanently delete a suppor from the system. This action cannot be undone.\n\n**Category:** support\n**Method:** DELETE\n**Path:** /api/v1/support/:id',
        operationId: 'delete_support___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/systemSettings/': {
      get: {
        tags: ['systemSettings'],
        summary: 'Get all systemSettings',
        description:
          'Retrieve a paginated list of systemSettings. Supports filtering, searching, and sorting.\n\n**Category:** systemSettings\n**Method:** GET\n**Path:** /api/v1/systemSettings/',
        operationId: 'get_systemSettings__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ['systemSettings'],
        summary: 'Create new systemSetting',
        description:
          'Create a new systemSetting with the provided data. Validates all required fields.\n\n**Category:** systemSettings\n**Method:** POST\n**Path:** /api/v1/systemSettings/',
        operationId: 'post_systemSettings__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample systemSetting',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/systemSettings/public': {
      get: {
        tags: ['systemSettings'],
        summary: 'GET systemSettings - public',
        description:
          'GET operation for systemSettings\n\n**Category:** systemSettings\n**Method:** GET\n**Path:** /api/v1/systemSettings/public',
        operationId: 'get_systemSettings__public',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/systemSettings/category/:category': {
      get: {
        tags: ['systemSettings'],
        summary: 'GET systemSettings - category',
        description:
          'GET operation for systemSettings\n\n**Category:** systemSettings\n**Method:** GET\n**Path:** /api/v1/systemSettings/category/:category',
        operationId: 'get_systemSettings__category__category',
        parameters: [
          {
            name: 'category',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'category identifier',
            example: 'category_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/systemSettings/key/:key': {
      get: {
        tags: ['systemSettings'],
        summary: 'GET systemSettings - key',
        description:
          'GET operation for systemSettings\n\n**Category:** systemSettings\n**Method:** GET\n**Path:** /api/v1/systemSettings/key/:key',
        operationId: 'get_systemSettings__key__key',
        parameters: [
          {
            name: 'key',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'key identifier',
            example: 'key_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['systemSettings'],
        summary: 'PUT systemSettings - key',
        description:
          'PUT operation for systemSettings\n\n**Category:** systemSettings\n**Method:** PUT\n**Path:** /api/v1/systemSettings/key/:key',
        operationId: 'put_systemSettings__key__key',
        parameters: [
          {
            name: 'key',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'key identifier',
            example: 'key_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample systemSetting',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['systemSettings'],
        summary: 'DELETE systemSettings - key',
        description:
          'DELETE operation for systemSettings\n\n**Category:** systemSettings\n**Method:** DELETE\n**Path:** /api/v1/systemSettings/key/:key',
        operationId: 'delete_systemSettings__key__key',
        parameters: [
          {
            name: 'key',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'key identifier',
            example: 'key_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/systemSettings/bulk': {
      put: {
        tags: ['systemSettings'],
        summary: 'PUT systemSettings - bulk',
        description:
          'PUT operation for systemSettings\n\n**Category:** systemSettings\n**Method:** PUT\n**Path:** /api/v1/systemSettings/bulk',
        operationId: 'put_systemSettings__bulk',
        parameters: [],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample systemSetting',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/systemSettings/key/:key/reset': {
      put: {
        tags: ['systemSettings'],
        summary: 'PUT systemSettings - reset',
        description:
          'PUT operation for systemSettings\n\n**Category:** systemSettings\n**Method:** PUT\n**Path:** /api/v1/systemSettings/key/:key/reset',
        operationId: 'put_systemSettings__key__key_reset',
        parameters: [
          {
            name: 'key',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'key identifier',
            example: 'key_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample systemSetting',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/systemSettings/:id': {
      get: {
        tags: ['systemSettings'],
        summary: 'Get systemSetting by ID',
        description:
          'Retrieve detailed information about a specific systemSetting by their unique identifier.\n\n**Category:** systemSettings\n**Method:** GET\n**Path:** /api/v1/systemSettings/:id',
        operationId: 'get_systemSettings___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/termsPrivacy/terms': {
      get: {
        tags: ['termsPrivacy'],
        summary: 'GET termsPrivacy - terms',
        description:
          'GET operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** GET\n**Path:** /api/v1/termsPrivacy/terms',
        operationId: 'get_termsPrivacy__terms',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ['termsPrivacy'],
        summary: 'POST termsPrivacy - terms',
        description:
          'POST operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** POST\n**Path:** /api/v1/termsPrivacy/terms',
        operationId: 'post_termsPrivacy__terms',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample termsPrivac',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/termsPrivacy/terms/active': {
      get: {
        tags: ['termsPrivacy'],
        summary: 'GET termsPrivacy - active',
        description:
          'GET operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** GET\n**Path:** /api/v1/termsPrivacy/terms/active',
        operationId: 'get_termsPrivacy__terms_active',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/termsPrivacy/terms/:id': {
      put: {
        tags: ['termsPrivacy'],
        summary: 'Update termsPrivac',
        description:
          'Update all fields of an existing termsPrivac. Requires all fields to be provided.\n\n**Category:** termsPrivacy\n**Method:** PUT\n**Path:** /api/v1/termsPrivacy/terms/:id',
        operationId: 'put_termsPrivacy__terms__id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample termsPrivac',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/termsPrivacy/terms/:id/publish': {
      put: {
        tags: ['termsPrivacy'],
        summary: 'Update termsPrivac',
        description:
          'Update all fields of an existing termsPrivac. Requires all fields to be provided.\n\n**Category:** termsPrivacy\n**Method:** PUT\n**Path:** /api/v1/termsPrivacy/terms/:id/publish',
        operationId: 'put_termsPrivacy__terms__id_publish',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample termsPrivac',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/termsPrivacy/privacy': {
      get: {
        tags: ['termsPrivacy'],
        summary: 'GET termsPrivacy - privacy',
        description:
          'GET operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** GET\n**Path:** /api/v1/termsPrivacy/privacy',
        operationId: 'get_termsPrivacy__privacy',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ['termsPrivacy'],
        summary: 'POST termsPrivacy - privacy',
        description:
          'POST operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** POST\n**Path:** /api/v1/termsPrivacy/privacy',
        operationId: 'post_termsPrivacy__privacy',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample termsPrivac',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/termsPrivacy/privacy/active': {
      get: {
        tags: ['termsPrivacy'],
        summary: 'GET termsPrivacy - active',
        description:
          'GET operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** GET\n**Path:** /api/v1/termsPrivacy/privacy/active',
        operationId: 'get_termsPrivacy__privacy_active',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/termsPrivacy/privacy/:id': {
      put: {
        tags: ['termsPrivacy'],
        summary: 'Update termsPrivac',
        description:
          'Update all fields of an existing termsPrivac. Requires all fields to be provided.\n\n**Category:** termsPrivacy\n**Method:** PUT\n**Path:** /api/v1/termsPrivacy/privacy/:id',
        operationId: 'put_termsPrivacy__privacy__id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample termsPrivac',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/termsPrivacy/privacy/:id/publish': {
      put: {
        tags: ['termsPrivacy'],
        summary: 'Update termsPrivac',
        description:
          'Update all fields of an existing termsPrivac. Requires all fields to be provided.\n\n**Category:** termsPrivacy\n**Method:** PUT\n**Path:** /api/v1/termsPrivacy/privacy/:id/publish',
        operationId: 'put_termsPrivacy__privacy__id_publish',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample termsPrivac',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/termsPrivacy/acceptance': {
      post: {
        tags: ['termsPrivacy'],
        summary: 'POST termsPrivacy - acceptance',
        description:
          'POST operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** POST\n**Path:** /api/v1/termsPrivacy/acceptance',
        operationId: 'post_termsPrivacy__acceptance',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample termsPrivac',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/termsPrivacy/acceptance/user/:userId': {
      get: {
        tags: ['termsPrivacy'],
        summary: 'GET termsPrivacy - userId',
        description:
          'GET operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** GET\n**Path:** /api/v1/termsPrivacy/acceptance/user/:userId',
        operationId: 'get_termsPrivacy__acceptance_user__userId',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/termsPrivacy/acceptance/check/:userId': {
      get: {
        tags: ['termsPrivacy'],
        summary: 'GET termsPrivacy - userId',
        description:
          'GET operation for termsPrivacy\n\n**Category:** termsPrivacy\n**Method:** GET\n**Path:** /api/v1/termsPrivacy/acceptance/check/:userId',
        operationId: 'get_termsPrivacy__acceptance_check__userId',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/termsPrivacy/:id': {
      get: {
        tags: ['termsPrivacy'],
        summary: 'Get termsPrivac by ID',
        description:
          'Retrieve detailed information about a specific termsPrivac by their unique identifier.\n\n**Category:** termsPrivacy\n**Method:** GET\n**Path:** /api/v1/termsPrivacy/:id',
        operationId: 'get_termsPrivacy___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      delete: {
        tags: ['termsPrivacy'],
        summary: 'Delete termsPrivac',
        description:
          'Permanently delete a termsPrivac from the system. This action cannot be undone.\n\n**Category:** termsPrivacy\n**Method:** DELETE\n**Path:** /api/v1/termsPrivacy/:id',
        operationId: 'delete_termsPrivacy___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/test/test/comprehensive': {
      get: {
        tags: ['test'],
        summary: 'GET test - comprehensive',
        description:
          'GET operation for test\n\n**Category:** test\n**Method:** GET\n**Path:** /api/v1/test/test/comprehensive',
        operationId: 'get_test__test_comprehensive',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/translation/translate': {
      post: {
        tags: ['translation'],
        summary: 'POST translation - translate',
        description:
          'POST operation for translation\n\n**Category:** translation\n**Method:** POST\n**Path:** /api/v1/translation/translate',
        operationId: 'post_translation__translate',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translatio',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/translation/translate-batch': {
      post: {
        tags: ['translation'],
        summary: 'POST translation - translate-batch',
        description:
          'POST operation for translation\n\n**Category:** translation\n**Method:** POST\n**Path:** /api/v1/translation/translate-batch',
        operationId: 'post_translation__translate-batch',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translatio',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/translation/detect': {
      post: {
        tags: ['translation'],
        summary: 'POST translation - detect',
        description:
          'POST operation for translation\n\n**Category:** translation\n**Method:** POST\n**Path:** /api/v1/translation/detect',
        operationId: 'post_translation__detect',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translatio',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/translation/languages': {
      get: {
        tags: ['translation'],
        summary: 'GET translation - languages',
        description:
          'GET operation for translation\n\n**Category:** translation\n**Method:** GET\n**Path:** /api/v1/translation/languages',
        operationId: 'get_translation__languages',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/translation/queue': {
      post: {
        tags: ['translation'],
        summary: 'POST translation - queue',
        description:
          'POST operation for translation\n\n**Category:** translation\n**Method:** POST\n**Path:** /api/v1/translation/queue',
        operationId: 'post_translation__queue',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translatio',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/translation/job/:jobId': {
      get: {
        tags: ['translation'],
        summary: 'GET translation - jobId',
        description:
          'GET operation for translation\n\n**Category:** translation\n**Method:** GET\n**Path:** /api/v1/translation/job/:jobId',
        operationId: 'get_translation__job__jobId',
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'jobId identifier',
            example: 'jobId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      delete: {
        tags: ['translation'],
        summary: 'DELETE translation - jobId',
        description:
          'DELETE operation for translation\n\n**Category:** translation\n**Method:** DELETE\n**Path:** /api/v1/translation/job/:jobId',
        operationId: 'delete_translation__job__jobId',
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'jobId identifier',
            example: 'jobId_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/translation/queue/stats': {
      get: {
        tags: ['translation'],
        summary: 'GET translation - stats',
        description:
          'GET operation for translation\n\n**Category:** translation\n**Method:** GET\n**Path:** /api/v1/translation/queue/stats',
        operationId: 'get_translation__queue_stats',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/translation/queue/clean-completed': {
      post: {
        tags: ['translation'],
        summary: 'POST translation - clean-completed',
        description:
          'POST operation for translation\n\n**Category:** translation\n**Method:** POST\n**Path:** /api/v1/translation/queue/clean-completed',
        operationId: 'post_translation__queue_clean-completed',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translatio',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/translation/queue/clean-failed': {
      post: {
        tags: ['translation'],
        summary: 'POST translation - clean-failed',
        description:
          'POST operation for translation\n\n**Category:** translation\n**Method:** POST\n**Path:** /api/v1/translation/queue/clean-failed',
        operationId: 'post_translation__queue_clean-failed',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translatio',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/translations/': {
      post: {
        tags: ['translations'],
        summary: 'Create new translation',
        description:
          'Create a new translation with the provided data. Validates all required fields.\n\n**Category:** translations\n**Method:** POST\n**Path:** /api/v1/translations/',
        operationId: 'post_translations__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translation',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['translations'],
        summary: 'Get all translations',
        description:
          'Retrieve a paginated list of translations. Supports filtering, searching, and sorting.\n\n**Category:** translations\n**Method:** GET\n**Path:** /api/v1/translations/',
        operationId: 'get_translations__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/translations/:id': {
      get: {
        tags: ['translations'],
        summary: 'Get translation by ID',
        description:
          'Retrieve detailed information about a specific translation by their unique identifier.\n\n**Category:** translations\n**Method:** GET\n**Path:** /api/v1/translations/:id',
        operationId: 'get_translations___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['translations'],
        summary: 'Update translation',
        description:
          'Update all fields of an existing translation. Requires all fields to be provided.\n\n**Category:** translations\n**Method:** PUT\n**Path:** /api/v1/translations/:id',
        operationId: 'put_translations___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample translation',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['translations'],
        summary: 'Delete translation',
        description:
          'Permanently delete a translation from the system. This action cannot be undone.\n\n**Category:** translations\n**Method:** DELETE\n**Path:** /api/v1/translations/:id',
        operationId: 'delete_translations___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/translations/:key/:language': {
      get: {
        tags: ['translations'],
        summary: 'GET translations - language',
        description:
          'GET operation for translations\n\n**Category:** translations\n**Method:** GET\n**Path:** /api/v1/translations/:key/:language',
        operationId: 'get_translations___key__language',
        parameters: [
          {
            name: 'key',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'key identifier',
            example: 'key_123',
          },
          {
            name: 'language',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'language identifier',
            example: 'language_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/treatmentCategories/': {
      post: {
        tags: ['treatmentCategories'],
        summary: 'Create new treatmentCategorie',
        description:
          'Create a new treatmentCategorie with the provided data. Validates all required fields.\n\n**Category:** treatmentCategories\n**Method:** POST\n**Path:** /api/v1/treatmentCategories/',
        operationId: 'post_treatmentCategories__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample treatmentCategorie',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['treatmentCategories'],
        summary: 'Get all treatmentCategories',
        description:
          'Retrieve a paginated list of treatmentCategories. Supports filtering, searching, and sorting.\n\n**Category:** treatmentCategories\n**Method:** GET\n**Path:** /api/v1/treatmentCategories/',
        operationId: 'get_treatmentCategories__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/treatmentCategories/:id': {
      get: {
        tags: ['treatmentCategories'],
        summary: 'Get treatmentCategorie by ID',
        description:
          'Retrieve detailed information about a specific treatmentCategorie by their unique identifier.\n\n**Category:** treatmentCategories\n**Method:** GET\n**Path:** /api/v1/treatmentCategories/:id',
        operationId: 'get_treatmentCategories___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['treatmentCategories'],
        summary: 'Update treatmentCategorie',
        description:
          'Update all fields of an existing treatmentCategorie. Requires all fields to be provided.\n\n**Category:** treatmentCategories\n**Method:** PUT\n**Path:** /api/v1/treatmentCategories/:id',
        operationId: 'put_treatmentCategories___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample treatmentCategorie',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['treatmentCategories'],
        summary: 'Delete treatmentCategorie',
        description:
          'Permanently delete a treatmentCategorie from the system. This action cannot be undone.\n\n**Category:** treatmentCategories\n**Method:** DELETE\n**Path:** /api/v1/treatmentCategories/:id',
        operationId: 'delete_treatmentCategories___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/treatments/': {
      post: {
        tags: ['treatments'],
        summary: 'Create new treatment',
        description:
          'Create a new treatment with the provided data. Validates all required fields.\n\n**Category:** treatments\n**Method:** POST\n**Path:** /api/v1/treatments/',
        operationId: 'post_treatments__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample treatment',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['treatments'],
        summary: 'Get all treatments',
        description:
          'Retrieve a paginated list of treatments. Supports filtering, searching, and sorting.\n\n**Category:** treatments\n**Method:** GET\n**Path:** /api/v1/treatments/',
        operationId: 'get_treatments__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/treatments/:id': {
      get: {
        tags: ['treatments'],
        summary: 'Get treatment by ID',
        description:
          'Retrieve detailed information about a specific treatment by their unique identifier.\n\n**Category:** treatments\n**Method:** GET\n**Path:** /api/v1/treatments/:id',
        operationId: 'get_treatments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['treatments'],
        summary: 'Update treatment',
        description:
          'Update all fields of an existing treatment. Requires all fields to be provided.\n\n**Category:** treatments\n**Method:** PUT\n**Path:** /api/v1/treatments/:id',
        operationId: 'put_treatments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample treatment',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['treatments'],
        summary: 'Delete treatment',
        description:
          'Permanently delete a treatment from the system. This action cannot be undone.\n\n**Category:** treatments\n**Method:** DELETE\n**Path:** /api/v1/treatments/:id',
        operationId: 'delete_treatments___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/treatments/category/:categoryId': {
      get: {
        tags: ['treatments'],
        summary: 'GET treatments - categoryId',
        description:
          'GET operation for treatments\n\n**Category:** treatments\n**Method:** GET\n**Path:** /api/v1/treatments/category/:categoryId',
        operationId: 'get_treatments__category__categoryId',
        parameters: [
          {
            name: 'categoryId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'categoryId identifier',
            example: 'categoryId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/treatments/subcategory/:subcategoryId': {
      get: {
        tags: ['treatments'],
        summary: 'GET treatments - subcategoryId',
        description:
          'GET operation for treatments\n\n**Category:** treatments\n**Method:** GET\n**Path:** /api/v1/treatments/subcategory/:subcategoryId',
        operationId: 'get_treatments__subcategory__subcategoryId',
        parameters: [
          {
            name: 'subcategoryId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'subcategoryId identifier',
            example: 'subcategoryId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/uploads/': {
      post: {
        tags: ['uploads'],
        summary: 'Create new upload',
        description:
          'Create a new upload with the provided data. Validates all required fields.\n\n**Category:** uploads\n**Method:** POST\n**Path:** /api/v1/uploads/',
        operationId: 'post_uploads__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample upload',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['uploads'],
        summary: 'Get all uploads',
        description:
          'Retrieve a paginated list of uploads. Supports filtering, searching, and sorting.\n\n**Category:** uploads\n**Method:** GET\n**Path:** /api/v1/uploads/',
        operationId: 'get_uploads__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/uploads/:id': {
      get: {
        tags: ['uploads'],
        summary: 'Get upload by ID',
        description:
          'Retrieve detailed information about a specific upload by their unique identifier.\n\n**Category:** uploads\n**Method:** GET\n**Path:** /api/v1/uploads/:id',
        operationId: 'get_uploads___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['uploads'],
        summary: 'Update upload',
        description:
          'Update all fields of an existing upload. Requires all fields to be provided.\n\n**Category:** uploads\n**Method:** PUT\n**Path:** /api/v1/uploads/:id',
        operationId: 'put_uploads___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample upload',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['uploads'],
        summary: 'Delete upload',
        description:
          'Permanently delete a upload from the system. This action cannot be undone.\n\n**Category:** uploads\n**Method:** DELETE\n**Path:** /api/v1/uploads/:id',
        operationId: 'delete_uploads___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/uploads/entity/:entityType/:entityId': {
      get: {
        tags: ['uploads'],
        summary: 'GET uploads - entityId',
        description:
          'GET operation for uploads\n\n**Category:** uploads\n**Method:** GET\n**Path:** /api/v1/uploads/entity/:entityType/:entityId',
        operationId: 'get_uploads__entity__entityType__entityId',
        parameters: [
          {
            name: 'entityType',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'entityType identifier',
            example: 'entityType_123',
          },
          {
            name: 'entityId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'entityId identifier',
            example: 'entityId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/users/': {
      post: {
        tags: ['users'],
        summary: 'Create new user',
        description:
          'Create a new user with the provided data. Validates all required fields.\n\n**Category:** users\n**Method:** POST\n**Path:** /api/v1/users/',
        operationId: 'post_users__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample user',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['users'],
        summary: 'Get all users',
        description:
          'Retrieve a paginated list of users. Supports filtering, searching, and sorting.\n\n**Category:** users\n**Method:** GET\n**Path:** /api/v1/users/',
        operationId: 'get_users__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/users/:id': {
      get: {
        tags: ['users'],
        summary: 'Get user by ID',
        description:
          'Retrieve detailed information about a specific user by their unique identifier.\n\n**Category:** users\n**Method:** GET\n**Path:** /api/v1/users/:id',
        operationId: 'get_users___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['users'],
        summary: 'Update user',
        description:
          'Update all fields of an existing user. Requires all fields to be provided.\n\n**Category:** users\n**Method:** PUT\n**Path:** /api/v1/users/:id',
        operationId: 'put_users___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample user',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['users'],
        summary: 'Delete user',
        description:
          'Permanently delete a user from the system. This action cannot be undone.\n\n**Category:** users\n**Method:** DELETE\n**Path:** /api/v1/users/:id',
        operationId: 'delete_users___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/videoCalls/': {
      post: {
        tags: ['videoCalls'],
        summary: 'Create new videoCall',
        description:
          'Create a new videoCall with the provided data. Validates all required fields.\n\n**Category:** videoCalls\n**Method:** POST\n**Path:** /api/v1/videoCalls/',
        operationId: 'post_videoCalls__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample videoCall',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['videoCalls'],
        summary: 'Get all videoCalls',
        description:
          'Retrieve a paginated list of videoCalls. Supports filtering, searching, and sorting.\n\n**Category:** videoCalls\n**Method:** GET\n**Path:** /api/v1/videoCalls/',
        operationId: 'get_videoCalls__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/videoCalls/:id/join': {
      post: {
        tags: ['videoCalls'],
        summary: 'POST videoCalls - join',
        description:
          'POST operation for videoCalls\n\n**Category:** videoCalls\n**Method:** POST\n**Path:** /api/v1/videoCalls/:id/join',
        operationId: 'post_videoCalls___id_join',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample videoCall',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/videoCalls/:id/start': {
      put: {
        tags: ['videoCalls'],
        summary: 'Update videoCall',
        description:
          'Update all fields of an existing videoCall. Requires all fields to be provided.\n\n**Category:** videoCalls\n**Method:** PUT\n**Path:** /api/v1/videoCalls/:id/start',
        operationId: 'put_videoCalls___id_start',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample videoCall',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/videoCalls/:id/end': {
      put: {
        tags: ['videoCalls'],
        summary: 'Update videoCall',
        description:
          'Update all fields of an existing videoCall. Requires all fields to be provided.\n\n**Category:** videoCalls\n**Method:** PUT\n**Path:** /api/v1/videoCalls/:id/end',
        operationId: 'put_videoCalls___id_end',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample videoCall',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/videoCalls/:id/cancel': {
      put: {
        tags: ['videoCalls'],
        summary: 'Update videoCall',
        description:
          'Update all fields of an existing videoCall. Requires all fields to be provided.\n\n**Category:** videoCalls\n**Method:** PUT\n**Path:** /api/v1/videoCalls/:id/cancel',
        operationId: 'put_videoCalls___id_cancel',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample videoCall',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/videoCalls/:id/recording': {
      put: {
        tags: ['videoCalls'],
        summary: 'Update videoCall',
        description:
          'Update all fields of an existing videoCall. Requires all fields to be provided.\n\n**Category:** videoCalls\n**Method:** PUT\n**Path:** /api/v1/videoCalls/:id/recording',
        operationId: 'put_videoCalls___id_recording',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample videoCall',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
    },
    '/videoCalls/user/:userId/history': {
      get: {
        tags: ['videoCalls'],
        summary: 'GET videoCalls - history',
        description:
          'GET operation for videoCalls\n\n**Category:** videoCalls\n**Method:** GET\n**Path:** /api/v1/videoCalls/user/:userId/history',
        operationId: 'get_videoCalls__user__userId_history',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/videoCalls/user/:userId/upcoming': {
      get: {
        tags: ['videoCalls'],
        summary: 'GET videoCalls - upcoming',
        description:
          'GET operation for videoCalls\n\n**Category:** videoCalls\n**Method:** GET\n**Path:** /api/v1/videoCalls/user/:userId/upcoming',
        operationId: 'get_videoCalls__user__userId_upcoming',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'userId identifier',
            example: 'userId_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/videoCalls/:id': {
      get: {
        tags: ['videoCalls'],
        summary: 'Get videoCall by ID',
        description:
          'Retrieve detailed information about a specific videoCall by their unique identifier.\n\n**Category:** videoCalls\n**Method:** GET\n**Path:** /api/v1/videoCalls/:id',
        operationId: 'get_videoCalls___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      delete: {
        tags: ['videoCalls'],
        summary: 'Delete videoCall',
        description:
          'Permanently delete a videoCall from the system. This action cannot be undone.\n\n**Category:** videoCalls\n**Method:** DELETE\n**Path:** /api/v1/videoCalls/:id',
        operationId: 'delete_videoCalls___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/websiteContent/': {
      post: {
        tags: ['websiteContent'],
        summary: 'Create new websiteConten',
        description:
          'Create a new websiteConten with the provided data. Validates all required fields.\n\n**Category:** websiteContent\n**Method:** POST\n**Path:** /api/v1/websiteContent/',
        operationId: 'post_websiteContent__',
        parameters: [],
        responses: {
          201: {
            description: 'Resource created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample websiteConten',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      get: {
        tags: ['websiteContent'],
        summary: 'Get all websiteContent',
        description:
          'Retrieve a paginated list of websiteContent. Supports filtering, searching, and sorting.\n\n**Category:** websiteContent\n**Method:** GET\n**Path:** /api/v1/websiteContent/',
        operationId: 'get_websiteContent__',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/websiteContent/:id': {
      get: {
        tags: ['websiteContent'],
        summary: 'Get websiteConten by ID',
        description:
          'Retrieve detailed information about a specific websiteConten by their unique identifier.\n\n**Category:** websiteContent\n**Method:** GET\n**Path:** /api/v1/websiteContent/:id',
        operationId: 'get_websiteContent___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      put: {
        tags: ['websiteContent'],
        summary: 'Update websiteConten',
        description:
          'Update all fields of an existing websiteConten. Requires all fields to be provided.\n\n**Category:** websiteContent\n**Method:** PUT\n**Path:** /api/v1/websiteContent/:id',
        operationId: 'put_websiteContent___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name',
                  },
                  description: {
                    type: 'string',
                    description: 'Description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Status',
                  },
                },
                required: ['name'],
              },
              example: {
                name: 'Sample websiteConten',
                description: 'Sample description',
                status: 'active',
              },
            },
          },
        },
      },
      delete: {
        tags: ['websiteContent'],
        summary: 'Delete websiteConten',
        description:
          'Permanently delete a websiteConten from the system. This action cannot be undone.\n\n**Category:** websiteContent\n**Method:** DELETE\n**Path:** /api/v1/websiteContent/:id',
        operationId: 'delete_websiteContent___id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'id identifier',
            example: 'id_123',
          },
        ],
        responses: {
          200: {
            description: 'Resource deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Resource deleted successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/websiteContent/slug/:slug': {
      get: {
        tags: ['websiteContent'],
        summary: 'GET websiteContent - slug',
        description:
          'GET operation for websiteContent\n\n**Category:** websiteContent\n**Method:** GET\n**Path:** /api/v1/websiteContent/slug/:slug',
        operationId: 'get_websiteContent__slug__slug',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'slug identifier',
            example: 'slug_123',
          },
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            description: 'Page number for pagination',
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            description: 'Number of items per page',
          },
          {
            name: 'search',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Search term to filter results',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          200: {
            description: 'Operation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request - Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized - Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          404: {
            description: 'Not Found - Resource does not exist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
  },
  tags: [
    {
      name: 'analytics',
      description: 'analytics management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'appointments',
      description: 'appointments management endpoints (8 endpoints)',
      'x-endpoint-count': 8,
    },
    {
      name: 'auditLogs',
      description: 'auditLogs management endpoints (8 endpoints)',
      'x-endpoint-count': 8,
    },
    {
      name: 'auth',
      description: 'auth management endpoints (11 endpoints)',
      'x-endpoint-count': 11,
    },
    {
      name: 'bookingStatus',
      description: 'bookingStatus management endpoints (9 endpoints)',
      'x-endpoint-count': 9,
    },
    {
      name: 'bookings',
      description: 'bookings management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'chat',
      description: 'chat management endpoints (11 endpoints)',
      'x-endpoint-count': 11,
    },
    {
      name: 'coupons',
      description: 'coupons management endpoints (6 endpoints)',
      'x-endpoint-count': 6,
    },
    {
      name: 'dnaKits',
      description: 'dnaKits management endpoints (10 endpoints)',
      'x-endpoint-count': 10,
    },
    {
      name: 'doctorSchedules',
      description: 'doctorSchedules management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'doctors',
      description: 'doctors management endpoints (6 endpoints)',
      'x-endpoint-count': 6,
    },
    {
      name: 'faqs',
      description: 'faqs management endpoints (6 endpoints)',
      'x-endpoint-count': 6,
    },
    {
      name: 'health',
      description: 'health management endpoints (1 endpoints)',
      'x-endpoint-count': 1,
    },
    {
      name: 'hospitals',
      description: 'hospitals management endpoints (6 endpoints)',
      'x-endpoint-count': 6,
    },
    {
      name: 'insurance',
      description: 'insurance management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'integrations',
      description: 'integrations management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'invoices',
      description: 'invoices management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'labTests',
      description: 'labTests management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'laboratories',
      description: 'laboratories management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'media',
      description: 'media management endpoints (15 endpoints)',
      'x-endpoint-count': 15,
    },
    {
      name: 'medicalRecords',
      description: 'medicalRecords management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'notifications',
      description: 'notifications management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'packages',
      description: 'packages management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'patients',
      description: 'patients management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'payments',
      description: 'payments management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'prescriptions',
      description: 'prescriptions management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'reviews',
      description: 'reviews management endpoints (6 endpoints)',
      'x-endpoint-count': 6,
    },
    {
      name: 'staff',
      description: 'staff management endpoints (8 endpoints)',
      'x-endpoint-count': 8,
    },
    {
      name: 'subscriptions',
      description: 'subscriptions management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'support',
      description: 'support management endpoints (6 endpoints)',
      'x-endpoint-count': 6,
    },
    {
      name: 'systemSettings',
      description: 'systemSettings management endpoints (10 endpoints)',
      'x-endpoint-count': 10,
    },
    {
      name: 'termsPrivacy',
      description: 'termsPrivacy management endpoints (15 endpoints)',
      'x-endpoint-count': 15,
    },
    {
      name: 'test',
      description: 'test management endpoints (1 endpoints)',
      'x-endpoint-count': 1,
    },
    {
      name: 'translation',
      description: 'translation management endpoints (10 endpoints)',
      'x-endpoint-count': 10,
    },
    {
      name: 'translations',
      description: 'translations management endpoints (6 endpoints)',
      'x-endpoint-count': 6,
    },
    {
      name: 'treatmentCategories',
      description: 'treatmentCategories management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'treatments',
      description: 'treatments management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'uploads',
      description: 'uploads management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
    {
      name: 'users',
      description: 'users management endpoints (5 endpoints)',
      'x-endpoint-count': 5,
    },
    {
      name: 'videoCalls',
      description: 'videoCalls management endpoints (11 endpoints)',
      'x-endpoint-count': 11,
    },
    {
      name: 'websiteContent',
      description: 'websiteContent management endpoints (7 endpoints)',
      'x-endpoint-count': 7,
    },
  ],
};

const options = {
  definition: completeSpec,
  apis: [], // All endpoints are defined in the spec above
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup,
};

// Swagger Configuration - NO optional chaining
import swaggerJsdoc from 'swagger-jsdoc';
import config from './index.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Medivoy Healthcare Backend API',
            version: '1.0.0',
            description: 'Complete Medical Tourism Platform with Booking, Payments, Consultations & Document Management',
            contact: {
                name: 'Medivoy Support',
                email: 'support@medivoy.com',
            },
            license: {
                name: 'ISC',
            },
        },
        servers: [{
                url: `http://localhost:${config.port}/api`,
                description: 'Development Server',
            },
            {
                url: 'https://api.medivoy.com/api',
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication',
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
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                        error: {
                            type: 'object',
                            description: 'Error details (development only)',
                        },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Success message',
                        },
                        data: {
                            type: 'object',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        email: {
                            type: 'string',
                            example: 'user@medivoy.com',
                        },
                        firstName: {
                            type: 'string',
                            example: 'John',
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe',
                        },
                        phone: {
                            type: 'string',
                            example: '+919876543210',
                        },
                        role: {
                            type: 'string',
                            enum: ['patient', 'doctor', 'medivoy_staff', 'admin', 'super_admin'],
                            example: 'patient',
                        },
                        isActive: {
                            type: 'boolean',
                            example: true,
                        },
                        emailVerified: {
                            type: 'boolean',
                            example: false,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                        accessToken: {
                            type: 'string',
                            description: 'JWT Access Token (valid for 24 hours)',
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'JWT Refresh Token (valid for 7 days)',
                        },
                    },
                },
                Booking: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        patientId: {
                            type: 'integer',
                            example: 5,
                        },
                        countryId: {
                            type: 'integer',
                            example: 1,
                        },
                        hospitalId: {
                            type: 'integer',
                            example: 3,
                        },
                        doctorId: {
                            type: 'integer',
                            example: 2,
                        },
                        treatmentId: {
                            type: 'integer',
                            example: 4,
                        },
                        packageTypeId: {
                            type: 'integer',
                            example: 1,
                        },
                        packageTierId: {
                            type: 'integer',
                            example: 2,
                        },
                        bookingStatus: {
                            type: 'string',
                            enum: ['inquiry', 'under_review', 'accepted', 'rejected', 'completed'],
                            example: 'inquiry',
                        },
                        totalCost: {
                            type: 'number',
                            example: 50000.00,
                        },
                        currency: {
                            type: 'string',
                            example: 'INR',
                        },
                        bookingReference: {
                            type: 'string',
                            example: 'BK20251106ABC123',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer',
                            example: 1,
                        },
                        limit: {
                            type: 'integer',
                            example: 10,
                        },
                        total: {
                            type: 'integer',
                            example: 50,
                        },
                        totalPages: {
                            type: 'integer',
                            example: 5,
                        },
                        hasNextPage: {
                            type: 'boolean',
                            example: true,
                        },
                        hasPrevPage: {
                            type: 'boolean',
                            example: false,
                        },
                    },
                },
            },
        },
    },
    apis: [
        './src/routes/auth.routes.js',
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
const fs = require('fs');
const path = require('path');

/**
 * Generate Comprehensive Swagger Documentation for ALL 287 Endpoints
 */

const routesDir = path.join(__dirname, 'src', 'routes', 'v1');

// Read all route files and extract endpoints
const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.routes.js'));

const allEndpoints = [];

console.log('🔍 Analyzing routes for Swagger documentation...\n');

routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const routeName = file.replace('.routes.js', '');
  console.log(`📁 Processing ${file} for Swagger docs...`);
  
  // Extract route definitions with regex
  const routePatterns = [
    /router\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(\w+)\./g,
  ];
  
  routePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      const controllerName = match[3];
      const fullPath = `/api/v1/${routeName}${path === '/' ? '' : path}`;
      
      allEndpoints.push({
        method,
        path: fullPath,
        file: file,
        category: routeName,
        controllerName
      });
    }
  });
});

// Group by category
const groupedEndpoints = {};
allEndpoints.forEach(endpoint => {
  if (!groupedEndpoints[endpoint.category]) {
    groupedEndpoints[endpoint.category] = [];
  }
  groupedEndpoints[endpoint.category].push(endpoint);
});

// Generate comprehensive Swagger documentation
let swaggerDocs = `/**
 * @swagger
 * components:
 *   schemas:
 *     # This file contains comprehensive Swagger documentation for ALL 287 API endpoints
 *     # Generated automatically from route files
 *     # Last Updated: ${new Date().toISOString()}
 */

`;

// Generate tags documentation
swaggerDocs += `/**\n * @swagger\n * tags:\n`;

Object.keys(groupedEndpoints).sort().forEach(category => {
  const tagDescription = getTagDescription(category);
  swaggerDocs += ` *   - name: ${capitalizeFirst(category)}\n`;
  swaggerDocs += ` *     description: ${tagDescription}\n`;
});

swaggerDocs += ` */\n\n`;

// Generate documentation for each category
Object.keys(groupedEndpoints).sort().forEach(category => {
  const endpoints = groupedEndpoints[category];
  swaggerDocs += generateCategorySwagger(category, endpoints);
  swaggerDocs += '\n';
});

// Save to swagger-docs.js
const swaggerFilePath = path.join(__dirname, 'src', 'routes', 'v1', 'swagger-docs.js');
fs.writeFileSync(swaggerFilePath, swaggerDocs);

console.log(`\n✅ Complete Swagger documentation generated!`);
console.log(`📊 Total endpoints documented: ${allEndpoints.length}`);
console.log(`📁 Total categories: ${Object.keys(groupedEndpoints).length}`);
console.log(`💾 File saved to: ${swaggerFilePath}`);

function generateCategorySwagger(category, endpoints) {
  let docs = `// ============================================================================\n`;
  docs += `// ${category.toUpperCase()} ENDPOINTS (${endpoints.length} endpoints)\n`;
  docs += `// ============================================================================\n\n`;
  
  // Group endpoints by path pattern for better organization
  const pathGroups = {};
  endpoints.forEach(endpoint => {
    const basePattern = getBasePattern(endpoint.path);
    if (!pathGroups[basePattern]) {
      pathGroups[basePattern] = [];
    }
    pathGroups[basePattern].push(endpoint);
  });
  
  Object.keys(pathGroups).forEach(pattern => {
    const patternEndpoints = pathGroups[pattern];
    const hasPathParam = pattern.includes(':id') || pattern.includes(':');
    
    docs += generatePathSwagger(pattern, patternEndpoints, category);
  });
  
  return docs;
}

function generatePathSwagger(pattern, endpoints, category) {
  let docs = '';
  const tag = capitalizeFirst(category);
  
  endpoints.forEach(endpoint => {
    const path = endpoint.path;
    const method = endpoint.method.toLowerCase();
    const hasIdParam = path.includes(':id');
    
    docs += `/**\n`;
    docs += ` * @swagger\n`;
    docs += ` ${path}:\n`;
    docs += `   ${method}:\n`;
    docs += `     summary: ${getEndpointSummary(endpoint.method, endpoint.path, category)}\n`;
    docs += `     description: ${getEndpointDescription(endpoint.method, endpoint.path, category)}\n`;
    docs += `     tags: [${tag}]\n`;
    
    // Add security (most endpoints require auth, except health and some public endpoints)
    if (!isPublicEndpoint(endpoint.path, endpoint.method)) {
      docs += `     security:\n`;
      docs += `       - bearerAuth: []\n`;
    } else {
      docs += `     security: []\n`;
    }
    
    // Add parameters
    if (hasIdParam) {
      docs += `     parameters:\n`;
      docs += `       - $ref: '#/components/parameters/idParam'\n`;
      docs += `       - in: query\n`;
      docs += `         name: include\n`;
      docs += `         schema:\n`;
      docs += `           type: string\n`;
      docs += `           enum: [doctor, patient, hospital, etc]\n`;
      docs += `         description: Include related data\n`;
    } else if (method === 'get') {
      docs += `     parameters:\n`;
      docs += `       - $ref: '#/components/parameters/pageParam'\n`;
      docs += `       - $ref: '#/components/parameters/limitParam'\n`;
      docs += `       - $ref: '#/components/parameters/searchParam'\n`;
      docs += `       - $ref: '#/components/parameters/sortParam'\n`;
      
      // Add category-specific filters
      const filters = getCategoryFilters(category);
      filters.forEach(filter => {
        docs += `       - in: query\n`;
        docs += `         name: ${filter.name}\n`;
        docs += `         schema:\n`;
        docs += `           type: ${filter.type}\n`;
        if (filter.enum) {
          docs += `           enum: [${filter.enum.map(e => `'${e}'`).join(', ')}]\n`;
        }
        docs += `         description: ${filter.description}\n`;
      });
    }
    
    // Add request body for POST, PUT, PATCH
    if (['post', 'put', 'patch'].includes(method)) {
      docs += `     requestBody:\n`;
      docs += `       required: true\n`;
      docs += `       content:\n`;
      docs += `         application/json:\n`;
      docs += `           schema:\n`;
      docs += `             type: object\n`;
      
      const properties = getRequestProperties(category, endpoint.method, endpoint.path);
      if (properties.required.length > 0) {
        docs += `             required: [${properties.required.map(r => `'${r}'`).join(', ')}]\n`;
      }
      docs += `             properties:\n`;
      
      properties.properties.forEach(prop => {
        docs += `               ${prop.name}:\n`;
        docs += `                 type: ${prop.type}\n`;
        if (prop.enum) {
          docs += `                 enum: [${prop.enum.map(e => `'${e}'`).join(', ')}]\n`;
        }
        if (prop.format) {
          docs += `                 format: ${prop.format}\n`;
        }
        if (prop.description) {
          docs += `                 description: ${prop.description}\n`;
        }
        if (prop.example) {
          docs += `                 example: ${prop.example}\n`;
        }
      });
    }
    
    // Add responses
    docs += `     responses:\n`;
    
    if (method === 'post') {
      docs += `       201:\n`;
      docs += `         $ref: '#/components/responses/Created'\n`;
    } else {
      docs += `       200:\n`;
      docs += `         description: ${getSuccessDescription(category, endpoint.method, endpoint.path)}\n`;
      docs += `         content:\n`;
      docs += `           application/json:\n`;
      if (hasIdParam || (method === 'get' && !path.includes('search'))) {
        docs += `             schema:\n`;
        docs += `               type: object\n`;
        docs += `               properties:\n`;
        docs += `                 success:\n`;
        docs += `                   type: boolean\n`;
        docs += `                   example: true\n`;
        docs += `                 message:\n`;
        docs += `                   type: string\n`;
        docs += `                 data:\n`;
        docs += `                   $ref: '#/components/schemas/${getSchemaName(category)}'\n`;
      } else {
        docs += `             schema:\n`;
        docs += `               $ref: '#/components/schemas/PaginatedResponse'\n`;
      }
    }
    
    // Add error responses
    if (!isPublicEndpoint(endpoint.path, endpoint.method)) {
      docs += `       401:\n`;
      docs += `         $ref: '#/components/responses/Unauthorized'\n`;
      docs += `       403:\n`;
      docs += `         $ref: '#/components/responses/Forbidden'\n`;
    }
    docs += `       400:\n`;
    docs += `         $ref: '#/components/responses/BadRequest'\n`;
    if (hasIdParam) {
      docs += `       404:\n`;
      docs += `         $ref: '#/components/responses/NotFound'\n`;
    }
    docs += `       500:\n`;
    docs += `         $ref: '#/components/responses/ServerError'\n`;
    docs += ` */\n\n`;
  });
  
  return docs;
}

function getBasePattern(path) {
  // Extract base pattern for grouping (e.g., /api/v1/doctors/:id -> /api/v1/doctors/:id)
  return path.replace(/\/\d+/, '/:id').replace(/\/[^\/]+\?/, '/');
}

function isPublicEndpoint(path, method) {
  const publicEndpoints = [
    '/api/v1/health',
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/reset-password',
    '/api/v1/faqs',
    '/api/v1/terms',
    '/api/v1/privacy',
    '/api/v1/website-content'
  ];
  
  return publicEndpoints.some(pub => path.startsWith(pub.replace('/api/v1/', '')));
}

function getEndpointSummary(method, path, category) {
  const resource = category.replace(/s$/, ''); // Remove trailing 's'
  
  if (path.includes(':id')) {
    switch(method) {
      case 'GET': return `Get ${resource} by ID`;
      case 'PUT': return `Update ${resource}`;
      case 'PATCH': return `Partially update ${resource}`;
      case 'DELETE': return `Delete ${resource}`;
      default: return `${method} ${resource}`;
    }
  }
  
  switch(method) {
    case 'GET': return `Get all ${category}`;
    case 'POST': return `Create new ${resource}`;
    default: return `${method} ${category}`;
  }
}

function getEndpointDescription(method, path, category) {
  const resource = category.replace(/s$/, '');
  const descriptions = {
    'auth': {
      'POST /': 'Handle authentication operations',
      'POST /login': 'Authenticate user with email and password',
      'POST /register': 'Register a new user account',
      'POST /refresh-token': 'Refresh expired access token',
      'POST /logout': 'Logout user and invalidate token',
      'POST /forgot-password': 'Send password reset email',
      'POST /reset-password': 'Reset password with token',
      'POST /verify-email': 'Verify email address',
      'POST /change-password': 'Change user password'
    },
    'users': {
      'GET /': 'Get all users with pagination and filters',
      'GET /profile': 'Get current user profile',
      'PUT /profile': 'Update current user profile',
      'DELETE /': 'Delete user account',
      'POST /avatar': 'Upload user avatar'
    },
    'patients': {
      'GET /': 'Get all patients with medical information',
      'POST /': 'Register new patient profile',
      'GET /me': 'Get current patient profile',
      'PUT /:id': 'Update patient information',
      'DELETE /:id': 'Delete patient record'
    },
    'doctors': {
      'GET /': 'Get all doctors with specializations',
      'POST /': 'Add new doctor to the system',
      'GET /:id': 'Get doctor details and availability',
      'PUT /:id': 'Update doctor information',
      'DELETE /:id': 'Remove doctor from system'
    },
    'hospitals': {
      'GET /': 'Get all hospitals with location filters',
      'POST /': 'Register new hospital',
      'GET /:id': 'Get hospital details',
      'PUT /:id': 'Update hospital information',
      'DELETE /:id': 'Remove hospital'
    },
    'appointments': {
      'GET /': 'Get appointments with status filters',
      'POST /': 'Schedule new appointment',
      'GET /:id': 'Get appointment details',
      'PUT /:id': 'Update appointment',
      'PATCH /:id/status': 'Change appointment status',
      'DELETE /:id': 'Cancel appointment'
    },
    'bookings': {
      'GET /': 'Get all bookings',
      'POST /': 'Create new booking',
      'GET /:id': 'Get booking details',
      'PUT /:id': 'Update booking',
      'PATCH /:id/status': 'Update booking status'
    },
    'payments': {
      'GET /': 'Get payment history',
      'POST /': 'Process new payment',
      'POST /process': 'Process payment with gateway',
      'GET /:id': 'Get payment details',
      'POST /:id/refund': 'Process refund'
    }
  };
  
  const pathKey = `${method.toUpperCase()} ${path.replace(/\/api\/v1\//, '').replace(/\/\d+/, '/:id')}`;
  if (descriptions[category] && descriptions[category][pathKey]) {
    return descriptions[category][pathKey];
  }
  
  // Default descriptions
  if (path.includes(':id')) {
    return `${method} operation for specific ${resource}`;
  }
  
  return `${method} operation for ${category}`;
}

function getSuccessDescription(category, method, path) {
  const resource = category.replace(/s$/, '');
  
  if (path.includes(':id')) {
    return `${resource} ${method === 'DELETE' ? 'deleted' : 'retrieved'} successfully`;
  }
  
  return `${category} ${method === 'GET' ? 'retrieved' : method === 'POST' ? 'created' : 'processed'} successfully`;
}

function getTagDescription(category) {
  const descriptions = {
    'auth': 'User authentication and authorization endpoints',
    'users': 'User profile management endpoints',
    'patients': 'Patient profile and medical record management',
    'doctors': 'Doctor profile and specialization management',
    'hospitals': 'Hospital registration and management',
    'appointments': 'Appointment scheduling and management',
    'bookings': 'Booking system and status management',
    'payments': 'Payment processing and transaction management',
    'invoices': 'Invoice generation and management',
    'reviews': 'Review and rating system',
    'notifications': 'User notifications and alerts',
    'support': 'Customer support ticket system',
    'faqs': 'Frequently asked questions management',
    'websiteContent': 'Website content management system',
    'translations': 'Multi-language support',
    'subscriptions': 'Subscription plan management',
    'media': 'File upload and media management',
    'coupons': 'Discount coupon management',
    'insurance': 'Insurance claim and policy management',
    'labTests': 'Laboratory test orders and results',
    'laboratories': 'Laboratory management',
    'medicalRecords': 'Patient medical record management',
    'prescriptions': 'Prescription management',
    'dnaKits': 'DNA testing kit orders and results',
    'packages': 'Healthcare package management',
    'treatments': 'Medical treatment information',
    'treatmentCategories': 'Treatment category management',
    'doctorSchedules': 'Doctor availability and scheduling',
    'integrations': 'Third-party service integrations',
    'auditLogs': 'System audit trail and logs',
    'staff': 'Staff management system',
    'systemSettings': 'Application configuration',
    'termsPrivacy': 'Legal documents management',
    'videoCalls': 'Video consultation system',
    'chat': 'Real-time messaging system',
    'uploads': 'File upload handling',
    'bookingStatus': 'Booking status tracking',
    'analytics': 'Analytics and reporting',
    'health': 'System health check endpoint'
  };
  
  return descriptions[category] || `${category} management endpoints`;
}

function getCategoryFilters(category) {
  const filters = {
    'patients': [
      { name: 'bloodGroup', type: 'string', description: 'Filter by blood group' },
      { name: 'gender', type: 'string', enum: ['male', 'female', 'other'], description: 'Filter by gender' },
      { name: 'city', type: 'string', description: 'Filter by city' }
    ],
    'doctors': [
      { name: 'specialization', type: 'string', description: 'Filter by specialization' },
      { name: 'experience', type: 'integer', description: 'Filter by years of experience' },
      { name: 'verified', type: 'boolean', description: 'Filter by verification status' }
    ],
    'hospitals': [
      { name: 'city', type: 'string', description: 'Filter by city' },
      { name: 'country', type: 'string', description: 'Filter by country' },
      { name: 'verified', type: 'boolean', description: 'Filter by verification status' }
    ],
    'appointments': [
      { name: 'status', type: 'string', enum: ['scheduled', 'completed', 'cancelled'], description: 'Filter by status' },
      { name: 'doctorId', type: 'integer', description: 'Filter by doctor' },
      { name: 'patientId', type: 'integer', description: 'Filter by patient' },
      { name: 'dateFrom', type: 'string', format: 'date', description: 'Filter by start date' },
      { name: 'dateTo', type: 'string', format: 'date', description: 'Filter by end date' }
    ],
    'payments': [
      { name: 'status', type: 'string', enum: ['pending', 'completed', 'failed'], description: 'Filter by status' },
      { name: 'method', type: 'string', description: 'Filter by payment method' },
      { name: 'dateFrom', type: 'string', format: 'date', description: 'Filter by start date' }
    ],
    'reviews': [
      { name: 'rating', type: 'integer', description: 'Filter by rating' },
      { name: 'doctorId', type: 'integer', description: 'Filter by doctor' },
      { name: 'hospitalId', type: 'integer', description: 'Filter by hospital' }
    ],
    'notifications': [
      { name: 'type', type: 'string', enum: ['info', 'warning', 'success', 'error'], description: 'Filter by type' },
      { name: 'read', type: 'boolean', description: 'Filter by read status' }
    ]
  };
  
  return filters[category] || [];
}

function getRequestProperties(category, method, path) {
  const resource = category.replace(/s$', '');
  
  const properties = {
    'auth': {
      'POST /register': {
        required: ['email', 'password', 'firstName', 'lastName', 'role'],
        properties: [
          { name: 'email', type: 'string', format: 'email', description: 'User email address', example: "'user@example.com'" },
          { name: 'password', type: 'string', format: 'password', description: 'Password (min 8 chars)', example: "'Password123!'" },
          { name: 'firstName', type: 'string', description: 'First name', example: "'John'" },
          { name: 'lastName', type: 'string', description: 'Last name', example: "'Doe'" },
          { name: 'phone', type: 'string', description: 'Phone number', example: "'+1234567890'" },
          { name: 'role', type: 'string', enum: ['patient', 'doctor', 'hospital_admin'], description: 'User role' }
        ]
      },
      'POST /login': {
        required: ['email', 'password'],
        properties: [
          { name: 'email', type: 'string', format: 'email', description: 'User email', example: "'user@example.com'" },
          { name: 'password', type: 'string', format: 'password', description: 'User password' }
        ]
      },
      'POST /forgot-password': {
        required: ['email'],
        properties: [
          { name: 'email', type: 'string', format: 'email', description: 'Email for password reset' }
        ]
      }
    },
    'patients': {
      'POST /': {
        required: ['userId', 'firstName', 'lastName'],
        properties: [
          { name: 'userId', type: 'integer', description: 'User ID reference' },
          { name: 'firstName', type: 'string', description: 'First name' },
          { name: 'lastName', type: 'string', description: 'Last name' },
          { name: 'dateOfBirth', type: 'string', format: 'date', description: 'Date of birth' },
          { name: 'gender', type: 'string', enum: ['male', 'female', 'other'], description: 'Gender' },
          { name: 'bloodGroup', type: 'string', description: 'Blood group' },
          { name: 'phone', type: 'string', description: 'Phone number' },
          { name: 'address', type: 'string', description: 'Full address' }
        ]
      }
    },
    'doctors': {
      'POST /': {
        required: ['userId', 'firstName', 'lastName', 'specialization'],
        properties: [
          { name: 'userId', type: 'integer', description: 'User ID reference' },
          { name: 'firstName', type: 'string', description: 'First name' },
          { name: 'lastName', type: 'string', description: 'Last name' },
          { name: 'specialization', type: 'string', description: 'Medical specialization' },
          { name: 'licenseNumber', type: 'string', description: 'Medical license number' },
          { name: 'experience', type: 'integer', description: 'Years of experience' },
          { name: 'education', type: 'string', description: 'Education background' }
        ]
      }
    },
    'hospitals': {
      'POST /': {
        required: ['name', 'address', 'city', 'country'],
        properties: [
          { name: 'name', type: 'string', description: 'Hospital name' },
          { name: 'address', type: 'string', description: 'Street address' },
          { name: 'city', type: 'string', description: 'City' },
          { name: 'country', type: 'string', description: 'Country' },
          { name: 'phone', type: 'string', description: 'Contact phone' },
          { name: 'email', type: 'string', format: 'email', description: 'Contact email' },
          { name: 'website', type: 'string', description: 'Website URL' }
        ]
      }
    },
    'appointments': {
      'POST /': {
        required: ['patientId', 'doctorId', 'appointmentDate'],
        properties: [
          { name: 'patientId', type: 'integer', description: 'Patient ID' },
          { name: 'doctorId', type: 'integer', description: 'Doctor ID' },
          { name: 'appointmentDate', type: 'string', format: 'date-time', description: 'Appointment date and time' },
          { name: 'reason', type: 'string', description: 'Reason for appointment' },
          { name: 'notes', type: 'string', description: 'Additional notes' }
        ]
      }
    },
    'payments': {
      'POST /': {
        required: ['bookingId', 'amount', 'method'],
        properties: [
          { name: 'bookingId', type: 'integer', description: 'Booking ID' },
          { name: 'amount', type: 'number', description: 'Payment amount' },
          { name: 'method', type: 'string', enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'], description: 'Payment method' },
          { name: 'description', type: 'string', description: 'Payment description' }
        ]
      }
    },
    'reviews': {
      'POST /': {
        required: ['doctorId', 'rating', 'comment'],
        properties: [
          { name: 'doctorId', type: 'integer', description: 'Doctor ID' },
          { name: 'rating', type: 'integer', minimum: 1, maximum: 5, description: 'Rating (1-5)' },
          { name: 'comment', type: 'string', description: 'Review comment' },
          { name: 'anonymous', type: 'boolean', description: 'Post anonymously' }
        ]
      }
    },
    'notifications': {
      'POST /': {
        required: ['userId', 'title', 'message'],
        properties: [
          { name: 'userId', type: 'integer', description: 'User ID' },
          { name: 'title', type: 'string', description: 'Notification title' },
          { name: 'message', type: 'string', description: 'Notification message' },
          { name: 'type', type: 'string', enum: ['info', 'warning', 'success', 'error'], description: 'Notification type' }
        ]
      }
    }
  };
  
  // Default properties for common operations
  const defaultProperties = {
    'POST /': {
      required: ['name'],
      properties: [
        { name: 'name', type: 'string', description: 'Name of the resource' },
        { name: 'description', type: 'string', description: 'Description' },
        { name: 'isActive', type: 'boolean', description: 'Active status' }
      ]
    },
    'PUT /:id': {
      required: [],
      properties: [
        { name: 'name', type: 'string', description: 'Name' },
        { name: 'description', type: 'string', description: 'Description' }
      ]
    }
  };
  
  const pathKey = `${method.toUpperCase()} ${path.replace(/\/api\/v1\//, '').replace(/\/\d+/, '/:id')}`;
  
  if (properties[category] && properties[category][pathKey]) {
    return properties[category][pathKey];
  }
  
  if (defaultProperties[pathKey]) {
    return defaultProperties[pathKey];
  }
  
  return { required: [], properties: [] };
}

function getSchemaName(category) {
  const schemaNames = {
    'users': 'User',
    'patients': 'Patient',
    'doctors': 'Doctor',
    'hospitals': 'Hospital',
    'appointments': 'Appointment',
    'bookings': 'Booking',
    'payments': 'Payment',
    'invoices': 'Invoice',
    'reviews': 'Review',
    'notifications': 'Notification',
    'faqs': 'FAQ',
    'treatments': 'Treatment',
    'packages': 'Package',
    'subscriptions': 'Subscription',
    'media': 'Media',
    'coupons': 'Coupon',
    'insurance': 'Insurance',
    'labTests': 'LabTest',
    'laboratories': 'Laboratory',
    'medicalRecords': 'MedicalRecord',
    'prescriptions': 'Prescription',
    'dnaKits': 'DNAKit',
    'videoCalls': 'VideoCall',
    'chat': 'Chat',
    'support': 'SupportTicket',
    'staff': 'Staff',
    'systemSettings': 'SystemSettings'
  };
  
  return schemaNames[category] || capitalizeFirst(category);
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log('\n🎉 Swagger documentation generation complete!');
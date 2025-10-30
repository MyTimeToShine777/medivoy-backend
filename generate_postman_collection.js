const fs = require('fs');

/**
 * Generate Postman Collection for Medivoy Backend API
 */

const collection = {
  "info": {
    "name": "Medivoy Backend API",
    "description": "Complete API collection for Medivoy Healthcare Platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api/v1",
      "type": "string"
    },
    {
      "key": "access_token",
      "value": "",
      "type": "string"
    }
  ],
  "item": []
};

// Read the generated endpoint documentation
const endpointsDoc = fs.readFileSync('API_ENDPOINTS_COMPLETE.md', 'utf8');

// Parse endpoints from markdown
const categories = {};
const lines = endpointsDoc.split('\n');
let currentCategory = null;

lines.forEach(line => {
  // Detect category headers
  if (line.startsWith('## ') && !line.includes('Table of Contents')) {
    currentCategory = line.replace('## ', '').trim();
    categories[currentCategory] = [];
  }
  
  // Parse endpoint rows
  if (line.startsWith('| ') && line.includes('`/api/v1/')) {
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    if (parts.length >= 3 && parts[0] !== 'Method') {
      const method = parts[0];
      const path = parts[1].replace(/`/g, '');
      const description = parts[2];
      
      if (currentCategory && categories[currentCategory]) {
        categories[currentCategory].push({
          method,
          path,
          description
        });
      }
    }
  }
});

// Generate Postman folders and requests
Object.keys(categories).forEach(categoryName => {
  const endpoints = categories[categoryName];
  
  const folder = {
    "name": categoryName,
    "item": []
  };
  
  endpoints.forEach(endpoint => {
    const request = {
      "name": endpoint.description,
      "request": {
        "method": endpoint.method,
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "url": {
          "raw": `{{base_url}}${endpoint.path.replace('/api/v1', '')}`,
          "host": ["{{base_url}}"],
          "path": endpoint.path.replace('/api/v1/', '').split('/')
        }
      },
      "response": []
    };
    
    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      request.request.body = {
        "mode": "raw",
        "raw": JSON.stringify(getSampleBody(endpoint.path, endpoint.method), null, 2),
        "options": {
          "raw": {
            "language": "json"
          }
        }
      };
    }
    
    folder.item.push(request);
  });
  
  collection.item.push(folder);
});

// Save collection
fs.writeFileSync('Medivoy_API_Postman_Collection.json', JSON.stringify(collection, null, 2));

console.log('✅ Postman collection generated: Medivoy_API_Postman_Collection.json');
console.log(`📊 Total folders: ${collection.item.length}`);
console.log(`📊 Total requests: ${collection.item.reduce((sum, folder) => sum + folder.item.length, 0)}`);

// Helper function to generate sample request bodies
function getSampleBody(path, method) {
  if (path.includes('/auth/register')) {
    return {
      "email": "user@example.com",
      "password": "SecurePass123!",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    };
  }
  
  if (path.includes('/auth/login')) {
    return {
      "email": "user@example.com",
      "password": "SecurePass123!"
    };
  }
  
  if (path.includes('/doctors')) {
    return {
      "firstName": "Dr. Jane",
      "lastName": "Smith",
      "specialization": "Cardiology",
      "email": "doctor@example.com",
      "phone": "+1234567890"
    };
  }
  
  if (path.includes('/patients')) {
    return {
      "firstName": "John",
      "lastName": "Doe",
      "email": "patient@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-01"
    };
  }
  
  if (path.includes('/appointments')) {
    return {
      "patientId": 1,
      "doctorId": 1,
      "appointmentDate": "2024-12-01T10:00:00Z",
      "reason": "Regular checkup"
    };
  }
  
  // Generic body
  return {
    "data": "Sample data - please customize based on your needs"
  };
}
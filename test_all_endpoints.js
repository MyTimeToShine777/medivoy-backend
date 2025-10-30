const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Endpoint Discovery and Documentation Script
 * This script analyzes all route files and extracts endpoint information
 */

const routesDir = path.join(__dirname, 'src', 'routes', 'v1');

// Read all route files
const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.routes.js'));

const allEndpoints = [];

console.log('🔍 Discovering all API endpoints...\n');

routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const routeName = file.replace('.routes.js', '');
  console.log(`📁 Analyzing ${file}...`);
  
  // Extract route definitions
  const routePatterns = [
    /router\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g,
  ];
  
  routePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      const fullPath = `/api/v1/${routeName}${path === '/' ? '' : path}`;
      
      allEndpoints.push({
        method,
        path: fullPath,
        file: file,
        category: routeName
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

// Generate markdown documentation
let markdown = `# Medivoy Backend API - Complete Endpoint List\n\n`;
markdown += `**Total Endpoints:** ${allEndpoints.length}\n\n`;
markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
markdown += `---\n\n`;

// Table of Contents
markdown += `## 📋 Table of Contents\n\n`;
Object.keys(groupedEndpoints).sort().forEach((category, index) => {
  markdown += `${index + 1}. [${category.charAt(0).toUpperCase() + category.slice(1)}](#${category})\n`;
});
markdown += `\n---\n\n`;

// Detailed endpoints by category
Object.keys(groupedEndpoints).sort().forEach(category => {
  const endpoints = groupedEndpoints[category];
  markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
  markdown += `**Total Endpoints:** ${endpoints.length}\n\n`;
  markdown += `| Method | Endpoint | Description |\n`;
  markdown += `|--------|----------|-------------|\n`;
  
  endpoints.forEach(endpoint => {
    const description = getEndpointDescription(endpoint.method, endpoint.path);
    markdown += `| ${endpoint.method} | \`${endpoint.path}\` | ${description} |\n`;
  });
  
  markdown += `\n`;
});

// Save to file
fs.writeFileSync('API_ENDPOINTS_COMPLETE.md', markdown);

console.log(`\n✅ Documentation generated: API_ENDPOINTS_COMPLETE.md`);
console.log(`📊 Total endpoints discovered: ${allEndpoints.length}`);
console.log(`📁 Categories: ${Object.keys(groupedEndpoints).length}`);

// Generate summary
console.log(`\n📈 Endpoints by Category:`);
Object.keys(groupedEndpoints).sort().forEach(category => {
  console.log(`   ${category}: ${groupedEndpoints[category].length} endpoints`);
});

// Helper function to generate descriptions
function getEndpointDescription(method, path) {
  const pathParts = path.split('/').filter(p => p);
  const resource = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  if (path.includes(':id')) {
    switch(method) {
      case 'GET': return `Get specific ${resource} by ID`;
      case 'PUT': return `Update ${resource} by ID`;
      case 'PATCH': return `Partially update ${resource} by ID`;
      case 'DELETE': return `Delete ${resource} by ID`;
    }
  }
  
  switch(method) {
    case 'GET': return `Get all ${resource} or list`;
    case 'POST': return `Create new ${resource}`;
    case 'PUT': return `Update ${resource}`;
    case 'PATCH': return `Partially update ${resource}`;
    case 'DELETE': return `Delete ${resource}`;
    default: return `${method} operation on ${resource}`;
  }
}
const fs = require('fs');
const path = require('path');

// Get all route files
const routesDir = './src/routes/v1';
const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.routes.js'));

console.log('Found route files:', routeFiles);

routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Fix common syntax errors
  let fixed = content
    // Fix mixed up route definitions
    .replace(/router\.(get|post|put|patch|delete)\([^)]*\);\s*['"]([^'"]+)['"][,\s]*\n\s*auth,\s*\n\s*authorize\([^)]*\),\s*\n\s*([^)]+)\,\s*\n\s*\);/gs, 
      (match, method, path, controller) => {
        return `router.${method}(
  '${path}',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  ${controller},
);`;
      })
    // Fix authenticate vs auth
    .replace(/authenticate/g, 'auth')
    // Remove incomplete router.get lines
    .replace(/router\.get\(\s*\n\s*router\.[^)]*\);\s*['"][^'"]*['"][,\s]*\n/g, '')
    // Remove double closing parentheses
    .replace(/\);\s*\);/g, ');');
  
  if (content !== fixed) {
    console.log(`Fixed ${file}`);
    fs.writeFileSync(filePath, fixed);
  }
});

console.log('Route fixing complete!');
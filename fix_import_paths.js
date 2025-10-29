const fs = require('fs');
const path = require('path');

// Get all controller files
const controllersDir = './src/controllers';
const controllerFiles = fs.readdirSync(controllersDir).filter(file => file.endsWith('.js'));

// Process each controller file
controllerFiles.forEach(file => {
  const filePath = path.join(controllersDir, file);
  console.log(`Fixing import path in ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the import path
  content = content.replace(
    "require('../../database_error_handler')",
    "require('../utils/database_error_handler')"
  );
  
  // Write back to file
  fs.writeFileSync(filePath, content);
  console.log(`✓ Fixed import path in ${file}`);
});

console.log('All import paths fixed!');
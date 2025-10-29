const fs = require('fs');
const path = require('path');

// Database error handler import
const errorHandlerImport = `const { handleDatabaseError, getMockData, withDatabaseFallback } = require('../../database_error_handler');`;

// Get all controller files
const controllersDir = './src/controllers';
const controllerFiles = fs.readdirSync(controllersDir).filter(file => file.endsWith('.js'));

// Process each controller file
controllerFiles.forEach(file => {
  const filePath = path.join(controllersDir, file);
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if it already has the error handler import
  if (content.includes('database_error_handler')) {
    console.log(`✓ ${file} already has error handler`);
    return;
  }
  
  // Find the import section (after the last require statement)
  const requireLines = content.match(/^const .+ = require\(.+\);$/gm);
  if (!requireLines) {
    console.log(`⚠ No require statements found in ${file}`);
    return;
  }
  
  const lastRequireLine = requireLines[requireLines.length - 1];
  const lastRequireIndex = content.indexOf(lastRequireLine) + lastRequireLine.length;
  
  // Insert the error handler import
  content = content.slice(0, lastRequireIndex) + 
           '\n' + errorHandlerImport + 
           content.slice(lastRequireIndex);
  
  // Write back to file
  fs.writeFileSync(filePath, content);
  console.log(`✓ Added error handler to ${file}`);
});

console.log('All controllers processed!');
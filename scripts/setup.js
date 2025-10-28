#!/usr/bin/env node

/**
 * Medivoy Backend Setup Script
 * 
 * This script helps set up the Medivoy Healthcare Backend API
 * by checking dependencies, creating necessary directories,
 * and initializing the database.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║                                                          ║');
console.log('║        🏥 Medivoy Backend Setup Script 🏥              ║');
console.log('║                                                          ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Check if .env file exists
function checkEnvFile() {
  info('Checking environment configuration...');
  
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      warning('.env file not found. Creating from .env.example...');
      fs.copyFileSync(envExamplePath, envPath);
      success('.env file created');
      warning('⚠️  Please update .env file with your configuration!');
      return false;
    } else {
      error('.env.example file not found!');
      return false;
    }
  } else {
    success('.env file exists');
    return true;
  }
}

// Check if node_modules exists
function checkDependencies() {
  info('Checking dependencies...');
  
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    warning('Dependencies not installed. Installing...');
    try {
      execSync('pnpm install', { stdio: 'inherit' });
      success('Dependencies installed successfully');
      return true;
    } catch (err) {
      error('Failed to install dependencies');
      error('Please run: pnpm install');
      return false;
    }
  } else {
    success('Dependencies are installed');
    return true;
  }
}

// Create necessary directories
function createDirectories() {
  info('Creating necessary directories...');
  
  const directories = [
    'logs',
    'uploads',
    'temp',
    'backups',
    'backups/database',
    'backups/files'
  ];
  
  directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      success(`Created directory: ${dir}`);
    }
  });
  
  success('All directories created');
}

// Check Docker
function checkDocker() {
  info('Checking Docker...');
  
  try {
    execSync('docker --version', { stdio: 'pipe' });
    success('Docker is installed');
    return true;
  } catch (err) {
    warning('Docker is not installed or not in PATH');
    info('Docker is optional but recommended for running databases');
    return false;
  }
}

// Check if databases are running
function checkDatabases() {
  info('Checking database connections...');
  
  try {
    // Check if docker-compose is running
    const output = execSync('docker-compose ps', { stdio: 'pipe' }).toString();
    
    if (output.includes('postgres') && output.includes('Up')) {
      success('PostgreSQL is running');
    } else {
      warning('PostgreSQL is not running');
      info('Start with: pnpm run docker:up');
    }
    
    if (output.includes('mongodb') && output.includes('Up')) {
      success('MongoDB is running');
    } else {
      warning('MongoDB is not running');
      info('Start with: pnpm run docker:up');
    }
    
    if (output.includes('redis') && output.includes('Up')) {
      success('Redis is running');
    } else {
      warning('Redis is not running');
      info('Start with: pnpm run docker:up');
    }
  } catch (err) {
    warning('Could not check database status');
    info('Make sure to start databases before running the application');
  }
}

// Display next steps
function displayNextSteps() {
  console.log('');
  log('╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    NEXT STEPS                            ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');
  console.log('');
  
  log('1. Update your .env file with proper configuration', 'yellow');
  log('   - Database credentials', 'yellow');
  log('   - JWT secrets', 'yellow');
  log('   - API keys (Stripe, Razorpay, SendGrid, etc.)', 'yellow');
  console.log('');
  
  log('2. Start the databases:', 'yellow');
  log('   pnpm run docker:up', 'cyan');
  console.log('');
  
  log('3. Run database migrations (optional):', 'yellow');
  log('   npx sequelize-cli db:migrate', 'cyan');
  console.log('');
  
  log('4. Seed the database (optional):', 'yellow');
  log('   npx sequelize-cli db:seed:all', 'cyan');
  console.log('');
  
  log('5. Start the development server:', 'yellow');
  log('   pnpm run dev', 'cyan');
  console.log('');
  
  log('6. Access the API:', 'yellow');
  log('   API: http://localhost:5000', 'cyan');
  log('   Swagger Docs: http://localhost:5000/api-docs', 'cyan');
  console.log('');
  
  log('For more information, see:', 'yellow');
  log('   - README.md', 'cyan');
  log('   - START_HERE_FINAL.md', 'cyan');
  log('   - QUICK_START.md', 'cyan');
  console.log('');
}

// Main setup function
async function setup() {
  try {
    console.log('Starting setup...\n');
    
    // Run checks
    const envExists = checkEnvFile();
    console.log('');
    
    const depsInstalled = checkDependencies();
    console.log('');
    
    createDirectories();
    console.log('');
    
    const dockerInstalled = checkDocker();
    console.log('');
    
    if (dockerInstalled) {
      checkDatabases();
      console.log('');
    }
    
    // Display summary
    console.log('');
    log('╔══════════════════════════════════════════════════════════╗', 'green');
    log('║                  SETUP COMPLETE                          ║', 'green');
    log('╚══════════════════════════════════════════════════════════╝', 'green');
    console.log('');
    
    if (!envExists) {
      warning('⚠️  Please configure your .env file before starting the server!');
      console.log('');
    }
    
    displayNextSteps();
    
  } catch (err) {
    error('Setup failed!');
    console.error(err);
    process.exit(1);
  }
}

// Run setup
setup();
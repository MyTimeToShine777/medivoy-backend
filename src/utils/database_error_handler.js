// Database error handling utility
const logger = require('./logger');

const handleDatabaseError = (error, res, customMessage = 'Database operation failed') => {
  logger.error('Database error:', error);
  
  // Check for specific database connection errors
  if (error.code === 'ECONNREFUSED' || 
      error.message.includes('connect ECONNREFUSED') ||
      error.message.includes('Connection refused')) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      error: 'SERVICE_UNAVAILABLE'
    });
  }
  
  // Check for timeout errors
  if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
    return res.status(504).json({
      success: false,
      message: 'Database request timed out. Please try again.',
      error: 'TIMEOUT_ERROR'
    });
  }
  
  // Check for validation errors
  if (error.name === 'SequelizeValidationError' || error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.message,
      details: error.errors
    });
  }
  
  // Check for unique constraint violations
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Record already exists',
      error: error.message
    });
  }
  
  // Check for foreign key constraint violations
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
      error: error.message
    });
  }
  
  // Generic database error
  return res.status(500).json({
    success: false,
    message: customMessage,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
};

// Mock data for development when database is not available
const getMockUser = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000000),
  email: 'mock@example.com',
  firstName: 'Mock',
  lastName: 'User',
  role: 'patient',
  phone: '+1234567890',
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

const getMockData = (type, overrides = {}) => {
  const mockData = {
    user: getMockUser(overrides),
    patient: {
      id: Math.floor(Math.random() * 1000000),
      userId: Math.floor(Math.random() * 1000000),
      dateOfBirth: '1990-01-01',
      gender: 'male',
      bloodType: 'O+',
      emergencyContact: '+1234567890',
      ...overrides
    },
    doctor: {
      id: Math.floor(Math.random() * 1000000),
      userId: Math.floor(Math.random() * 1000000),
      specialty: 'General Medicine',
      licenseNumber: 'DOC123456',
      yearsOfExperience: 5,
      ...overrides
    },
    appointment: {
      id: Math.floor(Math.random() * 1000000),
      doctorId: Math.floor(Math.random() * 1000000),
      patientId: Math.floor(Math.random() * 1000000),
      date: '2024-12-01',
      time: '10:00',
      status: 'scheduled',
      ...overrides
    },
    treatment: {
      id: Math.floor(Math.random() * 1000000),
      name: 'General Consultation',
      description: 'General medical consultation',
      category: 'General',
      price: 100,
      ...overrides
    }
  };
  
  return mockData[type] || null;
};

// Wrapper for database operations with fallback to mock data
const withDatabaseFallback = async (databaseOperation, mockDataType, mockOverrides = {}) => {
  try {
    return await databaseOperation();
  } catch (error) {
    // If it's a connection error, return mock data
    if (error.code === 'ECONNREFUSED' || 
        error.message.includes('connect ECONNREFUSED') ||
        error.message.includes('Connection refused')) {
      logger.warn(`Database unavailable, returning mock ${mockDataType} data`);
      return getMockData(mockDataType, mockOverrides);
    }
    // Otherwise, rethrow the error
    throw error;
  }
};

module.exports = {
  handleDatabaseError,
  getMockData,
  withDatabaseFallback
};
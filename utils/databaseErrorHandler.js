/**
 * Database Error Handler Utility
 * Provides consistent error handling and mock data fallbacks for database operations
 */

const logger = require('./logger');

/**
 * Handles database errors with appropriate responses
 */
const handleDatabaseError = (error, res, customMessage = 'Database operation failed') => {
  logger.error('Database error:', error);

  // Check for specific database connection errors
  if (error.code === 'ECONNREFUSED'
      || error.message.includes('connect ECONNREFUSED')
      || error.message.includes('Connection refused')) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      error: 'SERVICE_UNAVAILABLE',
    });
  }

  // Check for timeout errors
  if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
    return res.status(504).json({
      success: false,
      message: 'Database request timed out. Please try again.',
      error: 'TIMEOUT_ERROR',
    });
  }

  // Check for validation errors
  if (error.name === 'SequelizeValidationError' || error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.message,
      details: error.errors,
    });
  }

  // Check for unique constraint violations
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Record already exists',
      error: error.message,
    });
  }

  // Check for foreign key constraint violations
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
      error: error.message,
    });
  }

  // Generic database error
  return res.status(500).json({
    success: false,
    message: customMessage,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
  });
};

/**
 * Mock data generator for development and testing
 */
const getMockData = (type, overrides = {}) => {
  const baseId = Math.floor(Math.random() * 1000000);
  const baseDate = new Date();

  const mockData = {
    user: {
      id: baseId,
      email: `user${baseId}@example.com`,
      firstName: 'John',
      lastName: 'Doe',
      role: 'patient',
      phone: '+1234567890',
      isVerified: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    patient: {
      id: baseId,
      userId: baseId,
      dateOfBirth: '1990-01-01',
      gender: 'male',
      bloodType: 'O+',
      emergencyContact: '+1234567890',
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    doctor: {
      id: baseId,
      userId: baseId,
      specialty: 'General Medicine',
      licenseNumber: `DOC${baseId}`,
      yearsOfExperience: 5,
      isVerified: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    hospital: {
      id: baseId,
      userId: baseId,
      name: 'General Hospital',
      address: '123 Medical St, Health City',
      phone: '+1234567890',
      licenseNumber: `HOS${baseId}`,
      isVerified: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    appointment: {
      id: baseId,
      doctorId: baseId,
      patientId: baseId,
      date: '2024-12-01',
      time: '10:00',
      status: 'scheduled',
      notes: 'Regular checkup',
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    treatment: {
      id: baseId,
      name: 'General Consultation',
      description: 'General medical consultation and examination',
      category: 'General',
      price: 100.00,
      duration: 30,
      isActive: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    medicalRecord: {
      id: baseId,
      patientId: baseId,
      doctorId: baseId,
      recordType: 'Consultation',
      recordDate: '2024-11-01',
      notes: 'Patient consultation notes',
      isPrivate: false,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    prescription: {
      id: baseId,
      patientId: baseId,
      doctorId: baseId,
      medications: 'Paracetamol 500mg',
      dosage: 'Twice daily',
      instructions: 'Take with food',
      isActive: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    notification: {
      id: baseId,
      userId: baseId,
      title: 'Appointment Reminder',
      message: 'You have an appointment tomorrow at 10:00 AM',
      type: 'appointment',
      isRead: false,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    booking: {
      id: baseId,
      patientId: baseId,
      service: 'General Consultation',
      date: '2024-12-01',
      time: '10:00',
      status: 'confirmed',
      totalPrice: 100.00,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    payment: {
      id: baseId,
      patientId: baseId,
      amount: 100.00,
      currency: 'USD',
      method: 'credit_card',
      status: 'completed',
      transactionId: `TXN${baseId}`,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    review: {
      id: baseId,
      patientId: baseId,
      doctorId: baseId,
      rating: 5,
      comment: 'Excellent service and care',
      isApproved: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    insurance: {
      id: baseId,
      provider: 'Health Insurance Co.',
      policyNumber: `POL${baseId}`,
      coverage: 'Full medical coverage',
      isActive: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    laboratory: {
      id: baseId,
      name: 'Diagnostic Laboratory',
      address: '456 Lab Street, Test City',
      phone: '+1234567890',
      isVerified: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    labTest: {
      id: baseId,
      name: 'Complete Blood Count',
      description: 'Complete blood count test',
      price: 50.00,
      category: 'Hematology',
      isActive: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    package: {
      id: baseId,
      name: 'Health Checkup Package',
      description: 'Complete health checkup for adults',
      price: 200.00,
      duration: 60,
      tests: ['Blood Test', 'Urine Test', 'X-Ray'],
      isActive: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    subscription: {
      id: baseId,
      userId: baseId,
      plan: 'premium',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      price: 50.00,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    coupon: {
      id: baseId,
      code: `SAVE${baseId}`,
      discount: 10,
      type: 'percentage',
      isActive: true,
      maxUses: 100,
      usedCount: 0,
      expiresAt: '2024-12-31',
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    faq: {
      id: baseId,
      question: 'What services do you offer?',
      answer: 'We offer comprehensive healthcare services including consultations, treatments, and more.',
      category: 'General',
      isActive: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    doctorSchedule: {
      id: baseId,
      doctorId: baseId,
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    staff: {
      id: baseId,
      name: 'Jane Smith',
      role: 'Nurse',
      department: 'Emergency',
      phone: '+1234567890',
      email: `staff${baseId}@hospital.com`,
      isActive: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    media: {
      id: baseId,
      filename: `image_${baseId}.jpg`,
      originalName: 'medical_image.jpg',
      mimeType: 'image/jpeg',
      size: 1024000,
      url: `https://example.com/images/${baseId}.jpg`,
      entityType: 'medical_record',
      entityId: baseId,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
    termsPrivacy: {
      id: baseId,
      type: 'terms',
      title: 'Terms and Conditions',
      content: 'Terms and conditions content...',
      version: '1.0',
      isActive: true,
      isPublished: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      ...overrides,
    },
  };

  return mockData[type] || null;
};

/**
 * Wrapper for database operations with fallback to mock data
 */
const withDatabaseFallback = async (databaseOperation, mockDataType, mockOverrides = {}, fallbackData = null) => {
  try {
    return await databaseOperation();
  } catch (error) {
    // If it's a connection error, return mock data
    if (error.code === 'ECONNREFUSED'
        || error.message.includes('connect ECONNREFUSED')
        || error.message.includes('Connection refused')) {
      logger.warn(`Database unavailable, returning mock ${mockDataType} data`);
      return getMockData(mockDataType, mockOverrides);
    }
    // Otherwise, rethrow the error for proper handling
    throw error;
  }
};

/**
 * Creates paginated mock data response
 */
const createPaginatedMockResponse = (dataType, page = 1, limit = 10, overrides = {}) => {
  const items = [];
  const totalRecords = limit * 3; // Mock 3 pages of data

  for (let i = 0; i < Math.min(limit, totalRecords - (page - 1) * limit); i++) {
    items.push(getMockData(dataType, { ...overrides, id: (page - 1) * limit + i + 1 }));
  }

  return {
    rows: items,
    count: totalRecords,
  };
};

module.exports = {
  handleDatabaseError,
  getMockData,
  withDatabaseFallback,
  createPaginatedMockResponse,
};

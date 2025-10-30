/**
 * Comprehensive Swagger Schema Definitions for Medivoy API
 * Updated: 2024-10-30
 * Coverage: All 287 endpoints across 40 categories
 */

const schemas = {
  // ============================================================================
  // AUTHENTICATION & USER SCHEMAS
  // ============================================================================
  User: {
    type: "object",
    properties: {
      id: { type: "integer", description: "User ID" },
      email: { type: "string", format: "email", description: "User email" },
      firstName: { type: "string", description: "First name" },
      lastName: { type: "string", description: "Last name" },
      phone: { type: "string", description: "Phone number" },
      role: {
        type: "string",
        enum: ["admin", "doctor", "patient", "hospital_admin"],
        description: "User role",
      },
      isActive: { type: "boolean", description: "Account status" },
      isEmailVerified: {
        type: "boolean",
        description: "Email verification status",
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "user@example.com" },
      password: { type: "string", format: "password", example: "Password123!" },
    },
  },

  RegisterRequest: {
    type: "object",
    required: ["email", "password", "firstName", "lastName", "role"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", format: "password" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      phone: { type: "string" },
      role: { type: "string", enum: ["patient", "doctor", "hospital_admin"] },
    },
  },

  AuthResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", description: "JWT access token" },
          refreshToken: { type: "string", description: "JWT refresh token" },
        },
      },
    },
  },

  // ============================================================================
  // PATIENT SCHEMAS
  // ============================================================================
  Patient: {
    type: "object",
    properties: {
      id: { type: "integer" },
      userId: { type: "integer" },
      dateOfBirth: { type: "string", format: "date" },
      gender: { type: "string", enum: ["male", "female", "other"] },
      bloodGroup: { type: "string" },
      address: { type: "string" },
      city: { type: "string" },
      country: { type: "string" },
      emergencyContact: { type: "object" },
      medicalHistory: { type: "object" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // DOCTOR SCHEMAS
  // ============================================================================
  Doctor: {
    type: "object",
    properties: {
      id: { type: "integer" },
      userId: { type: "integer" },
      specialization: { type: "string" },
      licenseNumber: { type: "string" },
      experience: { type: "integer", description: "Years of experience" },
      qualifications: { type: "array", items: { type: "string" } },
      consultationFee: { type: "number", format: "decimal" },
      bio: { type: "string" },
      languages: { type: "array", items: { type: "string" } },
      rating: { type: "number", format: "decimal" },
      isVerified: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // HOSPITAL SCHEMAS
  // ============================================================================
  Hospital: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      address: { type: "string" },
      city: { type: "string" },
      country: { type: "string" },
      phone: { type: "string" },
      email: { type: "string", format: "email" },
      website: { type: "string" },
      description: { type: "string" },
      facilities: { type: "array", items: { type: "string" } },
      accreditations: { type: "array", items: { type: "string" } },
      rating: { type: "number", format: "decimal" },
      isVerified: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // TREATMENT SCHEMAS
  // ============================================================================
  Treatment: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      categoryId: { type: "integer" },
      subcategoryId: { type: "integer" },
      description: { type: "string" },
      duration: { type: "string" },
      successRate: { type: "number", format: "decimal" },
      isActive: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  TreatmentCategory: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      slug: { type: "string" },
      description: { type: "string" },
      icon: { type: "string" },
      sortOrder: { type: "integer" },
      isActive: { type: "boolean" },
    },
  },

  // ============================================================================
  // BOOKING SCHEMAS
  // ============================================================================
  Booking: {
    type: "object",
    properties: {
      id: { type: "integer" },
      patientId: { type: "integer" },
      hospitalId: { type: "integer" },
      treatmentId: { type: "integer" },
      packageId: { type: "integer" },
      bookingDate: { type: "string", format: "date" },
      status: {
        type: "string",
        enum: ["pending", "confirmed", "cancelled", "completed"],
      },
      totalAmount: { type: "number", format: "decimal" },
      currency: { type: "string", default: "USD" },
      notes: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // APPOINTMENT SCHEMAS
  // ============================================================================
  Appointment: {
    type: "object",
    properties: {
      id: { type: "integer" },
      patientId: { type: "integer" },
      doctorId: { type: "integer" },
      bookingId: { type: "integer" },
      appointmentDate: { type: "string", format: "date-time" },
      duration: { type: "integer", description: "Duration in minutes" },
      status: {
        type: "string",
        enum: ["scheduled", "confirmed", "cancelled", "completed", "no_show"],
      },
      type: {
        type: "string",
        enum: ["consultation", "follow_up", "procedure"],
      },
      notes: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // PAYMENT SCHEMAS
  // ============================================================================
  Payment: {
    type: "object",
    properties: {
      id: { type: "integer" },
      bookingId: { type: "integer" },
      amount: { type: "number", format: "decimal" },
      currency: { type: "string", default: "USD" },
      paymentMethod: {
        type: "string",
        enum: [
          "credit_card",
          "debit_card",
          "paypal",
          "stripe",
          "razorpay",
          "bank_transfer",
        ],
      },
      status: {
        type: "string",
        enum: ["pending", "completed", "failed", "refunded"],
      },
      transactionId: { type: "string" },
      paymentDate: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // REVIEW SCHEMAS
  // ============================================================================
  Review: {
    type: "object",
    properties: {
      id: { type: "integer" },
      patientId: { type: "integer" },
      entityType: { type: "string", enum: ["doctor", "hospital", "treatment"] },
      entityId: { type: "integer" },
      rating: { type: "integer", minimum: 1, maximum: 5 },
      comment: { type: "string" },
      isVerified: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // FAQ SCHEMAS
  // ============================================================================
  FAQ: {
    type: "object",
    properties: {
      id: { type: "integer" },
      question: { type: "string" },
      answer: { type: "string" },
      category: { type: "string" },
      displayOrder: { type: "integer" },
      isPublished: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ============================================================================
  // COMMON RESPONSE SCHEMAS
  // ============================================================================
  SuccessResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string" },
      data: { type: "object" },
    },
  },

  PaginatedResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string" },
      data: { type: "array", items: { type: "object" } },
      pagination: {
        type: "object",
        properties: {
          currentPage: { type: "integer" },
          totalPages: { type: "integer" },
          totalRecords: { type: "integer" },
          limit: { type: "integer" },
        },
      },
    },
  },

  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string" },
      error: { type: "string" },
      code: { type: "string" },
    },
  },
};

module.exports = schemas;

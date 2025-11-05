/**
 * COMPREHENSIVE SWAGGER SCHEMAS
 *
 * This file contains detailed schema definitions with:
 * - Complete property descriptions
 * - Realistic examples
 * - Validation rules
 * - Enum values
 * - Nested object structures
 */

const comprehensiveSchemas = {
  // ============================================================================
  // AUTHENTICATION & USER SCHEMAS
  // ============================================================================

  User: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Unique user identifier',
        example: 1,
      },
      email: {
        type: 'string',
        format: 'email',
        description: "User's email address (unique)",
        example: 'john.doe@example.com',
      },
      firstName: {
        type: 'string',
        description: "User's first name",
        minLength: 2,
        maxLength: 50,
        example: 'John',
      },
      lastName: {
        type: 'string',
        description: "User's last name",
        minLength: 2,
        maxLength: 50,
        example: 'Doe',
      },
      phone: {
        type: 'string',
        description: 'Phone number with country code',
        pattern: '^\\+[1-9]\\d{1,14}$',
        example: '+1234567890',
      },
      role: {
        type: 'string',
        enum: ['admin', 'doctor', 'patient', 'hospital_admin'],
        description: 'User role in the system',
        example: 'patient',
      },
      profilePicture: {
        type: 'string',
        format: 'uri',
        nullable: true,
        description: "URL to user's profile picture",
        example: 'https://example.com/profiles/john-doe.jpg',
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the account is active',
        example: true,
      },
      isEmailVerified: {
        type: 'boolean',
        description: 'Whether the email has been verified',
        example: true,
      },
      lastLoginAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Timestamp of last login',
        example: '2024-10-31T10:30:00Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Account creation timestamp',
        example: '2024-01-15T08:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2024-10-31T10:30:00Z',
      },
    },
    required: ['email', 'firstName', 'lastName', 'role'],
  },

  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Registered email address',
        example: 'john.doe@example.com',
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'User password',
        minLength: 8,
        example: 'SecurePass123!',
      },
      rememberMe: {
        type: 'boolean',
        description: 'Keep user logged in for extended period',
        default: false,
        example: true,
      },
    },
  },

  RegisterRequest: {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName', 'role'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email address (must be unique)',
        example: 'john.doe@example.com',
      },
      password: {
        type: 'string',
        format: 'password',
        description:
          'Password (min 8 chars, must include uppercase, lowercase, number)',
        minLength: 8,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
        example: 'SecurePass123!',
      },
      firstName: {
        type: 'string',
        description: 'First name',
        minLength: 2,
        maxLength: 50,
        example: 'John',
      },
      lastName: {
        type: 'string',
        description: 'Last name',
        minLength: 2,
        maxLength: 50,
        example: 'Doe',
      },
      phone: {
        type: 'string',
        description: 'Phone number with country code',
        pattern: '^\\+[1-9]\\d{1,14}$',
        example: '+1234567890',
      },
      role: {
        type: 'string',
        enum: ['patient', 'doctor', 'hospital_admin'],
        description: 'User role (admin role cannot be registered)',
        example: 'patient',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        description: 'Date of birth (YYYY-MM-DD)',
        example: '1990-01-15',
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'other'],
        description: 'Gender',
        example: 'male',
      },
    },
  },

  AuthResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        description: 'Operation success status',
        example: true,
      },
      message: {
        type: 'string',
        description: 'Response message',
        example: 'Login successful',
      },
      data: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/User',
            description: 'User information',
          },
          token: {
            type: 'string',
            description: 'JWT access token (expires in 7 days)',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          },
          refreshToken: {
            type: 'string',
            description: 'JWT refresh token (expires in 30 days)',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          },
        },
      },
    },
  },

  // ============================================================================
  // PATIENT SCHEMAS
  // ============================================================================

  Patient: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Unique patient identifier',
        example: 1,
      },
      userId: {
        type: 'integer',
        description: 'Associated user account ID',
        example: 5,
      },
      firstName: {
        type: 'string',
        description: "Patient's first name",
        example: 'John',
      },
      lastName: {
        type: 'string',
        description: "Patient's last name",
        example: 'Doe',
      },
      email: {
        type: 'string',
        format: 'email',
        description: "Patient's email address",
        example: 'john.doe@example.com',
      },
      phone: {
        type: 'string',
        description: "Patient's phone number",
        example: '+1234567890',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        description: 'Date of birth (YYYY-MM-DD)',
        example: '1990-01-15',
      },
      age: {
        type: 'integer',
        description: 'Calculated age in years',
        example: 34,
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'other'],
        description: "Patient's gender",
        example: 'male',
      },
      bloodGroup: {
        type: 'string',
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        description: 'Blood group',
        example: 'O+',
      },
      height: {
        type: 'number',
        description: 'Height in centimeters',
        example: 175.5,
      },
      weight: {
        type: 'number',
        description: 'Weight in kilograms',
        example: 75.0,
      },
      address: {
        type: 'string',
        description: 'Full residential address',
        example: '123 Main Street, Apartment 4B',
      },
      city: {
        type: 'string',
        description: 'City of residence',
        example: 'New York',
      },
      state: {
        type: 'string',
        description: 'State/Province',
        example: 'NY',
      },
      country: {
        type: 'string',
        description: 'Country of residence',
        example: 'United States',
      },
      postalCode: {
        type: 'string',
        description: 'Postal/ZIP code',
        example: '10001',
      },
      emergencyContact: {
        type: 'object',
        description: 'Emergency contact information',
        properties: {
          name: {
            type: 'string',
            description: 'Emergency contact name',
            example: 'Jane Doe',
          },
          relationship: {
            type: 'string',
            description: 'Relationship to patient',
            example: 'Spouse',
          },
          phone: {
            type: 'string',
            description: 'Emergency contact phone',
            example: '+1234567891',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Emergency contact email',
            example: 'jane.doe@example.com',
          },
        },
      },
      medicalHistory: {
        type: 'array',
        description: "Patient's medical history",
        items: {
          type: 'object',
          properties: {
            condition: {
              type: 'string',
              description: 'Medical condition name',
              example: 'Hypertension',
            },
            diagnosedDate: {
              type: 'string',
              format: 'date',
              description: 'Date of diagnosis',
              example: '2020-05-15',
            },
            status: {
              type: 'string',
              enum: ['active', 'resolved', 'chronic'],
              description: 'Current status',
              example: 'active',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Controlled with medication',
            },
          },
        },
      },
      allergies: {
        type: 'array',
        description: 'Known allergies',
        items: {
          type: 'object',
          properties: {
            allergen: {
              type: 'string',
              description: 'Allergen name',
              example: 'Penicillin',
            },
            severity: {
              type: 'string',
              enum: ['mild', 'moderate', 'severe'],
              description: 'Allergy severity',
              example: 'severe',
            },
            reaction: {
              type: 'string',
              description: 'Allergic reaction description',
              example: 'Anaphylaxis',
            },
          },
        },
      },
      currentMedications: {
        type: 'array',
        description: 'Current medications',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Medication name',
              example: 'Lisinopril',
            },
            dosage: {
              type: 'string',
              description: 'Dosage information',
              example: '10mg once daily',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Start date',
              example: '2023-01-01',
            },
            prescribedBy: {
              type: 'string',
              description: 'Prescribing doctor',
              example: 'Dr. Sarah Smith',
            },
          },
        },
      },
      insuranceInfo: {
        type: 'object',
        nullable: true,
        description: 'Insurance information',
        properties: {
          provider: {
            type: 'string',
            description: 'Insurance provider name',
            example: 'Blue Cross Blue Shield',
          },
          policyNumber: {
            type: 'string',
            description: 'Policy number',
            example: 'BC123456789',
          },
          groupNumber: {
            type: 'string',
            description: 'Group number',
            example: 'GRP001',
          },
          expiryDate: {
            type: 'string',
            format: 'date',
            description: 'Policy expiry date',
            example: '2025-12-31',
          },
        },
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'suspended'],
        description: 'Patient account status',
        example: 'active',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Record creation timestamp',
        example: '2024-01-15T08:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2024-10-31T10:30:00Z',
      },
    },
  },

  // ============================================================================
  // APPOINTMENT SCHEMAS
  // ============================================================================

  Appointment: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Unique appointment identifier',
        example: 1,
      },
      patientId: {
        type: 'integer',
        description: 'Patient ID',
        example: 10,
      },
      patient: {
        $ref: '#/components/schemas/Patient',
        description: 'Patient details',
      },
      doctorId: {
        type: 'integer',
        description: 'Doctor ID',
        example: 5,
      },
      doctor: {
        $ref: '#/components/schemas/Doctor',
        description: 'Doctor details',
      },
      hospitalId: {
        type: 'integer',
        nullable: true,
        description: 'Hospital ID (if appointment is at a hospital)',
        example: 2,
      },
      hospital: {
        $ref: '#/components/schemas/Hospital',
        nullable: true,
        description: 'Hospital details',
      },
      scheduledAt: {
        type: 'string',
        format: 'date-time',
        description: 'Scheduled appointment date and time',
        example: '2024-11-15T10:00:00Z',
      },
      duration: {
        type: 'integer',
        description: 'Appointment duration in minutes',
        minimum: 15,
        maximum: 240,
        example: 30,
      },
      status: {
        type: 'string',
        enum: [
          'scheduled',
          'confirmed',
          'in_progress',
          'completed',
          'cancelled',
          'no_show',
        ],
        description: 'Current appointment status',
        example: 'scheduled',
      },
      appointmentType: {
        type: 'string',
        enum: [
          'consultation',
          'follow_up',
          'emergency',
          'routine_checkup',
          'procedure',
        ],
        description: 'Type of appointment',
        example: 'consultation',
      },
      reason: {
        type: 'string',
        description: 'Reason for appointment',
        example: 'Annual physical examination',
      },
      notes: {
        type: 'string',
        nullable: true,
        description: 'Additional notes or special instructions',
        example: 'Patient requests morning appointment',
      },
      symptoms: {
        type: 'array',
        description: 'Reported symptoms',
        items: {
          type: 'string',
          example: 'Headache',
        },
      },
      diagnosis: {
        type: 'string',
        nullable: true,
        description: 'Diagnosis after appointment (filled by doctor)',
        example: 'Migraine',
      },
      prescription: {
        type: 'string',
        nullable: true,
        description: 'Prescribed medications',
        example: 'Ibuprofen 400mg, twice daily',
      },
      followUpRequired: {
        type: 'boolean',
        description: 'Whether follow-up is required',
        example: true,
      },
      followUpDate: {
        type: 'string',
        format: 'date',
        nullable: true,
        description: 'Suggested follow-up date',
        example: '2024-12-15',
      },
      paymentStatus: {
        type: 'string',
        enum: ['pending', 'paid', 'partially_paid', 'refunded'],
        description: 'Payment status',
        example: 'paid',
      },
      amount: {
        type: 'number',
        description: 'Appointment fee',
        example: 150.0,
      },
      statusHistory: {
        type: 'array',
        description: 'History of status changes',
        items: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'confirmed',
            },
            changedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-11-10T14:30:00Z',
            },
            changedBy: {
              type: 'string',
              example: 'Dr. Sarah Smith',
            },
            reason: {
              type: 'string',
              example: 'Patient confirmed attendance',
            },
          },
        },
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Appointment creation timestamp',
        example: '2024-11-01T08:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2024-11-10T14:30:00Z',
      },
    },
  },

  CreateAppointmentRequest: {
    type: 'object',
    required: ['patientId', 'doctorId', 'scheduledAt'],
    properties: {
      patientId: {
        type: 'integer',
        description: 'Patient ID',
        example: 10,
      },
      doctorId: {
        type: 'integer',
        description: 'Doctor ID',
        example: 5,
      },
      hospitalId: {
        type: 'integer',
        nullable: true,
        description: 'Hospital ID (optional)',
        example: 2,
      },
      scheduledAt: {
        type: 'string',
        format: 'date-time',
        description: 'Desired appointment date and time',
        example: '2024-11-15T10:00:00Z',
      },
      duration: {
        type: 'integer',
        description: 'Requested duration in minutes',
        minimum: 15,
        maximum: 240,
        default: 30,
        example: 30,
      },
      appointmentType: {
        type: 'string',
        enum: [
          'consultation',
          'follow_up',
          'emergency',
          'routine_checkup',
          'procedure',
        ],
        description: 'Type of appointment',
        example: 'consultation',
      },
      reason: {
        type: 'string',
        description: 'Reason for appointment',
        maxLength: 500,
        example: 'Annual physical examination',
      },
      symptoms: {
        type: 'array',
        description: 'Current symptoms',
        items: {
          type: 'string',
        },
        example: ['Headache', 'Fatigue'],
      },
      notes: {
        type: 'string',
        nullable: true,
        description: 'Additional notes',
        maxLength: 1000,
        example: 'Patient prefers morning appointments',
      },
    },
  },

  // ============================================================================
  // DOCTOR SCHEMAS
  // ============================================================================

  Doctor: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Unique doctor identifier',
        example: 1,
      },
      userId: {
        type: 'integer',
        description: 'Associated user account ID',
        example: 3,
      },
      firstName: {
        type: 'string',
        description: "Doctor's first name",
        example: 'Sarah',
      },
      lastName: {
        type: 'string',
        description: "Doctor's last name",
        example: 'Smith',
      },
      email: {
        type: 'string',
        format: 'email',
        description: "Doctor's email",
        example: 'dr.sarah.smith@example.com',
      },
      phone: {
        type: 'string',
        description: "Doctor's phone number",
        example: '+1234567890',
      },
      specialization: {
        type: 'string',
        description: 'Medical specialization',
        example: 'Cardiology',
      },
      subSpecialization: {
        type: 'string',
        nullable: true,
        description: 'Sub-specialization if any',
        example: 'Interventional Cardiology',
      },
      qualification: {
        type: 'string',
        description: 'Medical qualifications',
        example: 'MD, FACC',
      },
      experience: {
        type: 'integer',
        description: 'Years of experience',
        example: 15,
      },
      licenseNumber: {
        type: 'string',
        description: 'Medical license number',
        example: 'MD123456',
      },
      bio: {
        type: 'string',
        description: 'Professional biography',
        example:
          'Dr. Sarah Smith is a board-certified cardiologist with over 15 years of experience...',
      },
      languages: {
        type: 'array',
        description: 'Languages spoken',
        items: {
          type: 'string',
        },
        example: ['English', 'Spanish', 'French'],
      },
      consultationFee: {
        type: 'number',
        description: 'Consultation fee in USD',
        example: 150.0,
      },
      rating: {
        type: 'number',
        description: 'Average rating (0-5)',
        minimum: 0,
        maximum: 5,
        example: 4.8,
      },
      totalReviews: {
        type: 'integer',
        description: 'Total number of reviews',
        example: 127,
      },
      availability: {
        type: 'object',
        description: 'Weekly availability schedule',
        properties: {
          monday: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                start: { type: 'string', example: '09:00' },
                end: { type: 'string', example: '17:00' },
              },
            },
          },
          tuesday: { type: 'array', items: { type: 'object' } },
          wednesday: { type: 'array', items: { type: 'object' } },
          thursday: { type: 'array', items: { type: 'object' } },
          friday: { type: 'array', items: { type: 'object' } },
          saturday: { type: 'array', items: { type: 'object' } },
          sunday: { type: 'array', items: { type: 'object' } },
        },
      },
      hospitals: {
        type: 'array',
        description: 'Associated hospitals',
        items: {
          $ref: '#/components/schemas/Hospital',
        },
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'on_leave'],
        description: "Doctor's current status",
        example: 'active',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-31T10:30:00Z',
      },
    },
  },

  // ============================================================================
  // HOSPITAL SCHEMAS
  // ============================================================================

  Hospital: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Unique hospital identifier',
        example: 1,
      },
      name: {
        type: 'string',
        description: 'Hospital name',
        example: 'City General Hospital',
      },
      description: {
        type: 'string',
        description: 'Hospital description',
        example:
          'Leading multi-specialty hospital providing comprehensive healthcare services',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Hospital contact email',
        example: 'info@citygeneralhospital.com',
      },
      phone: {
        type: 'string',
        description: 'Hospital contact phone',
        example: '+1234567890',
      },
      address: {
        type: 'string',
        description: 'Full address',
        example: '123 Healthcare Avenue',
      },
      city: {
        type: 'string',
        description: 'City',
        example: 'New York',
      },
      state: {
        type: 'string',
        description: 'State/Province',
        example: 'NY',
      },
      country: {
        type: 'string',
        description: 'Country',
        example: 'United States',
      },
      postalCode: {
        type: 'string',
        description: 'Postal code',
        example: '10001',
      },
      website: {
        type: 'string',
        format: 'uri',
        nullable: true,
        description: 'Hospital website',
        example: 'https://www.citygeneralhospital.com',
      },
      departments: {
        type: 'array',
        description: 'Available departments',
        items: {
          type: 'string',
        },
        example: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
      },
      facilities: {
        type: 'array',
        description: 'Available facilities',
        items: {
          type: 'string',
        },
        example: [
          'Emergency Room',
          'ICU',
          'Operating Theaters',
          'Laboratory',
          'Pharmacy',
        ],
      },
      accreditations: {
        type: 'array',
        description: 'Hospital accreditations',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Joint Commission' },
            year: { type: 'integer', example: 2023 },
          },
        },
      },
      rating: {
        type: 'number',
        description: 'Average rating (0-5)',
        minimum: 0,
        maximum: 5,
        example: 4.5,
      },
      totalBeds: {
        type: 'integer',
        description: 'Total number of beds',
        example: 500,
      },
      emergencyServices: {
        type: 'boolean',
        description: 'Whether emergency services are available',
        example: true,
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'under_maintenance'],
        description: 'Hospital status',
        example: 'active',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-10-31T10:30:00Z',
      },
    },
  },

  // ============================================================================
  // COMMON RESPONSE SCHEMAS
  // ============================================================================

  SuccessResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        description: 'Operation success status',
        example: true,
      },
      message: {
        type: 'string',
        description: 'Success message',
        example: 'Operation completed successfully',
      },
      data: {
        type: 'object',
        description: 'Response data',
        additionalProperties: true,
      },
    },
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        description: 'Operation success status',
        example: false,
      },
      message: {
        type: 'string',
        description: 'Error message',
        example: 'An error occurred',
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Error code',
            example: 'VALIDATION_ERROR',
          },
          details: {
            type: 'string',
            description: 'Detailed error information',
            example: 'Email is required',
          },
        },
      },
    },
  },

  PaginationInfo: {
    type: 'object',
    properties: {
      currentPage: {
        type: 'integer',
        description: 'Current page number',
        example: 1,
      },
      totalPages: {
        type: 'integer',
        description: 'Total number of pages',
        example: 10,
      },
      totalItems: {
        type: 'integer',
        description: 'Total number of items',
        example: 95,
      },
      itemsPerPage: {
        type: 'integer',
        description: 'Number of items per page',
        example: 10,
      },
      hasNextPage: {
        type: 'boolean',
        description: 'Whether there is a next page',
        example: true,
      },
      hasPrevPage: {
        type: 'boolean',
        description: 'Whether there is a previous page',
        example: false,
      },
    },
  },
};

module.exports = comprehensiveSchemas;

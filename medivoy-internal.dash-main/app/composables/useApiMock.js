// composables/useApiMock.js
export const useApiMock = () => {
  const apiEndpoints = ref([
    {
      id: 1,
      name: "Patient Management API",
      path: "/api/v1/patients",
      method: "GET",
      version: "v1.2.3",
      category: "Patient Management",
      description:
        "Retrieve patient records with advanced filtering and pagination support",
      status: "active",
      environment: "production",
      baseUrl: "https://api.healthcenter.ae",
      fullUrl: "https://api.healthcenter.ae/api/v1/patients",
      authentication: "Bearer Token",
      rateLimit: {
        requests: 1000,
        window: "1 hour",
        burst: 100,
      },
      permissions: ["patient:read", "medical_records:access"],
      tags: ["CRUD", "EHR", "Patient", "Medical Records"],
      documentation: "https://docs.api.healthcenter.ae/patients",
      swagger: "https://api.healthcenter.ae/swagger/patients",
      testEndpoint: "https://test-api.healthcenter.ae/api/v1/patients",
      maintainer: "Dr. Sarah Al-Mansouri",
      maintainerEmail: "sarah.mansouri@healthcenter.ae",
      lastModified: "2025-10-12T14:30:00Z",
      createdAt: "2024-01-15T09:00:00Z",
      deprecatedAt: null,
      replacedBy: null,
      isPublic: false,
      requiresApproval: true,
      healthCheck: {
        url: "https://api.healthcenter.ae/health/patients",
        status: "healthy",
        responseTime: 145,
        uptime: 99.8,
        lastCheck: "2025-10-13T14:00:00Z",
      },
      metrics: {
        totalRequests: 45230,
        successRate: 99.2,
        averageResponseTime: 287,
        errorRate: 0.8,
        requestsToday: 1247,
        uniqueConsumers: 23,
      },
      errorCodes: {
        400: { count: 45, description: "Invalid request parameters" },
        401: { count: 23, description: "Unauthorized access" },
        404: { count: 67, description: "Patient not found" },
        500: { count: 12, description: "Internal server error" },
      },
      parameters: [
        {
          name: "patient_id",
          type: "string",
          required: false,
          description: "Unique patient identifier",
          example: "PAT-DXB-001",
        },
        {
          name: "limit",
          type: "integer",
          required: false,
          description: "Number of records to return",
          example: 50,
          default: 20,
        },
        {
          name: "offset",
          type: "integer",
          required: false,
          description: "Number of records to skip",
          example: 0,
          default: 0,
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          data: { type: "array", items: { type: "object" } },
          meta: { type: "object" },
          links: { type: "object" },
        },
      },
      consumers: [
        {
          name: "Mobile App",
          requests: 15000,
          lastAccess: "2025-10-13T13:45:00Z",
        },
        {
          name: "Web Dashboard",
          requests: 12000,
          lastAccess: "2025-10-13T14:15:00Z",
        },
        {
          name: "Third Party Integration",
          requests: 8000,
          lastAccess: "2025-10-13T12:30:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 300, actual: 287, status: "met" },
        availability: { target: 99.5, actual: 99.8, status: "met" },
        errorRate: { target: 1.0, actual: 0.8, status: "met" },
      },
      securityFeatures: [
        "Rate Limiting",
        "JWT Authentication",
        "Input Validation",
        "SQL Injection Protection",
        "CORS Policy",
        "HTTPS Only",
      ],
      compliance: ["HIPAA", "GDPR", "ISO 27001", "SOC 2"],
      deploymentInfo: {
        lastDeployment: "2025-10-10T16:00:00Z",
        deployedBy: "DevOps Team",
        environment: "production",
        version: "v1.2.3",
        rollbackAvailable: true,
      },
    },
    {
      id: 2,
      name: "Appointment Scheduling API",
      path: "/api/v1/appointments",
      method: "POST",
      version: "v2.1.0",
      category: "Scheduling",
      description:
        "Create and manage patient appointments with doctor availability checking",
      status: "active",
      environment: "production",
      baseUrl: "https://api.healthcenter.sa",
      fullUrl: "https://api.healthcenter.sa/api/v1/appointments",
      authentication: "API Key + OAuth2",
      rateLimit: {
        requests: 500,
        window: "1 hour",
        burst: 50,
      },
      permissions: ["appointments:create", "schedule:manage"],
      tags: ["Scheduling", "Appointments", "Calendar", "Availability"],
      documentation: "https://docs.api.healthcenter.sa/appointments",
      swagger: "https://api.healthcenter.sa/swagger/appointments",
      testEndpoint: "https://test-api.healthcenter.sa/api/v1/appointments",
      maintainer: "Ahmed Hassan",
      maintainerEmail: "ahmed.hassan@healthcenter.sa",
      lastModified: "2025-10-11T10:15:00Z",
      createdAt: "2024-03-20T11:30:00Z",
      deprecatedAt: null,
      replacedBy: null,
      isPublic: true,
      requiresApproval: false,
      healthCheck: {
        url: "https://api.healthcenter.sa/health/appointments",
        status: "healthy",
        responseTime: 234,
        uptime: 99.9,
        lastCheck: "2025-10-13T14:05:00Z",
      },
      metrics: {
        totalRequests: 23456,
        successRate: 98.7,
        averageResponseTime: 456,
        errorRate: 1.3,
        requestsToday: 876,
        uniqueConsumers: 12,
      },
      errorCodes: {
        400: { count: 123, description: "Invalid appointment data" },
        409: { count: 89, description: "Time slot conflict" },
        422: { count: 56, description: "Doctor not available" },
      },
      parameters: [
        {
          name: "patient_id",
          type: "string",
          required: true,
          description: "Patient identifier",
          example: "PAT-RYD-002",
        },
        {
          name: "doctor_id",
          type: "string",
          required: true,
          description: "Doctor identifier",
          example: "DOC-RYD-001",
        },
        {
          name: "appointment_time",
          type: "datetime",
          required: true,
          description: "Requested appointment time",
          example: "2025-10-15T10:00:00Z",
        },
        {
          name: "duration",
          type: "integer",
          required: false,
          description: "Appointment duration in minutes",
          example: 30,
          default: 15,
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          appointment_id: { type: "string" },
          status: { type: "string" },
          confirmation_code: { type: "string" },
        },
      },
      consumers: [
        {
          name: "Patient Portal",
          requests: 8000,
          lastAccess: "2025-10-13T13:30:00Z",
        },
        {
          name: "Call Center System",
          requests: 6000,
          lastAccess: "2025-10-13T14:00:00Z",
        },
        {
          name: "Mobile App",
          requests: 9456,
          lastAccess: "2025-10-13T13:55:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 500, actual: 456, status: "met" },
        availability: { target: 99.0, actual: 99.9, status: "met" },
        errorRate: { target: 2.0, actual: 1.3, status: "met" },
      },
      securityFeatures: [
        "OAuth2 + API Key",
        "Request Signing",
        "IP Whitelisting",
        "Rate Limiting",
        "Data Encryption",
      ],
      compliance: ["HIPAA", "PCI DSS"],
      deploymentInfo: {
        lastDeployment: "2025-10-11T10:15:00Z",
        deployedBy: "API Team",
        environment: "production",
        version: "v2.1.0",
        rollbackAvailable: true,
      },
    },
    {
      id: 3,
      name: "Medical Records API",
      path: "/api/v1/medical-records",
      method: "GET",
      version: "v1.5.2",
      category: "Medical Records",
      description:
        "Access comprehensive medical records including diagnoses, treatments, and lab results",
      status: "active",
      environment: "production",
      baseUrl: "https://api.healthcenter.qa",
      fullUrl: "https://api.healthcenter.qa/api/v1/medical-records",
      authentication: "Mutual TLS + Bearer Token",
      rateLimit: {
        requests: 200,
        window: "1 hour",
        burst: 20,
      },
      permissions: ["medical_records:read", "patient_data:access", "phi:view"],
      tags: ["EHR", "Medical Records", "PHI", "HIPAA"],
      documentation: "https://docs.api.healthcenter.qa/medical-records",
      swagger: "https://api.healthcenter.qa/swagger/medical-records",
      testEndpoint: "https://test-api.healthcenter.qa/api/v1/medical-records",
      maintainer: "Dr. Omar Al-Sabah",
      maintainerEmail: "omar.alsabah@healthcenter.qa",
      lastModified: "2025-10-09T16:45:00Z",
      createdAt: "2024-02-10T14:20:00Z",
      deprecatedAt: null,
      replacedBy: null,
      isPublic: false,
      requiresApproval: true,
      healthCheck: {
        url: "https://api.healthcenter.qa/health/medical-records",
        status: "healthy",
        responseTime: 189,
        uptime: 99.95,
        lastCheck: "2025-10-13T14:10:00Z",
      },
      metrics: {
        totalRequests: 12345,
        successRate: 99.5,
        averageResponseTime: 245,
        errorRate: 0.5,
        requestsToday: 345,
        uniqueConsumers: 8,
      },
      errorCodes: {
        401: { count: 34, description: "Insufficient permissions" },
        403: { count: 12, description: "Access denied to PHI" },
        404: { count: 23, description: "Medical record not found" },
      },
      parameters: [
        {
          name: "patient_id",
          type: "string",
          required: true,
          description: "Patient unique identifier",
          example: "PAT-DOH-001",
        },
        {
          name: "record_type",
          type: "string",
          required: false,
          description: "Type of medical record",
          example: "diagnosis",
          enum: ["diagnosis", "treatment", "lab_result", "imaging"],
        },
        {
          name: "date_from",
          type: "date",
          required: false,
          description: "Start date for record search",
          example: "2025-01-01",
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          patient_id: { type: "string" },
          records: { type: "array" },
          metadata: { type: "object" },
        },
      },
      consumers: [
        {
          name: "Doctor Portal",
          requests: 5000,
          lastAccess: "2025-10-13T13:20:00Z",
        },
        {
          name: "Hospital System",
          requests: 4000,
          lastAccess: "2025-10-13T14:05:00Z",
        },
        {
          name: "Insurance Integration",
          requests: 3345,
          lastAccess: "2025-10-13T12:45:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 250, actual: 245, status: "met" },
        availability: { target: 99.9, actual: 99.95, status: "met" },
        errorRate: { target: 1.0, actual: 0.5, status: "met" },
      },
      securityFeatures: [
        "Mutual TLS",
        "End-to-End Encryption",
        "Field-Level Encryption",
        "Audit Logging",
        "Access Controls",
        "PHI Protection",
      ],
      compliance: ["HIPAA", "GDPR", "ISO 27001", "HITECH"],
      deploymentInfo: {
        lastDeployment: "2025-10-09T16:45:00Z",
        deployedBy: "Security Team",
        environment: "production",
        version: "v1.5.2",
        rollbackAvailable: true,
      },
    },
    {
      id: 4,
      name: "Prescription Management API",
      path: "/api/v2/prescriptions",
      method: "POST",
      version: "v2.0.1",
      category: "Pharmacy",
      description:
        "Create, validate, and manage electronic prescriptions with drug interaction checking",
      status: "active",
      environment: "production",
      baseUrl: "https://api.healthcenter.kw",
      fullUrl: "https://api.healthcenter.kw/api/v2/prescriptions",
      authentication: "API Key + Digital Signature",
      rateLimit: {
        requests: 300,
        window: "1 hour",
        burst: 30,
      },
      permissions: [
        "prescriptions:create",
        "pharmacy:manage",
        "drug_interactions:check",
      ],
      tags: ["Pharmacy", "Prescriptions", "Drug Safety", "E-Prescribing"],
      documentation: "https://docs.api.healthcenter.kw/prescriptions",
      swagger: "https://api.healthcenter.kw/swagger/prescriptions",
      testEndpoint: "https://test-api.healthcenter.kw/api/v2/prescriptions",
      maintainer: "Pharmacist Aisha Mahmoud",
      maintainerEmail: "aisha.mahmoud@healthcenter.kw",
      lastModified: "2025-10-08T12:20:00Z",
      createdAt: "2024-05-15T10:00:00Z",
      deprecatedAt: null,
      replacedBy: null,
      isPublic: false,
      requiresApproval: true,
      healthCheck: {
        url: "https://api.healthcenter.kw/health/prescriptions",
        status: "warning",
        responseTime: 567,
        uptime: 98.5,
        lastCheck: "2025-10-13T14:15:00Z",
      },
      metrics: {
        totalRequests: 8765,
        successRate: 97.8,
        averageResponseTime: 678,
        errorRate: 2.2,
        requestsToday: 234,
        uniqueConsumers: 15,
      },
      errorCodes: {
        400: { count: 89, description: "Invalid prescription data" },
        422: { count: 67, description: "Drug interaction detected" },
        403: { count: 34, description: "Controlled substance restriction" },
      },
      parameters: [
        {
          name: "patient_id",
          type: "string",
          required: true,
          description: "Patient identifier",
          example: "PAT-KWT-001",
        },
        {
          name: "prescriber_id",
          type: "string",
          required: true,
          description: "Prescribing doctor identifier",
          example: "DOC-KWT-001",
        },
        {
          name: "medications",
          type: "array",
          required: true,
          description: "List of prescribed medications",
          example:
            '[{"name": "Amoxicillin", "dosage": "500mg", "frequency": "3x daily"}]',
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          prescription_id: { type: "string" },
          status: { type: "string" },
          interactions: { type: "array" },
          pharmacy_code: { type: "string" },
        },
      },
      consumers: [
        {
          name: "Hospital EMR",
          requests: 4000,
          lastAccess: "2025-10-13T13:45:00Z",
        },
        {
          name: "Clinic System",
          requests: 2765,
          lastAccess: "2025-10-13T14:10:00Z",
        },
        {
          name: "Pharmacy Chain",
          requests: 2000,
          lastAccess: "2025-10-13T12:15:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 600, actual: 678, status: "warning" },
        availability: { target: 99.0, actual: 98.5, status: "warning" },
        errorRate: { target: 2.0, actual: 2.2, status: "warning" },
      },
      securityFeatures: [
        "Digital Signatures",
        "Controlled Substance Tracking",
        "Prescription Validation",
        "Anti-Tampering",
        "Audit Trail",
      ],
      compliance: ["DEA", "FDA", "HIPAA"],
      deploymentInfo: {
        lastDeployment: "2025-10-08T12:20:00Z",
        deployedBy: "Pharmacy Team",
        environment: "production",
        version: "v2.0.1",
        rollbackAvailable: false,
      },
    },
    {
      id: 5,
      name: "Laboratory Results API",
      path: "/api/v1/lab-results",
      method: "GET",
      version: "v1.3.0",
      category: "Laboratory",
      description:
        "Retrieve and manage laboratory test results with critical value alerts",
      status: "active",
      environment: "production",
      baseUrl: "https://api.healthcenter.bh",
      fullUrl: "https://api.healthcenter.bh/api/v1/lab-results",
      authentication: "Bearer Token + IP Whitelist",
      rateLimit: {
        requests: 800,
        window: "1 hour",
        burst: 80,
      },
      permissions: ["lab_results:read", "critical_values:alert"],
      tags: ["Laboratory", "Test Results", "Critical Values", "Diagnostics"],
      documentation: "https://docs.api.healthcenter.bh/lab-results",
      swagger: "https://api.healthcenter.bh/swagger/lab-results",
      testEndpoint: "https://test-api.healthcenter.bh/api/v1/lab-results",
      maintainer: "Lab Tech Yusuf Al-Busaidi",
      maintainerEmail: "yusuf.busaidi@healthcenter.bh",
      lastModified: "2025-10-07T09:30:00Z",
      createdAt: "2024-04-10T13:15:00Z",
      deprecatedAt: null,
      replacedBy: null,
      isPublic: false,
      requiresApproval: true,
      healthCheck: {
        url: "https://api.healthcenter.bh/health/lab-results",
        status: "healthy",
        responseTime: 198,
        uptime: 99.7,
        lastCheck: "2025-10-13T14:20:00Z",
      },
      metrics: {
        totalRequests: 15678,
        successRate: 99.1,
        averageResponseTime: 234,
        errorRate: 0.9,
        requestsToday: 567,
        uniqueConsumers: 18,
      },
      errorCodes: {
        404: { count: 78, description: "Lab results not found" },
        401: { count: 45, description: "Authentication required" },
        403: { count: 23, description: "Access to results denied" },
      },
      parameters: [
        {
          name: "patient_id",
          type: "string",
          required: true,
          description: "Patient identifier",
          example: "PAT-MAN-001",
        },
        {
          name: "test_type",
          type: "string",
          required: false,
          description: "Type of lab test",
          example: "complete_blood_count",
        },
        {
          name: "date_range",
          type: "string",
          required: false,
          description: "Date range for results",
          example: "2025-10-01,2025-10-13",
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          results: { type: "array" },
          critical_values: { type: "array" },
          metadata: { type: "object" },
        },
      },
      consumers: [
        {
          name: "Doctor Dashboard",
          requests: 6000,
          lastAccess: "2025-10-13T14:15:00Z",
        },
        {
          name: "Lab System",
          requests: 5678,
          lastAccess: "2025-10-13T13:50:00Z",
        },
        {
          name: "Mobile Alerts",
          requests: 4000,
          lastAccess: "2025-10-13T14:00:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 300, actual: 234, status: "met" },
        availability: { target: 99.5, actual: 99.7, status: "met" },
        errorRate: { target: 1.0, actual: 0.9, status: "met" },
      },
      securityFeatures: [
        "IP Whitelisting",
        "Token-based Auth",
        "Result Encryption",
        "Access Logging",
        "Critical Value Alerts",
      ],
      compliance: ["CLIA", "HIPAA", "ISO 15189"],
      deploymentInfo: {
        lastDeployment: "2025-10-07T09:30:00Z",
        deployedBy: "Lab Team",
        environment: "production",
        version: "v1.3.0",
        rollbackAvailable: true,
      },
    },
    {
      id: 6,
      name: "Billing and Insurance API",
      path: "/api/v1/billing",
      method: "POST",
      version: "v1.4.1",
      category: "Financial",
      description:
        "Process medical billing, insurance claims, and payment transactions",
      status: "maintenance",
      environment: "production",
      baseUrl: "https://api.healthcenter.om",
      fullUrl: "https://api.healthcenter.om/api/v1/billing",
      authentication: "OAuth2 + PCI Compliance",
      rateLimit: {
        requests: 150,
        window: "1 hour",
        burst: 15,
      },
      permissions: ["billing:create", "insurance:process", "payments:handle"],
      tags: ["Billing", "Insurance", "Payments", "Claims", "PCI"],
      documentation: "https://docs.api.healthcenter.om/billing",
      swagger: "https://api.healthcenter.om/swagger/billing",
      testEndpoint: "https://test-api.healthcenter.om/api/v1/billing",
      maintainer: "Finance Manager Ahmed Ali",
      maintainerEmail: "ahmed.ali@healthcenter.om",
      lastModified: "2025-10-05T14:00:00Z",
      createdAt: "2024-06-20T11:45:00Z",
      deprecatedAt: null,
      replacedBy: null,
      isPublic: false,
      requiresApproval: true,
      healthCheck: {
        url: "https://api.healthcenter.om/health/billing",
        status: "maintenance",
        responseTime: 0,
        uptime: 95.2,
        lastCheck: "2025-10-13T14:25:00Z",
      },
      metrics: {
        totalRequests: 5432,
        successRate: 96.8,
        averageResponseTime: 1234,
        errorRate: 3.2,
        requestsToday: 0,
        uniqueConsumers: 6,
      },
      errorCodes: {
        422: { count: 134, description: "Invalid billing data" },
        402: { count: 89, description: "Payment required" },
        503: { count: 45, description: "Service temporarily unavailable" },
      },
      parameters: [
        {
          name: "patient_id",
          type: "string",
          required: true,
          description: "Patient identifier",
          example: "PAT-MCT-001",
        },
        {
          name: "service_codes",
          type: "array",
          required: true,
          description: "Medical service codes",
          example: '["CPT-99213", "CPT-36415"]',
        },
        {
          name: "insurance_info",
          type: "object",
          required: false,
          description: "Patient insurance information",
          example: '{"provider": "Oman Insurance", "policy": "OI123456"}',
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          billing_id: { type: "string" },
          total_amount: { type: "number" },
          insurance_coverage: { type: "number" },
          patient_responsibility: { type: "number" },
        },
      },
      consumers: [
        {
          name: "Billing System",
          requests: 2000,
          lastAccess: "2025-10-12T16:30:00Z",
        },
        {
          name: "Insurance Portal",
          requests: 2432,
          lastAccess: "2025-10-12T17:00:00Z",
        },
        {
          name: "Payment Gateway",
          requests: 1000,
          lastAccess: "2025-10-12T15:45:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 1000, actual: 1234, status: "warning" },
        availability: { target: 99.0, actual: 95.2, status: "critical" },
        errorRate: { target: 2.0, actual: 3.2, status: "warning" },
      },
      securityFeatures: [
        "PCI DSS Compliance",
        "Payment Tokenization",
        "Fraud Detection",
        "Secure Transactions",
        "Audit Logging",
      ],
      compliance: ["PCI DSS", "SOX", "HIPAA"],
      deploymentInfo: {
        lastDeployment: "2025-10-05T14:00:00Z",
        deployedBy: "DevOps Team",
        environment: "production",
        version: "v1.4.1",
        rollbackAvailable: true,
      },
    },
    {
      id: 7,
      name: "Notification Service API",
      path: "/api/v1/notifications",
      method: "POST",
      version: "v1.1.0",
      category: "Communication",
      description:
        "Send notifications via SMS, email, and push notifications to patients and staff",
      status: "deprecated",
      environment: "production",
      baseUrl: "https://api.healthcenter.jo",
      fullUrl: "https://api.healthcenter.jo/api/v1/notifications",
      authentication: "API Key",
      rateLimit: {
        requests: 2000,
        window: "1 hour",
        burst: 200,
      },
      permissions: ["notifications:send", "communication:manage"],
      tags: ["Notifications", "SMS", "Email", "Push", "Communication"],
      documentation: "https://docs.api.healthcenter.jo/notifications",
      swagger: "https://api.healthcenter.jo/swagger/notifications",
      testEndpoint: "https://test-api.healthcenter.jo/api/v1/notifications",
      maintainer: "System Administrator",
      maintainerEmail: "sysadmin@healthcenter.jo",
      lastModified: "2025-09-15T10:30:00Z",
      createdAt: "2023-12-01T09:00:00Z",
      deprecatedAt: "2025-09-01T00:00:00Z",
      replacedBy: "/api/v2/messaging",
      isPublic: true,
      requiresApproval: false,
      healthCheck: {
        url: "https://api.healthcenter.jo/health/notifications",
        status: "degraded",
        responseTime: 2345,
        uptime: 92.1,
        lastCheck: "2025-10-13T14:30:00Z",
      },
      metrics: {
        totalRequests: 125000,
        successRate: 89.5,
        averageResponseTime: 2567,
        errorRate: 10.5,
        requestsToday: 45,
        uniqueConsumers: 32,
      },
      errorCodes: {
        429: { count: 1234, description: "Rate limit exceeded" },
        500: { count: 567, description: "Internal server error" },
        503: { count: 234, description: "Service degraded" },
      },
      parameters: [
        {
          name: "recipient",
          type: "string",
          required: true,
          description: "Notification recipient",
          example: "patient@email.com",
        },
        {
          name: "type",
          type: "string",
          required: true,
          description: "Notification type",
          example: "sms",
          enum: ["sms", "email", "push"],
        },
        {
          name: "message",
          type: "string",
          required: true,
          description: "Notification message",
          example: "Your appointment is confirmed for tomorrow at 10 AM",
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          notification_id: { type: "string" },
          status: { type: "string" },
          delivery_status: { type: "string" },
        },
      },
      consumers: [
        {
          name: "Appointment System",
          requests: 50000,
          lastAccess: "2025-10-13T12:00:00Z",
        },
        {
          name: "Emergency Alerts",
          requests: 25000,
          lastAccess: "2025-10-13T11:30:00Z",
        },
        {
          name: "Reminder Service",
          requests: 50000,
          lastAccess: "2025-10-13T13:15:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 1000, actual: 2567, status: "critical" },
        availability: { target: 95.0, actual: 92.1, status: "warning" },
        errorRate: { target: 5.0, actual: 10.5, status: "critical" },
      },
      securityFeatures: [
        "Basic API Key Auth",
        "Rate Limiting",
        "Content Filtering",
      ],
      compliance: ["GDPR", "CAN-SPAM"],
      deploymentInfo: {
        lastDeployment: "2025-09-15T10:30:00Z",
        deployedBy: "Legacy Team",
        environment: "production",
        version: "v1.1.0",
        rollbackAvailable: false,
      },
    },
    {
      id: 8,
      name: "User Authentication API",
      path: "/api/v1/auth",
      method: "POST",
      version: "v3.2.1",
      category: "Security",
      description:
        "Handle user authentication, authorization, and session management across all systems",
      status: "active",
      environment: "production",
      baseUrl: "https://auth.healthcenter.ae",
      fullUrl: "https://auth.healthcenter.ae/api/v1/auth",
      authentication: "Multi-factor + Biometric",
      rateLimit: {
        requests: 10000,
        window: "1 hour",
        burst: 1000,
      },
      permissions: ["auth:login", "session:manage", "mfa:verify"],
      tags: ["Authentication", "Security", "MFA", "SSO", "Session"],
      documentation: "https://docs.auth.healthcenter.ae/auth",
      swagger: "https://auth.healthcenter.ae/swagger/auth",
      testEndpoint: "https://test-auth.healthcenter.ae/api/v1/auth",
      maintainer: "Security Officer Hassan Al-Kindi",
      maintainerEmail: "hassan.kindi@healthcenter.ae",
      lastModified: "2025-10-13T08:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      deprecatedAt: null,
      replacedBy: null,
      isPublic: false,
      requiresApproval: true,
      healthCheck: {
        url: "https://auth.healthcenter.ae/health/auth",
        status: "healthy",
        responseTime: 98,
        uptime: 99.99,
        lastCheck: "2025-10-13T14:35:00Z",
      },
      metrics: {
        totalRequests: 256789,
        successRate: 99.8,
        averageResponseTime: 156,
        errorRate: 0.2,
        requestsToday: 5678,
        uniqueConsumers: 156,
      },
      errorCodes: {
        401: { count: 234, description: "Invalid credentials" },
        429: { count: 123, description: "Too many login attempts" },
        423: { count: 45, description: "Account locked" },
      },
      parameters: [
        {
          name: "username",
          type: "string",
          required: true,
          description: "User login identifier",
          example: "dr.sarah.mansouri",
        },
        {
          name: "password",
          type: "string",
          required: true,
          description: "User password (encrypted)",
          example: "***encrypted***",
        },
        {
          name: "mfa_token",
          type: "string",
          required: false,
          description: "Multi-factor authentication token",
          example: "123456",
        },
      ],
      responseSchema: {
        type: "object",
        properties: {
          access_token: { type: "string" },
          refresh_token: { type: "string" },
          expires_in: { type: "integer" },
          user_info: { type: "object" },
        },
      },
      consumers: [
        {
          name: "All Applications",
          requests: 200000,
          lastAccess: "2025-10-13T14:35:00Z",
        },
        {
          name: "Mobile Apps",
          requests: 30000,
          lastAccess: "2025-10-13T14:30:00Z",
        },
        {
          name: "Third Party Systems",
          requests: 26789,
          lastAccess: "2025-10-13T14:25:00Z",
        },
      ],
      slaTargets: {
        responseTime: { target: 200, actual: 156, status: "met" },
        availability: { target: 99.9, actual: 99.99, status: "met" },
        errorRate: { target: 0.5, actual: 0.2, status: "met" },
      },
      securityFeatures: [
        "Multi-Factor Authentication",
        "Biometric Authentication",
        "Account Lockout Protection",
        "Password Complexity Rules",
        "Session Management",
        "Single Sign-On (SSO)",
        "Threat Detection",
      ],
      compliance: ["OAuth 2.0", "OpenID Connect", "SAML 2.0", "ISO 27001"],
      deploymentInfo: {
        lastDeployment: "2025-10-13T08:00:00Z",
        deployedBy: "Security Team",
        environment: "production",
        version: "v3.2.1",
        rollbackAvailable: true,
      },
    },
  ]);

  const apiStats = computed(() => {
    const total = apiEndpoints.value.length;
    const active = apiEndpoints.value.filter(
      (api) => api.status === "active"
    ).length;
    const deprecated = apiEndpoints.value.filter(
      (api) => api.status === "deprecated"
    ).length;
    const maintenance = apiEndpoints.value.filter(
      (api) => api.status === "maintenance"
    ).length;

    const categoryCounts = apiEndpoints.value.reduce((acc, api) => {
      acc[api.category] = (acc[api.category] || 0) + 1;
      return acc;
    }, {});

    const methodCounts = apiEndpoints.value.reduce((acc, api) => {
      acc[api.method] = (acc[api.method] || 0) + 1;
      return acc;
    }, {});

    const healthyApis = apiEndpoints.value.filter(
      (api) => api.healthCheck.status === "healthy"
    ).length;
    const warningApis = apiEndpoints.value.filter(
      (api) =>
        api.healthCheck.status === "warning" ||
        api.healthCheck.status === "degraded"
    ).length;
    const criticalApis = apiEndpoints.value.filter(
      (api) =>
        api.healthCheck.status === "critical" ||
        api.healthCheck.status === "maintenance"
    ).length;

    const totalRequests = apiEndpoints.value.reduce(
      (sum, api) => sum + api.metrics.totalRequests,
      0
    );
    const averageUptime =
      apiEndpoints.value.reduce((sum, api) => sum + api.healthCheck.uptime, 0) /
      total;
    const averageResponseTime =
      apiEndpoints.value.reduce(
        (sum, api) => sum + api.metrics.averageResponseTime,
        0
      ) / total;

    return {
      totalApis: total,
      activeApis: active,
      deprecatedApis: deprecated,
      maintenanceApis: maintenance,
      categoryCounts,
      methodCounts,
      healthyApis,
      warningApis,
      criticalApis,
      totalRequests,
      averageUptime: Math.round(averageUptime * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime),
    };
  });

  const addApiEndpoint = (apiData) => {
    const newApi = {
      ...apiData,
      id: Math.max(...apiEndpoints.value.map((a) => a.id)) + 1,
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      metrics: {
        totalRequests: 0,
        successRate: 100,
        averageResponseTime: 200,
        errorRate: 0,
        requestsToday: 0,
        uniqueConsumers: 0,
      },
      healthCheck: {
        status: "healthy",
        responseTime: 200,
        uptime: 100,
        lastCheck: new Date().toISOString(),
      },
    };
    apiEndpoints.value.unshift(newApi);
    console.log("Added new API endpoint:", newApi.name);
  };

  const updateApiEndpoint = (id, apiData) => {
    const index = apiEndpoints.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      apiEndpoints.value[index] = {
        ...apiEndpoints.value[index],
        ...apiData,
        lastModified: new Date().toISOString(),
      };
      console.log("Updated API endpoint:", apiEndpoints.value[index].name);
    }
  };

  const deleteApiEndpoint = (id) => {
    const index = apiEndpoints.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      const deletedApi = apiEndpoints.value[index];
      apiEndpoints.value.splice(index, 1);
      console.log("Deleted API endpoint:", deletedApi.name);
    }
  };

  const bulkUpdateStatus = (ids, status) => {
    let updated = 0;
    ids.forEach((id) => {
      const api = apiEndpoints.value.find((a) => a.id === id);
      if (api) {
        api.status = status;
        api.lastModified = new Date().toISOString();
        updated++;
      }
    });
    console.log(`Bulk updated ${updated} API endpoints to status: ${status}`);
  };

  const testApiEndpoint = async (id) => {
    const api = apiEndpoints.value.find((a) => a.id === id);
    if (api) {
      // Simulate API test
      const testResult = {
        success: Math.random() > 0.1,
        responseTime: Math.floor(Math.random() * 1000) + 100,
        timestamp: new Date().toISOString(),
      };

      api.healthCheck = {
        ...api.healthCheck,
        status: testResult.success ? "healthy" : "warning",
        responseTime: testResult.responseTime,
        lastCheck: testResult.timestamp,
      };

      console.log("API test completed:", api.name, testResult);
      return testResult;
    }
  };

  return {
    apiEndpoints,
    apiStats,
    addApiEndpoint,
    updateApiEndpoint,
    deleteApiEndpoint,
    bulkUpdateStatus,
    testApiEndpoint,
  };
};

// composables/useAuditMock.js
export const useAuditMock = () => {
  const auditLogs = ref([
    {
      id: 1,
      logId: "AUDIT-2025-001234",
      timestamp: "2025-10-13T14:30:15Z",
      userId: "USR-001",
      userName: "Dr. Sarah Al-Mansouri",
      userRole: "Senior Cardiologist",
      userEmail: "sarah.mansouri@healthcenter.ae",
      action: "patient_record_accessed",
      actionType: "READ",
      resourceType: "patient_record",
      resourceId: "PAT-DXB-001",
      resourceName: "Ahmed Al-Rashid - Patient Record",
      module: "EHR",
      subModule: "Patient Management",
      facility: "Dubai Healthcare Center",
      country: "UAE",
      ipAddress: "185.123.45.67",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      sessionId: "SESSION-789456123",
      deviceType: "desktop",
      location: "Dubai, UAE",
      severity: "INFO",
      riskLevel: "LOW",
      status: "SUCCESS",
      duration: 1247,
      description:
        "Medical professional accessed patient record for consultation review",
      before: null,
      after: null,
      changes: [
        {
          field: "last_accessed",
          oldValue: "2025-10-12T10:30:00Z",
          newValue: "2025-10-13T14:30:15Z",
        },
      ],
      metadata: {
        patientAge: 45,
        patientGender: "male",
        appointmentId: "APT-2025-001",
        departmentId: "CARDIO-001",
        accessReason: "scheduled_consultation",
      },
      complianceFlags: ["HIPAA_COMPLIANT", "GDPR_COMPLIANT"],
      auditTrail: {
        systemGenerated: true,
        verified: true,
        exported: false,
        retention: "7_years",
      },
      tags: ["patient_access", "consultation", "cardiology"],
      relatedLogs: ["AUDIT-2025-001235", "AUDIT-2025-001236"],
      alertGenerated: false,
      reviewStatus: "approved",
      reviewedBy: null,
      reviewedAt: null,
      notes: "Standard patient record access for scheduled consultation",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 2,
      logId: "AUDIT-2025-001235",
      timestamp: "2025-10-13T14:25:30Z",
      userId: "USR-002",
      userName: "Nurse Fatima Al-Zahra",
      userRole: "Senior ICU Nurse",
      userEmail: "fatima.alzahra@healthcenter.sa",
      action: "medication_administered",
      actionType: "CREATE",
      resourceType: "medication_record",
      resourceId: "MED-RYD-002",
      resourceName: "Medication Administration Record",
      module: "Pharmacy",
      subModule: "Medication Administration",
      facility: "Riyadh Medical Center",
      country: "Saudi Arabia",
      ipAddress: "192.168.1.45",
      userAgent: "MedApp/2.1.0 Android",
      sessionId: "SESSION-456789012",
      deviceType: "mobile",
      location: "Riyadh, Saudi Arabia",
      severity: "HIGH",
      riskLevel: "MEDIUM",
      status: "SUCCESS",
      duration: 3456,
      description: "High-risk medication administered to critical patient",
      before: null,
      after: {
        medicationName: "Morphine Sulfate 10mg",
        dosage: "10mg",
        route: "IV",
        frequency: "Q4H PRN",
        patientId: "PAT-RYD-003",
      },
      changes: [
        {
          field: "medication_administered",
          oldValue: null,
          newValue: "Morphine Sulfate 10mg IV",
        },
        {
          field: "administration_time",
          oldValue: null,
          newValue: "2025-10-13T14:25:30Z",
        },
      ],
      metadata: {
        patientCondition: "post_operative",
        prescribingDoctor: "Dr. Ahmad Hassan",
        medicationCategory: "controlled_substance",
        witnessRequired: true,
        witnessName: "Nurse Maria Rodriguez",
      },
      complianceFlags: ["DEA_COMPLIANT", "CONTROLLED_SUBSTANCE"],
      auditTrail: {
        systemGenerated: true,
        verified: true,
        exported: false,
        retention: "10_years",
      },
      tags: ["medication", "controlled_substance", "high_risk", "icu"],
      relatedLogs: ["AUDIT-2025-001234", "AUDIT-2025-001237"],
      alertGenerated: true,
      reviewStatus: "pending_review",
      reviewedBy: null,
      reviewedAt: null,
      notes: "Controlled substance administration - requires supervisor review",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 3,
      logId: "AUDIT-2025-001236",
      timestamp: "2025-10-13T13:45:12Z",
      userId: "USR-003",
      userName: "System Admin",
      userRole: "System Administrator",
      userEmail: "admin@healthcenter.qa",
      action: "user_login_failed",
      actionType: "SECURITY",
      resourceType: "authentication",
      resourceId: "AUTH-001",
      resourceName: "Login Attempt",
      module: "Authentication",
      subModule: "User Login",
      facility: "Doha Medical Complex",
      country: "Qatar",
      ipAddress: "213.42.15.89",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
      sessionId: null,
      deviceType: "mobile",
      location: "Doha, Qatar",
      severity: "CRITICAL",
      riskLevel: "HIGH",
      status: "FAILED",
      duration: 5000,
      description: "Multiple failed login attempts from suspicious IP address",
      before: null,
      after: null,
      changes: [
        {
          field: "failed_attempts",
          oldValue: "4",
          newValue: "5",
        },
        {
          field: "account_status",
          oldValue: "active",
          newValue: "temporarily_locked",
        },
      ],
      metadata: {
        attemptedUsername: "dr.hassan.qatar",
        failureReason: "invalid_credentials",
        suspiciousActivity: true,
        geoLocation: "Unknown",
        isKnownDevice: false,
      },
      complianceFlags: ["SECURITY_INCIDENT", "POTENTIAL_BREACH"],
      auditTrail: {
        systemGenerated: true,
        verified: false,
        exported: false,
        retention: "indefinite",
      },
      tags: ["security", "failed_login", "suspicious", "potential_breach"],
      relatedLogs: ["AUDIT-2025-001230", "AUDIT-2025-001231"],
      alertGenerated: true,
      reviewStatus: "urgent_review",
      reviewedBy: null,
      reviewedAt: null,
      notes: "Security incident - investigate immediately",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 4,
      logId: "AUDIT-2025-001237",
      timestamp: "2025-10-13T12:20:45Z",
      userId: "USR-004",
      userName: "Dr. Omar Al-Sabah",
      userRole: "Orthopedic Surgeon",
      userEmail: "omar.alsabah@healthcenter.kw",
      action: "surgery_report_created",
      actionType: "CREATE",
      resourceType: "surgery_report",
      resourceId: "SURG-KWT-001",
      resourceName: "Knee Replacement Surgery Report",
      module: "Surgery Management",
      subModule: "Post-Operative Reports",
      facility: "Kuwait Medical Center",
      country: "Kuwait",
      ipAddress: "213.75.89.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      sessionId: "SESSION-123456789",
      deviceType: "desktop",
      location: "Kuwait City, Kuwait",
      severity: "MEDIUM",
      riskLevel: "LOW",
      status: "SUCCESS",
      duration: 2847,
      description: "Post-operative surgery report created and finalized",
      before: null,
      after: {
        reportType: "post_operative",
        surgeryType: "total_knee_replacement",
        duration: "3_hours_45_minutes",
        complications: "none",
        patientStatus: "stable",
      },
      changes: [
        {
          field: "report_status",
          oldValue: "draft",
          newValue: "finalized",
        },
        {
          field: "completion_time",
          oldValue: null,
          newValue: "2025-10-13T12:20:45Z",
        },
      ],
      metadata: {
        surgeryDate: "2025-10-13T08:00:00Z",
        assistingSurgeon: "Dr. Nadia Al-Rashid",
        anesthesiologist: "Dr. Khalil Mahmoud",
        operatingRoom: "OR-3",
        bloodLoss: "150ml",
      },
      complianceFlags: ["MEDICAL_COMPLIANCE", "DOCUMENTATION_COMPLETE"],
      auditTrail: {
        systemGenerated: false,
        verified: true,
        exported: false,
        retention: "25_years",
      },
      tags: ["surgery", "orthopedic", "post_operative", "documentation"],
      relatedLogs: ["AUDIT-2025-001238", "AUDIT-2025-001239"],
      alertGenerated: false,
      reviewStatus: "approved",
      reviewedBy: "USR-005",
      reviewedAt: "2025-10-13T13:00:00Z",
      notes: "Standard post-operative documentation completed successfully",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 5,
      logId: "AUDIT-2025-001238",
      timestamp: "2025-10-13T11:15:30Z",
      userId: "USR-005",
      userName: "Pharmacist Aisha Mahmoud",
      userRole: "Clinical Pharmacist",
      userEmail: "aisha.mahmoud@healthcenter.bh",
      action: "prescription_dispensed",
      actionType: "UPDATE",
      resourceType: "prescription",
      resourceId: "RX-BHR-001",
      resourceName: "Prescription for Hypertension Medication",
      module: "Pharmacy",
      subModule: "Prescription Dispensing",
      facility: "Manama Medical Center",
      country: "Bahrain",
      ipAddress: "94.203.78.91",
      userAgent: "PharmacyPro/3.2.1 Web",
      sessionId: "SESSION-345678901",
      deviceType: "desktop",
      location: "Manama, Bahrain",
      severity: "MEDIUM",
      riskLevel: "LOW",
      status: "SUCCESS",
      duration: 1892,
      description:
        "Prescription medication dispensed with drug interaction check",
      before: {
        status: "pending_dispensing",
        quantity_remaining: "30_tablets",
      },
      after: {
        status: "partially_dispensed",
        quantity_remaining: "15_tablets",
        dispensed_quantity: "15_tablets",
      },
      changes: [
        {
          field: "quantity_dispensed",
          oldValue: "0",
          newValue: "15",
        },
        {
          field: "dispensing_date",
          oldValue: null,
          newValue: "2025-10-13T11:15:30Z",
        },
      ],
      metadata: {
        medicationName: "Amlodipine 5mg",
        prescribingDoctor: "Dr. Layla Mansour",
        patientInsurance: "Bahrain National Health Insurance",
        copayAmount: "5.50 BHD",
        drugInteractions: "none_detected",
      },
      complianceFlags: ["PHARMACY_COMPLIANCE", "INTERACTION_CHECKED"],
      auditTrail: {
        systemGenerated: true,
        verified: true,
        exported: false,
        retention: "7_years",
      },
      tags: [
        "pharmacy",
        "prescription",
        "medication_dispensing",
        "hypertension",
      ],
      relatedLogs: ["AUDIT-2025-001240"],
      alertGenerated: false,
      reviewStatus: "approved",
      reviewedBy: null,
      reviewedAt: null,
      notes: "Standard prescription dispensing with no complications",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 6,
      logId: "AUDIT-2025-001239",
      timestamp: "2025-10-13T10:30:22Z",
      userId: "USR-006",
      userName: "Lab Tech Yusuf Al-Busaidi",
      userRole: "Senior Laboratory Technician",
      userEmail: "yusuf.busaidi@healthcenter.om",
      action: "lab_result_updated",
      actionType: "UPDATE",
      resourceType: "lab_result",
      resourceId: "LAB-OMN-001",
      resourceName: "Complete Blood Count Results",
      module: "Laboratory",
      subModule: "Lab Results",
      facility: "Muscat Medical Center",
      country: "Oman",
      ipAddress: "109.189.67.34",
      userAgent: "LabSys/4.1.2 Desktop",
      sessionId: "SESSION-234567890",
      deviceType: "desktop",
      location: "Muscat, Oman",
      severity: "HIGH",
      riskLevel: "MEDIUM",
      status: "SUCCESS",
      duration: 987,
      description:
        "Critical lab values updated - immediate physician notification required",
      before: {
        status: "pending_review",
        critical_flag: false,
        physician_notified: false,
      },
      after: {
        status: "critical_results",
        critical_flag: true,
        physician_notified: true,
      },
      changes: [
        {
          field: "hemoglobin_level",
          oldValue: "pending",
          newValue: "6.8 g/dL",
        },
        {
          field: "critical_alert_sent",
          oldValue: "false",
          newValue: "true",
        },
      ],
      metadata: {
        testType: "complete_blood_count",
        criticalValues: [
          "hemoglobin: 6.8 g/dL (Low)",
          "platelet_count: 85,000 (Low)",
        ],
        orderingPhysician: "Dr. Ahmad Al-Lawati",
        urgency: "stat",
        notificationMethod: "phone_call",
      },
      complianceFlags: ["CRITICAL_VALUE_NOTIFICATION", "PHYSICIAN_CONTACTED"],
      auditTrail: {
        systemGenerated: true,
        verified: true,
        exported: false,
        retention: "10_years",
      },
      tags: [
        "laboratory",
        "critical_values",
        "emergency",
        "physician_notification",
      ],
      relatedLogs: ["AUDIT-2025-001241"],
      alertGenerated: true,
      reviewStatus: "approved",
      reviewedBy: "USR-007",
      reviewedAt: "2025-10-13T10:45:00Z",
      notes: "Critical lab values - physician immediately notified by phone",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 7,
      logId: "AUDIT-2025-001240",
      timestamp: "2025-10-13T09:45:18Z",
      userId: "USR-007",
      userName: "Dr. Layla Mansour",
      userRole: "Radiologist",
      userEmail: "layla.mansour@healthcenter.jo",
      action: "radiology_report_signed",
      actionType: "UPDATE",
      resourceType: "radiology_report",
      resourceId: "RAD-JOR-001",
      resourceName: "CT Chest Report",
      module: "Radiology",
      subModule: "Report Management",
      facility: "Amman Medical Center",
      country: "Jordan",
      ipAddress: "195.121.45.78",
      userAgent: "RadiologyPACS/5.0.1 Web",
      sessionId: "SESSION-567890123",
      deviceType: "desktop",
      location: "Amman, Jordan",
      severity: "MEDIUM",
      riskLevel: "LOW",
      status: "SUCCESS",
      duration: 2341,
      description: "Radiology report digitally signed and finalized",
      before: {
        status: "draft",
        signed: false,
        available_to_clinicians: false,
      },
      after: {
        status: "final",
        signed: true,
        available_to_clinicians: true,
      },
      changes: [
        {
          field: "digital_signature",
          oldValue: null,
          newValue: "DR_LAYLA_MANSOUR_2025",
        },
        {
          field: "finalized_timestamp",
          oldValue: null,
          newValue: "2025-10-13T09:45:18Z",
        },
      ],
      metadata: {
        studyType: "ct_chest_with_contrast",
        indication: "chest_pain_evaluation",
        findings: "no_acute_findings",
        impression: "normal_chest_ct",
        dictationTime: "5_minutes_32_seconds",
      },
      complianceFlags: ["DIGITAL_SIGNATURE_VALID", "TURNAROUND_TIME_MET"],
      auditTrail: {
        systemGenerated: true,
        verified: true,
        exported: false,
        retention: "20_years",
      },
      tags: ["radiology", "ct_scan", "digital_signature", "finalized"],
      relatedLogs: ["AUDIT-2025-001242"],
      alertGenerated: false,
      reviewStatus: "approved",
      reviewedBy: null,
      reviewedAt: null,
      notes: "Standard radiology report completion workflow",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 8,
      logId: "AUDIT-2025-001241",
      timestamp: "2025-10-13T08:30:45Z",
      userId: "USR-008",
      userName: "Finance Manager Ahmed Ali",
      userRole: "Finance Manager",
      userEmail: "ahmed.ali@healthcenter.eg",
      action: "payment_refund_processed",
      actionType: "CREATE",
      resourceType: "financial_transaction",
      resourceId: "TXN-EGY-001",
      resourceName: "Patient Payment Refund",
      module: "Finance",
      subModule: "Payment Processing",
      facility: "Cairo Medical Center",
      country: "Egypt",
      ipAddress: "156.219.78.45",
      userAgent: "FinanceApp/2.3.0 Web",
      sessionId: "SESSION-678901234",
      deviceType: "desktop",
      location: "Cairo, Egypt",
      severity: "HIGH",
      riskLevel: "MEDIUM",
      status: "SUCCESS",
      duration: 4567,
      description:
        "High-value patient refund processed with supervisor approval",
      before: {
        refund_status: "requested",
        approval_status: "pending",
        amount_refunded: "0.00 EGP",
      },
      after: {
        refund_status: "processed",
        approval_status: "approved",
        amount_refunded: "2500.00 EGP",
      },
      changes: [
        {
          field: "refund_amount",
          oldValue: "0.00 EGP",
          newValue: "2500.00 EGP",
        },
        {
          field: "processing_date",
          oldValue: null,
          newValue: "2025-10-13T08:30:45Z",
        },
      ],
      metadata: {
        originalTransactionId: "TXN-2025-001242",
        patientId: "PAT-CAI-009",
        refundReason: "cancelled_procedure",
        approvedBy: "Finance Director",
        refundMethod: "bank_transfer",
        processingFee: "25.00 EGP",
      },
      complianceFlags: ["FINANCIAL_APPROVAL_REQUIRED", "AUDIT_TRAIL_COMPLETE"],
      auditTrail: {
        systemGenerated: false,
        verified: true,
        exported: false,
        retention: "10_years",
      },
      tags: ["finance", "refund", "high_value", "supervisor_approved"],
      relatedLogs: ["AUDIT-2025-001243"],
      alertGenerated: false,
      reviewStatus: "approved",
      reviewedBy: "USR-009",
      reviewedAt: "2025-10-13T09:00:00Z",
      notes:
        "High-value refund processed with proper approvals and documentation",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 9,
      logId: "AUDIT-2025-001242",
      timestamp: "2025-10-13T07:15:30Z",
      userId: "SYSTEM",
      userName: "Automated Backup System",
      userRole: "System Service",
      userEmail: "system@healthcenter.ae",
      action: "database_backup_completed",
      actionType: "SYSTEM",
      resourceType: "database_backup",
      resourceId: "BACKUP-2025-10-13",
      resourceName: "Daily Database Backup",
      module: "System Administration",
      subModule: "Backup Services",
      facility: "All Facilities",
      country: "All Countries",
      ipAddress: "127.0.0.1",
      userAgent: "BackupService/1.5.0",
      sessionId: null,
      deviceType: "server",
      location: "Data Center, UAE",
      severity: "MEDIUM",
      riskLevel: "LOW",
      status: "SUCCESS",
      duration: 3600000,
      description: "Scheduled daily database backup completed successfully",
      before: {
        backup_status: "not_started",
        last_backup_date: "2025-10-12T07:15:30Z",
      },
      after: {
        backup_status: "completed",
        last_backup_date: "2025-10-13T07:15:30Z",
      },
      changes: [
        {
          field: "backup_size",
          oldValue: "N/A",
          newValue: "2.3 TB",
        },
        {
          field: "backup_location",
          oldValue: "N/A",
          newValue: "/backups/healthcare-db-2025-10-13.sql",
        },
      ],
      metadata: {
        backupType: "full_backup",
        compressionRatio: "85%",
        verificationStatus: "passed",
        storageLocation: "primary_and_offsite",
        retentionPeriod: "90_days",
      },
      complianceFlags: ["BACKUP_VERIFIED", "OFFSITE_STORAGE_CONFIRMED"],
      auditTrail: {
        systemGenerated: true,
        verified: true,
        exported: false,
        retention: "1_year",
      },
      tags: ["system", "backup", "database", "automated"],
      relatedLogs: ["AUDIT-2025-001244"],
      alertGenerated: false,
      reviewStatus: "auto_approved",
      reviewedBy: null,
      reviewedAt: null,
      notes: "Automated daily backup completed within normal parameters",
      exportedAt: null,
      archivedAt: null,
      isDeleted: false,
    },
    {
      id: 10,
      logId: "AUDIT-2025-001243",
      timestamp: "2025-10-12T23:45:12Z",
      userId: "USR-010",
      userName: "Security Officer Hassan Al-Kindi",
      userRole: "Information Security Officer",
      userEmail: "hassan.kindi@healthcenter.ae",
      action: "security_policy_updated",
      actionType: "UPDATE",
      resourceType: "security_policy",
      resourceId: "SEC-POL-001",
      resourceName: "Password Policy Configuration",
      module: "Security Management",
      subModule: "Policy Management",
      facility: "All Facilities",
      country: "All Countries",
      ipAddress: "185.123.45.99",
      userAgent: "SecurityAdmin/1.0.0 Web",
      sessionId: "SESSION-789012345",
      deviceType: "desktop",
      location: "Dubai, UAE",
      severity: "CRITICAL",
      riskLevel: "HIGH",
      status: "SUCCESS",
      duration: 1567,
      description:
        "Enterprise security policy updated - password complexity requirements enhanced",
      before: {
        min_password_length: "8",
        require_special_chars: false,
        password_expiry_days: "90",
      },
      after: {
        min_password_length: "12",
        require_special_chars: true,
        password_expiry_days: "60",
      },
      changes: [
        {
          field: "minimum_password_length",
          oldValue: "8 characters",
          newValue: "12 characters",
        },
        {
          field: "special_character_requirement",
          oldValue: "disabled",
          newValue: "enabled",
        },
        {
          field: "password_expiry_period",
          oldValue: "90 days",
          newValue: "60 days",
        },
      ],
      metadata: {
        policyVersion: "2.1",
        effectiveDate: "2025-10-15T00:00:00Z",
        affectedUsers: "1247",
        complianceStandard: "ISO_27001",
        approvalRequired: true,
      },
      complianceFlags: [
        "SECURITY_ENHANCEMENT",
        "COMPLIANCE_UPDATE",
        "MANAGEMENT_APPROVED",
      ],
      auditTrail: {
        systemGenerated: false,
        verified: true,
        exported: true,
        retention: "indefinite",
      },
      tags: [
        "security",
        "policy_update",
        "password_requirements",
        "compliance",
      ],
      relatedLogs: ["AUDIT-2025-001245"],
      alertGenerated: true,
      reviewStatus: "approved",
      reviewedBy: "USR-011",
      reviewedAt: "2025-10-13T08:00:00Z",
      notes:
        "Security policy enhancement approved by CISO - implementation scheduled",
      exportedAt: "2025-10-13T09:00:00Z",
      archivedAt: null,
      isDeleted: false,
    },
  ]);

  const auditStats = computed(() => {
    const total = auditLogs.value.length;
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = auditLogs.value.filter((log) =>
      log.timestamp.startsWith(today)
    ).length;

    const severityCounts = auditLogs.value.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {});

    const actionCounts = auditLogs.value.reduce((acc, log) => {
      acc[log.actionType] = (acc[log.actionType] || 0) + 1;
      return acc;
    }, {});

    const modulesCounts = auditLogs.value.reduce((acc, log) => {
      acc[log.module] = (acc[log.module] || 0) + 1;
      return acc;
    }, {});

    const riskCounts = auditLogs.value.reduce((acc, log) => {
      acc[log.riskLevel] = (acc[log.riskLevel] || 0) + 1;
      return acc;
    }, {});

    const alertsGenerated = auditLogs.value.filter(
      (log) => log.alertGenerated
    ).length;
    const pendingReviews = auditLogs.value.filter(
      (log) =>
        log.reviewStatus === "pending_review" ||
        log.reviewStatus === "urgent_review"
    ).length;

    return {
      totalLogs: total,
      todayLogs,
      severityCounts,
      actionCounts,
      modulesCounts,
      riskCounts,
      alertsGenerated,
      pendingReviews,
      averageDuration: Math.round(
        auditLogs.value.reduce((sum, log) => sum + log.duration, 0) / total
      ),
    };
  });

  const addAuditLog = (logData) => {
    const newLog = {
      ...logData,
      id: Math.max(...auditLogs.value.map((l) => l.id)) + 1,
      logId: `AUDIT-2025-${String(
        Math.max(
          ...auditLogs.value.map((l) => parseInt(l.logId.split("-")[2]))
        ) + 1
      ).padStart(6, "0")}`,
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      reviewStatus: "pending_review",
      alertGenerated: false,
      isDeleted: false,
    };
    auditLogs.value.unshift(newLog);
    console.log("Added new audit log:", newLog.logId);
  };

  const updateAuditLog = (id, logData) => {
    const index = auditLogs.value.findIndex((l) => l.id === id);
    if (index !== -1) {
      auditLogs.value[index] = {
        ...auditLogs.value[index],
        ...logData,
      };
      console.log("Updated audit log:", auditLogs.value[index].logId);
    }
  };

  const deleteAuditLog = (id) => {
    const index = auditLogs.value.findIndex((l) => l.id === id);
    if (index !== -1) {
      auditLogs.value[index].isDeleted = true;
      console.log("Marked audit log as deleted:", auditLogs.value[index].logId);
    }
  };

  const bulkExportLogs = (ids) => {
    let exported = 0;
    const exportTime = new Date().toISOString();
    ids.forEach((id) => {
      const log = auditLogs.value.find((l) => l.id === id);
      if (log) {
        log.exportedAt = exportTime;
        log.auditTrail.exported = true;
        exported++;
      }
    });
    console.log(`Bulk exported ${exported} audit logs`);
  };

  const archiveOldLogs = (beforeDate) => {
    let archived = 0;
    const archiveTime = new Date().toISOString();
    auditLogs.value.forEach((log) => {
      if (new Date(log.timestamp) < new Date(beforeDate)) {
        log.archivedAt = archiveTime;
        archived++;
      }
    });
    console.log(`Archived ${archived} old audit logs`);
  };

  return {
    auditLogs,
    auditStats,
    addAuditLog,
    updateAuditLog,
    deleteAuditLog,
    bulkExportLogs,
    archiveOldLogs,
  };
};

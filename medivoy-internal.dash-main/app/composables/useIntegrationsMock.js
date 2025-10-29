// app/composables/useIntegrationsMock.js
import { ref, computed } from "vue";

export const useIntegrationsMock = () => {
  // Mock integrations data
  const integrations = ref([
    {
      id: 1,
      name: "Epic EHR Integration",
      type: "EHR",
      provider: "Epic Systems",
      status: "active",
      health: "healthy",
      version: "2024.1",
      endpoint: "https://api.epic.hospital.com/fhir",
      authentication: "OAuth2",
      syncFrequency: "1 hour",
      dataMapping: { patient_id: "patientId", mrn: "medicalRecordNumber" },
      configuration: { timeout: "30000", retries: "3" },
      tags: ["production", "critical"],
      maintainer: "John Smith",
      maintainerEmail: "john.smith@hospital.com",
      businessRules: [
        {
          id: 1,
          name: "Data Validation",
          description: "Validate patient data before sync",
          priority: "high",
          enabled: true,
        },
      ],
      notifications: {
        onSuccess: false,
        onFailure: true,
        onWarning: true,
        recipients: ["admin@hospital.com", "it@hospital.com"],
      },
      monitoring: {
        healthCheckUrl: "https://api.epic.hospital.com/health",
        healthCheckInterval: "5 minutes",
        alertThresholds: { responseTime: 2000, errorRate: 5, successRate: 95 },
      },
      securitySettings: {
        encryptionEnabled: true,
        tlsVersion: "1.3",
        certificateValidation: true,
        ipWhitelist: ["192.168.1.0/24"],
        auditLogging: true,
        dataClassification: "confidential",
      },
      compliance: ["HIPAA", "HITECH", "SOC2"],
      priority: "critical",
      department: "Clinical Operations",
      successRate: 98.5,
      uptime: 99.9,
      recordsSync: 125000,
      avgResponseTime: 450,
      errorCount: 12,
      lastSync: new Date(Date.now() - 10 * 60000).toISOString(),
      nextSync: new Date(Date.now() + 50 * 60000).toISOString(),
      canDelete: false,
      connectionLogs: [
        {
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          status: "success",
          duration: 430,
        },
      ],
    },
    {
      id: 2,
      name: "Laboratory System Integration",
      type: "Laboratory",
      provider: "LabCorp Connect",
      status: "active",
      health: "healthy",
      version: "3.2.1",
      endpoint: "https://api.labcorp.com/v3",
      authentication: "API Key",
      syncFrequency: "30 minutes",
      dataMapping: { test_id: "labTestId", result: "labResult" },
      configuration: { format: "HL7", encoding: "UTF-8" },
      tags: ["laboratory", "automated"],
      maintainer: "Sarah Johnson",
      maintainerEmail: "sarah.johnson@hospital.com",
      businessRules: [],
      notifications: {
        onSuccess: false,
        onFailure: true,
        onWarning: true,
        recipients: ["lab@hospital.com"],
      },
      monitoring: {
        healthCheckUrl: "https://api.labcorp.com/health",
        healthCheckInterval: "10 minutes",
        alertThresholds: { responseTime: 3000, errorRate: 3, successRate: 97 },
      },
      securitySettings: {
        encryptionEnabled: true,
        tlsVersion: "1.3",
        certificateValidation: true,
        ipWhitelist: [],
        auditLogging: true,
        dataClassification: "confidential",
      },
      compliance: ["HIPAA", "CLIA"],
      priority: "high",
      department: "Laboratory Services",
      successRate: 99.2,
      uptime: 99.8,
      recordsSync: 45000,
      avgResponseTime: 620,
      errorCount: 8,
      lastSync: new Date(Date.now() - 15 * 60000).toISOString(),
      nextSync: new Date(Date.now() + 15 * 60000).toISOString(),
      canDelete: true,
      connectionLogs: [],
    },
    {
      id: 3,
      name: "Pharmacy Management System",
      type: "Pharmacy",
      provider: "MedExpress",
      status: "maintenance",
      health: "warning",
      version: "2.8.5",
      endpoint: "https://api.medexpress.com",
      authentication: "OAuth2",
      syncFrequency: "15 minutes",
      dataMapping: { medication_id: "drugId", dosage: "prescriptionDosage" },
      configuration: { environment: "production" },
      tags: ["pharmacy", "prescriptions"],
      maintainer: "Mike Davis",
      maintainerEmail: "mike.davis@hospital.com",
      businessRules: [],
      notifications: {
        onSuccess: false,
        onFailure: true,
        onWarning: true,
        recipients: ["pharmacy@hospital.com"],
      },
      monitoring: {
        healthCheckUrl: "https://api.medexpress.com/status",
        healthCheckInterval: "5 minutes",
        alertThresholds: { responseTime: 2500, errorRate: 4, successRate: 96 },
      },
      securitySettings: {
        encryptionEnabled: true,
        tlsVersion: "1.2",
        certificateValidation: true,
        ipWhitelist: [],
        auditLogging: true,
        dataClassification: "restricted",
      },
      compliance: ["HIPAA", "DEA"],
      priority: "high",
      department: "Pharmacy Services",
      successRate: 97.8,
      uptime: 98.5,
      recordsSync: 78000,
      avgResponseTime: 890,
      errorCount: 25,
      lastSync: new Date(Date.now() - 2 * 3600000).toISOString(),
      nextSync: new Date(Date.now() + 13 * 60000).toISOString(),
      canDelete: true,
      connectionLogs: [],
    },
    {
      id: 4,
      name: "Insurance Claims Portal",
      type: "Insurance",
      provider: "ClaimConnect",
      status: "inactive",
      health: "warning",
      version: "1.5.2",
      endpoint: "https://api.claimconnect.com",
      authentication: "Basic Auth",
      syncFrequency: "2 hours",
      dataMapping: {},
      configuration: {},
      tags: ["billing", "claims"],
      maintainer: "Lisa Chen",
      maintainerEmail: "lisa.chen@hospital.com",
      businessRules: [],
      notifications: {
        onSuccess: false,
        onFailure: true,
        onWarning: false,
        recipients: ["billing@hospital.com"],
      },
      monitoring: {
        healthCheckUrl: "",
        healthCheckInterval: "15 minutes",
        alertThresholds: { responseTime: 5000, errorRate: 10, successRate: 90 },
      },
      securitySettings: {
        encryptionEnabled: true,
        tlsVersion: "1.2",
        certificateValidation: false,
        ipWhitelist: [],
        auditLogging: false,
        dataClassification: "internal",
      },
      compliance: ["HIPAA"],
      priority: "medium",
      department: "Finance",
      successRate: 94.5,
      uptime: 95.2,
      recordsSync: 23000,
      avgResponseTime: 1200,
      errorCount: 45,
      lastSync: new Date(Date.now() - 24 * 3600000).toISOString(),
      nextSync: null,
      canDelete: true,
      connectionLogs: [],
    },
    {
      id: 5,
      name: "Radiology PACS System",
      type: "Imaging",
      provider: "RadView Pro",
      status: "error",
      health: "critical",
      version: "4.1.0",
      endpoint: "https://pacs.radview.com/api",
      authentication: "Certificate",
      syncFrequency: "Manual",
      dataMapping: { study_id: "imagingStudyId", modality: "imagingModality" },
      configuration: { dicom_version: "3.0" },
      tags: ["imaging", "dicom", "critical"],
      maintainer: "Robert Taylor",
      maintainerEmail: "robert.taylor@hospital.com",
      businessRules: [],
      notifications: {
        onSuccess: true,
        onFailure: true,
        onWarning: true,
        recipients: ["radiology@hospital.com", "it@hospital.com"],
      },
      monitoring: {
        healthCheckUrl: "https://pacs.radview.com/health",
        healthCheckInterval: "2 minutes",
        alertThresholds: { responseTime: 1500, errorRate: 2, successRate: 98 },
      },
      securitySettings: {
        encryptionEnabled: true,
        tlsVersion: "1.3",
        certificateValidation: true,
        ipWhitelist: ["10.0.0.0/8"],
        auditLogging: true,
        dataClassification: "controlled",
      },
      compliance: ["HIPAA", "FDA"],
      priority: "critical",
      department: "IT Operations",
      successRate: 85.2,
      uptime: 92.1,
      recordsSync: 12500,
      avgResponseTime: 2100,
      errorCount: 128,
      lastSync: new Date(Date.now() - 48 * 3600000).toISOString(),
      nextSync: null,
      canDelete: false,
      connectionLogs: [],
    },
  ]);

  const integrationStats = computed(() => {
    const total = integrations.value.length;
    return {
      totalIntegrations: total,
      activeIntegrations: integrations.value.filter(
        (i) => i.status === "active"
      ).length,
      healthyIntegrations: integrations.value.filter(
        (i) => i.health === "healthy"
      ).length,
      warningIntegrations: integrations.value.filter(
        (i) => i.health === "warning"
      ).length,
      criticalIntegrations: integrations.value.filter(
        (i) => i.health === "critical"
      ).length,
      maintenanceIntegrations: integrations.value.filter(
        (i) => i.status === "maintenance"
      ).length,
      totalRecordsSync: integrations.value.reduce(
        (sum, i) => sum + (i.recordsSync || 0),
        0
      ),
      avgSuccessRate:
        total > 0
          ? (
              integrations.value.reduce(
                (sum, i) => sum + (i.successRate || 0),
                0
              ) / total
            ).toFixed(1)
          : "0.0",
      avgResponseTime:
        total > 0
          ? Math.round(
              integrations.value.reduce(
                (sum, i) => sum + (i.avgResponseTime || 0),
                0
              ) / total
            )
          : 0,
    };
  });

  // CRUD Operations
  const addIntegration = (integration) => {
    const newIntegration = {
      id: Date.now(),
      name: integration.name || "",
      type: integration.type || "EHR",
      provider: integration.provider || "",
      status: integration.status || "active",
      health: integration.health || "healthy",
      version: integration.version || "1.0.0",
      endpoint: integration.endpoint || "",
      authentication: integration.authentication || "OAuth2",
      syncFrequency: integration.syncFrequency || "1 hour",
      dataMapping: integration.dataMapping || {},
      configuration: integration.configuration || {},
      tags: integration.tags || [],
      maintainer: integration.maintainer || "",
      maintainerEmail: integration.maintainerEmail || "",
      businessRules: integration.businessRules || [],
      notifications: integration.notifications || {
        onSuccess: false,
        onFailure: true,
        onWarning: true,
        recipients: [],
      },
      monitoring: integration.monitoring || {
        healthCheckUrl: "",
        healthCheckInterval: "5 minutes",
        alertThresholds: { responseTime: 2000, errorRate: 5, successRate: 95 },
      },
      securitySettings: integration.securitySettings || {
        encryptionEnabled: true,
        tlsVersion: "1.3",
        certificateValidation: true,
        ipWhitelist: [],
        auditLogging: true,
        dataClassification: "confidential",
      },
      compliance: integration.compliance || [],
      priority: integration.priority || "medium",
      department: integration.department || "",
      successRate: integration.successRate || 100,
      uptime: integration.uptime || 100,
      recordsSync: integration.recordsSync || 0,
      avgResponseTime: integration.avgResponseTime || 0,
      errorCount: integration.errorCount || 0,
      lastSync: integration.lastSync || null,
      nextSync: new Date(Date.now() + 3600000).toISOString(),
      canDelete:
        typeof integration.canDelete !== "undefined"
          ? integration.canDelete
          : true,
      connectionLogs: integration.connectionLogs || [],
    };
    integrations.value.push(newIntegration);
  };

  const updateIntegration = (id, updates) => {
    const index = integrations.value.findIndex((i) => i.id === id);
    if (index !== -1) {
      integrations.value[index] = Object.assign(
        {},
        integrations.value[index],
        updates
      );
    }
  };

  const deleteIntegration = (id) => {
    const index = integrations.value.findIndex((i) => i.id === id);
    if (index !== -1) {
      integrations.value.splice(index, 1);
    }
  };

  const testConnection = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const integration = integrations.value.find((i) => i.id === id);
    const isHealthy = integration && integration.health !== "critical";
    return {
      success: isHealthy,
      message: isHealthy ? "Connection successful" : "Connection failed",
      responseTime: Math.floor(Math.random() * 1000) + 200,
      timestamp: new Date().toISOString(),
      details: {
        endpoint: integration ? integration.endpoint : "",
        authentication: integration ? integration.authentication : "",
        ssl: "Valid",
        version: integration ? integration.version : "",
        error: isHealthy ? null : "Connection timeout",
      },
    };
  };

  const syncNow = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const integration = integrations.value.find((i) => i.id === id);
    if (integration && integration.status === "active") {
      const recordsAdded = Math.floor(Math.random() * 100) + 50;
      integration.recordsSync = (integration.recordsSync || 0) + recordsAdded;
      integration.lastSync = new Date().toISOString();
      integration.nextSync = new Date(Date.now() + 3600000).toISOString();
      return { success: true, recordsAdded: recordsAdded };
    }
    return { success: false, recordsAdded: 0 };
  };

  const bulkOperation = (ids, action, value) => {
    const errors = [];
    let affectedCount = 0;
    ids.forEach((id) => {
      const integration = integrations.value.find((i) => i.id === id);
      if (integration) {
        try {
          if (action === "status") {
            integration.status = value;
          } else if (action === "priority") {
            integration.priority = value;
          } else if (action === "department") {
            integration.department = value;
          }
          affectedCount++;
        } catch (err) {
          errors.push("Failed to update integration " + id);
        }
      }
    });
    return { affectedCount: affectedCount, errors: errors };
  };

  const validateIntegration = (integration) => {
    const errors = [];
    if (!integration.name) {
      errors.push("Integration name is required");
    }
    if (!integration.provider) {
      errors.push("Provider is required");
    }
    if (!integration.endpoint) {
      errors.push("Endpoint URL is required");
    }
    if (
      !integration.maintainerEmail ||
      String(integration.maintainerEmail).indexOf("@") === -1
    ) {
      errors.push("Valid maintainer email is required");
    }
    return errors;
  };

  const exportIntegrations = (format) => {
    const data =
      format === "json"
        ? JSON.stringify(integrations.value, null, 2)
        : "CSV export not implemented";
    const blob = new Blob([data], {
      type: format === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "integrations-" + Date.now() + "." + format;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importIntegrations = (data, options) => {
    try {
      const parsed = JSON.parse(data);
      const imported = Array.isArray(parsed) ? parsed : [parsed];
      const results = { imported: 0, updated: 0, errors: [], warnings: [] };

      imported.forEach((item) => {
        const errs = validateIntegration(item);
        if (errs.length > 0) {
          results.errors = results.errors.concat(errs);
          return;
        }

        if (!options.validateOnly) {
          if (options.overwrite && item.id) {
            updateIntegration(item.id, item);
            results.updated++;
          } else {
            addIntegration(item);
            results.imported++;
          }
        }
      });

      return results;
    } catch (err) {
      return {
        imported: 0,
        updated: 0,
        errors: ["Invalid JSON format"],
        warnings: [],
      };
    }
  };

  const getIntegrationHealth = () => {
    return {
      overall: "healthy",
      details: integrations.value.map((i) => {
        return {
          id: i.id,
          name: i.name,
          health: i.health,
          uptime: i.uptime,
          lastCheck: i.lastSync,
        };
      }),
    };
  };

  const getRecentActivity = (days) => {
    return integrations.value
      .filter((i) => i.lastSync)
      .map((i) => {
        return {
          integration: i.name,
          action: "Sync",
          timestamp: i.lastSync,
          status: i.health === "healthy" ? "success" : "warning",
        };
      })
      .slice(0, 10);
  };

  const backupIntegrations = () => {
    exportIntegrations("json");
  };

  return {
    integrations,
    integrationStats,
    addIntegration,
    updateIntegration,
    deleteIntegration,
    testConnection,
    syncNow,
    bulkOperation,
    validateIntegration,
    exportIntegrations,
    importIntegrations,
    getIntegrationHealth,
    getRecentActivity,
    backupIntegrations,
  };
};

<!-- pages/admin/integrations.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useIntegrationsMock } from "~/composables/useIntegrationsMock";

// Composable: data + actions
const {
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
} = useIntegrationsMock();

// State management
const searchQuery = ref<string>("");
const filterType = ref<string>("all");
const filterStatus = ref<string>("all");
const filterHealth = ref<string>("all");
const filterPriority = ref<string>("all");
const showAddModal = ref<boolean>(false);
const showEditModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const showDetailModal = ref<boolean>(false);
const showTestModal = ref<boolean>(false);
const showBulkModal = ref<boolean>(false);
const showImportModal = ref<boolean>(false);
const showHealthModal = ref<boolean>(false);
const showActivityModal = ref<boolean>(false);
const selectedIntegration = ref<any | null>(null);
const integrationToDelete = ref<any | null>(null);
const selectedItems = ref<number[]>([]);
const testResults = ref<any | null>(null);
const isSubmitting = ref<boolean>(false);
const viewMode = ref<"cards" | "list">("cards");
const validationErrors = ref<string[]>([]);

// Form data
const integrationForm = ref<any>({
  id: null,
  name: "",
  type: "EHR",
  provider: "",
  status: "active",
  health: "healthy",
  version: "",
  endpoint: "",
  authentication: "OAuth2",
  syncFrequency: "1 hour",
  dataMapping: {},
  configuration: {},
  tags: [],
  maintainer: "",
  maintainerEmail: "",
  businessRules: [],
  notifications: {
    onSuccess: false,
    onFailure: true,
    onWarning: true,
    recipients: [],
  },
  monitoring: {
    healthCheckUrl: "",
    healthCheckInterval: "5 minutes",
    alertThresholds: {
      responseTime: 2000,
      errorRate: 5,
      successRate: 95,
    },
  },
  securitySettings: {
    encryptionEnabled: true,
    tlsVersion: "1.3",
    certificateValidation: true,
    ipWhitelist: [],
    auditLogging: true,
    dataClassification: "confidential",
  },
  compliance: [],
  priority: "medium",
  department: "",
});

const importForm = ref<{
  data: string;
  format: "json" | "csv";
  overwrite: boolean;
  validateOnly: boolean;
}>({
  data: "",
  format: "json",
  overwrite: false,
  validateOnly: false,
});

const bulkAction = ref<"status" | "priority" | "department" | "">("");
const bulkValue = ref<string>("");
const importResults = ref<any | null>(null);

// Temporary inputs for arrays
const newTag = ref<string>("");
const newRecipient = ref<string>("");
const newBusinessRule = ref<{
  name: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  enabled: boolean;
}>({
  name: "",
  description: "",
  priority: "medium",
  enabled: true,
});
const newDataMapping = ref<{ key: string; value: string }>({
  key: "",
  value: "",
});
const newConfigItem = ref<{ key: string; value: string }>({
  key: "",
  value: "",
});
const newComplianceStandard = ref<string>("");
const newIpAddress = ref<string>("");

// Options
const integrationTypes = [
  "EHR",
  "Laboratory",
  "Pharmacy",
  "Insurance",
  "Imaging",
  "Billing",
  "Scheduling",
  "Telemedicine",
];

const statusOptions = [
  {
    value: "active",
    label: "Active",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: "✅",
  },
  {
    value: "inactive",
    label: "Inactive",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: "⏸️",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: "🔧",
  },
  {
    value: "error",
    label: "Error",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: "❌",
  },
];

const healthOptions = [
  {
    value: "healthy",
    label: "Healthy",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: "💚",
  },
  {
    value: "warning",
    label: "Warning",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: "⚠️",
  },
  {
    value: "critical",
    label: "Critical",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: "🔴",
  },
];

const priorityOptions = [
  {
    value: "low",
    label: "Low",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    value: "medium",
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "high",
    label: "High",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    value: "critical",
    label: "Critical",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
];

const authTypes = [
  "OAuth2",
  "API Key",
  "Basic Auth",
  "Token Bearer",
  "Mutual TLS",
  "JWT",
  "Certificate",
];
const syncFrequencies = [
  "5 minutes",
  "15 minutes",
  "30 minutes",
  "1 hour",
  "2 hours",
  "4 hours",
  "8 hours",
  "12 hours",
  "24 hours",
  "Manual",
];
const tlsVersions = ["1.0", "1.1", "1.2", "1.3"];
const dataClassifications = [
  "public",
  "internal",
  "confidential",
  "restricted",
  "controlled",
];
const complianceStandards = [
  "HIPAA",
  "GDPR",
  "SOC2",
  "ISO27001",
  "PCI-DSS",
  "HITECH",
  "DEA",
  "FDA",
  "CLIA",
];
const departments = [
  "Clinical Operations",
  "Laboratory Services",
  "Pharmacy Services",
  "Finance",
  "IT Operations",
];
const intervalOptions = [
  "1 minute",
  "2 minutes",
  "5 minutes",
  "10 minutes",
  "15 minutes",
  "30 minutes",
  "1 hour",
];

// Computed
const filteredIntegrations = computed(() => {
  let filtered = integrations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (i: any) =>
        i.name.toLowerCase().includes(query) ||
        i.provider.toLowerCase().includes(query) ||
        i.type.toLowerCase().includes(query) ||
        i.maintainer.toLowerCase().includes(query) ||
        (i.department && i.department.toLowerCase().includes(query)) ||
        (i.tags &&
          i.tags.some((tag: string) => tag.toLowerCase().includes(query)))
    );
  }

  if (filterType.value !== "all")
    filtered = filtered.filter((i: any) => i.type === filterType.value);
  if (filterStatus.value !== "all")
    filtered = filtered.filter((i: any) => i.status === filterStatus.value);
  if (filterHealth.value !== "all")
    filtered = filtered.filter((i: any) => i.health === filterHealth.value);
  if (filterPriority.value !== "all")
    filtered = filtered.filter((i: any) => i.priority === filterPriority.value);

  return filtered.sort((a: any, b: any) => {
    const priorityOrder: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;
    return a.name.localeCompare(b.name);
  });
});

const recentActivity = computed(() => getRecentActivity(7));
const integrationHealth = computed(() => getIntegrationHealth());

// Helpers
const getStatusInfo = (status: string) =>
  statusOptions.find((s) => s.value === status) || statusOptions[0];
const getHealthInfo = (health: string) =>
  healthOptions.find((h) => h.value === health) || healthOptions[0];
const getPriorityInfo = (priority: string) =>
  priorityOptions.find((p) => p.value === priority) || priorityOptions[1];

const formatTimestamp = (timestamp?: string | null) => {
  if (!timestamp) return "Never";
  return new Date(timestamp).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRelativeTime = (timestamp?: string | null) => {
  if (!timestamp) return "Never";
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = +now - +time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatTimestamp(timestamp).split(",")[0];
};

// Modals
const openAddModal = () => {
  resetForm();
  validationErrors.value = [];
  showAddModal.value = true;
};

const openEditModal = (integration: any) => {
  integrationForm.value = {
    ...integration,
    tags: [...(integration.tags || [])],
    businessRules: [...(integration.businessRules || [])],
    notifications: {
      ...integration.notifications,
      recipients: [...(integration.notifications?.recipients || [])],
    },
    monitoring: { ...(integration.monitoring || {}) },
    securitySettings: {
      ...(integration.securitySettings || {}),
      ipWhitelist: [...(integration.securitySettings?.ipWhitelist || [])],
    },
    compliance: [...(integration.compliance || [])],
    dataMapping: { ...(integration.dataMapping || {}) },
    configuration: { ...(integration.configuration || {}) },
  };
  selectedIntegration.value = integration;
  validationErrors.value = [];
  showEditModal.value = true;
};

const openDeleteModal = (integration: any) => {
  integrationToDelete.value = integration;
  showDeleteModal.value = true;
};

const openDetailModal = (integration: any) => {
  selectedIntegration.value = integration;
  showDetailModal.value = true;
};

const openTestModal = (integration: any) => {
  selectedIntegration.value = integration;
  testResults.value = null;
  showTestModal.value = true;
};

const openBulkModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select integrations to perform bulk operations");
    return;
  }
  bulkAction.value = "";
  bulkValue.value = "";
  showBulkModal.value = true;
};

const openImportModal = () => {
  importForm.value = {
    data: "",
    format: "json",
    overwrite: false,
    validateOnly: false,
  };
  importResults.value = null;
  showImportModal.value = true;
};

const openHealthModal = () => {
  showHealthModal.value = true;
};

const openActivityModal = () => {
  showActivityModal.value = true;
};

// Reset form
const resetForm = () => {
  integrationForm.value = {
    id: null,
    name: "",
    type: "EHR",
    provider: "",
    status: "active",
    health: "healthy",
    version: "",
    endpoint: "",
    authentication: "OAuth2",
    syncFrequency: "1 hour",
    dataMapping: {},
    configuration: {},
    tags: [],
    maintainer: "",
    maintainerEmail: "",
    businessRules: [],
    notifications: {
      onSuccess: false,
      onFailure: true,
      onWarning: true,
      recipients: [],
    },
    monitoring: {
      healthCheckUrl: "",
      healthCheckInterval: "5 minutes",
      alertThresholds: {
        responseTime: 2000,
        errorRate: 5,
        successRate: 95,
      },
    },
    securitySettings: {
      encryptionEnabled: true,
      tlsVersion: "1.3",
      certificateValidation: true,
      ipWhitelist: [],
      auditLogging: true,
      dataClassification: "confidential",
    },
    compliance: [],
    priority: "medium",
    department: "",
  };

  // Temporary inputs
  newTag.value = "";
  newRecipient.value = "";
  newBusinessRule.value = {
    name: "",
    description: "",
    priority: "medium",
    enabled: true,
  };
  newDataMapping.value = { key: "", value: "" };
  newConfigItem.value = { key: "", value: "" };
  newComplianceStandard.value = "";
  newIpAddress.value = "";
};

// Arrays
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !integrationForm.value.tags.includes(tag)) {
    integrationForm.value.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index: number) => {
  integrationForm.value.tags.splice(index, 1);
};

const addRecipient = () => {
  const recipient = newRecipient.value.trim();
  if (
    recipient &&
    !integrationForm.value.notifications.recipients.includes(recipient)
  ) {
    integrationForm.value.notifications.recipients.push(recipient);
    newRecipient.value = "";
  }
};

const removeRecipient = (index: number) => {
  integrationForm.value.notifications.recipients.splice(index, 1);
};

const addBusinessRule = () => {
  if (newBusinessRule.value.name && newBusinessRule.value.description) {
    integrationForm.value.businessRules.push({
      ...newBusinessRule.value,
      id: Date.now(),
    });
    newBusinessRule.value = {
      name: "",
      description: "",
      priority: "medium",
      enabled: true,
    };
  }
};

const removeBusinessRule = (index: number) => {
  integrationForm.value.businessRules.splice(index, 1);
};

const addDataMapping = () => {
  if (newDataMapping.value.key && newDataMapping.value.value) {
    integrationForm.value.dataMapping[newDataMapping.value.key] =
      newDataMapping.value.value;
    newDataMapping.value = { key: "", value: "" };
  }
};

const removeDataMapping = (key: string) => {
  delete integrationForm.value.dataMapping[key];
};

const addConfigItem = () => {
  if (newConfigItem.value.key && newConfigItem.value.value) {
    integrationForm.value.configuration[newConfigItem.value.key] =
      newConfigItem.value.value;
    newConfigItem.value = { key: "", value: "" };
  }
};

const removeConfigItem = (key: string) => {
  delete integrationForm.value.configuration[key];
};

const addCompliance = () => {
  const standard = newComplianceStandard.value;
  if (standard && !integrationForm.value.compliance.includes(standard)) {
    integrationForm.value.compliance.push(standard);
    newComplianceStandard.value = "";
  }
};

const removeCompliance = (index: number) => {
  integrationForm.value.compliance.splice(index, 1);
};

const addIpAddress = () => {
  const ip = newIpAddress.value.trim();
  if (ip && !integrationForm.value.securitySettings.ipWhitelist.includes(ip)) {
    integrationForm.value.securitySettings.ipWhitelist.push(ip);
    newIpAddress.value = "";
  }
};

const removeIpAddress = (index: number) => {
  integrationForm.value.securitySettings.ipWhitelist.splice(index, 1);
};

// CRUD / actions
const saveIntegration = async () => {
  try {
    isSubmitting.value = true;
    validationErrors.value = [];
    const errors = validateIntegration(integrationForm.value);
    if (errors.length > 0) {
      validationErrors.value = errors;
      return;
    }

    const integrationData = { ...integrationForm.value };

    if (integrationForm.value.id) {
      updateIntegration(integrationForm.value.id as number, integrationData);
      alert("Integration updated successfully!");
    } else {
      addIntegration(integrationData);
      alert("Integration created successfully!");
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error: any) {
    console.error("Error saving integration:", error);
    alert(`Error saving integration: ${error?.message || "Unknown error"}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    if (!integrationToDelete.value) return;
    deleteIntegration(integrationToDelete.value.id as number);
    showDeleteModal.value = false;
    integrationToDelete.value = null;
    alert("Integration deleted successfully!");
  } catch (error: any) {
    console.error("Error deleting integration:", error);
    alert(`Error deleting integration: ${error?.message || "Unknown error"}`);
  }
};

const handleTest = async () => {
  try {
    if (!selectedIntegration.value) return;
    testResults.value = { loading: true };
    const result = await testConnection(selectedIntegration.value.id as number);
    testResults.value = result;
  } catch (error: any) {
    testResults.value = {
      success: false,
      message: "Test failed",
      error: error?.message || "Unknown error",
    };
  }
};

const handleSync = async (integration: any) => {
  try {
    const result = await syncNow(integration.id as number);
    if (result.success) {
      alert(
        `Sync completed successfully! Added ${result.recordsAdded} records.`
      );
    } else {
      alert("Sync failed. Please check the integration logs.");
    }
  } catch {
    alert("Sync failed. Please try again.");
  }
};

const handleBulkAction = async () => {
  try {
    const result = bulkOperation(
      selectedItems.value,
      bulkAction.value,
      bulkValue.value
    );
    if (result.errors.length > 0) {
      alert(
        `Bulk operation completed with errors:\n${result.errors.join("\n")}`
      );
    } else {
      alert(`Successfully processed ${result.affectedCount} integrations`);
    }
    selectedItems.value = [];
    showBulkModal.value = false;
  } catch (error: any) {
    console.error("Error performing bulk action:", error);
    alert(`Error: ${error?.message || "Unknown error"}`);
  }
};

const handleImport = async () => {
  try {
    if (!importForm.value.data.trim()) {
      alert("Please provide data to import");
      return;
    }
    const results = importIntegrations(importForm.value.data, {
      overwrite: importForm.value.overwrite,
      validateOnly: importForm.value.validateOnly,
    });
    importResults.value = results;
    if (!importForm.value.validateOnly) {
      const message = `Import completed:\n- Imported: ${results.imported}\n- Updated: ${results.updated}\n- Errors: ${results.errors.length}\n- Warnings: ${results.warnings.length}`;
      alert(message);
    }
  } catch (error: any) {
    console.error("Import error:", error);
    alert(`Import failed: ${error?.message || "Unknown error"}`);
  }
};

const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    importForm.value.data = String(e.target?.result || "");
    importForm.value.format = file.name.endsWith(".csv") ? "csv" : "json";
  };
  reader.readAsText(file);
};

const toggleItemSelection = (itemId: number) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) selectedItems.value.splice(index, 1);
  else selectedItems.value.push(itemId);
};

const selectAllItems = () => {
  if (selectedItems.value.length === filteredIntegrations.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredIntegrations.value.map(
      (integration: any) => integration.id as number
    );
  }
};

const duplicateIntegration = (integration: any) => {
  const duplicate = {
    ...integration,
    id: null,
    name: `${integration.name} (Copy)`,
    tags: [...(integration.tags || [])],
    businessRules: [...(integration.businessRules || [])],
    notifications: {
      ...integration.notifications,
      recipients: [...(integration.notifications?.recipients || [])],
    },
    monitoring: { ...(integration.monitoring || {}) },
    securitySettings: {
      ...(integration.securitySettings || {}),
      ipWhitelist: [...(integration.securitySettings?.ipWhitelist || [])],
    },
    compliance: [...(integration.compliance || [])],
    dataMapping: { ...(integration.dataMapping || {}) },
    configuration: { ...(integration.configuration || {}) },
  };
  integrationForm.value = duplicate;
  validationErrors.value = [];
  showAddModal.value = true;
};

const clearFilters = () => {
  searchQuery.value = "";
  filterType.value = "all";
  filterStatus.value = "all";
  filterHealth.value = "all";
  filterPriority.value = "all";
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          System Integrations
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage third-party system integrations and data synchronization
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openHealthModal"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
          💚 Health
        </button>
        <button
          @click="openActivityModal"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
          📊 Activity
        </button>
        <button
          @click="backupIntegrations"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
          💾 Backup
        </button>
        <button
          @click="openImportModal"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
          📥 Import
        </button>
        <button
          @click="exportIntegrations('json')"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
          📤 Export
        </button>
        <button
          @click="openBulkModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50">
          🔧 Bulk ({{ selectedItems.length }})
        </button>
        <div
          class="flex rounded-lg border border-gray-300 dark:border-gray-700 p-1">
          <button
            @click="viewMode = 'cards'"
            :class="
              viewMode === 'cards'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            ⊞ Cards
          </button>
          <button
            @click="viewMode = 'list'"
            :class="
              viewMode === 'list'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            ☰ List
          </button>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          🔗 Add Integration
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Total</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ integrationStats.totalIntegrations }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">🔗</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Active</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ integrationStats.activeIntegrations }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">✅</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Healthy</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ integrationStats.healthyIntegrations }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">💚</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Records Synced
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ integrationStats.totalRecordsSync.toLocaleString() }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">📊</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Success Rate
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ integrationStats.avgSuccessRate }}%
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">📈</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Avg Response
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ integrationStats.avgResponseTime }}ms
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="text-red-600 dark:text-red-400">⚡</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div class="relative md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search integrations..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Types</option>
          <option v-for="type in integrationTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Status</option>
          <option
            v-for="status in statusOptions"
            :key="status.value"
            :value="status.value">
            {{ status.icon }} {{ status.label }}
          </option>
        </select>

        <select
          v-model="filterHealth"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Health</option>
          <option
            v-for="health in healthOptions"
            :key="health.value"
            :value="health.value">
            {{ health.icon }} {{ health.label }}
          </option>
        </select>

        <select
          v-model="filterPriority"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Priority</option>
          <option
            v-for="priority in priorityOptions"
            :key="priority.value"
            :value="priority.value">
            {{ priority.label }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="
                selectedItems.length === filteredIntegrations.length &&
                filteredIntegrations.length > 0
              "
              @change="selectAllItems"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span class="text-gray-700 dark:text-gray-300"
              >Select All ({{ filteredIntegrations.length }})</span
            >
          </label>

          <button
            v-if="
              searchQuery ||
              filterType !== 'all' ||
              filterStatus !== 'all' ||
              filterHealth !== 'all' ||
              filterPriority !== 'all'
            "
            @click="clearFilters"
            class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            ✕ Clear Filters
          </button>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ filteredIntegrations.length }} of
          {{ integrationStats.totalIntegrations }} integrations
        </div>
      </div>
    </div>

    <!-- Quick Status Bar -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >{{ integrationStats.healthyIntegrations }} Healthy</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >{{ integrationStats.warningIntegrations }} Warning</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-red-500 rounded-full"></span>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >{{ integrationStats.criticalIntegrations }} Critical</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >{{ integrationStats.maintenanceIntegrations }} Maintenance</span
            >
          </div>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {{ new Date().toLocaleTimeString() }}
        </div>
      </div>
    </div>

    <!-- Cards View -->
    <div
      v-if="viewMode === 'cards'"
      class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="integration in filteredIntegrations"
        :key="integration.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200 group">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="selectedItems.includes(integration.id)"
                @change="toggleItemSelection(integration.id)"
                class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD] mt-1" />
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ integration.name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ integration.provider }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="getStatusInfo(integration.status).color"
                class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusInfo(integration.status).icon }}
              </span>
              <span
                :class="getHealthInfo(integration.health).color"
                class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getHealthInfo(integration.health).icon }}
              </span>
              <span
                :class="getPriorityInfo(integration.priority).color"
                class="px-2 py-1 text-xs font-medium rounded-full">
                {{ integration.priority }}
              </span>
            </div>
          </div>

          <!-- Type & Version -->
          <div class="flex items-center gap-4 mb-4">
            <span
              class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded"
              >{{ integration.type }}</span
            >
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >v{{ integration.version }}</span
            >
            <span
              v-if="integration.department"
              class="text-xs text-gray-500 dark:text-gray-400"
              >{{ integration.department }}</span
            >
          </div>

          <!-- Metrics -->
          <div class="grid grid-cols-2 gap-3 text-sm mb-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Success Rate:</span
              ><span class="text-gray-900 dark:text-white font-medium"
                >{{ integration.successRate }}%</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Uptime:</span
              ><span class="text-gray-900 dark:text-white font-medium"
                >{{ integration.uptime }}%</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Records:</span
              ><span class="text-gray-900 dark:text-white font-medium">{{
                integration.recordsSync.toLocaleString()
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Response:</span
              ><span class="text-gray-900 dark:text-white font-medium"
                >{{ integration.avgResponseTime }}ms</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Errors:</span
              ><span class="text-gray-900 dark:text-white font-medium">{{
                integration.errorCount
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Frequency:</span
              ><span class="text-gray-900 dark:text-white font-medium">{{
                integration.syncFrequency
              }}</span>
            </div>
          </div>

          <!-- Last Sync -->
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">
            <p>Last sync: {{ getRelativeTime(integration.lastSync) }}</p>
            <p>Next sync: {{ getRelativeTime(integration.nextSync) }}</p>
          </div>

          <!-- Compliance -->
          <div
            v-if="integration.compliance && integration.compliance.length > 0"
            class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="standard in integration.compliance.slice(0, 3)"
              :key="standard"
              class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded"
              >✓ {{ standard }}</span
            >
            <span
              v-if="integration.compliance.length > 3"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
              >+{{ integration.compliance.length - 3 }}</span
            >
          </div>

          <!-- Tags -->
          <div
            v-if="integration.tags && integration.tags.length > 0"
            class="flex flex-wrap gap-1 mb-4">
            <span
              v-for="tag in integration.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
              >{{ tag }}</span
            >
            <span
              v-if="integration.tags.length > 3"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
              >+{{ integration.tags.length - 3 }}</span
            >
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="openDetailModal(integration)"
              class="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              👁️ Details
            </button>
            <button
              @click="openTestModal(integration)"
              class="px-3 py-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
              🧪 Test
            </button>
            <button
              @click="handleSync(integration)"
              :disabled="integration.status !== 'active'"
              class="px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50">
              🔄 Sync
            </button>
            <button
              @click="duplicateIntegration(integration)"
              class="px-3 py-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
              📋 Clone
            </button>
          </div>

          <!-- Edit/Delete -->
          <div class="flex gap-2 mt-2">
            <button
              @click="openEditModal(integration)"
              class="flex-1 px-3 py-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
              ✏️ Edit
            </button>
            <button
              v-if="integration.canDelete"
              @click="openDeleteModal(integration)"
              class="flex-1 px-3 py-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div
      v-else
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">
          All Integrations
        </h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="integration in filteredIntegrations"
          :key="integration.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-start gap-4">
            <input
              type="checkbox"
              :checked="selectedItems.includes(integration.id)"
              @change="toggleItemSelection(integration.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD] mt-1" />

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-4">
                  <div>
                    <h3
                      class="text-base font-semibold text-gray-900 dark:text-white">
                      {{ integration.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ integration.provider }} • {{ integration.type }}
                      {{
                        integration.department
                          ? "• " + integration.department
                          : ""
                      }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      :class="getStatusInfo(integration.status).color"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      >{{ getStatusInfo(integration.status).label }}</span
                    >
                    <span
                      :class="getHealthInfo(integration.health).color"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      >{{ getHealthInfo(integration.health).label }}</span
                    >
                    <span
                      :class="getPriorityInfo(integration.priority).color"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      >{{ integration.priority }}</span
                    >
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ integration.successRate }}% • {{ integration.uptime }}%
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Success • Uptime
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span
                  >📊
                  {{ integration.recordsSync.toLocaleString() }} records</span
                >
                <span>⚡ {{ integration.avgResponseTime }}ms</span>
                <span>🔄 {{ integration.syncFrequency }}</span>
                <span>⚠️ {{ integration.errorCount }} errors</span>
                <span>👤 {{ integration.maintainer }}</span>
                <span class="text-xs">v{{ integration.version }}</span>
              </div>

              <!-- Compliance -->
              <div
                v-if="
                  integration.compliance && integration.compliance.length > 0
                "
                class="flex flex-wrap gap-1 mb-2">
                <span
                  v-for="standard in integration.compliance.slice(0, 5)"
                  :key="standard"
                  class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded"
                  >✓ {{ standard }}</span
                >
                <span
                  v-if="integration.compliance.length > 5"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
                  >+{{ integration.compliance.length - 5 }}</span
                >
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <span
                    >Last sync:
                    {{ getRelativeTime(integration.lastSync) }}</span
                  >
                  <span class="ml-4"
                    >Next: {{ getRelativeTime(integration.nextSync) }}</span
                  >
                </div>

                <div class="flex items-center gap-2">
                  <button
                    @click="openDetailModal(integration)"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details">
                    👁️
                  </button>
                  <button
                    @click="openTestModal(integration)"
                    class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Test Connection">
                    🧪
                  </button>
                  <button
                    @click="handleSync(integration)"
                    :disabled="integration.status !== 'active'"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                    title="Sync Now">
                    🔄
                  </button>
                  <button
                    @click="duplicateIntegration(integration)"
                    class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    title="Clone">
                    📋
                  </button>
                  <button
                    @click="openEditModal(integration)"
                    class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                    title="Edit">
                    ✏️
                  </button>
                  <button
                    v-if="integration.canDelete"
                    @click="openDeleteModal(integration)"
                    class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredIntegrations.length === 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <div class="text-6xl mb-4">🔗</div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No integrations found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or add your first integration.
      </p>
      <div class="flex items-center justify-center gap-3">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          Clear Filters
        </button>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
          Add Integration
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ showEditModal ? "Edit Integration" : "Add New Integration" }}
              </h3>
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = false;
                  resetForm();
                "
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="saveIntegration" class="p-6 space-y-8">
            <!-- Validation -->
            <div
              v-if="validationErrors.length > 0"
              class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4
                class="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                Please fix the following errors:
              </h4>
              <ul class="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li v-for="error in validationErrors" :key="error">
                  • {{ error }}
                </li>
              </ul>
            </div>

            <!-- Basic Information -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📝 Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Integration Name *</label
                  >
                  <input
                    v-model="integrationForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Provider *</label
                  >
                  <input
                    v-model="integrationForm.provider"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Type</label
                  >
                  <select
                    v-model="integrationForm.type"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in integrationTypes"
                      :key="type"
                      :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Version</label
                  >
                  <input
                    v-model="integrationForm.version"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Priority</label
                  >
                  <select
                    v-model="integrationForm.priority"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="priority in priorityOptions"
                      :key="priority.value"
                      :value="priority.value">
                      {{ priority.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Department</label
                  >
                  <select
                    v-model="integrationForm.department"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Department</option>
                    <option
                      v-for="dept in departments"
                      :key="dept"
                      :value="dept">
                      {{ dept }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Connection Details -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔗 Connection Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Endpoint URL *</label
                  >
                  <input
                    v-model="integrationForm.endpoint"
                    type="url"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Authentication Type</label
                  >
                  <select
                    v-model="integrationForm.authentication"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option v-for="auth in authTypes" :key="auth" :value="auth">
                      {{ auth }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Sync Frequency</label
                  >
                  <select
                    v-model="integrationForm.syncFrequency"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="freq in syncFrequencies"
                      :key="freq"
                      :value="freq">
                      {{ freq }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Maintainer -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                👤 Maintainer Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Maintainer Name</label
                  >
                  <input
                    v-model="integrationForm.maintainer"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Maintainer Email</label
                  >
                  <input
                    v-model="integrationForm.maintainerEmail"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Data Mapping -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🗂️ Data Mapping
              </h4>
              <div class="space-y-4">
                <div class="grid grid-cols-12 gap-2 items-end">
                  <div class="col-span-5">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Source Field</label
                    >
                    <input
                      v-model="newDataMapping.key"
                      type="text"
                      placeholder="Source field name"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-5">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Target Field</label
                    >
                    <input
                      v-model="newDataMapping.value"
                      type="text"
                      placeholder="Target field name"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-2">
                    <button
                      type="button"
                      @click="addDataMapping"
                      class="w-full px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                      Add
                    </button>
                  </div>
                </div>

                <div
                  v-if="Object.keys(integrationForm.dataMapping).length > 0"
                  class="space-y-2">
                  <div
                    v-for="(value, key) in integrationForm.dataMapping"
                    :key="key"
                    class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div class="flex-1 text-sm">
                      <span class="font-medium">{{ key }}</span>
                      <span class="text-gray-500 mx-2">→</span>
                      <span class="text-blue-600 dark:text-blue-400">{{
                        value
                      }}</span>
                    </div>
                    <button
                      type="button"
                      @click="removeDataMapping(String(key))"
                      class="text-red-600 dark:text-red-400 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚙️ Configuration
              </h4>
              <div class="space-y-4">
                <div class="grid grid-cols-12 gap-2 items-end">
                  <div class="col-span-5">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Config Key</label
                    >
                    <input
                      v-model="newConfigItem.key"
                      type="text"
                      placeholder="e.g. timeout"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-5">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Config Value</label
                    >
                    <input
                      v-model="newConfigItem.value"
                      type="text"
                      placeholder="e.g. 30000"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-2">
                    <button
                      type="button"
                      @click="addConfigItem"
                      class="w-full px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                      Add
                    </button>
                  </div>
                </div>

                <div
                  v-if="Object.keys(integrationForm.configuration).length > 0"
                  class="space-y-2">
                  <div
                    v-for="(value, key) in integrationForm.configuration"
                    :key="key"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex-1 text-sm">
                      <span class="font-medium">{{ key }}</span>
                      <span class="text-gray-500 mx-2">=</span>
                      <span class="text-gray-700 dark:text-gray-300">{{
                        value
                      }}</span>
                    </div>
                    <button
                      type="button"
                      @click="removeConfigItem(String(key))"
                      class="text-red-600 dark:text-red-400 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔔 Notifications
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <input
                    type="checkbox"
                    v-model="integrationForm.notifications.onSuccess"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Notify on success</span
                  >
                </label>
                <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <input
                    type="checkbox"
                    v-model="integrationForm.notifications.onWarning"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Notify on warning</span
                  >
                </label>
                <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:col-span-2">
                  <input
                    type="checkbox"
                    v-model="integrationForm.notifications.onFailure"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Notify on failure</span
                  >
                </label>
              </div>

              <div class="mt-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Recipients</label
                >
                <div class="grid grid-cols-12 gap-2 items-end">
                  <div class="col-span-10">
                    <input
                      v-model="newRecipient"
                      type="email"
                      placeholder="email@example.com"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-2">
                    <button
                      type="button"
                      @click="addRecipient"
                      class="w-full px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                      Add
                    </button>
                  </div>
                </div>

                <div
                  v-if="integrationForm.notifications.recipients.length > 0"
                  class="flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="(rcp, idx) in integrationForm.notifications
                      .recipients"
                    :key="rcp + idx"
                    class="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">
                    {{ rcp }}
                    <button
                      type="button"
                      @click="removeRecipient(idx)"
                      class="text-red-600 hover:text-red-800">
                      ✕
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Monitoring -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🩺 Monitoring
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Health Check URL</label
                  >
                  <input
                    v-model="integrationForm.monitoring.healthCheckUrl"
                    type="url"
                    placeholder="https://example.com/health"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Health Check Interval</label
                  >
                  <select
                    v-model="integrationForm.monitoring.healthCheckInterval"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="opt in intervalOptions"
                      :key="opt"
                      :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Max Response (ms)</label
                    >
                    <input
                      v-model.number="
                        integrationForm.monitoring.alertThresholds.responseTime
                      "
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Max Error Rate (%)</label
                    >
                    <input
                      v-model.number="
                        integrationForm.monitoring.alertThresholds.errorRate
                      "
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Min Success Rate (%)</label
                    >
                    <input
                      v-model.number="
                        integrationForm.monitoring.alertThresholds.successRate
                      "
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Settings -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔒 Security
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <input
                    type="checkbox"
                    v-model="integrationForm.securitySettings.encryptionEnabled"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Encryption enabled</span
                  >
                </label>

                <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <input
                    type="checkbox"
                    v-model="
                      integrationForm.securitySettings.certificateValidation
                    "
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Certificate validation</span
                  >
                </label>

                <label
                  class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <input
                    type="checkbox"
                    v-model="integrationForm.securitySettings.auditLogging"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Audit logging</span
                  >
                </label>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >TLS Version</label
                  >
                  <select
                    v-model="integrationForm.securitySettings.tlsVersion"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option v-for="v in tlsVersions" :key="v" :value="v">
                      {{ v }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Data Classification</label
                  >
                  <select
                    v-model="
                      integrationForm.securitySettings.dataClassification
                    "
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option
                      v-for="c in dataClassifications"
                      :key="c"
                      :value="c">
                      {{ c }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="mt-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >IP Whitelist</label
                >
                <div class="grid grid-cols-12 gap-2 items-end">
                  <div class="col-span-10">
                    <input
                      v-model="newIpAddress"
                      type="text"
                      placeholder="e.g. 192.168.1.0/24"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-2">
                    <button
                      type="button"
                      @click="addIpAddress"
                      class="w-full px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                      Add
                    </button>
                  </div>
                </div>

                <div
                  v-if="integrationForm.securitySettings.ipWhitelist.length > 0"
                  class="flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="(ip, idx) in integrationForm.securitySettings
                      .ipWhitelist"
                    :key="ip + idx"
                    class="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">
                    {{ ip }}
                    <button
                      type="button"
                      @click="removeIpAddress(idx)"
                      class="text-red-600 hover:text-red-800">
                      ✕
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Compliance -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📜 Compliance
              </h4>
              <div class="grid grid-cols-12 gap-2 items-end">
                <div class="col-span-10">
                  <select
                    v-model="newComplianceStandard"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm">
                    <option value="">Select standard</option>
                    <option
                      v-for="std in complianceStandards"
                      :key="std"
                      :value="std">
                      {{ std }}
                    </option>
                  </select>
                </div>
                <div class="col-span-2">
                  <button
                    type="button"
                    @click="addCompliance"
                    class="w-full px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
              </div>

              <div
                v-if="integrationForm.compliance.length > 0"
                class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="(std, idx) in integrationForm.compliance"
                  :key="std + idx"
                  class="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs">
                  ✓ {{ std }}
                  <button
                    type="button"
                    @click="removeCompliance(idx)"
                    class="text-red-600 hover:text-red-800">
                    ✕
                  </button>
                </span>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <h4
                class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🏷️ Tags
              </h4>
              <div class="grid grid-cols-12 gap-2 items-end">
                <div class="col-span-10">
                  <input
                    v-model="newTag"
                    type="text"
                    placeholder="Add a tag"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                </div>
                <div class="col-span-2">
                  <button
                    type="button"
                    @click="addTag"
                    class="w-full px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
              </div>

              <div
                v-if="integrationForm.tags.length > 0"
                class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="(tag, idx) in integrationForm.tags"
                  :key="tag + idx"
                  class="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">
                  #{{ tag }}
                  <button
                    type="button"
                    @click="removeTag(idx)"
                    class="text-red-600 hover:text-red-800">
                    ✕
                  </button>
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = false;
                  resetForm();
                "
                class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-5 py-2.5 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity disabled:opacity-50">
                {{
                  isSubmitting
                    ? "Saving..."
                    : showEditModal
                    ? "Save Changes"
                    : "Create Integration"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Integration
            </h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Are you sure to delete "<span class="font-medium">{{
                integrationToDelete?.name
              }}</span
              >"? This action cannot be undone.
            </p>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="
                showDeleteModal = false;
                integrationToDelete = null;
              "
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Test Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showTestModal"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg">
          <div
            class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Test Connection
            </h3>
            <button
              @click="
                showTestModal = false;
                testResults = null;
              "
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="text-sm text-gray-600 dark:text-gray-300">
              Target:
              <span class="font-medium">{{ selectedIntegration?.name }}</span>
            </div>

            <div
              v-if="!testResults || testResults.loading"
              class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{
                  testResults?.loading
                    ? "Testing connection..."
                    : 'Click "Run Test" to start.'
                }}
              </p>
            </div>

            <div
              v-else
              class="p-4 rounded-lg"
              :class="
                testResults.success
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              ">
              <div class="flex items-center justify-between">
                <p
                  class="text-sm font-medium"
                  :class="
                    testResults.success
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  ">
                  {{
                    testResults.success
                      ? "Connection successful"
                      : "Connection failed"
                  }}
                </p>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{
                  new Date(testResults.timestamp).toLocaleString()
                }}</span>
              </div>
              <div
                class="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>Message: {{ testResults.message }}</p>
                <p v-if="testResults.responseTime">
                  Response time: {{ testResults.responseTime }} ms
                </p>
                <p v-if="testResults.details?.endpoint">
                  Endpoint: {{ testResults.details.endpoint }}
                </p>
                <p v-if="testResults.details?.authentication">
                  Auth: {{ testResults.details.authentication }}
                </p>
                <p v-if="testResults.details?.version">
                  Version: {{ testResults.details.version }}
                </p>
                <p v-if="testResults.details?.error">
                  Error: {{ testResults.details.error }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="
                showTestModal = false;
                testResults = null;
              "
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Close
            </button>
            <button
              @click="handleTest"
              class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95">
              Run Test
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bulk Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showBulkModal"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg">
          <div
            class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Bulk Operation ({{ selectedItems.length }})
            </h3>
            <button
              @click="showBulkModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Action</label
              >
              <select
                v-model="bulkAction"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">Select action</option>
                <option value="status">Update Status</option>
                <option value="priority">Update Priority</option>
                <option value="department">Update Department</option>
              </select>
            </div>

            <div v-if="bulkAction === 'status'">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >New Status</label
              >
              <select
                v-model="bulkValue"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option
                  v-for="s in statusOptions"
                  :key="s.value"
                  :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </div>

            <div v-if="bulkAction === 'priority'">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >New Priority</label
              >
              <select
                v-model="bulkValue"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option
                  v-for="p in priorityOptions"
                  :key="p.value"
                  :value="p.value">
                  {{ p.label }}
                </option>
              </select>
            </div>

            <div v-if="bulkAction === 'department'">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >New Department</label
              >
              <select
                v-model="bulkValue"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option v-for="d in departments" :key="d" :value="d">
                  {{ d }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="showBulkModal = false"
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button
              @click="handleBulkAction"
              :disabled="!bulkAction || !bulkValue"
              class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 disabled:opacity-50">
              Apply
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Import Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showImportModal"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl">
          <div
            class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Import Integrations
            </h3>
            <button
              @click="showImportModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Format</label
                >
                <select
                  v-model="importForm.format"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <label
                class="flex items-center gap-2 text-sm px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <input
                  type="checkbox"
                  v-model="importForm.overwrite"
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                Overwrite existing by ID
              </label>

              <label
                class="flex items-center gap-2 text-sm px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <input
                  type="checkbox"
                  v-model="importForm.validateOnly"
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                Validate only
              </label>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Paste Data</label
              >
              <textarea
                v-model="importForm.data"
                rows="10"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder='[ { "name": "Integration A", ... } ]'></textarea>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <input
                  id="file-input"
                  type="file"
                  accept=".json,.csv"
                  @change="handleFileImport"
                  class="hidden" />
                <label
                  for="file-input"
                  class="cursor-pointer px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >Upload File</label
                >
              </div>
              <button
                @click="handleImport"
                class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95">
                Import
              </button>
            </div>

            <div
              v-if="importResults"
              class="mt-4 p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300">
              <p class="font-medium mb-2">Results</p>
              <p>Imported: {{ importResults.imported }}</p>
              <p>Updated: {{ importResults.updated }}</p>
              <p>Errors: {{ importResults.errors.length }}</p>
              <p>Warnings: {{ importResults.warnings.length }}</p>
              <div v-if="importResults.errors.length" class="mt-2">
                <p class="font-medium text-red-600 dark:text-red-400 mb-1">
                  Errors
                </p>
                <ul class="list-disc ml-5">
                  <li v-for="(e, i) in importResults.errors" :key="i">
                    {{ e }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="showImportModal = false"
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedIntegration"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl">
          <div
            class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Integration Details
            </h3>
            <button
              @click="
                showDetailModal = false;
                selectedIntegration = null;
              "
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
            <div class="space-y-2">
              <p>
                <span class="text-gray-500 dark:text-gray-400">Name:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  selectedIntegration.name
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Provider:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  selectedIntegration.provider
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Type:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  selectedIntegration.type
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Version:</span>
                <span class="font-medium text-gray-900 dark:text-white"
                  >v{{ selectedIntegration.version }}</span
                >
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400"
                  >Department:</span
                >
                <span class="font-medium text-gray-900 dark:text-white">{{
                  selectedIntegration.department || "-"
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400"
                  >Maintainer:</span
                >
                <span class="font-medium text-gray-900 dark:text-white">{{
                  selectedIntegration.maintainer || "-"
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Email:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  selectedIntegration.maintainerEmail || "-"
                }}</span>
              </p>
              <p class="break-words">
                <span class="text-gray-500 dark:text-gray-400">Endpoint:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  selectedIntegration.endpoint
                }}</span>
              </p>
            </div>

            <div class="space-y-2">
              <p>
                <span class="text-gray-500 dark:text-gray-400">Status:</span>
                <span class="font-medium">{{
                  selectedIntegration.status
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Health:</span>
                <span class="font-medium">{{
                  selectedIntegration.health
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Priority:</span>
                <span class="font-medium">{{
                  selectedIntegration.priority
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400"
                  >Success Rate:</span
                >
                <span class="font-medium"
                  >{{ selectedIntegration.successRate }}%</span
                >
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Uptime:</span>
                <span class="font-medium"
                  >{{ selectedIntegration.uptime }}%</span
                >
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Records:</span>
                <span class="font-medium">{{
                  selectedIntegration.recordsSync?.toLocaleString?.() ||
                  selectedIntegration.recordsSync
                }}</span>
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400"
                  >Avg Response:</span
                >
                <span class="font-medium"
                  >{{ selectedIntegration.avgResponseTime }}ms</span
                >
              </p>
              <p>
                <span class="text-gray-500 dark:text-gray-400">Errors:</span>
                <span class="font-medium">{{
                  selectedIntegration.errorCount
                }}</span>
              </p>
            </div>

            <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  Data Mapping
                </h4>
                <div
                  v-if="
                    selectedIntegration.dataMapping &&
                    Object.keys(selectedIntegration.dataMapping).length
                  "
                  class="space-y-1">
                  <div
                    v-for="(v, k) in selectedIntegration.dataMapping"
                    :key="k"
                    class="text-gray-700 dark:text-gray-300 flex items-center justify-between">
                    <span class="font-medium">{{ k }}</span>
                    <span class="text-blue-600 dark:text-blue-400">{{
                      v
                    }}</span>
                  </div>
                </div>
                <p v-else class="text-gray-500 dark:text-gray-400">
                  No mappings
                </p>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  Configuration
                </h4>
                <div
                  v-if="
                    selectedIntegration.configuration &&
                    Object.keys(selectedIntegration.configuration).length
                  "
                  class="space-y-1">
                  <div
                    v-for="(v, k) in selectedIntegration.configuration"
                    :key="k"
                    class="text-gray-700 dark:text-gray-300 flex items-center justify-between">
                    <span class="font-medium">{{ k }}</span>
                    <span class="text-gray-600 dark:text-gray-400">{{
                      v
                    }}</span>
                  </div>
                </div>
                <p v-else class="text-gray-500 dark:text-gray-400">
                  No configuration
                </p>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  Notifications
                </h4>
                <p class="text-gray-700 dark:text-gray-300">
                  Success:
                  {{
                    selectedIntegration.notifications?.onSuccess ? "Yes" : "No"
                  }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  Warning:
                  {{
                    selectedIntegration.notifications?.onWarning ? "Yes" : "No"
                  }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  Failure:
                  {{
                    selectedIntegration.notifications?.onFailure ? "Yes" : "No"
                  }}
                </p>
                <div
                  v-if="selectedIntegration.notifications?.recipients?.length"
                  class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="r in selectedIntegration.notifications.recipients"
                    :key="r"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >{{ r }}</span
                  >
                </div>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                  Security
                </h4>
                <p class="text-gray-700 dark:text-gray-300">
                  TLS:
                  {{ selectedIntegration.securitySettings?.tlsVersion || "-" }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  Encryption:
                  {{
                    selectedIntegration.securitySettings?.encryptionEnabled
                      ? "Yes"
                      : "No"
                  }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  Cert Validation:
                  {{
                    selectedIntegration.securitySettings?.certificateValidation
                      ? "Yes"
                      : "No"
                  }}
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  Audit Logging:
                  {{
                    selectedIntegration.securitySettings?.auditLogging
                      ? "Yes"
                      : "No"
                  }}
                </p>
                <div
                  v-if="
                    selectedIntegration.securitySettings?.ipWhitelist?.length
                  "
                  class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="ip in selectedIntegration.securitySettings
                      .ipWhitelist"
                    :key="ip"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >{{ ip }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="
                showDetailModal = false;
                selectedIntegration = null;
              "
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Health Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showHealthModal"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl">
          <div
            class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              System Health
            </h3>
            <button
              @click="showHealthModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Overall:
              <span class="font-medium capitalize">{{
                integrationHealth.overall
              }}</span>
            </p>
            <div class="space-y-3">
              <div
                v-for="d in integrationHealth.details"
                :key="d.id"
                class="flex items-center justify-between p-3 rounded border border-gray-200 dark:border-gray-700">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <p class="font-medium">{{ d.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Uptime: {{ d.uptime }}% • Last Check:
                    {{ getRelativeTime(d.lastCheck) }}
                  </p>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded"
                  :class="
                    d.health === 'healthy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : d.health === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  ">
                  {{ d.health }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="showHealthModal = false"
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Activity Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showActivityModal"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl">
          <div
            class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <button
              @click="showActivityModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          <div class="p-6">
            <div
              v-if="recentActivity.length === 0"
              class="text-center text-gray-500 dark:text-gray-400 text-sm">
              No recent activity.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(item, idx) in recentActivity"
                :key="idx"
                class="flex items-center justify-between p-3 rounded border border-gray-200 dark:border-gray-700">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <p class="font-medium">{{ item.integration }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.action }} • {{ getRelativeTime(item.timestamp) }}
                  </p>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded"
                  :class="
                    item.status === 'success'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  ">
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="showActivityModal = false"
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

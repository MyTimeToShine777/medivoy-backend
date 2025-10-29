<!-- pages/admin/api.vue -->
<script setup lang="ts">
import { useApiMock } from "~/composables/useApiMock";

const {
  apiEndpoints,
  apiStats,
  addApiEndpoint,
  updateApiEndpoint,
  deleteApiEndpoint,
  bulkUpdateStatus,
  testApiEndpoint,
} = useApiMock();

// State management
const searchQuery = ref("");
const filterCategory = ref("all");
const filterMethod = ref("all");
const filterStatus = ref("all");
const filterEnvironment = ref("all");
const filterHealth = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const showTestModal = ref(false);
const showBulkModal = ref(false);
const showCloneModal = ref(false);
const selectedApi = ref(null);
const apiToDelete = ref(null);
const selectedItems = ref([]);
const isSubmitting = ref(false);
const sortBy = ref("lastModified");
const sortOrder = ref("desc");
const viewMode = ref("cards");

// Form data for CRUD
const apiForm = ref({
  id: null,
  name: "",
  path: "",
  method: "GET",
  version: "1.0.0",
  category: "",
  description: "",
  status: "active",
  environment: "production",
  baseUrl: "",
  authentication: "Bearer Token",
  rateLimit: {
    requests: 1000,
    window: "1 hour",
    burst: 100,
  },
  permissions: [],
  tags: [],
  maintainer: "",
  maintainerEmail: "",
  documentation: "",
  swagger: "",
  testEndpoint: "",
  isPublic: false,
  requiresApproval: true,
  parameters: [],
  securityFeatures: [],
  compliance: [],
  consumers: [],
  slaTargets: {
    responseTime: { target: 300, actual: 300 },
    availability: { target: 99.5, actual: 99.5 },
    errorRate: { target: 1.0, actual: 1.0 },
  },
});

// Temporary inputs for arrays
const newPermission = ref("");
const newTag = ref("");
const newParameter = ref({
  name: "",
  type: "string",
  required: false,
  description: "",
  example: "",
});
const newConsumer = ref({ name: "", requests: 0 });
const newSecurityFeature = ref("");
const newComplianceStandard = ref("");

// Test results
const testResults = ref(null);

// Options
const methodOptions = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
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
    value: "maintenance",
    label: "Maintenance",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: "🔧",
  },
  {
    value: "deprecated",
    label: "Deprecated",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: "⚠️",
  },
  {
    value: "beta",
    label: "Beta",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: "🧪",
  },
  {
    value: "disabled",
    label: "Disabled",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: "❌",
  },
];

const healthStatusOptions = [
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
  {
    value: "degraded",
    label: "Degraded",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    icon: "🟠",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: "🔧",
  },
];

const categories = [
  "Patient Management",
  "Scheduling",
  "Medical Records",
  "Pharmacy",
  "Laboratory",
  "Financial",
  "Communication",
  "Security",
  "Integration",
  "Radiology",
  "Surgery Management",
  "Billing",
  "Insurance",
  "Notifications",
];

const environments = [
  "production",
  "staging",
  "development",
  "testing",
  "sandbox",
];

const authenticationTypes = [
  "Bearer Token",
  "API Key",
  "OAuth2",
  "Basic Auth",
  "JWT",
  "Mutual TLS",
  "API Key + OAuth2",
  "Multi-factor + Biometric",
  "SAML",
  "OpenID Connect",
  "Custom",
  "None",
];

const parameterTypes = [
  "string",
  "integer",
  "number",
  "boolean",
  "array",
  "object",
  "file",
  "date",
  "datetime",
];

const securityFeatureOptions = [
  "Rate Limiting",
  "JWT Authentication",
  "Input Validation",
  "SQL Injection Protection",
  "CORS Policy",
  "HTTPS Only",
  "OAuth2",
  "API Key Auth",
  "Mutual TLS",
  "End-to-End Encryption",
  "Field-Level Encryption",
  "Audit Logging",
  "Access Controls",
  "PHI Protection",
  "Digital Signatures",
  "PCI DSS Compliance",
  "Request Signing",
  "IP Whitelisting",
  "Anti-Tampering",
  "Fraud Detection",
  "Threat Detection",
  "Account Lockout Protection",
  "Password Complexity Rules",
];

const complianceOptions = [
  "HIPAA",
  "GDPR",
  "ISO 27001",
  "SOC 2",
  "PCI DSS",
  "HITECH",
  "DEA",
  "FDA",
  "CLIA",
  "ISO 15189",
  "SOX",
  "CAN-SPAM",
  "OAuth 2.0",
  "OpenID Connect",
  "SAML 2.0",
  "FHIR",
];

const windowOptions = [
  "1 minute",
  "5 minutes",
  "15 minutes",
  "1 hour",
  "1 day",
];

// Computed
const filteredApiEndpoints = computed(() => {
  let filtered = [...apiEndpoints.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (api) =>
        api.name.toLowerCase().includes(query) ||
        api.path.toLowerCase().includes(query) ||
        api.description.toLowerCase().includes(query) ||
        api.category.toLowerCase().includes(query) ||
        api.maintainer.toLowerCase().includes(query)
    );
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter((api) => api.category === filterCategory.value);
  }

  if (filterMethod.value !== "all") {
    filtered = filtered.filter((api) => api.method === filterMethod.value);
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter((api) => api.status === filterStatus.value);
  }

  if (filterEnvironment.value !== "all") {
    filtered = filtered.filter(
      (api) => api.environment === filterEnvironment.value
    );
  }

  if (filterHealth.value !== "all") {
    filtered = filtered.filter(
      (api) => api.healthCheck.status === filterHealth.value
    );
  }

  return filtered.sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];

    if (sortBy.value === "lastModified" || sortBy.value === "createdAt") {
      const dateA = new Date(aVal);
      const dateB = new Date(bVal);
      return sortOrder.value === "desc" ? dateB - dateA : dateA - dateB;
    }

    if (typeof aVal === "number") {
      return sortOrder.value === "desc" ? bVal - aVal : aVal - bVal;
    }

    const strA = String(aVal || "");
    const strB = String(bVal || "");
    return sortOrder.value === "desc"
      ? strB.localeCompare(strA)
      : strA.localeCompare(strB);
  });
});

// Helper functions
const getStatusInfo = (status) => {
  return statusOptions.find((s) => s.value === status) || statusOptions[0];
};

const getHealthInfo = (health) => {
  return (
    healthStatusOptions.find((h) => h.value === health) ||
    healthStatusOptions[0]
  );
};

const getMethodColor = (method) => {
  const colors = {
    GET: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    POST: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    PUT: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    PATCH:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    HEAD: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    OPTIONS:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };
  return (
    colors[method] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  );
};

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatResponseTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const formatUptime = (uptime) => {
  return `${uptime.toFixed(2)}%`;
};

// Array manipulation functions
const addPermission = () => {
  const permission = newPermission.value.trim();
  if (permission && !apiForm.value.permissions.includes(permission)) {
    apiForm.value.permissions.push(permission);
    newPermission.value = "";
  }
};

const removePermission = (index) => {
  apiForm.value.permissions.splice(index, 1);
};

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !apiForm.value.tags.includes(tag)) {
    apiForm.value.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index) => {
  apiForm.value.tags.splice(index, 1);
};

const addParameter = () => {
  if (newParameter.value.name && newParameter.value.type) {
    apiForm.value.parameters.push({ ...newParameter.value });
    newParameter.value = {
      name: "",
      type: "string",
      required: false,
      description: "",
      example: "",
    };
  }
};

const removeParameter = (index) => {
  apiForm.value.parameters.splice(index, 1);
};

const addConsumer = () => {
  if (newConsumer.value.name) {
    apiForm.value.consumers.push({
      ...newConsumer.value,
      lastAccess: new Date().toISOString(),
    });
    newConsumer.value = { name: "", requests: 0 };
  }
};

const removeConsumer = (index) => {
  apiForm.value.consumers.splice(index, 1);
};

const addSecurityFeature = () => {
  const feature = newSecurityFeature.value;
  if (feature && !apiForm.value.securityFeatures.includes(feature)) {
    apiForm.value.securityFeatures.push(feature);
    newSecurityFeature.value = "";
  }
};

const removeSecurityFeature = (index) => {
  apiForm.value.securityFeatures.splice(index, 1);
};

const addComplianceStandard = () => {
  const standard = newComplianceStandard.value;
  if (standard && !apiForm.value.compliance.includes(standard)) {
    apiForm.value.compliance.push(standard);
    newComplianceStandard.value = "";
  }
};

const removeComplianceStandard = (index) => {
  apiForm.value.compliance.splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (api) => {
  apiForm.value = {
    ...api,
    permissions: [...(api.permissions || [])],
    tags: [...(api.tags || [])],
    parameters: [...(api.parameters || [])],
    securityFeatures: [...(api.securityFeatures || [])],
    compliance: [...(api.compliance || [])],
    consumers: [...(api.consumers || [])],
    rateLimit: { ...api.rateLimit },
    slaTargets: {
      responseTime: { ...api.slaTargets.responseTime },
      availability: { ...api.slaTargets.availability },
      errorRate: { ...api.slaTargets.errorRate },
    },
  };
  selectedApi.value = api;
  showEditModal.value = true;
};

const openDeleteModal = (api) => {
  apiToDelete.value = api;
  showDeleteModal.value = true;
};

const openDetailModal = (api) => {
  selectedApi.value = api;
  showDetailModal.value = true;
};

const openTestModal = (api) => {
  selectedApi.value = api;
  testResults.value = null;
  showTestModal.value = true;
};

const openCloneModal = (api) => {
  resetForm();
  apiForm.value = {
    ...api,
    id: null,
    name: `${api.name} (Copy)`,
    path: `${api.path}-copy`,
    version: "1.0.0",
    permissions: [...(api.permissions || [])],
    tags: [...(api.tags || [])],
    parameters: [...(api.parameters || [])],
    securityFeatures: [...(api.securityFeatures || [])],
    compliance: [...(api.compliance || [])],
    consumers: [],
    rateLimit: { ...api.rateLimit },
    slaTargets: {
      responseTime: { ...api.slaTargets.responseTime },
      availability: { ...api.slaTargets.availability },
      errorRate: { ...api.slaTargets.errorRate },
    },
  };
  showCloneModal.value = true;
};

const openBulkModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select API endpoints to perform bulk operations");
    return;
  }
  showBulkModal.value = true;
};

const resetForm = () => {
  apiForm.value = {
    id: null,
    name: "",
    path: "",
    method: "GET",
    version: "1.0.0",
    category: "",
    description: "",
    status: "active",
    environment: "production",
    baseUrl: "",
    authentication: "Bearer Token",
    rateLimit: {
      requests: 1000,
      window: "1 hour",
      burst: 100,
    },
    permissions: [],
    tags: [],
    maintainer: "",
    maintainerEmail: "",
    documentation: "",
    swagger: "",
    testEndpoint: "",
    isPublic: false,
    requiresApproval: true,
    parameters: [],
    securityFeatures: [],
    compliance: [],
    consumers: [],
    slaTargets: {
      responseTime: { target: 300, actual: 300 },
      availability: { target: 99.5, actual: 99.5 },
      errorRate: { target: 1.0, actual: 1.0 },
    },
  };

  // Reset temporary inputs
  newPermission.value = "";
  newTag.value = "";
  newParameter.value = {
    name: "",
    type: "string",
    required: false,
    description: "",
    example: "",
  };
  newConsumer.value = { name: "", requests: 0 };
  newSecurityFeature.value = "";
  newComplianceStandard.value = "";
};

const saveApi = async () => {
  try {
    isSubmitting.value = true;

    if (!apiForm.value.name || !apiForm.value.path || !apiForm.value.category) {
      alert("Please fill in all required fields");
      return;
    }

    const apiData = {
      ...apiForm.value,
      fullUrl: `${apiForm.value.baseUrl}${apiForm.value.path}`,
      lastModified: new Date().toISOString(),
    };

    if (apiForm.value.id) {
      updateApiEndpoint(apiForm.value.id, apiData);
      alert("API endpoint updated successfully!");
    } else {
      addApiEndpoint(apiData);
      alert("API endpoint created successfully!");
    }

    showAddModal.value = false;
    showEditModal.value = false;
    showCloneModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving API:", error);
    alert("Error saving API endpoint. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    deleteApiEndpoint(apiToDelete.value.id);
    showDeleteModal.value = false;
    apiToDelete.value = null;
    alert("API endpoint deleted successfully!");
  } catch (error) {
    console.error("Error deleting API:", error);
    alert("Error deleting API endpoint. Please try again.");
  }
};

const handleBulkOperation = async (operation, status = null) => {
  try {
    if (operation === "status" && status) {
      bulkUpdateStatus(selectedItems.value, status);
      alert(`Updated ${selectedItems.value.length} API endpoints to ${status}`);
    } else if (operation === "delete") {
      selectedItems.value.forEach((id) => deleteApiEndpoint(id));
      alert(`Deleted ${selectedItems.value.length} API endpoints`);
    }

    selectedItems.value = [];
    showBulkModal.value = false;
  } catch (error) {
    console.error("Error performing bulk operation:", error);
    alert("Error performing bulk operation. Please try again.");
  }
};

const handleTest = async () => {
  try {
    testResults.value = { loading: true };
    const result = await testApiEndpoint(selectedApi.value.id);
    testResults.value = result;
  } catch (error) {
    testResults.value = { error: "Test failed", details: error.message };
  }
};

const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
  }
};

const selectAllItems = () => {
  if (selectedItems.value.length === filteredApiEndpoints.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredApiEndpoints.value.map((api) => api.id);
  }
};

const duplicateApi = (api) => {
  openCloneModal(api);
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          API Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Monitor and manage healthcare API endpoints across all systems
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openBulkModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50">
          🔧 Bulk Actions ({{ selectedItems.length }})
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
          🔗 Add API
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total APIs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ apiStats.totalApis }}
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
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Active APIs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ apiStats.activeApis }}
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
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Healthy APIs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ apiStats.healthyApis }}
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
              Warning APIs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ apiStats.warningApis }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">⚠️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Avg Uptime
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ formatUptime(apiStats.averageUptime) }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">📊</span>
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
              {{ formatResponseTime(apiStats.averageResponseTime) }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">⚡</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Distribution Charts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          API Categories
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, category) in Object.fromEntries(
              Object.entries(apiStats.categoryCounts).sort(
                ([, a], [, b]) => b - a
              )
            )"
            :key="category"
            class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{
              category
            }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{
              count
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          HTTP Methods
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, method) in Object.fromEntries(
              Object.entries(apiStats.methodCounts).sort(
                ([, a], [, b]) => b - a
              )
            )"
            :key="method"
            class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                :class="getMethodColor(method)"
                class="px-2 py-1 text-xs font-medium rounded"
                >{{ method }}</span
              >
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{
              count
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Health Status
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-green-500">💚</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white"
                >Healthy</span
              >
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{
              apiStats.healthyApis
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-yellow-500">⚠️</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white"
                >Warning</span
              >
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{
              apiStats.warningApis
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-red-500">🔴</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white"
                >Critical</span
              >
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{
              apiStats.criticalApis
            }}</span>
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
            placeholder="Search APIs..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Categories</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category">
            {{ category }}
          </option>
        </select>

        <select
          v-model="filterMethod"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Methods</option>
          <option v-for="method in methodOptions" :key="method" :value="method">
            {{ method }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
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
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Health</option>
          <option
            v-for="health in healthStatusOptions"
            :key="health.value"
            :value="health.value">
            {{ health.icon }} {{ health.label }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="
                selectedItems.length === filteredApiEndpoints.length &&
                filteredApiEndpoints.length > 0
              "
              @change="selectAllItems"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span class="text-gray-700 dark:text-gray-300"
              >Select All ({{ filteredApiEndpoints.length }})</span
            >
          </label>
        </div>
        <button
          @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
          class="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
          Sort {{ sortOrder === "desc" ? "↓" : "↑" }}
        </button>
      </div>
    </div>

    <!-- API Cards View -->
    <div
      v-if="viewMode === 'cards'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="api in filteredApiEndpoints"
        :key="api.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200 group">
        <!-- Header -->
        <div class="p-6 pb-4">
          <div class="flex items-start justify-between mb-4">
            <input
              type="checkbox"
              :checked="selectedItems.includes(api.id)"
              @change="toggleItemSelection(api.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD] mt-1" />
            <div class="flex items-center gap-2">
              <span
                :class="getMethodColor(api.method)"
                class="px-2 py-1 text-xs font-medium rounded">
                {{ api.method }}
              </span>
              <span
                :class="getStatusInfo(api.status).color"
                class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusInfo(api.status).icon }}
              </span>
            </div>
          </div>

          <div>
            <h3
              class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {{ api.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ api.category }}
            </p>
            <p
              class="text-xs text-gray-500 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {{ api.path }}
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 pb-6">
          <!-- Health Status -->
          <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <span
                :class="getHealthInfo(api.healthCheck.status).color"
                class="w-3 h-3 rounded-full"></span>
              <span class="text-xs text-gray-600 dark:text-gray-400"
                >{{ formatUptime(api.healthCheck.uptime) }} uptime</span
              >
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-500">
              {{ formatResponseTime(api.healthCheck.responseTime) }}
            </div>
          </div>

          <!-- Metrics -->
          <div class="space-y-2 text-sm mb-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Requests:</span>
              <span class="text-gray-900 dark:text-white">{{
                api.metrics.totalRequests.toLocaleString()
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400"
                >Success Rate:</span
              >
              <span class="text-gray-900 dark:text-white"
                >{{ api.metrics.successRate }}%</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Consumers:</span>
              <span class="text-gray-900 dark:text-white">{{
                api.metrics.uniqueConsumers
              }}</span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="api.tags && api.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in api.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                {{ tag }}
              </span>
              <span
                v-if="api.tags.length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                +{{ api.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="openDetailModal(api)"
              class="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              👁️ View
            </button>
            <button
              @click="openTestModal(api)"
              class="flex-1 px-3 py-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
              🧪 Test
            </button>
            <button
              @click="openEditModal(api)"
              class="flex-1 px-3 py-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- API List View -->
    <div
      v-else
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            API Endpoints
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredApiEndpoints.length }} endpoints found
          </p>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="api in filteredApiEndpoints"
          :key="api.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-start gap-4">
            <!-- Selection -->
            <input
              type="checkbox"
              :checked="selectedItems.includes(api.id)"
              @change="toggleItemSelection(api.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD] mt-1" />

            <!-- Method Badge -->
            <div class="flex-shrink-0 mt-1">
              <span
                :class="getMethodColor(api.method)"
                class="px-3 py-1 text-sm font-medium rounded">
                {{ api.method }}
              </span>
            </div>

            <!-- API Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-4">
                  <div>
                    <h3
                      class="text-base font-semibold text-gray-900 dark:text-white">
                      {{ api.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ api.description }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      :class="getStatusInfo(api.status).color"
                      class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getStatusInfo(api.status).label }}
                    </span>
                    <span
                      :class="getHealthInfo(api.healthCheck.status).color"
                      class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getHealthInfo(api.healthCheck.status).icon }}
                      {{ getHealthInfo(api.healthCheck.status).label }}
                    </span>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatUptime(api.healthCheck.uptime) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatResponseTime(api.healthCheck.responseTime) }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span
                  class="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs"
                  >{{ api.path }}</span
                >
                <span>📦 {{ api.category }}</span>
                <span>🌍 {{ api.environment }}</span>
                <span>👤 {{ api.maintainer }}</span>
                <span>v{{ api.version }}</span>
              </div>

              <!-- Metrics -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-6 text-sm">
                  <span class="text-gray-600 dark:text-gray-400">
                    <strong>Requests:</strong>
                    {{ api.metrics.totalRequests.toLocaleString() }}
                  </span>
                  <span class="text-gray-600 dark:text-gray-400">
                    <strong>Success Rate:</strong>
                    {{ api.metrics.successRate }}%
                  </span>
                  <span class="text-gray-600 dark:text-gray-400">
                    <strong>Consumers:</strong>
                    {{ api.metrics.uniqueConsumers }}
                  </span>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="api.tags && api.tags.length > 0" class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in api.tags.slice(0, 5)"
                    :key="tag"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                    {{ tag }}
                  </span>
                  <span
                    v-if="api.tags.length > 5"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                    +{{ api.tags.length - 5 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="openDetailModal(api)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="View Details">
                👁️
              </button>
              <button
                @click="openTestModal(api)"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Test API">
                🧪
              </button>
              <button
                @click="duplicateApi(api)"
                class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="Clone API">
                📋
              </button>
              <button
                @click="openEditModal(api)"
                class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Edit">
                ✏️
              </button>
              <button
                @click="openDeleteModal(api)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredApiEndpoints.length === 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <div class="text-6xl mb-4">🔗</div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No API endpoints found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or add your first API endpoint.
      </p>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
        Add API Endpoint
      </button>
    </div>

    <!-- Add/Edit/Clone API Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showAddModal || showEditModal || showCloneModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{
                  showEditModal
                    ? "Edit API Endpoint"
                    : showCloneModal
                    ? "Clone API Endpoint"
                    : "Create New API Endpoint"
                }}
              </h3>
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = showCloneModal = false;
                  resetForm();
                "
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="saveApi" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >API Name *</label
                  >
                  <input
                    v-model="apiForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Version</label
                  >
                  <input
                    v-model="apiForm.version"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >HTTP Method</label
                  >
                  <select
                    v-model="apiForm.method"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="method in methodOptions"
                      :key="method"
                      :value="method">
                      {{ method }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >API Path *</label
                  >
                  <input
                    v-model="apiForm.path"
                    type="text"
                    required
                    placeholder="/api/v1/example"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Base URL</label
                  >
                  <input
                    v-model="apiForm.baseUrl"
                    type="url"
                    placeholder="https://api.example.com"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Category *</label
                  >
                  <select
                    v-model="apiForm.category"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Category</option>
                    <option
                      v-for="category in categories"
                      :key="category"
                      :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Status</label
                  >
                  <select
                    v-model="apiForm.status"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="status in statusOptions"
                      :key="status.value"
                      :value="status.value">
                      {{ status.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Environment</label
                  >
                  <select
                    v-model="apiForm.environment"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option v-for="env in environments" :key="env" :value="env">
                      {{ env.charAt(0).toUpperCase() + env.slice(1) }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Authentication</label
                  >
                  <select
                    v-model="apiForm.authentication"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="auth in authenticationTypes"
                      :key="auth"
                      :value="auth">
                      {{ auth }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h4>
              <textarea
                v-model="apiForm.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Describe what this API endpoint does..."></textarea>
            </div>

            <!-- Rate Limiting -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Rate Limiting
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Requests per Window</label
                  >
                  <input
                    v-model="apiForm.rateLimit.requests"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Time Window</label
                  >
                  <select
                    v-model="apiForm.rateLimit.window"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="window in windowOptions"
                      :key="window"
                      :value="window">
                      {{ window }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Burst Limit</label
                  >
                  <input
                    v-model="apiForm.rateLimit.burst"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Maintainer Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Maintainer Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Maintainer Name</label
                  >
                  <input
                    v-model="apiForm.maintainer"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Maintainer Email</label
                  >
                  <input
                    v-model="apiForm.maintainerEmail"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Documentation URLs -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Documentation URLs
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Documentation</label
                  >
                  <input
                    v-model="apiForm.documentation"
                    type="url"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Swagger/OpenAPI</label
                  >
                  <input
                    v-model="apiForm.swagger"
                    type="url"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Test Endpoint</label
                  >
                  <input
                    v-model="apiForm.testEndpoint"
                    type="url"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Access Control -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Access Control
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="apiForm.isPublic"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Public API</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="apiForm.requiresApproval"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Requires Approval</span
                  >
                </label>
              </div>

              <!-- Permissions -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Required Permissions</label
                >
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newPermission"
                    type="text"
                    placeholder="Add permission..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="addPermission" />
                  <button
                    type="button"
                    @click="addPermission"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="apiForm.permissions.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(permission, index) in apiForm.permissions"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm rounded">
                    {{ permission }}
                    <button
                      type="button"
                      @click="removePermission(index)"
                      class="text-orange-600 dark:text-orange-400 hover:text-orange-800">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Parameters -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                API Parameters
              </h4>
              <div class="space-y-4">
                <div class="grid grid-cols-12 gap-2 items-end">
                  <div class="col-span-3">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Parameter Name</label
                    >
                    <input
                      v-model="newParameter.name"
                      type="text"
                      placeholder="param_name"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-2">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Type</label
                    >
                    <select
                      v-model="newParameter.type"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm">
                      <option
                        v-for="type in parameterTypes"
                        :key="type"
                        :value="type">
                        {{ type }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-1">
                    <label class="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        v-model="newParameter.required"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      Required
                    </label>
                  </div>
                  <div class="col-span-3">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Description</label
                    >
                    <input
                      v-model="newParameter.description"
                      type="text"
                      placeholder="Parameter description"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-2">
                    <label
                      class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Example</label
                    >
                    <input
                      v-model="newParameter.example"
                      type="text"
                      placeholder="example_value"
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#4565AD] text-sm" />
                  </div>
                  <div class="col-span-1">
                    <button
                      type="button"
                      @click="addParameter"
                      class="w-full px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                      Add
                    </button>
                  </div>
                </div>

                <div v-if="apiForm.parameters.length > 0" class="space-y-2">
                  <div
                    v-for="(param, index) in apiForm.parameters"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div class="flex-1 text-sm">
                      <span class="font-medium">{{ param.name }}</span>
                      <span class="text-gray-500 mx-2">({{ param.type }})</span>
                      <span v-if="param.required" class="text-red-600 text-xs"
                        >Required</span
                      >
                      <div
                        class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {{ param.description }}
                        <span v-if="param.example" class="ml-2 text-green-600"
                          >Example: {{ param.example }}</span
                        >
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="removeParameter(index)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- SLA Targets -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                SLA Targets
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Response Time (ms)</label
                  >
                  <input
                    v-model="apiForm.slaTargets.responseTime.target"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Availability (%)</label
                  >
                  <input
                    v-model="apiForm.slaTargets.availability.target"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Max Error Rate (%)</label
                  >
                  <input
                    v-model="apiForm.slaTargets.errorRate.target"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Security Features -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Security Features
              </h4>
              <div class="space-y-4">
                <div class="flex gap-2">
                  <select
                    v-model="newSecurityFeature"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm">
                    <option value="">Select security feature...</option>
                    <option
                      v-for="feature in securityFeatureOptions"
                      :key="feature"
                      :value="feature">
                      {{ feature }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="addSecurityFeature"
                    class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="apiForm.securityFeatures.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(feature, index) in apiForm.securityFeatures"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                    🔒 {{ feature }}
                    <button
                      type="button"
                      @click="removeSecurityFeature(index)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Compliance Standards -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Compliance Standards
              </h4>
              <div class="space-y-4">
                <div class="flex gap-2">
                  <select
                    v-model="newComplianceStandard"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm">
                    <option value="">Select compliance standard...</option>
                    <option
                      v-for="standard in complianceOptions"
                      :key="standard"
                      :value="standard">
                      {{ standard }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="addComplianceStandard"
                    class="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="apiForm.compliance.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(standard, index) in apiForm.compliance"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded">
                    ✓ {{ standard }}
                    <button
                      type="button"
                      @click="removeComplianceStandard(index)"
                      class="text-purple-600 dark:text-purple-400 hover:text-purple-800">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h4>
              <div class="space-y-4">
                <div class="flex gap-2">
                  <input
                    v-model="newTag"
                    type="text"
                    placeholder="Add tag..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="addTag" />
                  <button
                    type="button"
                    @click="addTag"
                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="apiForm.tags.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in apiForm.tags"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                    {{ tag }}
                    <button
                      type="button"
                      @click="removeTag(index)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = showCloneModal = false;
                  resetForm();
                "
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{
                  isSubmitting
                    ? "Saving..."
                    : showEditModal
                    ? "Update API"
                    : "Create API"
                }}
              </button>
            </div>
          </form>
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
        v-if="showTestModal && selectedApi"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              🧪 Test API Endpoint
            </h3>
            <button
              type="button"
              @click="showTestModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>

          <div class="mb-4">
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              Testing: <strong>{{ selectedApi.name }}</strong>
            </p>
            <code
              class="block p-3 bg-gray-100 darkrk:bg-gray-800 rounded text-sm"
              >{{ selectedApi.method }} {{ selectedApi.fullUrl }}</code
            >
          </div>

          <div
            v-if="testResults"
            class="mb-4 p-4 rounded-lg"
            :class="
              testResults.loading
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : testResults.success
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            ">
            <div v-if="testResults.loading" class="flex items-center gap-2">
              <div
                class="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span class="text-blue-800 dark:text-blue-300"
                >Testing endpoint...</span
              >
            </div>
            <div
              v-else-if="testResults.success"
              class="text-green-800 dark:text-green-300">
              <p class="font-medium">✅ Test Successful</p>
              <p class="text-sm mt-1">
                Response time:
                {{ formatResponseTime(testResults.responseTime) }}
              </p>
              <p class="text-sm">
                Timestamp: {{ formatTimestamp(testResults.timestamp) }}
              </p>
            </div>
            <div v-else class="text-red-800 dark:text-red-300">
              <p class="font-medium">❌ Test Failed</p>
              <p class="text-sm mt-1">
                {{
                  testResults.error || "Endpoint is not responding correctly"
                }}
              </p>
              <p v-if="testResults.details" class="text-xs mt-1">
                {{ testResults.details }}
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showTestModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Close
            </button>
            <button
              type="button"
              @click="handleTest"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Run Test
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Delete API Endpoint
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this API endpoint? This action
            cannot be undone and may affect dependent applications.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ apiToDelete?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ apiToDelete?.method }} {{ apiToDelete?.path }} •
              {{ apiToDelete?.category }}
            </p>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="button"
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete API
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bulk Operations Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showBulkModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔧 Bulk Operations
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Selected {{ selectedItems.length }} API endpoints. Choose an
            operation:
          </p>

          <div class="space-y-3">
            <div class="flex flex-col gap-2">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >Change Status:</label
              >
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="handleBulkOperation('status', 'active')"
                  class="px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  ✅ Active
                </button>
                <button
                  @click="handleBulkOperation('status', 'maintenance')"
                  class="px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                  🔧 Maintenance
                </button>
                <button
                  @click="handleBulkOperation('status', 'deprecated')"
                  class="px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                  ⚠️ Deprecated
                </button>
                <button
                  @click="handleBulkOperation('status', 'disabled')"
                  class="px-3 py-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  ❌ Disabled
                </button>
              </div>
            </div>

            <button
              @click="handleBulkOperation('delete')"
              class="w-full px-4 py-3 text-left bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              🗑️ Delete Selected APIs
            </button>
          </div>

          <div
            class="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="showBulkModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Detail Modal (same as previous implementation) -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedApi"
        class="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  :class="getMethodColor(selectedApi.method)"
                  class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold">
                  {{ selectedApi.method }}
                </div>
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ selectedApi.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ selectedApi.category }} • v{{ selectedApi.version }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="showDetailModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Basic Information -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Basic Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p><strong>Endpoint:</strong> {{ selectedApi.fullUrl }}</p>
                  <p><strong>Method:</strong> {{ selectedApi.method }}</p>
                  <p><strong>Category:</strong> {{ selectedApi.category }}</p>
                  <p>
                    <strong>Environment:</strong> {{ selectedApi.environment }}
                  </p>
                  <p><strong>Version:</strong> v{{ selectedApi.version }}</p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      :class="getStatusInfo(selectedApi.status).color"
                      class="px-2 py-1 rounded-full text-xs"
                      >{{ getStatusInfo(selectedApi.status).label }}</span
                    >
                  </p>
                </div>
              </div>

              <!-- Health & Performance -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Health & Performance
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Health Status:</strong>
                    <span
                      :class="
                        getHealthInfo(selectedApi.healthCheck.status).color
                      "
                      class="px-2 py-1 rounded-full text-xs"
                      >{{
                        getHealthInfo(selectedApi.healthCheck.status).label
                      }}</span
                    >
                  </p>
                  <p>
                    <strong>Uptime:</strong>
                    {{ formatUptime(selectedApi.healthCheck.uptime) }}
                  </p>
                  <p>
                    <strong>Response Time:</strong>
                    {{
                      formatResponseTime(selectedApi.healthCheck.responseTime)
                    }}
                  </p>
                  <p>
                    <strong>Success Rate:</strong>
                    {{ selectedApi.metrics.successRate }}%
                  </p>
                  <p>
                    <strong>Error Rate:</strong>
                    {{ selectedApi.metrics.errorRate }}%
                  </p>
                  <p>
                    <strong>Last Check:</strong>
                    {{ formatTimestamp(selectedApi.healthCheck.lastCheck) }}
                  </p>
                </div>
              </div>

              <!-- Usage Metrics -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Usage Metrics
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Total Requests:</strong>
                    {{ selectedApi.metrics.totalRequests.toLocaleString() }}
                  </p>
                  <p>
                    <strong>Requests Today:</strong>
                    {{ selectedApi.metrics.requestsToday.toLocaleString() }}
                  </p>
                  <p>
                    <strong>Unique Consumers:</strong>
                    {{ selectedApi.metrics.uniqueConsumers }}
                  </p>
                  <p>
                    <strong>Average Response Time:</strong>
                    {{
                      formatResponseTime(
                        selectedApi.metrics.averageResponseTime
                      )
                    }}
                  </p>
                </div>
              </div>

              <!-- Security & Access -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Security & Access
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Authentication:</strong>
                    {{ selectedApi.authentication }}
                  </p>
                  <p>
                    <strong>Rate Limit:</strong>
                    {{ selectedApi.rateLimit.requests }} requests per
                    {{ selectedApi.rateLimit.window }}
                  </p>
                  <p>
                    <strong>Burst Limit:</strong>
                    {{ selectedApi.rateLimit.burst }}
                  </p>
                  <p>
                    <strong>Public API:</strong>
                    {{ selectedApi.isPublic ? "Yes" : "No" }}
                  </p>
                  <p>
                    <strong>Requires Approval:</strong>
                    {{ selectedApi.requiresApproval ? "Yes" : "No" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Description
              </h4>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                {{ selectedApi.description }}
              </p>
            </div>

            <!-- Parameters -->
            <div
              v-if="selectedApi.parameters && selectedApi.parameters.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Parameters
              </h4>
              <div class="space-y-2">
                <div
                  v-for="param in selectedApi.parameters"
                  :key="param.name"
                  class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                  <div>
                    <span class="font-medium">{{ param.name }}</span>
                    <span class="text-gray-500 ml-2">({{ param.type }})</span>
                    <span
                      v-if="param.required"
                      class="text-red-600 text-xs ml-2"
                      >Required</span
                    >
                    <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {{ param.description }}
                      <span v-if="param.example" class="ml-2 text-green-600"
                        >Example: {{ param.example }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Maintainer -->
            <div class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Maintainer
              </h4>
              <div
                class="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedApi.maintainer }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ selectedApi.maintainerEmail }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Documentation Links -->
            <div
              v-if="
                selectedApi.documentation ||
                selectedApi.swagger ||
                selectedApi.testEndpoint
              "
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Documentation
              </h4>
              <div class="flex gap-3">
                <a
                  v-if="selectedApi.documentation"
                  :href="selectedApi.documentation"
                  target="_blank"
                  class="px-3 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  📚 Documentation
                </a>
                <a
                  v-if="selectedApi.swagger"
                  :href="selectedApi.swagger"
                  target="_blank"
                  class="px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  📋 Swagger
                </a>
                <a
                  v-if="selectedApi.testEndpoint"
                  :href="selectedApi.testEndpoint"
                  target="_blank"
                  class="px-3 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-sm rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  🧪 Test Endpoint
                </a>
              </div>
            </div>

            <!-- Permissions -->
            <div
              v-if="
                selectedApi.permissions && selectedApi.permissions.length > 0
              "
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Required Permissions
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="permission in selectedApi.permissions"
                  :key="permission"
                  class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm rounded">
                  {{ permission }}
                </span>
              </div>
            </div>

            <!-- Security Features -->
            <div
              v-if="
                selectedApi.securityFeatures &&
                selectedApi.securityFeatures.length > 0
              "
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Security Features
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="feature in selectedApi.securityFeatures"
                  :key="feature"
                  class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                  🔒 {{ feature }}
                </span>
              </div>
            </div>

            <!-- Compliance -->
            <div
              v-if="selectedApi.compliance && selectedApi.compliance.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Compliance Standards
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="standard in selectedApi.compliance"
                  :key="standard"
                  class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded">
                  ✓ {{ standard }}
                </span>
              </div>
            </div>

            <!-- Tags -->
            <div
              v-if="selectedApi.tags && selectedApi.tags.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Tags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedApi.tags"
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Top Consumers -->
            <div
              v-if="selectedApi.consumers && selectedApi.consumers.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Top Consumers
              </h4>
              <div class="space-y-2">
                <div
                  v-for="consumer in selectedApi.consumers.slice(0, 5)"
                  :key="consumer.name"
                  class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >{{ consumer.name }}</span
                  >
                  <div class="text-right">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ consumer.requests.toLocaleString() }} requests
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-500">
                      Last: {{ formatTimestamp(consumer.lastAccess) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SLA Performance -->
            <div class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                SLA Performance
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <div class="flex items-center justify-between">
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                      >Response Time</span
                    >
                    <span
                      :class="
                        selectedApi.slaTargets.responseTime.status === 'met'
                          ? 'text-green-600'
                          : 'text-red-600'
                      "
                      class="text-xs">
                      {{
                        selectedApi.slaTargets.responseTime.status === "met"
                          ? "✅"
                          : "❌"
                      }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Target:
                    {{ selectedApi.slaTargets.responseTime.target }}ms<br />
                    Actual: {{ selectedApi.slaTargets.responseTime.actual }}ms
                  </div>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <div class="flex items-center justify-between">
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                      >Availability</span
                    >
                    <span
                      :class="
                        selectedApi.slaTargets.availability.status === 'met'
                          ? 'text-green-600'
                          : 'text-red-600'
                      "
                      class="text-xs">
                      {{
                        selectedApi.slaTargets.availability.status === "met"
                          ? "✅"
                          : "❌"
                      }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Target:
                    {{ selectedApi.slaTargets.availability.target }}%<br />
                    Actual: {{ selectedApi.slaTargets.availability.actual }}%
                  </div>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <div class="flex items-center justify-between">
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                      >Error Rate</span
                    >
                    <span
                      :class="
                        selectedApi.slaTargets.errorRate.status === 'met'
                          ? 'text-green-600'
                          : 'text-red-600'
                      "
                      class="text-xs">
                      {{
                        selectedApi.slaTargets.errorRate.status === "met"
                          ? "✅"
                          : "❌"
                      }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Target: <
                    {{ selectedApi.slaTargets.errorRate.target }}%<br />
                    Actual: {{ selectedApi.slaTargets.errorRate.actual }}%
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
              <button
                type="button"
                @click="
                  openTestModal(selectedApi);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                🧪 Test API
              </button>
              <button
                type="button"
                @click="
                  duplicateApi(selectedApi);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                📋 Clone API
              </button>
              <button
                type="button"
                @click="
                  openEditModal(selectedApi);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                ✏️ Edit API
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

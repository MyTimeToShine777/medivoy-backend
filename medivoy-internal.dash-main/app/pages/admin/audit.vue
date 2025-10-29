<!-- pages/admin/audit.vue -->
<script setup lang="ts">
import { useAuditMock } from "~/composables/useAuditMock";

const {
  auditLogs,
  auditStats,
  addAuditLog,
  updateAuditLog,
  deleteAuditLog,
  bulkExportLogs,
  archiveOldLogs,
} = useAuditMock();

// State management
const searchQuery = ref("");
const filterSeverity = ref("all");
const filterAction = ref("all");
const filterModule = ref("all");
const filterRisk = ref("all");
const filterCountry = ref("all");
const filterStatus = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const showExportModal = ref(false);
const showArchiveModal = ref(false);
const showBulkModal = ref(false);
const selectedLog = ref(null);
const logToDelete = ref(null);
const selectedItems = ref([]);
const isSubmitting = ref(false);
const sortBy = ref("timestamp");
const sortOrder = ref("desc");
const viewMode = ref("list");
const dateRange = ref({ start: "", end: "" });

// Form data for CRUD
const auditForm = ref({
  id: null,
  userId: "",
  userName: "",
  userRole: "",
  userEmail: "",
  action: "",
  actionType: "READ",
  resourceType: "",
  resourceId: "",
  resourceName: "",
  module: "",
  subModule: "",
  facility: "",
  country: "UAE",
  ipAddress: "",
  userAgent: "",
  sessionId: "",
  deviceType: "desktop",
  location: "",
  severity: "INFO",
  riskLevel: "LOW",
  description: "",
  before: null,
  after: null,
  changes: [],
  metadata: {},
  complianceFlags: [],
  tags: [],
  notes: "",
  reviewStatus: "pending_review",
});

// Temporary inputs for arrays
const newChange = ref({ field: "", oldValue: "", newValue: "" });
const newMetadata = ref({ key: "", value: "" });
const newTag = ref("");
const newComplianceFlag = ref("");

// Options
const severityOptions = [
  {
    value: "INFO",
    label: "Info",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: "ℹ️",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: "⚠️",
  },
  {
    value: "HIGH",
    label: "High",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    icon: "🔸",
  },
  {
    value: "CRITICAL",
    label: "Critical",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: "🔴",
  },
];

const actionTypeOptions = [
  { value: "CREATE", label: "Create", icon: "➕" },
  { value: "READ", label: "Read", icon: "👁️" },
  { value: "UPDATE", label: "Update", icon: "✏️" },
  { value: "DELETE", label: "Delete", icon: "🗑️" },
  { value: "SECURITY", label: "Security", icon: "🔒" },
  { value: "SYSTEM", label: "System", icon: "⚙️" },
];

const riskLevelOptions = [
  {
    value: "LOW",
    label: "Low Risk",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    value: "MEDIUM",
    label: "Medium Risk",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "HIGH",
    label: "High Risk",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
];

const reviewStatusOptions = [
  {
    value: "approved",
    label: "Approved",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    value: "pending_review",
    label: "Pending Review",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "urgent_review",
    label: "Urgent Review",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    value: "auto_approved",
    label: "Auto Approved",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
];

const moduleOptions = [
  "EHR",
  "Pharmacy",
  "Laboratory",
  "Radiology",
  "Finance",
  "Authentication",
  "System Administration",
  "Security Management",
  "Surgery Management",
  "Patient Management",
  "Appointment System",
  "Billing System",
];

const resourceTypeOptions = [
  "patient_record",
  "medication_record",
  "lab_result",
  "radiology_report",
  "financial_transaction",
  "authentication",
  "database_backup",
  "security_policy",
  "surgery_report",
  "appointment",
  "billing_record",
  "user_account",
];

const countries = [
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Jordan",
  "Lebanon",
  "Egypt",
  "Turkey",
];
const deviceTypes = ["desktop", "mobile", "tablet", "server", "api"];

const complianceFlagOptions = [
  "HIPAA_COMPLIANT",
  "GDPR_COMPLIANT",
  "SECURITY_INCIDENT",
  "POTENTIAL_BREACH",
  "DEA_COMPLIANT",
  "CONTROLLED_SUBSTANCE",
  "MEDICAL_COMPLIANCE",
  "DOCUMENTATION_COMPLETE",
  "PHARMACY_COMPLIANCE",
  "INTERACTION_CHECKED",
  "CRITICAL_VALUE_NOTIFICATION",
  "PHYSICIAN_CONTACTED",
  "FINANCIAL_APPROVAL_REQUIRED",
  "AUDIT_TRAIL_COMPLETE",
  "BACKUP_VERIFIED",
  "OFFSITE_STORAGE_CONFIRMED",
  "SECURITY_ENHANCEMENT",
  "COMPLIANCE_UPDATE",
  "MANAGEMENT_APPROVED",
  "DIGITAL_SIGNATURE_VALID",
  "TURNAROUND_TIME_MET",
];

// Computed
const filteredAuditLogs = computed(() => {
  let filtered = auditLogs.value.filter((log) => !log.isDeleted);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (log) =>
        log.logId.toLowerCase().includes(query) ||
        log.userName.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.resourceName.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query)
    );
  }

  if (filterSeverity.value !== "all") {
    filtered = filtered.filter((log) => log.severity === filterSeverity.value);
  }

  if (filterAction.value !== "all") {
    filtered = filtered.filter((log) => log.actionType === filterAction.value);
  }

  if (filterModule.value !== "all") {
    filtered = filtered.filter((log) => log.module === filterModule.value);
  }

  if (filterRisk.value !== "all") {
    filtered = filtered.filter((log) => log.riskLevel === filterRisk.value);
  }

  if (filterCountry.value !== "all") {
    filtered = filtered.filter((log) => log.country === filterCountry.value);
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter(
      (log) => log.reviewStatus === filterStatus.value
    );
  }

  if (dateRange.value.start) {
    filtered = filtered.filter(
      (log) => new Date(log.timestamp) >= new Date(dateRange.value.start)
    );
  }

  if (dateRange.value.end) {
    filtered = filtered.filter(
      (log) =>
        new Date(log.timestamp) <= new Date(dateRange.value.end + "T23:59:59")
    );
  }

  return filtered.sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];

    if (sortBy.value === "timestamp") {
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
const getSeverityInfo = (severity) => {
  return (
    severityOptions.find((s) => s.value === severity) || severityOptions[0]
  );
};

const getActionInfo = (action) => {
  return (
    actionTypeOptions.find((a) => a.value === action) || actionTypeOptions[0]
  );
};

const getRiskInfo = (risk) => {
  return riskLevelOptions.find((r) => r.value === risk) || riskLevelOptions[0];
};

const getStatusInfo = (status) => {
  return (
    reviewStatusOptions.find((s) => s.value === status) ||
    reviewStatusOptions[0]
  );
};

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDuration = (duration) => {
  if (duration < 1000) return `${duration}ms`;
  if (duration < 60000) return `${Math.round(duration / 1000)}s`;
  return `${Math.round(duration / 60000)}m`;
};

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatTimestamp(timestamp).split(",")[0];
};

// Array manipulation functions
const addChange = () => {
  if (newChange.value.field && newChange.value.newValue) {
    auditForm.value.changes.push({ ...newChange.value });
    newChange.value = { field: "", oldValue: "", newValue: "" };
  }
};

const removeChange = (index) => {
  auditForm.value.changes.splice(index, 1);
};

const addMetadata = () => {
  if (newMetadata.value.key && newMetadata.value.value) {
    auditForm.value.metadata[newMetadata.value.key] = newMetadata.value.value;
    newMetadata.value = { key: "", value: "" };
  }
};

const removeMetadata = (key) => {
  delete auditForm.value.metadata[key];
};

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !auditForm.value.tags.includes(tag)) {
    auditForm.value.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index) => {
  auditForm.value.tags.splice(index, 1);
};

const addComplianceFlag = () => {
  const flag = newComplianceFlag.value;
  if (flag && !auditForm.value.complianceFlags.includes(flag)) {
    auditForm.value.complianceFlags.push(flag);
    newComplianceFlag.value = "";
  }
};

const removeComplianceFlag = (index) => {
  auditForm.value.complianceFlags.splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (log) => {
  auditForm.value = {
    ...log,
    changes: [...(log.changes || [])],
    metadata: { ...(log.metadata || {}) },
    complianceFlags: [...(log.complianceFlags || [])],
    tags: [...(log.tags || [])],
  };
  selectedLog.value = log;
  showEditModal.value = true;
};

const openDeleteModal = (log) => {
  logToDelete.value = log;
  showDeleteModal.value = true;
};

const openDetailModal = (log) => {
  selectedLog.value = log;
  showDetailModal.value = true;
};

const openExportModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select logs to export");
    return;
  }
  showExportModal.value = true;
};

const openArchiveModal = () => {
  showArchiveModal.value = true;
};

const openBulkModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select logs to perform bulk operations");
    return;
  }
  showBulkModal.value = true;
};

const resetForm = () => {
  auditForm.value = {
    id: null,
    userId: "",
    userName: "",
    userRole: "",
    userEmail: "",
    action: "",
    actionType: "READ",
    resourceType: "",
    resourceId: "",
    resourceName: "",
    module: "",
    subModule: "",
    facility: "",
    country: "UAE",
    ipAddress: "",
    userAgent: "",
    sessionId: "",
    deviceType: "desktop",
    location: "",
    severity: "INFO",
    riskLevel: "LOW",
    description: "",
    before: null,
    after: null,
    changes: [],
    metadata: {},
    complianceFlags: [],
    tags: [],
    notes: "",
    reviewStatus: "pending_review",
  };
  newChange.value = { field: "", oldValue: "", newValue: "" };
  newMetadata.value = { key: "", value: "" };
  newTag.value = "";
  newComplianceFlag.value = "";
};

const saveAuditLog = async () => {
  try {
    isSubmitting.value = true;

    if (
      !auditForm.value.userName ||
      !auditForm.value.action ||
      !auditForm.value.resourceName
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const logData = {
      ...auditForm.value,
      duration: Math.floor(Math.random() * 5000) + 100,
      status: "SUCCESS",
    };

    if (auditForm.value.id) {
      updateAuditLog(auditForm.value.id, logData);
      alert("Audit log updated successfully!");
    } else {
      addAuditLog(logData);
      alert("Audit log created successfully!");
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving audit log:", error);
    alert("Error saving audit log. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    deleteAuditLog(logToDelete.value.id);
    showDeleteModal.value = false;
    logToDelete.value = null;
    alert("Audit log deleted successfully!");
  } catch (error) {
    console.error("Error deleting audit log:", error);
    alert("Error deleting audit log. Please try again.");
  }
};

const handleBulkOperation = async (operation, status = null) => {
  try {
    if (operation === "export") {
      bulkExportLogs(selectedItems.value);
      alert(`Exported ${selectedItems.value.length} audit logs successfully!`);
    }

    selectedItems.value = [];
    showBulkModal.value = false;
  } catch (error) {
    console.error("Error performing bulk operation:", error);
    alert("Error performing bulk operation. Please try again.");
  }
};

const handleExport = () => {
  bulkExportLogs(selectedItems.value);
  showExportModal.value = false;
  selectedItems.value = [];
  alert(`Exported ${selectedItems.value.length} audit logs successfully!`);
};

const handleArchive = (beforeDate) => {
  archiveOldLogs(beforeDate);
  showArchiveModal.value = false;
  alert("Old logs archived successfully!");
};

const updateReviewStatus = (logId, status) => {
  const log = auditLogs.value.find((l) => l.id === logId);
  if (log) {
    updateAuditLog(logId, {
      reviewStatus: status,
      reviewedBy: "Current User",
      reviewedAt: new Date().toISOString(),
    });
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
  if (selectedItems.value.length === filteredAuditLogs.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredAuditLogs.value.map((log) => log.id);
  }
};

// Set initial date range (last 7 days)
onMounted(() => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  dateRange.value = {
    start: sevenDaysAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  };
});
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Audit Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Monitor and review system audit logs across healthcare facilities
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openArchiveModal"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          📦 Archive Logs
        </button>
        <button
          @click="openExportModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50">
          📊 Export ({{ selectedItems.length }})
        </button>
        <button
          @click="openBulkModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50">
          🔧 Bulk Actions ({{ selectedItems.length }})
        </button>
        <div
          class="flex rounded-lg border border-gray-300 dark:border-gray-700 p-1">
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
          <button
            @click="viewMode = 'timeline'"
            :class="
              viewMode === 'timeline'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            📊 Timeline
          </button>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          📝 Add Log
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
              Total Logs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ auditStats.totalLogs }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">📝</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Today's Logs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ auditStats.todayLogs }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">📅</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Critical Logs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ auditStats.severityCounts.CRITICAL || 0 }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="text-red-600 dark:text-red-400">🔴</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Alerts Generated
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ auditStats.alertsGenerated }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">🚨</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Pending Reviews
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ auditStats.pendingReviews }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">⏳</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Avg Duration
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ formatDuration(auditStats.averageDuration) }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">⏱️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Distribution Charts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Severity Distribution
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, severity) in auditStats.severityCounts"
            :key="severity"
            class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span>{{ getSeverityInfo(severity).icon }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                getSeverityInfo(severity).label
              }}</span>
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
          Action Types
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, action) in Object.fromEntries(
              Object.entries(auditStats.actionCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
            )"
            :key="action"
            class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span>{{ getActionInfo(action).icon }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                getActionInfo(action).label
              }}</span>
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
          Top Modules
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, module) in Object.fromEntries(
              Object.entries(auditStats.modulesCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
            )"
            :key="module"
            class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{
              module
            }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{
              count
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
        <div class="relative md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search logs..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterSeverity"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Severity</option>
          <option
            v-for="severity in severityOptions"
            :key="severity.value"
            :value="severity.value">
            {{ severity.icon }} {{ severity.label }}
          </option>
        </select>

        <select
          v-model="filterAction"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Actions</option>
          <option
            v-for="action in actionTypeOptions"
            :key="action.value"
            :value="action.value">
            {{ action.icon }} {{ action.label }}
          </option>
        </select>

        <select
          v-model="filterModule"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Modules</option>
          <option v-for="module in moduleOptions" :key="module" :value="module">
            {{ module }}
          </option>
        </select>

        <select
          v-model="filterRisk"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Risk Levels</option>
          <option
            v-for="risk in riskLevelOptions"
            :key="risk.value"
            :value="risk.value">
            {{ risk.label }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option
            v-for="status in reviewStatusOptions"
            :key="status.value"
            :value="status.value">
            {{ status.label }}
          </option>
        </select>

        <input
          v-model="dateRange.start"
          type="date"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]" />

        <input
          v-model="dateRange.end"
          type="date"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]" />
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="
                selectedItems.length === filteredAuditLogs.length &&
                filteredAuditLogs.length > 0
              "
              @change="selectAllItems"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span class="text-gray-700 dark:text-gray-300"
              >Select All ({{ filteredAuditLogs.length }})</span
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

    <!-- Audit Logs List -->
    <div
      v-if="viewMode === 'list'"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Audit Logs
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredAuditLogs.length }} logs found
          </p>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="log in filteredAuditLogs"
          :key="log.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-start gap-4">
            <!-- Selection -->
            <input
              type="checkbox"
              :checked="selectedItems.includes(log.id)"
              @change="toggleItemSelection(log.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD] mt-1" />

            <!-- Severity Icon -->
            <div class="flex-shrink-0 mt-1">
              <div
                :class="getSeverityInfo(log.severity).color"
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {{ getSeverityInfo(log.severity).icon }}
              </div>
            </div>

            <!-- Log Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-4">
                  <div>
                    <h3
                      class="text-base font-semibold text-gray-900 dark:text-white">
                      {{ log.logId }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ log.description }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      :class="getSeverityInfo(log.severity).color"
                      class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getSeverityInfo(log.severity).label }}
                    </span>
                    <span
                      :class="getRiskInfo(log.riskLevel).color"
                      class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getRiskInfo(log.riskLevel).label }}
                    </span>
                    <span
                      v-if="log.alertGenerated"
                      class="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium rounded-full">
                      🚨 Alert
                    </span>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ getRelativeTime(log.timestamp) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDuration(log.duration) }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span class="flex items-center gap-1">
                  {{ getActionInfo(log.actionType).icon }}
                  {{ getActionInfo(log.actionType).label }}
                </span>
                <span>👤 {{ log.userName }}</span>
                <span>📦 {{ log.module }}</span>
                <span>🌍 {{ log.country }}</span>
                <span>🖥️ {{ log.deviceType }}</span>
                <span class="text-xs">{{ log.ipAddress }}</span>
              </div>

              <!-- Resource Info -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-sm">
                  <span class="text-gray-600 dark:text-gray-400">
                    <strong>Resource:</strong> {{ log.resourceName }}
                  </span>
                  <span class="text-gray-600 dark:text-gray-400">
                    <strong>Facility:</strong> {{ log.facility }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span
                    :class="getStatusInfo(log.reviewStatus).color"
                    class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusInfo(log.reviewStatus).label }}
                  </span>
                </div>
              </div>

              <!-- Compliance Flags -->
              <div
                v-if="log.complianceFlags && log.complianceFlags.length > 0"
                class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="flag in log.complianceFlags"
                    :key="flag"
                    class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded">
                    {{ flag.replace("_", " ") }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="openDetailModal(log)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="View Details">
                👁️
              </button>
              <button
                @click="openEditModal(log)"
                class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Edit">
                ✏️
              </button>
              <button
                v-if="log.reviewStatus === 'pending_review'"
                @click="updateReviewStatus(log.id, 'approved')"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Approve">
                ✅
              </button>
              <button
                v-if="log.reviewStatus === 'pending_review'"
                @click="updateReviewStatus(log.id, 'urgent_review')"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Mark Urgent">
                🚨
              </button>
              <button
                @click="openDeleteModal(log)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline View -->
    <div
      v-else
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div class="relative">
        <div
          class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        <div
          v-for="log in filteredAuditLogs.slice(0, 20)"
          :key="log.id"
          class="relative flex items-start gap-4 pb-8">
          <div
            :class="getSeverityInfo(log.severity).color"
            class="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-4 border-white dark:border-gray-900">
            {{ getSeverityInfo(log.severity).icon }}
          </div>

          <div
            class="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                {{
                  log.action
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                }}
              </h3>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{
                getRelativeTime(log.timestamp)
              }}</span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {{ log.description }}
            </p>

            <div
              class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ log.userName }}</span>
              <span>{{ log.module }}</span>
              <span>{{ log.facility }}</span>
              <span>{{ log.country }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredAuditLogs.length === 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <div class="text-6xl mb-4">📝</div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No audit logs found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or date range.
      </p>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
        Create Audit Log
      </button>
    </div>

    <!-- Add/Edit Audit Log Modal -->
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
                {{ showEditModal ? "Edit Audit Log" : "Create New Audit Log" }}
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

          <form @submit.prevent="saveAuditLog" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >User Name *</label
                  >
                  <input
                    v-model="auditForm.userName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >User Role</label
                  >
                  <input
                    v-model="auditForm.userRole"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >User Email</label
                  >
                  <input
                    v-model="auditForm.userEmail"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Action *</label
                  >
                  <input
                    v-model="auditForm.action"
                    type="text"
                    required
                    placeholder="e.g., patient_record_accessed"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Action Type</label
                  >
                  <select
                    v-model="auditForm.actionType"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="action in actionTypeOptions"
                      :key="action.value"
                      :value="action.value">
                      {{ action.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Severity</label
                  >
                  <select
                    v-model="auditForm.severity"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="severity in severityOptions"
                      :key="severity.value"
                      :value="severity.value">
                      {{ severity.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Resource Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Resource Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Resource Name *</label
                  >
                  <input
                    v-model="auditForm.resourceName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Resource Type</label
                  >
                  <select
                    v-model="auditForm.resourceType"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Type</option>
                    <option
                      v-for="type in resourceTypeOptions"
                      :key="type"
                      :value="type">
                      {{
                        type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Resource ID</label
                  >
                  <input
                    v-model="auditForm.resourceId"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Module</label
                  >
                  <select
                    v-model="auditForm.module"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Module</option>
                    <option
                      v-for="module in moduleOptions"
                      :key="module"
                      :value="module">
                      {{ module }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Sub Module</label
                  >
                  <input
                    v-model="auditForm.subModule"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Risk Level</label
                  >
                  <select
                    v-model="auditForm.riskLevel"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="risk in riskLevelOptions"
                      :key="risk.value"
                      :value="risk.value">
                      {{ risk.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Location Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Location Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Facility</label
                  >
                  <input
                    v-model="auditForm.facility"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Country</label
                  >
                  <select
                    v-model="auditForm.country"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="country in countries"
                      :key="country"
                      :value="country">
                      {{ country }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Location</label
                  >
                  <input
                    v-model="auditForm.location"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >IP Address</label
                  >
                  <input
                    v-model="auditForm.ipAddress"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Device Type</label
                  >
                  <select
                    v-model="auditForm.deviceType"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="device in deviceTypes"
                      :key="device"
                      :value="device">
                      {{ device.charAt(0).toUpperCase() + device.slice(1) }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Session ID</label
                  >
                  <input
                    v-model="auditForm.sessionId"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Changes Tracking -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Changes Made
              </h4>
              <div class="space-y-4">
                <div class="flex gap-2">
                  <input
                    v-model="newChange.field"
                    type="text"
                    placeholder="Field name..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm" />
                  <input
                    v-model="newChange.oldValue"
                    type="text"
                    placeholder="Old value..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm" />
                  <input
                    v-model="newChange.newValue"
                    type="text"
                    placeholder="New value..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm" />
                  <button
                    type="button"
                    @click="addChange"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div v-if="auditForm.changes.length > 0" class="space-y-2">
                  <div
                    v-for="(change, index) in auditForm.changes"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div class="flex-1 text-sm">
                      <strong>{{ change.field }}:</strong>
                      <span class="text-red-600 dark:text-red-400">{{
                        change.oldValue || "null"
                      }}</span>
                      <span class="mx-2">→</span>
                      <span class="text-green-600 dark:text-green-400">{{
                        change.newValue
                      }}</span>
                    </div>
                    <button
                      type="button"
                      @click="removeChange(index)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Metadata
              </h4>
              <div class="space-y-4">
                <div class="flex gap-2">
                  <input
                    v-model="newMetadata.key"
                    type="text"
                    placeholder="Metadata key..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm" />
                  <input
                    v-model="newMetadata.value"
                    type="text"
                    placeholder="Metadata value..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm" />
                  <button
                    type="button"
                    @click="addMetadata"
                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="Object.keys(auditForm.metadata).length > 0"
                  class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in auditForm.metadata"
                    :key="key"
                    class="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                    <div>
                      <strong>{{ key }}:</strong> {{ value }}
                    </div>
                    <button
                      type="button"
                      @click="removeMetadata(key)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Compliance Flags -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Compliance Flags
              </h4>
              <div class="space-y-4">
                <div class="flex gap-2">
                  <select
                    v-model="newComplianceFlag"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm">
                    <option value="">Select compliance flag...</option>
                    <option
                      v-for="flag in complianceFlagOptions"
                      :key="flag"
                      :value="flag">
                      {{ flag.replace("_", " ") }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="addComplianceFlag"
                    class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="auditForm.complianceFlags.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(flag, index) in auditForm.complianceFlags"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                    ✓ {{ flag.replace("_", " ") }}
                    <button
                      type="button"
                      @click="removeComplianceFlag(index)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800">
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
                    class="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="auditForm.tags.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in auditForm.tags"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded">
                    {{ tag }}
                    <button
                      type="button"
                      @click="removeTag(index)"
                      class="text-purple-600 dark:text-purple-400 hover:text-purple-800">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Description and Notes -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Additional Information
              </h4>
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="auditForm.description"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Describe what happened in this audit event..."></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Notes</label
                  >
                  <textarea
                    v-model="auditForm.notes"
                    rows="2"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Additional notes or comments..."></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Review Status</label
                  >
                  <select
                    v-model="auditForm.reviewStatus"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="status in reviewStatusOptions"
                      :key="status.value"
                      :value="status.value">
                      {{ status.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = false;
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
                    ? "Update Log"
                    : "Create Log"
                }}
              </button>
            </div>
          </form>
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
            🗑️ Delete Audit Log
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this audit log? This action cannot
            be undone and may affect compliance reporting.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ logToDelete?.logId }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ logToDelete?.userName }} • {{ logToDelete?.action }}
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
              Delete Log
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
        v-if="showDetailModal && selectedLog"
        class="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  :class="getSeverityInfo(selectedLog.severity).color"
                  class="w-12 h-12 rounded-full flex items-center justify-center text-lg">
                  {{ getSeverityInfo(selectedLog.severity).icon }}
                </div>
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ selectedLog.logId }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatTimestamp(selectedLog.timestamp) }}
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
                  <p>
                    <strong>Action:</strong>
                    {{
                      selectedLog.action
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    }}
                  </p>
                  <p>
                    <strong>Action Type:</strong>
                    {{ getActionInfo(selectedLog.actionType).label }}
                  </p>
                  <p>
                    <strong>User:</strong> {{ selectedLog.userName }} ({{
                      selectedLog.userRole
                    }})
                  </p>
                  <p>
                    <strong>Resource:</strong> {{ selectedLog.resourceName }}
                  </p>
                  <p>
                    <strong>Module:</strong> {{ selectedLog.module }} →
                    {{ selectedLog.subModule }}
                  </p>
                  <p>
                    <strong>Duration:</strong>
                    {{ formatDuration(selectedLog.duration) }}
                  </p>
                </div>
              </div>

              <!-- Location & Security -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Location & Security
                </h4>
                <div class="space-y-2 text-sm">
                  <p><strong>Facility:</strong> {{ selectedLog.facility }}</p>
                  <p><strong>Country:</strong> {{ selectedLog.country }}</p>
                  <p>
                    <strong>IP Address:</strong> {{ selectedLog.ipAddress }}
                  </p>
                  <p><strong>Device:</strong> {{ selectedLog.deviceType }}</p>
                  <p><strong>Location:</strong> {{ selectedLog.location }}</p>
                  <p>
                    <strong>Session ID:</strong> {{ selectedLog.sessionId }}
                  </p>
                </div>
              </div>

              <!-- Status & Risk -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Status & Risk Assessment
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Severity:</strong>
                    <span
                      :class="getSeverityInfo(selectedLog.severity).color"
                      class="px-2 py-1 rounded-full text-xs"
                      >{{ getSeverityInfo(selectedLog.severity).label }}</span
                    >
                  </p>
                  <p>
                    <strong>Risk Level:</strong>
                    <span
                      :class="getRiskInfo(selectedLog.riskLevel).color"
                      class="px-2 py-1 rounded-full text-xs"
                      >{{ getRiskInfo(selectedLog.riskLevel).label }}</span
                    >
                  </p>
                  <p><strong>Status:</strong> {{ selectedLog.status }}</p>
                  <p>
                    <strong>Review Status:</strong>
                    <span
                      :class="getStatusInfo(selectedLog.reviewStatus).color"
                      class="px-2 py-1 rounded-full text-xs"
                      >{{ getStatusInfo(selectedLog.reviewStatus).label }}</span
                    >
                  </p>
                  <p>
                    <strong>Alert Generated:</strong>
                    {{ selectedLog.alertGenerated ? "Yes" : "No" }}
                  </p>
                </div>
              </div>

              <!-- Audit Trail -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Audit Trail
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>System Generated:</strong>
                    {{ selectedLog.auditTrail.systemGenerated ? "Yes" : "No" }}
                  </p>
                  <p>
                    <strong>Verified:</strong>
                    {{ selectedLog.auditTrail.verified ? "Yes" : "No" }}
                  </p>
                  <p>
                    <strong>Exported:</strong>
                    {{ selectedLog.auditTrail.exported ? "Yes" : "No" }}
                  </p>
                  <p>
                    <strong>Retention:</strong>
                    {{ selectedLog.auditTrail.retention.replace("_", " ") }}
                  </p>
                  <p v-if="selectedLog.reviewedBy">
                    <strong>Reviewed By:</strong> {{ selectedLog.reviewedBy }}
                  </p>
                  <p v-if="selectedLog.reviewedAt">
                    <strong>Reviewed At:</strong>
                    {{ formatTimestamp(selectedLog.reviewedAt) }}
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
                {{ selectedLog.description }}
              </p>
            </div>

            <!-- Changes -->
            <div
              v-if="selectedLog.changes && selectedLog.changes.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Changes Made
              </h4>
              <div class="space-y-2">
                <div
                  v-for="change in selectedLog.changes"
                  :key="change.field"
                  class="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                  <strong class="text-gray-900 dark:text-white"
                    >{{
                      change.field
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    }}:</strong
                  >
                  <div class="flex items-center gap-2">
                    <span class="text-red-600 dark:text-red-400">{{
                      change.oldValue || "null"
                    }}</span>
                    <span>→</span>
                    <span class="text-green-600 dark:text-green-400">{{
                      change.newValue
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div
              v-if="
                selectedLog.metadata &&
                Object.keys(selectedLog.metadata).length > 0
              "
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Metadata
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(value, key) in selectedLog.metadata"
                  :key="key"
                  class="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                  <strong class="text-gray-900 dark:text-white"
                    >{{
                      key
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    }}:</strong
                  >
                  <span class="text-gray-600 dark:text-gray-400">{{
                    value
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Compliance Flags -->
            <div
              v-if="
                selectedLog.complianceFlags &&
                selectedLog.complianceFlags.length > 0
              "
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Compliance Flags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="flag in selectedLog.complianceFlags"
                  :key="flag"
                  class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                  ✓ {{ flag.replace("_", " ") }}
                </span>
              </div>
            </div>

            <!-- Tags -->
            <div
              v-if="selectedLog.tags && selectedLog.tags.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Tags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedLog.tags"
                  :key="tag"
                  class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="selectedLog.notes" class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Notes
              </h4>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                {{ selectedLog.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Export Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showExportModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Export Audit Logs
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Export {{ selectedItems.length }} selected audit logs for compliance
            reporting and analysis.
          </p>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Export Format</label
              >
              <select
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                <option value="csv">CSV (Excel Compatible)</option>
                <option value="json">JSON (Technical Format)</option>
                <option value="pdf">PDF (Report Format)</option>
                <option value="xlsx">Excel Workbook</option>
              </select>
            </div>

            <div>
              <label class="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                <span class="text-gray-700 dark:text-gray-300"
                  >Include metadata and changes</span
                >
              </label>
            </div>

            <div>
              <label class="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                <span class="text-gray-700 dark:text-gray-300"
                  >Include compliance flags</span
                >
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showExportModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="button"
              @click="handleExport"
              class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
              Export Logs
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Archive Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showArchiveModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📦 Archive Old Logs
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Archive audit logs older than a specific date to improve system
            performance while maintaining compliance.
          </p>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Archive logs before:</label
              >
              <input
                type="date"
                :max="new Date().toISOString().split('T')[0]"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
            </div>

            <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>⚠️ Warning:</strong> Archived logs will be moved to
                long-term storage and may take longer to retrieve for compliance
                purposes.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showArchiveModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="button"
              @click="handleArchive('2025-10-01')"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Archive Logs
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
            Selected {{ selectedItems.length }} audit logs. Choose an operation:
          </p>

          <div class="space-y-3">
            <button
              @click="handleBulkOperation('export')"
              class="w-full px-4 py-3 text-left bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              📊 Export Selected Logs
            </button>

            <button
              @click="handleBulkOperation('archive')"
              class="w-full px-4 py-3 text-left bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
              📦 Archive Selected Logs
            </button>

            <button
              @click="handleBulkOperation('delete')"
              class="w-full px-4 py-3 text-left bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              🗑️ Delete Selected Logs
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
  </div>
</template>

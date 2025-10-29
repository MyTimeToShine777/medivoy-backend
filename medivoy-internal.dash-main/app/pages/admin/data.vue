<!-- pages/admin/data.vue -->
<script setup lang="ts">
const { $fetch } = useNuxtApp();
const route = useRoute();
const {
  generateMockDataEntries,
  generateDataCategories,
  generatePermissionRoles,
  generateExportFormats,
  generateBackupHistory,
  generateAuditLogs,
} = useDataMock();

// State Management
const dataEntries = ref([]);
const filteredDataEntries = ref([]);
const activeTab = ref("all");
const selectedEntries = ref([]);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showImportModal = ref(false);
const showExportModal = ref(false);
const showBulkActionModal = ref(false);
const showBackupModal = ref(false);
const showAuditModal = ref(false);
const selectedEntry = ref(null);
const isLoading = ref(false);
const isSaving = ref(false);
const searchQuery = ref("");
const bulkAction = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(20);

// Sorting
const sortBy = ref("createdAt");
const sortOrder = ref("desc");

// Mock data from composable
const dataCategories = generateDataCategories();
const permissionRoles = generatePermissionRoles();
const exportFormats = generateExportFormats();
const backupHistory = ref(generateBackupHistory());
const auditLogs = ref(generateAuditLogs());

// Form for new/edit entry
const entryForm = ref({
  id: null,
  type: "patient",
  title: "",
  description: "",
  category: "medical",
  status: "active",
  priority: "normal",
  tags: [],
  metadata: {},
  data: {},
  permissions: {
    read: ["admin", "doctor", "nurse"],
    write: ["admin", "doctor"],
    delete: ["admin"],
  },
  retention: {
    keepFor: 7, // years
    autoDelete: false,
    archiveAfter: 2, // years
  },
  compliance: {
    encrypted: true,
    auditTrail: true,
    anonymized: false,
    consentRequired: true,
  },
});

// Export settings
const exportSettings = ref({
  format: "csv",
  includeMetadata: true,
  includePermissions: false,
  dateRange: {
    start: null,
    end: null,
  },
  categories: [],
  encryption: true,
  compression: true,
});

// Data Management Settings
const dataSettings = ref({
  autoBackup: true,
  backupFrequency: "daily",
  compressionEnabled: true,
  encryptionLevel: "AES-256",
  dataRetentionPeriod: 7,
  auditLogRetention: 10,
  anonymizationRules: {
    enabled: true,
    patientDataAfter: 30,
    logDataAfter: 90,
  },
});

// Tabs with counts and colors
const dataTabs = ref([
  { id: "all", label: "All Data", icon: "📊", count: 0, color: "blue" },
  {
    id: "patient",
    label: "Patient Records",
    icon: "👥",
    count: 0,
    color: "green",
  },
  { id: "medical", label: "Medical Data", icon: "🏥", count: 0, color: "red" },
  {
    id: "appointment",
    label: "Appointments",
    icon: "📅",
    count: 0,
    color: "purple",
  },
  { id: "billing", label: "Billing", icon: "💰", count: 0, color: "emerald" },
  { id: "lab", label: "Lab Results", icon: "🧪", count: 0, color: "orange" },
  { id: "archived", label: "Archived", icon: "📦", count: 0, color: "gray" },
  { id: "system", label: "System Data", icon: "⚙️", count: 0, color: "slate" },
]);

// Computed Properties
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedEntries.value.slice(start, end);
});

const sortedEntries = computed(() => {
  const sorted = [...filteredDataEntries.value];
  sorted.sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];

    if (sortBy.value === "createdAt" || sortBy.value === "updatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  return sorted;
});

const totalPages = computed(() => {
  return Math.ceil(filteredDataEntries.value.length / itemsPerPage.value);
});

const hasSelectedEntries = computed(() => {
  return selectedEntries.value.length > 0;
});

const totalDataSize = computed(() => {
  return dataEntries.value.reduce(
    (total, entry) => total + (entry.size || 0),
    0
  );
});

const activeDataCount = computed(() => {
  return dataEntries.value.filter((entry) => entry.status === "active").length;
});

const archivedDataCount = computed(() => {
  return dataEntries.value.filter((entry) => entry.status === "archived")
    .length;
});

const encryptedDataCount = computed(() => {
  return dataEntries.value.filter((entry) => entry.compliance?.encrypted)
    .length;
});

const criticalDataCount = computed(() => {
  return dataEntries.value.filter(
    (entry) => entry.priority === "high" || entry.priority === "critical"
  ).length;
});

// Methods
const loadDataEntries = async () => {
  isLoading.value = true;
  try {
    // API call would go here
    // const response = await $fetch('/api/admin/data')

    // Using mock data
    await new Promise((resolve) => setTimeout(resolve, 800));
    dataEntries.value = generateMockDataEntries();

    filterDataEntries();
    updateTabCounts();
  } catch (error) {
    console.error("Error loading data entries:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterDataEntries = () => {
  let filtered = dataEntries.value;

  // Filter by active tab
  if (activeTab.value === "archived") {
    filtered = filtered.filter((entry) => entry.status === "archived");
  } else if (activeTab.value !== "all") {
    filtered = filtered.filter(
      (entry) =>
        entry.type === activeTab.value || entry.category === activeTab.value
    );
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.category.toLowerCase().includes(query) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        (entry.metadata &&
          Object.values(entry.metadata).some((val) =>
            String(val).toLowerCase().includes(query)
          ))
    );
  }

  filteredDataEntries.value = filtered;
  currentPage.value = 1;
};

const updateTabCounts = () => {
  dataTabs.value.forEach((tab) => {
    if (tab.id === "all") {
      tab.count = dataEntries.value.length;
    } else if (tab.id === "archived") {
      tab.count = dataEntries.value.filter(
        (entry) => entry.status === "archived"
      ).length;
    } else {
      tab.count = dataEntries.value.filter(
        (entry) => entry.type === tab.id || entry.category === tab.id
      ).length;
    }
  });
};

const createDataEntry = async () => {
  isSaving.value = true;
  try {
    const newEntry = {
      ...entryForm.value,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Admin",
      lastModifiedBy: "Admin",
      size: Math.floor(Math.random() * 10000000),
    };

    // API call would go here
    // await $fetch('/api/admin/data', { method: 'POST', body: newEntry })

    dataEntries.value.unshift(newEntry);
    resetForm();
    showCreateModal.value = false;
    filterDataEntries();
    updateTabCounts();
  } catch (error) {
    console.error("Error creating data entry:", error);
  } finally {
    isSaving.value = false;
  }
};

const updateDataEntry = async () => {
  isSaving.value = true;
  try {
    const updatedEntry = {
      ...entryForm.value,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: "Admin",
    };

    // API call would go here
    // await $fetch(`/api/admin/data/${entryForm.value.id}`, { method: 'PUT', body: updatedEntry })

    const index = dataEntries.value.findIndex(
      (entry) => entry.id === entryForm.value.id
    );
    if (index !== -1) {
      dataEntries.value[index] = {
        ...dataEntries.value[index],
        ...updatedEntry,
      };
    }

    resetForm();
    showEditModal.value = false;
    filterDataEntries();
    updateTabCounts();
  } catch (error) {
    console.error("Error updating data entry:", error);
  } finally {
    isSaving.value = false;
  }
};

const deleteDataEntries = async (entryIds) => {
  try {
    // API call would go here
    // await $fetch('/api/admin/data/bulk-delete', { method: 'DELETE', body: { ids: entryIds } })

    dataEntries.value = dataEntries.value.filter(
      (entry) => !entryIds.includes(entry.id)
    );
    selectedEntries.value = [];
    showDeleteModal.value = false;
    filterDataEntries();
    updateTabCounts();
  } catch (error) {
    console.error("Error deleting data entries:", error);
  }
};

const archiveDataEntries = async (entryIds) => {
  try {
    // API call would go here
    // await $fetch('/api/admin/data/bulk-archive', { method: 'POST', body: { ids: entryIds } })

    dataEntries.value.forEach((entry) => {
      if (entryIds.includes(entry.id)) {
        entry.status = "archived";
        entry.archivedAt = new Date().toISOString();
      }
    });

    selectedEntries.value = [];
    filterDataEntries();
    updateTabCounts();
  } catch (error) {
    console.error("Error archiving data entries:", error);
  }
};

const restoreDataEntries = async (entryIds) => {
  try {
    // API call would go here
    // await $fetch('/api/admin/data/bulk-restore', { method: 'POST', body: { ids: entryIds } })

    dataEntries.value.forEach((entry) => {
      if (entryIds.includes(entry.id)) {
        entry.status = "active";
        delete entry.archivedAt;
      }
    });

    selectedEntries.value = [];
    filterDataEntries();
    updateTabCounts();
  } catch (error) {
    console.error("Error restoring data entries:", error);
  }
};

const exportData = async () => {
  try {
    // API call would go here
    // const response = await $fetch('/api/admin/data/export', { method: 'POST', body: exportSettings.value })

    console.log("Exporting data with settings:", exportSettings.value);
    // Simulate file download
    const blob = new Blob(["Mock data export"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data_export_${Date.now()}.${exportSettings.value.format}`;
    a.click();
    URL.revokeObjectURL(url);

    showExportModal.value = false;
  } catch (error) {
    console.error("Error exporting data:", error);
  }
};

const executeBulkAction = async () => {
  if (!bulkAction.value || selectedEntries.value.length === 0) return;

  try {
    switch (bulkAction.value) {
      case "archive":
        await archiveDataEntries(selectedEntries.value);
        break;
      case "restore":
        await restoreDataEntries(selectedEntries.value);
        break;
      case "delete":
        await deleteDataEntries(selectedEntries.value);
        break;
    }

    bulkAction.value = "";
    showBulkActionModal.value = false;
  } catch (error) {
    console.error("Error executing bulk action:", error);
  }
};

const openEditModal = (entry) => {
  entryForm.value = { ...entry };
  showEditModal.value = true;
};

const openDetailModal = (entry) => {
  selectedEntry.value = entry;
  showDetailModal.value = true;
};

const selectAllEntries = () => {
  if (selectedEntries.value.length === paginatedEntries.value.length) {
    selectedEntries.value = [];
  } else {
    selectedEntries.value = paginatedEntries.value.map((entry) => entry.id);
  }
};

const changePage = (page) => {
  currentPage.value = page;
  selectedEntries.value = [];
};

const changeItemsPerPage = (items) => {
  itemsPerPage.value = items;
  currentPage.value = 1;
};

const sortEntries = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "desc";
  }
};

const resetForm = () => {
  entryForm.value = {
    id: null,
    type: "patient",
    title: "",
    description: "",
    category: "medical",
    status: "active",
    priority: "normal",
    tags: [],
    metadata: {},
    data: {},
    permissions: {
      read: ["admin", "doctor", "nurse"],
      write: ["admin", "doctor"],
      delete: ["admin"],
    },
    retention: {
      keepFor: 7,
      autoDelete: false,
      archiveAfter: 2,
    },
    compliance: {
      encrypted: true,
      auditTrail: true,
      anonymized: false,
      consentRequired: true,
    },
  };
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status) => {
  const colors = {
    active:
      "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300",
    archived:
      "text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300",
    deleted: "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300",
    processing:
      "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
  };
  return colors[status] || colors.active;
};

const getPriorityColor = (priority) => {
  const colors = {
    critical: "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300",
    high: "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300",
    normal: "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
    low: "text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300",
  };
  return colors[priority] || colors.normal;
};

// Watch for tab changes
watch(activeTab, () => {
  filterDataEntries();
});

watch(searchQuery, () => {
  filterDataEntries();
});

// Load data on mount
onMounted(async () => {
  await loadDataEntries();

  // Check if there's a specific entry to show
  if (route.query.id) {
    const entry = dataEntries.value.find(
      (e) => e.id === parseInt(route.query.id)
    );
    if (entry) {
      openDetailModal(entry);
    }
  }
});
</script>

<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          Data Management
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage healthcare data, records, and compliance •
          {{ dataEntries.length }} total entries
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="showBackupModal = true"
          class="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          Backup
        </button>

        <button
          @click="showExportModal = true"
          class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Export
        </button>

        <button
          @click="showCreateModal = true"
          class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"></path>
          </svg>
          Add Data
        </button>

        <button
          v-if="hasSelectedEntries"
          @click="showBulkActionModal = true"
          class="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          Bulk Actions ({{ selectedEntries.length }})
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Total Entries
            </p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ dataEntries.length }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">📊</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Total Size
            </p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatFileSize(totalDataSize) }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">💾</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Active Records
            </p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ activeDataCount }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">✅</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Encrypted
            </p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ encryptedDataCount }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">🔐</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Critical Priority
            </p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ criticalDataCount }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="text-red-600 dark:text-red-400">⚠️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters and Search -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <!-- Search and Quick Actions -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, description, category, tags, or metadata..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          <svg
            class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div class="flex items-center gap-3">
          <!-- Sort dropdown -->
          <select
            v-model="sortBy"
            @change="filterDataEntries"
            class="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="createdAt">Sort by Created</option>
            <option value="updatedAt">Sort by Modified</option>
            <option value="title">Sort by Title</option>
            <option value="category">Sort by Category</option>
            <option value="priority">Sort by Priority</option>
            <option value="size">Sort by Size</option>
          </select>

          <!-- Items per page -->
          <select
            v-model="itemsPerPage"
            @change="changeItemsPerPage"
            class="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>

          <button
            @click="showAuditModal = true"
            class="px-3 py-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            🔍 Audit Logs
          </button>
        </div>
      </div>

      <!-- Enhanced Tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in dataTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border',
            activeTab === tab.id
              ? `bg-${tab.color}-600 text-white border-${tab.color}-600`
              : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600`,
          ]">
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count > 0"
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300',
            ]">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Data Entries Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-slate-700/60 bg-slate-800/80">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              :checked="
                selectedEntries.length === paginatedEntries.length &&
                paginatedEntries.length > 0
              "
              @change="selectAllEntries"
              class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" />
            <h2
              class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Data Entries</span>
              <span
                class="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({{ filteredDataEntries.length }} of {{ dataEntries.length }})
              </span>
            </h2>
          </div>

          <div class="flex items-center gap-4">
            <div
              v-if="hasSelectedEntries"
              class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>{{ selectedEntries.length }} selected</span>
              <button
                @click="selectedEntries = []"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Refresh button -->
            <button
              @click="loadDataEntries"
              :disabled="isLoading"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
              title="Refresh data">
              <svg
                :class="{ 'animate-spin': isLoading }"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div
          class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">Loading data entries...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredDataEntries.length === 0"
        class="p-12 text-center">
        <div class="text-6xl mb-4">📊</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No data entries found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{
            searchQuery
              ? "Try adjusting your search terms or filters"
              : "Create your first data entry to get started"
          }}
        </p>
        <button
          v-if="!searchQuery"
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Data Entry
        </button>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr
              class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
              <th class="text-left px-4 py-3 font-semibold w-10">
                <input
                  type="checkbox"
                  :checked="
                    selectedEntries.length === paginatedEntries.length &&
                    paginatedEntries.length > 0
                  "
                  @change="selectAllEntries"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortEntries('title')">
                <div class="flex items-center gap-1">
                  <span>Title & Category</span>
                  <svg
                    v-if="sortBy === 'title'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortEntries('size')">
                <div class="flex items-center gap-1">
                  <span>Size & Type</span>
                  <svg
                    v-if="sortBy === 'size'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortEntries('priority')">
                <div class="flex items-center gap-1">
                  <span>Priority & Status</span>
                  <svg
                    v-if="sortBy === 'priority'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th class="text-left px-4 py-3 font-semibold">Compliance</th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortEntries('updatedAt')">
                <div class="flex items-center gap-1">
                  <span>Last Modified</span>
                  <svg
                    v-if="sortBy === 'updatedAt'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th class="text-left px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="entry in paginatedEntries"
              :key="entry.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <!-- Selection checkbox -->
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedEntries.includes(entry.id)"
                  @change="
                    selectedEntries.includes(entry.id)
                      ? (selectedEntries = selectedEntries.filter(
                          (id) => id !== entry.id
                        ))
                      : selectedEntries.push(entry.id)
                  "
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </td>

              <!-- Title and Category -->
              <td class="px-4 py-4">
                <div class="max-w-sm">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">{{
                      dataCategories.find((c) => c.value === entry.category)
                        ?.icon || "📄"
                    }}</span>
                    <h3
                      class="font-semibold text-gray-900 dark:text-white truncate">
                      {{ entry.title }}
                    </h3>
                  </div>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {{ entry.description }}
                  </p>
                  <div class="flex flex-wrap gap-1">
                    <span
                      class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {{
                        dataCategories.find((c) => c.value === entry.category)
                          ?.label || entry.category
                      }}
                    </span>
                    <span
                      v-for="tag in entry.tags.slice(0, 2)"
                      :key="tag"
                      class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded">
                      {{ tag }}
                    </span>
                    <span
                      v-if="entry.tags.length > 2"
                      class="text-xs text-gray-500 dark:text-gray-400">
                      +{{ entry.tags.length - 2 }} more
                    </span>
                  </div>
                </div>
              </td>

              <!-- Size and Type -->
              <td class="px-4 py-4">
                <div class="text-sm">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ formatFileSize(entry.size) }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ entry.type }}
                  </p>
                  <div
                    v-if="entry.metadata?.recordCount"
                    class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ entry.metadata.recordCount }} records
                  </div>
                </div>
              </td>

              <!-- Priority and Status -->
              <td class="px-4 py-4">
                <div class="flex flex-col gap-2">
                  <span
                    :class="getPriorityColor(entry.priority)"
                    class="px-2 py-1 text-xs font-semibold rounded-full uppercase w-fit">
                    {{ entry.priority }}
                  </span>
                  <span
                    :class="getStatusColor(entry.status)"
                    class="px-2 py-1 text-xs font-semibold rounded-full uppercase w-fit">
                    {{ entry.status }}
                  </span>
                </div>
              </td>

              <!-- Compliance -->
              <td class="px-4 py-4">
                <div class="flex flex-col gap-1 text-xs">
                  <div class="flex items-center gap-1">
                    <span
                      :class="
                        entry.compliance?.encrypted
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      ">
                      {{ entry.compliance?.encrypted ? "🔐" : "🔓" }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-400">{{
                      entry.compliance?.encrypted
                        ? "Encrypted"
                        : "Not Encrypted"
                    }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span
                      :class="
                        entry.compliance?.auditTrail
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400'
                      ">
                      {{ entry.compliance?.auditTrail ? "📋" : "📄" }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-400">{{
                      entry.compliance?.auditTrail ? "Audited" : "No Audit"
                    }}</span>
                  </div>
                  <div
                    v-if="entry.compliance?.hipaaCompliant"
                    class="flex items-center gap-1">
                    <span class="text-blue-600 dark:text-blue-400">🏥</span>
                    <span class="text-gray-600 dark:text-gray-400">HIPAA</span>
                  </div>
                </div>
              </td>

              <!-- Last Modified -->
              <td class="px-4 py-4">
                <div class="text-sm">
                  <p class="text-gray-900 dark:text-white">
                    {{ formatDate(entry.updatedAt) }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-400">
                    by {{ entry.lastModifiedBy }}
                  </p>
                  <p
                    v-if="entry.backup?.lastBackup"
                    class="text-xs text-green-600 dark:text-green-400 mt-1">
                    💾 {{ formatDate(entry.backup.lastBackup) }}
                  </p>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="openDetailModal(entry)"
                    class="icon-btn view-btn"
                    title="View Details">
                    👁️
                  </button>

                  <button
                    @click="openEditModal(entry)"
                    class="icon-btn edit-btn"
                    title="Edit Entry">
                    ✏️
                  </button>

                  <button
                    v-if="entry.status === 'archived'"
                    @click="restoreDataEntries([entry.id])"
                    class="icon-btn restore-btn"
                    title="Restore">
                    ↩️
                  </button>

                  <button
                    v-else
                    @click="archiveDataEntries([entry.id])"
                    class="icon-btn archive-btn"
                    title="Archive">
                    📦
                  </button>

                  <button
                    @click="deleteDataEntries([entry.id])"
                    class="icon-btn delete-btn"
                    title="Delete">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(currentPage * itemsPerPage, filteredDataEntries.length)
              }}
              of {{ filteredDataEntries.length }} entries
            </p>

            <select
              v-model="itemsPerPage"
              @change="changeItemsPerPage"
              class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >per page</span
            >
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="changePage(1)"
              :disabled="currentPage === 1"
              class="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              ⏮️
            </button>

            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              Previous
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="page in Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => {
                    const start = Math.max(
                      1,
                      Math.min(currentPage - 2, totalPages - 4)
                    );
                    return start + i;
                  }
                )"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg',
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                ]">
                {{ page }}
              </button>
            </div>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              Next
            </button>

            <button
              @click="changePage(totalPages)"
              :disabled="currentPage === totalPages"
              class="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              ⏭️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showCreateModal || showEditModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{
                  showCreateModal ? "Create New Data Entry" : "Edit Data Entry"
                }}
              </h3>
              <button
                @click="
                  showCreateModal = false;
                  showEditModal = false;
                  resetForm();
                "
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <form
            @submit.prevent="
              showCreateModal ? createDataEntry() : updateDataEntry()
            "
            class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Type *</label
                    >
                    <select
                      v-model="entryForm.type"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option value="patient">Patient Data</option>
                      <option value="medical">Medical Records</option>
                      <option value="appointment">Appointment Data</option>
                      <option value="billing">Billing Data</option>
                      <option value="lab">Lab Results</option>
                      <option value="pharmacy">Pharmacy Data</option>
                      <option value="system">System Data</option>
                      <option value="archived">Archived Data</option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Category *</label
                    >
                    <select
                      v-model="entryForm.category"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option
                        v-for="category in dataCategories"
                        :key="category.value"
                        :value="category.value">
                        {{ category.icon }} {{ category.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Title *</label
                  >
                  <input
                    v-model="entryForm.title"
                    type="text"
                    required
                    maxlength="200"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter data entry title" />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ entryForm.title.length }}/200 characters
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Description *</label
                  >
                  <textarea
                    v-model="entryForm.description"
                    required
                    rows="4"
                    maxlength="1000"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe the data entry and its purpose">
                  </textarea>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ entryForm.description.length }}/1000 characters
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Priority *</label
                    >
                    <select
                      v-model="entryForm.priority"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option value="low">🟢 Low Priority</option>
                      <option value="normal">🔵 Normal Priority</option>
                      <option value="high">🟡 High Priority</option>
                      <option value="critical">🔴 Critical Priority</option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Status *</label
                    >
                    <select
                      v-model="entryForm.status"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option value="active">✅ Active</option>
                      <option value="archived">📦 Archived</option>
                      <option value="processing">⏳ Processing</option>
                      <option value="deleted">🗑️ Deleted</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                    >Permissions</label
                  >

                  <div class="space-y-4">
                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >Read Access</label
                      >
                      <div class="flex flex-wrap gap-2">
                        <label
                          v-for="role in permissionRoles"
                          :key="role.value"
                          class="flex items-center gap-2">
                          <input
                            v-model="entryForm.permissions.read"
                            type="checkbox"
                            :value="role.value"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span
                            class="text-sm text-gray-700 dark:text-gray-300"
                            >{{ role.label }}</span
                          >
                        </label>
                      </div>
                    </div>

                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >Write Access</label
                      >
                      <div class="flex flex-wrap gap-2">
                        <label
                          v-for="role in permissionRoles"
                          :key="role.value"
                          class="flex items-center gap-2">
                          <input
                            v-model="entryForm.permissions.write"
                            type="checkbox"
                            :value="role.value"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span
                            class="text-sm text-gray-700 dark:text-gray-300"
                            >{{ role.label }}</span
                          >
                        </label>
                      </div>
                    </div>

                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >Delete Access</label
                      >
                      <div class="flex flex-wrap gap-2">
                        <label
                          v-for="role in permissionRoles"
                          :key="role.value"
                          class="flex items-center gap-2">
                          <input
                            v-model="entryForm.permissions.delete"
                            type="checkbox"
                            :value="role.value"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span
                            class="text-sm text-gray-700 dark:text-gray-300"
                            >{{ role.label }}</span
                          >
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                    >Data Retention</label
                  >

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >Keep For (Years)</label
                      >
                      <input
                        v-model.number="entryForm.retention.keepFor"
                        type="number"
                        min="1"
                        max="50"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2"
                        >Archive After (Years)</label
                      >
                      <input
                        v-model.number="entryForm.retention.archiveAfter"
                        type="number"
                        min="1"
                        max="25"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  <div class="mt-3">
                    <label class="flex items-center gap-2">
                      <input
                        v-model="entryForm.retention.autoDelete"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="text-sm text-gray-700 dark:text-gray-300"
                        >Enable automatic deletion after retention period</span
                      >
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                    >Compliance Settings</label
                  >

                  <div class="space-y-3">
                    <label class="flex items-center gap-2">
                      <input
                        v-model="entryForm.compliance.encrypted"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="text-sm text-gray-700 dark:text-gray-300"
                        >🔐 Enable encryption</span
                      >
                    </label>

                    <label class="flex items-center gap-2">
                      <input
                        v-model="entryForm.compliance.auditTrail"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="text-sm text-gray-700 dark:text-gray-300"
                        >📋 Enable audit trail</span
                      >
                    </label>

                    <label class="flex items-center gap-2">
                      <input
                        v-model="entryForm.compliance.anonymized"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="text-sm text-gray-700 dark:text-gray-300"
                        >🎭 Anonymize data</span
                      >
                    </label>

                    <label class="flex items-center gap-2">
                      <input
                        v-model="entryForm.compliance.consentRequired"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="text-sm text-gray-700 dark:text-gray-300"
                        >📝 Require consent</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button
                type="button"
                @click="
                  showCreateModal = false;
                  showEditModal = false;
                  resetForm();
                "
                class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                <svg
                  v-if="isSaving"
                  class="animate-spin w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{
                  isSaving
                    ? "Saving..."
                    : showCreateModal
                    ? "Create Entry"
                    : "Update Entry"
                }}
              </button>
            </div>
          </form>
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
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Export Data
              </h3>
              <button
                @click="showExportModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                >Export Format</label
              >
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label
                  v-for="format in exportFormats"
                  :key="format.value"
                  class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <input
                    v-model="exportSettings.format"
                    type="radio"
                    :value="format.value"
                    class="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <div class="text-lg">{{ format.icon }}</div>
                    <div
                      class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ format.label }}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                >Categories to Export</label
              >
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="category in dataCategories"
                  :key="category.value"
                  class="flex items-center gap-2">
                  <input
                    v-model="exportSettings.categories"
                    type="checkbox"
                    :value="category.value"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >{{ category.icon }} {{ category.label }}</span
                  >
                </label>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                >Export Options</label
              >
              <div class="space-y-3">
                <label class="flex items-center gap-2">
                  <input
                    v-model="exportSettings.includeMetadata"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Include metadata</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="exportSettings.includePermissions"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Include permissions</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="exportSettings.encryption"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >🔐 Encrypt export file</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="exportSettings.compression"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >🗜️ Compress export file</span
                  >
                </label>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="showExportModal = false"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button
                @click="exportData"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export Data
              </button>
            </div>
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
        v-if="showDetailModal && selectedEntry"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <div
                  class="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border">
                  <span class="text-2xl">{{
                    dataCategories.find(
                      (c) => c.value === selectedEntry.category
                    )?.icon || "📄"
                  }}</span>
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ selectedEntry.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ selectedEntry.description }}
                  </p>
                  <div
                    class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span>📊 {{ formatFileSize(selectedEntry.size) }}</span>
                    <span>📅 {{ formatDate(selectedEntry.createdAt) }}</span>
                    <span>👤 {{ selectedEntry.createdBy }}</span>
                  </div>
                </div>
              </div>
              <button
                @click="showDetailModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Main Content -->
              <div class="lg:col-span-2 space-y-6">
                <div>
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Data Overview
                  </h4>
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt
                          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </dt>
                        <dd
                          class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                          {{ selectedEntry.type }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </dt>
                        <dd
                          class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                          {{
                            dataCategories.find(
                              (c) => c.value === selectedEntry.category
                            )?.label || selectedEntry.category
                          }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </dt>
                        <dd class="mt-1">
                          <span
                            :class="getStatusColor(selectedEntry.status)"
                            class="px-2 py-1 text-xs font-semibold rounded-full uppercase">
                            {{ selectedEntry.status }}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Priority
                        </dt>
                        <dd class="mt-1">
                          <span
                            :class="getPriorityColor(selectedEntry.priority)"
                            class="px-2 py-1 text-xs font-semibold rounded-full uppercase">
                            {{ selectedEntry.priority }}
                          </span>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedEntry.tags?.length">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Tags
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in selectedEntry.tags"
                      :key="tag"
                      class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="
                    selectedEntry.metadata &&
                    Object.keys(selectedEntry.metadata).length > 0
                  ">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Metadata
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      v-for="(value, key) in selectedEntry.metadata"
                      :key="key"
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <dt
                        class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {{ key.replace(/([A-Z])/g, " $1").trim() }}
                      </dt>
                      <dd
                        class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {{
                          Array.isArray(value)
                            ? value.join(", ")
                            : typeof value === "object"
                            ? JSON.stringify(value)
                            : value
                        }}
                      </dd>
                    </div>
                  </div>
                </div>

                <div
                  v-if="
                    selectedEntry.data &&
                    Object.keys(selectedEntry.data).length > 0
                  ">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Data Content
                  </h4>
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <pre
                      class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                      >{{ JSON.stringify(selectedEntry.data, null, 2) }}</pre
                    >
                  </div>
                </div>
              </div>

              <!-- Sidebar -->
              <div class="space-y-6">
                <!-- Permissions -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Permissions
                  </h4>
                  <div class="space-y-3">
                    <div>
                      <span
                        class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                        >Read Access</span
                      >
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="role in selectedEntry.permissions.read"
                          :key="role"
                          class="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                          {{
                            permissionRoles.find((r) => r.value === role)
                              ?.label || role
                          }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span
                        class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                        >Write Access</span
                      >
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="role in selectedEntry.permissions.write"
                          :key="role"
                          class="px-2 py-0.5 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                          {{
                            permissionRoles.find((r) => r.value === role)
                              ?.label || role
                          }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span
                        class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                        >Delete Access</span
                      >
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="role in selectedEntry.permissions.delete"
                          :key="role"
                          class="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                          {{
                            permissionRoles.find((r) => r.value === role)
                              ?.label || role
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Retention Policy -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Retention Policy
                  </h4>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Keep For</span
                      >
                      <span
                        class="text-sm font-medium text-gray-900 dark:text-white"
                        >{{ selectedEntry.retention.keepFor }} years</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Archive After</span
                      >
                      <span
                        class="text-sm font-medium text-gray-900 dark:text-white"
                        >{{ selectedEntry.retention.archiveAfter }} years</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Auto Delete</span
                      >
                      <span
                        :class="
                          selectedEntry.retention.autoDelete
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        "
                        class="text-sm font-medium">
                        {{
                          selectedEntry.retention.autoDelete
                            ? "Enabled"
                            : "Disabled"
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Compliance -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Compliance
                  </h4>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Encrypted</span
                      >
                      <span
                        :class="
                          selectedEntry.compliance.encrypted
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        "
                        class="text-sm font-medium">
                        {{
                          selectedEntry.compliance.encrypted
                            ? "🔐 Yes"
                            : "🔓 No"
                        }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Audit Trail</span
                      >
                      <span
                        :class="
                          selectedEntry.compliance.auditTrail
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        "
                        class="text-sm font-medium">
                        {{
                          selectedEntry.compliance.auditTrail
                            ? "📋 Enabled"
                            : "📄 Disabled"
                        }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Anonymized</span
                      >
                      <span
                        :class="
                          selectedEntry.compliance.anonymized
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        "
                        class="text-sm font-medium">
                        {{
                          selectedEntry.compliance.anonymized ? "🎭 Yes" : "No"
                        }}
                      </span>
                    </div>
                    <div
                      v-if="selectedEntry.compliance.hipaaCompliant"
                      class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >HIPAA Compliant</span
                      >
                      <span
                        class="text-green-600 dark:text-green-400 text-sm font-medium"
                        >🏥 Yes</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Backup Information -->
                <div
                  v-if="selectedEntry.backup"
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Backup Status
                  </h4>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Last Backup</span
                      >
                      <span
                        class="text-sm font-medium text-gray-900 dark:text-white"
                        >{{ formatDate(selectedEntry.backup.lastBackup) }}</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Backup Count</span
                      >
                      <span
                        class="text-sm font-medium text-gray-900 dark:text-white"
                        >{{ selectedEntry.backup.backupCount }}</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Auto Backup</span
                      >
                      <span
                        :class="
                          selectedEntry.backup.autoBackup
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        "
                        class="text-sm font-medium">
                        {{
                          selectedEntry.backup.autoBackup
                            ? "✅ Enabled"
                            : "❌ Disabled"
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button
                @click="showDetailModal = false"
                class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Close
              </button>
              <button
                @click="
                  openEditModal(selectedEntry);
                  showDetailModal = false;
                "
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bulk Action Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showBulkActionModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bulk Actions
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Select an action to apply to {{ selectedEntries.length }} selected
            entries:
          </p>

          <div class="space-y-2 mb-6">
            <label class="flex items-center gap-2">
              <input
                v-model="bulkAction"
                type="radio"
                value="archive"
                class="rounded-full" />
              <span class="text-sm">📦 Archive Entries</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="bulkAction"
                type="radio"
                value="restore"
                class="rounded-full" />
              <span class="text-sm">↩️ Restore Entries</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="bulkAction"
                type="radio"
                value="delete"
                class="rounded-full" />
              <span class="text-sm text-red-600">🗑️ Delete Entries</span>
            </label>
          </div>

          <div class="flex justify-end gap-3">
            <button
              @click="
                showBulkActionModal = false;
                bulkAction = '';
              "
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Cancel
            </button>
            <button
              @click="executeBulkAction"
              :disabled="!bulkAction"
              :class="[
                'px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50',
                bulkAction === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700',
              ]">
              Execute Action
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
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Data Entries
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete {{ selectedEntries.length }} data
            entries? This action cannot be undone and will permanently remove
            all associated data, metadata, and backups.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="deleteDataEntries(selectedEntries)"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete Entries
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backup Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showBackupModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Data Backup Management
              </h3>
              <button
                @click="showBackupModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- Backup Actions -->
            <div class="flex gap-4">
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                🔄 Create Full Backup
              </button>
              <button
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                ⚡ Incremental Backup
              </button>
              <button
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                ⚙️ Backup Settings
              </button>
            </div>

            <!-- Backup History -->
            <div>
              <h4
                class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Recent Backups
              </h4>
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead>
                    <tr
                      class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                      <th class="text-left px-4 py-3 font-semibold">Date</th>
                      <th class="text-left px-4 py-3 font-semibold">Type</th>
                      <th class="text-left px-4 py-3 font-semibold">Status</th>
                      <th class="text-left px-4 py-3 font-semibold">Size</th>
                      <th class="text-left px-4 py-3 font-semibold">
                        Duration
                      </th>
                      <th class="text-left px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr
                      v-for="backup in backupHistory"
                      :key="backup.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td class="px-4 py-3">{{ formatDate(backup.date) }}</td>
                      <td class="px-4 py-3">
                        <span
                          :class="
                            backup.type === 'full'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          "
                          class="px-2 py-1 text-xs font-semibold rounded-full uppercase">
                          {{ backup.type }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <span
                          :class="
                            backup.status === 'completed'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          ">
                          {{ backup.status === "completed" ? "✅" : "❌" }}
                          {{ backup.status }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        {{ formatFileSize(backup.size) }}
                      </td>
                      <td class="px-4 py-3">{{ backup.duration }}</td>
                      <td class="px-4 py-3">
                        <div class="flex gap-2">
                          <button
                            class="text-blue-600 hover:text-blue-700 text-sm">
                            Download
                          </button>
                          <button
                            class="text-green-600 hover:text-green-700 text-sm">
                            Restore
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Audit Log Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showAuditModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Data Audit Logs
              </h3>
              <button
                @click="showAuditModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr
                    class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                    <th class="text-left px-4 py-3 font-semibold">Timestamp</th>
                    <th class="text-left px-4 py-3 font-semibold">Action</th>
                    <th class="text-left px-4 py-3 font-semibold">User</th>
                    <th class="text-left px-4 py-3 font-semibold">Resource</th>
                    <th class="text-left px-4 py-3 font-semibold">Details</th>
                    <th class="text-left px-4 py-3 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="log in auditLogs"
                    :key="log.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td class="px-4 py-3">{{ formatDate(log.timestamp) }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                        {{ log.action }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div>
                        <p class="font-medium">{{ log.user }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ log.ipAddress }}
                        </p>
                      </div>
                    </td>
                    <td class="px-4 py-3">{{ log.resource }}</td>
                    <td class="px-4 py-3 max-w-xs truncate">
                      {{ log.details }}
                    </td>
                    <td class="px-4 py-3">
                      <span
                        :class="
                          log.result === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        ">
                        {{ log.result === "success" ? "✅" : "❌" }}
                        {{ log.result }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
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

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-size: 14px;
  transition: all 0.2s;
  background: transparent;
  cursor: pointer;
}
.icon-btn:hover {
  background: #1118271a;
  transform: scale(1.05);
}
.view-btn:hover {
  border-color: #3b82f6;
  background: #3b82f610;
  box-shadow: 0 0 0 2px #3b82f610;
}
.edit-btn:hover {
  border-color: #10b981;
  background: #10b98110;
  box-shadow: 0 0 0 2px #10b98110;
}
.archive-btn:hover {
  border-color: #f59e0b;
  background: #f59e0b10;
  box-shadow: 0 0 0 2px #f59e0b10;
}
.restore-btn:hover {
  border-color: #8b5cf6;
  background: #8b5cf610;
  box-shadow: 0 0 0 2px #8b5cf610;
}
.delete-btn:hover {
  border-color: #ef4444;
  background: #ef444410;
  box-shadow: 0 0 0 2px #ef444410;
}
:global(.dark) .icon-btn {
  border-color: #374151;
}
:global(.dark) .icon-btn:hover {
  background: #374151;
}
</style>

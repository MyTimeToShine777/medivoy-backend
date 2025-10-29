<!-- pages/admin/system.vue -->
<script setup lang="ts">
import { useSystemMock } from "~/composables/useSystemMock";

const {
  systemSettings,
  systemStats,
  addSetting,
  updateSetting,
  deleteSetting,
  resetToDefault,
  bulkDelete,
  bulkUpdate,
  validateSetting,
  exportSettings,
  importSettings,
  searchSettings,
  getSettingsByCategory,
  getRecentChanges,
  backupSettings,
  restoreSettings,
} = useSystemMock();

const searchQuery = ref("");
const filterCategory = ref("all");
const filterType = ref("all");
const filterEnvironment = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showResetModal = ref(false);
const showHistoryModal = ref(false);
const showImportModal = ref(false);
const showBulkModal = ref(false);
const selectedSetting = ref(null);
const settingToDelete = ref(null);
const settingToReset = ref(null);
const selectedItems = ref([]);
const isSubmitting = ref(false);
const viewMode = ref("grouped");
const showAdvancedSearch = ref(false);

const settingForm = ref({
  id: null,
  category: "General",
  key: "",
  name: "",
  value: "",
  type: "text",
  description: "",
  required: false,
  validation: "",
  isSecret: false,
  defaultValue: "",
  tags: [],
  environment: "production",
  options: [],
});

const importForm = ref({
  data: "",
  format: "json",
  overwrite: false,
  validateOnly: false,
});

const bulkAction = ref("");
const newTag = ref("");
const newOption = ref("");
const validationErrors = ref([]);
const importResults = ref(null);

const categories = [
  "General",
  "Security",
  "Database",
  "Email",
  "Notifications",
  "API",
  "Backup",
  "Logging",
  "Performance",
  "Integration",
  "Theme",
];
const settingTypes = [
  { value: "text", label: "Text", icon: "📝" },
  { value: "number", label: "Number", icon: "🔢" },
  { value: "boolean", label: "Boolean", icon: "☑️" },
  { value: "password", label: "Password", icon: "🔒" },
  { value: "select", label: "Select", icon: "📋" },
  { value: "textarea", label: "Textarea", icon: "📄" },
  { value: "json", label: "JSON", icon: "{}" },
  { value: "url", label: "URL", icon: "🔗" },
  { value: "email", label: "Email", icon: "📧" },
];
const environments = ["development", "staging", "production"];
const bulkActions = [
  {
    value: "delete",
    label: "Delete Selected",
    icon: "🗑️",
    color: "text-red-600",
  },
  {
    value: "environment",
    label: "Change Environment",
    icon: "🌍",
    color: "text-blue-600",
  },
  {
    value: "category",
    label: "Change Category",
    icon: "📁",
    color: "text-green-600",
  },
  {
    value: "export",
    label: "Export Selected",
    icon: "📤",
    color: "text-purple-600",
  },
];

const filteredSettings = computed(() => {
  let filtered = systemSettings.value;

  if (searchQuery.value) {
    filtered = searchSettings(searchQuery.value);
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter((s) => s.category === filterCategory.value);
  }

  if (filterType.value !== "all") {
    filtered = filtered.filter((s) => s.type === filterType.value);
  }

  if (filterEnvironment.value !== "all") {
    filtered = filtered.filter(
      (s) => s.environment === filterEnvironment.value
    );
  }

  return filtered.sort((a, b) => {
    // Sort by category first, then by name
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });
});

const groupedSettings = computed(() => {
  const groups = {};
  filteredSettings.value.forEach((setting) => {
    if (!groups[setting.category]) {
      groups[setting.category] = [];
    }
    groups[setting.category].push(setting);
  });
  return groups;
});

const recentChanges = computed(() => getRecentChanges(7));

const openAddModal = () => {
  resetForm();
  validationErrors.value = [];
  showAddModal.value = true;
};

const openEditModal = (setting) => {
  settingForm.value = {
    ...setting,
    tags: [...(setting.tags || [])],
    options: [...(setting.options || [])],
  };
  selectedSetting.value = setting;
  validationErrors.value = [];
  showEditModal.value = true;
};

const openDeleteModal = (setting) => {
  settingToDelete.value = setting;
  showDeleteModal.value = true;
};

const openResetModal = (setting) => {
  settingToReset.value = setting;
  showResetModal.value = true;
};

const openHistoryModal = (setting) => {
  selectedSetting.value = setting;
  showHistoryModal.value = true;
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

const openBulkModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select settings to perform bulk operations");
    return;
  }
  bulkAction.value = "";
  showBulkModal.value = true;
};

const resetForm = () => {
  settingForm.value = {
    id: null,
    category: "General",
    key: "",
    name: "",
    value: "",
    type: "text",
    description: "",
    required: false,
    validation: "",
    isSecret: false,
    defaultValue: "",
    tags: [],
    environment: "production",
    options: [],
  };
  newTag.value = "";
  newOption.value = "";
};

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !settingForm.value.tags.includes(tag)) {
    settingForm.value.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index) => {
  settingForm.value.tags.splice(index, 1);
};

const addOption = () => {
  const option = newOption.value.trim();
  if (option && !settingForm.value.options.includes(option)) {
    settingForm.value.options.push(option);
    newOption.value = "";
  }
};

const removeOption = (index) => {
  settingForm.value.options.splice(index, 1);
};

const saveSetting = async () => {
  try {
    isSubmitting.value = true;
    validationErrors.value = [];

    // Validate the setting
    const errors = validateSetting(settingForm.value);
    if (errors.length > 0) {
      validationErrors.value = errors;
      return;
    }

    const settingData = { ...settingForm.value };

    if (settingForm.value.id) {
      updateSetting(settingForm.value.id, settingData);
      alert("Setting updated successfully!");
    } else {
      addSetting(settingData);
      alert("Setting created successfully!");
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving setting:", error);
    alert(`Error saving setting: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    deleteSetting(settingToDelete.value.id);
    showDeleteModal.value = false;
    settingToDelete.value = null;
    alert("Setting deleted successfully!");
  } catch (error) {
    console.error("Error deleting setting:", error);
    alert(`Error deleting setting: ${error.message}`);
  }
};

const handleReset = async () => {
  try {
    resetToDefault(settingToReset.value.id);
    showResetModal.value = false;
    settingToReset.value = null;
    alert("Setting reset to default value successfully!");
  } catch (error) {
    console.error("Error resetting setting:", error);
    alert(`Error resetting setting: ${error.message}`);
  }
};

const handleBulkAction = async () => {
  try {
    if (bulkAction.value === "delete") {
      const result = bulkDelete(selectedItems.value);
      if (result.errors.length > 0) {
        alert(
          `Bulk delete completed with errors:\n${result.errors.join("\n")}`
        );
      } else {
        alert(`Successfully deleted ${result.deletedCount} settings`);
      }
    } else if (bulkAction.value === "export") {
      const selectedSettings = systemSettings.value.filter((s) =>
        selectedItems.value.includes(s.id)
      );
      const blob = new Blob([JSON.stringify(selectedSettings, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `selected-settings-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert(`Exported ${selectedSettings.length} settings`);
    }

    selectedItems.value = [];
    showBulkModal.value = false;
  } catch (error) {
    console.error("Error performing bulk action:", error);
    alert(`Error: ${error.message}`);
  }
};

const handleImport = async () => {
  try {
    if (!importForm.value.data.trim()) {
      alert("Please provide data to import");
      return;
    }

    const results = importSettings(importForm.value.data, {
      overwrite: importForm.value.overwrite,
      validateOnly: importForm.value.validateOnly,
    });

    importResults.value = results;

    if (!importForm.value.validateOnly) {
      const message = `Import completed:\n- Imported: ${results.imported}\n- Updated: ${results.updated}\n- Errors: ${results.errors.length}\n- Warnings: ${results.warnings.length}`;
      alert(message);
    }
  } catch (error) {
    console.error("Import error:", error);
    alert(`Import failed: ${error.message}`);
  }
};

const handleFileImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    importForm.value.data = e.target.result;
    importForm.value.format = file.name.endsWith(".csv") ? "csv" : "json";
  };
  reader.readAsText(file);
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
  if (selectedItems.value.length === filteredSettings.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredSettings.value.map((setting) => setting.id);
  }
};

const getTypeIcon = (type) => {
  const typeInfo = settingTypes.find((t) => t.value === type);
  return typeInfo ? typeInfo.icon : "📝";
};

const getTypeLabel = (type) => {
  const typeInfo = settingTypes.find((t) => t.value === type);
  return typeInfo ? typeInfo.label : type;
};

const formatValue = (setting) => {
  if (setting.isSecret) return setting.value;
  if (setting.type === "boolean")
    return setting.value === "true" ? "✅ Yes" : "❌ No";
  if (setting.type === "password") return "••••••••";
  if (setting.type === "json") {
    try {
      return JSON.stringify(JSON.parse(setting.value), null, 2);
    } catch {
      return setting.value;
    }
  }
  return setting.value;
};

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const clearFilters = () => {
  searchQuery.value = "";
  filterCategory.value = "all";
  filterType.value = "all";
  filterEnvironment.value = "all";
};

const duplicateSetting = (setting) => {
  const duplicate = {
    ...setting,
    id: null,
    name: `${setting.name} (Copy)`,
    key: `${setting.key}_copy`,
    tags: [...(setting.tags || [])],
    options: [...(setting.options || [])],
  };

  settingForm.value = duplicate;
  validationErrors.value = [];
  showAddModal.value = true;
};

// Watchers
watch(
  () => settingForm.value.type,
  (newType) => {
    if (newType !== "select" && newType !== "boolean") {
      settingForm.value.options = [];
    }
    if (
      newType === "boolean" &&
      !["true", "false"].includes(settingForm.value.value)
    ) {
      settingForm.value.value = "false";
    }
  }
);

// Auto-save draft functionality
const draftKey = "system-settings-draft";
watch(
  () => settingForm.value,
  (newForm) => {
    if (showAddModal.value || showEditModal.value) {
      localStorage.setItem(draftKey, JSON.stringify(newForm));
    }
  },
  { deep: true }
);

const loadDraft = () => {
  const draft = localStorage.getItem(draftKey);
  if (draft) {
    try {
      const parsed = JSON.parse(draft);
      if (confirm("A draft was found. Would you like to restore it?")) {
        settingForm.value = parsed;
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }
};

const clearDraft = () => {
  localStorage.removeItem(draftKey);
};

onMounted(() => {
  // Load any existing draft when component mounts
  loadDraft();
});

onUnmounted(() => {
  // Clear draft when component unmounts
  clearDraft();
});
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          System Settings
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Configure system parameters and application settings
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="backupSettings"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
          💾 Backup
        </button>
        <button
          @click="openImportModal"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
          📥 Import
        </button>
        <button
          @click="exportSettings('json')"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
          📤 Export
        </button>
        <button
          @click="openBulkModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50">
          🔧 Bulk ({{ selectedItems.length }})
        </button>
        <div
          class="flex rounded-lg border border-gray-300 dark:border-gray-700 p-1">
          <button
            @click="viewMode = 'grouped'"
            :class="
              viewMode === 'grouped'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            📂 Grouped
          </button>
          <button
            @click="viewMode = 'list'"
            :class="
              viewMode === 'list'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            📋 List
          </button>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          ⚙️ Add Setting
        </button>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Settings
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ systemStats.totalSettings }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">⚙️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Secret Settings
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ systemStats.secretSettings }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="text-red-600 dark:text-red-400">🔒</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Required Settings
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ systemStats.requiredSettings }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">⚠️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Categories
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ Object.keys(systemStats.categoryCounts).length }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">📂</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Recent Changes
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ systemStats.recentlyModified }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">🕐</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Production
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ systemStats.environmentCounts.production || 0 }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">🚀</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              With History
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ systemStats.settingsWithHistory }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <span class="text-indigo-600 dark:text-indigo-400">📈</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Filtered</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ filteredSettings.length }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <span class="text-pink-600 dark:text-pink-400">🔍</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div class="relative md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search settings..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Categories</option>
          <option
            v-for="category in Object.keys(systemStats.categoryCounts)"
            :key="category"
            :value="category">
            {{ category }} ({{ systemStats.categoryCounts[category] }})
          </option>
        </select>

        <select
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Types</option>
          <option
            v-for="type in settingTypes"
            :key="type.value"
            :value="type.value">
            {{ type.icon }} {{ type.label }}
          </option>
        </select>

        <select
          v-model="filterEnvironment"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Environments</option>
          <option v-for="env in environments" :key="env" :value="env">
            {{ env.charAt(0).toUpperCase() + env.slice(1) }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="
                selectedItems.length === filteredSettings.length &&
                filteredSettings.length > 0
              "
              @change="selectAllItems"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span class="text-gray-700 dark:text-gray-300"
              >Select All ({{ filteredSettings.length }})</span
            >
          </label>

          <button
            v-if="
              searchQuery ||
              filterCategory !== 'all' ||
              filterType !== 'all' ||
              filterEnvironment !== 'all'
            "
            @click="clearFilters"
            class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            ✕ Clear Filters
          </button>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Showing {{ filteredSettings.length }} of
          {{ systemStats.totalSettings }} settings
        </div>
      </div>
    </div>

    <!-- Recent Changes Widget -->
    <div
      v-if="recentChanges.length > 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
        📊 Recent Changes (Last 7 Days)
      </h3>
      <div class="space-y-2">
        <div
          v-for="change in recentChanges.slice(0, 5)"
          :key="change.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ getTypeIcon(change.type) }}</span>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ change.name }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ change.category }} • Modified by {{ change.modifiedBy }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-900 dark:text-white">
              {{ formatTimestamp(change.lastModified) }}
            </div>
            <button
              @click="openHistoryModal(change)"
              class="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              View History
            </button>
          </div>
        </div>
      </div>
      <div v-if="recentChanges.length > 5" class="text-center mt-4">
        <button
          class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all {{ recentChanges.length }} recent changes
        </button>
      </div>
    </div>

    <!-- Settings Display -->
    <div v-if="viewMode === 'grouped'">
      <div
        v-for="(settings, category) in groupedSettings"
        :key="category"
        class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ category }}
          </h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >{{ settings.length }} settings</span
            >
            <button
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              @click="exportSettings('json')">
              Export Category
            </button>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div
            v-for="setting in settings"
            :key="setting.id"
            class="p-6 border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
            <div class="flex items-start gap-4">
              <input
                type="checkbox"
                :checked="selectedItems.includes(setting.id)"
                @change="toggleItemSelection(setting.id)"
                class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD] mt-1" />

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">{{ getTypeIcon(setting.type) }}</span>
                  <h4
                    class="text-base font-semibold text-gray-900 dark:text-white">
                    {{ setting.name }}
                  </h4>

                  <div class="flex items-center gap-2">
                    <span
                      v-if="setting.required"
                      class="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full"
                      >Required</span
                    >
                    <span
                      v-if="setting.isSecret"
                      class="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 text-gray-300 text-xs rounded-full"
                      >🔒 Secret</span
                    >
                    <span
                      class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full"
                      >{{ setting.environment }}</span
                    >
                    <span
                      v-if="setting.hasHistory"
                      class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full"
                      >📈 History</span
                    >
                  </div>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {{ setting.description }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-gray-500 dark:text-gray-400 font-medium"
                        >Key:</span
                      >
                      <code
                        class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs"
                        >{{ setting.key }}</code
                      >
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-gray-500 dark:text-gray-400 font-medium"
                        >Type:</span
                      >
                      <span class="text-gray-900 dark:text-white">{{
                        getTypeLabel(setting.type)
                      }}</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-gray-500 dark:text-gray-400 font-medium"
                        >Value:</span
                      >
                      <span
                        class="text-gray-900 dark:text-white font-medium truncate"
                        >{{ formatValue(setting) }}</span
                      >
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-gray-500 dark:text-gray-400 font-medium"
                        >Default:</span
                      >
                      <span class="text-gray-600 dark:text-gray-400">{{
                        setting.defaultValue || "None"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="setting.tags && setting.tags.length > 0"
                  class="flex flex-wrap gap-1 mb-3">
                  <span
                    v-for="tag in setting.tags"
                    :key="tag"
                    class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded">
                    {{ tag }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    Last modified:
                    {{ formatTimestamp(setting.lastModified) }} by
                    {{ setting.modifiedBy }}
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      v-if="setting.hasHistory && setting.history.length > 0"
                      @click="openHistoryModal(setting)"
                      class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="View History">
                      📈
                    </button>
                    <button
                      @click="duplicateSetting(setting)"
                      class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Duplicate">
                      📋
                    </button>
                    <button
                      v-if="
                        setting.defaultValue &&
                        setting.defaultValue !== setting.value
                      "
                      @click="openResetModal(setting)"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Reset to default">
                      🔄
                    </button>
                    <button
                      @click="openEditModal(setting)"
                      class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      title="Edit">
                      ✏️
                    </button>
                    <button
                      v-if="setting.canDelete"
                      @click="openDeleteModal(setting)"
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
    </div>

    <!-- List View -->
    <div
      v-else
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">
          All Settings
        </h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="setting in filteredSettings"
          :key="setting.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-start gap-4">
            <input
              type="checkbox"
              :checked="selectedItems.includes(setting.id)"
              @change="toggleItemSelection(setting.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD] mt-1" />

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <span class="text-lg">{{ getTypeIcon(setting.type) }}</span>
                  <h4
                    class="text-base font-semibold text-gray-900 dark:text-white">
                    {{ setting.name }}
                  </h4>
                  <span
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
                    >{{ setting.category }}</span
                  >
                </div>

                <div class="flex items-center gap-2">
                  <button
                    v-if="setting.hasHistory && setting.history.length > 0"
                    @click="openHistoryModal(setting)"
                    class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="View History">
                    📈
                  </button>
                  <button
                    @click="duplicateSetting(setting)"
                    class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    title="Duplicate">
                    📋
                  </button>
                  <button
                    v-if="
                      setting.defaultValue &&
                      setting.defaultValue !== setting.value
                    "
                    @click="openResetModal(setting)"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Reset to default">
                    🔄
                  </button>
                  <button
                    @click="openEditModal(setting)"
                    class="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                    ✏️
                  </button>
                  <button
                    v-if="setting.canDelete"
                    @click="openDeleteModal(setting)"
                    class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    🗑️
                  </button>
                </div>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {{ setting.description }}
              </p>

              <div class="flex items-center gap-6 text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                  <strong>Key:</strong>
                  <code
                    class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs"
                    >{{ setting.key }}</code
                  >
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  <strong>Value:</strong>
                  <span class="truncate max-w-xs">{{
                    formatValue(setting)
                  }}</span>
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  <strong>Type:</strong> {{ getTypeLabel(setting.type) }}
                </span>
              </div>

              <div class="flex items-center justify-between mt-2">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Modified: {{ formatTimestamp(setting.lastModified) }} by
                  {{ setting.modifiedBy }}
                </div>

                <div class="flex items-center gap-2">
                  <span
                    v-if="setting.required"
                    class="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full"
                    >Required</span
                  >
                  <span
                    v-if="setting.isSecret"
                    class="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 text-gray-300 text-xs rounded-full"
                    >🔒</span
                  >
                  <span
                    class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full"
                    >{{ setting.environment }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredSettings.length === 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <div class="text-6xl mb-4">⚙️</div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No settings found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or add your first system setting.
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
          Add System Setting
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
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{
                  showEditModal
                    ? "Edit System Setting"
                    : "Add New System Setting"
                }}
              </h3>
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = false;
                  resetForm();
                  clearDraft();
                "
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="saveSetting" class="p-6 space-y-6">
            <!-- Validation Errors -->
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
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Setting Name *</label
                  >
                  <input
                    v-model="settingForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Setting Key *</label
                  >
                  <input
                    v-model="settingForm.key"
                    type="text"
                    required
                    placeholder="snake_case_key"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use snake_case format (e.g., api_rate_limit)
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Category</label
                  >
                  <select
                    v-model="settingForm.category"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
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
                    >Type</label
                  >
                  <select
                    v-model="settingForm.type"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in settingTypes"
                      :key="type.value"
                      :value="type.value">
                      {{ type.icon }} {{ type.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Environment</label
                  >
                  <select
                    v-model="settingForm.environment"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option v-for="env in environments" :key="env" :value="env">
                      {{ env.charAt(0).toUpperCase() + env.slice(1) }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Default Value</label
                  >
                  <input
                    v-model="settingForm.defaultValue"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Description</label
              >
              <textarea
                v-model="settingForm.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Describe what this setting controls..."></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Current Value</label
                >
                <div v-if="settingForm.type === 'boolean'" class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="settingForm.value"
                      value="true"
                      class="text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >True</span
                    >
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="settingForm.value"
                      value="false"
                      class="text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >False</span
                    >
                  </label>
                </div>
                <select
                  v-else-if="settingForm.type === 'select'"
                  v-model="settingForm.value"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select an option</option>
                  <option
                    v-for="option in settingForm.options"
                    :key="option"
                    :value="option">
                    {{ option }}
                  </option>
                </select>
                <textarea
                  v-else-if="
                    settingForm.type === 'textarea' ||
                    settingForm.type === 'json'
                  "
                  v-model="settingForm.value"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                <input
                  v-else
                  v-model="settingForm.value"
                  :type="
                    settingForm.type === 'password'
                      ? 'password'
                      : settingForm.type === 'number'
                      ? 'number'
                      : settingForm.type === 'email'
                      ? 'email'
                      : settingForm.type === 'url'
                      ? 'url'
                      : 'text'
                  "
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Validation Regex</label
                >
                <input
                  v-model="settingForm.validation"
                  type="text"
                  placeholder="Optional regex pattern"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Regular expression to validate the value
                </p>
              </div>
            </div>

            <!-- Options for select type -->
            <div v-if="settingForm.type === 'select'">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Select Options</label
              >
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newOption"
                  type="text"
                  placeholder="Add option..."
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                  @keyup.enter="addOption" />
                <button
                  type="button"
                  @click="addOption"
                  class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Add
                </button>
              </div>
              <div
                v-if="settingForm.options.length > 0"
                class="flex flex-wrap gap-2">
                <span
                  v-for="(option, index) in settingForm.options"
                  :key="index"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                  {{ option }}
                  <button
                    type="button"
                    @click="removeOption(index)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                    ×
                  </button>
                </span>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Tags</label
              >
              <div class="flex gap-2 mb-2">
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
                v-if="settingForm.tags.length > 0"
                class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in settingForm.tags"
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

            <div class="flex gap-6">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="settingForm.required"
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                <span class="text-sm text-gray-700 dark:text-gray-300"
                  >Required Setting</span
                >
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="settingForm.isSecret"
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                <span class="text-sm text-gray-700 dark:text-gray-300"
                  >Secret/Sensitive Value</span
                >
              </label>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = false;
                  resetForm();
                  clearDraft();
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
                    ? "Update Setting"
                    : "Create Setting"
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
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Delete System Setting
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this system setting? This action
            cannot be undone and may affect system functionality.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ settingToDelete?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ settingToDelete?.key }} • {{ settingToDelete?.category }}
            </p>
            <div
              v-if="!settingToDelete?.canDelete"
              class="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <p class="text-xs text-red-800 dark:text-red-300">
                ⚠️ This setting cannot be deleted as it is required for system
                operation.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="!settingToDelete?.canDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
              Delete Setting
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Reset Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showResetModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔄 Reset to Default
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to reset this setting to its default value?
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ settingToReset?.name }}
            </p>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <p>
                Current: <strong>{{ settingToReset?.value }}</strong>
              </p>
              <p>
                Default:
                <strong>{{
                  settingToReset?.defaultValue || "None available"
                }}</strong>
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="showResetModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="handleReset"
              :disabled="!settingToReset?.defaultValue"
              class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- History Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showHistoryModal && selectedSetting"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              📈 Setting History
            </h3>
            <button
              type="button"
              @click="showHistoryModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>

          <div class="mb-4">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ selectedSetting.name }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedSetting.key }}
            </p>
          </div>

          <div class="space-y-4">
            <!-- Current Value -->
            <div
              class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p
                    class="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Current Value
                  </p>
                  <p class="text-blue-800 dark:text-blue-200">
                    {{ formatValue(selectedSetting) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-blue-600 dark:text-blue-400">
                    {{ formatTimestamp(selectedSetting.lastModified) }}
                  </p>
                  <p class="text-xs text-blue-500 dark:text-blue-500">
                    {{ selectedSetting.modifiedBy }}
                  </p>
                </div>
              </div>
            </div>

            <!-- History -->
            <div
              v-if="
                selectedSetting.history && selectedSetting.history.length > 0
              ">
              <h4
                class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Previous Values
              </h4>
              <div class="space-y-2">
                <div
                  v-for="(historyItem, index) in selectedSetting.history"
                  :key="index"
                  class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-900 dark:text-white">
                        {{ historyItem.value }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatTimestamp(historyItem.timestamp) }}
                      </p>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        {{ historyItem.modifiedBy }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">
                No history available for this setting
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="showHistoryModal = false"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Close
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
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              📥 Import Settings
            </h3>
            <button
              type="button"
              @click="showImportModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Import Format</label
              >
              <select
                v-model="importForm.format"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Upload File</label
              >
              <input
                type="file"
                accept=".json,.csv"
                @change="handleFileImport"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Or Paste Data</label
              >
              <textarea
                v-model="importForm.data"
                rows="8"
                placeholder="Paste your JSON or CSV data here..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"></textarea>
            </div>

            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="importForm.overwrite"
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                <span class="text-sm text-gray-700 dark:text-gray-300"
                  >Overwrite existing settings</span
                >
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="importForm.validateOnly"
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                <span class="text-sm text-gray-700 dark:text-gray-300"
                  >Validate only (don't import)</span
                >
              </label>
            </div>

            <!-- Import Results -->
            <div
              v-if="importResults"
              class="p-4 rounded-lg"
              :class="
                importResults.errors.length === 0
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
              ">
              <h4
                class="font-medium mb-2"
                :class="
                  importResults.errors.length === 0
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-red-800 dark:text-red-300'
                ">
                Import Results
              </h4>
              <div class="text-sm space-y-1">
                <p>Imported: {{ importResults.imported }}</p>
                <p>Updated: {{ importResults.updated }}</p>
                <p>Errors: {{ importResults.errors.length }}</p>
                <p>Warnings: {{ importResults.warnings.length }}</p>
              </div>
              <div v-if="importResults.errors.length > 0" class="mt-2">
                <p class="font-medium text-red-800 dark:text-red-300">
                  Errors:
                </p>
                <ul
                  class="text-xs text-red-700 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                  <li v-for="error in importResults.errors" :key="error">
                    • {{ error }}
                  </li>
                </ul>
              </div>
              <div v-if="importResults.warnings.length > 0" class="mt-2">
                <p class="font-medium text-yellow-800 dark:text-yellow-300">
                  Warnings:
                </p>
                <ul
                  class="text-xs text-yellow-700 dark:text-yellow-400 space-y-1 max-h-32 overflow-y-auto">
                  <li v-for="warning in importResults.warnings" :key="warning">
                    • {{ warning }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showImportModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="handleImport"
              :disabled="!importForm.data.trim()"
              class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
              {{ importForm.validateOnly ? "Validate" : "Import" }}
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
            Selected {{ selectedItems.length }} settings. Choose an operation:
          </p>

          <div class="space-y-3">
            <div v-for="action in bulkActions" :key="action.value">
              <label
                class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <input
                  type="radio"
                  v-model="bulkAction"
                  :value="action.value"
                  class="text-[#4565AD] focus:ring-[#4565AD]" />
                <span :class="action.color" class="text-lg">{{
                  action.icon
                }}</span>
                <span
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  >{{ action.label }}</span
                >
              </label>
            </div>
          </div>

          <div
            class="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="showBulkModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="handleBulkAction"
              :disabled="!bulkAction"
              class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
              Execute
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

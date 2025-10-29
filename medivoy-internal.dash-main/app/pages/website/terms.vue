<!-- pages/website/terms.vue -->
<script setup lang="ts">
import { useTermsMock } from "~/composables/useTermsMock";

const { terms, termStats, addTerm, updateTerm, deleteTerm, publishVersion } =
  useTermsMock();

// State management
const searchQuery = ref("");
const filterSection = ref("all");
const filterStatus = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const showVersionModal = ref(false);
const showPreviewModal = ref(false);
const selectedTerm = ref(null);
const termToDelete = ref(null);
const isSubmitting = ref(false);
const isPublishing = ref(false);
const showFullContent = ref({});

// Form data
const termForm = ref({
  id: null,
  section: "",
  title: "",
  content: "",
  subsections: [],
  isActive: true,
  isRequired: false,
  version: "1.0",
  effectiveDate: "",
  lastReviewDate: "",
  nextReviewDate: "",
  applicableRegions: [],
  applicableServices: [],
  relatedSections: [],
  legalReferences: [],
  changeLog: [],
  priority: "medium",
  language: "en",
});

// Options
const sectionTypes = [
  { value: "acceptance", label: "Acceptance of Terms", icon: "✅" },
  { value: "services", label: "Use of Services", icon: "🏥" },
  { value: "accounts", label: "User Accounts", icon: "👤" },
  { value: "privacy", label: "Privacy & Data", icon: "🔒" },
  { value: "payments", label: "Payments & Billing", icon: "💳" },
  { value: "medical", label: "Medical Services", icon: "⚕️" },
  { value: "liability", label: "Liability & Disclaimers", icon: "⚖️" },
  { value: "intellectual", label: "Intellectual Property", icon: "📄" },
  { value: "termination", label: "Termination", icon: "🚫" },
  { value: "disputes", label: "Disputes & Governing Law", icon: "🏛️" },
  { value: "modifications", label: "Modifications", icon: "📝" },
  { value: "contact", label: "Contact Information", icon: "📞" },
];

const regionOptions = [
  "India",
  "United States",
  "European Union",
  "United Kingdom",
  "Canada",
  "Australia",
  "UAE",
  "Singapore",
  "Global",
];

const serviceOptions = [
  "Online Consultation",
  "Appointment Booking",
  "Lab Tests",
  "Prescription Services",
  "Medical Records",
  "Payment Processing",
  "Telemedicine",
  "Emergency Services",
  "Health Packages",
  "Medical Tourism",
];

const priorityOptions = [
  {
    value: "critical",
    label: "Critical",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    value: "high",
    label: "High",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    value: "medium",
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "low",
    label: "Low",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
];

// Temporary input fields for arrays
const newSubsection = ref("");
const newReference = ref("");
const newChangeNote = ref("");

// Computed
const filteredTerms = computed(() => {
  let filtered = terms.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.content.toLowerCase().includes(query) ||
        t.section.toLowerCase().includes(query)
    );
  }

  if (filterSection.value !== "all") {
    filtered = filtered.filter((t) => t.section === filterSection.value);
  }

  if (filterStatus.value !== "all") {
    if (filterStatus.value === "active") {
      filtered = filtered.filter((t) => t.isActive);
    } else if (filterStatus.value === "inactive") {
      filtered = filtered.filter((t) => !t.isActive);
    } else if (filterStatus.value === "required") {
      filtered = filtered.filter((t) => t.isRequired);
    } else if (filterStatus.value === "outdated") {
      const today = new Date();
      filtered = filtered.filter((t) => new Date(t.nextReviewDate) <= today);
    }
  }

  return filtered.sort((a, b) => {
    // Sort by priority first (critical > high > medium > low)
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;

    if (aPriority !== bPriority) return bPriority - aPriority;

    // Then by last updated
    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });
});

// Helper functions
const getSectionInfo = (section) => {
  return (
    sectionTypes.find((s) => s.value === section) || {
      label: section,
      icon: "📄",
    }
  );
};

const getPriorityInfo = (priority) => {
  return (
    priorityOptions.find((p) => p.value === priority) || priorityOptions[2]
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (reviewDate) => {
  return new Date(reviewDate) <= new Date();
};

const getDaysUntilReview = (reviewDate) => {
  const today = new Date();
  const review = new Date(reviewDate);
  const diffTime = review - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getWordCount = (content) => {
  return content.trim().split(/\s+/).length;
};

const toggleContent = (termId) => {
  showFullContent.value[termId] = !showFullContent.value[termId];
};

// Array manipulation functions
const addArrayItem = (arrayName, inputRef, itemObj = null) => {
  const item = itemObj || inputRef.value?.trim();
  if (
    item &&
    !termForm.value[arrayName].some((existing) =>
      typeof existing === "string" ? existing === item : existing.title === item
    )
  ) {
    if (arrayName === "changeLog") {
      termForm.value[arrayName].unshift({
        date: new Date().toISOString().split("T")[0],
        version: termForm.value.version,
        changes: item,
        author: "Admin",
      });
    } else {
      termForm.value[arrayName].push(item);
    }
    if (inputRef) inputRef.value = "";
  }
};

const removeArrayItem = (arrayName, index) => {
  termForm.value[arrayName].splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (term) => {
  termForm.value = { ...term };
  selectedTerm.value = term;
  showEditModal.value = true;
};

const openDetailModal = (term) => {
  selectedTerm.value = term;
  showDetailModal.value = true;
};

const openDeleteModal = (term) => {
  termToDelete.value = term;
  showDeleteModal.value = true;
};

const openVersionModal = (term) => {
  selectedTerm.value = term;
  showVersionModal.value = true;
};

const openPreviewModal = (term) => {
  selectedTerm.value = term;
  showPreviewModal.value = true;
};

const resetForm = () => {
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  termForm.value = {
    id: null,
    section: "",
    title: "",
    content: "",
    subsections: [],
    isActive: true,
    isRequired: false,
    version: "1.0",
    effectiveDate: today.toISOString().split("T")[0],
    lastReviewDate: today.toISOString().split("T")[0],
    nextReviewDate: nextYear.toISOString().split("T")[0],
    applicableRegions: [],
    applicableServices: [],
    relatedSections: [],
    legalReferences: [],
    changeLog: [],
    priority: "medium",
    language: "en",
  };

  newSubsection.value = "";
  newReference.value = "";
  newChangeNote.value = "";
};

const saveTerm = async () => {
  try {
    isSubmitting.value = true;

    // Validate required fields
    if (
      !termForm.value.section ||
      !termForm.value.title ||
      !termForm.value.content
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Add change log entry if editing
    if (termForm.value.id) {
      addArrayItem("changeLog", null, `Updated: ${termForm.value.title}`);
    }

    if (termForm.value.id) {
      // Update existing term
      // await $fetch(`/api/website/terms/${termForm.value.id}`, {
      //   method: 'PUT',
      //   body: termForm.value
      // })
      updateTerm(termForm.value.id, termForm.value);
    } else {
      // Create new term
      // await $fetch('/api/website/terms', {
      //   method: 'POST',
      //   body: termForm.value
      // })
      addTerm(termForm.value);
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving term:", error);
    alert("Error saving term. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    // await $fetch(`/api/website/terms/${termToDelete.value.id}`, {
    //   method: 'DELETE'
    // })
    deleteTerm(termToDelete.value.id);
    showDeleteModal.value = false;
    termToDelete.value = null;
  } catch (error) {
    console.error("Error deleting term:", error);
    alert("Error deleting term. Please try again.");
  }
};

const duplicateTerm = (term) => {
  termForm.value = {
    ...term,
    id: null,
    title: `${term.title} (Copy)`,
    version: "1.0",
    effectiveDate: new Date().toISOString().split("T")[0],
    changeLog: [
      {
        date: new Date().toISOString().split("T")[0],
        version: "1.0",
        changes: `Duplicated from: ${term.title}`,
        author: "Admin",
      },
    ],
  };
  showAddModal.value = true;
};

const toggleTermStatus = async (term) => {
  try {
    const updatedData = {
      ...term,
      isActive: !term.isActive,
      lastUpdated: new Date().toISOString(),
    };
    // await $fetch(`/api/website/terms/${term.id}/status`, {
    //   method: 'PATCH',
    //   body: { isActive: updatedData.isActive }
    // })
    updateTerm(term.id, updatedData);
  } catch (error) {
    console.error("Error toggling term status:", error);
  }
};

const handleVersionPublish = async (newVersion) => {
  try {
    isPublishing.value = true;
    // await $fetch(`/api/website/terms/${selectedTerm.value.id}/publish`, {
    //   method: 'POST',
    //   body: { version: newVersion }
    // })
    publishVersion(selectedTerm.value.id, newVersion);
    showVersionModal.value = false;
  } catch (error) {
    console.error("Error publishing version:", error);
  } finally {
    isPublishing.value = false;
  }
};

const exportTerms = () => {
  const activeTerms = terms.value.filter((t) => t.isActive);
  const content = activeTerms
    .map((term) => `# ${term.title}\n\n${term.content}\n\n---\n`)
    .join("\n");

  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `terms-and-conditions-${
    new Date().toISOString().split("T")[0]
  }.md`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Terms & Conditions Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage legal terms, conditions, and compliance documents
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="exportTerms"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          📄 Export Terms
        </button>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          📋 Add Section
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Sections
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ termStats.totalSections }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">📋</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Active Sections
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ termStats.activeSections }}
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
              Pending Review
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ termStats.pendingReview }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">⏰</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Latest Version
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ termStats.latestVersion }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">🔄</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Types Overview -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Section Types
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="sectionType in sectionTypes"
          :key="sectionType.value"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
          @click="filterSection = sectionType.value">
          <span class="text-xl">{{ sectionType.icon }}</span>
          <div class="min-w-0">
            <p
              class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ sectionType.label }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ terms.filter((t) => t.section === sectionType.value).length }}
              sections
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search terms and conditions..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterSection"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Sections</option>
          <option
            v-for="section in sectionTypes"
            :key="section.value"
            :value="section.value">
            {{ section.icon }} {{ section.label }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="required">Required</option>
          <option value="outdated">Needs Review</option>
        </select>
      </div>
    </div>

    <!-- Terms List -->
    <div class="space-y-4">
      <div
        v-for="term in filteredTerms"
        :key="term.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">{{
                  getSectionInfo(term.section).icon
                }}</span>
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ term.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ getSectionInfo(term.section).label }}
                  </p>
                </div>
              </div>

              <!-- Metadata -->
              <div
                class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>Version {{ term.version }}</span>
                <span>•</span>
                <span>{{ getWordCount(term.content) }} words</span>
                <span>•</span>
                <span>Updated {{ formatDate(term.lastUpdated) }}</span>
                <span>•</span>
                <span
                  :class="
                    isOverdue(term.nextReviewDate)
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  ">
                  Review
                  {{
                    isOverdue(term.nextReviewDate)
                      ? "overdue"
                      : `in ${getDaysUntilReview(term.nextReviewDate)} days`
                  }}
                </span>
              </div>

              <!-- Badges -->
              <div class="flex items-center gap-2">
                <span
                  :class="getPriorityInfo(term.priority).color"
                  class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getPriorityInfo(term.priority).label }}
                </span>

                <span
                  v-if="term.isRequired"
                  class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-semibold rounded-full">
                  Required
                </span>

                <button
                  @click="toggleTermStatus(term)"
                  :class="
                    term.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  "
                  class="px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80">
                  {{ term.isActive ? "Active" : "Inactive" }}
                </button>

                <span
                  v-if="isOverdue(term.nextReviewDate)"
                  class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs font-semibold rounded-full">
                  Review Due
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-4">
              <button
                type="button"
                @click="openPreviewModal(term)"
                class="icon-btn view-btn"
                title="Preview">
                👁️
              </button>
              <button
                type="button"
                @click="openVersionModal(term)"
                class="icon-btn version-btn"
                title="Version History">
                🔄
              </button>
              <button
                type="button"
                @click="openEditModal(term)"
                class="icon-btn edit-btn"
                title="Edit Term">
                ✏️
              </button>
              <button
                type="button"
                @click="duplicateTerm(term)"
                class="icon-btn duplicate-btn"
                title="Duplicate Term">
                📋
              </button>
              <button
                type="button"
                @click="openDeleteModal(term)"
                class="icon-btn delete-btn"
                title="Delete Term">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Content Preview -->
        <div class="p-6">
          <div class="prose prose-sm max-w-none">
            <div
              v-if="showFullContent[term.id] || term.content.length <= 300"
              class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {{ term.content }}
            </div>
            <div v-else>
              <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ term.content.substring(0, 300) }}...
              </div>
              <button
                @click="toggleContent(term.id)"
                class="mt-2 text-[#4565AD] hover:underline text-sm font-medium">
                Show more
              </button>
            </div>

            <div
              v-if="showFullContent[term.id] && term.content.length > 300"
              class="mt-2">
              <button
                @click="toggleContent(term.id)"
                class="text-[#4565AD] hover:underline text-sm font-medium">
                Show less
              </button>
            </div>
          </div>

          <!-- Applicable Regions & Services -->
          <div
            v-if="
              term.applicableRegions?.length || term.applicableServices?.length
            "
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="term.applicableRegions?.length">
                <h5
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Applicable Regions
                </h5>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="region in term.applicableRegions.slice(0, 3)"
                    :key="region"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                    {{ region }}
                  </span>
                  <span
                    v-if="term.applicableRegions.length > 3"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{{ term.applicableRegions.length - 3 }} more
                  </span>
                </div>
              </div>

              <div v-if="term.applicableServices?.length">
                <h5
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Applicable Services
                </h5>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="service in term.applicableServices.slice(0, 3)"
                    :key="service"
                    class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                    {{ service }}
                  </span>
                  <span
                    v-if="term.applicableServices.length > 3"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{{ term.applicableServices.length - 3 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredTerms.length === 0"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
        <div class="text-6xl mb-4">📋</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No terms found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Try adjusting your search criteria or add your first terms section.
        </p>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
          Add Terms Section
        </button>
      </div>
    </div>

    <!-- Add/Edit Term Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{
                  showEditModal ? "Edit Terms Section" : "Add New Terms Section"
                }}
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

          <form @submit.prevent="saveTerm" class="p-6 space-y-6">
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
                    >Section Type *</label
                  >
                  <select
                    v-model="termForm.section"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Section</option>
                    <option
                      v-for="section in sectionTypes"
                      :key="section.value"
                      :value="section.value">
                      {{ section.icon }} {{ section.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Priority</label
                  >
                  <select
                    v-model="termForm.priority"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="priority in priorityOptions"
                      :key="priority.value"
                      :value="priority.value">
                      {{ priority.label }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Title *</label
                  >
                  <input
                    v-model="termForm.title"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Acceptance of Terms and Conditions" />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Content *</label
                  >
                  <textarea
                    v-model="termForm.content"
                    rows="12"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] font-mono text-sm"
                    placeholder="Enter the legal terms and conditions content..."></textarea>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ getWordCount(termForm.content) }} words
                  </p>
                </div>
              </div>
            </div>

            <!-- Version & Dates -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Version & Review Dates
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Version</label
                  >
                  <input
                    v-model="termForm.version"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="1.0" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Effective Date</label
                  >
                  <input
                    v-model="termForm.effectiveDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Last Review</label
                  >
                  <input
                    v-model="termForm.lastReviewDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Next Review</label
                  >
                  <input
                    v-model="termForm.nextReviewDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Applicable Regions & Services -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Applicability
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Regions -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Applicable Regions</label
                  >
                  <div
                    class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <label
                      v-for="region in regionOptions"
                      :key="region"
                      class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        :value="region"
                        v-model="termForm.applicableRegions"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        region
                      }}</span>
                    </label>
                  </div>
                </div>

                <!-- Services -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Applicable Services</label
                  >
                  <div
                    class="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <label
                      v-for="service in serviceOptions"
                      :key="service"
                      class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        :value="service"
                        v-model="termForm.applicableServices"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        service
                      }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Legal References -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Legal References
              </h4>
              <div class="mb-4">
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newReference"
                    type="text"
                    placeholder="Add legal reference (e.g., GDPR Article 6, HIPAA Section 164.502)..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="
                      addArrayItem('legalReferences', newReference)
                    " />
                  <button
                    type="button"
                    @click="addArrayItem('legalReferences', newReference)"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="termForm.legalReferences.length > 0"
                  class="space-y-2">
                  <div
                    v-for="(reference, index) in termForm.legalReferences"
                    :key="`reference-${index}`"
                    class="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{
                      reference
                    }}</span>
                    <button
                      type="button"
                      @click="removeArrayItem('legalReferences', index)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Change Log -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Change Log
              </h4>
              <div class="mb-4">
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newChangeNote"
                    type="text"
                    placeholder="Add change note..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="addArrayItem('changeLog', newChangeNote)" />
                  <button
                    type="button"
                    @click="addArrayItem('changeLog', newChangeNote)"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="termForm.changeLog.length > 0"
                  class="space-y-2 max-h-40 overflow-y-auto">
                  <div
                    v-for="(change, index) in termForm.changeLog"
                    :key="`change-${index}`"
                    class="flex items-start justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div class="min-w-0 flex-1">
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        {{ change.changes }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ change.date }} • v{{ change.version }} •
                        {{ change.author }}
                      </p>
                    </div>
                    <button
                      type="button"
                      @click="removeArrayItem('changeLog', index)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 ml-2">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Settings
              </h4>
              <div class="flex items-center gap-6">
                <label class="flex items-center gap-2">
                  <input
                    v-model="termForm.isActive"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Active Section</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="termForm.isRequired"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Required Section</span
                  >
                </label>
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
                    ? "Update Section"
                    : "Create Section"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Term Preview Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showPreviewModal && selectedTerm"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {{ selectedTerm.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getSectionInfo(selectedTerm.section).label }} • Version
                  {{ selectedTerm.version }}
                </p>
              </div>
              <button
                type="button"
                @click="showPreviewModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <div class="p-6">
            <!-- Preview Content -->
            <div class="prose prose-lg max-w-none">
              <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                <div
                  class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {{ selectedTerm.content }}
                </div>
              </div>
            </div>

            <!-- Meta Information -->
            <div
              class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h5 class="font-medium text-gray-900 dark:text-white mb-2">
                    Version Info
                  </h5>
                  <div class="space-y-1 text-gray-600 dark:text-gray-400">
                    <p>Version: {{ selectedTerm.version }}</p>
                    <p>
                      Effective: {{ formatDate(selectedTerm.effectiveDate) }}
                    </p>
                    <p>
                      Last Review: {{ formatDate(selectedTerm.lastReviewDate) }}
                    </p>
                  </div>
                </div>

                <div v-if="selectedTerm.applicableRegions?.length">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-2">
                    Applicable Regions
                  </h5>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="region in selectedTerm.applicableRegions"
                      :key="region"
                      class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                      {{ region }}
                    </span>
                  </div>
                </div>

                <div v-if="selectedTerm.applicableServices?.length">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-2">
                    Applicable Services
                  </h5>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="service in selectedTerm.applicableServices"
                      :key="service"
                      class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded">
                      {{ service }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6">
              <button
                type="button"
                @click="showPreviewModal = false"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Close
              </button>
              <button
                type="button"
                @click="
                  openEditModal(selectedTerm);
                  showPreviewModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                Edit Section
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Version History Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showVersionModal && selectedTerm"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Version History
              </h3>
              <button
                type="button"
                @click="showVersionModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ selectedTerm.title }}
            </p>
          </div>

          <div class="p-6">
            <!-- Current Version -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white">
                  Current Version
                </h4>
                <span
                  class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                  v{{ selectedTerm.version }}
                </span>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Effective Date:</strong>
                  {{ formatDate(selectedTerm.effectiveDate) }}
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Word Count:</strong>
                  {{ getWordCount(selectedTerm.content) }} words
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Status:</strong>
                  {{ selectedTerm.isActive ? "Active" : "Inactive" }}
                </div>
              </div>
            </div>

            <!-- Change Log -->
            <div
              v-if="
                selectedTerm.changeLog && selectedTerm.changeLog.length > 0
              ">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Change History
              </h4>
              <div class="space-y-3">
                <div
                  v-for="change in selectedTerm.changeLog"
                  :key="`${change.date}-${change.version}`"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded">
                      v{{ change.version }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(change.date) }} by {{ change.author }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ change.changes }}
                  </p>
                </div>
              </div>
            </div>

            <!-- New Version -->
            <div
              class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Publish New Version
              </h4>
              <div class="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter new version (e.g., 1.1, 2.0)"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                  v-model="newVersion" />
                <button
                  @click="handleVersionPublish(newVersion)"
                  :disabled="isPublishing || !newVersion"
                  class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm disabled:opacity-50">
                  {{ isPublishing ? "Publishing..." : "Publish" }}
                </button>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Publishing a new version will make it the active version and
                archive the current one.
              </p>
            </div>

            <div class="flex justify-end gap-3 pt-6">
              <button
                type="button"
                @click="showVersionModal = false"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Close
              </button>
            </div>
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
            🗑️ Delete Terms Section
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this terms section? This action
            cannot be undone and may affect legal compliance.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ termToDelete?.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ getSectionInfo(termToDelete?.section).label }} • Version
              {{ termToDelete?.version }}
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
              Delete Section
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-size: 16px;
  transition: all 0.2s;
  background: transparent;
}
.icon-btn:hover {
  background: #1118271a;
  transform: scale(1.05);
}
.view-btn:hover {
  border-color: #3b82f6;
  background: #3b82f610;
  box-shadow: 0 0 0 3px #3b82f610;
}
.edit-btn:hover {
  border-color: #f59e0b;
  background: #f59e0b10;
  box-shadow: 0 0 0 3px #f59e0b10;
}
.duplicate-btn:hover {
  border-color: #10b981;
  background: #10b98110;
  box-shadow: 0 0 0 3px #10b98110;
}
.delete-btn:hover {
  border-color: #ef4444;
  background: #ef444410;
  box-shadow: 0 0 0 3px #ef444410;
}
.version-btn:hover {
  border-color: #8b5cf6;
  background: #8b5cf610;
  box-shadow: 0 0 0 3px #8b5cf610;
}
:global(.dark) .icon-btn {
  border-color: #374151;
}
:global(.dark) .icon-btn:hover {
  background: #374151;
}
.prose {
  line-height: 1.7;
}
</style>

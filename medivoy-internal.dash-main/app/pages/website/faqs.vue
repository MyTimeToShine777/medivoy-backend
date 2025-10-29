<!-- pages/website/faqs.vue -->
<script setup lang="ts">
import { useFAQsMock } from "~/composables/useFAQsMock";

const {
  faqs,
  faqStats,
  categories,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  markHelpful,
} = useFAQsMock();

// State management
const searchQuery = ref("");
const filterCategory = ref("all");
const filterStatus = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const selectedFAQ = ref(null);
const faqToDelete = ref(null);
const isSubmitting = ref(false);
const isPublishing = ref(false);

// Form data
const faqForm = ref({
  id: null,
  question: "",
  answer: "",
  category: "",
  subcategory: "",
  priority: "medium",
  isPublic: true,
  isActive: true,
  isFeatured: false,
  tags: [],
  targetAudience: [],
  relatedFAQs: [],
  searchKeywords: [],
});

// Options
const priorityOptions = [
  {
    value: "high",
    label: "High Priority",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    value: "medium",
    label: "Medium Priority",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "low",
    label: "Low Priority",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
];

const faqCategories = [
  "appointments",
  "payments",
  "lab_tests",
  "medical_records",
  "general",
  "insurance",
  "medical_care",
  "telemedicine",
  "covid_safety",
];

const targetAudienceOptions = [
  "new_patients",
  "existing_patients",
  "general_users",
  "insured_patients",
  "corporate_employees",
  "international_patients",
  "elderly",
  "families",
];

// Temporary input fields for arrays
const newTag = ref("");
const newKeyword = ref("");

// Computed
const filteredFAQs = computed(() => {
  let filtered = faqs.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.question.toLowerCase().includes(query) ||
        f.answer.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query) ||
        f.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter((f) => f.category === filterCategory.value);
  }

  if (filterStatus.value !== "all") {
    if (filterStatus.value === "active") {
      filtered = filtered.filter((f) => f.isActive);
    } else if (filterStatus.value === "inactive") {
      filtered = filtered.filter((f) => !f.isActive);
    } else if (filterStatus.value === "featured") {
      filtered = filtered.filter((f) => f.isFeatured);
    } else if (filterStatus.value === "public") {
      filtered = filtered.filter((f) => f.isPublic);
    }
  }

  return filtered.sort(
    (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
  );
});

// Helper functions
const getPriorityInfo = (priority) => {
  return (
    priorityOptions.find((p) => p.value === priority) || priorityOptions[1]
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getHelpfulPercentage = (faq) => {
  const total = faq.helpful + faq.notHelpful;
  if (total === 0) return 0;
  return Math.round((faq.helpful / total) * 100);
};

// Array manipulation functions
const addArrayItem = (arrayName, inputRef) => {
  const item = inputRef.value?.trim();
  if (item && !faqForm.value[arrayName].includes(item)) {
    faqForm.value[arrayName].push(item);
    inputRef.value = "";
  }
};

const removeArrayItem = (arrayName, index) => {
  faqForm.value[arrayName].splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (faq) => {
  faqForm.value = { ...faq };
  selectedFAQ.value = faq;
  showEditModal.value = true;
};

const openDetailModal = (faq) => {
  selectedFAQ.value = faq;
  showDetailModal.value = true;
};

const openDeleteModal = (faq) => {
  faqToDelete.value = faq;
  showDeleteModal.value = true;
};

const resetForm = () => {
  faqForm.value = {
    id: null,
    question: "",
    answer: "",
    category: "",
    subcategory: "",
    priority: "medium",
    isPublic: true,
    isActive: true,
    isFeatured: false,
    tags: [],
    targetAudience: [],
    relatedFAQs: [],
    searchKeywords: [],
  };

  newTag.value = "";
  newKeyword.value = "";
};

const saveFAQ = async () => {
  try {
    isSubmitting.value = true;

    // Validate required fields
    if (
      !faqForm.value.question ||
      !faqForm.value.answer ||
      !faqForm.value.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (faqForm.value.id) {
      // Update existing FAQ
      // await $fetch(`/api/website/faqs/${faqForm.value.id}`, {
      //   method: 'PUT',
      //   body: faqForm.value
      // })
      updateFAQ(faqForm.value.id, faqForm.value);
    } else {
      // Create new FAQ
      // await $fetch('/api/website/faqs', {
      //   method: 'POST',
      //   body: faqForm.value
      // })
      addFAQ(faqForm.value);
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving FAQ:", error);
    alert("Error saving FAQ. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    // await $fetch(`/api/website/faqs/${faqToDelete.value.id}`, {
    //   method: 'DELETE'
    // })
    deleteFAQ(faqToDelete.value.id);
    showDeleteModal.value = false;
    faqToDelete.value = null;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    alert("Error deleting FAQ. Please try again.");
  }
};

const duplicateFAQ = (faq) => {
  faqForm.value = {
    ...faq,
    id: null,
    question: `${faq.question} (Copy)`,
    views: 0,
    helpful: 0,
    notHelpful: 0,
  };
  showAddModal.value = true;
};

const toggleFAQStatus = async (faq) => {
  try {
    const updatedData = { ...faq, isActive: !faq.isActive };
    // await $fetch(`/api/website/faqs/${faq.id}/status`, {
    //   method: 'PATCH',
    //   body: { isActive: updatedData.isActive }
    // })
    updateFAQ(faq.id, updatedData);
  } catch (error) {
    console.error("Error toggling FAQ status:", error);
  }
};

const handleHelpfulVote = async (faq, helpful = true) => {
  try {
    // await $fetch(`/api/website/faqs/${faq.id}/vote`, {
    //   method: 'POST',
    //   body: { helpful }
    // })
    markHelpful(faq.id, helpful);
  } catch (error) {
    console.error("Error recording vote:", error);
  }
};

const bulkPublish = async () => {
  try {
    isPublishing.value = true;
    const inactiveFAQs = faqs.value.filter((f) => !f.isActive);

    // await Promise.all(inactiveFAQs.map(faq =>
    //   $fetch(`/api/website/faqs/${faq.id}/status`, {
    //     method: 'PATCH',
    //     body: { isActive: true }
    //   })
    // ))

    inactiveFAQs.forEach((faq) => {
      updateFAQ(faq.id, { ...faq, isActive: true });
    });
  } catch (error) {
    console.error("Error bulk publishing FAQs:", error);
  } finally {
    isPublishing.value = false;
  }
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          FAQ Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage frequently asked questions and help documentation
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="bulkPublish"
          :disabled="isPublishing"
          class="px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50">
          {{ isPublishing ? "Publishing..." : "🚀 Bulk Publish" }}
        </button>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          ❓ Add FAQ
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
              Total FAQs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ faqStats.totalFAQs }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">❓</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Active FAQs
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ faqStats.activeFAQs }}
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
              Total Views
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ faqStats.totalViews.toLocaleString() }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">👁️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Helpful Ratio
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ faqStats.helpfulRatio }}%
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">👍</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Overview -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Categories Overview
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="category in categories"
          :key="category.name"
          class="text-center">
          <div class="text-2xl mb-2">
            {{
              category.name === "APPOINTMENTS"
                ? "📅"
                : category.name === "PAYMENTS"
                ? "💳"
                : category.name === "LAB_TESTS"
                ? "🔬"
                : category.name === "MEDICAL_RECORDS"
                ? "📋"
                : category.name === "INSURANCE"
                ? "🛡️"
                : category.name === "TELEMEDICINE"
                ? "💻"
                : category.name === "COVID_SAFETY"
                ? "😷"
                : "❓"
            }}
          </div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ category.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ category.count }} FAQs
          </p>
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
            placeholder="Search FAQs..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Categories</option>
          <option
            v-for="category in faqCategories"
            :key="category"
            :value="category">
            {{
              category.charAt(0).toUpperCase() +
              category.slice(1).replace("_", " ")
            }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
          <option value="public">Public</option>
        </select>
      </div>
    </div>

    <!-- FAQs List -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            FAQ List
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredFAQs.length }} FAQs found
          </p>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="faq in filteredFAQs"
          :key="faq.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-start gap-4">
            <!-- Priority Indicator -->
            <div class="flex-shrink-0 mt-1">
              <span
                :class="getPriorityInfo(faq.priority).color"
                class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ getPriorityInfo(faq.priority).label }}
              </span>
            </div>

            <!-- Main Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3
                    class="text-base font-medium text-gray-900 dark:text-white mb-1 cursor-pointer hover:text-[#4565AD]"
                    @click="openDetailModal(faq)">
                    {{ faq.question }}
                  </h3>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ faq.answer.substring(0, 200)
                    }}{{ faq.answer.length > 200 ? "..." : "" }}
                  </p>
                </div>

                <!-- Status Badges -->
                <div class="flex items-center gap-2 ml-4">
                  <span
                    v-if="faq.isFeatured"
                    class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full">
                    Featured
                  </span>
                  <button
                    @click="toggleFAQStatus(faq)"
                    :class="
                      faq.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    "
                    class="px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80">
                    {{ faq.isActive ? "Active" : "Inactive" }}
                  </button>
                </div>
              </div>

              <!-- Metadata -->
              <div class="flex items-center justify-between">
                <div
                  class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span class="capitalize">{{
                    faq.category.replace("_", " ")
                  }}</span>
                  <span>•</span>
                  <span>{{ faq.views.toLocaleString() }} views</span>
                  <span>•</span>
                  <span
                    >{{ getHelpfulPercentage(faq) }}% helpful ({{
                      faq.helpful
                    }}/{{ faq.helpful + faq.notHelpful }})</span
                  >
                  <span>•</span>
                  <span>Updated {{ formatDate(faq.lastUpdated) }}</span>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="openDetailModal(faq)"
                    class="icon-btn view-btn"
                    title="View Details">
                    👁️
                  </button>
                  <button
                    type="button"
                    @click="openEditModal(faq)"
                    class="icon-btn edit-btn"
                    title="Edit FAQ">
                    ✏️
                  </button>
                  <button
                    type="button"
                    @click="duplicateFAQ(faq)"
                    class="icon-btn duplicate-btn"
                    title="Duplicate FAQ">
                    📋
                  </button>
                  <button
                    type="button"
                    @click="openDeleteModal(faq)"
                    class="icon-btn delete-btn"
                    title="Delete FAQ">
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="faq.tags && faq.tags.length > 0" class="mt-3">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in faq.tags.slice(0, 5)"
                    :key="tag"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                    {{ tag }}
                  </span>
                  <span
                    v-if="faq.tags.length > 5"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{{ faq.tags.length - 5 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredFAQs.length === 0"
          class="p-8 text-center text-gray-500 dark:text-gray-400">
          <div class="text-4xl mb-4">❓</div>
          <h3 class="text-lg font-medium mb-2">No FAQs found</h3>
          <p class="text-sm mb-4">
            Try adjusting your search criteria or add your first FAQ.
          </p>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
            Add FAQ
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit FAQ Modal -->
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
                {{ showEditModal ? "Edit FAQ" : "Add New FAQ" }}
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

          <form @submit.prevent="saveFAQ" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h4>
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Question *</label
                  >
                  <input
                    v-model="faqForm.question"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="How do I book an appointment?" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Answer *</label
                  >
                  <textarea
                    v-model="faqForm.answer"
                    rows="6"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Provide a detailed answer to the question..."></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Category *</label
                    >
                    <select
                      v-model="faqForm.category"
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="">Select Category</option>
                      <option
                        v-for="category in faqCategories"
                        :key="category"
                        :value="category">
                        {{
                          category.charAt(0).toUpperCase() +
                          category.slice(1).replace("_", " ")
                        }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Subcategory</label
                    >
                    <input
                      v-model="faqForm.subcategory"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      placeholder="booking" />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Priority</label
                    >
                    <select
                      v-model="faqForm.priority"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option
                        v-for="priority in priorityOptions"
                        :key="priority.value"
                        :value="priority.value">
                        {{ priority.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Target Audience -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Target Audience
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <label
                  v-for="audience in targetAudienceOptions"
                  :key="audience"
                  class="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    :value="audience"
                    v-model="faqForm.targetAudience"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-gray-700 dark:text-gray-300">{{
                    audience
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  }}</span>
                </label>
              </div>
            </div>

            <!-- Tags -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h4>
              <div class="mb-4">
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newTag"
                    type="text"
                    placeholder="Add tag..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="addArrayItem('tags', newTag)" />
                  <button
                    type="button"
                    @click="addArrayItem('tags', newTag)"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="faqForm.tags.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in faqForm.tags"
                    :key="`tag-${index}`"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                    {{ tag }}
                    <button
                      type="button"
                      @click="removeArrayItem('tags', index)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <!-- Search Keywords -->
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Search Keywords</label
                >
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newKeyword"
                    type="text"
                    placeholder="Add search keyword..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="addArrayItem('searchKeywords', newKeyword)" />
                  <button
                    type="button"
                    @click="addArrayItem('searchKeywords', newKeyword)"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="faqForm.searchKeywords.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(keyword, index) in faqForm.searchKeywords"
                    :key="`keyword-${index}`"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                    {{ keyword }}
                    <button
                      type="button"
                      @click="removeArrayItem('searchKeywords', index)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                      ×
                    </button>
                  </span>
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
                    v-model="faqForm.isActive"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Active FAQ</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="faqForm.isPublic"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Public (visible to all users)</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="faqForm.isFeatured"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Featured FAQ</span
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
                    ? "Update FAQ"
                    : "Create FAQ"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- FAQ Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedFAQ"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ selectedFAQ.question }}
                </h3>
                <div class="flex items-center gap-2">
                  <span
                    :class="getPriorityInfo(selectedFAQ.priority).color"
                    class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getPriorityInfo(selectedFAQ.priority).label }}
                  </span>
                  <span
                    class="text-sm text-gray-500 dark:text-gray-400 capitalize"
                    >{{ selectedFAQ.category.replace("_", " ") }}</span
                  >
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

          <div class="p-6 space-y-6">
            <!-- Answer -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Answer
              </h4>
              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div
                  class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {{ selectedFAQ.answer }}
                </div>
              </div>
            </div>

            <!-- Metrics -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Views:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedFAQ.views.toLocaleString() }}
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Helpful:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedFAQ.helpful }} ({{
                    getHelpfulPercentage(selectedFAQ)
                  }}%)
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400"
                  >Not Helpful:</span
                >
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedFAQ.notHelpful }}
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400"
                  >Last Updated:</span
                >
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ formatDate(selectedFAQ.lastUpdated) }}
                </p>
              </div>
            </div>

            <!-- Target Audience -->
            <div
              v-if="
                selectedFAQ.targetAudience &&
                selectedFAQ.targetAudience.length > 0
              ">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Target Audience
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="audience in selectedFAQ.targetAudience"
                  :key="audience"
                  class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                  {{
                    audience
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                  }}
                </span>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="selectedFAQ.tags && selectedFAQ.tags.length > 0">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Tags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedFAQ.tags"
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Helpful Voting -->
            <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4
                class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Was this helpful?
              </h4>
              <div class="flex items-center gap-3">
                <button
                  @click="handleHelpfulVote(selectedFAQ, true)"
                  class="inline-flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  👍 Yes ({{ selectedFAQ.helpful }})
                </button>
                <button
                  @click="handleHelpfulVote(selectedFAQ, false)"
                  class="inline-flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                  👎 No ({{ selectedFAQ.notHelpful }})
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showDetailModal = false"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Close
              </button>
              <button
                type="button"
                @click="
                  duplicateFAQ(selectedFAQ);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Duplicate FAQ
              </button>
              <button
                type="button"
                @click="
                  openEditModal(selectedFAQ);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                Edit FAQ
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
            🗑️ Delete FAQ
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete this FAQ? This action cannot be
            undone and will remove the FAQ from all related content.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ faqToDelete?.question }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ faqToDelete?.views || 0 }} views •
              {{ (faqToDelete?.helpful || 0) + (faqToDelete?.notHelpful || 0) }}
              votes
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
              Delete FAQ
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
:global(.dark) .icon-btn {
  border-color: #374151;
}
:global(.dark) .icon-btn:hover {
  background: #374151;
}
.prose {
  line-height: 1.6;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<!-- pages/website/treatments.vue -->
<script setup lang="ts">
import { useTreatmentsMock } from "~/composables/useTreatmentsMock";

const {
  treatments,
  treatmentStats,
  categories,
  addTreatment,
  updateTreatment,
  deleteTreatment,
} = useTreatmentsMock();

// State management
const searchQuery = ref("");
const filterCategory = ref("all");
const filterStatus = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const selectedTreatment = ref(null);
const treatmentToDelete = ref(null);
const isSubmitting = ref(false);

// Form data
const treatmentForm = ref({
  id: null,
  name: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  discountPrice: "",
  duration: "",
  availability: "available",
  isActive: true,
  isPopular: false,
  isFeatured: false,
  image: "",
  symptoms: [],
  prerequisites: [],
  procedures: [],
  tags: [],
});

const availabilityOptions = [
  { value: "available", label: "Available", color: "green" },
  { value: "limited", label: "Limited", color: "yellow" },
  { value: "unavailable", label: "Unavailable", color: "red" },
];

// Computed
const filteredTreatments = computed(() => {
  let filtered = treatments.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter((t) => t.category === filterCategory.value);
  }

  if (filterStatus.value !== "all") {
    if (filterStatus.value === "active") {
      filtered = filtered.filter((t) => t.isActive);
    } else if (filterStatus.value === "inactive") {
      filtered = filtered.filter((t) => !t.isActive);
    } else if (filterStatus.value === "popular") {
      filtered = filtered.filter((t) => t.isPopular);
    } else if (filterStatus.value === "featured") {
      filtered = filtered.filter((t) => t.isFeatured);
    }
  }

  return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
});

// CRUD Operations
const openAddModal = () => {
  treatmentForm.value = {
    id: null,
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    discountPrice: "",
    duration: "",
    availability: "available",
    isActive: true,
    isPopular: false,
    isFeatured: false,
    image: "",
    symptoms: [],
    prerequisites: [],
    procedures: [],
    tags: [],
  };
  showAddModal.value = true;
};

const openEditModal = (treatment) => {
  treatmentForm.value = { ...treatment };
  selectedTreatment.value = treatment;
  showEditModal.value = true;
};

const openDetailModal = (treatment) => {
  selectedTreatment.value = treatment;
  showDetailModal.value = true;
};

const openDeleteModal = (treatment) => {
  treatmentToDelete.value = treatment;
  showDeleteModal.value = true;
};

const saveTreatment = async () => {
  try {
    isSubmitting.value = true;

    if (treatmentForm.value.id) {
      // await $fetch(`/api/website/treatments/${treatmentForm.value.id}`, {
      //   method: 'PUT',
      //   body: treatmentForm.value
      // })
      updateTreatment(treatmentForm.value.id, treatmentForm.value);
    } else {
      // await $fetch('/api/website/treatments', {
      //   method: 'POST',
      //   body: treatmentForm.value
      // })
      addTreatment(treatmentForm.value);
    }

    showAddModal.value = false;
    showEditModal.value = false;
  } catch (error) {
    console.error("Error saving treatment:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    // await $fetch(`/api/website/treatments/${treatmentToDelete.value.id}`, {
    //   method: 'DELETE'
    // })
    deleteTreatment(treatmentToDelete.value.id);
    showDeleteModal.value = false;
    treatmentToDelete.value = null;
  } catch (error) {
    console.error("Error deleting treatment:", error);
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const getAvailabilityClass = (availability) => {
  const classes = {
    available:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    limited:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    unavailable: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return classes[availability] || classes.available;
};

const addArrayItem = (arrayName, item) => {
  if (item.trim() && !treatmentForm.value[arrayName].includes(item.trim())) {
    treatmentForm.value[arrayName].push(item.trim());
  }
};

const removeArrayItem = (arrayName, index) => {
  treatmentForm.value[arrayName].splice(index, 1);
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Treatment Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage medical treatments and services
        </p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
        💊 Add Treatment
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Treatments
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ treatmentStats.totalTreatments }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">💊</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Active Treatments
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ treatmentStats.activeTreatments }}
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
              Popular Treatments
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ treatmentStats.popularTreatments }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">⭐</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Featured Treatments
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ treatmentStats.featuredTreatments }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">🌟</span>
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
            placeholder="Search treatments..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Categories</option>
          <option
            v-for="category in categories"
            :key="category.name"
            :value="category.name">
            {{ category.name }} ({{ category.count }})
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="popular">Popular</option>
          <option value="featured">Featured</option>
        </select>
      </div>
    </div>

    <!-- Treatments Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="treatment in filteredTreatments"
        :key="treatment.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200">
        <!-- Image -->
        <div class="relative h-48 bg-gray-100 dark:bg-gray-800">
          <img
            v-if="treatment.image"
            :src="treatment.image"
            :alt="treatment.name"
            class="w-full h-full object-cover" />
          <div
            v-else
            class="flex items-center justify-center h-full text-gray-400 text-4xl">
            💊
          </div>

          <!-- Badges -->
          <div class="absolute top-3 left-3 flex gap-2">
            <span
              v-if="treatment.isFeatured"
              class="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
              Featured
            </span>
            <span
              v-if="treatment.isPopular"
              class="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
              Popular
            </span>
          </div>

          <!-- Status -->
          <div class="absolute top-3 right-3">
            <span
              :class="getAvailabilityClass(treatment.availability)"
              class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ treatment.availability }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <div class="mb-3">
            <h3
              class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {{ treatment.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {{ treatment.category }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ treatment.description }}
            </p>
          </div>

          <!-- Price & Duration -->
          <div class="flex items-center justify-between mb-3 text-sm">
            <div>
              <span
                v-if="
                  treatment.discountPrice &&
                  treatment.discountPrice < treatment.price
                "
                class="text-gray-500 line-through mr-2">
                {{ formatCurrency(treatment.price) }}
              </span>
              <span class="font-semibold text-[#4565AD]">
                {{ formatCurrency(treatment.discountPrice || treatment.price) }}
              </span>
            </div>
            <span class="text-gray-500 dark:text-gray-400"
              >{{ treatment.duration }}min</span
            >
          </div>

          <!-- Tags -->
          <div v-if="treatment.tags && treatment.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in treatment.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                {{ tag }}
              </span>
              <span
                v-if="treatment.tags.length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                +{{ treatment.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openDetailModal(treatment)"
              class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
              View
            </button>
            <button
              type="button"
              @click="openEditModal(treatment)"
              class="flex-1 px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
              Edit
            </button>
            <button
              type="button"
              @click="openDeleteModal(treatment)"
              class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredTreatments.length === 0"
        class="col-span-full flex flex-col items-center justify-center py-12">
        <div class="text-6xl mb-4">💊</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No treatments found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-center mb-4">
          Try adjusting your search criteria or add a new treatment.
        </p>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
          Add Treatment
        </button>
      </div>
    </div>

    <!-- Add/Edit Treatment Modal -->
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
                {{ showEditModal ? "Edit Treatment" : "Add New Treatment" }}
              </h3>
              <button
                type="button"
                @click="showAddModal = showEditModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="saveTreatment" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Treatment Name *</label
                  >
                  <input
                    v-model="treatmentForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="General Consultation" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Category *</label
                  >
                  <input
                    v-model="treatmentForm.category"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Consultation" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Subcategory</label
                  >
                  <input
                    v-model="treatmentForm.subcategory"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="General Medicine" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Price (₹) *</label
                  >
                  <input
                    v-model="treatmentForm.price"
                    type="number"
                    min="0"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="500" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Discount Price (₹)</label
                  >
                  <input
                    v-model="treatmentForm.discountPrice"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="450" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Duration (minutes) *</label
                  >
                  <input
                    v-model="treatmentForm.duration"
                    type="number"
                    min="1"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="30" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Availability *</label
                  >
                  <select
                    v-model="treatmentForm.availability"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="option in availabilityOptions"
                      :key="option.value"
                      :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="treatmentForm.description"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Describe the treatment..."></textarea>
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
                    v-model="treatmentForm.isActive"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Active</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="treatmentForm.isPopular"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Popular</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="treatmentForm.isFeatured"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Featured</span
                  >
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showAddModal = showEditModal = false"
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
                    ? "Update Treatment"
                    : "Create Treatment"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Treatment Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedTreatment"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedTreatment.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedTreatment.category }} •
                  {{ selectedTreatment.duration }}min
                </p>
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
            <!-- Image -->
            <div
              v-if="selectedTreatment.image"
              class="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                :src="selectedTreatment.image"
                :alt="selectedTreatment.name"
                class="w-full h-full object-cover" />
            </div>

            <!-- Description -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h4>
              <p
                class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                {{ selectedTreatment.description }}
              </p>
            </div>

            <!-- Price & Details -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Price:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(selectedTreatment.price) }}
                </p>
              </div>
              <div v-if="selectedTreatment.discountPrice">
                <span class="text-gray-500 dark:text-gray-400"
                  >Discounted Price:</span
                >
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(selectedTreatment.discountPrice) }}
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Duration:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedTreatment.duration }} minutes
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400"
                  >Availability:</span
                >
                <span
                  :class="getAvailabilityClass(selectedTreatment.availability)"
                  class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ selectedTreatment.availability }}
                </span>
              </div>
            </div>

            <!-- Symptoms -->
            <div
              v-if="
                selectedTreatment.symptoms &&
                selectedTreatment.symptoms.length > 0
              ">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Common Symptoms
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="symptom in selectedTreatment.symptoms"
                  :key="symptom"
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                  {{ symptom }}
                </span>
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
                  openEditModal(selectedTreatment);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                Edit Treatment
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
            🗑️ Delete Treatment
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete
            <strong>{{ treatmentToDelete?.name }}</strong
            >? This action cannot be undone and will remove the treatment from
            all related bookings.
          </p>
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
              Delete Treatment
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

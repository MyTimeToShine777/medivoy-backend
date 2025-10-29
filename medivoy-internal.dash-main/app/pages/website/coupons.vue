<!-- pages/website/coupons.vue -->
<script setup lang="ts">
import { useCouponsMock } from "~/composables/useCouponsMock";

const { coupons, couponStats, addCoupon, updateCoupon, deleteCoupon } =
  useCouponsMock();

// State management
const searchQuery = ref("");
const filterStatus = ref("all");
const filterType = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const selectedCoupon = ref(null);
const couponToDelete = ref(null);
const isSubmitting = ref(false);
const isLoading = ref(false);

// Form data for new/edit coupon
const couponForm = ref({
  id: null,
  code: "",
  title: "",
  description: "",
  type: "percentage",
  value: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  usageCount: 0,
  userLimit: 1,
  validFrom: "",
  validTo: "",
  status: "active",
  applicableFor: "all",
  categories: [],
  excludedCategories: [],
  isPublic: true,
  autoApply: false,
});

// Options
const couponTypes = [
  { value: "percentage", label: "Percentage Discount", icon: "%" },
  { value: "fixed", label: "Fixed Amount", icon: "₹" },
  { value: "free_shipping", label: "Free Shipping", icon: "🚚" },
];

const applicableOptions = [
  { value: "all", label: "All Users" },
  { value: "first_time", label: "First Time Users" },
  { value: "specific_users", label: "Specific Users" },
];

const categories = [
  "Consultation",
  "Lab Tests",
  "Prescription",
  "Surgery",
  "Health Packages",
  "Diagnostic",
  "Emergency",
  "Home Care",
];

// Computed properties
const filteredCoupons = computed(() => {
  let filtered = coupons.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter((c) => c.status === filterStatus.value);
  }

  if (filterType.value !== "all") {
    filtered = filtered.filter((c) => c.type === filterType.value);
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// CRUD Operations
const openAddModal = () => {
  couponForm.value = {
    id: null,
    code: "",
    title: "",
    description: "",
    type: "percentage",
    value: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    usageCount: 0,
    userLimit: 1,
    validFrom: "",
    validTo: "",
    status: "active",
    applicableFor: "all",
    categories: [],
    excludedCategories: [],
    isPublic: true,
    autoApply: false,
  };
  showAddModal.value = true;
};

const openEditModal = (coupon) => {
  couponForm.value = { ...coupon };
  selectedCoupon.value = coupon;
  showEditModal.value = true;
};

const openDetailModal = (coupon) => {
  selectedCoupon.value = coupon;
  showDetailModal.value = true;
};

const openDeleteModal = (coupon) => {
  couponToDelete.value = coupon;
  showDeleteModal.value = true;
};

const saveCoupon = async () => {
  try {
    isSubmitting.value = true;

    // API Integration point
    if (couponForm.value.id) {
      // await $fetch(`/api/website/coupons/${couponForm.value.id}`, {
      //   method: 'PUT',
      //   body: couponForm.value
      // })
      updateCoupon(couponForm.value.id, couponForm.value);
    } else {
      // await $fetch('/api/website/coupons', {
      //   method: 'POST',
      //   body: couponForm.value
      // })
      addCoupon(couponForm.value);
    }

    showAddModal.value = false;
    showEditModal.value = false;
  } catch (error) {
    console.error("Error saving coupon:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    // await $fetch(`/api/website/coupons/${couponToDelete.value.id}`, {
    //   method: 'DELETE'
    // })
    deleteCoupon(couponToDelete.value.id);
    showDeleteModal.value = false;
    couponToDelete.value = null;
  } catch (error) {
    console.error("Error deleting coupon:", error);
  }
};

const toggleCouponStatus = async (coupon) => {
  try {
    const newStatus = coupon.status === "active" ? "inactive" : "active";

    // await $fetch(`/api/website/coupons/${coupon.id}/status`, {
    //   method: 'PATCH',
    //   body: { status: newStatus }
    // })

    updateCoupon(coupon.id, { status: newStatus });
  } catch (error) {
    console.error("Error toggling coupon status:", error);
  }
};

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN");
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const getStatusClass = (status) => {
  const classes = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    inactive:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return classes[status] || classes.inactive;
};

const getTypeIcon = (type) => {
  const icons = {
    percentage: "%",
    fixed: "₹",
    free_shipping: "🚚",
  };
  return icons[type] || "%";
};

const generateCouponCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  couponForm.value.code = result;
};

const duplicateCoupon = (coupon) => {
  couponForm.value = {
    ...coupon,
    id: null,
    code: `${coupon.code}_COPY`,
    title: `${coupon.title} (Copy)`,
    usageCount: 0,
    totalSavings: 0,
  };
  showAddModal.value = true;
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Coupon Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage discount codes and promotional offers
        </p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
        🎫 Add Coupon
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Total Coupons
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ couponStats.totalCoupons }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400">🎫</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Active Coupons
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ couponStats.activeCoupons }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span class="text-green-600 dark:text-green-400">✅</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Expired Coupons
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ couponStats.expiredCoupons }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span class="text-red-600 dark:text-red-400">⏰</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Total Savings
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ formatCurrency(couponStats.totalSavings) }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span class="text-purple-600 dark:text-purple-400">💰</span>
            </div>
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
            placeholder="Search coupons..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>

        <select
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Types</option>
          <option
            v-for="type in couponTypes"
            :key="type.value"
            :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Coupons List -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Coupon List
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredCoupons.length }} coupons found
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr
              class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
              <th class="text-left px-4 py-3 font-semibold">Code</th>
              <th class="text-left px-4 py-3 font-semibold">Title</th>
              <th class="text-left px-4 py-3 font-semibold">Type</th>
              <th class="text-left px-4 py-3 font-semibold">Discount</th>
              <th class="text-left px-4 py-3 font-semibold">Usage</th>
              <th class="text-left px-4 py-3 font-semibold">Valid Until</th>
              <th class="text-left px-4 py-3 font-semibold">Status</th>
              <th class="text-left px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr
              v-for="coupon in filteredCoupons"
              :key="coupon.id"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span
                    class="text-[13px] font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {{ coupon.code }}
                  </span>
                  <button
                    type="button"
                    @click="
                      navigator?.clipboard?.writeText &&
                        navigator.clipboard.writeText(coupon.code)
                    "
                    class="text-gray-400 hover:text-gray-600"
                    title="Copy code">
                    📋
                  </button>
                </div>
              </td>

              <td class="px-4 py-3">
                <div class="max-w-xs">
                  <p
                    class="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ coupon.title }}
                  </p>
                  <p
                    class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
                    {{ coupon.description }}
                  </p>
                </div>
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <span>{{ getTypeIcon(coupon.type) }}</span>
                  <span class="text-gray-700 dark:text-gray-300">
                    {{
                      couponTypes.find((t) => t.value === coupon.type)?.label
                    }}
                  </span>
                </div>
              </td>

              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                <span v-if="coupon.type === 'percentage'"
                  >{{ coupon.value }}%</span
                >
                <span v-else-if="coupon.type === 'fixed'">{{
                  formatCurrency(coupon.value)
                }}</span>
                <span v-else>Free Shipping</span>
              </td>

              <td class="px-4 py-3">
                <div class="text-xs">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-700 dark:text-gray-300">{{
                      coupon.usageCount
                    }}</span>
                    <span class="text-gray-500">/</span>
                    <span class="text-gray-500">{{
                      coupon.usageLimit || "∞"
                    }}</span>
                  </div>
                  <div class="text-gray-400">
                    {{ `${formatCurrency(coupon.totalSavings || 0)} saved` }}
                  </div>
                </div>
              </td>

              <td
                class="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-400">
                {{ formatDate(coupon.validTo) }}
              </td>

              <td class="px-4 py-3">
                <button
                  type="button"
                  @click="toggleCouponStatus(coupon)"
                  :class="getStatusClass(coupon.status)"
                  class="px-2 py-1 text-[11px] font-semibold rounded-full uppercase cursor-pointer hover:opacity-80">
                  {{ coupon.status }}
                </button>
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="openDetailModal(coupon)"
                    class="icon-btn view-btn"
                    title="View Details">
                    👁️
                  </button>
                  <button
                    type="button"
                    @click="openEditModal(coupon)"
                    class="icon-btn edit-btn"
                    title="Edit Coupon">
                    ✏️
                  </button>
                  <button
                    type="button"
                    @click="duplicateCoupon(coupon)"
                    class="icon-btn duplicate-btn"
                    title="Duplicate Coupon">
                    📋
                  </button>
                  <button
                    type="button"
                    @click="openDeleteModal(coupon)"
                    class="icon-btn delete-btn"
                    title="Delete Coupon">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredCoupons.length === 0">
              <td
                colspan="8"
                class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No coupons found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Coupon Modal -->
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
                {{ showEditModal ? "Edit Coupon" : "Add New Coupon" }}
              </h3>
              <button
                @click="showAddModal = showEditModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="saveCoupon" class="p-6 space-y-6">
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
                    >Coupon Code *</label
                  >
                  <div class="flex gap-2">
                    <input
                      v-model="couponForm.code"
                      type="text"
                      required
                      class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      placeholder="SAVE20" />
                    <button
                      type="button"
                      @click="generateCouponCode"
                      class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Generate Random Code">
                      🎲
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Coupon Type *</label
                  >
                  <select
                    v-model="couponForm.type"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in couponTypes"
                      :key="type.value"
                      :value="type.value">
                      {{ type.icon }} {{ type.label }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Title *</label
                  >
                  <input
                    v-model="couponForm.title"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="New User Discount" />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="couponForm.description"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Describe the coupon offer..."></textarea>
                </div>
              </div>
            </div>

            <!-- Discount Settings -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Discount Settings
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-if="couponForm.type !== 'free_shipping'">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{
                      couponForm.type === "percentage"
                        ? "Discount Percentage"
                        : "Discount Amount"
                    }}
                    *
                  </label>
                  <div class="relative">
                    <input
                      v-model="couponForm.value"
                      type="number"
                      required
                      :min="couponForm.type === 'percentage' ? 1 : 10"
                      :max="couponForm.type === 'percentage' ? 100 : undefined"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      :placeholder="
                        couponForm.type === 'percentage' ? '20' : '500'
                      " />
                    <span class="absolute right-3 top-2.5 text-gray-500">
                      {{ couponForm.type === "percentage" ? "%" : "₹" }}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Minimum Order Amount</label
                  >
                  <div class="relative">
                    <input
                      v-model="couponForm.minOrderAmount"
                      type="number"
                      min="0"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      placeholder="500" />
                    <span class="absolute right-3 top-2.5 text-gray-500"
                      >₹</span
                    >
                  </div>
                </div>

                <div v-if="couponForm.type === 'percentage'">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Maximum Discount Amount</label
                  >
                  <div class="relative">
                    <input
                      v-model="couponForm.maxDiscountAmount"
                      type="number"
                      min="0"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      placeholder="1000" />
                    <span class="absolute right-3 top-2.5 text-gray-500"
                      >₹</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Usage Limits -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Usage Limits
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Total Usage Limit</label
                  >
                  <input
                    v-model="couponForm.usageLimit"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Leave empty for unlimited" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Usage Per User</label
                  >
                  <input
                    v-model="couponForm.userLimit"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="1" />
                </div>
              </div>
            </div>

            <!-- Validity Period -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Validity Period
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Valid From *</label
                  >
                  <input
                    v-model="couponForm.validFrom"
                    type="date"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Valid To *</label
                  >
                  <input
                    v-model="couponForm.validTo"
                    type="date"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Advanced Settings -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Advanced Settings
              </h4>

              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Applicable For</label
                  >
                  <select
                    v-model="couponForm.applicableFor"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="option in applicableOptions"
                      :key="option.value"
                      :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Applicable Categories</label
                  >
                  <div
                    class="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <label
                      v-for="category in categories"
                      :key="category"
                      class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        :value="category"
                        v-model="couponForm.categories"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        category
                      }}</span>
                    </label>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="couponForm.isPublic"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Public (visible to all users)</span
                    >
                  </label>

                  <label class="flex items-center gap-2">
                    <input
                      v-model="couponForm.autoApply"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Auto-apply when conditions met</span
                    >
                  </label>
                </div>
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
                    ? "Update Coupon"
                    : "Create Coupon"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Coupon Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedCoupon"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedCoupon.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedCoupon.code }}
                </p>
              </div>
              <button
                @click="showDetailModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- Basic Info -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Coupon Details
              </h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Type:</span>
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    {{ getTypeIcon(selectedCoupon.type) }}
                    {{
                      couponTypes.find((t) => t.value === selectedCoupon.type)
                        ?.label
                    }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400"
                    >Discount:</span
                  >
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    <span v-if="selectedCoupon.type === 'percentage'"
                      >{{ selectedCoupon.value }}%</span
                    >
                    <span v-else-if="selectedCoupon.type === 'fixed'">{{
                      formatCurrency(selectedCoupon.value)
                    }}</span>
                    <span v-else>Free Shipping</span>
                  </p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400"
                    >Valid From:</span
                  >
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    {{ formatDate(selectedCoupon.validFrom) }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400"
                    >Valid To:</span
                  >
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    {{ formatDate(selectedCoupon.validTo) }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400"
                    >Min Order:</span
                  >
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    {{
                      selectedCoupon.minOrderAmount
                        ? formatCurrency(selectedCoupon.minOrderAmount)
                        : "No minimum"
                    }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Usage:</span>
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    {{ selectedCoupon.usageCount }} /
                    {{ selectedCoupon.usageLimit || "∞" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h4>
              <p
                class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                {{ selectedCoupon.description || "No description provided" }}
              </p>
            </div>

            <!-- Categories -->
            <div
              v-if="
                selectedCoupon.categories &&
                selectedCoupon.categories.length > 0
              ">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Applicable Categories
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="category in selectedCoupon.categories"
                  :key="category"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                  {{ category }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                @click="showDetailModal = false"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Close
              </button>
              <button
                @click="
                  openEditModal(selectedCoupon);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                Edit Coupon
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
            🗑️ Delete Coupon
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete the coupon
            <strong>{{ couponToDelete?.code }}</strong
            >? This action cannot be undone and will affect
            {{ couponToDelete?.usageCount || 0 }} existing uses.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete Coupon
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
</style>

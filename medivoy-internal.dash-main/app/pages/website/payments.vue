<!-- pages/website/payments.vue -->
<script setup lang="ts">
import { usePaymentsMock } from "~/composables/usePaymentsMock";

const {
  payments,
  paymentStats,
  addPayment,
  updatePayment,
  deletePayment,
  processRefund,
  retryPayment,
  bulkUpdateStatus,
  exportPayments,
} = usePaymentsMock();

// State management
const searchQuery = ref("");
const filterStatus = ref("all");
const filterMethod = ref("all");
const filterCurrency = ref("all");
const filterCountry = ref("all");
const filterPlatform = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showRefundModal = ref(false);
const showBulkModal = ref(false);
const showDetailModal = ref(false);
const selectedPayment = ref(null);
const paymentToDelete = ref(null);
const selectedItems = ref([]);
const isSubmitting = ref(false);
const isProcessingRefund = ref(false);
const sortBy = ref("paymentDate");
const sortOrder = ref("desc");
const viewMode = ref("list");

// Refund form
const refundForm = ref({
  amount: 0,
  reason: "",
  notes: "",
});

// Payment form
const paymentForm = ref({
  id: null,
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  serviceType: "consultation",
  serviceName: "",
  doctorName: "",
  department: "",
  facility: "",
  country: "UAE",
  currency: "AED",
  amount: 0,
  taxAmount: 0,
  discountAmount: 0,
  totalAmount: 0,
  paymentMethod: "credit_card",
  paymentGateway: "stripe",
  paymentStatus: "pending",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  insuranceCoverage: 0,
  copayAmount: 0,
  appointmentDate: "",
  platform: "website",
  notes: "",
  tags: [],
});

// Options for international payments
const serviceTypes = [
  "consultation",
  "surgery",
  "emergency",
  "laboratory",
  "radiology",
  "pharmacy",
  "physiotherapy",
  "dental",
  "telemedicine",
  "subscription",
];

const paymentMethods = [
  { value: "credit_card", label: "Credit Card", icon: "💳" },
  { value: "debit_card", label: "Debit Card", icon: "💳" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "digital_wallet", label: "Digital Wallet", icon: "📱" },
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "insurance", label: "Insurance", icon: "🛡️" },
  { value: "crypto", label: "Cryptocurrency", icon: "₿" },
  { value: "installment", label: "Installment", icon: "📅" },
];

const paymentStatuses = [
  {
    value: "pending",
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    value: "completed",
    label: "Completed",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    value: "failed",
    label: "Failed",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    value: "refunded",
    label: "Refunded",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    value: "partial",
    label: "Partial",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    value: "pending_approval",
    label: "Pending Approval",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
];

const currencies = [
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", country: "UAE" },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", country: "Saudi Arabia" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ق.ر", country: "Qatar" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", country: "Kuwait" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", country: "Bahrain" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", country: "Oman" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", country: "Jordan" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", country: "Lebanon" },
  { code: "EGP", name: "Egyptian Pound", symbol: "ج.م", country: "Egypt" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", country: "Turkey" },
  { code: "USD", name: "US Dollar", symbol: "$", country: "International" },
  { code: "EUR", name: "Euro", symbol: "€", country: "International" },
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
  "Iraq",
  "Syria",
  "Yemen",
];

const platforms = [
  "website",
  "mobile_app",
  "walk_in",
  "telemedicine_app",
  "call_center",
];

// Temporary input field
const newTag = ref("");

// Computed
const filteredPayments = computed(() => {
  let filtered = [...payments.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.transactionId.toLowerCase().includes(query) ||
        p.patientName.toLowerCase().includes(query) ||
        p.serviceName.toLowerCase().includes(query) ||
        p.doctorName.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter((p) => p.paymentStatus === filterStatus.value);
  }

  if (filterMethod.value !== "all") {
    filtered = filtered.filter((p) => p.paymentMethod === filterMethod.value);
  }

  if (filterCurrency.value !== "all") {
    filtered = filtered.filter((p) => p.currency === filterCurrency.value);
  }

  if (filterCountry.value !== "all") {
    filtered = filtered.filter((p) => p.country === filterCountry.value);
  }

  if (filterPlatform.value !== "all") {
    filtered = filtered.filter((p) => p.platform === filterPlatform.value);
  }

  return filtered.sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];

    if (sortBy.value === "paymentDate" || sortBy.value === "createdAt") {
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
  return paymentStatuses.find((s) => s.value === status) || paymentStatuses[0];
};

const getPaymentMethodInfo = (method) => {
  return paymentMethods.find((m) => m.value === method) || paymentMethods[0];
};

const getCurrencyInfo = (code) => {
  return currencies.find((c) => c.code === code) || currencies[0];
};

const formatAmount = (amount, currency) => {
  const currencyInfo = getCurrencyInfo(currency);
  return `${currencyInfo.symbol} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "completed" || status === "refunded") return false;
  return new Date(dueDate) < new Date();
};

const getDaysOverdue = (dueDate) => {
  if (!dueDate) return 0;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = today - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Array manipulation
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !paymentForm.value.tags.includes(tag)) {
    paymentForm.value.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index) => {
  paymentForm.value.tags.splice(index, 1);
};

// Calculate total amount
const calculateTotal = () => {
  const amount = parseFloat(paymentForm.value.amount) || 0;
  const tax = parseFloat(paymentForm.value.taxAmount) || 0;
  const discount = parseFloat(paymentForm.value.discountAmount) || 0;
  paymentForm.value.totalAmount = amount + tax - discount;
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (payment) => {
  paymentForm.value = {
    ...payment,
    tags: [...(payment.tags || [])],
  };
  selectedPayment.value = payment;
  showEditModal.value = true;
};

const openDeleteModal = (payment) => {
  paymentToDelete.value = payment;
  showDeleteModal.value = true;
};

const openRefundModal = (payment) => {
  selectedPayment.value = payment;
  refundForm.value = {
    amount: payment.totalAmount,
    reason: "",
    notes: "",
  };
  showRefundModal.value = true;
};

const openDetailModal = (payment) => {
  selectedPayment.value = payment;
  showDetailModal.value = true;
};

const openBulkModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select payments to perform bulk operations");
    return;
  }
  showBulkModal.value = true;
};

const resetForm = () => {
  paymentForm.value = {
    id: null,
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    serviceType: "consultation",
    serviceName: "",
    doctorName: "",
    department: "",
    facility: "",
    country: "UAE",
    currency: "AED",
    amount: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    paymentMethod: "credit_card",
    paymentGateway: "stripe",
    paymentStatus: "pending",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceCoverage: 0,
    copayAmount: 0,
    appointmentDate: "",
    platform: "website",
    notes: "",
    tags: [],
  };
  newTag.value = "";
};

const savePayment = async () => {
  try {
    isSubmitting.value = true;

    if (
      !paymentForm.value.patientName ||
      !paymentForm.value.serviceName ||
      !paymentForm.value.amount
    ) {
      alert("Please fill in all required fields");
      return;
    }

    calculateTotal();

    const paymentData = {
      ...paymentForm.value,
      orderId: `ORD-${paymentForm.value.country
        .substring(0, 3)
        .toUpperCase()}-${Date.now()}`,
      paymentDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
    };

    if (paymentForm.value.id) {
      updatePayment(paymentForm.value.id, paymentData);
      alert("Payment updated successfully!");
    } else {
      addPayment(paymentData);
      alert("Payment created successfully!");
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving payment:", error);
    alert("Error saving payment. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    deletePayment(paymentToDelete.value.id);
    showDeleteModal.value = false;
    paymentToDelete.value = null;
    alert("Payment deleted successfully!");
  } catch (error) {
    console.error("Error deleting payment:", error);
    alert("Error deleting payment. Please try again.");
  }
};

const handleRefund = async () => {
  try {
    isProcessingRefund.value = true;

    if (!refundForm.value.reason || refundForm.value.amount <= 0) {
      alert("Please provide refund amount and reason");
      return;
    }

    processRefund(
      selectedPayment.value.id,
      refundForm.value.amount,
      refundForm.value.reason
    );
    showRefundModal.value = false;
    alert("Refund processed successfully!");
  } catch (error) {
    console.error("Error processing refund:", error);
    alert("Error processing refund. Please try again.");
  } finally {
    isProcessingRefund.value = false;
  }
};

const handleRetry = (payment) => {
  retryPayment(payment.id);
  alert("Payment retry initiated!");
};

const handleBulkOperation = async (operation, status = null) => {
  try {
    if (operation === "status" && status) {
      bulkUpdateStatus(selectedItems.value, status);
      alert(`Updated ${selectedItems.value.length} payments to ${status}`);
    }

    selectedItems.value = [];
    showBulkModal.value = false;
  } catch (error) {
    console.error("Error performing bulk operation:", error);
    alert("Error performing bulk operation. Please try again.");
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
  if (selectedItems.value.length === filteredPayments.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredPayments.value.map((item) => item.id);
  }
};

const exportData = () => {
  const csvData = exportPayments();
  alert(`Exported ${csvData.length} payments to CSV`);
};

const duplicatePayment = (payment) => {
  paymentForm.value = {
    ...payment,
    id: null,
    patientName: `${payment.patientName} (Copy)`,
    transactionId: "",
    paymentStatus: "pending",
    tags: [...payment.tags],
  };
  showAddModal.value = true;
};

// Watch for amount changes to auto-calculate
watch(
  [
    () => paymentForm.value.amount,
    () => paymentForm.value.taxAmount,
    () => paymentForm.value.discountAmount,
  ],
  calculateTotal
);
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          International Payments Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage payments, refunds, and billing across Middle East healthcare
          facilities
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="exportData"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          📊 Export Data
        </button>
        <button
          @click="openBulkModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50">
          📦 Bulk Actions ({{ selectedItems.length }})
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
            @click="viewMode = 'cards'"
            :class="
              viewMode === 'cards'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            ⊞ Cards
          </button>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          💳 New Payment
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
              Total Payments
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ paymentStats.totalPayments }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">💳</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Completed
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ paymentStats.completedPayments }}
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
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Pending</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ paymentStats.pendingPayments }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">⏳</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Failed</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ paymentStats.failedPayments }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="text-red-600 dark:text-red-400">❌</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Revenue
            </p>
            <p
              class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Multi-Currency
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">💰</span>
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
              {{ paymentStats.successRate }}%
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">📈</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue by Currency -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Revenue by Currency & Payment Methods
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Top Currencies
          </h4>
          <div class="space-y-2">
            <div
              v-for="(count, currency) in Object.fromEntries(
                Object.entries(paymentStats.currencies)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
              )"
              :key="currency"
              class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  >{{ currency }}</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400">{{
                  getCurrencyInfo(currency).name
                }}</span>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >{{ count }} payments</span
              >
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Payment Methods
          </h4>
          <div class="space-y-2">
            <div
              v-for="(count, method) in Object.fromEntries(
                Object.entries(paymentStats.paymentMethods)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
              )"
              :key="method"
              class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span>{{ getPaymentMethodInfo(method).icon }}</span>
                <span
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  >{{ getPaymentMethodInfo(method).label }}</span
                >
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >{{ count }} payments</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        <div class="relative md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search payments, patients, services..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option
            v-for="status in paymentStatuses"
            :key="status.value"
            :value="status.value">
            {{ status.label }}
          </option>
        </select>

        <select
          v-model="filterMethod"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Methods</option>
          <option
            v-for="method in paymentMethods"
            :key="method.value"
            :value="method.value">
            {{ method.icon }} {{ method.label }}
          </option>
        </select>

        <select
          v-model="filterCurrency"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Currencies</option>
          <option
            v-for="currency in currencies"
            :key="currency.code"
            :value="currency.code">
            {{ currency.symbol }} {{ currency.code }}
          </option>
        </select>

        <select
          v-model="filterCountry"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Countries</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>

        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="paymentDate">Payment Date</option>
          <option value="createdAt">Created Date</option>
          <option value="totalAmount">Amount</option>
          <option value="patientName">Patient Name</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="
                selectedItems.length === filteredPayments.length &&
                filteredPayments.length > 0
              "
              @change="selectAllItems"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span class="text-gray-700 dark:text-gray-300"
              >Select All ({{ filteredPayments.length }})</span
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

    <!-- Payments List/Cards -->
    <div
      v-if="viewMode === 'list'"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            International Payments
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredPayments.length }} payments found
          </p>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="payment in filteredPayments"
          :key="payment.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-center gap-4">
            <!-- Selection -->
            <input
              type="checkbox"
              :checked="selectedItems.includes(payment.id)"
              @change="toggleItemSelection(payment.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />

            <!-- Payment Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-4">
                  <div>
                    <h3
                      class="text-base font-semibold text-gray-900 dark:text-white">
                      {{ payment.transactionId }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ payment.patientName }} • {{ payment.serviceName }}
                    </p>
                  </div>

                  <span
                    :class="getStatusInfo(payment.paymentStatus).color"
                    class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ getStatusInfo(payment.paymentStatus).label }}
                  </span>
                </div>

                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formatAmount(payment.totalAmount, payment.currency) }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ payment.country }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  {{ getPaymentMethodInfo(payment.paymentMethod).icon }}
                  {{ getPaymentMethodInfo(payment.paymentMethod).label }}
                </span>
                <span>{{ formatDate(payment.paymentDate) }}</span>
                <span>{{ payment.doctorName }}</span>
                <span>{{ payment.facility }}</span>
                <span
                  v-if="isOverdue(payment.dueDate, payment.paymentStatus)"
                  class="text-red-600 dark:text-red-400">
                  {{ getDaysOverdue(payment.dueDate) }} days overdue
                </span>
              </div>

              <!-- Insurance Info -->
              <div
                v-if="payment.insuranceProvider"
                class="mt-2 flex items-center gap-4 text-sm">
                <span
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                  🛡️ {{ payment.insuranceProvider }}
                </span>
                <span class="text-gray-600 dark:text-gray-400"
                  >Coverage:
                  {{
                    formatAmount(payment.insuranceCoverage, payment.currency)
                  }}</span
                >
                <span
                  v-if="payment.copayAmount > 0"
                  class="text-gray-600 dark:text-gray-400"
                  >Copay:
                  {{
                    formatAmount(payment.copayAmount, payment.currency)
                  }}</span
                >
              </div>

              <!-- Tags -->
              <div v-if="payment.tags && payment.tags.length > 0" class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in payment.tags.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="openDetailModal(payment)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="View Details">
                👁️
              </button>
              <button
                v-if="payment.paymentStatus === 'failed'"
                @click="handleRetry(payment)"
                class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Retry">
                🔄
              </button>
              <button
                v-if="payment.paymentStatus === 'completed'"
                @click="openRefundModal(payment)"
                class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="Refund">
                💸
              </button>
              <button
                @click="duplicatePayment(payment)"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Duplicate">
                📋
              </button>
              <button
                @click="openEditModal(payment)"
                class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Edit">
                ✏️
              </button>
              <button
                @click="openDeleteModal(payment)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="payment in filteredPayments"
        :key="payment.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between mb-4">
          <input
            type="checkbox"
            :checked="selectedItems.includes(payment.id)"
            @change="toggleItemSelection(payment.id)"
            class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
          <span
            :class="getStatusInfo(payment.paymentStatus).color"
            class="px-3 py-1 text-sm font-medium rounded-full">
            {{ getStatusInfo(payment.paymentStatus).label }}
          </span>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {{ payment.transactionId }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ payment.patientName }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ payment.serviceName }}
          </p>
        </div>

        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatAmount(payment.totalAmount, payment.currency) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ payment.country }}
            </p>
          </div>
          <div class="text-right">
            <span
              class="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              {{ getPaymentMethodInfo(payment.paymentMethod).icon }}
              {{ getPaymentMethodInfo(payment.paymentMethod).label }}
            </span>
          </div>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <p>📅 {{ formatDate(payment.paymentDate) }}</p>
          <p>👨‍⚕️ {{ payment.doctorName }}</p>
          <p>🏥 {{ payment.facility }}</p>
        </div>

        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <button
              @click="openDetailModal(payment)"
              class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="View Details">
              👁️
            </button>
            <button
              v-if="payment.paymentStatus === 'failed'"
              @click="handleRetry(payment)"
              class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
              title="Retry">
              🔄
            </button>
            <button
              v-if="payment.paymentStatus === 'completed'"
              @click="openRefundModal(payment)"
              class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
              title="Refund">
              💸
            </button>
            <button
              @click="openEditModal(payment)"
              class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
              title="Edit">
              ✏️
            </button>
          </div>

          <div
            v-if="isOverdue(payment.dueDate, payment.paymentStatus)"
            class="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs rounded">
            {{ getDaysOverdue(payment.dueDate) }} days overdue
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredPayments.length === 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <div class="text-6xl mb-4">💳</div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No payments found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or create your first payment record.
      </p>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
        Create Payment
      </button>
    </div>

    <!-- Add/Edit Payment Modal -->
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
                {{ showEditModal ? "Edit Payment" : "Create New Payment" }}
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

          <form @submit.prevent="savePayment" class="p-6 space-y-6">
            <!-- Patient Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Patient Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Patient Name *</label
                  >
                  <input
                    v-model="paymentForm.patientName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Enter patient full name" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Email</label
                  >
                  <input
                    v-model="paymentForm.patientEmail"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="patient@email.com" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Phone</label
                  >
                  <input
                    v-model="paymentForm.patientPhone"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="+971-50-123-4567" />
                </div>
              </div>
            </div>

            <!-- Service Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Service Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Service Type *</label
                  >
                  <select
                    v-model="paymentForm.serviceType"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in serviceTypes"
                      :key="type"
                      :value="type">
                      {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Service Name *</label
                  >
                  <input
                    v-model="paymentForm.serviceName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="e.g., Cardiology Consultation" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Doctor Name</label
                  >
                  <input
                    v-model="paymentForm.doctorName"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Dr. John Smith" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Department</label
                  >
                  <input
                    v-model="paymentForm.department"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Cardiology" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Facility</label
                  >
                  <input
                    v-model="paymentForm.facility"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Dubai Healthcare Center" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Appointment Date</label
                  >
                  <input
                    v-model="paymentForm.appointmentDate"
                    type="datetime-local"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Payment Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Country *</label
                  >
                  <select
                    v-model="paymentForm.country"
                    required
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
                    >Currency *</label
                  >
                  <select
                    v-model="paymentForm.currency"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="currency in currencies"
                      :key="currency.code"
                      :value="currency.code">
                      {{ currency.symbol }} {{ currency.code }} -
                      {{ currency.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Payment Method *</label
                  >
                  <select
                    v-model="paymentForm.paymentMethod"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="method in paymentMethods"
                      :key="method.value"
                      :value="method.value">
                      {{ method.icon }} {{ method.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Base Amount *</label
                  >
                  <input
                    v-model="paymentForm.amount"
                    type="number"
                    step="0.01"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="0.00" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Tax Amount</label
                  >
                  <input
                    v-model="paymentForm.taxAmount"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="0.00" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Discount Amount</label
                  >
                  <input
                    v-model="paymentForm.discountAmount"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="0.00" />
                </div>

                <div class="md:col-span-3">
                  <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p
                      class="text-lg font-semibold text-gray-900 dark:text-white">
                      Total Amount:
                      {{
                        formatAmount(
                          paymentForm.totalAmount,
                          paymentForm.currency
                        )
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Insurance Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Insurance Information (Optional)
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Insurance Provider</label
                  >
                  <input
                    v-model="paymentForm.insuranceProvider"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Insurance Company Name" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Policy Number</label
                  >
                  <input
                    v-model="paymentForm.insurancePolicyNumber"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="POL-123456789" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Coverage Amount</label
                  >
                  <input
                    v-model="paymentForm.insuranceCoverage"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="0.00" />
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Additional Information
              </h4>
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Platform</label
                  >
                  <select
                    v-model="paymentForm.platform"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="platform in platforms"
                      :key="platform"
                      :value="platform">
                      {{
                        platform.replace("_", " ").charAt(0).toUpperCase() +
                        platform.replace("_", " ").slice(1)
                      }}
                    </option>
                  </select>
                </div>

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
                      class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                      Add
                    </button>
                  </div>
                  <div
                    v-if="paymentForm.tags.length > 0"
                    class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in paymentForm.tags"
                      :key="index"
                      class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                      {{ tag }}
                      <button
                        type="button"
                        @click="removeTag(index)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Notes</label
                  >
                  <textarea
                    v-model="paymentForm.notes"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Additional notes about this payment..."></textarea>
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
                    ? "Update Payment"
                    : "Create Payment"
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
            🗑️ Delete Payment
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this payment record? This action
            cannot be undone and may affect financial reporting.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ paymentToDelete?.transactionId }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ paymentToDelete?.patientName }} •
              {{
                formatAmount(
                  paymentToDelete?.totalAmount,
                  paymentToDelete?.currency
                )
              }}
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
              Delete Payment
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Refund Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showRefundModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💸 Process Refund
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Process a refund for this payment. The refund will be credited back
            to the original payment method.
          </p>

          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ selectedPayment?.transactionId }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ selectedPayment?.patientName }} •
              {{
                formatAmount(
                  selectedPayment?.totalAmount,
                  selectedPayment?.currency
                )
              }}
            </p>
          </div>

          <form @submit.prevent="handleRefund" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Refund Amount *</label
              >
              <input
                v-model="refundForm.amount"
                type="number"
                step="0.01"
                :max="selectedPayment?.totalAmount"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Refund Reason *</label
              >
              <select
                v-model="refundForm.reason"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                <option value="">Select Reason</option>
                <option value="service_cancelled">Service Cancelled</option>
                <option value="duplicate_payment">Duplicate Payment</option>
                <option value="patient_request">Patient Request</option>
                <option value="medical_error">Medical Error</option>
                <option value="insurance_coverage">Insurance Coverage</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Additional Notes</label
              >
              <textarea
                v-model="refundForm.notes"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Additional notes about the refund..."></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showRefundModal = false"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isProcessingRefund"
                class="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50">
                {{ isProcessingRefund ? "Processing..." : "Process Refund" }}
              </button>
            </div>
          </form>
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
            📦 Bulk Operations
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Selected {{ selectedItems.length }} payment records. Choose an
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
                  @click="handleBulkOperation('status', 'completed')"
                  class="px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  Complete
                </button>
                <button
                  @click="handleBulkOperation('status', 'pending')"
                  class="px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                  Pending
                </button>
                <button
                  @click="handleBulkOperation('status', 'failed')"
                  class="px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                  Failed
                </button>
                <button
                  @click="handleBulkOperation('status', 'refunded')"
                  class="px-3 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  Refunded
                </button>
              </div>
            </div>
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

    <!-- Payment Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedPayment"
        class="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Payment Details
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedPayment.transactionId }} •
                  {{ selectedPayment.orderId }}
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

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Patient Information -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Patient Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {{ selectedPayment.patientName }}
                  </p>
                  <p>
                    <strong>Email:</strong> {{ selectedPayment.patientEmail }}
                  </p>
                  <p>
                    <strong>Phone:</strong> {{ selectedPayment.patientPhone }}
                  </p>
                  <p>
                    <strong>Patient ID:</strong> {{ selectedPayment.patientId }}
                  </p>
                </div>
              </div>

              <!-- Service Information -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Service Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Service:</strong> {{ selectedPayment.serviceName }}
                  </p>
                  <p>
                    <strong>Type:</strong> {{ selectedPayment.serviceType }}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {{ selectedPayment.doctorName }}
                  </p>
                  <p>
                    <strong>Department:</strong>
                    {{ selectedPayment.department }}
                  </p>
                  <p>
                    <strong>Facility:</strong> {{ selectedPayment.facility }}
                  </p>
                  <p><strong>Country:</strong> {{ selectedPayment.country }}</p>
                </div>
              </div>

              <!-- Payment Information -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Payment Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Amount:</strong>
                    {{
                      formatAmount(
                        selectedPayment.amount,
                        selectedPayment.currency
                      )
                    }}
                  </p>
                  <p>
                    <strong>Tax:</strong>
                    {{
                      formatAmount(
                        selectedPayment.taxAmount,
                        selectedPayment.currency
                      )
                    }}
                  </p>
                  <p>
                    <strong>Discount:</strong>
                    {{
                      formatAmount(
                        selectedPayment.discountAmount,
                        selectedPayment.currency
                      )
                    }}
                  </p>
                  <p>
                    <strong>Total:</strong>
                    {{
                      formatAmount(
                        selectedPayment.totalAmount,
                        selectedPayment.currency
                      )
                    }}
                  </p>
                  <p>
                    <strong>Method:</strong>
                    {{
                      getPaymentMethodInfo(selectedPayment.paymentMethod).icon
                    }}
                    {{
                      getPaymentMethodInfo(selectedPayment.paymentMethod).label
                    }}
                  </p>
                  <p>
                    <strong>Gateway:</strong>
                    {{ selectedPayment.paymentGateway }}
                  </p>
                  <p v-if="selectedPayment.cardLastFour">
                    <strong>Card:</strong> **** **** ****
                    {{ selectedPayment.cardLastFour }}
                  </p>
                </div>
              </div>

              <!-- Status & Dates -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Status & Timeline
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Status:</strong>
                    <span
                      :class="
                        getStatusInfo(selectedPayment.paymentStatus).color
                      "
                      class="px-2 py-1 text-xs rounded-full ml-1">
                      {{ getStatusInfo(selectedPayment.paymentStatus).label }}
                    </span>
                  </p>
                  <p>
                    <strong>Payment Date:</strong>
                    {{ formatDate(selectedPayment.paymentDate) }}
                  </p>
                  <p v-if="selectedPayment.completedDate">
                    <strong>Completed:</strong>
                    {{ formatDate(selectedPayment.completedDate) }}
                  </p>
                  <p>
                    <strong>Created:</strong>
                    {{ formatDate(selectedPayment.createdAt) }}
                  </p>
                  <p>
                    <strong>Updated:</strong>
                    {{ formatDate(selectedPayment.updatedAt) }}
                  </p>
                  <p>
                    <strong>Platform:</strong> {{ selectedPayment.platform }}
                  </p>
                </div>
              </div>

              <!-- Insurance Information -->
              <div v-if="selectedPayment.insuranceProvider">
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Insurance Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Provider:</strong>
                    {{ selectedPayment.insuranceProvider }}
                  </p>
                  <p>
                    <strong>Policy:</strong>
                    {{ selectedPayment.insurancePolicyNumber }}
                  </p>
                  <p>
                    <strong>Coverage:</strong>
                    {{
                      formatAmount(
                        selectedPayment.insuranceCoverage,
                        selectedPayment.currency
                      )
                    }}
                  </p>
                  <p v-if="selectedPayment.copayAmount > 0">
                    <strong>Copay:</strong>
                    {{
                      formatAmount(
                        selectedPayment.copayAmount,
                        selectedPayment.currency
                      )
                    }}
                  </p>
                </div>
              </div>

              <!-- Refund Information -->
              <div v-if="selectedPayment.refundAmount > 0">
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Refund Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Refund Amount:</strong>
                    {{
                      formatAmount(
                        selectedPayment.refundAmount,
                        selectedPayment.currency
                      )
                    }}
                  </p>
                  <p>
                    <strong>Refund Status:</strong>
                    {{ selectedPayment.refundStatus }}
                  </p>
                  <p>
                    <strong>Refund Date:</strong>
                    {{ formatDate(selectedPayment.refundDate) }}
                  </p>
                  <p>
                    <strong>Reason:</strong> {{ selectedPayment.refundReason }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div
              v-if="selectedPayment.tags && selectedPayment.tags.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Tags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedPayment.tags"
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="selectedPayment.notes" class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Notes
              </h4>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                {{ selectedPayment.notes }}
              </p>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
              <button
                v-if="selectedPayment.receiptUrl"
                type="button"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                📄 Receipt
              </button>
              <button
                v-if="selectedPayment.invoiceUrl"
                type="button"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                🧾 Invoice
              </button>
              <button
                v-if="selectedPayment.paymentStatus === 'completed'"
                type="button"
                @click="
                  openRefundModal(selectedPayment);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                💸 Process Refund
              </button>
              <button
                type="button"
                @click="
                  openEditModal(selectedPayment);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                ✏️ Edit Payment
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

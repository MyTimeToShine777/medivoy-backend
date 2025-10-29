<!-- pages/website/privacy.vue -->
<script setup lang="ts">
import { usePrivacyMock } from "~/composables/usePrivacyMock";

const {
  privacyPolicies,
  privacyStats,
  addPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
  publishVersion,
  trackConsent,
} = usePrivacyMock();

// State management - Fixed: Use reactive instead of ref for object
const searchQuery = ref("");
const filterSection = ref("all");
const filterCompliance = ref("all");
const filterStatus = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const showVersionModal = ref(false);
const showPreviewModal = ref(false);
const selectedPolicy = ref(null);
const policyToDelete = ref(null);
const isSubmitting = ref(false);
const isPublishing = ref(false);
const newVersion = ref("");

// Fixed: Use reactive for dynamic object properties
const showFullContent = reactive({});

// Form data
const policyForm = ref({
  id: null,
  section: "",
  title: "",
  content: "",
  isActive: true,
  isRequired: true,
  version: "1.0",
  effectiveDate: "",
  lastReviewDate: "",
  nextReviewDate: "",
  dataTypes: [],
  purposes: [],
  legalBases: [],
  retentionPeriod: "",
  thirdParties: [],
  userRights: [],
  complianceFrameworks: [],
  consentRequired: true,
  dataProcessingLocation: [],
  securityMeasures: [],
  changeLog: [],
  priority: "high",
  language: "en",
});

// Options
const sectionTypes = [
  {
    value: "overview",
    label: "Privacy Overview",
    icon: "🔒",
    description: "General privacy policy introduction",
  },
  {
    value: "collection",
    label: "Data Collection",
    icon: "📊",
    description: "What data we collect and how",
  },
  {
    value: "usage",
    label: "Data Usage",
    icon: "🔄",
    description: "How we use your data",
  },
  {
    value: "sharing",
    label: "Data Sharing",
    icon: "🤝",
    description: "When and with whom we share data",
  },
  {
    value: "storage",
    label: "Data Storage",
    icon: "💾",
    description: "How and where we store data",
  },
  {
    value: "security",
    label: "Data Security",
    icon: "🛡️",
    description: "Security measures and protection",
  },
  {
    value: "cookies",
    label: "Cookies & Tracking",
    icon: "🍪",
    description: "Cookie usage and tracking technologies",
  },
  {
    value: "rights",
    label: "User Rights",
    icon: "⚖️",
    description: "Your privacy rights and choices",
  },
  {
    value: "children",
    label: "Children's Privacy",
    icon: "👶",
    description: "Special provisions for minors",
  },
  {
    value: "international",
    label: "International Transfers",
    icon: "🌍",
    description: "Cross-border data transfers",
  },
  {
    value: "contact",
    label: "Contact & Complaints",
    icon: "📞",
    description: "How to contact us about privacy",
  },
  {
    value: "updates",
    label: "Policy Updates",
    icon: "🔄",
    description: "How we handle policy changes",
  },
];

const dataTypeOptions = [
  "Personal Identifiers",
  "Contact Information",
  "Medical Records",
  "Health Data",
  "Financial Information",
  "Location Data",
  "Device Information",
  "Usage Data",
  "Biometric Data",
  "Insurance Information",
  "Emergency Contacts",
  "Appointment History",
];

const purposeOptions = [
  "Medical Treatment",
  "Appointment Management",
  "Payment Processing",
  "Insurance Claims",
  "Medical Research",
  "Quality Improvement",
  "Legal Compliance",
  "Emergency Care",
  "Communication",
  "Marketing",
  "Analytics",
  "Security",
];

const legalBasisOptions = [
  "Consent",
  "Contract Performance",
  "Legal Obligation",
  "Vital Interests",
  "Public Task",
  "Legitimate Interest",
  "Medical Treatment",
  "Public Health",
];

const complianceOptions = [
  "GDPR",
  "HIPAA",
  "CCPA",
  "PIPEDA",
  "DPA 2018",
  "LGPD",
  "PDPA Singapore",
  "Privacy Act 1988",
  "POPIA",
  "Indian Personal Data Protection Bill",
];

const userRightsOptions = [
  "Right to Access",
  "Right to Rectification",
  "Right to Erasure",
  "Right to Portability",
  "Right to Restriction",
  "Right to Object",
  "Right to Withdraw Consent",
  "Right to Complain",
];

const retentionOptions = [
  "1 year",
  "2 years",
  "3 years",
  "5 years",
  "7 years",
  "10 years",
  "Until treatment completion",
  "Until account deletion",
  "As required by law",
  "Indefinitely",
];

const locationOptions = [
  "India",
  "European Union",
  "United States",
  "Canada",
  "Australia",
  "United Kingdom",
  "Singapore",
  "UAE",
  "On-premises",
  "Cloud servers",
];

// Temporary input fields for arrays
const newThirdParty = ref("");
const newSecurityMeasure = ref("");
const newChangeNote = ref("");

// Computed
const filteredPolicies = computed(() => {
  let filtered = privacyPolicies.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.section.toLowerCase().includes(query)
    );
  }

  if (filterSection.value !== "all") {
    filtered = filtered.filter((p) => p.section === filterSection.value);
  }

  if (filterCompliance.value !== "all") {
    filtered = filtered.filter((p) =>
      p.complianceFrameworks?.includes(filterCompliance.value)
    );
  }

  if (filterStatus.value !== "all") {
    if (filterStatus.value === "active") {
      filtered = filtered.filter((p) => p.isActive);
    } else if (filterStatus.value === "inactive") {
      filtered = filtered.filter((p) => !p.isActive);
    } else if (filterStatus.value === "consent_required") {
      filtered = filtered.filter((p) => p.consentRequired);
    } else if (filterStatus.value === "outdated") {
      const today = new Date();
      filtered = filtered.filter((p) => new Date(p.nextReviewDate) <= today);
    }
  }

  return filtered.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;

    if (aPriority !== bPriority) return bPriority - aPriority;

    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });
});

// Helper functions
const getSectionInfo = (section) => {
  return (
    sectionTypes.find((s) => s.value === section) || {
      label: section,
      icon: "🔒",
      description: "",
    }
  );
};

const getPriorityColor = (priority) => {
  const colors = {
    critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };
  return colors[priority] || colors.medium;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (reviewDate) => {
  if (!reviewDate) return false;
  return new Date(reviewDate) <= new Date();
};

const getDaysUntilReview = (reviewDate) => {
  if (!reviewDate) return 0;
  const today = new Date();
  const review = new Date(reviewDate);
  const diffTime = review - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getWordCount = (content) => {
  if (!content) return 0;
  return content.trim().split(/\s+/).length;
};

const getComplianceStatus = (frameworks) => {
  if (!frameworks || frameworks.length === 0) return "No compliance specified";
  if (frameworks.length === 1) return `${frameworks[0]} compliant`;
  return `${frameworks.length} frameworks`;
};

// Fixed: Now this function will work without readonly errors
const toggleContent = (policyId) => {
  showFullContent[policyId] = !showFullContent[policyId];
};

// Array manipulation functions
const addArrayItem = (arrayName, inputRef, itemObj = null) => {
  const item = itemObj || inputRef?.value?.trim();
  if (
    item &&
    !policyForm.value[arrayName].some((existing) =>
      typeof existing === "string" ? existing === item : existing.name === item
    )
  ) {
    if (arrayName === "changeLog") {
      policyForm.value[arrayName].unshift({
        date: new Date().toISOString().split("T")[0],
        version: policyForm.value.version,
        changes: item,
        author: "Admin",
      });
    } else if (arrayName === "thirdParties") {
      policyForm.value[arrayName].push({
        name: item,
        purpose: "",
        dataShared: [],
        safeguards: "",
      });
    } else {
      policyForm.value[arrayName].push(item);
    }
    if (inputRef) inputRef.value = "";
  }
};

const removeArrayItem = (arrayName, index) => {
  policyForm.value[arrayName].splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (policy) => {
  policyForm.value = { ...policy };
  selectedPolicy.value = policy;
  showEditModal.value = true;
};

const openDeleteModal = (policy) => {
  policyToDelete.value = policy;
  showDeleteModal.value = true;
};

const openVersionModal = (policy) => {
  selectedPolicy.value = policy;
  newVersion.value = "";
  showVersionModal.value = true;
};

const openPreviewModal = (policy) => {
  selectedPolicy.value = policy;
  showPreviewModal.value = true;
};

const resetForm = () => {
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  policyForm.value = {
    id: null,
    section: "",
    title: "",
    content: "",
    isActive: true,
    isRequired: true,
    version: "1.0",
    effectiveDate: today.toISOString().split("T")[0],
    lastReviewDate: today.toISOString().split("T")[0],
    nextReviewDate: nextYear.toISOString().split("T")[0],
    dataTypes: [],
    purposes: [],
    legalBases: [],
    retentionPeriod: "",
    thirdParties: [],
    userRights: [],
    complianceFrameworks: [],
    consentRequired: true,
    dataProcessingLocation: [],
    securityMeasures: [],
    changeLog: [],
    priority: "high",
    language: "en",
  };

  newThirdParty.value = "";
  newSecurityMeasure.value = "";
  newChangeNote.value = "";
};

const savePolicy = async () => {
  try {
    isSubmitting.value = true;

    if (
      !policyForm.value.section ||
      !policyForm.value.title ||
      !policyForm.value.content
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (policyForm.value.id) {
      addArrayItem("changeLog", null, `Updated: ${policyForm.value.title}`);
      updatePrivacyPolicy(policyForm.value.id, policyForm.value);
    } else {
      addPrivacyPolicy(policyForm.value);
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving privacy policy:", error);
    alert("Error saving privacy policy. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    deletePrivacyPolicy(policyToDelete.value.id);
    showDeleteModal.value = false;
    policyToDelete.value = null;
  } catch (error) {
    console.error("Error deleting privacy policy:", error);
    alert("Error deleting privacy policy. Please try again.");
  }
};

const duplicatePolicy = (policy) => {
  policyForm.value = {
    ...policy,
    id: null,
    title: `${policy.title} (Copy)`,
    version: "1.0",
    effectiveDate: new Date().toISOString().split("T")[0],
    changeLog: [
      {
        date: new Date().toISOString().split("T")[0],
        version: "1.0",
        changes: `Duplicated from: ${policy.title}`,
        author: "Admin",
      },
    ],
  };
  showAddModal.value = true;
};

const togglePolicyStatus = async (policy) => {
  try {
    const updatedData = {
      ...policy,
      isActive: !policy.isActive,
      lastUpdated: new Date().toISOString(),
    };
    updatePrivacyPolicy(policy.id, updatedData);
  } catch (error) {
    console.error("Error toggling privacy policy status:", error);
  }
};

const handleVersionPublish = async () => {
  if (!newVersion.value.trim()) {
    alert("Please enter a version number");
    return;
  }

  try {
    isPublishing.value = true;
    publishVersion(selectedPolicy.value.id, newVersion.value);
    showVersionModal.value = false;
  } catch (error) {
    console.error("Error publishing version:", error);
  } finally {
    isPublishing.value = false;
  }
};

const exportPrivacyPolicy = () => {
  const activePolicies = privacyPolicies.value.filter((p) => p.isActive);
  const content = activePolicies
    .map((policy) => `# ${policy.title}\n\n${policy.content}\n\n---\n`)
    .join("\n");

  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `privacy-policy-${new Date().toISOString().split("T")[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

const generateComplianceReport = () => {
  const report = {
    totalPolicies: privacyPolicies.value.length,
    activePolicies: privacyPolicies.value.filter((p) => p.isActive).length,
    complianceFrameworks: [
      ...new Set(
        privacyPolicies.value.flatMap((p) => p.complianceFrameworks || [])
      ),
    ],
    consentRequiredPolicies: privacyPolicies.value.filter(
      (p) => p.consentRequired
    ).length,
    overdueReviews: privacyPolicies.value.filter((p) =>
      isOverdue(p.nextReviewDate)
    ).length,
    dataTypes: [
      ...new Set(privacyPolicies.value.flatMap((p) => p.dataTypes || [])),
    ],
    purposes: [
      ...new Set(privacyPolicies.value.flatMap((p) => p.purposes || [])),
    ],
    generatedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `privacy-compliance-report-${
    new Date().toISOString().split("T")[0]
  }.json`;
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
          Privacy Policy Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage data privacy policies and compliance documentation
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="generateComplianceReport"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
          📊 Compliance Report
        </button>
        <button
          @click="exportPrivacyPolicy"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          📄 Export Policy
        </button>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          🔒 Add Section
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Sections
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ privacyStats.totalPolicies }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">🔒</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Consent Required
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ privacyStats.consentRequired }}
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
              Compliance Frameworks
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ privacyStats.complianceFrameworks }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">⚖️</span>
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
              {{ privacyStats.pendingReview }}
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
              {{ privacyStats.latestVersion }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">🔄</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Types Overview -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Privacy Policy Sections
      </h3>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="sectionType in sectionTypes"
          :key="sectionType.value"
          class="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
          @click="filterSection = sectionType.value">
          <span class="text-xl flex-shrink-0">{{ sectionType.icon }}</span>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ sectionType.label }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {{ sectionType.description }}
            </p>
            <p class="text-xs text-[#4565AD]">
              {{
                privacyPolicies.filter((p) => p.section === sectionType.value)
                  .length
              }}
              sections
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search privacy policies..."
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
          v-model="filterCompliance"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Compliance</option>
          <option
            v-for="framework in complianceOptions"
            :key="framework"
            :value="framework">
            {{ framework }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="consent_required">Consent Required</option>
          <option value="outdated">Needs Review</option>
        </select>
      </div>
    </div>

    <!-- Privacy Policies List -->
    <div class="space-y-4">
      <div
        v-for="policy in filteredPolicies"
        :key="policy.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">{{
                  getSectionInfo(policy.section).icon
                }}</span>
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ policy.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ getSectionInfo(policy.section).label }}
                  </p>
                </div>
              </div>

              <!-- Metadata -->
              <div
                class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>Version {{ policy.version }}</span>
                <span>•</span>
                <span>{{ getWordCount(policy.content) }} words</span>
                <span>•</span>
                <span>Updated {{ formatDate(policy.lastUpdated) }}</span>
                <span>•</span>
                <span
                  :class="
                    isOverdue(policy.nextReviewDate)
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  ">
                  Review
                  {{
                    isOverdue(policy.nextReviewDate)
                      ? "overdue"
                      : `in ${getDaysUntilReview(policy.nextReviewDate)} days`
                  }}
                </span>
                <span>•</span>
                <span>{{
                  getComplianceStatus(policy.complianceFrameworks)
                }}</span>
              </div>

              <!-- Badges -->
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  :class="getPriorityColor(policy.priority)"
                  class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{
                    policy.priority.charAt(0).toUpperCase() +
                    policy.priority.slice(1)
                  }}
                </span>

                <span
                  v-if="policy.consentRequired"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full">
                  Consent Required
                </span>

                <button
                  @click="togglePolicyStatus(policy)"
                  :class="
                    policy.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  "
                  class="px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80">
                  {{ policy.isActive ? "Active" : "Inactive" }}
                </button>

                <span
                  v-if="isOverdue(policy.nextReviewDate)"
                  class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs font-semibold rounded-full">
                  Review Due
                </span>

                <!-- Compliance Badges -->
                <span
                  v-for="framework in (policy.complianceFrameworks || []).slice(
                    0,
                    2
                  )"
                  :key="framework"
                  class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-full">
                  {{ framework }}
                </span>
                <span
                  v-if="(policy.complianceFrameworks || []).length > 2"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  +{{ (policy.complianceFrameworks || []).length - 2 }} more
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-4">
              <button
                type="button"
                @click="openPreviewModal(policy)"
                class="icon-btn view-btn"
                title="Preview">
                👁️
              </button>
              <button
                type="button"
                @click="openVersionModal(policy)"
                class="icon-btn version-btn"
                title="Version History">
                🔄
              </button>
              <button
                type="button"
                @click="openEditModal(policy)"
                class="icon-btn edit-btn"
                title="Edit Policy">
                ✏️
              </button>
              <button
                type="button"
                @click="duplicatePolicy(policy)"
                class="icon-btn duplicate-btn"
                title="Duplicate Policy">
                📋
              </button>
              <button
                type="button"
                @click="openDeleteModal(policy)"
                class="icon-btn delete-btn"
                title="Delete Policy">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Content Preview -->
        <div class="p-6">
          <div class="prose prose-sm max-w-none">
            <div
              v-if="
                showFullContent[policy.id] ||
                (policy.content && policy.content.length <= 300)
              "
              class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {{ policy.content }}
            </div>
            <div v-else-if="policy.content">
              <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ policy.content.substring(0, 300) }}...
              </div>
              <button
                @click="toggleContent(policy.id)"
                class="mt-2 text-[#4565AD] hover:underline text-sm font-medium">
                Show more
              </button>
            </div>

            <div
              v-if="
                showFullContent[policy.id] &&
                policy.content &&
                policy.content.length > 300
              "
              class="mt-2">
              <button
                @click="toggleContent(policy.id)"
                class="text-[#4565AD] hover:underline text-sm font-medium">
                Show less
              </button>
            </div>
          </div>

          <!-- Data Types & Purposes -->
          <div
            v-if="
              (policy.dataTypes && policy.dataTypes.length) ||
              (policy.purposes && policy.purposes.length)
            "
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="policy.dataTypes && policy.dataTypes.length">
                <h5
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Types Covered
                </h5>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="dataType in policy.dataTypes.slice(0, 3)"
                    :key="dataType"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                    {{ dataType }}
                  </span>
                  <span
                    v-if="policy.dataTypes.length > 3"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{{ policy.dataTypes.length - 3 }} more
                  </span>
                </div>
              </div>

              <div v-if="policy.purposes && policy.purposes.length">
                <h5
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Processing Purposes
                </h5>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="purpose in policy.purposes.slice(0, 3)"
                    :key="purpose"
                    class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                    {{ purpose }}
                  </span>
                  <span
                    v-if="policy.purposes.length > 3"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{{ policy.purposes.length - 3 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Retention & Location -->
          <div
            v-if="
              policy.retentionPeriod ||
              (policy.dataProcessingLocation &&
                policy.dataProcessingLocation.length)
            "
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="policy.retentionPeriod">
                <span class="text-gray-500 dark:text-gray-400"
                  >Data Retention:</span
                >
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ policy.retentionPeriod }}
                </p>
              </div>
              <div
                v-if="
                  policy.dataProcessingLocation &&
                  policy.dataProcessingLocation.length
                ">
                <span class="text-gray-500 dark:text-gray-400"
                  >Processing Locations:</span
                >
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ policy.dataProcessingLocation.join(", ") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredPolicies.length === 0"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
        <div class="text-6xl mb-4">🔒</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No privacy policies found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Try adjusting your search criteria or add your first privacy policy
          section.
        </p>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
          Add Privacy Section
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal (Simplified for space) -->
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
                    ? "Edit Privacy Policy Section"
                    : "Add New Privacy Policy Section"
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

          <form @submit.prevent="savePolicy" class="p-6 space-y-6">
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
                    v-model="policyForm.section"
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
                    v-model="policyForm.priority"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Title *</label
                  >
                  <input
                    v-model="policyForm.title"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="What Information We Collect" />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Content *</label
                  >
                  <textarea
                    v-model="policyForm.content"
                    rows="8"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    placeholder="Enter the privacy policy content..."></textarea>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ getWordCount(policyForm.content) }} words
                  </p>
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
                    v-model="policyForm.isActive"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Active Section</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="policyForm.isRequired"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Required Section</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="policyForm.consentRequired"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Requires User Consent</span
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

    <!-- Preview Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showPreviewModal && selectedPolicy"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {{ selectedPolicy.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getSectionInfo(selectedPolicy.section).label }} • Version
                  {{ selectedPolicy.version }}
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
            <div class="prose prose-lg max-w-none">
              <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                <div
                  class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {{ selectedPolicy.content }}
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
                  openEditModal(selectedPolicy);
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
        v-if="showVersionModal && selectedPolicy"
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
              {{ selectedPolicy.title }}
            </p>
          </div>

          <div class="p-6">
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white">
                  Current Version
                </h4>
                <span
                  class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                  v{{ selectedPolicy.version }}
                </span>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Effective Date:</strong>
                  {{ formatDate(selectedPolicy.effectiveDate) }}
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Word Count:</strong>
                  {{ getWordCount(selectedPolicy.content) }} words
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Status:</strong>
                  {{ selectedPolicy.isActive ? "Active" : "Inactive" }}
                </div>
              </div>
            </div>

            <div
              class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Publish New Version
              </h4>
              <div class="flex gap-3">
                <input
                  v-model="newVersion"
                  type="text"
                  placeholder="Enter new version (e.g., 1.1, 2.0)"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm" />
                <button
                  @click="handleVersionPublish"
                  :disabled="isPublishing || !newVersion"
                  class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm disabled:opacity-50">
                  {{ isPublishing ? "Publishing..." : "Publish" }}
                </button>
              </div>
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
            🗑️ Delete Privacy Policy Section
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this privacy policy section? This
            action cannot be undone and may affect privacy compliance.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ policyToDelete?.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ getSectionInfo(policyToDelete?.section).label }} • Version
              {{ policyToDelete?.version }}
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

<!-- pages/website/packages.vue -->
<script setup lang="ts">
import { usePackagesMock } from "~/composables/usePackagesMock";

const {
  packages,
  packageStats,
  categories,
  addPackage,
  updatePackage,
  deletePackage,
} = usePackagesMock();

// State management
const searchQuery = ref("");
const filterCategory = ref("all");
const filterType = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const selectedPackage = ref(null);
const packageToDelete = ref(null);
const isSubmitting = ref(false);

// Form data
const packageForm = ref({
  id: null,
  name: "",
  title: "",
  description: "",
  shortDescription: "",
  type: "standard",
  originalPrice: "",
  discountedPrice: "",
  duration: "",
  validity: "",

  // Medical Services
  consultations: [],
  treatments: [],
  diagnosticTests: [],
  surgicalProcedures: [],

  // Tourism Components (Elite & Premium)
  accommodationType: "",
  accommodationNights: "",
  mealsIncluded: false,
  transportationIncluded: false,
  tourPackages: [],
  touristAttractions: [],

  // Premium Only Features
  personalConcierge: false,
  translatorService: false,
  airportPickup: false,
  visaAssistance: false,
  emergencySupport: false,

  // Location & Logistics
  city: "",
  country: "India",
  hospitalPartner: "",

  isActive: true,
  isPopular: false,
  isFeatured: false,

  // Target audience
  targetCountries: [],
  languages: [],

  inclusions: [],
  exclusions: [],
});

// Options and data
const packageTypes = [
  {
    value: "standard",
    label: "Standard Package",
    description: "Doctor consultation and basic treatments only",
    icon: "🏥",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    value: "elite",
    label: "Elite Package",
    description: "Medical care + accommodation + tour packages",
    icon: "✈️",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    value: "premium",
    label: "Premium Package",
    description: "All-inclusive medical tourism with premium services",
    icon: "👑",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
];

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Kochi",
  "Goa",
];

const accommodationTypes = [
  { value: "hotel_5star", label: "5-Star Hotel" },
  { value: "hotel_4star", label: "4-Star Hotel" },
  { value: "hotel_3star", label: "3-Star Hotel" },
  { value: "serviced_apartment", label: "Serviced Apartment" },
  { value: "medical_resort", label: "Medical Resort" },
  { value: "recovery_center", label: "Recovery Center" },
];

const tourPackageOptions = [
  "City Heritage Tour",
  "Cultural Experience",
  "Shopping Tour",
  "Food & Culinary Tour",
  "Wellness & Spa",
  "Adventure Activities",
  "Religious Sites Visit",
  "Nature & Wildlife",
  "Beach Resort Stay",
];

const commonCountries = [
  "USA",
  "Canada",
  "UK",
  "Australia",
  "UAE",
  "Germany",
  "France",
  "Netherlands",
  "Russia",
  "South Africa",
  "Singapore",
  "Japan",
];

const commonLanguages = [
  "English",
  "Arabic",
  "French",
  "German",
  "Russian",
  "Spanish",
  "Portuguese",
  "Japanese",
  "Chinese",
  "Korean",
];

// Temporary input fields for arrays
const newConsultation = ref("");
const newTreatment = ref("");
const newDiagnosticTest = ref("");
const newSurgicalProcedure = ref("");
const newTouristAttraction = ref("");
const newInclusion = ref("");
const newExclusion = ref("");

// Computed
const filteredPackages = computed(() => {
  let filtered = packages.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.hospitalPartner?.toLowerCase().includes(query)
    );
  }

  if (filterType.value !== "all") {
    filtered = filtered.filter((p) => p.type === filterType.value);
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter((p) => p.type === filterCategory.value);
  }

  return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
});

// Helper functions
const getPackageTypeInfo = (type) => {
  return packageTypes.find((pt) => pt.value === type) || packageTypes[0];
};

const getTourismFeatures = (pkg) => {
  const features = [];
  if (pkg.type === "elite" || pkg.type === "premium") {
    if (pkg.accommodationNights > 0)
      features.push(`${pkg.accommodationNights} nights stay`);
    if (pkg.mealsIncluded) features.push("Meals included");
    if (pkg.transportationIncluded) features.push("Transportation");
    if (pkg.tourPackages?.length)
      features.push(`${pkg.tourPackages.length} tour packages`);
  }
  if (pkg.type === "premium") {
    if (pkg.personalConcierge) features.push("Personal concierge");
    if (pkg.translatorService) features.push("Translator service");
    if (pkg.airportPickup) features.push("Airport pickup");
    if (pkg.visaAssistance) features.push("Visa assistance");
    if (pkg.emergencySupport) features.push("24/7 emergency support");
  }
  return features;
};

const getMedicalServices = (pkg) => {
  const services = [];
  if (pkg.consultations?.length)
    services.push(`${pkg.consultations.length} consultations`);
  if (pkg.treatments?.length)
    services.push(`${pkg.treatments.length} treatments`);
  if (pkg.diagnosticTests?.length)
    services.push(`${pkg.diagnosticTests.length} diagnostic tests`);
  if (pkg.surgicalProcedures?.length)
    services.push(`${pkg.surgicalProcedures.length} surgical procedures`);
  return services;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const calculateDiscount = (original, discounted) => {
  if (!original || !discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

// Array manipulation functions
const addArrayItem = (arrayName, inputRef) => {
  const item = inputRef.value?.trim();
  if (item && !packageForm.value[arrayName].includes(item)) {
    packageForm.value[arrayName].push(item);
    inputRef.value = "";
  }
};

const removeArrayItem = (arrayName, index) => {
  packageForm.value[arrayName].splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (pkg) => {
  packageForm.value = { ...pkg };
  selectedPackage.value = pkg;
  showEditModal.value = true;
};

const openDetailModal = (pkg) => {
  selectedPackage.value = pkg;
  showDetailModal.value = true;
};

const openDeleteModal = (pkg) => {
  packageToDelete.value = pkg;
  showDeleteModal.value = true;
};

const resetForm = () => {
  packageForm.value = {
    id: null,
    name: "",
    title: "",
    description: "",
    shortDescription: "",
    type: "standard",
    originalPrice: "",
    discountedPrice: "",
    duration: "",
    validity: "",
    consultations: [],
    treatments: [],
    diagnosticTests: [],
    surgicalProcedures: [],
    accommodationType: "",
    accommodationNights: "",
    mealsIncluded: false,
    transportationIncluded: false,
    tourPackages: [],
    touristAttractions: [],
    personalConcierge: false,
    translatorService: false,
    airportPickup: false,
    visaAssistance: false,
    emergencySupport: false,
    city: "",
    country: "India",
    hospitalPartner: "",
    isActive: true,
    isPopular: false,
    isFeatured: false,
    targetCountries: [],
    languages: [],
    inclusions: [],
    exclusions: [],
  };

  // Reset temporary inputs
  newConsultation.value = "";
  newTreatment.value = "";
  newDiagnosticTest.value = "";
  newSurgicalProcedure.value = "";
  newTouristAttraction.value = "";
  newInclusion.value = "";
  newExclusion.value = "";
};

const savePackage = async () => {
  try {
    isSubmitting.value = true;

    // Validate required fields
    if (
      !packageForm.value.name ||
      !packageForm.value.originalPrice ||
      !packageForm.value.discountedPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Convert string prices to numbers
    packageForm.value.originalPrice = Number(packageForm.value.originalPrice);
    packageForm.value.discountedPrice = Number(
      packageForm.value.discountedPrice
    );
    packageForm.value.validity = Number(packageForm.value.validity);
    packageForm.value.accommodationNights =
      Number(packageForm.value.accommodationNights) || 0;

    if (packageForm.value.id) {
      // Update existing package
      // await $fetch(`/api/website/packages/${packageForm.value.id}`, {
      //   method: 'PUT',
      //   body: packageForm.value
      // })
      updatePackage(packageForm.value.id, packageForm.value);
    } else {
      // Create new package
      // await $fetch('/api/website/packages', {
      //   method: 'POST',
      //   body: packageForm.value
      // })
      addPackage(packageForm.value);
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving package:", error);
    alert("Error saving package. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    // await $fetch(`/api/website/packages/${packageToDelete.value.id}`, {
    //   method: 'DELETE'
    // })
    deletePackage(packageToDelete.value.id);
    showDeleteModal.value = false;
    packageToDelete.value = null;
  } catch (error) {
    console.error("Error deleting package:", error);
    alert("Error deleting package. Please try again.");
  }
};

const duplicatePackage = (pkg) => {
  packageForm.value = {
    ...pkg,
    id: null,
    name: `${pkg.name} (Copy)`,
    bookingCount: 0,
    rating: 0,
    reviews: 0,
  };
  showAddModal.value = true;
};

const togglePackageStatus = (pkg) => {
  const updatedData = { ...pkg, isActive: !pkg.isActive };
  updatePackage(pkg.id, updatedData);
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Medical Tourism Packages
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage medical tourism packages for international patients
        </p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
        ✈️ Add Package
      </button>
    </div>

    <!-- Package Types Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        v-for="typeInfo in packageTypes"
        :key="typeInfo.value"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="text-2xl">{{ typeInfo.icon }}</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ typeInfo.label }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ typeInfo.description }}
            </p>
          </div>
        </div>

        <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div v-if="typeInfo.value === 'standard'" class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Doctor Consultations
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Medical Treatments
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Diagnostic Tests
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Hospital Care
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-400">✗</span>
              <span class="text-gray-400">No tourism services</span>
            </div>
          </div>

          <div v-else-if="typeInfo.value === 'elite'" class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> All Standard Features
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Accommodation
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Tour Packages
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Local Transportation
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Tourist Attractions
            </div>
          </div>

          <div v-else-if="typeInfo.value === 'premium'" class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> All Elite Features
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Personal Concierge
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Translator Service
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Airport Transfers
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span> Visa Assistance
            </div>
          </div>
        </div>

        <!-- Type Statistics -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Packages:</span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ packages.filter((p) => p.type === typeInfo.value).length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Packages
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ packageStats.totalPackages }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">📦</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Standard</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ packageStats.standardPackages }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">🏥</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Elite</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ packageStats.elitePackages }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">✈️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Premium</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ packageStats.premiumPackages }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">👑</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Bookings
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ packageStats.totalBookings.toLocaleString() }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">🎯</span>
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
            placeholder="Search packages or hospitals..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Package Types</option>
          <option
            v-for="type in packageTypes"
            :key="type.value"
            :value="type.value">
            {{ type.label }}
          </option>
        </select>

        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Categories</option>
          <option
            v-for="category in categories"
            :key="category.name"
            :value="category.name.toLowerCase()">
            {{ category.name }} ({{ category.count }})
          </option>
        </select>
      </div>
    </div>

    <!-- Packages Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="pkg in filteredPackages"
        :key="pkg.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200">
        <!-- Package Type Header -->
        <div
          class="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{
                getPackageTypeInfo(pkg.type).icon
              }}</span>
              <div>
                <span
                  :class="getPackageTypeInfo(pkg.type).color"
                  class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getPackageTypeInfo(pkg.type).label }}
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ pkg.city }}, {{ pkg.country }}
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span
                v-if="pkg.isFeatured"
                class="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full text-center">
                Featured
              </span>
              <span
                v-if="pkg.isPopular"
                class="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full text-center">
                Popular
              </span>
              <button
                @click="togglePackageStatus(pkg)"
                :class="
                  pkg.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                "
                class="px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80">
                {{ pkg.isActive ? "Active" : "Inactive" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="mb-4">
            <h3
              class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
              {{ pkg.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ pkg.shortDescription }}
            </p>
          </div>

          <!-- Hospital Partner -->
          <div class="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-xs text-blue-600 dark:text-blue-300 font-medium">
              🏥 {{ pkg.hospitalPartner }}
            </p>
          </div>

          <!-- Pricing -->
          <div class="flex items-center gap-2 mb-4">
            <span
              v-if="pkg.originalPrice > pkg.discountedPrice"
              class="text-lg text-gray-500 line-through">
              {{ formatCurrency(pkg.originalPrice) }}
            </span>
            <span class="text-xl font-bold text-[#4565AD]">
              {{ formatCurrency(pkg.discountedPrice) }}
            </span>
            <span
              v-if="pkg.originalPrice > pkg.discountedPrice"
              class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
              {{ calculateDiscount(pkg.originalPrice, pkg.discountedPrice) }}%
              OFF
            </span>
          </div>

          <!-- Package Details -->
          <div
            class="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div>
              <span class="block font-medium">Duration:</span>
              <span>{{ pkg.duration }}</span>
            </div>
            <div>
              <span class="block font-medium">Validity:</span>
              <span>{{ pkg.validity }} days</span>
            </div>
            <div>
              <span class="block font-medium">Bookings:</span>
              <span>{{ pkg.bookingCount }}</span>
            </div>
            <div>
              <span class="block font-medium">Rating:</span>
              <span>{{ pkg.rating }}/5 ⭐</span>
            </div>
          </div>

          <!-- Medical Services -->
          <div class="mb-4">
            <h4
              class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Medical Services
            </h4>
            <div class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <div
                v-for="service in getMedicalServices(pkg).slice(0, 3)"
                :key="service"
                class="flex items-center gap-1">
                <span class="text-green-500">•</span>
                <span>{{ service }}</span>
              </div>
              <div
                v-if="getMedicalServices(pkg).length > 3"
                class="text-gray-500">
                +{{ getMedicalServices(pkg).length - 3 }} more services
              </div>
            </div>
          </div>

          <!-- Tourism Features -->
          <div v-if="getTourismFeatures(pkg).length > 0" class="mb-4">
            <h4
              class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Tourism Features
            </h4>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="feature in getTourismFeatures(pkg).slice(0, 3)"
                :key="feature"
                class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                {{ feature }}
              </span>
              <span
                v-if="getTourismFeatures(pkg).length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{{ getTourismFeatures(pkg).length - 3 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openDetailModal(pkg)"
              class="icon-btn view-btn"
              title="View Details">
              👁️
            </button>
            <button
              type="button"
              @click="openEditModal(pkg)"
              class="icon-btn edit-btn"
              title="Edit Package">
              ✏️
            </button>
            <button
              type="button"
              @click="duplicatePackage(pkg)"
              class="icon-btn duplicate-btn"
              title="Duplicate Package">
              📋
            </button>
            <button
              type="button"
              @click="openDeleteModal(pkg)"
              class="icon-btn delete-btn"
              title="Delete Package">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredPackages.length === 0"
        class="col-span-full flex flex-col items-center justify-center py-12">
        <div class="text-6xl mb-4">✈️</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No packages found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-center mb-4">
          Try adjusting your search criteria or add a new medical tourism
          package.
        </p>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
          Add Package
        </button>
      </div>
    </div>

    <!-- Add/Edit Package Modal -->
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
                {{
                  showEditModal
                    ? "Edit Medical Tourism Package"
                    : "Add New Medical Tourism Package"
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

          <form @submit.prevent="savePackage" class="p-6 space-y-6">
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
                    >Package Name *</label
                  >
                  <input
                    v-model="packageForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Complete Heart Surgery Package" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Package Type *</label
                  >
                  <select
                    v-model="packageForm.type"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in packageTypes"
                      :key="type.value"
                      :value="type.value">
                      {{ type.icon }} {{ type.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >City *</label
                  >
                  <select
                    v-model="packageForm.city"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select City</option>
                    <option v-for="city in cities" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Hospital Partner</label
                  >
                  <input
                    v-model="packageForm.hospitalPartner"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Apollo Hospital, Mumbai" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Original Price (₹) *</label
                  >
                  <input
                    v-model="packageForm.originalPrice"
                    type="number"
                    min="0"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="500000" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Discounted Price (₹) *</label
                  >
                  <input
                    v-model="packageForm.discountedPrice"
                    type="number"
                    min="0"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="450000" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Duration *</label
                  >
                  <input
                    v-model="packageForm.duration"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="14-21 days" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Package Validity (days) *</label
                  >
                  <input
                    v-model="packageForm.validity"
                    type="number"
                    min="1"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="180" />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Short Description</label
                  >
                  <input
                    v-model="packageForm.shortDescription"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Complete cardiac care with tourism experience" />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="packageForm.description"
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Detailed package description including medical procedures and tourism experiences..."></textarea>
                </div>
              </div>
            </div>

            <!-- Medical Services -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Medical Services
              </h4>

              <!-- Consultations -->
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Consultations</label
                >
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newConsultation"
                    type="text"
                    placeholder="Add consultation type..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="
                      addArrayItem('consultations', newConsultation)
                    " />
                  <button
                    type="button"
                    @click="addArrayItem('consultations', newConsultation)"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="packageForm.consultations.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(consultation, index) in packageForm.consultations"
                    :key="`consultation-${index}`"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                    {{ consultation }}
                    <button
                      type="button"
                      @click="removeArrayItem('consultations', index)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <!-- Treatments -->
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Treatments</label
                >
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newTreatment"
                    type="text"
                    placeholder="Add treatment type..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="addArrayItem('treatments', newTreatment)" />
                  <button
                    type="button"
                    @click="addArrayItem('treatments', newTreatment)"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="packageForm.treatments.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(treatment, index) in packageForm.treatments"
                    :key="`treatment-${index}`"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                    {{ treatment }}
                    <button
                      type="button"
                      @click="removeArrayItem('treatments', index)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <!-- Diagnostic Tests -->
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Diagnostic Tests</label
                >
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newDiagnosticTest"
                    type="text"
                    placeholder="Add diagnostic test..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="
                      addArrayItem('diagnosticTests', newDiagnosticTest)
                    " />
                  <button
                    type="button"
                    @click="addArrayItem('diagnosticTests', newDiagnosticTest)"
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="packageForm.diagnosticTests.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(test, index) in packageForm.diagnosticTests"
                    :key="`test-${index}`"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded">
                    {{ test }}
                    <button
                      type="button"
                      @click="removeArrayItem('diagnosticTests', index)"
                      class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200">
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <!-- Surgical Procedures -->
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Surgical Procedures</label
                >
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newSurgicalProcedure"
                    type="text"
                    placeholder="Add surgical procedure..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="
                      addArrayItem('surgicalProcedures', newSurgicalProcedure)
                    " />
                  <button
                    type="button"
                    @click="
                      addArrayItem('surgicalProcedures', newSurgicalProcedure)
                    "
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="packageForm.surgicalProcedures.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(procedure, index) in packageForm.surgicalProcedures"
                    :key="`procedure-${index}`"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded">
                    {{ procedure }}
                    <button
                      type="button"
                      @click="removeArrayItem('surgicalProcedures', index)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Tourism Components (Elite & Premium Only) -->
            <div
              v-if="
                packageForm.type === 'elite' || packageForm.type === 'premium'
              "
              class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Tourism & Accommodation
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Accommodation Type</label
                  >
                  <select
                    v-model="packageForm.accommodationType"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Accommodation</option>
                    <option
                      v-for="acc in accommodationTypes"
                      :key="acc.value"
                      :value="acc.value">
                      {{ acc.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Number of Nights</label
                  >
                  <input
                    v-model="packageForm.accommodationNights"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="7" />
                </div>
              </div>

              <div class="mb-4 space-y-2">
                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.mealsIncluded"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Meals Included</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.transportationIncluded"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Local Transportation Included</span
                  >
                </label>
              </div>

              <!-- Tour Packages -->
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Tour Packages</label
                >
                <div
                  class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <label
                    v-for="tour in tourPackageOptions"
                    :key="tour"
                    class="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      :value="tour"
                      v-model="packageForm.tourPackages"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-gray-700 dark:text-gray-300">{{
                      tour
                    }}</span>
                  </label>
                </div>
              </div>

              <!-- Tourist Attractions -->
              <div class="mb-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Tourist Attractions</label
                >
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newTouristAttraction"
                    type="text"
                    placeholder="Add tourist attraction..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                    @keyup.enter="
                      addArrayItem('touristAttractions', newTouristAttraction)
                    " />
                  <button
                    type="button"
                    @click="
                      addArrayItem('touristAttractions', newTouristAttraction)
                    "
                    class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                    Add
                  </button>
                </div>
                <div
                  v-if="packageForm.touristAttractions.length > 0"
                  class="flex flex-wrap gap-2">
                  <span
                    v-for="(
                      attraction, index
                    ) in packageForm.touristAttractions"
                    :key="`attraction-${index}`"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded">
                    {{ attraction }}
                    <button
                      type="button"
                      @click="removeArrayItem('touristAttractions', index)"
                      class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Premium Only Features -->
            <div
              v-if="packageForm.type === 'premium'"
              class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Premium Services
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.personalConcierge"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Personal Concierge Service</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.translatorService"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >24/7 Translator Service</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.airportPickup"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Airport Pickup & Drop</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.visaAssistance"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Visa Assistance</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.emergencySupport"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >24/7 Emergency Support</span
                  >
                </label>
              </div>
            </div>

            <!-- Target Countries & Languages -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Target Audience
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Target Countries</label
                  >
                  <div
                    class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <label
                      v-for="country in commonCountries"
                      :key="country"
                      class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        :value="country"
                        v-model="packageForm.targetCountries"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        country
                      }}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Supported Languages</label
                  >
                  <div
                    class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <label
                      v-for="language in commonLanguages"
                      :key="language"
                      class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        :value="language"
                        v-model="packageForm.languages"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        language
                      }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Package Inclusions & Exclusions -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Package Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Inclusions -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Package Inclusions</label
                  >
                  <div class="flex gap-2 mb-2">
                    <input
                      v-model="newInclusion"
                      type="text"
                      placeholder="Add inclusion..."
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                      @keyup.enter="addArrayItem('inclusions', newInclusion)" />
                    <button
                      type="button"
                      @click="addArrayItem('inclusions', newInclusion)"
                      class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Add
                    </button>
                  </div>
                  <div
                    v-if="packageForm.inclusions.length > 0"
                    class="space-y-2">
                    <div
                      v-for="(inclusion, index) in packageForm.inclusions"
                      :key="`inclusion-${index}`"
                      class="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span class="text-green-500">✓</span>
                      <span
                        class="flex-1 text-sm text-gray-700 dark:text-gray-300"
                        >{{ inclusion }}</span
                      >
                      <button
                        type="button"
                        @click="removeArrayItem('inclusions', index)"
                        class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                        ×
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Exclusions -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Package Exclusions</label
                  >
                  <div class="flex gap-2 mb-2">
                    <input
                      v-model="newExclusion"
                      type="text"
                      placeholder="Add exclusion..."
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                      @keyup.enter="addArrayItem('exclusions', newExclusion)" />
                    <button
                      type="button"
                      @click="addArrayItem('exclusions', newExclusion)"
                      class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                      Add
                    </button>
                  </div>
                  <div
                    v-if="packageForm.exclusions.length > 0"
                    class="space-y-2">
                    <div
                      v-for="(exclusion, index) in packageForm.exclusions"
                      :key="`exclusion-${index}`"
                      class="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span class="text-red-500">✗</span>
                      <span
                        class="flex-1 text-sm text-gray-700 dark:text-gray-300"
                        >{{ exclusion }}</span
                      >
                      <button
                        type="button"
                        @click="removeArrayItem('exclusions', index)"
                        class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Package Settings
              </h4>
              <div class="flex items-center gap-6">
                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.isActive"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Active Package</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.isPopular"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Popular Package</span
                  >
                </label>

                <label class="flex items-center gap-2">
                  <input
                    v-model="packageForm.isFeatured"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Featured Package</span
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
                    ? "Update Package"
                    : "Create Package"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Package Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedPackage"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">{{
                    getPackageTypeInfo(selectedPackage.type).icon
                  }}</span>
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ selectedPackage.name }}
                    </h3>
                    <span
                      :class="getPackageTypeInfo(selectedPackage.type).color"
                      class="px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getPackageTypeInfo(selectedPackage.type).label }}
                    </span>
                  </div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedPackage.city }}, {{ selectedPackage.country }} •
                  {{ selectedPackage.hospitalPartner }}
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
            <!-- Pricing -->
            <div class="flex items-center gap-4">
              <span
                v-if="
                  selectedPackage.originalPrice >
                  selectedPackage.discountedPrice
                "
                class="text-2xl text-gray-500 line-through">
                {{ formatCurrency(selectedPackage.originalPrice) }}
              </span>
              <span class="text-3xl font-bold text-[#4565AD]">
                {{ formatCurrency(selectedPackage.discountedPrice) }}
              </span>
              <span
                v-if="
                  selectedPackage.originalPrice >
                  selectedPackage.discountedPrice
                "
                class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                {{
                  calculateDiscount(
                    selectedPackage.originalPrice,
                    selectedPackage.discountedPrice
                  )
                }}% OFF
              </span>
            </div>

            <!-- Description -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Package Description
              </h4>
              <p
                class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                {{ selectedPackage.description }}
              </p>
            </div>

            <!-- Package Details -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Duration:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedPackage.duration }}
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Validity:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedPackage.validity }} days
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Bookings:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedPackage.bookingCount }}
                </p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Rating:</span>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ selectedPackage.rating }}/5 ⭐ ({{
                    selectedPackage.reviews
                  }})
                </p>
              </div>
            </div>

            <!-- Medical Services -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Medical Services Included
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-if="selectedPackage.consultations?.length">
                  <h5
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Consultations
                  </h5>
                  <ul class="space-y-1">
                    <li
                      v-for="consultation in selectedPackage.consultations"
                      :key="consultation"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span class="text-green-500">✓</span> {{ consultation }}
                    </li>
                  </ul>
                </div>

                <div v-if="selectedPackage.treatments?.length">
                  <h5
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Treatments
                  </h5>
                  <ul class="space-y-1">
                    <li
                      v-for="treatment in selectedPackage.treatments"
                      :key="treatment"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span class="text-green-500">✓</span> {{ treatment }}
                    </li>
                  </ul>
                </div>

                <div v-if="selectedPackage.diagnosticTests?.length">
                  <h5
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diagnostic Tests
                  </h5>
                  <ul class="space-y-1">
                    <li
                      v-for="test in selectedPackage.diagnosticTests"
                      :key="test"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span class="text-green-500">✓</span> {{ test }}
                    </li>
                  </ul>
                </div>

                <div v-if="selectedPackage.surgicalProcedures?.length">
                  <h5
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Surgical Procedures
                  </h5>
                  <ul class="space-y-1">
                    <li
                      v-for="procedure in selectedPackage.surgicalProcedures"
                      :key="procedure"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span class="text-green-500">✓</span> {{ procedure }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Tourism Features -->
            <div
              v-if="
                selectedPackage.type === 'elite' ||
                selectedPackage.type === 'premium'
              ">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Tourism & Travel Features
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Accommodation & Stay
                  </h5>
                  <div
                    class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div
                      v-if="selectedPackage.accommodationType"
                      class="flex items-center gap-2">
                      <span class="text-purple-500">🏨</span>
                      <span>{{
                        selectedPackage.accommodationType
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      }}</span>
                    </div>
                    <div
                      v-if="selectedPackage.accommodationNights > 0"
                      class="flex items-center gap-2">
                      <span class="text-purple-500">🌙</span>
                      <span
                        >{{ selectedPackage.accommodationNights }} nights
                        stay</span
                      >
                    </div>
                    <div
                      v-if="selectedPackage.mealsIncluded"
                      class="flex items-center gap-2">
                      <span class="text-purple-500">🍽️</span>
                      <span>All meals included</span>
                    </div>
                    <div
                      v-if="selectedPackage.transportationIncluded"
                      class="flex items-center gap-2">
                      <span class="text-purple-500">🚗</span>
                      <span>Local transportation</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedPackage.tourPackages?.length">
                  <h5
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tour Packages
                  </h5>
                  <div class="space-y-1">
                    <div
                      v-for="tour in selectedPackage.tourPackages"
                      :key="tour"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span class="text-purple-500">✈️</span> {{ tour }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="selectedPackage.touristAttractions?.length"
                class="mt-4">
                <h5
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tourist Attractions
                </h5>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="attraction in selectedPackage.touristAttractions"
                    :key="attraction"
                    class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                    {{ attraction }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Premium Services -->
            <div v-if="selectedPackage.type === 'premium'">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Premium Services
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-if="selectedPackage.personalConcierge"
                  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                  <span class="text-yellow-600">👨‍💼</span> Personal Concierge
                  Service
                </div>
                <div
                  v-if="selectedPackage.translatorService"
                  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                  <span class="text-yellow-600">🗣️</span> 24/7 Translator
                  Service
                </div>
                <div
                  v-if="selectedPackage.airportPickup"
                  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                  <span class="text-yellow-600">🛫</span> Airport Pickup & Drop
                </div>
                <div
                  v-if="selectedPackage.visaAssistance"
                  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                  <span class="text-yellow-600">📋</span> Visa Assistance
                </div>
                <div
                  v-if="selectedPackage.emergencySupport"
                  class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                  <span class="text-yellow-600">🚨</span> 24/7 Emergency Support
                </div>
              </div>
            </div>

            <!-- Target Countries -->
            <div v-if="selectedPackage.targetCountries?.length">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Target Countries
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="country in selectedPackage.targetCountries"
                  :key="country"
                  class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                  {{ country }}
                </span>
              </div>
            </div>

            <!-- Inclusions & Exclusions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="selectedPackage.inclusions?.length">
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Package Inclusions
                </h4>
                <ul
                  class="space-y-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <li
                    v-for="inclusion in selectedPackage.inclusions"
                    :key="inclusion"
                    class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span class="text-green-500 mt-0.5">✓</span>
                    {{ inclusion }}
                  </li>
                </ul>
              </div>

              <div v-if="selectedPackage.exclusions?.length">
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Package Exclusions
                </h4>
                <ul
                  class="space-y-2 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <li
                    v-for="exclusion in selectedPackage.exclusions"
                    :key="exclusion"
                    class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span class="text-red-500 mt-0.5">✗</span>
                    {{ exclusion }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Action Buttons -->
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
                  duplicatePackage(selectedPackage);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Duplicate Package
              </button>
              <button
                type="button"
                @click="
                  openEditModal(selectedPackage);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                Edit Package
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
            🗑️ Delete Package
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete
            <strong>{{ packageToDelete?.name }}</strong
            >? This action cannot be undone and will affect
            {{ packageToDelete?.bookingCount || 0 }} existing bookings.
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
              Delete Package
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

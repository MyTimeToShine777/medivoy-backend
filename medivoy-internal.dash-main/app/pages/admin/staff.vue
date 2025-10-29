<!-- pages/admin/staff.vue -->
<script setup lang="ts">
import { useStaffMock } from "~/composables/useStaffMock";

const {
  staffMembers,
  staffStats,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
  bulkUpdateStatus,
  updateAttendance,
  updatePerformance,
} = useStaffMock();

// State management
const searchQuery = ref("");
const filterDepartment = ref("all");
const filterPosition = ref("all");
const filterStatus = ref("all");
const filterCountry = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const showBulkModal = ref(false);
const showPerformanceModal = ref(false);
const selectedStaff = ref(null);
const staffToDelete = ref(null);
const selectedItems = ref([]);
const isSubmitting = ref(false);
const sortBy = ref("joinDate");
const sortOrder = ref("desc");
const viewMode = ref("cards");

// Form data
const staffForm = ref({
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  personalEmail: "",
  dateOfBirth: "",
  gender: "male",
  nationality: "",
  languages: [],
  address: {
    street: "",
    city: "",
    state: "",
    country: "UAE",
    postalCode: "",
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
    email: "",
  },
  position: "",
  department: "",
  specialization: "",
  qualifications: [],
  licenseNumber: "",
  licenseExpiry: "",
  employmentType: "full_time",
  contractType: "permanent",
  joinDate: "",
  workSchedule: {
    type: "fixed",
    hoursPerWeek: 40,
    workDays: [],
    shiftStart: "08:00",
    shiftEnd: "17:00",
  },
  salary: {
    currency: "AED",
    amount: 0,
    type: "monthly",
  },
  benefits: [],
  facilityAccess: [],
  systemAccess: [],
  permissions: [],
  status: "active",
  notes: "",
  tags: [],
});

// Performance form
const performanceForm = ref({
  rating: 0,
  goals: [],
  achievements: [],
  nextReviewDate: "",
});

// Options
const departments = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Obstetrics",
  "Emergency Medicine",
  "Radiology",
  "Laboratory",
  "Pharmacy",
  "Nursing",
  "Administration",
  "IT",
  "Finance",
  "HR",
  "Maintenance",
];

const employmentTypes = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "intern", label: "Intern" },
];

const contractTypes = [
  { value: "permanent", label: "Permanent" },
  { value: "fixed_term", label: "Fixed Term" },
  { value: "temporary", label: "Temporary" },
  { value: "probation", label: "Probation" },
];

const statusOptions = [
  {
    value: "active",
    label: "Active",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    value: "inactive",
    label: "Inactive",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    value: "on_leave",
    label: "On Leave",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "terminated",
    label: "Terminated",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
];

const currencies = [
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "BHD", name: "Bahraini Dinar" },
  { code: "OMR", name: "Omani Rial" },
  { code: "JOD", name: "Jordanian Dinar" },
  { code: "USD", name: "US Dollar" },
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
];

const languageOptions = [
  "arabic",
  "english",
  "french",
  "german",
  "spanish",
  "urdu",
  "hindi",
  "tagalog",
  "russian",
  "turkish",
  "farsi",
];

const benefitsOptions = [
  "health_insurance",
  "life_insurance",
  "dental",
  "vision",
  "annual_leave",
  "sick_leave",
  "maternity_leave",
  "paternity_leave",
  "education_allowance",
  "housing_allowance",
  "transport_allowance",
  "professional_development",
];

// Temporary inputs
const newQualification = ref("");
const newTag = ref("");
const newGoal = ref("");
const newAchievement = ref("");

// Computed
const filteredStaffMembers = computed(() => {
  let filtered = [...staffMembers.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.fullName.toLowerCase().includes(query) ||
        s.employeeId.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.position.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
    );
  }

  if (filterDepartment.value !== "all") {
    filtered = filtered.filter((s) => s.department === filterDepartment.value);
  }

  if (filterPosition.value !== "all") {
    const role = filterPosition.value;
    filtered = filtered.filter((s) => {
      const staffRole = s.position.includes("Dr.")
        ? "Doctor"
        : s.position.includes("Nurse")
        ? "Nurse"
        : s.position.includes("Technician")
        ? "Technician"
        : s.position.includes("Pharmacist")
        ? "Pharmacist"
        : "Other";
      return staffRole === role;
    });
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter((s) => s.status === filterStatus.value);
  }

  if (filterCountry.value !== "all") {
    filtered = filtered.filter(
      (s) => s.address.country === filterCountry.value
    );
  }

  return filtered.sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];

    if (sortBy.value === "joinDate" || sortBy.value === "dateOfBirth") {
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
  return statusOptions.find((s) => s.value === status) || statusOptions[0];
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN");
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "N/A";
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const calculateTenure = (joinDate) => {
  if (!joinDate) return "N/A";
  const today = new Date();
  const join = new Date(joinDate);
  const diffTime = today - join;
  const diffYears = Math.floor(diffTime / (365.25 * 24 * 60 * 60 * 1000));
  const diffMonths = Math.floor(
    (diffTime % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000)
  );

  if (diffYears > 0) {
    return `${diffYears}y ${diffMonths}m`;
  } else {
    return `${diffMonths}m`;
  }
};

// Array manipulation functions
const addQualification = () => {
  const qual = newQualification.value.trim();
  if (qual && !staffForm.value.qualifications.includes(qual)) {
    staffForm.value.qualifications.push(qual);
    newQualification.value = "";
  }
};

const removeQualification = (index) => {
  staffForm.value.qualifications.splice(index, 1);
};

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !staffForm.value.tags.includes(tag)) {
    staffForm.value.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index) => {
  staffForm.value.tags.splice(index, 1);
};

const addGoal = () => {
  const goal = newGoal.value.trim();
  if (goal && !performanceForm.value.goals.includes(goal)) {
    performanceForm.value.goals.push(goal);
    newGoal.value = "";
  }
};

const removeGoal = (index) => {
  performanceForm.value.goals.splice(index, 1);
};

const addAchievement = () => {
  const achievement = newAchievement.value.trim();
  if (
    achievement &&
    !performanceForm.value.achievements.includes(achievement)
  ) {
    performanceForm.value.achievements.push(achievement);
    newAchievement.value = "";
  }
};

const removeAchievement = (index) => {
  performanceForm.value.achievements.splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (staff) => {
  staffForm.value = {
    ...staff,
    languages: [...(staff.languages || [])],
    qualifications: [...(staff.qualifications || [])],
    benefits: [...(staff.benefits || [])],
    facilityAccess: [...(staff.facilityAccess || [])],
    systemAccess: [...(staff.systemAccess || [])],
    permissions: [...(staff.permissions || [])],
    tags: [...(staff.tags || [])],
    workSchedule: {
      ...staff.workSchedule,
      workDays: [...(staff.workSchedule.workDays || [])],
    },
    address: { ...staff.address },
    emergencyContact: { ...staff.emergencyContact },
    salary: { ...staff.salary },
  };
  selectedStaff.value = staff;
  showEditModal.value = true;
};

const openDeleteModal = (staff) => {
  staffToDelete.value = staff;
  showDeleteModal.value = true;
};

const openDetailModal = (staff) => {
  selectedStaff.value = staff;
  showDetailModal.value = true;
};

const openPerformanceModal = (staff) => {
  selectedStaff.value = staff;
  performanceForm.value = {
    rating: staff.performance?.rating || 0,
    goals: [...(staff.performance?.goals || [])],
    achievements: [...(staff.performance?.achievements || [])],
    nextReviewDate: staff.performance?.nextReviewDate || "",
  };
  showPerformanceModal.value = true;
};

const openBulkModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select staff members to perform bulk operations");
    return;
  }
  showBulkModal.value = true;
};

const resetForm = () => {
  staffForm.value = {
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    personalEmail: "",
    dateOfBirth: "",
    gender: "male",
    nationality: "",
    languages: [],
    address: {
      street: "",
      city: "",
      state: "",
      country: "UAE",
      postalCode: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    position: "",
    department: "",
    specialization: "",
    qualifications: [],
    licenseNumber: "",
    licenseExpiry: "",
    employmentType: "full_time",
    contractType: "permanent",
    joinDate: "",
    workSchedule: {
      type: "fixed",
      hoursPerWeek: 40,
      workDays: [],
      shiftStart: "08:00",
      shiftEnd: "17:00",
    },
    salary: {
      currency: "AED",
      amount: 0,
      type: "monthly",
    },
    benefits: [],
    facilityAccess: [],
    systemAccess: [],
    permissions: [],
    status: "active",
    notes: "",
    tags: [],
  };
  newQualification.value = "";
  newTag.value = "";
};

const saveStaff = async () => {
  try {
    isSubmitting.value = true;

    if (
      !staffForm.value.firstName ||
      !staffForm.value.lastName ||
      !staffForm.value.email ||
      !staffForm.value.position
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const staffData = {
      ...staffForm.value,
      fullName: `${staffForm.value.firstName} ${staffForm.value.lastName}`,
      profileImage: `/staff/${staffForm.value.firstName.toLowerCase()}-${staffForm.value.lastName.toLowerCase()}.jpg`,
    };

    if (staffForm.value.id) {
      updateStaffMember(staffForm.value.id, staffData);
      alert("Staff member updated successfully!");
    } else {
      addStaffMember(staffData);
      alert("Staff member added successfully!");
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving staff:", error);
    alert("Error saving staff member. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    deleteStaffMember(staffToDelete.value.id);
    showDeleteModal.value = false;
    staffToDelete.value = null;
    alert("Staff member deleted successfully!");
  } catch (error) {
    console.error("Error deleting staff:", error);
    alert("Error deleting staff member. Please try again.");
  }
};

const updateStaffPerformance = async () => {
  try {
    updatePerformance(selectedStaff.value.id, performanceForm.value);
    showPerformanceModal.value = false;
    alert("Performance updated successfully!");
  } catch (error) {
    console.error("Error updating performance:", error);
    alert("Error updating performance. Please try again.");
  }
};

const handleBulkOperation = async (operation, status = null) => {
  try {
    if (operation === "status" && status) {
      bulkUpdateStatus(selectedItems.value, status);
      alert(`Updated ${selectedItems.value.length} staff members to ${status}`);
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
  if (selectedItems.value.length === filteredStaffMembers.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredStaffMembers.value.map((item) => item.id);
  }
};

const duplicateStaff = (staff) => {
  staffForm.value = {
    ...staff,
    id: null,
    firstName: `${staff.firstName} (Copy)`,
    email: "",
    employeeId: "",
    languages: [...staff.languages],
    qualifications: [...staff.qualifications],
    benefits: [...staff.benefits],
    tags: [...staff.tags],
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
          Staff Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage healthcare staff across international facilities
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openBulkModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50">
          👥 Bulk Actions ({{ selectedItems.length }})
        </button>
        <div
          class="flex rounded-lg border border-gray-300 dark:border-gray-700 p-1">
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
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          👤 Add Staff
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
              Total Staff
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ staffStats.totalStaff }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">👥</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Active Staff
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ staffStats.activeStaff }}
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
            <p class="text-[13px] text-gray-500 dark:text-gray-400">On Leave</p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ staffStats.onLeaveStaff }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">🏖️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Departments
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ Object.keys(staffStats.departments).length }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">🏢</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Avg Rating
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ staffStats.averageRating }}/5
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">⭐</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Department and Position Distribution -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Staff by Department
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, department) in Object.fromEntries(
              Object.entries(staffStats.departments)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
            )"
            :key="department"
            class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{
              department
            }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >{{ count }} staff</span
            >
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Staff by Position Type
        </h3>
        <div class="space-y-3">
          <div
            v-for="(count, position) in Object.fromEntries(
              Object.entries(staffStats.positions).sort(([, a], [, b]) => b - a)
            )"
            :key="position"
            class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-blue-500': position === 'Doctor',
                  'bg-green-500': position === 'Nurse',
                  'bg-purple-500': position === 'Technician',
                  'bg-orange-500': position === 'Pharmacist',
                  'bg-gray-500': position === 'Other',
                }"></span>
              <span class="text-sm font-medium text-gray-900 dark:text-white"
                >{{ position }}s</span
              >
            </div>
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
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div class="relative md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search staff members..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterDepartment"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Departments</option>
          <option v-for="dept in departments" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>

        <select
          v-model="filterPosition"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Positions</option>
          <option value="Doctor">Doctors</option>
          <option value="Nurse">Nurses</option>
          <option value="Technician">Technicians</option>
          <option value="Pharmacist">Pharmacists</option>
          <option value="Other">Other</option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option
            v-for="status in statusOptions"
            :key="status.value"
            :value="status.value">
            {{ status.label }}
          </option>
        </select>

        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="joinDate">Join Date</option>
          <option value="firstName">Name</option>
          <option value="position">Position</option>
          <option value="department">Department</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="
                selectedItems.length === filteredStaffMembers.length &&
                filteredStaffMembers.length > 0
              "
              @change="selectAllItems"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span class="text-gray-700 dark:text-gray-300"
              >Select All ({{ filteredStaffMembers.length }})</span
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

    <!-- Staff Cards View -->
    <div
      v-if="viewMode === 'cards'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="staff in filteredStaffMembers"
        :key="staff.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200 group">
        <!-- Header with photo and selection -->
        <div class="relative p-6 pb-4">
          <div class="flex items-start justify-between mb-4">
            <input
              type="checkbox"
              :checked="selectedItems.includes(staff.id)"
              @change="toggleItemSelection(staff.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span
              :class="getStatusInfo(staff.status).color"
              class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusInfo(staff.status).label }}
            </span>
          </div>

          <div class="text-center">
            <div
              class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {{ staff.firstName.charAt(0) }}{{ staff.lastName.charAt(0) }}
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              {{ staff.fullName }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ staff.position }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ staff.department }}
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 pb-6">
          <div class="space-y-2 text-sm mb-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">ID:</span>
              <span class="text-gray-900 dark:text-white">{{
                staff.employeeId
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Tenure:</span>
              <span class="text-gray-900 dark:text-white">{{
                calculateTenure(staff.joinDate)
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Rating:</span>
              <div class="flex items-center gap-1">
                <span class="text-yellow-500">⭐</span>
                <span class="text-gray-900 dark:text-white">{{
                  staff.performance?.rating || "N/A"
                }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-400">Country:</span>
              <span class="text-gray-900 dark:text-white">{{
                staff.address.country
              }}</span>
            </div>
          </div>

          <!-- Languages -->
          <div
            v-if="staff.languages && staff.languages.length > 0"
            class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="lang in staff.languages.slice(0, 3)"
                :key="lang"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
              </span>
              <span
                v-if="staff.languages.length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                +{{ staff.languages.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="openDetailModal(staff)"
              class="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              👁️ View
            </button>
            <button
              @click="openPerformanceModal(staff)"
              class="flex-1 px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              📊 Performance
            </button>
            <button
              @click="openEditModal(staff)"
              class="flex-1 px-3 py-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff List View -->
    <div
      v-else
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Staff Members
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredStaffMembers.length }} members found
          </p>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="staff in filteredStaffMembers"
          :key="staff.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-center gap-4">
            <!-- Selection -->
            <input
              type="checkbox"
              :checked="selectedItems.includes(staff.id)"
              @change="toggleItemSelection(staff.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />

            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {{ staff.firstName.charAt(0) }}{{ staff.lastName.charAt(0) }}
              </div>
            </div>

            <!-- Staff Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-4">
                  <div>
                    <h3
                      class="text-base font-semibold text-gray-900 dark:text-white">
                      {{ staff.fullName }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ staff.position }} • {{ staff.department }}
                    </p>
                  </div>

                  <span
                    :class="getStatusInfo(staff.status).color"
                    class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ getStatusInfo(staff.status).label }}
                  </span>
                </div>

                <div class="text-right">
                  <div class="flex items-center gap-1 mb-1">
                    <span class="text-yellow-500">⭐</span>
                    <span
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                      >{{ staff.performance?.rating || "N/A" }}</span
                    >
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Performance
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>🆔 {{ staff.employeeId }}</span>
                <span>📧 {{ staff.email }}</span>
                <span>📱 {{ staff.phone }}</span>
                <span>🌍 {{ staff.address.country }}</span>
                <span>📅 Joined {{ formatDate(staff.joinDate) }}</span>
                <span>⏱️ {{ calculateTenure(staff.joinDate) }} tenure</span>
              </div>

              <!-- Languages & Specialization -->
              <div class="mt-2 flex items-center gap-4">
                <div
                  v-if="staff.languages && staff.languages.length > 0"
                  class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >Languages:</span
                  >
                  <div class="flex gap-1">
                    <span
                      v-for="lang in staff.languages.slice(0, 3)"
                      :key="lang"
                      class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                      {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="staff.specialization"
                  class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >Specialization:</span
                  >
                  <span
                    class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded">
                    {{ staff.specialization }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="openDetailModal(staff)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="View Details">
                👁️
              </button>
              <button
                @click="openPerformanceModal(staff)"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Performance">
                📊
              </button>
              <button
                @click="duplicateStaff(staff)"
                class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="Duplicate">
                📋
              </button>
              <button
                @click="openEditModal(staff)"
                class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Edit">
                ✏️
              </button>
              <button
                @click="openDeleteModal(staff)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredStaffMembers.length === 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <div class="text-6xl mb-4">👥</div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No staff members found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or add your first staff member.
      </p>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
        Add Staff Member
      </button>
    </div>

    <!-- Add/Edit Staff Modal -->
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
                  showEditModal ? "Edit Staff Member" : "Add New Staff Member"
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

          <form @submit.prevent="saveStaff" class="p-6 space-y-6">
            <!-- Personal Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >First Name *</label
                  >
                  <input
                    v-model="staffForm.firstName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Last Name *</label
                  >
                  <input
                    v-model="staffForm.lastName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Date of Birth</label
                  >
                  <input
                    v-model="staffForm.dateOfBirth"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Gender</label
                  >
                  <select
                    v-model="staffForm.gender"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Nationality</label
                  >
                  <input
                    v-model="staffForm.nationality"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Languages</label
                  >
                  <div
                    class="grid grid-cols-2 gap-1 max-h-20 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                    <label
                      v-for="language in languageOptions"
                      :key="language"
                      class="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        :value="language"
                        v-model="staffForm.languages"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        language.charAt(0).toUpperCase() + language.slice(1)
                      }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Work Email *</label
                  >
                  <input
                    v-model="staffForm.email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Personal Email</label
                  >
                  <input
                    v-model="staffForm.personalEmail"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Primary Phone *</label
                  >
                  <input
                    v-model="staffForm.phone"
                    type="tel"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Alternate Phone</label
                  >
                  <input
                    v-model="staffForm.alternatePhone"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Address Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Street Address</label
                  >
                  <input
                    v-model="staffForm.address.street"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >City</label
                  >
                  <input
                    v-model="staffForm.address.city"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >State/Province</label
                  >
                  <input
                    v-model="staffForm.address.state"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Country</label
                  >
                  <select
                    v-model="staffForm.address.country"
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
                    >Postal Code</label
                  >
                  <input
                    v-model="staffForm.address.postalCode"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Professional Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Professional Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Position *</label
                  >
                  <input
                    v-model="staffForm.position"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Department *</label
                  >
                  <select
                    v-model="staffForm.department"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Department</option>
                    <option
                      v-for="dept in departments"
                      :key="dept"
                      :value="dept">
                      {{ dept }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Specialization</label
                  >
                  <input
                    v-model="staffForm.specialization"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Join Date *</label
                  >
                  <input
                    v-model="staffForm.joinDate"
                    type="date"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Employment Type</label
                  >
                  <select
                    v-model="staffForm.employmentType"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in employmentTypes"
                      :key="type.value"
                      :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Contract Type</label
                  >
                  <select
                    v-model="staffForm.contractType"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in contractTypes"
                      :key="type.value"
                      :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Qualifications -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Qualifications & License
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >License Number</label
                  >
                  <input
                    v-model="staffForm.licenseNumber"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >License Expiry</label
                  >
                  <input
                    v-model="staffForm.licenseExpiry"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Qualifications</label
                  >
                  <div class="flex gap-2 mb-2">
                    <input
                      v-model="newQualification"
                      type="text"
                      placeholder="Add qualification..."
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                      @keyup.enter="addQualification" />
                    <button
                      type="button"
                      @click="addQualification"
                      class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                      Add
                    </button>
                  </div>
                  <div
                    v-if="staffForm.qualifications.length > 0"
                    class="flex flex-wrap gap-2">
                    <span
                      v-for="(qual, index) in staffForm.qualifications"
                      :key="index"
                      class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                      {{ qual }}
                      <button
                        type="button"
                        @click="removeQualification(index)"
                        class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                        ×
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Salary Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Compensation
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Currency</label
                  >
                  <select
                    v-model="staffForm.salary.currency"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="currency in currencies"
                      :key="currency.code"
                      :value="currency.code">
                      {{ currency.code }} - {{ currency.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Amount</label
                  >
                  <input
                    v-model="staffForm.salary.amount"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Type</label
                  >
                  <select
                    v-model="staffForm.salary.type"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="hourly">Hourly</option>
                  </select>
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
                    >Benefits</label
                  >
                  <div
                    class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <label
                      v-for="benefit in benefitsOptions"
                      :key="benefit"
                      class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        :value="benefit"
                        v-model="staffForm.benefits"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        benefit
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      }}</span>
                    </label>
                  </div>
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
                    v-if="staffForm.tags.length > 0"
                    class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in staffForm.tags"
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
                    v-model="staffForm.notes"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Additional notes about this staff member..."></textarea>
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
                    ? "Update Staff"
                    : "Add Staff"
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
            🗑️ Delete Staff Member
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this staff member? This action
            cannot be undone and will affect all related records.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ staffToDelete?.fullName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ staffToDelete?.employeeId }} • {{ staffToDelete?.position }}
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
              Delete Staff
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Performance Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showPerformanceModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              📊 Performance Review
            </h3>
            <button
              type="button"
              @click="showPerformanceModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>

          <div class="mb-4">
            <p class="text-gray-600 dark:text-gray-400">
              Update performance review for
              <strong>{{ selectedStaff?.fullName }}</strong>
            </p>
          </div>

          <form @submit.prevent="updateStaffPerformance" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Performance Rating</label
              >
              <div class="flex items-center gap-4">
                <input
                  v-model="performanceForm.rating"
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  class="flex-1" />
                <span
                  class="text-lg font-semibold text-gray-900 dark:text-white min-w-[60px]"
                  >{{ performanceForm.rating }}/5</span
                >
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Goals</label
              >
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newGoal"
                  type="text"
                  placeholder="Add performance goal..."
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                  @keyup.enter="addGoal" />
                <button
                  type="button"
                  @click="addGoal"
                  class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                  Add
                </button>
              </div>
              <div v-if="performanceForm.goals.length > 0" class="space-y-2">
                <div
                  v-for="(goal, index) in performanceForm.goals"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  <span class="text-gray-900 dark:text-white">{{ goal }}</span>
                  <button
                    type="button"
                    @click="removeGoal(index)"
                    class="text-red-600 dark:text-red-400 hover:text-red-800">
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Achievements</label
              >
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newAchievement"
                  type="text"
                  placeholder="Add achievement..."
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                  @keyup.enter="addAchievement" />
                <button
                  type="button"
                  @click="addAchievement"
                  class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Add
                </button>
              </div>
              <div
                v-if="performanceForm.achievements.length > 0"
                class="space-y-2">
                <div
                  v-for="(achievement, index) in performanceForm.achievements"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                  <span class="text-gray-900 dark:text-white">{{
                    achievement
                  }}</span>
                  <button
                    type="button"
                    @click="removeAchievement(index)"
                    class="text-red-600 dark:text-red-400 hover:text-red-800">
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Next Review Date</label
              >
              <input
                v-model="performanceForm.nextReviewDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showPerformanceModal = false"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                Update Performance
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
            👥 Bulk Operations
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Selected {{ selectedItems.length }} staff members. Choose an
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
                  @click="handleBulkOperation('status', 'active')"
                  class="px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  Active
                </button>
                <button
                  @click="handleBulkOperation('status', 'inactive')"
                  class="px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                  Inactive
                </button>
                <button
                  @click="handleBulkOperation('status', 'on_leave')"
                  class="px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                  On Leave
                </button>
                <button
                  @click="handleBulkOperation('status', 'terminated')"
                  class="px-3 py-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Terminated
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

    <!-- Staff Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedStaff"
        class="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {{ selectedStaff.firstName.charAt(0)
                  }}{{ selectedStaff.lastName.charAt(0) }}
                </div>
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ selectedStaff.fullName }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ selectedStaff.employeeId }} •
                    {{ selectedStaff.position }}
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
              <!-- Personal Information -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Personal Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Full Name:</strong> {{ selectedStaff.fullName }}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>
                    {{ formatDate(selectedStaff.dateOfBirth) }} ({{
                      calculateAge(selectedStaff.dateOfBirth)
                    }}
                    years)
                  </p>
                  <p>
                    <strong>Gender:</strong>
                    {{
                      selectedStaff.gender?.charAt(0).toUpperCase() +
                      selectedStaff.gender?.slice(1)
                    }}
                  </p>
                  <p>
                    <strong>Nationality:</strong>
                    {{ selectedStaff.nationality }}
                  </p>
                  <p
                    v-if="
                      selectedStaff.languages &&
                      selectedStaff.languages.length > 0
                    ">
                    <strong>Languages:</strong>
                    {{
                      selectedStaff.languages
                        .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
                        .join(", ")
                    }}
                  </p>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Contact Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p><strong>Work Email:</strong> {{ selectedStaff.email }}</p>
                  <p v-if="selectedStaff.personalEmail">
                    <strong>Personal Email:</strong>
                    {{ selectedStaff.personalEmail }}
                  </p>
                  <p><strong>Phone:</strong> {{ selectedStaff.phone }}</p>
                  <p v-if="selectedStaff.alternatePhone">
                    <strong>Alternate Phone:</strong>
                    {{ selectedStaff.alternatePhone }}
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {{ selectedStaff.address.street }},
                    {{ selectedStaff.address.city }},
                    {{ selectedStaff.address.country }}
                  </p>
                </div>
              </div>

              <!-- Professional Information -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Professional Information
                </h4>
                <div class="space-y-2 text-sm">
                  <p><strong>Position:</strong> {{ selectedStaff.position }}</p>
                  <p>
                    <strong>Department:</strong> {{ selectedStaff.department }}
                  </p>
                  <p v-if="selectedStaff.specialization">
                    <strong>Specialization:</strong>
                    {{ selectedStaff.specialization }}
                  </p>
                  <p>
                    <strong>Join Date:</strong>
                    {{ formatDate(selectedStaff.joinDate) }}
                  </p>
                  <p>
                    <strong>Tenure:</strong>
                    {{ calculateTenure(selectedStaff.joinDate) }}
                  </p>
                  <p>
                    <strong>Employment Type:</strong>
                    {{
                      selectedStaff.employmentType
                        ?.replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    }}
                  </p>
                  <p>
                    <strong>License:</strong>
                    {{ selectedStaff.licenseNumber }} (expires
                    {{ formatDate(selectedStaff.licenseExpiry) }})
                  </p>
                </div>
              </div>

              <!-- Performance & Attendance -->
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Performance & Attendance
                </h4>
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Performance Rating:</strong>
                    {{ selectedStaff.performance?.rating || "N/A" }}/5
                  </p>
                  <p>
                    <strong>Attendance Rate:</strong>
                    {{ selectedStaff.attendance?.attendanceRate || "N/A" }}%
                  </p>
                  <p>
                    <strong>Present Days:</strong>
                    {{ selectedStaff.attendance?.presentDays || 0 }}/{{
                      selectedStaff.attendance?.totalDays || 0
                    }}
                  </p>
                  <p>
                    <strong>Late Arrivals:</strong>
                    {{ selectedStaff.attendance?.lateArrivals || 0 }}
                  </p>
                  <p>
                    <strong>Last Review:</strong>
                    {{ formatDate(selectedStaff.performance?.lastReviewDate) }}
                  </p>
                  <p>
                    <strong>Next Review:</strong>
                    {{ formatDate(selectedStaff.performance?.nextReviewDate) }}
                  </p>
                </div>
              </div>

              <!-- Qualifications -->
              <div
                v-if="
                  selectedStaff.qualifications &&
                  selectedStaff.qualifications.length > 0
                ">
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Qualifications
                </h4>
                <div class="space-y-1">
                  <div
                    v-for="qual in selectedStaff.qualifications"
                    :key="qual"
                    class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded inline-block mr-2 mb-1">
                    {{ qual }}
                  </div>
                </div>
              </div>

              <!-- Certifications -->
              <div
                v-if="
                  selectedStaff.certifications &&
                  selectedStaff.certifications.length > 0
                ">
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                  Certifications
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="cert in selectedStaff.certifications"
                    :key="cert.name"
                    class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                    <p class="font-medium text-blue-800 dark:text-blue-300">
                      {{ cert.name }}
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ cert.issuer }} • Expires:
                      {{ formatDate(cert.expiryDate) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Goals & Achievements -->
            <div
              v-if="
                selectedStaff.performance?.goals?.length > 0 ||
                selectedStaff.performance?.achievements?.length > 0
              "
              class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-if="selectedStaff.performance.goals?.length > 0">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                    Current Goals
                  </h4>
                  <ul class="space-y-2">
                    <li
                      v-for="goal in selectedStaff.performance.goals"
                      :key="goal"
                      class="flex items-start gap-2 text-sm">
                      <span class="text-blue-500 mt-1">•</span>
                      <span class="text-gray-700 dark:text-gray-300">{{
                        goal
                      }}</span>
                    </li>
                  </ul>
                </div>

                <div v-if="selectedStaff.performance.achievements?.length > 0">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                    Achievements
                  </h4>
                  <ul class="space-y-2">
                    <li
                      v-for="achievement in selectedStaff.performance
                        .achievements"
                      :key="achievement"
                      class="flex items-start gap-2 text-sm">
                      <span class="text-green-500 mt-1">✓</span>
                      <span class="text-gray-700 dark:text-gray-300">{{
                        achievement
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div
              v-if="selectedStaff.tags && selectedStaff.tags.length > 0"
              class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Tags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedStaff.tags"
                  :key="tag"
                  class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="selectedStaff.notes" class="mt-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Notes
              </h4>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                {{ selectedStaff.notes }}
              </p>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
              <button
                type="button"
                @click="
                  openPerformanceModal(selectedStaff);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                📊 Performance Review
              </button>
              <button
                type="button"
                @click="
                  duplicateStaff(selectedStaff);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                📋 Duplicate
              </button>
              <button
                type="button"
                @click="
                  openEditModal(selectedStaff);
                  showDetailModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                ✏️ Edit Staff
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

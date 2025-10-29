<!-- pages/index.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "#app";

// Use existing composables (don't create separate mock data)
import { useIntegrationsMock } from "~/composables/useIntegrationsMock";
import { useDoctorsMock } from "~/composables/useDoctorsMock";
import { useAppointmentsMock } from "~/composables/useAppointmentsMock";
import { usePatientsMock } from "~/composables/usePatientsMock";

// Router
const router = useRouter();

// Use existing composable data
const { integrations, integrationStats } = useIntegrationsMock();
const { doctors } = useDoctorsMock();
const { rows: appointments } = useAppointmentsMock();
const { patients } = usePatientsMock();

// Dashboard stats (derived from mock data + some local state)
const stats = computed(() => ({
  totalPatients: patients.value.length || 15234,
  activePatients:
    patients.value.filter((p) => p.status !== "Recovered").length || 8456,
  appointments: appointments.value.length || 342,
  revenue: 2847500,
  todayAppointments:
    appointments.value.filter((a) => {
      const today = new Date().toISOString().slice(0, 10);
      return a.date === today;
    }).length || 45,
  pendingAppointments:
    appointments.value.filter(
      (a) => a.time > new Date().toTimeString().slice(0, 5)
    ).length || 12,
  completedAppointments: 28,
  cancelledAppointments: 5,
  avgWaitTime: 18,
  patientSatisfaction: 4.7,
  bedOccupancy: 78,
  staffOnDuty: doctors.value.length || 124,
}));

// Transform appointments data for dashboard display
const recentAppointments = computed(() =>
  appointments.value.slice(0, 5).map((appt) => ({
    id: appt.id,
    patient: appt.name,
    doctor: appt.doctor,
    time: appt.time,
    status:
      appt.id % 4 === 0
        ? "completed"
        : appt.id % 3 === 0
        ? "in-progress"
        : appt.id % 2 === 0
        ? "waiting"
        : "scheduled",
    type: appt.treatment,
    department: getDepartmentFromTreatment(appt.treatment),
    patientId: parseInt(appt.patientId.replace("PID-", "")),
  }))
);

// Transform patients data for dashboard display
const recentPatients = computed(() =>
  patients.value.slice(0, 5).map((patient) => ({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    lastVisit: getRandomLastVisit(),
    status: patient.status.toLowerCase().replace(" ", "-"),
    diagnosis: patient.injury,
  }))
);

// Helper function to map treatments to departments
const getDepartmentFromTreatment = (treatment) => {
  const treatmentMap = {
    Operation: "Surgery",
    Surgery: "Surgery",
    Prostate: "Urology",
    Cancer: "Oncology",
    Infertility: "Reproductive Medicine",
    Checkup: "General Medicine",
  };
  return treatmentMap[treatment] || "General Medicine";
};

// Helper function for random last visit times
const getRandomLastVisit = () => {
  const options = [
    "2 hours ago",
    "1 day ago",
    "3 days ago",
    "5 hours ago",
    "1 week ago",
  ];
  return options[Math.floor(Math.random() * options.length)];
};

// Departments overview (use doctors data to calculate stats)
const departmentStats = computed(() => {
  const deptMap = {};
  doctors.value.forEach((doctor) => {
    const dept = doctor.department;
    if (!deptMap[dept]) {
      deptMap[dept] = {
        name: dept,
        doctors: 0,
        patients: 0,
        beds: 0,
        occupancy: 0,
        revenue: 0,
      };
    }
    deptMap[dept].doctors++;
  });

  // Add some calculated data
  Object.keys(deptMap).forEach((dept) => {
    deptMap[dept].patients = Math.floor(Math.random() * 300) + 100;
    deptMap[dept].beds = Math.floor(deptMap[dept].doctors * 5) + 20;
    deptMap[dept].occupancy = Math.floor(Math.random() * 30) + 65;
    deptMap[dept].revenue = Math.floor(Math.random() * 300000) + 200000;
  });

  return Object.values(deptMap).slice(0, 5);
});

// Notifications list (UI state only; bell routes to /admin/notifications)
const notifications = ref([
  {
    id: 1,
    type: "alert",
    title: "Integration System Warning",
    message: "Hospital Management sync delayed by 2 hours",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "New Doctor Added",
    message: `${doctors.value[0]?.name || "Dr. Smith"} joined ${
      doctors.value[0]?.department || "Surgery"
    }`,
    time: "10 min ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "New Appointment",
    message: `${appointments.value[0]?.name || "Patient"} scheduled for ${
      appointments.value[0]?.time || "2:00 PM"
    }`,
    time: "15 min ago",
    read: true,
  },
  {
    id: 4,
    type: "warning",
    title: "Bed Capacity",
    message: `${departmentStats.value[0]?.name || "Cardiology"} ward at ${
      departmentStats.value[0]?.occupancy || 82
    }% occupancy`,
    time: "1 hour ago",
    read: true,
  },
]);

// Revenue (simple bars)
const revenueData = ref([
  { month: "Apr", revenue: 2456000 },
  { month: "May", revenue: 2678000 },
  { month: "Jun", revenue: 2834000 },
  { month: "Jul", revenue: 2945000 },
  { month: "Aug", revenue: 2756000 },
  { month: "Sep", revenue: 2889000 },
  { month: "Oct", revenue: 2847500 },
]);

// Fixed navigation functions with proper error handling
const navigateToPage = async (path) => {
  try {
    await router.push(path);
  } catch (error) {
    console.warn(`Navigation to ${path} failed:`, error);
    // Fallback: show alert for now, you can implement proper error handling
    alert(`Page ${path} not yet implemented`);
  }
};

// Navigation functions with error handling
const goDashboard = () => navigateToPage("/");
const goPatients = () => navigateToPage("/patient/list");
const goDoctors = () => navigateToPage("/doctor/list");
const goAppointments = () => navigateToPage("/appointment");
const goSupport = () => navigateToPage("/support");
const goRecords = () => navigateToPage("/records");
const goSettings = () => navigateToPage("/settings");
const goPayments = () => navigateToPage("/website/payments");
const goNotifications = () => navigateToPage("/admin/notifications");

// Header actions
const refreshDashboard = () => {
  // Refresh data from composables if needed
  const newPatient = patients.value.length + Math.floor(Math.random() * 10);
  alert(`Dashboard refreshed! ✅ Total patients: ${newPatient}`);
};

const showReportsModal = ref(false);
const openReports = () => {
  showReportsModal.value = true;
};

// Export reports with real data from composables
const exportReport = (format) => {
  const payload = {
    stats: stats.value,
    departments: departmentStats.value,
    revenue: revenueData.value,
    patients: patients.value,
    doctors: doctors.value,
    appointments: appointments.value,
    integrations: {
      total: integrationStats.value?.totalIntegrations ?? 0,
      active: integrationStats.value?.activeIntegrations ?? 0,
      healthy: integrationStats.value?.healthyIntegrations ?? 0,
      list: integrations.value,
    },
    generatedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard-report-${Date.now()}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
  showReportsModal.value = false;
  alert(
    `${format.toUpperCase()} report exported with ${
      patients.value.length
    } patients, ${doctors.value.length} doctors, and ${
      appointments.value.length
    } appointments!`
  );
};

// UI helpers
const unreadNotifications = computed(
  () => notifications.value.filter((n) => !n.read).length
);

const currentTime = ref(
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
);

const currentDate = ref(
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);

const searchQuery = ref("");
const filteredAppointments = computed(() => {
  if (!searchQuery.value) return recentAppointments.value;
  const q = searchQuery.value.toLowerCase();
  return recentAppointments.value.filter(
    (a) =>
      a.patient.toLowerCase().includes(q) ||
      a.doctor.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q)
  );
});

const totalRevenue = computed(() =>
  revenueData.value.reduce((s, d) => s + d.revenue, 0)
);

const averageRevenue = computed(() =>
  Math.round(totalRevenue.value / revenueData.value.length)
);

const getStatusClass = (status) => {
  const classes = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "in-progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    waiting:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    scheduled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    recovered:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    stable: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    healthy:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "check-up":
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    operation: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    new: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  };
  return classes[status] || classes.stable;
};

const getNotificationIcon = (type) =>
  ({ alert: "⚠️", success: "✅", info: "ℹ️", warning: "⚡" }[type] || "ℹ️");

const viewAppointmentDetails = (a) => {
  alert(`Appointment Details:
Patient: ${a.patient}
Doctor: ${a.doctor}
Time: ${a.time}
Department: ${a.department}
Type: ${a.type}
Status: ${a.status}
Patient ID: ${a.patientId}`);
};

const viewPatientDetails = (p) => {
  alert(`Patient Details:
ID: #${p.id}
Name: ${p.name}
Age: ${p.age}
Gender: ${p.gender}
Diagnosis: ${p.diagnosis}
Status: ${p.status}
Last Visit: ${p.lastVisit}`);
};

const changeAppointmentStatus = (a, status) => {
  a.status = status;
  alert(`Appointment status changed to: ${status}`);
};

const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

const selectedRevenuePeriod = ref("7months");
const changeRevenuePeriod = (period) => {
  selectedRevenuePeriod.value = period;
  if (period === "12months") {
    revenueData.value = [
      { month: "Nov", revenue: 2234000 },
      { month: "Dec", revenue: 2456000 },
      { month: "Jan", revenue: 2567000 },
      { month: "Feb", revenue: 2678000 },
      { month: "Mar", revenue: 2734000 },
      { month: "Apr", revenue: 2456000 },
      { month: "May", revenue: 2678000 },
      { month: "Jun", revenue: 2834000 },
      { month: "Jul", revenue: 2945000 },
      { month: "Aug", revenue: 2756000 },
      { month: "Sep", revenue: 2889000 },
      { month: "Oct", revenue: 2847500 },
    ];
  } else {
    revenueData.value = [
      { month: "Apr", revenue: 2456000 },
      { month: "May", revenue: 2678000 },
      { month: "Jun", revenue: 2834000 },
      { month: "Jul", revenue: 2945000 },
      { month: "Aug", revenue: 2756000 },
      { month: "Sep", revenue: 2889000 },
      { month: "Oct", revenue: 2847500 },
    ];
  }
};

// Integration health derived from composable
const getRelativeTime = (ts) => {
  if (!ts) return "Never";
  const now = new Date();
  const t = new Date(ts);
  const diff = +now - +t;
  const m = Math.floor(diff / 60000),
    h = Math.floor(diff / 3600000),
    d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return t.toLocaleDateString("en-IN");
};

const integrationHealth = computed(() =>
  integrations.value.slice(0, 5).map((i) => ({
    name: i.name,
    status: i.health,
    uptime: i.uptime,
    lastSync: getRelativeTime(i.lastSync),
  }))
);

// Clock
let timeInterval = null;
onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, 60000);
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
});
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8 space-y-6">
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-[#db465f] to-[#5078cf] rounded-2xl p-6 md:p-8 text-white">
      <div
        class="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold mb-2">
            Welcome to Medivoy Hospital Dashboard 👋
          </h1>
          <p class="text-blue-100 text-sm md:text-base">
            {{ currentDate }} • {{ currentTime }}
          </p>
          <p class="text-blue-100 text-xs mt-1">
            {{ doctors.length }} doctors • {{ patients.length }} patients •
            {{ appointments.length }} appointments
          </p>
        </div>
        <div class="mt-4 md:mt-0 flex items-center gap-3">
          <button
            @click="goNotifications"
            class="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all relative"
            title="Notifications">
            🔔
            <span
              v-if="unreadNotifications > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ unreadNotifications }}
            </span>
          </button>
          <button
            @click="refreshDashboard"
            class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all text-sm font-medium">
            🔄 Refresh
          </button>
          <button
            @click="openReports"
            class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all text-sm font-medium">
            📊 Reports
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards (using computed stats from mock data) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="goPatients">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <span class="text-2xl">👥</span>
          </div>
          <span class="text-xs text-green-600 dark:text-green-400 font-medium"
            >+{{ patients.length }}</span
          >
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Total Patients
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats.totalPatients.toLocaleString() }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ stats.activePatients.toLocaleString() }} active today
        </p>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="goAppointments">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
            <span class="text-2xl">📅</span>
          </div>
          <span class="text-xs text-green-600 dark:text-green-400 font-medium"
            >+{{ appointments.length }}</span
          >
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Appointments Today
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats.todayAppointments }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ stats.completedAppointments }} completed
        </p>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="goPayments">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <span class="text-2xl">💳</span>
          </div>
          <span class="text-xs text-green-600 dark:text-green-400 font-medium"
            >+15.3%</span
          >
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Payments (Website)
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ formatCurrency(stats.revenue) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Target: {{ formatCurrency(3000000) }}
        </p>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="goDoctors">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <span class="text-2xl">👨‍⚕️</span>
          </div>
          <span
            class="text-xs text-green-600 dark:text-green-400 font-medium"
            >{{ doctors.length }}</span
          >
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Doctors & Staff
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats.staffOnDuty }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ stats.bedOccupancy }}% bed occupancy
        </p>
      </div>
    </div>

    <!-- Quick Admin Shortcuts -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      <button
        @click="goDashboard"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        📊 Dashboard
      </button>
      <button
        @click="goPatients"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        👥 Patients
      </button>
      <button
        @click="goDoctors"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        👨‍⚕️ Doctors
      </button>
      <button
        @click="goAppointments"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        📅 Appointments
      </button>
      <button
        @click="goSupport"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        💬 Support
      </button>
      <button
        @click="goRecords"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        🩺 Records
      </button>
      <button
        @click="goSettings"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        ⚙️ Settings
      </button>
      <button
        @click="goPayments"
        class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm hover:border-[#4565AD] hover:text-[#4565AD] transition-colors">
        💳 Payments
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Appointments list (from appointments mock) -->
      <div
        class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              📅 Recent Appointments ({{ appointments.length }} total)
            </h2>
            <button
              @click="goAppointments"
              class="text-sm text-[#4565AD] hover:text-[#3a5599] font-medium">
              View All →
            </button>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search appointments..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]" />
        </div>
        <div
          class="divide-y divide-gray-200 dark:divide-gray-800 max-h-96 overflow-y-auto">
          <div
            v-for="appt in filteredAppointments"
            :key="appt.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ appt.patient }}
                  </p>
                  <span
                    :class="getStatusClass(appt.status)"
                    class="px-2 py-0.5 text-xs font-medium rounded-full">
                    {{ appt.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ appt.doctor }} • {{ appt.department }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {{ appt.type }} • {{ appt.time }}
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    @click="viewAppointmentDetails(appt)"
                    class="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View Details
                  </button>
                  <span class="text-gray-300 dark:text-gray-700">•</span>
                  <button
                    v-if="appt.status === 'in-progress'"
                    @click="changeAppointmentStatus(appt, 'completed')"
                    class="text-xs text-green-600 dark:text-green-400 hover:underline">
                    Mark Complete
                  </button>
                  <button
                    v-if="appt.status === 'scheduled'"
                    @click="changeAppointmentStatus(appt, 'cancelled')"
                    class="text-xs text-red-600 dark:text-red-400 hover:underline">
                    Cancel
                  </button>
                </div>
              </div>
              <button
                @click="viewAppointmentDetails(appt)"
                class="p-2 text-gray-400 hover:text-[#4565AD] transition-colors"
                title="Open">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div
          class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            🔔 Notifications
          </h2>
          <button
            @click="goNotifications"
            class="text-sm text-[#4565AD] hover:text-[#3a5599] font-medium">
            Open Center →
          </button>
        </div>
        <div
          class="divide-y divide-gray-200 dark:divide-gray-800 max-h-96 overflow-y-auto">
          <div
            v-for="n in notifications"
            :key="n.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div class="flex items-start gap-3">
              <div class="text-xl">{{ getNotificationIcon(n.type) }}</div>
              <div class="flex-1 min-w-0">
                <p
                  class="font-medium text-sm text-gray-900 dark:text-white mb-1">
                  {{ n.title }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {{ n.message }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {{ n.time }}
                </p>
              </div>
              <div
                v-if="!n.read"
                class="w-2 h-2 bg-[#4565AD] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patients + Integrations -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Patients (from patients mock) -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div
          class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            👥 Recent Patients ({{ patients.length }} total)
          </h2>
          <button
            @click="goPatients"
            class="text-sm text-[#4565AD] hover:text-[#3a5599] font-medium">
            View All →
          </button>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-800">
          <div
            v-for="p in recentPatients"
            :key="p.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ p.name }}
                  </p>
                  <span
                    :class="getStatusClass(p.status)"
                    class="px-2 py-0.5 text-xs font-medium rounded-full">
                    {{ p.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ID: #{{ p.id }} • {{ p.age }}y, {{ p.gender }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {{ p.diagnosis }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-600 mt-1">
                  Last visit: {{ p.lastVisit }}
                </p>
                <button
                  @click="viewPatientDetails(p)"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Full Profile
                </button>
              </div>
              <button
                @click="viewPatientDetails(p)"
                class="p-2 text-gray-400 hover:text-[#4565AD] transition-colors"
                title="Open">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Integration Health (from integrations mock) -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div
          class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            🔗 System Integrations ({{ integrations.length }} total)
          </h2>
          <button
            @click="router.push('/admin/integrations')"
            class="text-sm text-[#4565AD] hover:text-[#3a5599] font-medium">
            Manage →
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div
            v-for="i in integrationHealth"
            :key="i.name"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
            @click="router.push('/admin/integrations')">
            <div class="flex-1">
              <p class="font-medium text-sm text-gray-900 dark:text-white mb-1">
                {{ i.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Uptime: {{ i.uptime }}% • {{ i.lastSync }}
              </p>
            </div>
            <span
              :class="getStatusClass(i.status)"
              class="px-2 py-1 text-xs font-medium rounded-full">
              {{
                i.status === "healthy"
                  ? "✓"
                  : i.status === "warning"
                  ? "⚠"
                  : "!"
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Department table (using doctors mock data) -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          🏥 Department Overview ({{ doctors.length }} doctors across
          departments)
        </h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Department
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Patients
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Doctors
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Beds
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Occupancy
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr
              v-for="dept in departmentStats"
              :key="dept.name"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td
                class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ dept.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {{ dept.patients }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {{ dept.doctors }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {{ dept.beds }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div
                    class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                    <div
                      :style="{ width: dept.occupancy + '%' }"
                      class="h-2 rounded-full bg-[#4565AD] transition-all"></div>
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ dept.occupancy }}%</span
                  >
                </div>
              </td>
              <td
                class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(dept.revenue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Revenue -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div
        class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            📈 Revenue Trend
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {{ formatCurrency(totalRevenue) }} • Avg:
            {{ formatCurrency(averageRevenue) }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="changeRevenuePeriod('7months')"
            :class="
              selectedRevenuePeriod === '7months'
                ? 'bg-[#4565AD] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            "
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            Last 7 months
          </button>
          <button
            @click="changeRevenuePeriod('12months')"
            :class="
              selectedRevenuePeriod === '12months'
                ? 'bg-[#4565AD] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            "
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            Last 12 months
          </button>
        </div>
      </div>
      <div class="h-64 flex items-end justify-between gap-4">
        <div
          v-for="(d, idx) in revenueData"
          :key="idx"
          class="flex-1 flex flex-col items-center gap-2 group">
          <div
            class="text-xs font-medium text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            {{ formatCurrency(d.revenue) }}
          </div>
          <div
            :style="{
              width: '100%',
              height: (d.revenue / 3000000) * 100 + '%',
            }"
            class="bg-gradient-to-t from-[#4565AD] to-[#4BBECF] rounded-t-lg min-h-[20px] hover:opacity-80 transition-all cursor-pointer transform hover:scale-105"
            :title="d.month + ': ' + formatCurrency(d.revenue)"></div>
          <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {{ d.month }}
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showReportsModal"
        class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
          <div
            class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              📊 Export Reports
            </h3>
            <button
              @click="showReportsModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Export comprehensive dashboard data including
              {{ patients.length }} patients, {{ doctors.length }} doctors, and
              {{ appointments.length }} appointments:
            </p>
            <div class="space-y-3">
              <button
                @click="exportReport('json')"
                class="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-left">
                <div class="font-medium">JSON Format</div>
                <div class="text-xs opacity-80">
                  Complete data with all details
                </div>
              </button>
              <button
                @click="exportReport('csv')"
                class="w-full px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-left">
                <div class="font-medium">CSV Format</div>
                <div class="text-xs opacity-80">
                  For spreadsheet applications
                </div>
              </button>
              <button
                @click="exportReport('pdf')"
                class="w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-left">
                <div class="font-medium">PDF Format</div>
                <div class="text-xs opacity-80">Printable report</div>
              </button>
            </div>
          </div>
          <div
            class="p-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="showReportsModal = false"
              class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<!-- pages/settings.vue -->
<script setup lang="ts">
const { ref, computed, onMounted, watch } = await import("vue");

// Active tab management
const activeTab = ref("general");
const isLoading = ref(false);
const isSaving = ref(false);
const notifications = ref([]);

// Tab definitions
const tabs = [
  { id: "general", label: "General", icon: "⚙️" },
  { id: "users", label: "User Management", icon: "👥" },
  { id: "security", label: "Security", icon: "🔐" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "system", label: "System", icon: "🖥️" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
  { id: "backup", label: "Backup & Data", icon: "💾" },
];

// General Settings
const generalSettings = ref({
  hospitalName: "",
  hospitalAddress: "",
  hospitalPhone: "",
  hospitalEmail: "",
  hospitalWebsite: "",
  hospitalLicense: "",
  businessHours: {
    monday: { open: "08:00", close: "18:00", closed: false },
    tuesday: { open: "08:00", close: "18:00", closed: false },
    wednesday: { open: "08:00", close: "18:00", closed: false },
    thursday: { open: "08:00", close: "18:00", closed: false },
    friday: { open: "08:00", close: "18:00", closed: false },
    saturday: { open: "08:00", close: "14:00", closed: false },
    sunday: { open: "10:00", close: "16:00", closed: true },
  },
  timezone: "Asia/Kolkata",
  language: "en",
  currency: "INR",
});

// User Management
const users = ref([]);
const userForm = ref({
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  department: "",
  status: "active",
  permissions: [],
});
const showUserModal = ref(false);
const showDeleteUserModal = ref(false);
const userToDelete = ref(null);

const roles = [
  { value: "admin", label: "Administrator", permissions: ["all"] },
  {
    value: "doctor",
    label: "Doctor",
    permissions: ["patients", "records", "appointments"],
  },
  { value: "nurse", label: "Nurse", permissions: ["patients", "records"] },
  {
    value: "receptionist",
    label: "Receptionist",
    permissions: ["appointments", "patients"],
  },
  {
    value: "technician",
    label: "Lab Technician",
    permissions: ["lab_reports", "records"],
  },
];

const departments = [
  "General Medicine",
  "Surgery",
  "Pediatrics",
  "Gynecology",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Emergency",
  "Laboratory",
  "Radiology",
  "Administration",
];

// Security Settings
const securitySettings = ref({
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
  },
  twoFactorAuth: {
    enabled: false,
    method: "sms", // sms, email, app
  },
  sessionSettings: {
    timeout: 30, // minutes
    maxConcurrentSessions: 3,
    logoutOnClose: false,
  },
  ipWhitelist: {
    enabled: false,
    addresses: [],
  },
  auditLogging: {
    enabled: true,
    retentionDays: 365,
  },
});

// Notification Settings
const notificationSettings = ref({
  email: {
    enabled: true,
    smtp: {
      host: "",
      port: 587,
      username: "",
      password: "",
      encryption: "tls",
    },
    notifications: {
      newPatient: true,
      appointmentReminder: true,
      labResults: true,
      systemAlerts: true,
      backupStatus: true,
    },
  },
  sms: {
    enabled: false,
    provider: "twilio",
    apiKey: "",
    apiSecret: "",
    notifications: {
      appointmentReminder: true,
      emergencyAlerts: true,
      criticalResults: true,
    },
  },
  push: {
    enabled: true,
    notifications: {
      newAppointments: true,
      systemAlerts: true,
      chatMessages: true,
    },
  },
});

// Appearance Settings
const appearanceSettings = ref({
  theme: "light",
  primaryColor: "#4565AD",
  secondaryColor: "#4BBECF",
  darkMode: false,
  sidebarCollapsed: false,
  compactMode: false,
  language: "en",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  currency: "INR",
  currencySymbol: "₹",
});

// System Settings
const systemSettings = ref({
  maintenance: {
    enabled: false,
    message: "System maintenance in progress. Please try again later.",
    allowedIPs: [],
  },
  database: {
    host: "localhost",
    port: 5432,
    name: "hospital_db",
    backupFrequency: "daily",
    maxConnections: 100,
  },
  performance: {
    cacheEnabled: true,
    cacheTimeout: 3600,
    compressionEnabled: true,
    maxUploadSize: 10, // MB
  },
  logging: {
    level: "info",
    maxFileSize: 100, // MB
    maxFiles: 10,
  },
});

// Integration Settings
const integrationSettings = ref({
  apiKeys: [
    {
      id: 1,
      name: "Lab System API",
      key: "lab_api_***",
      status: "active",
      lastUsed: "2025-10-13",
    },
    {
      id: 2,
      name: "Payment Gateway",
      key: "pay_api_***",
      status: "active",
      lastUsed: "2025-10-12",
    },
    {
      id: 3,
      name: "SMS Provider",
      key: "sms_api_***",
      status: "inactive",
      lastUsed: "2025-10-01",
    },
  ],
  webhooks: [
    {
      id: 1,
      name: "Appointment Created",
      url: "https://example.com/webhook",
      status: "active",
    },
    {
      id: 2,
      name: "Patient Registered",
      url: "https://example.com/webhook2",
      status: "active",
    },
  ],
  thirdPartyIntegrations: {
    googleCalendar: { enabled: false, clientId: "", clientSecret: "" },
    zoom: { enabled: false, apiKey: "", apiSecret: "" },
    stripe: { enabled: true, publishableKey: "", secretKey: "" },
  },
});

// Backup Settings
const backupSettings = ref({
  automatic: {
    enabled: true,
    frequency: "daily",
    time: "02:00",
    retention: 30, // days
  },
  storage: {
    location: "local",
    cloudProvider: "aws",
    cloudCredentials: {
      accessKey: "",
      secretKey: "",
      bucket: "",
    },
  },
  lastBackup: "2025-10-13T02:00:00Z",
  backupSize: "2.4 GB",
  status: "completed",
});

// Load initial data
onMounted(async () => {
  await Promise.all([
    loadGeneralSettings(),
    loadUsers(),
    loadSecuritySettings(),
    loadNotificationSettings(),
    loadAppearanceSettings(),
    loadSystemSettings(),
    loadIntegrationSettings(),
    loadBackupSettings(),
  ]);
});

// API Methods
const loadGeneralSettings = async () => {
  try {
    // const response = await $fetch('/api/settings/general')
    // generalSettings.value = response

    // Mock data
    generalSettings.value = {
      hospitalName: "City General Hospital",
      hospitalAddress: "123 Medical Center Drive, Chennai, Tamil Nadu 600001",
      hospitalPhone: "+91 44 1234 5678",
      hospitalEmail: "info@citygeneralhospital.com",
      hospitalWebsite: "https://citygeneralhospital.com",
      hospitalLicense: "MED-TN-2023-001234",
      businessHours: {
        monday: { open: "08:00", close: "18:00", closed: false },
        tuesday: { open: "08:00", close: "18:00", closed: false },
        wednesday: { open: "08:00", close: "18:00", closed: false },
        thursday: { open: "08:00", close: "18:00", closed: false },
        friday: { open: "08:00", close: "18:00", closed: false },
        saturday: { open: "08:00", close: "14:00", closed: false },
        sunday: { open: "10:00", close: "16:00", closed: true },
      },
      timezone: "Asia/Kolkata",
      language: "en",
      currency: "INR",
    };
  } catch (error) {
    showNotification("Error loading general settings", "error");
  }
};

const loadUsers = async () => {
  try {
    // const response = await $fetch('/api/users')
    // users.value = response

    // Mock data
    users.value = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@hospital.com",
        phone: "+91 98765 43210",
        role: "admin",
        department: "Administration",
        status: "active",
        lastLogin: "2025-10-13T09:30:00Z",
      },
      {
        id: 2,
        firstName: "Dr. Sarah",
        lastName: "Wilson",
        email: "sarah.wilson@hospital.com",
        phone: "+91 98765 43211",
        role: "doctor",
        department: "General Medicine",
        status: "active",
        lastLogin: "2025-10-13T08:45:00Z",
      },
      {
        id: 3,
        firstName: "Nurse Mary",
        lastName: "Johnson",
        email: "mary.johnson@hospital.com",
        phone: "+91 98765 43212",
        role: "nurse",
        department: "General Medicine",
        status: "active",
        lastLogin: "2025-10-12T16:20:00Z",
      },
      {
        id: 4,
        firstName: "Lisa",
        lastName: "Chen",
        email: "lisa.chen@hospital.com",
        phone: "+91 98765 43213",
        role: "receptionist",
        department: "Administration",
        status: "inactive",
        lastLogin: "2025-10-10T14:15:00Z",
      },
    ];
  } catch (error) {
    showNotification("Error loading users", "error");
  }
};

const loadSecuritySettings = async () => {
  try {
    // API call would go here
    // Mock data loaded from ref initialization
  } catch (error) {
    showNotification("Error loading security settings", "error");
  }
};

const loadNotificationSettings = async () => {
  try {
    // API call would go here
    // Mock data loaded from ref initialization
  } catch (error) {
    showNotification("Error loading notification settings", "error");
  }
};

const loadAppearanceSettings = async () => {
  try {
    // API call would go here
    // Mock data loaded from ref initialization
  } catch (error) {
    showNotification("Error loading appearance settings", "error");
  }
};

const loadSystemSettings = async () => {
  try {
    // API call would go here
    // Mock data loaded from ref initialization
  } catch (error) {
    showNotification("Error loading system settings", "error");
  }
};

const loadIntegrationSettings = async () => {
  try {
    // API call would go here
    // Mock data loaded from ref initialization
  } catch (error) {
    showNotification("Error loading integration settings", "error");
  }
};

const loadBackupSettings = async () => {
  try {
    // API call would go here
    // Mock data loaded from ref initialization
  } catch (error) {
    showNotification("Error loading backup settings", "error");
  }
};

// Save Methods
const saveGeneralSettings = async () => {
  isSaving.value = true;
  try {
    // await $fetch('/api/settings/general', {
    //   method: 'PUT',
    //   body: generalSettings.value
    // })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showNotification("General settings saved successfully", "success");
  } catch (error) {
    showNotification("Error saving general settings", "error");
  } finally {
    isSaving.value = false;
  }
};

const saveSecuritySettings = async () => {
  isSaving.value = true;
  try {
    // await $fetch('/api/settings/security', {
    //   method: 'PUT',
    //   body: securitySettings.value
    // })

    await new Promise((resolve) => setTimeout(resolve, 1000));
    showNotification("Security settings saved successfully", "success");
  } catch (error) {
    showNotification("Error saving security settings", "error");
  } finally {
    isSaving.value = false;
  }
};

const saveNotificationSettings = async () => {
  isSaving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showNotification("Notification settings saved successfully", "success");
  } catch (error) {
    showNotification("Error saving notification settings", "error");
  } finally {
    isSaving.value = false;
  }
};

const saveAppearanceSettings = async () => {
  isSaving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showNotification("Appearance settings saved successfully", "success");
  } catch (error) {
    showNotification("Error saving appearance settings", "error");
  } finally {
    isSaving.value = false;
  }
};

const saveSystemSettings = async () => {
  isSaving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showNotification("System settings saved successfully", "success");
  } catch (error) {
    showNotification("Error saving system settings", "error");
  } finally {
    isSaving.value = false;
  }
};

const saveIntegrationSettings = async () => {
  isSaving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showNotification("Integration settings saved successfully", "success");
  } catch (error) {
    showNotification("Error saving integration settings", "error");
  } finally {
    isSaving.value = false;
  }
};

const saveBackupSettings = async () => {
  isSaving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showNotification("Backup settings saved successfully", "success");
  } catch (error) {
    showNotification("Error saving backup settings", "error");
  } finally {
    isSaving.value = false;
  }
};

// User Management Methods
const openUserModal = (user = null) => {
  if (user) {
    userForm.value = { ...user, permissions: [] };
  } else {
    userForm.value = {
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      status: "active",
      permissions: [],
    };
  }
  showUserModal.value = true;
};

const saveUser = async () => {
  try {
    if (userForm.value.id) {
      // Update user
      // await $fetch(`/api/users/${userForm.value.id}`, {
      //   method: 'PUT',
      //   body: userForm.value
      // })
      const index = users.value.findIndex((u) => u.id === userForm.value.id);
      if (index !== -1) {
        users.value[index] = { ...userForm.value };
      }
      showNotification("User updated successfully", "success");
    } else {
      // Create user
      // const response = await $fetch('/api/users', {
      //   method: 'POST',
      //   body: userForm.value
      // })
      const newUser = { ...userForm.value, id: Date.now() };
      users.value.push(newUser);
      showNotification("User created successfully", "success");
    }
    showUserModal.value = false;
  } catch (error) {
    showNotification("Error saving user", "error");
  }
};

const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteUserModal.value = true;
};

const deleteUser = async () => {
  try {
    // await $fetch(`/api/users/${userToDelete.value.id}`, {
    //   method: 'DELETE'
    // })
    users.value = users.value.filter((u) => u.id !== userToDelete.value.id);
    showNotification("User deleted successfully", "success");
    showDeleteUserModal.value = false;
    userToDelete.value = null;
  } catch (error) {
    showNotification("Error deleting user", "error");
  }
};

// Backup Methods
const createBackup = async () => {
  isLoading.value = true;
  try {
    // await $fetch('/api/backup/create', { method: 'POST' })
    await new Promise((resolve) => setTimeout(resolve, 3000));
    backupSettings.value.lastBackup = new Date().toISOString();
    backupSettings.value.status = "completed";
    showNotification("Backup created successfully", "success");
  } catch (error) {
    showNotification("Error creating backup", "error");
  } finally {
    isLoading.value = false;
  }
};

const restoreBackup = async () => {
  if (
    !confirm(
      "Are you sure you want to restore from backup? This will overwrite current data."
    )
  )
    return;

  isLoading.value = true;
  try {
    // await $fetch('/api/backup/restore', { method: 'POST' })
    await new Promise((resolve) => setTimeout(resolve, 5000));
    showNotification("System restored from backup successfully", "success");
  } catch (error) {
    showNotification("Error restoring backup", "error");
  } finally {
    isLoading.value = false;
  }
};

// Utility Methods
const showNotification = (message, type = "info") => {
  const notification = {
    id: Date.now(),
    message,
    type,
    timestamp: new Date(),
  };
  notifications.value.push(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(
      (n) => n.id !== notification.id
    );
  }, 5000);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDayName = (key) => {
  const days = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };
  return days[key] || key;
};

const getRoleName = (roleValue) => {
  const role = roles.find((r) => r.value === roleValue);
  return role ? role.label : roleValue;
};

const getStatusClass = (status) => {
  return status === "active"
    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>
      <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
        Configure system settings and preferences
      </p>
    </div>

    <!-- Notifications -->
    <div class="fixed top-4 right-4 z-[90] space-y-2">
      <Transition
        v-for="notification in notifications"
        :key="notification.id"
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-x-full"
        leave-to-class="opacity-0 translate-x-full">
        <div
          :class="{
            'bg-green-500': notification.type === 'success',
            'bg-red-500': notification.type === 'error',
            'bg-blue-500': notification.type === 'info',
          }"
          class="px-4 py-3 rounded-lg text-white shadow-lg max-w-sm">
          <p class="text-sm font-medium">{{ notification.message }}</p>
        </div>
      </Transition>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- Sidebar Navigation -->
      <div class="col-span-12 lg:col-span-3">
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <nav class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="{
                'bg-[#4565AD] text-white': activeTab === tab.id,
                'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800':
                  activeTab !== tab.id,
              }"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
              <span>{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-span-12 lg:col-span-9">
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Configure basic hospital information and preferences
                </p>
              </div>
              <button
                @click="saveGeneralSettings"
                :disabled="isSaving"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- Hospital Information -->
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Hospital Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Hospital Name *</label
                    >
                    <input
                      v-model="generalSettings.hospitalName"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >License Number</label
                    >
                    <input
                      v-model="generalSettings.hospitalLicense"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Address</label
                    >
                    <textarea
                      v-model="generalSettings.hospitalAddress"
                      rows="3"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"></textarea>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Phone</label
                    >
                    <input
                      v-model="generalSettings.hospitalPhone"
                      type="tel"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Email</label
                    >
                    <input
                      v-model="generalSettings.hospitalEmail"
                      type="email"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Website</label
                    >
                    <input
                      v-model="generalSettings.hospitalWebsite"
                      type="url"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Timezone</label
                    >
                    <select
                      v-model="generalSettings.timezone"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">
                        America/New_York (EST)
                      </option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Business Hours -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Business Hours
                </h3>
                <div class="space-y-4">
                  <div
                    v-for="(hours, day) in generalSettings.businessHours"
                    :key="day"
                    class="flex items-center gap-4">
                    <div class="w-24">
                      <label
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >{{ getDayName(day) }}</label
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="hours.closed"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <label class="text-sm text-gray-600 dark:text-gray-400"
                        >Closed</label
                      >
                    </div>
                    <div v-if="!hours.closed" class="flex items-center gap-2">
                      <input
                        v-model="hours.open"
                        type="time"
                        class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      <span class="text-gray-500">to</span>
                      <input
                        v-model="hours.close"
                        type="time"
                        class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Management -->
          <div v-if="activeTab === 'users'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  User Management
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
              <button
                @click="openUserModal()"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                Add User
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr
                    class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                    <th class="text-left px-4 py-3 font-semibold">Name</th>
                    <th class="text-left px-4 py-3 font-semibold">Email</th>
                    <th class="text-left px-4 py-3 font-semibold">Role</th>
                    <th class="text-left px-4 py-3 font-semibold">
                      Department
                    </th>
                    <th class="text-left px-4 py-3 font-semibold">Status</th>
                    <th class="text-left px-4 py-3 font-semibold">
                      Last Login
                    </th>
                    <th class="text-left px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr
                    v-for="user in users"
                    :key="user.id"
                    class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <img
                          :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.firstName + ' ' + user.lastName
                          )}&background=d4a574&color=fff`"
                          class="w-8 h-8 rounded-full"
                          alt="" />
                        <span
                          class="font-medium text-gray-900 dark:text-gray-100"
                          >{{ user.firstName }} {{ user.lastName }}</span
                        >
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ user.email }}
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ getRoleName(user.role) }}
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ user.department }}
                    </td>
                    <td class="px-4 py-3">
                      <span
                        :class="getStatusClass(user.status)"
                        class="px-2 py-1 text-xs font-semibold rounded-full">
                        {{ user.status }}
                      </span>
                    </td>
                    <td
                      class="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(user.lastLogin) }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <button
                          @click="openUserModal(user)"
                          class="icon-btn edit-btn"
                          title="Edit User">
                          ✏️
                        </button>
                        <button
                          @click="confirmDeleteUser(user)"
                          class="icon-btn delete-btn"
                          title="Delete User">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Security -->
          <div v-if="activeTab === 'security'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Security Settings
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Configure security policies and authentication
                </p>
              </div>
              <button
                @click="saveSecuritySettings"
                :disabled="isSaving"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- Password Policy -->
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Password Policy
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Minimum Length</label
                    >
                    <input
                      v-model.number="securitySettings.passwordPolicy.minLength"
                      type="number"
                      min="6"
                      max="32"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Expiry (Days)</label
                    >
                    <input
                      v-model.number="
                        securitySettings.passwordPolicy.expiryDays
                      "
                      type="number"
                      min="30"
                      max="365"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                </div>
                <div class="mt-4 space-y-2">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="securitySettings.passwordPolicy.requireUppercase"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Require uppercase letters</span
                    >
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="securitySettings.passwordPolicy.requireLowercase"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Require lowercase letters</span
                    >
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="securitySettings.passwordPolicy.requireNumbers"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Require numbers</span
                    >
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="
                        securitySettings.passwordPolicy.requireSpecialChars
                      "
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Require special characters</span
                    >
                  </label>
                </div>
              </div>

              <!-- Two-Factor Authentication -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Two-Factor Authentication
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="securitySettings.twoFactorAuth.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Enable Two-Factor Authentication</span
                    >
                  </label>
                  <div v-if="securitySettings.twoFactorAuth.enabled">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Method</label
                    >
                    <select
                      v-model="securitySettings.twoFactorAuth.method"
                      class="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                      <option value="app">Authenticator App</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Session Settings -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Session Settings
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Session Timeout (Minutes)</label
                    >
                    <input
                      v-model.number="securitySettings.sessionSettings.timeout"
                      type="number"
                      min="5"
                      max="480"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Max Concurrent Sessions</label
                    >
                    <input
                      v-model.number="
                        securitySettings.sessionSettings.maxConcurrentSessions
                      "
                      type="number"
                      min="1"
                      max="10"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                </div>
                <div class="mt-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="securitySettings.sessionSettings.logoutOnClose"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Logout when browser closes</span
                    >
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div v-if="activeTab === 'notifications'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Notification Settings
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Configure email, SMS, and push notifications
                </p>
              </div>
              <button
                @click="saveNotificationSettings"
                :disabled="isSaving"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- Email Notifications -->
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Email Notifications
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="notificationSettings.email.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Enable Email Notifications</span
                    >
                  </label>

                  <div
                    v-if="notificationSettings.email.enabled"
                    class="pl-6 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >SMTP Host</label
                        >
                        <input
                          v-model="notificationSettings.email.smtp.host"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Port</label
                        >
                        <input
                          v-model.number="notificationSettings.email.smtp.port"
                          type="number"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Username</label
                        >
                        <input
                          v-model="notificationSettings.email.smtp.username"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Password</label
                        >
                        <input
                          v-model="notificationSettings.email.smtp.password"
                          type="password"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                    </div>

                    <div>
                      <h4
                        class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Notification Types
                      </h4>
                      <div class="space-y-2">
                        <label class="flex items-center gap-2">
                          <input
                            v-model="
                              notificationSettings.email.notifications
                                .newPatient
                            "
                            type="checkbox"
                            class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                          <span class="text-sm text-gray-700 dark:text-gray-300"
                            >New Patient Registration</span
                          >
                        </label>
                        <label class="flex items-center gap-2">
                          <input
                            v-model="
                              notificationSettings.email.notifications
                                .appointmentReminder
                            "
                            type="checkbox"
                            class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                          <span class="text-sm text-gray-700 dark:text-gray-300"
                            >Appointment Reminders</span
                          >
                        </label>
                        <label class="flex items-center gap-2">
                          <input
                            v-model="
                              notificationSettings.email.notifications
                                .labResults
                            "
                            type="checkbox"
                            class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                          <span class="text-sm text-gray-700 dark:text-gray-300"
                            >Lab Results Available</span
                          >
                        </label>
                        <label class="flex items-center gap-2">
                          <input
                            v-model="
                              notificationSettings.email.notifications
                                .systemAlerts
                            "
                            type="checkbox"
                            class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                          <span class="text-sm text-gray-700 dark:text-gray-300"
                            >System Alerts</span
                          >
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SMS Notifications -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  SMS Notifications
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="notificationSettings.sms.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Enable SMS Notifications</span
                    >
                  </label>

                  <div
                    v-if="notificationSettings.sms.enabled"
                    class="pl-6 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Provider</label
                        >
                        <select
                          v-model="notificationSettings.sms.provider"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                          <option value="twilio">Twilio</option>
                          <option value="aws-sns">AWS SNS</option>
                          <option value="nexmo">Nexmo</option>
                        </select>
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >API Key</label
                        >
                        <input
                          v-model="notificationSettings.sms.apiKey"
                          type="password"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >API Secret</label
                        >
                        <input
                          v-model="notificationSettings.sms.apiSecret"
                          type="password"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Appearance -->
          <div v-if="activeTab === 'appearance'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Appearance Settings
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Customize the look and feel of your dashboard
                </p>
              </div>
              <button
                @click="saveAppearanceSettings"
                :disabled="isSaving"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- Theme -->
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Theme
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Mode</label
                    >
                    <select
                      v-model="appearanceSettings.theme"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Primary Color</label
                    >
                    <input
                      v-model="appearanceSettings.primaryColor"
                      type="color"
                      class="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Secondary Color</label
                    >
                    <input
                      v-model="appearanceSettings.secondaryColor"
                      type="color"
                      class="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                </div>
              </div>

              <!-- Layout -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Layout
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="appearanceSettings.sidebarCollapsed"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Collapse sidebar by default</span
                    >
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="appearanceSettings.compactMode"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Compact mode</span
                    >
                  </label>
                </div>
              </div>

              <!-- Localization -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Localization
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Language</label
                    >
                    <select
                      v-model="appearanceSettings.language"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="en">English</option>
                      <option value="ta">Tamil</option>
                      <option value="hi">Hindi</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Date Format</label
                    >
                    <select
                      v-model="appearanceSettings.dateFormat"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Time Format</label
                    >
                    <select
                      v-model="appearanceSettings.timeFormat"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Currency</label
                    >
                    <select
                      v-model="appearanceSettings.currency"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System -->
          <div v-if="activeTab === 'system'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  System Settings
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Configure system-level settings and performance
                </p>
              </div>
              <button
                @click="saveSystemSettings"
                :disabled="isSaving"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- Maintenance Mode -->
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Maintenance Mode
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="systemSettings.maintenance.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Enable Maintenance Mode</span
                    >
                  </label>
                  <div v-if="systemSettings.maintenance.enabled">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Maintenance Message</label
                    >
                    <textarea
                      v-model="systemSettings.maintenance.message"
                      rows="3"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"></textarea>
                  </div>
                </div>
              </div>

              <!-- Performance -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Performance
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Cache Timeout (seconds)</label
                    >
                    <input
                      v-model.number="systemSettings.performance.cacheTimeout"
                      type="number"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Max Upload Size (MB)</label
                    >
                    <input
                      v-model.number="systemSettings.performance.maxUploadSize"
                      type="number"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                </div>
                <div class="mt-4 space-y-2">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="systemSettings.performance.cacheEnabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Enable Caching</span
                    >
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                      v-model="systemSettings.performance.compressionEnabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Enable Compression</span
                    >
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Integrations -->
          <div v-if="activeTab === 'integrations'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Integrations
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Manage API keys and third-party integrations
                </p>
              </div>
              <button
                @click="saveIntegrationSettings"
                :disabled="isSaving"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- API Keys -->
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  API Keys
                </h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead>
                      <tr
                        class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                        <th class="text-left px-4 py-3 font-semibold">Name</th>
                        <th class="text-left px-4 py-3 font-semibold">Key</th>
                        <th class="text-left px-4 py-3 font-semibold">
                          Status
                        </th>
                        <th class="text-left px-4 py-3 font-semibold">
                          Last Used
                        </th>
                        <th class="text-left px-4 py-3 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="divide-y divide-gray-200 dark:divide-gray-800">
                      <tr
                        v-for="api in integrationSettings.apiKeys"
                        :key="api.id"
                        class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                        <td
                          class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                          {{ api.name }}
                        </td>
                        <td
                          class="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono">
                          {{ api.key }}
                        </td>
                        <td class="px-4 py-3">
                          <span
                            :class="getStatusClass(api.status)"
                            class="px-2 py-1 text-xs font-semibold rounded-full">
                            {{ api.status }}
                          </span>
                        </td>
                        <td
                          class="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                          {{ api.lastUsed }}
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-2">
                            <button
                              class="icon-btn edit-btn"
                              title="Edit API Key">
                              ✏️
                            </button>
                            <button
                              class="icon-btn delete-btn"
                              title="Delete API Key">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Third-party Integrations -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Third-party Integrations
                </h3>
                <div class="space-y-6">
                  <!-- Google Calendar -->
                  <div
                    class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">📅</span>
                        <div>
                          <h4 class="font-medium text-gray-900 dark:text-white">
                            Google Calendar
                          </h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Sync appointments with Google Calendar
                          </p>
                        </div>
                      </div>
                      <label class="flex items-center gap-2">
                        <input
                          v-model="
                            integrationSettings.thirdPartyIntegrations
                              .googleCalendar.enabled
                          "
                          type="checkbox"
                          class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      </label>
                    </div>
                    <div
                      v-if="
                        integrationSettings.thirdPartyIntegrations
                          .googleCalendar.enabled
                      "
                      class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Client ID</label
                        >
                        <input
                          v-model="
                            integrationSettings.thirdPartyIntegrations
                              .googleCalendar.clientId
                          "
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Client Secret</label
                        >
                        <input
                          v-model="
                            integrationSettings.thirdPartyIntegrations
                              .googleCalendar.clientSecret
                          "
                          type="password"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                    </div>
                  </div>

                  <!-- Stripe -->
                  <div
                    class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">💳</span>
                        <div>
                          <h4 class="font-medium text-gray-900 dark:text-white">
                            Stripe
                          </h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            Process payments through Stripe
                          </p>
                        </div>
                      </div>
                      <label class="flex items-center gap-2">
                        <input
                          v-model="
                            integrationSettings.thirdPartyIntegrations.stripe
                              .enabled
                          "
                          type="checkbox"
                          class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      </label>
                    </div>
                    <div
                      v-if="
                        integrationSettings.thirdPartyIntegrations.stripe
                          .enabled
                      "
                      class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Publishable Key</label
                        >
                        <input
                          v-model="
                            integrationSettings.thirdPartyIntegrations.stripe
                              .publishableKey
                          "
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Secret Key</label
                        >
                        <input
                          v-model="
                            integrationSettings.thirdPartyIntegrations.stripe
                              .secretKey
                          "
                          type="password"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Backup & Data -->
          <div v-if="activeTab === 'backup'" class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Backup & Data Management
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Configure backup settings and data management
                </p>
              </div>
              <div class="flex items-center gap-3">
                <button
                  @click="createBackup"
                  :disabled="isLoading"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                  {{ isLoading ? "Creating..." : "💾 Create Backup" }}
                </button>
                <button
                  @click="saveBackupSettings"
                  :disabled="isSaving"
                  class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                  {{ isSaving ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Backup Status -->
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Backup Status
                </h3>
                <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500 dark:text-gray-400"
                        >Last Backup:</span
                      >
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ formatDate(backupSettings.lastBackup) }}
                      </p>
                    </div>
                    <div>
                      <span class="text-gray-500 dark:text-gray-400"
                        >Backup Size:</span
                      >
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ backupSettings.backupSize }}
                      </p>
                    </div>
                    <div>
                      <span class="text-gray-500 dark:text-gray-400"
                        >Status:</span
                      >
                      <span
                        :class="{
                          'text-green-600 dark:text-green-400':
                            backupSettings.status === 'completed',
                          'text-yellow-600 dark:text-yellow-400':
                            backupSettings.status === 'in_progress',
                          'text-red-600 dark:text-red-400':
                            backupSettings.status === 'failed',
                        }"
                        class="font-medium capitalize"
                        >{{ backupSettings.status }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Automatic Backup -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Automatic Backup
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="backupSettings.automatic.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Enable Automatic Backup</span
                    >
                  </label>

                  <div
                    v-if="backupSettings.automatic.enabled"
                    class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Frequency</label
                      >
                      <select
                        v-model="backupSettings.automatic.frequency"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Time</label
                      >
                      <input
                        v-model="backupSettings.automatic.time"
                        type="time"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Retention (Days)</label
                      >
                      <input
                        v-model.number="backupSettings.automatic.retention"
                        type="number"
                        min="1"
                        max="365"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Storage Location -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Storage Location
                </h3>
                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Storage Type</label
                    >
                    <select
                      v-model="backupSettings.storage.location"
                      class="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="local">Local Storage</option>
                      <option value="cloud">Cloud Storage</option>
                    </select>
                  </div>

                  <div
                    v-if="backupSettings.storage.location === 'cloud'"
                    class="space-y-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >Cloud Provider</label
                      >
                      <select
                        v-model="backupSettings.storage.cloudProvider"
                        class="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                        <option value="aws">Amazon S3</option>
                        <option value="gcp">Google Cloud Storage</option>
                        <option value="azure">Azure Blob Storage</option>
                      </select>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Access Key</label
                        >
                        <input
                          v-model="
                            backupSettings.storage.cloudCredentials.accessKey
                          "
                          type="password"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Secret Key</label
                        >
                        <input
                          v-model="
                            backupSettings.storage.cloudCredentials.secretKey
                          "
                          type="password"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >Bucket Name</label
                        >
                        <input
                          v-model="
                            backupSettings.storage.cloudCredentials.bucket
                          "
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Manual Actions -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Manual Actions
                </h3>
                <div class="flex items-center gap-4">
                  <button
                    @click="restoreBackup"
                    :disabled="isLoading"
                    class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50">
                    {{ isLoading ? "Restoring..." : "🔄 Restore from Backup" }}
                  </button>
                  <button
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    📊 Export Data
                  </button>
                  <button
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    📥 Import Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showUserModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ userForm.id ? "Edit User" : "Add New User" }}
              </h3>
              <button
                @click="showUserModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="saveUser" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >First Name *</label
                >
                <input
                  v-model="userForm.firstName"
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
                  v-model="userForm.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Email *</label
                >
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Phone</label
                >
                <input
                  v-model="userForm.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Role *</label
                >
                <select
                  v-model="userForm.role"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Role</option>
                  <option
                    v-for="role in roles"
                    :key="role.value"
                    :value="role.value">
                    {{ role.label }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Department</label
                >
                <select
                  v-model="userForm.department"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept" :value="dept">
                    {{ dept }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showUserModal = false"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                {{ userForm.id ? "Update User" : "Create User" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete User Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDeleteUserModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Delete User
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete
            <strong
              >{{ userToDelete?.firstName }}
              {{ userToDelete?.lastName }}</strong
            >? This action cannot be undone and will revoke all access
            permissions.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteUserModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="deleteUser"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete User
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
.edit-btn:hover {
  border-color: #f59e0b;
  background: #f59e0b10;
  box-shadow: 0 0 0 3px #f59e0b10;
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

<!-- pages/admin/notifications.vue -->
<script setup lang="ts">
const { $fetch } = useNuxtApp();
const route = useRoute();

// State
const notifications = ref([]);
const filteredNotifications = ref([]);
const activeTab = ref("all");
const selectedNotifications = ref([]);
const showDeleteModal = ref(false);
const showDetailModal = ref(false);
const showCreateModal = ref(false);
const showBulkActionModal = ref(false);
const selectedNotification = ref(null);
const isLoading = ref(false);
const isSaving = ref(false);
const searchQuery = ref("");
const bulkAction = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(15);

// Sorting
const sortBy = ref("timestamp");
const sortOrder = ref("desc");

// New notification form
const newNotification = ref({
  type: "system",
  title: "",
  message: "",
  priority: "normal",
  targetUsers: "all",
  targetRoles: [],
  scheduledFor: null,
  expiresAt: null,
  actionUrl: "",
  metadata: {},
});

// Notification settings
const notificationSettings = ref({
  autoMarkReadAfter: 24, // hours
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  enablePushNotifications: true,
});

// Tabs with counts
const tabs = ref([
  { id: "all", label: "All", icon: "📋", count: 0 },
  { id: "unread", label: "Unread", icon: "🔴", count: 0 },
  { id: "appointments", label: "Appointments", icon: "📅", count: 0 },
  { id: "patients", label: "Patients", icon: "👥", count: 0 },
  { id: "system", label: "System", icon: "⚙️", count: 0 },
  { id: "alerts", label: "Critical Alerts", icon: "⚠️", count: 0 },
  { id: "lab", label: "Lab Results", icon: "🧪", count: 0 },
  { id: "reminder", label: "Reminders", icon: "⏰", count: 0 },
]);

// Notification types with enhanced styling and metadata
const notificationTypes = {
  appointment: {
    icon: "📅",
    label: "Appointment",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  patient: {
    icon: "👤",
    label: "Patient",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800",
  },
  system: {
    icon: "⚙️",
    label: "System",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    textColor: "text-gray-600 dark:text-gray-400",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  alert: {
    icon: "⚠️",
    label: "Alert",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
  },
  lab: {
    icon: "🧪",
    label: "Lab Result",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  reminder: {
    icon: "⏰",
    label: "Reminder",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  billing: {
    icon: "💰",
    label: "Billing",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  security: {
    icon: "🔒",
    label: "Security",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
};

// User roles for targeting
const userRoles = [
  { value: "doctors", label: "Doctors" },
  { value: "nurses", label: "Nurses" },
  { value: "admin", label: "Admin Staff" },
  { value: "lab_technicians", label: "Lab Technicians" },
  { value: "receptionist", label: "Receptionists" },
  { value: "pharmacy", label: "Pharmacy Staff" },
  { value: "billing", label: "Billing Staff" },
];

// Computed properties
const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedNotifications.value.slice(start, end);
});

const sortedNotifications = computed(() => {
  const sorted = [...filteredNotifications.value];
  sorted.sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];

    if (sortBy.value === "timestamp" || sortBy.value === "createdAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  return sorted;
});

const totalPages = computed(() => {
  return Math.ceil(filteredNotifications.value.length / itemsPerPage.value);
});

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const hasSelectedNotifications = computed(() => {
  return selectedNotifications.value.length > 0;
});

const todayNotifications = computed(() => {
  const today = new Date().toDateString();
  return notifications.value.filter(
    (n) => new Date(n.timestamp).toDateString() === today
  ).length;
});

const highPriorityCount = computed(() => {
  return notifications.value.filter(
    (n) => n.priority === "high" || n.priority === "urgent"
  ).length;
});

const expiredNotifications = computed(() => {
  const now = new Date();
  return notifications.value.filter(
    (n) => n.expiresAt && new Date(n.expiresAt) < now
  ).length;
});

// Methods
const loadNotifications = async () => {
  isLoading.value = true;
  try {
    // API call would go here
    // const response = await $fetch('/api/admin/notifications', {
    //   params: {
    //     page: currentPage.value,
    //     limit: itemsPerPage.value,
    //     sortBy: sortBy.value,
    //     sortOrder: sortOrder.value
    //   }
    // })

    // Mock data with comprehensive examples
    await new Promise((resolve) => setTimeout(resolve, 500));
    notifications.value = [
      {
        id: 1,
        type: "appointment",
        title: "New Appointment Scheduled",
        message:
          "Patient John Doe has scheduled an appointment for tomorrow at 10:00 AM. Please confirm the appointment and prepare necessary documents.",
        timestamp: "2025-10-14T09:15:00Z",
        read: false,
        priority: "normal",
        actionUrl: "/appointments/1234",
        createdBy: "System",
        createdById: 0,
        targetUsers: ["Dr. Smith", "Nurse Wilson"],
        targetRoles: ["doctors", "nurses"],
        scheduledFor: "2025-10-14T09:15:00Z",
        expiresAt: "2025-10-20T23:59:59Z",
        metadata: {
          patientId: 1234,
          patientName: "John Doe",
          appointmentTime: "2025-10-15T10:00:00Z",
          department: "General Medicine",
          doctorId: 5678,
          roomNumber: "A-101",
        },
        interactions: {
          views: 12,
          clicks: 3,
        },
      },
      {
        id: 2,
        type: "patient",
        title: "New Patient Registration",
        message:
          "Jane Smith (Age: 28) has completed registration for Cardiology department and is waiting for approval.",
        timestamp: "2025-10-14T08:30:00Z",
        read: false,
        priority: "normal",
        actionUrl: "/patients/5678",
        createdBy: "Registration System",
        createdById: 0,
        targetUsers: ["Admin Staff"],
        targetRoles: ["admin", "receptionist"],
        scheduledFor: "2025-10-14T08:30:00Z",
        expiresAt: null,
        metadata: {
          patientId: 5678,
          patientName: "Jane Smith",
          age: 28,
          department: "Cardiology",
          insuranceVerified: false,
          emergencyContact: "+91 9876543210",
        },
        interactions: {
          views: 8,
          clicks: 2,
        },
      },
      {
        id: 3,
        type: "alert",
        title: "Critical Lab Result",
        message:
          "Patient Robert Johnson has abnormal blood glucose levels (450 mg/dL) requiring immediate medical attention.",
        timestamp: "2025-10-14T08:00:00Z",
        read: false,
        priority: "urgent",
        actionUrl: "/records/9999",
        createdBy: "Lab System",
        createdById: 0,
        targetUsers: ["Dr. Brown", "ICU Staff"],
        targetRoles: ["doctors", "nurses"],
        scheduledFor: "2025-10-14T08:00:00Z",
        expiresAt: "2025-10-15T08:00:00Z",
        metadata: {
          patientId: 9999,
          patientName: "Robert Johnson",
          testType: "Blood Glucose",
          value: "450 mg/dL",
          normalRange: "70-100 mg/dL",
          labTechId: 1111,
          severity: "critical",
        },
        interactions: {
          views: 25,
          clicks: 8,
        },
      },
      {
        id: 4,
        type: "system",
        title: "System Maintenance Complete",
        message:
          "Scheduled system maintenance has been completed successfully. All systems are now operational.",
        timestamp: "2025-10-14T02:00:00Z",
        read: true,
        priority: "low",
        actionUrl: null,
        createdBy: "Admin",
        createdById: 1,
        targetUsers: ["All Staff"],
        targetRoles: ["all"],
        scheduledFor: "2025-10-14T02:00:00Z",
        expiresAt: "2025-10-21T02:00:00Z",
        metadata: {
          maintenanceType: "Scheduled",
          duration: "2 hours",
          affectedSystems: ["Database", "File Storage", "Backup Systems"],
          downtime: "00:00:00",
          performedBy: "IT Team",
        },
        interactions: {
          views: 45,
          clicks: 5,
        },
      },
      {
        id: 5,
        type: "lab",
        title: "Lab Results Available",
        message:
          "Complete Blood Count results for Emily Davis are now available for review in the system.",
        timestamp: "2025-10-13T16:45:00Z",
        read: true,
        priority: "normal",
        actionUrl: "/records/8888",
        createdBy: "Lab System",
        createdById: 0,
        targetUsers: ["Dr. Wilson"],
        targetRoles: ["doctors"],
        scheduledFor: "2025-10-13T16:45:00Z",
        expiresAt: "2025-10-20T16:45:00Z",
        metadata: {
          patientId: 8888,
          patientName: "Emily Davis",
          testType: "Complete Blood Count",
          reportDate: "2025-10-13",
          labTechId: 2222,
          testsCount: 12,
          abnormalResults: 0,
        },
        interactions: {
          views: 15,
          clicks: 7,
        },
      },
      {
        id: 6,
        type: "reminder",
        title: "Appointment Reminder",
        message:
          "Michael Wilson has an appointment with Dr. Sarah Wilson in 30 minutes.",
        timestamp: "2025-10-13T15:30:00Z",
        read: true,
        priority: "normal",
        actionUrl: "/appointments/7777",
        createdBy: "Appointment System",
        createdById: 0,
        targetUsers: ["Dr. Sarah Wilson"],
        targetRoles: ["doctors"],
        scheduledFor: "2025-10-13T15:30:00Z",
        expiresAt: "2025-10-13T16:30:00Z",
        metadata: {
          patientId: 7777,
          patientName: "Michael Wilson",
          appointmentTime: "2025-10-13T16:00:00Z",
          doctorId: 3333,
          doctorName: "Dr. Sarah Wilson",
          appointmentType: "Follow-up",
          roomNumber: "B-205",
        },
        interactions: {
          views: 3,
          clicks: 1,
        },
      },
      {
        id: 7,
        type: "billing",
        title: "Payment Overdue",
        message:
          "Patient Sarah Brown has an overdue payment of ₹5,500 for services rendered on 2025-09-15.",
        timestamp: "2025-10-13T14:20:00Z",
        read: false,
        priority: "high",
        actionUrl: "/billing/6666",
        createdBy: "Billing System",
        createdById: 0,
        targetUsers: ["Billing Staff"],
        targetRoles: ["billing", "admin"],
        scheduledFor: "2025-10-13T14:20:00Z",
        expiresAt: "2025-10-27T23:59:59Z",
        metadata: {
          patientId: 6666,
          patientName: "Sarah Brown",
          invoiceId: "INV-2025-001234",
          amount: 5500,
          currency: "INR",
          dueDate: "2025-10-01",
          daysOverdue: 13,
          serviceDate: "2025-09-15",
        },
        interactions: {
          views: 6,
          clicks: 2,
        },
      },
      {
        id: 8,
        type: "security",
        title: "Multiple Failed Login Attempts",
        message:
          'User account "dr.johnson" has 5 failed login attempts in the last 10 minutes. Account temporarily locked.',
        timestamp: "2025-10-13T12:45:00Z",
        read: false,
        priority: "high",
        actionUrl: "/admin/security/logs",
        createdBy: "Security System",
        createdById: 0,
        targetUsers: ["IT Admin"],
        targetRoles: ["admin"],
        scheduledFor: "2025-10-13T12:45:00Z",
        expiresAt: "2025-10-14T12:45:00Z",
        metadata: {
          username: "dr.johnson",
          userId: 4444,
          failedAttempts: 5,
          lastAttemptIP: "192.168.1.45",
          lockoutDuration: "30 minutes",
          securityLevel: "medium",
        },
        interactions: {
          views: 18,
          clicks: 4,
        },
      },
    ];

    filterNotifications();
    updateTabCounts();
  } catch (error) {
    console.error("Error loading notifications:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterNotifications = () => {
  let filtered = notifications.value;

  // Filter by active tab
  if (activeTab.value === "unread") {
    filtered = filtered.filter((n) => !n.read);
  } else if (activeTab.value !== "all") {
    filtered = filtered.filter((n) => n.type === activeTab.value);
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        n.createdBy.toLowerCase().includes(query) ||
        (n.metadata?.patientName &&
          n.metadata.patientName.toLowerCase().includes(query)) ||
        (n.targetUsers &&
          n.targetUsers.some((user) => user.toLowerCase().includes(query)))
    );
  }

  filteredNotifications.value = filtered;
  currentPage.value = 1;
};

const updateTabCounts = () => {
  tabs.value.forEach((tab) => {
    if (tab.id === "all") {
      tab.count = notifications.value.length;
    } else if (tab.id === "unread") {
      tab.count = notifications.value.filter((n) => !n.read).length;
    } else {
      tab.count = notifications.value.filter((n) => n.type === tab.id).length;
    }
  });
};

const createNotification = async () => {
  isSaving.value = true;
  try {
    // Prepare notification data
    const notificationData = {
      ...newNotification.value,
      id: Date.now(), // In real app, this would come from API
      timestamp: newNotification.value.scheduledFor || new Date().toISOString(),
      read: false,
      createdBy: "Admin",
      createdById: 1,
      targetUsers:
        newNotification.value.targetUsers === "all"
          ? ["All Staff"]
          : newNotification.value.targetRoles.map(
              (role) => userRoles.find((r) => r.value === role)?.label || role
            ),
      interactions: { views: 0, clicks: 0 },
    };

    // API call to create notification
    // const response = await $fetch('/api/admin/notifications', {
    //   method: 'POST',
    //   body: notificationData
    // })

    // Add to local state
    notifications.value.unshift(notificationData);

    // Reset form
    newNotification.value = {
      type: "system",
      title: "",
      message: "",
      priority: "normal",
      targetUsers: "all",
      targetRoles: [],
      scheduledFor: null,
      expiresAt: null,
      actionUrl: "",
      metadata: {},
    };

    showCreateModal.value = false;
    filterNotifications();
    updateTabCounts();
  } catch (error) {
    console.error("Error creating notification:", error);
  } finally {
    isSaving.value = false;
  }
};

const markAsRead = async (notificationIds) => {
  try {
    // API call
    await $fetch("/api/admin/notifications/mark-read", {
      method: "POST",
      body: { ids: notificationIds },
    });

    notifications.value.forEach((n) => {
      if (notificationIds.includes(n.id)) {
        n.read = true;
        n.readAt = new Date().toISOString();
      }
    });

    filterNotifications();
    updateTabCounts();
  } catch (error) {
    console.error("Error marking as read:", error);
  }
};

const markAsUnread = async (notificationIds) => {
  try {
    // API call
    await $fetch("/api/admin/notifications/mark-unread", {
      method: "POST",
      body: { ids: notificationIds },
    });

    notifications.value.forEach((n) => {
      if (notificationIds.includes(n.id)) {
        n.read = false;
        delete n.readAt;
      }
    });

    filterNotifications();
    updateTabCounts();
  } catch (error) {
    console.error("Error marking as unread:", error);
  }
};

const deleteNotifications = async (notificationIds) => {
  try {
    // API call
    await $fetch("/api/admin/notifications/delete", {
      method: "DELETE",
      body: { ids: notificationIds },
    });

    notifications.value = notifications.value.filter(
      (n) => !notificationIds.includes(n.id)
    );
    selectedNotifications.value = [];
    showDeleteModal.value = false;

    filterNotifications();
    updateTabCounts();
  } catch (error) {
    console.error("Error deleting notifications:", error);
  }
};

const archiveNotifications = async (notificationIds) => {
  try {
    // API call
    await $fetch("/api/admin/notifications/archive", {
      method: "POST",
      body: { ids: notificationIds },
    });

    notifications.value.forEach((n) => {
      if (notificationIds.includes(n.id)) {
        n.archived = true;
        n.archivedAt = new Date().toISOString();
      }
    });

    filterNotifications();
    updateTabCounts();
  } catch (error) {
    console.error("Error archiving notifications:", error);
  }
};

const duplicateNotification = (notification) => {
  newNotification.value = {
    type: notification.type,
    title: `Copy of ${notification.title}`,
    message: notification.message,
    priority: notification.priority,
    targetUsers: "all",
    targetRoles: notification.targetRoles || [],
    scheduledFor: null,
    expiresAt: notification.expiresAt,
    actionUrl: notification.actionUrl,
    metadata: { ...notification.metadata },
  };
  showCreateModal.value = true;
};

const exportNotifications = async (format = "csv") => {
  try {
    const response = await $fetch(`/api/admin/notifications/export`, {
      method: "POST",
      body: {
        format,
        filters: {
          type: activeTab.value,
          search: searchQuery.value,
          dateRange: {
            start: null,
            end: null,
          },
        },
      },
    });

    // Download file logic would go here
    console.log("Export successful:", response);
  } catch (error) {
    console.error("Error exporting notifications:", error);
  }
};

const executeBulkAction = async () => {
  if (!bulkAction.value || selectedNotifications.value.length === 0) return;

  try {
    switch (bulkAction.value) {
      case "mark_read":
        await markAsRead(selectedNotifications.value);
        break;
      case "mark_unread":
        await markAsUnread(selectedNotifications.value);
        break;
      case "delete":
        await deleteNotifications(selectedNotifications.value);
        break;
      case "archive":
        await archiveNotifications(selectedNotifications.value);
        break;
    }

    bulkAction.value = "";
    showBulkActionModal.value = false;
  } catch (error) {
    console.error("Error executing bulk action:", error);
  }
};

const markAllAsRead = async () => {
  const unreadIds = notifications.value.filter((n) => !n.read).map((n) => n.id);
  if (unreadIds.length > 0) {
    await markAsRead(unreadIds);
  }
};

const openNotification = async (notification) => {
  // Track view
  notification.interactions.views += 1;

  if (!notification.read) {
    await markAsRead([notification.id]);
  }

  if (notification.actionUrl) {
    // Track click
    notification.interactions.clicks += 1;
    navigateTo(notification.actionUrl);
  } else {
    selectedNotification.value = notification;
    showDetailModal.value = true;
  }
};

const selectAllNotifications = () => {
  if (
    selectedNotifications.value.length === paginatedNotifications.value.length
  ) {
    selectedNotifications.value = [];
  } else {
    selectedNotifications.value = paginatedNotifications.value.map((n) => n.id);
  }
};

const changePage = (page) => {
  currentPage.value = page;
  selectedNotifications.value = [];
};

const changeItemsPerPage = (items) => {
  itemsPerPage.value = items;
  currentPage.value = 1;
};

const sortNotifications = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "desc";
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 24) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

const getNotificationStyle = (type) => {
  return notificationTypes[type] || notificationTypes.system;
};

const getPriorityColor = (priority) => {
  const colors = {
    urgent:
      "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
    high: "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    normal:
      "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    low: "text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800",
  };
  return colors[priority] || colors.normal;
};

const getPriorityIcon = (priority) => {
  const icons = {
    urgent: "🚨",
    high: "⚠️",
    normal: "ℹ️",
    low: "📝",
  };
  return icons[priority] || icons.normal;
};

const isExpired = (notification) => {
  return (
    notification.expiresAt && new Date(notification.expiresAt) < new Date()
  );
};

const isScheduled = (notification) => {
  return (
    notification.scheduledFor &&
    new Date(notification.scheduledFor) > new Date()
  );
};

// Watch for tab changes
watch(activeTab, () => {
  filterNotifications();
});

watch(searchQuery, () => {
  filterNotifications();
});

// Load notifications on mount
onMounted(async () => {
  await loadNotifications();

  // Check if there's a specific notification to show
  if (route.query.id) {
    const notification = notifications.value.find(
      (n) => n.id === parseInt(route.query.id)
    );
    if (notification) {
      selectedNotification.value = notification;
      showDetailModal.value = true;
    }
  }
});

// Auto-refresh notifications every 30 seconds
let refreshInterval = null;
onMounted(() => {
  refreshInterval = setInterval(loadNotifications, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Admin Notifications
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage system notifications and alerts • Last updated:
          {{ formatTimestamp(new Date()) }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Export dropdown -->
        <div class="relative">
          <button
            class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
            📊 Export
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <button
          @click="showCreateModal = true"
          class="px-4 py-2 text-sm bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity flex items-center gap-2">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"></path>
          </svg>
          Create Notification
        </button>

        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Mark All Read ({{ unreadCount }})
        </button>

        <button
          v-if="hasSelectedNotifications"
          @click="showBulkActionModal = true"
          class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Bulk Actions ({{ selectedNotifications.length }})
        </button>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Total</p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ notifications.length }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">📋</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Unread</p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ unreadCount }}
            </p>
            <p class="text-[11px] text-gray-400 mt-1">
              {{ ((unreadCount / notifications.length) * 100).toFixed(1) }}%
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="text-red-600 dark:text-red-400">🔴</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Today</p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ todayNotifications }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">📅</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              High Priority
            </p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ highPriorityCount }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">⚠️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">Expired</p>
            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ expiredNotifications }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
            <span class="text-gray-600 dark:text-gray-400">⏰</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters and Search -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <!-- Search and Quick Actions -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search notifications by title, message, patient name, or creator..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent text-sm" />
          <svg
            class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div class="flex items-center gap-3">
          <!-- Sort dropdown -->
          <select
            v-model="sortBy"
            @change="filterNotifications"
            class="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm">
            <option value="timestamp">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="priority">Sort by Priority</option>
            <option value="type">Sort by Type</option>
            <option value="createdBy">Sort by Creator</option>
          </select>

          <!-- Items per page -->
          <select
            v-model="itemsPerPage"
            @change="changeItemsPerPage"
            class="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm">
            <option value="10">10 per page</option>
            <option value="15">15 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>

          <button
            v-if="hasSelectedNotifications"
            @click="markAsRead(selectedNotifications)"
            class="px-3 py-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ✓ Mark Read
          </button>
        </div>
      </div>

      <!-- Enhanced Tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border',
            activeTab === tab.id
              ? 'bg-[#4565AD] text-white border-[#4565AD]'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600',
          ]">
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count > 0"
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300',
            ]">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Enhanced Notifications List -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <!-- Enhanced Table Header -->
      <div class="px-6 py-4 border-b border-slate-700/60 bg-slate-800/80">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <input
              type="checkbox"
              :checked="
                selectedNotifications.length ===
                  paginatedNotifications.length &&
                paginatedNotifications.length > 0
              "
              @change="selectAllNotifications"
              class="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500" />
            <h2
              class="text-base font-semibold dark:text-white flex items-center gap-2">
              <span>Notifications</span>
              <span class="text-sm font-normal text-slate-400">
                ({{ filteredNotifications.length }} of
                {{ notifications.length }})
              </span>
            </h2>
          </div>

          <div class="flex items-center gap-4">
            <div
              v-if="hasSelectedNotifications"
              class="text-sm text-slate-400 flex items-center gap-2">
              <span>{{ selectedNotifications.length }} selected</span>
              <button
                @click="selectedNotifications = []"
                class="text-slate-400 hover:text-slate-300">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Refresh button -->
            <button
              @click="loadNotifications"
              :disabled="isLoading"
              class="p-2 text-slate-400 hover:text-slate-300 disabled:opacity-50"
              title="Refresh notifications">
              <svg
                :class="{ 'animate-spin': isLoading }"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div
          class="animate-spin w-8 h-8 border-4 border-[#4565AD] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">Loading notifications...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredNotifications.length === 0"
        class="p-12 text-center">
        <div class="text-6xl mb-4">🔔</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No notifications found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{
            searchQuery
              ? "Try adjusting your search terms or filters"
              : "Create your first notification to get started"
          }}
        </p>
        <button
          v-if="!searchQuery"
          @click="showCreateModal = true"
          class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
          Create Notification
        </button>
      </div>

      <!-- Enhanced Notifications Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr
              class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
              <th class="text-left px-4 py-3 font-semibold w-10">
                <input
                  type="checkbox"
                  :checked="
                    selectedNotifications.length ===
                      paginatedNotifications.length &&
                    paginatedNotifications.length > 0
                  "
                  @change="selectAllNotifications"
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
              </th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortNotifications('type')">
                <div class="flex items-center gap-1">
                  <span>Type</span>
                  <svg
                    v-if="sortBy === 'type'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortNotifications('title')">
                <div class="flex items-center gap-1">
                  <span>Title & Message</span>
                  <svg
                    v-if="sortBy === 'title'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortNotifications('createdBy')">
                <div class="flex items-center gap-1">
                  <span>Created By</span>
                  <svg
                    v-if="sortBy === 'createdBy'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th class="text-left px-4 py-3 font-semibold">Target</th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortNotifications('priority')">
                <div class="flex items-center gap-1">
                  <span>Priority</span>
                  <svg
                    v-if="sortBy === 'priority'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th
                class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                @click="sortNotifications('timestamp')">
                <div class="flex items-center gap-1">
                  <span>Created</span>
                  <svg
                    v-if="sortBy === 'timestamp'"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"></path>
                  </svg>
                </div>
              </th>
              <th class="text-left px-4 py-3 font-semibold">Status</th>
              <th class="text-left px-4 py-3 font-semibold">Engagement</th>
              <th class="text-left px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="notification in paginatedNotifications"
              :key="notification.id"
              :class="[
                'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative',
                !notification.read && 'bg-blue-50/30 dark:bg-blue-900/10',
                isExpired(notification) && 'opacity-60',
                isScheduled(notification) && 'border-l-4 border-yellow-400',
              ]">
              <!-- Selection checkbox -->
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedNotifications.includes(notification.id)"
                  @change="
                    selectedNotifications.includes(notification.id)
                      ? (selectedNotifications = selectedNotifications.filter(
                          (id) => id !== notification.id
                        ))
                      : selectedNotifications.push(notification.id)
                  "
                  class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
              </td>

              <!-- Type with icon -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="getNotificationStyle(notification.type).bgColor"
                    class="w-10 h-10 rounded-lg flex items-center justify-center border">
                    <span class="text-lg">{{
                      getNotificationStyle(notification.type).icon
                    }}</span>
                  </div>
                  <div>
                    <span
                      class="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400 block">
                      {{ getNotificationStyle(notification.type).label }}
                    </span>
                    <span
                      v-if="isScheduled(notification)"
                      class="text-xs text-yellow-600 dark:text-yellow-400">
                      Scheduled
                    </span>
                    <span
                      v-else-if="isExpired(notification)"
                      class="text-xs text-red-600 dark:text-red-400">
                      Expired
                    </span>
                  </div>
                </div>
              </td>

              <!-- Title and Message -->
              <td class="px-4 py-4">
                <div class="max-w-md">
                  <div class="flex items-center gap-2 mb-1">
                    <h3
                      :class="[
                        'font-semibold truncate',
                        !notification.read
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300',
                      ]">
                      {{ notification.title }}
                    </h3>
                    <div
                      v-if="!notification.read"
                      class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  </div>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {{ notification.message }}
                  </p>
                  <div
                    v-if="notification.metadata?.patientName"
                    class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>👤</span>
                    <span>{{ notification.metadata.patientName }}</span>
                    <span v-if="notification.metadata.patientId" class="ml-1"
                      >(ID: {{ notification.metadata.patientId }})</span
                    >
                  </div>
                </div>
              </td>

              <!-- Created By -->
              <td class="px-4 py-4">
                <div class="text-sm">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ notification.createdBy }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatRelativeTime(notification.timestamp) }}
                  </p>
                </div>
              </td>

              <!-- Target Users -->
              <td class="px-4 py-4">
                <div class="text-sm">
                  <p class="text-gray-700 dark:text-gray-300">
                    {{
                      notification.targetUsers.length > 1
                        ? `${notification.targetUsers.length} users`
                        : notification.targetUsers[0]
                    }}
                  </p>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span
                      v-for="role in notification.targetRoles.slice(0, 2)"
                      :key="role"
                      class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {{
                        userRoles.find((r) => r.value === role)?.label || role
                      }}
                    </span>
                    <span
                      v-if="notification.targetRoles.length > 2"
                      class="text-xs text-gray-500 dark:text-gray-400">
                      +{{ notification.targetRoles.length - 2 }} more
                    </span>
                  </div>
                </div>
              </td>

              <!-- Priority -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm">{{
                    getPriorityIcon(notification.priority)
                  }}</span>
                  <span
                    :class="getPriorityColor(notification.priority)"
                    class="px-2 py-1 text-xs font-semibold rounded-full uppercase border">
                    {{ notification.priority }}
                  </span>
                </div>
              </td>

              <!-- Created timestamp -->
              <td class="px-4 py-4">
                <div class="text-sm">
                  <p class="text-gray-900 dark:text-white">
                    {{ formatTimestamp(notification.timestamp) }}
                  </p>
                  <p
                    v-if="notification.expiresAt"
                    class="text-xs text-gray-500 dark:text-gray-400">
                    Expires: {{ formatTimestamp(notification.expiresAt) }}
                  </p>
                </div>
              </td>

              <!-- Status indicators -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    <div
                      :class="
                        notification.read ? 'bg-green-500' : 'bg-blue-500'
                      "
                      class="w-2 h-2 rounded-full"></div>
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                      {{ notification.read ? "Read" : "Unread" }}
                    </span>
                  </div>
                  <div
                    v-if="notification.archived"
                    class="flex items-center gap-1">
                    <span class="text-xs text-yellow-600 dark:text-yellow-400"
                      >📁 Archived</span
                    >
                  </div>
                </div>
              </td>

              <!-- Engagement metrics -->
              <td class="px-4 py-4">
                <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div class="flex items-center gap-1">
                    <span>👁️</span>
                    <span>{{ notification.interactions.views }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>👆</span>
                    <span>{{ notification.interactions.clicks }}</span>
                  </div>
                </div>
              </td>

              <!-- Action buttons -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="openNotification(notification)"
                    class="icon-btn view-btn"
                    title="View Details">
                    👁️
                  </button>

                  <button
                    v-if="!notification.read"
                    @click="markAsRead([notification.id])"
                    class="icon-btn read-btn"
                    title="Mark as Read">
                    ✓
                  </button>

                  <button
                    v-else
                    @click="markAsUnread([notification.id])"
                    class="icon-btn unread-btn"
                    title="Mark as Unread">
                    ✉️
                  </button>

                  <button
                    @click="duplicateNotification(notification)"
                    class="icon-btn duplicate-btn"
                    title="Duplicate">
                    📋
                  </button>

                  <button
                    @click="deleteNotifications([notification.id])"
                    class="icon-btn delete-btn"
                    title="Delete">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Enhanced Pagination -->
      <div
        v-if="totalPages > 1"
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(
                  currentPage * itemsPerPage,
                  filteredNotifications.length
                )
              }}
              of {{ filteredNotifications.length }} notifications
            </p>

            <!-- Page size selector -->
            <select
              v-model="itemsPerPage"
              @change="changeItemsPerPage"
              class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >per page</span
            >
          </div>

          <div class="flex items-center gap-2">
            <!-- First page -->
            <button
              @click="changePage(1)"
              :disabled="currentPage === 1"
              class="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              ⏮️
            </button>

            <!-- Previous page -->
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              Previous
            </button>

            <!-- Page numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="page in Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => {
                    const start = Math.max(
                      1,
                      Math.min(currentPage - 2, totalPages - 4)
                    );
                    return start + i;
                  }
                )"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg',
                  currentPage === page
                    ? 'bg-[#4565AD] text-white border-[#4565AD]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                ]">
                {{ page }}
              </button>
            </div>

            <!-- Next page -->
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              Next
            </button>

            <!-- Last page -->
            <button
              @click="changePage(totalPages)"
              :disabled="currentPage === totalPages"
              class="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              ⏭️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Create Notification Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Notification
              </h3>
              <button
                @click="showCreateModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <form @submit.prevent="createNotification" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Type *</label
                    >
                    <select
                      v-model="newNotification.type"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option
                        v-for="(type, key) in notificationTypes"
                        :key="key"
                        :value="key">
                        {{ type.icon }} {{ type.label }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Priority *</label
                    >
                    <select
                      v-model="newNotification.priority"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="low">🔵 Low Priority</option>
                      <option value="normal">ℹ️ Normal Priority</option>
                      <option value="high">⚠️ High Priority</option>
                      <option value="urgent">🚨 Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Title *</label
                  >
                  <input
                    v-model="newNotification.title"
                    type="text"
                    required
                    maxlength="100"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Enter notification title" />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ newNotification.title.length }}/100 characters
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Message *</label
                  >
                  <textarea
                    v-model="newNotification.message"
                    required
                    rows="6"
                    maxlength="500"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] resize-none"
                    placeholder="Enter detailed notification message">
                  </textarea>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ newNotification.message.length }}/500 characters
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Action URL (Optional)</label
                  >
                  <input
                    v-model="newNotification.actionUrl"
                    type="url"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="https://example.com/action" />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Link users will be redirected to when they click the
                    notification
                  </p>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                    >Target Users *</label
                  >
                  <div class="space-y-3">
                    <label class="flex items-center gap-2">
                      <input
                        v-model="newNotification.targetUsers"
                        type="radio"
                        value="all"
                        class="rounded-full border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-sm text-gray-700 dark:text-gray-300"
                        >All Staff Members</span
                      >
                    </label>
                    <label class="flex items-center gap-2">
                      <input
                        v-model="newNotification.targetUsers"
                        type="radio"
                        value="roles"
                        class="rounded-full border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-sm text-gray-700 dark:text-gray-300"
                        >Specific Roles</span
                      >
                    </label>
                  </div>

                  <div
                    v-if="newNotification.targetUsers === 'roles'"
                    class="mt-4 space-y-2">
                    <label
                      v-for="role in userRoles"
                      :key="role.value"
                      class="flex items-center gap-2">
                      <input
                        v-model="newNotification.targetRoles"
                        type="checkbox"
                        :value="role.value"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{
                        role.label
                      }}</span>
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Schedule For (Optional)</label
                    >
                    <input
                      v-model="newNotification.scheduledFor"
                      type="datetime-local"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >Expires At (Optional)</label
                    >
                    <input
                      v-model="newNotification.expiresAt"
                      type="datetime-local"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                  </div>
                </div>

                <!-- Preview Section -->
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4
                    class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Preview
                  </h4>
                  <div
                    class="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div
                      :class="
                        getNotificationStyle(newNotification.type).bgColor
                      "
                      class="w-8 h-8 rounded-full flex items-center justify-center">
                      <span class="text-sm">{{
                        getNotificationStyle(newNotification.type).icon
                      }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h5
                        class="font-semibold text-gray-900 dark:text-white text-sm">
                        {{ newNotification.title || "Notification Title" }}
                      </h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{
                          newNotification.message ||
                          "Notification message will appear here..."
                        }}
                      </p>
                      <div class="flex items-center gap-2 mt-2">
                        <span
                          :class="getPriorityColor(newNotification.priority)"
                          class="px-2 py-0.5 text-xs font-semibold rounded-full uppercase">
                          {{ newNotification.priority }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{
                            newNotification.targetUsers === "all"
                              ? "All Staff"
                              : `${newNotification.targetRoles.length} role(s)`
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-3 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2">
                <svg
                  v-if="isSaving"
                  class="animate-spin w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ isSaving ? "Creating..." : "Create Notification" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Bulk Action Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showBulkActionModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bulk Actions
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Select an action to apply to
            {{ selectedNotifications.length }} selected notification(s):
          </p>

          <div class="space-y-2 mb-6">
            <label class="flex items-center gap-2">
              <input
                v-model="bulkAction"
                type="radio"
                value="mark_read"
                class="rounded-full" />
              <span class="text-sm">Mark as Read</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="bulkAction"
                type="radio"
                value="mark_unread"
                class="rounded-full" />
              <span class="text-sm">Mark as Unread</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="bulkAction"
                type="radio"
                value="archive"
                class="rounded-full" />
              <span class="text-sm">Archive</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="bulkAction"
                type="radio"
                value="delete"
                class="rounded-full" />
              <span class="text-sm text-red-600">Delete</span>
            </label>
          </div>

          <div class="flex justify-end gap-3">
            <button
              @click="
                showBulkActionModal = false;
                bulkAction = '';
              "
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Cancel
            </button>
            <button
              @click="executeBulkAction"
              :disabled="!bulkAction"
              :class="[
                'px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50',
                bulkAction === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#4565AD] hover:opacity-95',
              ]">
              Execute Action
            </button>
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
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Notifications
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete
            {{ selectedNotifications.length }} notification(s)? This action
            cannot be undone and will permanently remove the notifications from
            the system.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="deleteNotifications(selectedNotifications)"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete Notifications
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Enhanced Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedNotification"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <div
                  :class="
                    getNotificationStyle(selectedNotification.type).bgColor
                  "
                  class="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 border">
                  <span class="text-2xl">{{
                    getNotificationStyle(selectedNotification.type).icon
                  }}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3
                      class="text-xl font-semibold text-gray-900 dark:text-white">
                      {{ selectedNotification.title }}
                    </h3>
                    <span
                      :class="getPriorityColor(selectedNotification.priority)"
                      class="px-2 py-1 text-xs font-semibold rounded-full uppercase">
                      {{ selectedNotification.priority }}
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span
                      >📅
                      {{
                        formatTimestamp(selectedNotification.timestamp)
                      }}</span
                    >
                    <span>👤 {{ selectedNotification.createdBy }}</span>
                    <span
                      >🎯
                      {{ selectedNotification.targetUsers.length }}
                      recipient(s)</span
                    >
                  </div>
                </div>
              </div>
              <button
                @click="showDetailModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Main Content -->
              <div class="lg:col-span-2 space-y-6">
                <div>
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Message
                  </h4>
                  <div class="prose dark:prose-invert max-w-none">
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {{ selectedNotification.message }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="selectedNotification.actionUrl"
                  class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Action Required
                  </h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    This notification has an associated action.
                  </p>
                  <a
                    :href="selectedNotification.actionUrl"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Open Action
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>

                <div
                  v-if="
                    selectedNotification.metadata &&
                    Object.keys(selectedNotification.metadata).length > 0
                  "
                  class="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Additional Details
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      v-for="(value, key) in selectedNotification.metadata"
                      :key="key"
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <dt
                        class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {{ key.replace(/([A-Z])/g, " $1").trim() }}
                      </dt>
                      <dd
                        class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {{ Array.isArray(value) ? value.join(", ") : value }}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sidebar -->
              <div class="space-y-6">
                <!-- Status & Actions -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Status & Actions
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Status</span
                      >
                      <span
                        :class="
                          selectedNotification.read
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-blue-600 dark:text-blue-400'
                        "
                        class="text-sm font-medium">
                        {{ selectedNotification.read ? "✓ Read" : "● Unread" }}
                      </span>
                    </div>

                    <div
                      v-if="selectedNotification.readAt"
                      class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Read At</span
                      >
                      <span class="text-sm text-gray-900 dark:text-white">{{
                        formatTimestamp(selectedNotification.readAt)
                      }}</span>
                    </div>

                    <div
                      v-if="selectedNotification.expiresAt"
                      class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Expires</span
                      >
                      <span
                        :class="
                          isExpired(selectedNotification)
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-900 dark:text-white'
                        "
                        class="text-sm font-medium">
                        {{ formatTimestamp(selectedNotification.expiresAt) }}
                      </span>
                    </div>

                    <div
                      class="pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
                      <button
                        v-if="!selectedNotification.read"
                        @click="
                          markAsRead([selectedNotification.id]);
                          showDetailModal = false;
                        "
                        class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Mark as Read
                      </button>
                      <button
                        v-else
                        @click="
                          markAsUnread([selectedNotification.id]);
                          showDetailModal = false;
                        "
                        class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Mark as Unread
                      </button>

                      <button
                        @click="
                          duplicateNotification(selectedNotification);
                          showDetailModal = false;
                        "
                        class="w-full px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 text-sm">
                        Duplicate Notification
                      </button>

                      <button
                        @click="
                          deleteNotifications([selectedNotification.id]);
                          showDetailModal = false;
                        "
                        class="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Delete Notification
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Recipients -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Recipients
                  </h4>
                  <div class="space-y-2">
                    <div class="text-sm">
                      <span class="text-gray-600 dark:text-gray-400"
                        >Target Users:</span
                      >
                      <span class="ml-1 text-gray-900 dark:text-white">{{
                        selectedNotification.targetUsers.join(", ")
                      }}</span>
                    </div>
                    <div
                      v-if="selectedNotification.targetRoles?.length"
                      class="text-sm">
                      <span class="text-gray-600 dark:text-gray-400"
                        >Roles:</span
                      >
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="role in selectedNotification.targetRoles"
                          :key="role"
                          class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                          {{
                            userRoles.find((r) => r.value === role)?.label ||
                            role
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Engagement Stats -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Engagement
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-sm">👁️</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                          >Views</span
                        >
                      </div>
                      <span
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                        >{{ selectedNotification.interactions.views }}</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-sm">👆</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                          >Clicks</span
                        >
                      </div>
                      <span
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                        >{{ selectedNotification.interactions.clicks }}</span
                      >
                    </div>
                    <div
                      v-if="selectedNotification.interactions.views > 0"
                      class="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                          >Click Rate</span
                        >
                        <span
                          class="text-sm font-medium text-gray-900 dark:text-white">
                          {{
                            (
                              (selectedNotification.interactions.clicks /
                                selectedNotification.interactions.views) *
                              100
                            ).toFixed(1)
                          }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button
                @click="showDetailModal = false"
                class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Close
              </button>
              <button
                v-if="selectedNotification.actionUrl"
                @click="
                  navigateTo(selectedNotification.actionUrl);
                  showDetailModal = false;
                "
                class="px-6 py-3 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity flex items-center gap-2">
                Open Action
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
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

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-size: 14px;
  transition: all 0.2s;
  background: transparent;
  cursor: pointer;
}
.icon-btn:hover {
  background: #1118271a;
  transform: scale(1.05);
}
.view-btn:hover {
  border-color: #3b82f6;
  background: #3b82f610;
  box-shadow: 0 0 0 2px #3b82f610;
}
.read-btn:hover {
  border-color: #10b981;
  background: #10b98110;
  box-shadow: 0 0 0 2px #10b98110;
}
.unread-btn:hover {
  border-color: #f59e0b;
  background: #f59e0b10;
  box-shadow: 0 0 0 2px #f59e0b10;
}
.duplicate-btn:hover {
  border-color: #8b5cf6;
  background: #8b5cf610;
  box-shadow: 0 0 0 2px #8b5cf610;
}
.delete-btn:hover {
  border-color: #ef4444;
  background: #ef444410;
  box-shadow: 0 0 0 2px #ef444410;
}
:global(.dark) .icon-btn {
  border-color: #374151;
}
:global(.dark) .icon-btn:hover {
  background: #374151;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4565ad;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #c19660;
}

/* Dark mode scrollbar */
:global(.dark) .overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937;
}
</style>

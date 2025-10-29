<!-- components/NotificationDropdown.vue -->
<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl smooth-transition text-gray-700 dark:text-gray-300">
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
        {{ unreadCount > 99 ? "99+" : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div
        v-if="isOpen"
        v-click-outside="close"
        class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
        <!-- Header -->
        <div
          class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Notifications
          </h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Mark all read
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div
            v-if="recentNotifications.length === 0"
            class="px-5 py-8 text-center">
            <div class="text-gray-400 dark:text-gray-500 text-4xl mb-2">🔔</div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </p>
          </div>

          <div
            v-for="notification in recentNotifications"
            :key="notification.id"
            @click="openNotification(notification)"
            class="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 cursor-pointer"
            :class="{
              'bg-blue-50/50 dark:bg-blue-900/10': !notification.read,
            }">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <div
                  :class="getNotificationStyle(notification.type).bgColor"
                  class="w-8 h-8 rounded-full flex items-center justify-center">
                  <span class="text-sm">{{
                    getNotificationStyle(notification.type).icon
                  }}</span>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {{ notification.title }}
                  </h4>
                  <div
                    v-if="!notification.read"
                    class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                </div>
                <p
                  class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {{ formatTime(notification.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <NuxtLink
            to="/admin/notifications"
            @click="close"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </NuxtLink>
          <button
            v-if="recentNotifications.length > 0"
            @click="clearAll"
            class="text-sm font-medium text-red-500 hover:underline">
            Clear All
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { $fetch } = useNuxtApp();

const isOpen = ref(false);
const notifications = ref([]);

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const recentNotifications = computed(() => {
  return notifications.value
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8); // Show only recent 8 notifications in dropdown
});

// Methods
const close = () => {
  isOpen.value = false;
};

const markAllAsRead = async () => {
  try {
    // API call to mark all as read
    await $fetch("/api/admin/notifications/mark-all-read", { method: "POST" });

    // Update local state
    notifications.value.forEach((n) => (n.read = true));
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

const openNotification = async (notification) => {
  try {
    // Mark as read if unread
    if (!notification.read) {
      await $fetch(`/api/admin/notifications/${notification.id}/read`, {
        method: "POST",
      });
      notification.read = true;
    }

    // Close dropdown
    close();

    // Navigate to notification page or related page
    if (notification.actionUrl) {
      await navigateTo(notification.actionUrl);
    } else {
      await navigateTo(`/admin/notifications?id=${notification.id}`);
    }
  } catch (error) {
    console.error("Error opening notification:", error);
  }
};

const clearAll = async () => {
  try {
    // API call to clear notifications
    await $fetch("/api/admin/notifications/clear", { method: "DELETE" });

    // Update local state
    notifications.value = [];
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
};

const getNotificationStyle = (type) => {
  const styles = {
    appointment: { icon: "📅", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    patient: { icon: "👤", bgColor: "bg-green-100 dark:bg-green-900/30" },
    system: { icon: "⚙️", bgColor: "bg-gray-100 dark:bg-gray-900/30" },
    alert: { icon: "⚠️", bgColor: "bg-red-100 dark:bg-red-900/30" },
    lab: { icon: "🧪", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
    reminder: { icon: "⏰", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  };
  return styles[type] || styles.system;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// Load notifications
const loadNotifications = async () => {
  try {
    // API call would go here
    // const response = await $fetch('/api/admin/notifications')
    // notifications.value = response

    // Mock data for demo
    notifications.value = [
      {
        id: 1,
        type: "appointment",
        title: "New Appointment Scheduled",
        message:
          "Patient John Doe has scheduled an appointment for tomorrow at 10:00 AM",
        timestamp: "2025-10-14T09:15:00Z",
        read: false,
        actionUrl: "/appointments/1234",
      },
      {
        id: 2,
        type: "patient",
        title: "New Patient Registration",
        message:
          "Jane Smith has completed registration and is waiting for approval",
        timestamp: "2025-10-14T08:30:00Z",
        read: false,
        actionUrl: "/patients/5678",
      },
      {
        id: 3,
        type: "alert",
        title: "Critical Lab Result",
        message: "Patient Robert Johnson has abnormal blood glucose levels",
        timestamp: "2025-10-14T08:00:00Z",
        read: false,
        actionUrl: "/records/9999",
      },
    ];
  } catch (error) {
    console.error("Error loading notifications:", error);
  }
};

// Load notifications on mount
onMounted(() => {
  loadNotifications();
});

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

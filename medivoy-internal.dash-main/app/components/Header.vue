<template>
  <header
    class="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
    <div class="flex items-center justify-between px-4 md:px-6 h-[73px]">
      <!-- Left: toggles + title -->
      <div class="flex items-center gap-4">
        <!-- Desktop collapse toggle -->
        <button
          @click="$emit('toggleCollapse')"
          class="hidden lg:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition text-gray-700 dark:text-gray-300"
          title="Toggle sidebar collapse"
          aria-label="Toggle sidebar collapse">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Mobile menu toggle -->
        <button
          @click="$emit('toggleMenu')"
          class="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition text-gray-700 dark:text-gray-300"
          title="Open menu"
          aria-label="Open menu">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Dynamic page title -->
        <div>
          <h1
            class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {{ pageTitle }}
          </h1>
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Welcome back, Alison 👋
          </p>
        </div>
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-2 md:gap-3">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition text-gray-700 dark:text-gray-300"
          title="Toggle dark mode"
          aria-label="Toggle dark mode">
          <svg
            v-if="isDark"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>

        <!-- Language -->
        <div class="relative" ref="languageRef">
          <button
            @click.stop="toggleLanguage"
            class="flex items-center justify-center w-6 h-6 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-primary transition"
            aria-haspopup="menu"
            :aria-expanded="showLanguage">
            <img
              :src="currentLanguage.flag"
              :alt="currentLanguage.name"
              class="w-full h-full object-cover" />
          </button>

          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95">
            <div
              v-if="showLanguage"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              role="menu">
              <div class="py-2">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="selectLanguage(lang)"
                  :class="[
                    'flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition',
                    currentLanguage.code === lang.code
                      ? 'bg-primary/10 dark:bg-secondary/10'
                      : '',
                  ]"
                  role="menuitem">
                  <img
                    :src="lang.flag"
                    :alt="lang.name"
                    class="w-6 h-6 rounded object-cover ring-1 ring-gray-200 dark:ring-gray-700" />
                  <span
                    :class="[
                      'font-medium',
                      currentLanguage.code === lang.code
                        ? 'text-primary dark:text-secondary'
                        : 'text-gray-700 dark:text-gray-300',
                    ]">
                    {{ lang.name }}
                  </span>
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Notifications -->
        <div class="relative" ref="notificationRef">
          <button
            @click.stop="toggleNotification"
            class="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition text-gray-700 dark:text-gray-300"
            aria-haspopup="true"
            :aria-expanded="showNotification"
            aria-label="Open notifications">
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
              v-if="hasUnread"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
          </button>

          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95">
            <div
              v-if="showNotification"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              role="dialog"
              aria-label="Notifications">
              <div
                class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  Notification
                </h3>
              </div>

              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700/50 last:border-b-0">
                  <h4
                    class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {{ notification.title }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ notification.message }}
                  </p>
                  <p
                    v-if="notification.time"
                    class="text-xs text-gray-500 mt-1">
                    {{ notification.time }}
                  </p>
                </div>
              </div>

              <div
                class="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <button
                  class="text-sm font-medium text-primary dark:text-secondary hover:underline">
                  View All
                </button>
                <button
                  @click="clearNotifications"
                  class="text-sm font-medium text-red-500 hover:underline">
                  Clear
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Profile -->
        <div class="relative" ref="profileRef">
          <button
            @click.stop="toggleProfile"
            class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition cursor-pointer"
            aria-haspopup="menu"
            :aria-expanded="showProfile"
            aria-label="Open profile">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Alison"
              class="w-9 h-9 rounded-full ring-2 ring-primary/30" />
            <span
              class="hidden md:block font-semibold text-gray-900 dark:text-white text-sm"
              >Alison</span
            >
            <svg
              class="hidden md:block w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
              :class="showProfile ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95">
            <div
              v-if="showProfile"
              class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              role="menu">
              <div class="py-2">
                <NuxtLink
                  to="/profile"
                  @click="closeProfile"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300"
                  role="menuitem">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="font-medium">My Profile</span>
                </NuxtLink>

                <NuxtLink
                  to="/profile/edit"
                  @click="closeProfile"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300"
                  role="menuitem">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="font-medium">Edit Profile</span>
                </NuxtLink>

                <div
                  class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                <button
                  @click="logout"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-600 dark:text-red-400 w-full"
                  role="menuitem">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span class="font-medium">Log out</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useRoute, useColorMode } from "#imports";

const route = useRoute();

// Dynamic title map
const titleMap: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/patient": "Patients",
  "/doctor": "Doctors",
  "/appointment": "Appointments",
  "/records": "Medical Records",
  "/support": "Support",
  "/settings": "Settings",
  "/analytics": "Analytics",
  "/hospital": "Hospitals Management",
  "/plans": "Plans Management",
  "/integrations": "Integrations",
  "/admin/staff": "Staff & Roles",
  "/admin/audit": "Audit Logs",
  "/admin/api": "API & Webhooks",
  "/admin/localization": "Localization",
  "/admin/notifications": "Notifications",
  "/admin/system": "System Health",
  "/admin/data": "Import/Export",
};

const pageTitle = computed(() => {
  const metaTitle = (route.meta?.pageTitle as string) || "";
  if (metaTitle) return metaTitle;
  const path = route.path;
  const match = Object.keys(titleMap)
    .filter((k) => path === k || path.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0];
  if (match) return titleMap[match];
  const seg = path.split("/").filter(Boolean).pop() || "Home";
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
});

defineProps<{ isCollapsed?: boolean }>();
defineEmits<{ toggleMenu: []; toggleCollapse: [] }>();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const toggleDarkMode = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};

const showLanguage = ref(false);
const languageRef = ref<HTMLElement | null>(null);
const languages = [
  { code: "en", name: "English", flag: "https://flagcdn.com/w40/us.png" },
  { code: "hi", name: "हिंदी", flag: "https://flagcdn.com/w40/in.png" },
  { code: "es", name: "Español", flag: "https://flagcdn.com/w40/es.png" },
  { code: "ar", name: "عربي", flag: "https://flagcdn.com/w40/sa.png" },
  { code: "fr", name: "Français", flag: "https://flagcdn.com/w40/fr.png" },
];
const currentLanguage = ref(languages[0]);
const toggleLanguage = () => {
  showLanguage.value = !showLanguage.value;
  showNotification.value = false;
  showProfile.value = false;
};
const closeLanguage = () => {
  showLanguage.value = false;
};
const selectLanguage = (lang: any) => {
  currentLanguage.value = lang;
  closeLanguage();
};

const showNotification = ref(false);
const notificationRef = ref<HTMLElement | null>(null);
const hasUnread = ref(true);
const notifications = ref([
  {
    id: 1,
    title: "Your order is received",
    message: "Order #1232 is ready to deliver",
    time: "",
  },
  {
    id: 2,
    title: "Account Security",
    message: "Your account password changed 1 hour ago",
    time: "1 hour ago",
  },
]);
const toggleNotification = () => {
  showNotification.value = !showNotification.value;
  showLanguage.value = false;
  showProfile.value = false;
};
const closeNotification = () => {
  showNotification.value = false;
};
const clearNotifications = () => {
  notifications.value = [];
  hasUnread.value = false;
};

const showProfile = ref(false);
const profileRef = ref<HTMLElement | null>(null);
const toggleProfile = () => {
  showProfile.value = !showProfile.value;
  showLanguage.value = false;
  showNotification.value = false;
};
const closeProfile = () => {
  showProfile.value = false;
};
const logout = () => {
  console.log("Logging out...");
  closeProfile();
};

const onDocClick = (e: MouseEvent) => {
  const t = e.target as Node;
  if (showLanguage.value && languageRef.value && !languageRef.value.contains(t))
    closeLanguage();
  if (
    showNotification.value &&
    notificationRef.value &&
    !notificationRef.value.contains(t)
  )
    closeNotification();
  if (showProfile.value && profileRef.value && !profileRef.value.contains(t))
    closeProfile();
};
onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

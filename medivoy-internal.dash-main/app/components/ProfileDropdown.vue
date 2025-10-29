<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl smooth-transition cursor-pointer">
      <div class="relative">
        <img
          :src="mockUser.avatar"
          :alt="mockUser.name"
          class="w-9 h-9 rounded-full ring-2 ring-[#4565AD]/30 object-cover" />
      </div>
      <span
        class="hidden md:block font-semibold text-gray-900 dark:text-white text-sm truncate max-w-[120px]">
        {{ mockUser.firstName }}
      </span>
      <svg
        class="hidden md:block w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
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
        class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
        <!-- Profile Header -->
        <div
          class="px-4 py-4 bg-gradient-to-r from-[#4565AD] to-[#b8935f] text-white">
          <div class="flex items-center gap-3">
            <img
              :src="mockUser.avatar"
              :alt="mockUser.name"
              class="w-12 h-12 rounded-xl border-2 border-white/30 object-cover" />
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold truncate">{{ mockUser.name }}</h3>
              <p class="text-sm opacity-90 truncate">{{ mockUser.title }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span
                  class="bg-white/20 text-white px-2 py-0.5 text-xs font-medium rounded-full">
                  {{ mockUser.role }}
                </span>
                <div class="flex items-center gap-1 text-xs opacity-75">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <!-- View Profile -->
          <NuxtLink
            to="/profile"
            @click="close"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 group">
            <div
              class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <span class="font-medium">My Profile</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                View profile information
              </p>
            </div>
          </NuxtLink>

          <!-- Edit Profile -->
          <NuxtLink
            to="/profile/edit"
            @click="close"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 group">
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <svg
                class="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <span class="font-medium">Edit Profile</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Update your information
              </p>
            </div>
          </NuxtLink>

          <!-- Account Settings -->
          <NuxtLink
            to="/profile/edit"
            @click="close"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 group">
            <div
              class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <svg
                class="w-5 h-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <div>
              <span class="font-medium">Account Settings</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Security & preferences
              </p>
            </div>
          </NuxtLink>

          <!-- Activity & History -->
          <button
            @click="handleActivity"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 group w-full">
            <div
              class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
              <svg
                class="w-5 h-5 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-left">
              <span class="font-medium">Activity History</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                View recent activity
              </p>
            </div>
          </button>

          <!-- Help & Support -->
          <button
            @click="handleHelp"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 group w-full">
            <div
              class="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
              <svg
                class="w-5 h-5 text-teal-600 dark:text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-left">
              <span class="font-medium">Help & Support</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Get help with the platform
              </p>
            </div>
          </button>

          <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 group w-full">
            <div
              class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
              <svg
                v-if="isDark"
                class="w-5 h-5 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div class="text-left">
              <span class="font-medium">{{
                isDark ? "Light Mode" : "Dark Mode"
              }}</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Toggle theme preference
              </p>
            </div>
          </button>

          <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 w-full group disabled:opacity-50">
            <div
              class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <svg
                v-if="!isLoggingOut"
                class="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <svg
                v-else
                class="animate-spin w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div class="text-left">
              <span class="font-medium">{{
                isLoggingOut ? "Signing Out..." : "Log out"
              }}</span>
              <p class="text-xs opacity-75">End your current session</p>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div
          class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Status: All Good</span>
            </div>
            <div class="text-right">
              <p>Last login</p>
              <p class="font-medium">
                {{ formatLastLogin(mockUser.lastLogin) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// Mock user data (replace with real auth later)
const mockUser = {
  name: "Dr. Sarah Mitchell",
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@medivoy.com",
  title: "Chief Medical Officer",
  role: "Super Admin",
  avatar: "https://i.pravatar.cc/150?img=12",
  lastLogin: new Date().toISOString(),
};

// Reactive state
const isOpen = ref(false);
const isLoggingOut = ref(false);
const isDark = ref(false);

// Check current theme on mount
onMounted(() => {
  if (process.client) {
    isDark.value = document.documentElement.classList.contains("dark");
  }
});

// Methods
const close = () => {
  isOpen.value = false;
};

const handleLogout = async () => {
  isLoggingOut.value = true;
  close();

  try {
    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with your actual logout logic when backend is ready
    console.log("User logged out");

    // Navigate to logout page
    await navigateTo("/auth/logout?auto=true");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
  }
};

const handleActivity = () => {
  close();
  navigateTo("/profile");
};

const handleHelp = () => {
  close();
  // Open help - you can customize this
  window.open("mailto:support@medivoy.com?subject=Help Request", "_blank");
};

const toggleTheme = () => {
  close();

  if (process.client) {
    // Toggle dark mode
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      isDark.value = false;
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      isDark.value = true;
    }
  }
};

const formatLastLogin = (date) => {
  if (!date) return "Never";
  const now = new Date();
  const loginDate = new Date(date);
  const diffInHours = Math.floor(
    (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return loginDate.toLocaleDateString();
};

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

// Close dropdown when navigating
watch(
  () => useRoute().fullPath,
  () => {
    close();
  }
);
</script>

<style scoped>
.smooth-transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            View your account information and activity
          </p>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/profile/edit"
            class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
            Edit Profile
          </NuxtLink>
        </div>
      </div>

      <!-- Profile Overview Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 shadow-sm">
        <!-- Cover with Avatar -->
        <div
          class="relative h-40 bg-gradient-to-br from-[#4565AD] via-[#cc2457] to-[#f72a45]">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute -bottom-16 left-8">
            <div class="relative">
              <img
                :src="mockUser.avatar"
                :alt="mockUser.name"
                class="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl" />
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="pt-20 px-8 pb-8">
          <div
            class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="mb-6 lg:mb-0">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ mockUser.name }}
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-3">
                {{ mockUser.title }}
              </p>
              <div
                class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                  {{ mockUser.department }}
                </span>
                <span class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {{ mockUser.email }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span
                class="px-4 py-2 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {{ mockUser.role }}
              </span>
              <span
                class="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Personal Information -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <NuxtLink
                to="/profile/edit"
                class="text-[#4565AD] hover:text-[#b8935f] transition-colors">
                Edit
              </NuxtLink>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >First Name</label
                >
                <p class="text-gray-900 dark:text-white">
                  {{ mockUser.firstName }}
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >Last Name</label
                >
                <p class="text-gray-900 dark:text-white">
                  {{ mockUser.lastName }}
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >Email</label
                >
                <p class="text-gray-900 dark:text-white">
                  {{ mockUser.email }}
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >Phone</label
                >
                <p class="text-gray-900 dark:text-white">
                  {{ mockUser.phone }}
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >Department</label
                >
                <p class="text-gray-900 dark:text-white">
                  {{ mockUser.department }}
                </p>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >Role</label
                >
                <p class="text-gray-900 dark:text-white">{{ mockUser.role }}</p>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h3>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div
                  class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-900 dark:text-white font-medium">
                    Logged in
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div
                  class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-900 dark:text-white font-medium">
                    Profile updated
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Stats -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Profile Complete</span
                >
                <span class="font-medium text-gray-900 dark:text-white"
                  >95%</span
                >
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Days Active</span
                >
                <span class="font-medium text-gray-900 dark:text-white"
                  >142</span
                >
              </div>
            </div>
          </div>

          <!-- Security Status -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
              Security Status
            </h4>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Two-factor enabled</span
                >
              </div>
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Strong password</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "My Profile - Medivoy Healthcare Dashboard",
});

// Mock user data (replace with real data later)
const mockUser = {
  name: "Dr. Sarah Mitchell",
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@medivoy.com",
  phone: "+1-555-0123",
  title: "Chief Medical Officer",
  department: "Administration",
  role: "Super Admin",
  avatar: "https://i.pravatar.cc/200?img=44",
};
</script>

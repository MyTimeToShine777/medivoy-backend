<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md text-center">
      <!-- Logo -->
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
        <svg
          class="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      </div>

      <!-- Logout Card -->
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <div
            class="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Signing you out...
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Please wait while we securely end your session
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="logoutComplete" class="space-y-6">
          <div
            class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <svg
              class="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Successfully Signed Out
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              You have been securely logged out of your Medivoy account
            </p>
          </div>

          <div class="space-y-4">
            <NuxtLink
              to="/auth/login"
              class="block w-full py-3 px-4 bg-gradient-to-r from-[#4565AD] to-[#b8935f] text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200">
              Sign In Again
            </NuxtLink>

            <div class="text-sm text-gray-500 dark:text-gray-400">
              <p>Redirecting to login page in {{ countdown }} seconds...</p>
            </div>
          </div>
        </div>

        <!-- Confirmation State -->
        <div v-else class="space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sign Out Confirmation
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Are you sure you want to sign out of your Medivoy dashboard?
            </p>
          </div>

          <div class="flex gap-4">
            <button
              @click="confirmLogout"
              :disabled="isLoading"
              class="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Yes, Sign Out
            </button>
            <button
              @click="cancelLogout"
              :disabled="isLoading"
              class="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

useHead({
  title: "Sign Out - Medivoy Healthcare Dashboard",
});

// State
const isLoading = ref(false);
const logoutComplete = ref(false);
const countdown = ref(5);

// Check for auto-logout
onMounted(() => {
  const route = useRoute();
  if (route.query.auto === "true") {
    confirmLogout();
  }
});

// Methods (placeholder - you'll handle authentication later)
const confirmLogout = async () => {
  isLoading.value = true;

  try {
    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Replace with your actual logout logic
    console.log("User logged out");

    logoutComplete.value = true;
    startCountdown();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoading.value = false;
  }
};

const cancelLogout = () => {
  navigateTo("/");
};

const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(timer);
      navigateTo("/auth/login");
    }
  }, 1000);
};
</script>

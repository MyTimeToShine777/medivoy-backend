<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4565AD] to-[#b8935f] rounded-2xl mb-4 shadow-lg">
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 8.172V5L8 4z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to Medivoy
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Internal Healthcare Dashboard
        </p>
      </div>

      <!-- Login Card -->
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
        <!-- OAuth Buttons -->
        <div class="space-y-3 mb-6">
          <button
            @click="handleOAuthLogin('google')"
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span class="text-gray-700 dark:text-gray-300 font-medium"
              >Continue with Google</span
            >
          </button>

          <button
            @click="handleOAuthLogin('microsoft')"
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#f25022" d="M0 0h11.5v11.5H0z" />
              <path fill="#00a4ef" d="M12.5 0H24v11.5H12.5z" />
              <path fill="#7fba00" d="M0 12.5h11.5V24H0z" />
              <path fill="#ffb900" d="M12.5 12.5H24V24H12.5z" />
            </svg>
            <span class="text-gray-700 dark:text-gray-300 font-medium"
              >Continue with Microsoft</span
            >
          </button>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >Or continue with email</span
            >
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent transition-colors"
              placeholder="Enter your email" />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent transition-colors"
                placeholder="Enter your password" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <svg
                  v-if="!showPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember me and Forgot password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 text-[#4565AD] focus:ring-[#4565AD]" />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400"
                >Remember me</span
              >
            </label>
            <button
              type="button"
              @click="handleForgotPassword"
              class="text-sm text-[#4565AD] hover:text-[#b8935f] transition-colors">
              Forgot password?
            </button>
          </div>

          <!-- Messages -->
          <div
            v-if="message"
            class="p-3 rounded-lg"
            :class="
              message.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
                : 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
            ">
            <p
              class="text-sm"
              :class="
                message.type === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              ">
              {{ message.text }}
            </p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-[#4565AD] to-[#b8935f] text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Internal use only • Authorized personnel</p>
          <p class="mt-1">© 2025 Medivoy Healthcare Network</p>
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
  title: "Sign In - Medivoy Healthcare Dashboard",
});

// State
const form = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const showPassword = ref(false);
const isLoading = ref(false);
const message = ref(null);

// Methods (placeholder - you'll handle authentication later)
const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    message.value = {
      type: "error",
      text: "Please fill in all required fields",
    };
    return;
  }

  isLoading.value = true;
  message.value = null;

  try {
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Replace with your actual authentication logic
    console.log("Login form data:", form.value);

    message.value = {
      type: "success",
      text: "Login successful! Redirecting...",
    };

    // TODO: Handle successful authentication and redirect
    setTimeout(() => {
      navigateTo("/");
    }, 1000);
  } catch (error) {
    message.value = { type: "error", text: "Login failed. Please try again." };
  } finally {
    isLoading.value = false;
  }
};

const handleOAuthLogin = async (provider) => {
  isLoading.value = true;
  message.value = null;

  try {
    // TODO: Replace with your OAuth implementation
    console.log(`${provider} OAuth login`);
    message.value = {
      type: "success",
      text: `${provider} login would be handled here`,
    };
  } catch (error) {
    message.value = { type: "error", text: `${provider} login failed` };
  } finally {
    isLoading.value = false;
  }
};

const handleForgotPassword = () => {
  // TODO: Implement forgot password
  console.log("Forgot password clicked");
  message.value = {
    type: "success",
    text: "Forgot password functionality would be implemented here",
  };
};

// Clear message when form changes
watch([() => form.value.email, () => form.value.password], () => {
  message.value = null;
});
</script>

<style scoped>
.bg-grid-pattern {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>

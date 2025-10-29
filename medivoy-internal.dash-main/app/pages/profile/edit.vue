<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/profile"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"></path>
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              Update your account information and preferences
            </p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div
        v-if="message"
        class="mb-6 p-4 rounded-xl"
        :class="
          message.type === 'error'
            ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
            : 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
        ">
        <div class="flex items-center">
          <svg
            v-if="message.type === 'success'"
            class="w-5 h-5 text-green-600 dark:text-green-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"></path>
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-red-600 dark:text-red-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p
            class="font-medium"
            :class="
              message.type === 'error'
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            ">
            {{ message.text }}
          </p>
        </div>
      </div>

      <!-- Edit Form -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <form @submit.prevent="saveChanges" class="space-y-8">
          <!-- Avatar Section -->
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h3>
            <div class="flex items-center gap-6">
              <img
                :src="form.avatar"
                :alt="form.name"
                class="w-20 h-20 rounded-xl border-2 border-gray-200 dark:border-gray-700 object-cover" />
              <div>
                <button
                  type="button"
                  @click="showAvatarModal = true"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Change Avatar
                </button>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG or GIF. Max size 2MB
                </p>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent transition-all"
                  placeholder="Enter first name" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent transition-all"
                  placeholder="Enter last name" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent transition-all"
                  placeholder="Enter email address" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent transition-all"
                  placeholder="Enter phone number" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Professional Title
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent transition-all"
                  placeholder="Enter professional title" />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  v-model="form.department"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] transition-all">
                  <option value="">Select Department</option>
                  <option value="Administration">Administration</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div
            class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <NuxtLink
              to="/profile"
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="px-6 py-3 bg-gradient-to-r from-[#4565AD] to-[#e8234b] text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg
                  class="animate-spin w-4 h-4"
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
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Avatar Selection Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showAvatarModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Choose Avatar
            </h3>
            <button
              @click="showAvatarModal = false"
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

          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="avatar in avatarOptions"
              :key="avatar"
              @click="selectAvatar(avatar)"
              :class="[
                'aspect-square rounded-xl overflow-hidden transition-all',
                form.avatar === avatar
                  ? 'ring-2 ring-[#4565AD]'
                  : 'hover:ring-2 hover:ring-gray-300',
              ]">
              <img
                :src="avatar"
                :alt="'Avatar option'"
                class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
useHead({
  title: "Edit Profile - Medivoy Healthcare Dashboard",
});

// State
const isLoading = ref(false);
const message = ref(null);
const showAvatarModal = ref(false);

// Avatar options
const avatarOptions = [
  "https://i.pravatar.cc/200?img=44",
  "https://i.pravatar.cc/200?img=45",
  "https://i.pravatar.cc/200?img=21",
  "https://i.pravatar.cc/200?img=33",
  "https://i.pravatar.cc/200?img=22",
  "https://i.pravatar.cc/200?img=25",
  "https://i.pravatar.cc/200?img=32",
  "https://i.pravatar.cc/200?img=47",
];

// Form data (initialized with mock data)
const form = ref({
  avatar: "https://i.pravatar.cc/200?img=44",
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@medivoy.com",
  phone: "+1-555-0123",
  title: "Chief Medical Officer",
  department: "Administration",
});

// Computed
const isFormValid = computed(() => {
  return form.value.firstName && form.value.lastName && form.value.email;
});

// Methods (placeholder - you'll handle actual saving later)
const saveChanges = async () => {
  if (!isFormValid.value) {
    message.value = {
      type: "error",
      text: "Please fill in all required fields",
    };
    return;
  }

  isLoading.value = true;
  message.value = null;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with your actual profile update logic
    console.log("Profile update data:", form.value);

    message.value = { type: "success", text: "Profile updated successfully!" };

    // Clear success message after 3 seconds
    setTimeout(() => {
      message.value = null;
    }, 3000);
  } catch (error) {
    message.value = {
      type: "error",
      text: "Failed to update profile. Please try again.",
    };
  } finally {
    isLoading.value = false;
  }
};

const selectAvatar = (avatarUrl) => {
  form.value.avatar = avatarUrl;
  showAvatarModal.value = false;
};

// Clear message when form changes
watch(
  form,
  () => {
    if (message.value) {
      message.value = null;
    }
  },
  { deep: true }
);
</script>

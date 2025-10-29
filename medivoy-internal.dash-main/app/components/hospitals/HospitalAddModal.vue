<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0">
    <div
      class="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Hospital
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create a new hospital record with all necessary details
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hospital Name *
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                    placeholder="Enter hospital name" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hospital Type *
                    </label>
                    <select
                      v-model="form.type"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="">Select Type</option>
                      <option value="Multi-specialty">Multi-specialty</option>
                      <option value="Super-specialty">Super-specialty</option>
                      <option value="Government Medical Institute">
                        Government Medical Institute
                      </option>
                      <option value="Medical College & Hospital">
                        Medical College & Hospital
                      </option>
                      <option value="Multi-super-specialty">
                        Multi-super-specialty
                      </option>
                      <option value="General Hospital">General Hospital</option>
                      <option value="Specialty Hospital">
                        Specialty Hospital
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      v-model="form.status"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    v-model="form.address"
                    required
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent resize-none"
                    placeholder="Enter complete address"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      v-model="form.city"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                      placeholder="Enter city" />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      v-model="form.state"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                      placeholder="Enter state" />
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                      placeholder="+91-11-1234-5678" />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                      placeholder="contact@hospital.com" />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Established Date *
                  </label>
                  <input
                    v-model="form.established"
                    type="text"
                    required
                    pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                    placeholder="DD/MM/YYYY" />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: DD/MM/YYYY
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total Beds *
                    </label>
                    <input
                      v-model.number="form.totalBeds"
                      type="number"
                      min="1"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                      placeholder="0" />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Beds *
                    </label>
                    <input
                      v-model.number="form.availableBeds"
                      type="number"
                      min="0"
                      :max="form.totalBeds || undefined"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                      placeholder="0" />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Cannot exceed total beds
                    </p>
                  </div>
                </div>

                <!-- Departments -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Departments *
                    <span class="text-xs text-gray-500"
                      >(Select at least one)</span
                    >
                  </label>
                  <div
                    class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                    <label
                      v-for="dept in availableDepartments"
                      :key="dept"
                      class="flex items-center gap-2">
                      <input
                        v-model="form.departments"
                        type="checkbox"
                        :value="dept"
                        class="rounded border-gray-300 dark:border-gray-600 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{
                        dept
                      }}</span>
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Selected: {{ form.departments.length }} departments
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-[#4565AD] text-white hover:opacity-95 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2">
                <svg
                  v-if="isSubmitting"
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
                {{ isSubmitting ? "Creating..." : "Create Hospital" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { AddHospitalInput } from "~/composables/useHospitalMock";

defineEmits<{
  close: [];
  saved: [data: AddHospitalInput];
}>();

const isSubmitting = ref(false);

const form = reactive({
  name: "",
  type: "",
  address: "",
  city: "",
  state: "",
  phone: "",
  email: "",
  established: "",
  totalBeds: 0,
  availableBeds: 0,
  departments: [] as string[],
  status: "Active" as const,
});

const availableDepartments = [
  "Cardiology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Gastroenterology",
  "Nephrology",
  "Pulmonology",
  "Endocrinology",
  "Rheumatology",
  "Hematology",
  "Dermatology",
  "Psychiatry",
  "Ophthalmology",
  "ENT",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Surgery",
  "Emergency Medicine",
  "Radiology",
  "Pathology",
  "Anesthesiology",
  "Physical Medicine",
  "Nuclear Medicine",
  "Plastic Surgery",
  "Urology",
  "Cardiothoracic Surgery",
  "Neurosurgery",
  "Medicine",
  "General Medicine",
];

const handleSubmit = async () => {
  if (form.availableBeds > form.totalBeds) {
    alert("Available beds cannot be more than total beds");
    return;
  }

  if (form.departments.length === 0) {
    alert("Please select at least one department");
    return;
  }

  // Validate date format
  const datePattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  if (!datePattern.test(form.established)) {
    alert("Please enter date in DD/MM/YYYY format");
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const emit = defineEmits<{
      close: [];
      saved: [data: AddHospitalInput];
    }>();

    emit("saved", { ...form });
    emit("close");
  } catch (error) {
    console.error("Error creating hospital:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

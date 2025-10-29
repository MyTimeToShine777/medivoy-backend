<!-- components/appointment/AppointmentBookModal.vue -->
<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-book-title"
      @click.self="close">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
        <!-- Header -->
        <div
          class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2
              id="appointment-book-title"
              class="text-xl font-bold text-gray-900 dark:text-white">
              Appointment Book
            </h2>
            <button
              @click="close"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Close dialog"
              type="button">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6">
          <!-- Patient Details -->
          <h3
            class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Patient Details
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- First Name -->
            <div
              class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.firstName"
                type="text"
                placeholder="First Name"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
            </div>

            <!-- Mobile -->
            <div
              class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.mobile"
                type="tel"
                placeholder="Mobile Number"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
            </div>

            <!-- Last Name -->
            <div
              class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Last Name"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
            </div>

            <!-- Email -->
            <div
              class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.email"
                type="email"
                placeholder="Email Address"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
            </div>

            <!-- Address -->
            <div
              class="lg:col-span-2 flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.address"
                type="text"
                placeholder="Address"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
            </div>

            <!-- Gender -->
            <div class="lg:col-span-2">
              <p
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </p>
              <div class="flex items-center gap-6">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <span
                    class="relative inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400">
                    <span
                      v-if="form.gender === 'Male'"
                      class="w-2.5 h-2.5 rounded-full bg-[#4565AD]"></span>
                  </span>
                  <input
                    type="radio"
                    class="hidden"
                    value="Male"
                    v-model="form.gender" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Male</span
                  >
                </label>

                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <span
                    class="relative inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400">
                    <span
                      v-if="form.gender === 'Female'"
                      class="w-2.5 h-2.5 rounded-full bg-[#4565AD]"></span>
                  </span>
                  <input
                    type="radio"
                    class="hidden"
                    value="Female"
                    v-model="form.gender" />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Female</span
                  >
                </label>
              </div>
            </div>
          </div>

          <!-- Appointment Details -->
          <h3
            class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-8 mb-3">
            Appointment Details
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Date -->
            <div
              class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.date"
                type="date"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
            </div>

            <!-- From -->
            <div
              class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.from"
                type="time"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
            </div>

            <!-- To -->
            <div
              class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
              <input
                v-model="form.to"
                type="time"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
            </div>

            <!-- Doctor (themed select) -->
            <div class="relative">
              <select
                v-model="form.doctor"
                class="w-full h-12 px-3 pr-9 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 appearance-none outline-none focus:ring-2 focus:ring-[#4565AD] focus:border-transparent [color-scheme:light] dark:[color-scheme:dark]"
                aria-label="Consulting Doctor">
                <option
                  value=""
                  disabled
                  class="text-gray-500 dark:text-gray-400">
                  Select Doctor
                </option>
                <option
                  v-for="d in doctors"
                  :key="d"
                  :value="d"
                  class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  {{ d }}
                </option>
              </select>

              <!-- Chevron -->
              <svg
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Treatment -->
            <div class="relative lg:col-span-2">
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <input
                  v-model="form.treatment"
                  type="text"
                  placeholder="Treatment detail"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button
              type="button"
              @click="onSubmit"
              class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "submit",
    payload: {
      firstName: string;
      lastName: string;
      address: string;
      mobile: string;
      email: string;
      gender: "Male" | "Female";
      date: string;
      from: string;
      to: string;
      doctor: string;
      treatment: string;
    }
  ): void;
}>();

const doctors = [
  "Bernardo James",
  "Della Reichert",
  "Celia Duesberry",
  "Randene Verrechia",
];

const form = reactive({
  firstName: "",
  lastName: "",
  address: "",
  mobile: "",
  email: "",
  gender: "Male" as "Male" | "Female",
  date: "",
  from: "",
  to: "",
  doctor: "",
  treatment: "",
});

function onSubmit() {
  if (
    !form.firstName ||
    !form.mobile ||
    !form.date ||
    !form.from ||
    !form.to ||
    !form.doctor
  ) {
    alert(
      "Please fill the required fields: First Name, Mobile, Date, From, To, Doctor."
    );
    return;
  }
  emit("submit", { ...form });
}

function close() {
  emit("close");
}
</script>

<style scoped>
select::-ms-expand {
  display: none;
} /* IE/Edge legacy arrow */
select {
  background-clip: padding-box;
}
/* Hint OS popup theme */
select {
  color-scheme: light;
}
:global(.dark) select {
  color-scheme: dark;
}
</style>

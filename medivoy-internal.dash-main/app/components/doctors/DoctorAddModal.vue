<!-- components/doctors/DoctorAddModal.vue -->
<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-add-title"
      @click.self="emit('close')">
      <div
        class="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800 p-4 md:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <h2
            id="doctor-add-title"
            class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Doctor Add
          </h2>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="emit('close')">
            Close
          </button>
        </div>

        <!-- Card -->
        <div
          class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6">
          <p
            class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
            Basic Information
          </p>

          <!-- Form -->
          <form
            @submit.prevent="onSubmit"
            class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Left column -->
            <div class="space-y-4">
              <!-- First Name -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  v-model="form.firstName"
                  type="text"
                  placeholder="First Name"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
              </div>

              <!-- Last Name -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  v-model="form.lastName"
                  type="text"
                  placeholder="Last Name"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
              </div>

              <!-- User Name -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 8a6 6 0 11-12 0 6 6 0 0112 0z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 8v5a2 2 0 004 0V8" />
                </svg>
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="User Name"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
              </div>

              <!-- Education -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l6.16-3.422A12.083 12.083 0 0112 20.055 12.083 12.083 0 015.84 10.578L12 14z" />
                </svg>
                <input
                  v-model="form.education"
                  type="text"
                  placeholder="Education"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
              </div>

              <!-- Department -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v12m6-6H6" />
                </svg>
                <select
                  v-model="form.department"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100">
                  <option value="" disabled>Select Department</option>
                  <option v-for="d in departments" :key="d" :value="d">
                    {{ d }}
                  </option>
                </select>
                <svg
                  class="w-4 h-4 text-gray-400 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- City -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19.428 15.341A8 8 0 104.572 15.34L12 22l7.428-6.659z" />
                </svg>
                <input
                  v-model="form.city"
                  type="text"
                  placeholder="City"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
              </div>

              <!-- State/Province -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 20l-5.447-2.724A2 2 0 012 15.382V5.618A2 2 0 013.553 4.276L9 7m0 13l6-3m0 0V7m0 10l6 3m0-13l-6-3" />
                </svg>
                <input
                  v-model="form.state"
                  type="text"
                  placeholder="State/Province"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              <!-- Address -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 12.414A4 4 0 1112.414 13.414L16.657 17.657M10 20l-6-6 6-6 6 6-6 6z" />
                </svg>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="Address"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>
            </div>

            <!-- Right column -->
            <div class="space-y-4">
              <!-- Mobile -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5h2l3 6 2 2-1 3a11 11 0 005 5l3-1 2-2 6 3v2" />
                </svg>
                <input
                  v-model="form.mobile"
                  type="tel"
                  placeholder="Mobile Number"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              <!-- Email -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email Address"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              <!-- Gender -->
              <div>
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

              <!-- Designation -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v12m6-6H6" />
                </svg>
                <input
                  v-model="form.designation"
                  type="text"
                  placeholder="Designation"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              <!-- Date of Birth -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
                </svg>
                <input
                  v-model="form.dob"
                  type="date"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              <!-- Country -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 3v18M5 3h11l-1.5 4H5" />
                </svg>
                <input
                  v-model="form.country"
                  type="text"
                  placeholder="Country"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              <!-- Postal Code -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 9h14M5 15h14M9 3v18M15 3v18" />
                </svg>
                <input
                  v-model="form.postalCode"
                  type="text"
                  placeholder="Postal Code"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>

              <!-- Short Biography -->
              <div
                class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
                <svg
                  class="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 4h10v16H7zM7 8h10" />
                </svg>
                <input
                  v-model="form.bio"
                  type="text"
                  placeholder="Short Biography"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
              </div>
            </div>

            <!-- Actions -->
            <div class="lg:col-span-2 mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="emit('close')">
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from "vue";

type AddDoctorInput = {
  firstName: string;
  lastName: string;
  username: string;
  gender: "Male" | "Female";
  mobile: string;
  degree: string;
  designation: string;
  department: string;
  joined: string;
  email?: string;
};

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", payload: AddDoctorInput): void;
}>(); // Typed emits for parent integration [web:75][web:46]

const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Radiology",
  "Dentistry",
];

// Local form state
const form = reactive({
  firstName: "",
  lastName: "",
  username: "",
  education: "",
  department: "",
  city: "",
  state: "",
  address: "",
  mobile: "",
  email: "",
  gender: "Male" as "Male" | "Female",
  designation: "",
  dob: "",
  country: "",
  postalCode: "",
  bio: "",
});

function onSubmit() {
  if (!form.firstName || !form.lastName || !form.mobile || !form.email) {
    alert(
      "Please fill First Name, Last Name, Mobile Number, and Email Address."
    );
    return;
  }
  const payload: AddDoctorInput = {
    firstName: form.firstName,
    lastName: form.lastName,
    username: form.username,
    gender: form.gender,
    mobile: form.mobile,
    degree: form.education, // map
    designation: form.designation,
    department: form.department,
    joined: new Date().toISOString().slice(0, 10), // default
    email: form.email,
  };
  emit("saved", payload);
}
</script>

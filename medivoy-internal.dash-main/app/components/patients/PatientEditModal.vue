<template>
  <div
    class="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div
        class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2
            class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Patient Edit
          </h2>
          <button
            @click="emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close">
            <svg
              class="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 md:p-6">
        <p
          class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
          Basic Information
        </p>

        <form
          @submit.prevent="onSubmit"
          class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Left column -->
          <div class="space-y-4">
            <div class="field">
              <input
                v-model="form.firstName"
                type="text"
                placeholder="First Name"
                class="input" />
            </div>

            <div class="field">
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Last Name"
                class="input" />
            </div>

            <div class="field">
              <input
                v-model="form.username"
                type="text"
                placeholder="User Name"
                class="input" />
            </div>

            <div class="field">
              <input
                v-model="form.address"
                type="text"
                placeholder="Address"
                class="input" />
            </div>

            <div class="field flex items-center gap-2">
              <select
                v-model="form.blood"
                class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100">
                <option value="" disabled>Blood Group</option>
                <option v-for="g in bloodGroups" :key="g" :value="g">
                  {{ g }}
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

            <div class="field">
              <input
                v-model="form.sugar"
                type="text"
                placeholder="Sugger"
                class="input"
                inputmode="numeric" />
            </div>
          </div>

          <!-- Right column -->
          <div class="space-y-4">
            <div class="field">
              <input
                v-model="form.mobile"
                type="tel"
                placeholder="Mobile Number"
                class="input" />
            </div>

            <div class="field">
              <input
                v-model="form.age"
                type="text"
                placeholder="Age"
                class="input"
                inputmode="numeric" />
            </div>

            <div>
              <p
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </p>
              <div class="flex items-center gap-6">
                <label class="radio">
                  <span class="radio-dot">
                    <span v-if="form.gender === 'Male'" class="radio-inner" />
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

                <label class="radio">
                  <span class="radio-dot">
                    <span v-if="form.gender === 'Female'" class="radio-inner" />
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

            <div class="field">
              <input v-model="form.birth" type="date" class="input" />
            </div>

            <div class="field">
              <input
                v-model="form.bp"
                type="text"
                placeholder="Blood Pressure"
                class="input" />
            </div>

            <div class="field">
              <input
                v-model="form.injury"
                type="text"
                placeholder="Injury/Condition"
                class="input" />
            </div>
          </div>

          <!-- Actions -->
          <div class="lg:col-span-2 mt-2 flex items-center justify-end gap-3">
            <button type="button" @click="emit('close')" class="btn-outline">
              Cancel
            </button>
            <button type="submit" class="btn-primary">Submit</button>
          </div>
        </form>
      </div>
      <!-- body -->
    </div>
    <!-- card -->
  </div>
  <!-- overlay -->
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: []; submit: [data: any] }>();

const props = defineProps<{
  patient: {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    address?: string;
    blood?: string;
    sugar?: string;
    mobile?: string;
    age?: number | string;
    sex?: string;
    gender?: "Male" | "Female";
    birth?: string;
    bp?: string;
    injury?: string;
  } | null;
}>();

const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

const form = reactive({
  firstName:
    props.patient?.firstName ?? props.patient?.name?.split(" ")[0] ?? "Peter",
  lastName:
    props.patient?.lastName ?? props.patient?.name?.split(" ")[1] ?? "Oliver",
  username: props.patient?.username ?? "peter_634",
  address:
    props.patient?.address ??
    "Suite 332 68460 Chelsie Pine, South Estebanview, WA 94151-4874",
  blood: props.patient?.blood ?? "O+",
  sugar: props.patient?.sugar ?? "90",
  mobile: props.patient?.mobile ?? "+1 234567890",
  age: String(props.patient?.age ?? "26"),
  gender: (props.patient?.gender ?? props.patient?.sex ?? "Male") as
    | "Male"
    | "Female",
  birth: props.patient?.birth ?? "",
  bp: props.patient?.bp ?? "120",
  injury: props.patient?.injury ?? "Fever",
});

function onSubmit() {
  if (!form.firstName || !form.mobile) {
    alert("First Name and Mobile are required.");
    return;
  }
  emit("submit", JSON.parse(JSON.stringify(form)));
}
</script>

<style scoped>
@reference "tailwindcss";

.field {
  @apply flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800;
}
.input {
  @apply flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400;
}

.radio {
  @apply inline-flex items-center gap-2 cursor-pointer;
}
.radio-dot {
  @apply relative inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400;
}
.radio-inner {
  @apply w-2.5 h-2.5 rounded-full bg-[#4565AD];
}

.btn-outline {
  @apply px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800;
}
.btn-primary {
  @apply px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95;
}
</style>

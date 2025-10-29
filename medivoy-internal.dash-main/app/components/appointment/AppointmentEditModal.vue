<!-- components/appointment/AppointmentEditModal.vue -->
<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-edit-title"
      @click.self="emit('close')">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <h2
            id="appointment-edit-title"
            class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Appointment Edit
          </h2>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="emit('close')"
            aria-label="Close dialog">
            Close
          </button>
        </div>

        <!-- Card -->
        <div
          class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800 p-4 md:p-6">
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

            <!-- Doctor (options include current + store + props) -->
            <div class="relative overflow-visible">
              <label class="sr-only">Consulting Doctor</label>
              <select
                v-model="form.doctor"
                class="block w-full h-12 px-3 pr-9 rounded-lg text-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none appearance-none focus:ring-2 focus:ring-[#4565AD] focus:border-transparent [color-scheme:light] dark:[color-scheme:dark]"
                aria-label="Consulting Doctor">
                <option
                  value=""
                  disabled
                  class="text-gray-500 dark:text-gray-400">
                  Select Doctor
                </option>
                <option
                  v-for="d in doctorsList"
                  :key="d"
                  :value="d"
                  class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  {{ d }}
                </option>
              </select>
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
                  placeholder="Treatment"
                  class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button
              type="button"
              @click="onSave"
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
import { reactive, watch, computed } from "vue";
import { useAppointmentsMock } from "~/composables/useAppointmentsMock";

type Row = {
  id: number;
  name: string;
  patientId: string;
  avatar: string;
  doctor: string;
  treatment: string;
  mobile: string;
  email: string;
  date: string;
  time: string;
};

type Appointment = {
  id?: number;
  firstName?: string;
  lastName?: string;
  address?: string;
  mobile?: string;
  email?: string;
  gender?: "Male" | "Female";
  date?: string;
  time?: string;
  from?: string;
  to?: string;
  doctor?: string;
  treatment?: string;
};

const props = defineProps<{
  id?: number;
  appointment?: Partial<Appointment>;
  doctors?: string[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", payload: Appointment): void;
}>();

const { rows } = useAppointmentsMock();

function splitName(full = "") {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] || "", lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
function toHHmm(t?: string) {
  if (!t) return "";
  const [h, m = "00"] = t.split(":");
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function mapRowToAppointment(r?: Row): Appointment {
  if (!r) return {};
  const { firstName, lastName } = splitName(r.name);
  return {
    id: r.id,
    firstName,
    lastName,
    address: "",
    mobile: r.mobile,
    email: r.email,
    gender: "Male",
    date: r.date,
    from: toHHmm(r.time),
    to: "",
    doctor: r.doctor,
    treatment: r.treatment,
    time: r.time,
  };
}

// Resolve record by priority: explicit appointment -> id->store
const resolved = computed<Appointment>(() => {
  if (props.appointment && (props.appointment.id || props.id === undefined))
    return { ...props.appointment };
  const row = rows.value.find((r) => r.id === props.id);
  return mapRowToAppointment(row);
});

// Local reactive form
const form = reactive<Appointment>({
  id: resolved.value.id,
  firstName: resolved.value.firstName ?? "",
  lastName: resolved.value.lastName ?? "",
  address: resolved.value.address ?? "",
  mobile: resolved.value.mobile ?? "",
  email: resolved.value.email ?? "",
  gender: (resolved.value.gender as "Male" | "Female") ?? "Male",
  date: resolved.value.date ?? new Date().toISOString().slice(0, 10),
  from: resolved.value.from ?? toHHmm(resolved.value.time) ?? "",
  to: resolved.value.to ?? "",
  doctor: (resolved.value.doctor || "").trim(),
  treatment: resolved.value.treatment ?? "",
  time: resolved.value.time,
});

// Build the doctors list so it always contains the current value
const storeDoctors = computed(() => {
  const set = new Set<string>();
  rows.value.forEach((r) => {
    const v = (r.doctor || "").trim();
    if (v) set.add(v);
  });
  return Array.from(set);
});
const passedDoctors = computed(() =>
  (props.doctors || []).map((d) => (d || "").trim()).filter(Boolean)
);
const currentDoctor = computed(() => (form.doctor || "").trim());
const doctorsList = computed(() => {
  const merged = Array.from(
    new Set<string>([...passedDoctors.value, ...storeDoctors.value])
  );
  if (currentDoctor.value && !merged.includes(currentDoctor.value))
    merged.unshift(currentDoctor.value);
  return merged;
});

// Sync form when resolved changes
watch(resolved, (v) => {
  form.id = v.id ?? form.id;
  form.firstName = v.firstName ?? "";
  form.lastName = v.lastName ?? "";
  form.address = v.address ?? "";
  form.mobile = v.mobile ?? "";
  form.email = v.email ?? "";
  form.gender = (v.gender as "Male" | "Female") ?? "Male";
  form.date = v.date ?? new Date().toISOString().slice(0, 10);
  form.from = v.from ?? toHHmm(v.time) ?? "";
  form.to = v.to ?? "";
  form.doctor = (v.doctor || "").trim();
  form.treatment = v.treatment ?? "";
  form.time = v.time;
});

function onSave() {
  if (
    !form.firstName ||
    !form.mobile ||
    !form.date ||
    !form.from ||
    !form.doctor
  ) {
    alert(
      "Please fill the required fields: First Name, Mobile, Date, From, Doctor."
    );
    return;
  }
  emit("saved", {
    id: form.id,
    firstName: form.firstName,
    lastName: form.lastName,
    address: form.address,
    mobile: form.mobile,
    email: form.email,
    gender: form.gender,
    date: form.date,
    from: form.from, // parent maps to store time
    to: form.to,
    doctor: form.doctor,
    treatment: form.treatment,
  });
}
</script>

<style scoped>
/* Normalize native select for consistent theming */
select::-ms-expand {
  display: none;
}
select {
  background-clip: padding-box;
}
select {
  color-scheme: light;
}
:global(.dark) select {
  color-scheme: dark;
}
select {
  -webkit-text-fill-color: currentColor;
}
select {
  line-height: 1.25;
}
</style>

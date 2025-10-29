<!-- components/doctors/DoctorDetailModal.vue -->
<template>
  <!-- Teleport is optional; keep if the app benefits from stacking to body -->
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-detail-title"
      @click.self="emit('close')">
      <div
        class="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2
            id="doctor-detail-title"
            class="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Doctor Detail
          </h2>
          <button
            type="button"
            class="px-3 py-1.5 rounded-md text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="emit('close')">
            Close
          </button>
        </div>

        <!-- Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Left: Profile + About -->
          <div class="space-y-4">
            <!-- Profile card -->
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div class="flex items-start gap-4">
                <img
                  :src="doc.avatar || 'https://i.pravatar.cc/160?img=1'"
                  class="w-36 h-36 rounded-xl object-cover"
                  alt="" />
                <div class="min-w-0">
                  <p
                    class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    Dr. {{ fullName }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ degreeText
                    }}<template v-if="specialText"
                      >, {{ specialText }}</template
                    >
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {{ experienceText }}
                  </p>
                  <div class="mt-2 flex items-center gap-1">
                    <span v-for="i in 5" :key="i" class="text-yellow-400"
                      >★</span
                    >
                    <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {{ reviewsText }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- About -->
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p
                class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                About Me
              </p>
              <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
                {{ aboutText }}
              </p>
              <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    {{ doc.email || "N/A" }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Phone
                  </p>
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    {{ doc.phone || doc.mobile || "N/A" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Work Expertise -->
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p
                class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Work Expertise
              </p>
              <div
                v-for="b in barsToShow"
                :key="b.label"
                class="mb-4 last:mb-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ b.label }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ b.value }}%
                  </p>
                </div>
                <div
                  class="h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    class="h-full rounded bg-[#4565AD]"
                    :style="{ width: b.value + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Address, Education, Experience -->
          <div class="space-y-4">
            <!-- Address -->
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p
                class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Address
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ doc.address || "—" }}
              </p>
            </div>

            <!-- Education -->
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p
                class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Education
              </p>
              <ul class="space-y-3">
                <li
                  v-for="(e, i) in educationList"
                  :key="i"
                  class="flex items-start gap-2">
                  <span
                    class="mt-1 w-1.5 h-1.5 rounded-full bg-[#4565AD]"></span>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    e
                  }}</span>
                </li>
              </ul>
            </div>

            <!-- Experience -->
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p
                class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Experience
              </p>
              <ul class="space-y-3">
                <li
                  v-for="(e, i) in experienceItems"
                  :key="i"
                  class="flex items-start gap-2">
                  <span
                    class="mt-1 w-1.5 h-1.5 rounded-full bg-[#4565AD]"></span>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{
                    e
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-md text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="emit('close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

type DocDetail = {
  id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  degree?: string;
  designation?: string;
  special?: string;
  experience?: number;
  reviews?: number;
  about?: string;
  education?: string[];
  experienceList?: string[];
};

const props = defineProps<{
  doctor: DocDetail;
}>();

const emit = defineEmits<{ (e: "close"): void }>();

// Fallbacks so the modal works with list-level data or full profile payloads
const doc = computed(() => props.doctor || {});

const fullName = computed(() => {
  const fn = doc.value.firstName || "";
  const ln = doc.value.lastName || "";
  const display = doc.value.name || [fn, ln].filter(Boolean).join(" ").trim();
  return display || "Unknown";
});

const degreeText = computed(() => doc.value.degree || "MBBS");
const specialText = computed(
  () => doc.value.special || doc.value.designation || ""
);
const experienceText = computed(() => {
  const yrs =
    typeof doc.value.experience === "number" ? doc.value.experience : 0;
  return `${yrs} Year${yrs === 1 ? "" : "s"} Experience`;
});
const reviewsText = computed(() => `${doc.value.reviews ?? 0} Reviews`);
const aboutText = computed(
  () =>
    doc.value.about ||
    "Profile details are not available for this doctor at the moment."
);

// Default bars if none provided externally
const barsToShow = computed(() => [
  { label: "OPD", value: 50 },
  { label: "Operations", value: 85 },
  { label: "Patient visit", value: 20 },
]);

const educationList = computed(() => doc.value.education || []);
const experienceItems = computed(() => doc.value.experienceList || []);
</script>

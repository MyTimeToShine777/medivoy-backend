<template>
  <div
    class="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div
        class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2
            class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Patient Detail
          </h2>
          <button
            @click="$emit('close')"
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Details -->
          <div
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p
              class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Details
            </p>
            <div class="flex items-start gap-6">
              <img
                :src="safePatient.avatar"
                class="w-40 h-40 rounded-xl object-cover"
                alt="" />
              <div class="space-y-3 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Name</p>
                  <p class="text-gray-900 dark:text-gray-100 font-medium">
                    {{ safePatient.name }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Date of birth</p>
                  <p class="text-gray-900 dark:text-gray-100 font-medium">
                    {{ safePatient.birth }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Gender</p>
                  <p class="text-gray-900 dark:text-gray-100 font-medium">
                    {{ safePatient.sex }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Address</p>
                  <p class="text-gray-900 dark:text-gray-100 font-medium">
                    {{ safePatient.address }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Phone</p>
                  <p class="text-gray-900 dark:text-gray-100 font-medium">
                    {{ safePatient.mobile }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Email</p>
                  <p class="text-gray-900 dark:text-gray-100 font-medium">
                    {{ safePatient.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- About -->
          <div
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p
              class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              About
            </p>
            <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
              {{ aboutText }}
            </p>
          </div>

          <!-- General Report -->
          <div
            class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p
              class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              General Report
            </p>
            <div class="space-y-4">
              <div v-for="row in safeReport" :key="row.label" class="w-full">
                <div class="flex items-center justify-between text-sm mb-1">
                  <p class="text-gray-700 dark:text-gray-300">
                    {{ row.label }}
                  </p>
                  <p class="text-gray-500 dark:text-gray-400">
                    {{ row.value }}
                  </p>
                </div>
                <div
                  class="h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    class="h-full rounded"
                    :style="{
                      width: row.value + '%',
                      background: row.color,
                    }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Doctor Visit -->
          <div
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p
              class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Doctor Visit
            </p>
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr
                    class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                    <th class="text-left px-4 py-3 font-semibold">Doctor</th>
                    <th class="text-left px-4 py-3 font-semibold">Date</th>
                    <th class="text-left px-4 py-3 font-semibold">
                      Department
                    </th>
                    <th class="text-left px-4 py-3 font-semibold">Reports</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr v-for="v in safeVisits" :key="v.id">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <img
                          :src="v.avatar"
                          class="w-8 h-8 rounded-full object-cover"
                          alt="" />
                        <span class="text-gray-900 dark:text-gray-100">{{
                          v.name
                        }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ v.date }}
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ v.dept }}
                    </td>
                    <td class="px-4 py-3">
                      <button
                        class="px-3 py-1.5 rounded-md text-xs text-white bg-[#4565AD] hover:opacity-95"
                        @click="$emit('open-report', v)">
                        View Report
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!safeVisits.length">
                    <td
                      colspan="4"
                      class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No visits found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Report files -->
          <div
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p
              class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Report
            </p>
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr
                    class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                    <th class="text-left px-4 py-3 font-semibold">File</th>
                    <th class="text-left px-4 py-3 font-semibold">
                      Report Link
                    </th>
                    <th class="text-left px-4 py-3 font-semibold">Date</th>
                    <th class="text-left px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr v-for="r in safeFiles" :key="r.id">
                    <td class="px-4 py-3">
                      <div
                        class="w-8 h-8 rounded-md bg-[#4565AD]/20 text-[#4565AD] flex items-center justify-center">
                        📄
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ r.link }}
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {{ r.date }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <button
                          class="icon-btn"
                          title="Open Link"
                          @click="$emit('open-file', r)">
                          🔗
                        </button>
                        <button
                          class="icon-btn"
                          title="Delete"
                          @click="$emit('delete-file', r)">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!safeFiles.length">
                    <td
                      colspan="4"
                      class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No files found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- grid -->
      </div>
      <!-- p -->
    </div>
    <!-- card -->
  </div>
  <!-- overlay -->
</template>

<script setup lang="ts">
import { computed } from "vue";

type PatientLite = {
  id: number;
  name: string;
  avatar: string;
  sex: string;
  birth: string;
  address: string;
  mobile: string;
  email: string;
};

type ReportRow = { label: string; value: number; color: string };
type VisitRow = {
  id: number;
  name: string;
  avatar: string;
  date: string;
  dept: string;
};
type FileRow = { id: number; link: string; date: string; url?: string };

const props = defineProps<{
  patient: PatientLite | null;
  report?: ReportRow[];
  visits?: VisitRow[];
  files?: FileRow[];
  about?: string;
}>();

defineEmits<{
  close: [];
  "open-report": [row: VisitRow];
  "open-file": [row: FileRow];
  "delete-file": [row: FileRow];
}>();

// Fallbacks exactly as shown in the reference layout
const defaultReport: ReportRow[] = [
  { label: "Heart Beat", value: 34, color: "#4565AD" },
  { label: "Blood Pressure", value: 93, color: "#ef4444" },
  { label: "Sugar", value: 55, color: "#22d3ee" },
  { label: "Haemoglobin", value: 78, color: "#f59e0b" },
];

const defaultVisits: VisitRow[] = [
  {
    id: 1,
    name: "Dr. Christian",
    avatar: "https://i.pravatar.cc/80?img=30",
    date: "11/10/2024",
    dept: "Dentist",
  },
  {
    id: 2,
    name: "Dr. Leonard",
    avatar: "https://i.pravatar.cc/80?img=31",
    date: "12/12/2023",
    dept: "Urologist",
  },
];

const defaultFiles: FileRow[] = [
  { id: 1, link: "Reports 1 clinical documentation", date: "12 Dec 2023" },
  { id: 2, link: "Reports 2 random files documentation", date: "13 Sep 2023" },
];

const placeholderPatient: PatientLite = {
  id: 0,
  name: "Unknown",
  avatar: "https://i.pravatar.cc/160?img=20",
  sex: "Male",
  birth: "—",
  address: "—",
  mobile: "—",
  email: "—",
};

const safePatient = computed(() => props.patient ?? placeholderPatient);
const safeReport = computed<ReportRow[]>(() =>
  props.report?.length ? props.report : defaultReport
);
const safeVisits = computed<VisitRow[]>(() =>
  props.visits?.length ? props.visits : defaultVisits
);
const safeFiles = computed<FileRow[]>(() =>
  props.files?.length ? props.files : defaultFiles
);
const aboutText = computed(
  () =>
    props.about ??
    "Sample about text for the patient profile to match the reference layout."
);
</script>

<style scoped>
/* Tailwind utilities used directly in template; no @apply needed */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  border: 1px solid var(--tw-border, rgba(148, 163, 184, 0.25));
  color: rgb(148, 163, 184);
  transition: background-color 0.2s, transform 0.2s;
}
.icon-btn:hover {
  background: #1118271a;
  transform: scale(1.05);
}
:global(.dark) .icon-btn {
  border-color: #374151;
  color: #9ca3af;
}
</style>

<script setup lang="ts">
import { computed } from "vue";

const today = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "long",
  day: "2-digit",
});

/* Confirmed Diagnoses (unchanged) */
const diagnoses = [
  { label: "Cold", value: 648, total: 751, color: "#fb7d60" },
  { label: "Fracture", value: 215, total: 651, color: "#8BDB3C" },
  { label: "Concussion", value: 84, total: 120, color: "#38bdf8" },
  { label: "Hepatitis", value: 804, total: 846, color: "#a78bfa" },
  { label: "Dermatitis", value: 458, total: 901, color: "#22d3ee" },
];

/* Patients pace (unchanged) */
const pace = {
  height: 140,
  series: [
    {
      c: "var(--line-2)",
      p: [0, 90, 80, 40, 160, 80, 240, 30, 320, 72, 400, 38, 480, 60, 560, 36],
    },
    {
      c: "var(--line-1)",
      p: [0, 26, 80, 34, 160, 28, 240, 64, 320, 32, 400, 78, 480, 24, 560, 60],
    },
    {
      c: "var(--line-3)",
      p: [0, 20, 80, 24, 160, 30, 240, 26, 320, 24, 400, 28, 480, 32, 560, 36],
    },
  ],
};

/* NEW: Overall Appointment hourly bars */
const hours = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
const apptsByHour = [6, 12, 7, 9, 4, 5, 8, 6, 7, 14]; // sample data; wire to real API later
const maxAppts = Math.max(...apptsByHour);

/* NEW: KPI Stats (with tiny sparklines) */
const kpis = [
  {
    label: "Today Appointments",
    value: 42,
    delta: +8,
    color: "var(--brand-700)",
    spark: [8, 12, 9, 14, 11, 16, 18],
  },
  {
    label: "New Patients",
    value: 12,
    delta: +3,
    color: "var(--brand-500)",
    spark: [2, 3, 4, 3, 5, 6, 7],
  },
  {
    label: "Revenue Today (€)",
    value: 1295,
    delta: +11,
    color: "#fb7d60",
    spark: [120, 140, 160, 150, 180, 190, 220],
  },
  {
    label: "Pending Tests",
    value: 7,
    delta: -2,
    color: "#a78bfa",
    spark: [10, 9, 11, 8, 9, 8, 7],
  },
];

/* NEW: Appointment Status ring */
const status = { completed: 58, scheduled: 32, cancelled: 10 };
const ringStyle = computed(() => {
  const a = status.completed;
  const b = a + status.scheduled;
  return {
    background: `conic-gradient(var(--brand-700) 0 ${a}%,
                                 var(--brand-500) ${a}% ${b}%,
                                 #fb7d60 ${b}% 100%)`,
  };
});
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- KPI Stats row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div v-for="(k, i) in kpis" :key="i" class="card">
        <div class="card-body">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[13px] muted">{{ k.label }}</p>
              <p class="mt-1 text-xl font-semibold" style="color: var(--ink-1)">
                {{ k.value }}
              </p>
              <p
                class="text-[13px]"
                :style="{
                  color: k.delta >= 0 ? 'rgb(34 197 94)' : 'rgb(239 68 68)',
                }">
                {{ k.delta >= 0 ? "▲" : "▼" }} {{ Math.abs(k.delta) }}%
              </p>
            </div>
            <svg
              width="96"
              height="40"
              viewBox="0 0 96 40"
              fill="none"
              class="-mr-1">
              <polyline
                :points="
                  k.spark
                    .map(
                      (v, idx) =>
                        `${(idx / (k.spark.length - 1)) * 96},${
                          40 - (v / Math.max(...k.spark)) * 36 - 2
                        }`
                    )
                    .join(' ')
                "
                :stroke="k.color"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Next Patient -->
      <div class="card col-span-12 md:col-span-6 xl:col-span-4">
        <div class="card-header">
          <h2 class="text-base font-semibold tracking-tight">Next Patient</h2>
        </div>
        <div class="card-body">
          <div class="flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?name=Corey+Aguilar"
              class="h-10 w-10 rounded-full"
              alt="" />
            <div class="min-w-0">
              <p
                class="truncate text-sm font-medium"
                style="color: var(--ink-1)">
                Corey Aguilar
              </p>
              <p class="truncate text-[13px] muted">Kidney function test</p>
            </div>
            <button
              class="ml-auto rounded-full border p-2 text-[13px]"
              style="
                border-color: var(--panel-border);
                color: var(--brand-700);
              ">
              📞
            </button>
          </div>
          <div class="mt-5 flex items-center gap-2 text-sm muted">
            <span>🕘</span><span>09:00</span><span class="ml-auto">⋯</span>
          </div>
        </div>
      </div>

      <!-- Laboratory Tests -->
      <div class="card col-span-12 md:col-span-6 xl:col-span-4">
        <div class="card-header">
          <h2 class="text-base font-semibold tracking-tight">
            Laboratory Tests
          </h2>
        </div>
        <div class="card-body">
          <div class="flex items-start gap-3">
            <span class="text-[18px]">🧪</span>
            <div class="min-w-0">
              <p class="text-sm font-medium" style="color: var(--brand-700)">
                Nelle Pearson
              </p>
              <p class="mt-1 text-sm" style="color: var(--ink-1)">
                Beta 2 Micro-globulin (B2M) Tumor Marker Test
              </p>
              <div class="mt-3 flex flex-wrap items-center gap-5 text-[13px]">
                <button class="link">Details</button>
                <button class="link">Contact patient</button>
                <button class="link inline-flex items-center gap-2">
                  ✔ Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Appointment Status ring (NEW) -->
      <div class="card col-span-12 xl:col-span-4">
        <div class="card-header">
          <h2 class="text-base font-semibold tracking-tight">
            Appointment status
          </h2>
        </div>
        <div class="card-body">
          <div class="flex items-center gap-6">
            <div
              class="relative h-28 w-28 rounded-full border"
              :style="[
                { borderColor: 'var(--panel-border)' },
                ringStyle,
              ]"></div>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <span
                  class="h-2 w-2 rounded-full"
                  style="background: var(--brand-700)"></span
                ><span>Completed: {{ status.completed }}%</span>
              </li>
              <li class="flex items-center gap-2">
                <span
                  class="h-2 w-2 rounded-full"
                  style="background: var(--brand-500)"></span
                ><span>Scheduled: {{ status.scheduled }}%</span>
              </li>
              <li class="flex items-center gap-2">
                <span
                  class="h-2 w-2 rounded-full"
                  style="background: #fb7d60"></span
                ><span>Cancelled: {{ status.cancelled }}%</span>
              </li>
            </ul>
            <div class="ml-auto">
              <button class="btn-primary">View details</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Appointment (NEW full graph) -->
      <div class="card col-span-12 md:col-span-6 xl:col-span-4">
        <div class="card-header">
          <h2 class="text-base font-semibold tracking-tight">
            Overall Appointment
          </h2>
        </div>
        <div class="card-body">
          <div class="h-40">
            <div class="flex h-28 items-end gap-3">
              <div
                v-for="(v, i) in apptsByHour"
                :key="i"
                class="w-6 rounded-md bg-black/5 dark:bg-white/10">
                <div
                  class="w-full rounded-md"
                  :style="{
                    height: Math.max(6, (v / maxAppts) * 100) + '%',
                    background:
                      'linear-gradient(180deg, var(--brand-500), var(--brand-700))',
                  }" />
              </div>
            </div>
            <div class="mt-3 grid grid-cols-10 text-[12px] muted">
              <span v-for="(h, i) in hours" :key="i" class="text-center">{{
                h
              }}</span>
            </div>
          </div>
          <div class="mt-4 border-t dash"></div>
          <div class="mt-3 flex items-center gap-6 text-[13px]">
            <span class="metric"
              >Peak hour:
              {{ hours[apptsByHour.indexOf(Math.max(...apptsByHour))] }}</span
            >
            <span class="muted"
              >Total: {{ apptsByHour.reduce((a, b) => a + b, 0) }}</span
            >
          </div>
        </div>
      </div>

      <!-- Patients pace -->
      <div class="card col-span-12 md:col-span-6 xl:col-span-4">
        <div class="card-header">
          <h2 class="text-base font-semibold tracking-tight">Patients pace</h2>
        </div>
        <div class="card-body">
          <svg
            class="w-full"
            :height="pace.height"
            viewBox="0 0 560 140"
            fill="none"
            preserveAspectRatio="none">
            <template v-for="(s, i) in pace.series" :key="i">
              <polyline
                :points="s.p.join(' ')"
                :stroke="s.c"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
                opacity="0.95" />
            </template>
          </svg>
          <div class="mt-3 flex items-center gap-6 text-[13px]">
            <span class="inline-flex items-center gap-2"
              ><span
                class="h-2 w-2 rounded-full"
                style="background: var(--line-2)"></span
              >NEW PATIENTS</span
            >
            <span class="inline-flex items-center gap-2"
              ><span
                class="h-2 w-2 rounded-full"
                style="background: var(--line-1)"></span
              >RETURNED PATIENTS</span
            >
            <span class="inline-flex items-center gap-2"
              ><span
                class="h-2 w-2 rounded-full"
                style="background: var(--line-3)"></span
              >FOLLOW-UPS</span
            >
          </div>
        </div>
      </div>

      <!-- Confirmed Diagnoses -->
      <div class="card col-span-12 xl:col-span-4">
        <div class="card-header flex items-center justify-between">
          <h2 class="text-base font-semibold tracking-tight">
            Confirmed Diagnoses
          </h2>
          <div class="flex items-center gap-5 text-[13px]">
            <button class="link">Year</button
            ><button class="muted">Month</button
            ><button class="muted">Week</button>
          </div>
        </div>
        <div class="card-body space-y-4">
          <div v-for="d in diagnoses" :key="d.label" class="space-y-1">
            <div class="flex items-center justify-between text-sm">
              <span class="metric">{{ d.value }} of {{ d.total }}</span>
              <span class="muted">{{ d.label }}</span>
            </div>
            <div class="bar">
              <div
                class="bar-fill"
                :style="{
                  width: (d.value / d.total) * 100 + '%',
                  background: d.color,
                }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions (NEW) -->
      <div class="card col-span-12 xl:col-span-4">
        <div class="card-header">
          <h2 class="text-base font-semibold tracking-tight">Quick actions</h2>
        </div>
        <div class="card-body grid grid-cols-2 gap-3">
          <button class="btn-primary">Add appointment</button>
          <button class="btn-primary">New patient</button>
          <button class="btn-primary">Create order</button>
          <button class="btn-primary">Message</button>
        </div>
      </div>

      <!-- Recent Questions -->
      <div class="card col-span-12 xl:col-span-8">
        <div class="card-header flex items-center justify-between">
          <h2 class="text-base font-semibold tracking-tight">
            Recent Questions
          </h2>
          <div class="flex items-center gap-5 text-[13px]">
            <button class="link">All</button
            ><button class="muted">Unread</button
            ><button class="muted">New</button>
          </div>
        </div>
        <div class="card-body space-y-6">
          <div class="space-y-1">
            <p class="text-[12px] muted">08 OCT 2025 / 06:34 PM</p>
            <p class="text-sm font-medium" style="color: var(--ink-1)">
              Addiction blood bank bone marrow contagious?
            </p>
            <div class="mt-2 flex items-center gap-5 text-[13px]">
              <button class="link">Read more</button
              ><button class="link">Reply</button
              ><span class="ml-auto">💬</span>
            </div>
          </div>
          <div class="border-t dash"></div>
          <div class="space-y-1">
            <p class="text-[12px] muted">03 OCT 2025 / 04:04 PM</p>
            <p class="text-sm font-medium" style="color: var(--ink-1)">
              Lorem ipsum dolor sit amet, consectetur?
            </p>
            <div class="mt-2 flex items-center gap-5 text-[13px]">
              <button class="link">Read more</button
              ><button class="link">Reply</button
              ><span class="ml-auto">💬</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- components/appointment/AppointmentScheduleModal.vue -->
<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-schedule-title"
      @click.self="emit('close')">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-3 md:p-4 w-full max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <h2
            id="appointment-schedule-title"
            class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Appointment Scheduling
          </h2>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="emit('close')"
            aria-label="Close dialog">
            Close
          </button>
        </div>

        <!-- Calendar card -->
        <div
          class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-3 md:p-4">
          <!-- View controls -->
          <div class="flex items-center gap-2 mb-3">
            <button
              class="btn"
              :class="isView('timeGridDay') && 'btn-active'"
              @click="setView('timeGridDay')">
              Day
            </button>
            <button
              class="btn"
              :class="isView('timeGridWeek') && 'btn-active'"
              @click="setView('timeGridWeek')">
              Week
            </button>
            <button
              class="btn"
              :class="isView('dayGridMonth') && 'btn-active'"
              @click="setView('dayGridMonth')">
              Month
            </button>
            <button
              class="btn"
              :class="isView('workweek') && 'btn-active'"
              @click="setView('workweek')">
              Work Week
            </button>
            <button
              class="btn"
              :class="isView('timelineWorkweek') && 'btn-active'"
              @click="setView('timelineWorkweek')">
              Timeline Work Week
            </button>

            <div class="ml-auto flex items-center gap-2">
              <button class="btn" @click="prev">‹</button>
              <button class="btn" @click="today">Today</button>
              <button class="btn" @click="next">›</button>
            </div>
          </div>

          <!-- FullCalendar -->
          <FullCalendar ref="calRef" :options="options" class="fc-theme-dark" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid"; // optional/premium; safe to keep if installed [Premium]
/**
 * Props/Emits
 */
type Row = {
  id: number;
  name: string;
  patientId: string;
  avatar: string;
  doctor: string;
  treatment: string;
  mobile: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

const props = defineProps<{
  rows?: Row[];
  defaultMinutes?: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

/**
 * Data mapping
 */
const defaultMinutes = computed(() => props.defaultMinutes ?? 60);

function pickColor(t: string) {
  const k = t.toLowerCase();
  if (k.includes("operation") || k.includes("surgery")) return "#26A65B";
  if (k.includes("cancer")) return "#ff5c57";
  if (k.includes("infertility") || k.includes("prostate")) return "#ff2d87";
  return "#3B82F6";
}

function toEvents(list: Row[]) {
  return list.map((r) => {
    const start = new Date(`${r.date}T${r.time}:00`);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + defaultMinutes.value);
    const color = pickColor(r.treatment);
    return {
      id: String(r.id),
      title: r.treatment,
      start,
      end,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        patient: r.name,
        doctor: r.doctor,
        email: r.email,
        mobile: r.mobile,
        avatar: r.avatar,
      },
    };
  });
}

/**
 * Calendar options
 */
const calRef = ref<any>(null);
const currentView = ref<
  | "timeGridDay"
  | "timeGridWeek"
  | "dayGridMonth"
  | "workweek"
  | "timelineWorkweek"
>("timeGridWeek");

const options = reactive({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
    resourceTimeGridPlugin,
  ],
  initialView: "timeGridWeek",
  headerToolbar: false,
  height: "auto",
  expandRows: true,
  nowIndicator: true,
  selectable: true,
  editable: false,
  slotMinTime: "09:00:00",
  slotMaxTime: "21:00:00",
  slotDuration: "00:30:00",
  allDaySlot: false,
  events: toEvents(props.rows ?? []),
  eventDidMount(arg: any) {
    arg.el.style.borderRadius = "8px";
    arg.el.style.color = "#fff";
    arg.el.style.fontWeight = "600";
  },
});

/**
 * View/nav controls using FullCalendar API
 */
function setView(v: typeof currentView.value) {
  currentView.value = v;
  const api = calRef.value?.getApi?.();
  if (!api) return;
  if (v === "workweek") {
    api.changeView("timeGridWeek", { hiddenDays: [0, 6] });
  } else if (v === "timelineWorkweek") {
    // Approximate timeline work week with a single day and horizontal scroll capability
    api.changeView("timeGridDay");
  } else {
    api.changeView(v);
  }
}
function isView(v: string) {
  return currentView.value === v;
}
function today() {
  calRef.value?.getApi?.().today();
}
function prev() {
  calRef.value?.getApi?.().prev();
}
function next() {
  calRef.value?.getApi?.().next();
}
</script>

<style scoped>
/* View buttons */
.btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--tw-border, rgba(148, 163, 184, 0.25));
  color: rgb(55, 65, 81);
  background: transparent;
  transition: background-color 0.2s;
}
:global(.dark) .btn {
  color: #d1d5db;
  border-color: #374151;
}
.btn:hover {
  background: #f3f4f6;
}
:global(.dark) .btn:hover {
  background: #1f2937;
}
.btn-active {
  background: #4565ad;
  color: #fff;
  border-color: #4565ad;
}

/* FullCalendar dark polish */
:deep(.fc) {
  --fc-border-color: rgba(148, 163, 184, 0.18);
  --fc-today-bg-color: rgba(212, 165, 116, 0.12);
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: transparent;
  --fc-now-indicator-color: #4565ad;
  font-size: 13px;
}
:deep(.fc .fc-scrollgrid) {
  border-radius: 0.75rem;
  border: 1px solid var(--fc-border-color);
}
:deep(.fc-col-header-cell-cushion) {
  color: #94a3b8;
}
:deep(.fc-timegrid-slot-label) {
  color: #94a3b8;
}
:deep(.fc-daygrid-day-number),
:deep(.fc-timegrid-axis-cushion) {
  color: #9ca3af;
}
</style>

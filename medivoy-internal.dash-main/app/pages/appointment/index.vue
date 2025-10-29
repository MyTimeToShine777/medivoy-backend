<!-- pages/appointment/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50dark:bg-slate-900 overflow-x-hidden">
    <!-- Page header -->
    <div
      class="border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div
        class="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Appointments
        </h1>

        <button
          @click="openAdd"
          class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#4565AD] hover:bg-[#c69563] text-white font-medium transition-colors text-sm sm:text-base"
          type="button">
          <svg
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Appointment</span>
        </button>
      </div>
    </div>

    <!-- Page content -->
    <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div class="max-w-[1400px] mx-auto">
        <div
          class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div class="w-full overflow-x-auto">
            <table
              class="min-w-[920px] w-full text-left table-sticky text-[13px] md:text-sm leading-5">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Consulting Doctor
                  </th>
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Treatment
                  </th>
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Mobile
                  </th>
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    Email
                  </th>
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Time
                  </th>
                  <th
                    class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 md:px-6 py-3 md:py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-32 sm:w-40 md:w-48">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="r in rows"
                  :key="r.id"
                  class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/50 transition-colors">
                  <!-- Name + avatar -->
                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <div class="flex items-center gap-2.5 md:gap-3">
                      <img
                        :src="r.avatar"
                        :alt="r.name"
                        class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700" />
                      <div class="min-w-0">
                        <p
                          class="font-medium text-gray-900 dark:text-white truncate">
                          {{ r.name }}
                        </p>
                        <p
                          class="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ r.patientId }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <span class="text-gray-800 dark:text-gray-200">{{
                      r.doctor
                    }}</span>
                  </td>

                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <span class="text-gray-700 dark:text-gray-300">{{
                      r.treatment
                    }}</span>
                  </td>

                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <span class="text-gray-700 dark:text-gray-300">{{
                      r.mobile
                    }}</span>
                  </td>

                  <td class="px-4 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                    <span
                      class="text-gray-700 dark:text-gray-300 block max-w-[260px] truncate"
                      >{{ r.email }}</span
                    >
                  </td>

                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <span class="text-gray-700 dark:text-gray-300">{{
                      formatDate(r.date)
                    }}</span>
                  </td>

                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <span class="text-gray-700 dark:text-gray-300">{{
                      formatTime(r.time)
                    }}</span>
                  </td>

                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <div class="flex items-center gap-1.5 md:gap-2">
                      <!-- View in schedule (focus selected date) -->
                      <button
                        @click.stop="openSchedule(r)"
                        class="icon-btn view-btn"
                        title="View in Schedule"
                        type="button">
                        🔍
                      </button>

                      <!-- Edit by id -->
                      <button
                        @click.stop="openEdit(r)"
                        class="icon-btn edit-btn"
                        title="Edit Appointment"
                        type="button">
                        ✏️
                      </button>

                      <!-- Delete with confirmation -->
                      <button
                        @click.stop="confirmDelete(r)"
                        class="icon-btn delete-btn"
                        title="Delete Appointment"
                        type="button">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="!rows.length">
                  <td
                    colspan="8"
                    class="px-4 md:px-6 py-10 md:py-12 text-center text-gray-500 dark:text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 dark:border-gray-800">
            <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Showing {{ rows.length }} appointments
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ClientOnly>
      <AppointmentBookModal
        v-if="showAdd"
        @close="showAdd = false"
        @submit="handleAddSubmit" />
      <AppointmentEditModal
        v-if="showEdit && editId !== null"
        :id="editId"
        @close="showEdit = false"
        @saved="handleEditSubmit" />
      <AppointmentScheduleModal
        v-if="showSchedule"
        :rows="rows"
        :initialDate="scheduleDate"
        :initialView="'timeGridDay'"
        @close="showSchedule = false" />
    </ClientOnly>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDelete"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appt-delete-title">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3
            id="appt-delete-title"
            class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Confirm Delete
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete <strong>{{ toDelete.name }}</strong
            >? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              type="button">
              ❌ Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
              type="button">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { useAppointmentsMock } from "~/composables/useAppointmentsMock";

// Shared mock data source
const { rows, addAppointment, updateAppointment, removeAppointment } =
  useAppointmentsMock();

// Formatters
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
const formatTime = (t: string) => {
  const [H, M = "00"] = t.split(":");
  let h = parseInt(H, 10);
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${M} ${am}`;
};

// Lazy modals
const AppointmentBookModal = defineAsyncComponent(
  () => import("~/components/appointment/AppointmentBookModal.vue")
);
const AppointmentEditModal = defineAsyncComponent(
  () => import("~/components/appointment/AppointmentEditModal.vue")
);
const AppointmentScheduleModal = defineAsyncComponent(
  () => import("~/components/appointment/AppointmentScheduleModal.vue")
);

// Modal state
const showAdd = ref(false);
const showEdit = ref(false);
const showSchedule = ref(false);

// Edit by id + schedule date
const editId = ref<number | null>(null);
const scheduleDate = ref<string | null>(null);

// Delete confirmation state
const showDelete = ref(false);
const toDelete = ref<{ id: number; name: string }>({ id: 0, name: "" });

// Openers
function openAdd() {
  showAdd.value = true;
}
function openEdit(r: any) {
  editId.value = r.id;
  showEdit.value = true;
}
function openSchedule(r: any) {
  scheduleDate.value = r.date;
  showSchedule.value = true;
}

// Delete flow
function confirmDelete(r: any) {
  toDelete.value = { id: r.id, name: r.name };
  showDelete.value = true;
}
function cancelDelete() {
  showDelete.value = false;
  toDelete.value = { id: 0, name: "" };
}
function handleDelete() {
  removeAppointment(toDelete.value.id);
  cancelDelete();
}

// Submit handlers
function handleAddSubmit(data: any) {
  addAppointment(data); // expects firstName, lastName, mobile, email, date, from, to, doctor, treatment
  showAdd.value = false;
}
function handleEditSubmit(updated: any) {
  updateAppointment({
    id: updated.id,
    name: `${updated.firstName} ${updated.lastName}`.trim(),
    mobile: updated.mobile,
    email: updated.email,
    date: updated.date,
    time: updated.from, // map UI time to store time
    doctor: updated.doctor,
    treatment: updated.treatment,
  });
  showEdit.value = false;
  editId.value = null;
}
</script>

<style scoped>
.table-sticky thead th {
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.06);
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  border: 1px solid var(--tw-border, rgba(148, 163, 184, 0.25));
  font-size: 16px;
  transition: all 0.2s;
  background: transparent;
}
.icon-btn:hover {
  background: #1118271a;
  transform: scale(1.05);
}
.view-btn:hover {
  border-color: #3b82f6;
  background: #3b82f610;
  box-shadow: 0 0 0 3px #3b82f610;
}
.edit-btn:hover {
  border-color: #f59e0b;
  background: #f59e0b10;
  box-shadow: 0 0 0 3px #f59e0b10;
}
.delete-btn:hover {
  border-color: #ef4444;
  background: #ef444410;
  box-shadow: 0 0 0 3px #ef444410;
}
:global(.dark) .icon-btn {
  border-color: #374151;
}
:global(.dark) .icon-btn:hover {
  background: #374151;
}
</style>

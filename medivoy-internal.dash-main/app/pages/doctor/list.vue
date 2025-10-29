<template>
  <div class="min-h-screen bg-gray-50dark:bg-slate-900 p-4 md:p-6">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Doctor List
        </h1>

        <!-- Open Add Modal -->
        <button
          type="button"
          @click="openAdd"
          class="px-3 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-colors"
          aria-haspopup="dialog"
          aria-controls="doctor-add-modal"
          aria-label="Add Doctor">
          Add Doctor
        </button>
      </div>

      <!-- Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <p
            class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Doctor List
          </p>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr
                class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                <th class="text-left px-4 py-3 font-semibold">Name</th>
                <th class="text-left px-4 py-3 font-semibold">Designation</th>
                <th class="text-left px-4 py-3 font-semibold">Email</th>
                <th class="text-left px-4 py-3 font-semibold">Degree</th>
                <th class="text-left px-4 py-3 font-semibold">Mobile Number</th>
                <th class="text-left px-4 py-3 font-semibold">Joining Date</th>
                <th class="text-left px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="doc in doctors"
                :key="doc.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <!-- Name with avatar -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img
                      :src="doc.avatar"
                      class="w-8 h-8 rounded-full object-cover"
                      alt="" />
                    <span class="text-gray-900 dark:text-gray-100 font-medium">
                      {{ doc.name }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ doc.designation }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ doc.email }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ doc.degree }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ doc.mobile }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ doc.joined }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <!-- View -> DoctorDetailModal -->
                    <button
                      class="icon-btn view-btn"
                      title="View Details"
                      @click.stop="openDetail(doc)">
                      🔍
                    </button>
                    <!-- Edit -> DoctorEditModal -->
                    <button
                      class="icon-btn edit-btn"
                      title="Edit Doctor"
                      @click.stop="openEdit(doc)">
                      ✏️
                    </button>
                    <!-- Delete with confirmation -->
                    <button
                      class="icon-btn delete-btn"
                      title="Delete Doctor"
                      @click.stop="confirmDelete(doc)">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!doctors.length">
                <td
                  colspan="7"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No doctors found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div
          class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Showing {{ doctors.length }} entries
          </span>
          <div class="flex items-center gap-2 text-xs">
            <button
              class="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Prev
            </button>
            <button
              class="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ClientOnly>
      <DoctorDetailModal
        v-if="showDetail && selected"
        id="doctor-detail-modal"
        :doctor="selected"
        @close="showDetail = false" />
      <DoctorEditModal
        v-if="showEdit && selected"
        id="doctor-edit-modal"
        :doctor="selected"
        @close="showEdit = false"
        @saved="onEdited" />
      <DoctorAddModal
        v-if="showAdd"
        id="doctor-add-modal"
        @close="showAdd = false"
        @saved="onAdded" />
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
        aria-labelledby="doctor-delete-title">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3
            id="doctor-delete-title"
            class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Confirm Delete
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete
            <strong>{{ doctorToDelete.name }}</strong
            >? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              ❌ Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import type { Doctor, AddDoctorInput } from "~/composables/useDoctorsMock";

// Auto-imported composable
const { doctors, addDoctor, updateDoctor, removeDoctor } = useDoctorsMock();

const selected = ref<Doctor | null>(null);
const showDetail = ref(false);
const showEdit = ref(false);
const showAdd = ref(false);

// Delete confirmation state (matches patient list flow)
const showDelete = ref(false);
const doctorToDelete = ref<{ id: number; name: string }>({ id: 0, name: "" });

const DoctorDetailModal = defineAsyncComponent(
  () => import("~/components/doctors/DoctorDetailModal.vue")
);
const DoctorEditModal = defineAsyncComponent(
  () => import("~/components/doctors/DoctorEditModal.vue")
);
const DoctorAddModal = defineAsyncComponent(
  () => import("~/components/doctors/DoctorAddModal.vue")
);

// Openers
function openDetail(d: Doctor) {
  selected.value = d;
  showDetail.value = true;
}
function openEdit(d: Doctor) {
  selected.value = d;
  showEdit.value = true;
}
function openAdd() {
  showAdd.value = true;
}

// Delete flow
function confirmDelete(d: Doctor) {
  doctorToDelete.value = { id: d.id, name: d.name };
  showDelete.value = true;
}
function cancelDelete() {
  showDelete.value = false;
  doctorToDelete.value = { id: 0, name: "" };
}
function handleDelete() {
  if (doctorToDelete.value.id) {
    removeDoctor(doctorToDelete.value.id);
  }
  cancelDelete();
}

// Modal events
function onEdited(updated: Doctor) {
  updateDoctor(updated);
}
function onAdded(data: AddDoctorInput) {
  addDoctor(data);
}
</script>

<style scoped>
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

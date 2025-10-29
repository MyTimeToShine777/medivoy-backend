<template>
  <div class="min-h-screen bg-gray-50dark:bg-slate-900 p-4 md:p-6">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <div class="flex items-center gap-4">
          <button
            @click="$router.back()"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1
              class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Doctors at {{ hospital?.name || "Hospital" }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ hospital?.city }}, {{ hospital?.state }} • {{ hospital?.type }}
            </p>
          </div>
        </div>
        <!-- Open Add Modal -->
        <button
          type="button"
          @click="openAdd"
          class="px-3 py-2 rounded-lg text-sm text-white bg-[#E5005B] hover:opacity-95 transition-colors"
          aria-haspopup="dialog"
          aria-controls="doctor-add-modal"
          aria-label="Add Doctor">
          Add Doctor
        </button>
      </div>

      <!-- Hospital Info Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ hospital?.totalBeds }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Total Beds
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ hospital?.availableBeds }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Available Beds
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ filteredDoctors.length }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Total Doctors
            </div>
          </div>
          <div class="text-center">
            <div
              class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ hospital?.departments?.length }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Departments
            </div>
          </div>
        </div>

        <!-- Departments -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Departments:
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="dept in hospital?.departments"
              :key="dept"
              class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
              {{ dept }}
            </span>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search doctors by name, department, or designation..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <select
            v-model="departmentFilter"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">All Departments</option>
            <option
              v-for="dept in hospital?.departments"
              :key="dept"
              :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>

      <!-- Doctors Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <p
            class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Doctor List ({{ filteredDoctors.length }})
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
                <th class="text-left px-4 py-3 font-semibold">Department</th>
                <th class="text-left px-4 py-3 font-semibold">Email</th>
                <th class="text-left px-4 py-3 font-semibold">Degree</th>
                <th class="text-left px-4 py-3 font-semibold">Mobile Number</th>
                <th class="text-left px-4 py-3 font-semibold">Joining Date</th>
                <th class="text-left px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="doc in filteredDoctors"
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
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {{ doc.department }}
                  </span>
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
              <tr v-if="!filteredDoctors.length">
                <td
                  colspan="8"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  {{
                    searchQuery || departmentFilter
                      ? "No doctors found matching your criteria."
                      : "No doctors assigned to this hospital yet."
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Footer -->
        <div
          class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Showing {{ filteredDoctors.length }} entries
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
        :hospital="hospital"
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
            <strong>{{ doctorToDelete.name }}</strong> from
            {{ hospital?.name }}? This action cannot be undone.
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
import { ref, computed, defineAsyncComponent } from "vue";
import type { Doctor, AddDoctorInput } from "~/composables/useDoctorsMock";
import type { Hospital } from "~/composables/useHospitalMock";

// Get hospital ID from route
const route = useRoute();
const hospitalId = parseInt(route.params.id as string);

// Get hospital data
const { getHospitalById, updateHospital } = useHospitalMock();
const hospital = ref<Hospital | undefined>(getHospitalById(hospitalId));

// Get doctors data (filter by hospital - you'll need to modify the doctors mock to include hospitalId)
const { doctors, addDoctor, updateDoctor, removeDoctor } = useDoctorsMock();

// If hospital not found, redirect
if (!hospital.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Hospital not found",
  });
}

// Filter doctors for this hospital (you'll need to add hospitalId to doctor mock data)
const hospitalDoctors = computed(() => {
  // For now, return all doctors - you should filter by hospital.value.id
  // return doctors.value.filter(d => d.hospitalId === hospital.value?.id);
  return doctors.value; // Temporary - showing all doctors
});

// State
const selected = ref<Doctor | null>(null);
const showDetail = ref(false);
const showEdit = ref(false);
const showAdd = ref(false);
const searchQuery = ref("");
const departmentFilter = ref("");

// Delete confirmation state
const showDelete = ref(false);
const doctorToDelete = ref<{ id: number; name: string }>({ id: 0, name: "" });

// Lazy load modals
const DoctorDetailModal = defineAsyncComponent(
  () => import("~/components/doctors/DoctorDetailModal.vue")
);
const DoctorEditModal = defineAsyncComponent(
  () => import("~/components/doctors/DoctorEditModal.vue")
);
const DoctorAddModal = defineAsyncComponent(
  () => import("~/components/doctors/DoctorAddModal.vue")
);

// Filtered doctors based on search and department
const filteredDoctors = computed(() => {
  let filtered = hospitalDoctors.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.designation.toLowerCase().includes(query) ||
        doc.department.toLowerCase().includes(query) ||
        doc.email.toLowerCase().includes(query)
    );
  }

  if (departmentFilter.value) {
    filtered = filtered.filter(
      (doc) => doc.department === departmentFilter.value
    );
  }

  return filtered;
});

// Methods
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

    // Update hospital doctor count
    if (hospital.value) {
      hospital.value.totalDoctors = Math.max(
        0,
        hospital.value.totalDoctors - 1
      );
      updateHospital(hospital.value);
    }
  }
  cancelDelete();
}

// Modal events
function onEdited(updated: Doctor) {
  updateDoctor(updated);
}

function onAdded(data: AddDoctorInput) {
  addDoctor(data);

  // Update hospital doctor count
  if (hospital.value) {
    hospital.value.totalDoctors += 1;
    updateHospital(hospital.value);
  }
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

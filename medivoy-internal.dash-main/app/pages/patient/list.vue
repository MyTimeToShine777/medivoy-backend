<script setup lang="ts">
import PatientAddModal from "~/components/patients/PatientAddModal.vue";
import PatientEditModal from "~/components/patients/PatientEditModal.vue";
import PatientDetailModal from "~/components/patients/PatientDetailModal.vue";

const { patients, addPatient } = usePatientsMock();

// Modal states
const showAdd = ref(false);
const showEdit = ref(false);
const showDetail = ref(false);

// Delete confirmation state
const showDelete = ref(false);
const patientToDelete = ref<{ id: number; name: string }>({ id: 0, name: "" });

// Selected patient for edit/detail
const selectedPatient = ref<any | null>(null);

// Openers
const openAdd = () => {
  showAdd.value = true;
};
const openEdit = (p: any) => {
  selectedPatient.value = { ...p };
  showEdit.value = true;
};
const openDetail = (p: any) => {
  selectedPatient.value = p;
  showDetail.value = true;
};

// Delete flow
const confirmDelete = (p: any) => {
  patientToDelete.value = { id: p.id, name: p.name };
  showDelete.value = true;
};
const cancelDelete = () => {
  showDelete.value = false;
  patientToDelete.value = { id: 0, name: "" };
};
const handleDelete = () => {
  const idx = patients.value.findIndex(
    (p) => p.id === patientToDelete.value.id
  );
  if (idx !== -1) patients.value.splice(idx, 1);
  cancelDelete();
};

// Submit handlers
function handleAddSubmit(data: any) {
  addPatient(data);
  showAdd.value = false;
}
function handleEditSubmit(data: any) {
  if (!selectedPatient.value) return;
  const idx = patients.value.findIndex(
    (p) => p.id === selectedPatient.value.id
  );
  if (idx !== -1) {
    patients.value[idx] = {
      ...patients.value[idx],
      name:
        `${data.firstName} ${data.lastName}`.trim() || patients.value[idx].name,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      address: data.address,
      blood: data.blood,
      sugar: data.sugar,
      mobile: data.mobile,
      age: parseInt(data.age || "0"),
      sex: data.gender,
      gender: data.gender,
      birth: data.birth,
      bp: data.bp,
      injury: data.injury,
    };
  }
  showEdit.value = false;
  selectedPatient.value = null;
}

// Helpers
function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50dark:bg-slate-900 p-4 md:p-6">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Patient List
        </h1>
        <button
          type="button"
          @click="openAdd"
          class="px-3 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95">
          Add Patient
        </button>
      </div>

      <!-- Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <p
            class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Patient List
          </p>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr
                class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                <th class="text-left px-4 py-3 font-semibold">Name</th>
                <th class="text-left px-4 py-3 font-semibold">Sex</th>
                <th class="text-left px-4 py-3 font-semibold">Address</th>
                <th class="text-left px-4 py-3 font-semibold">Mobile Number</th>
                <th class="text-left px-4 py-3 font-semibold">Birth Date</th>
                <th class="text-left px-4 py-3 font-semibold">Age</th>
                <th class="text-left px-4 py-3 font-semibold">Blood Group</th>
                <th class="text-left px-4 py-3 font-semibold">Status</th>
                <th class="text-left px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="p in patients"
                :key="p.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img
                      :src="p.avatar"
                      class="w-8 h-8 rounded-full object-cover"
                      alt="" />
                    <span
                      class="text-gray-900 dark:text-gray-100 font-medium"
                      >{{ p.name }}</span
                    >
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ p.sex }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ p.address }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ p.mobile }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ formatDate(p.birth) }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ p.age }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ p.blood }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ p.status }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <!-- View -> existing PatientDetailModal -->
                    <button
                      class="icon-btn view-btn"
                      title="View Details"
                      @click.stop="openDetail(p)">
                      🔍
                    </button>
                    <!-- Edit -> existing PatientEditModal -->
                    <button
                      class="icon-btn edit-btn"
                      title="Edit Patient"
                      @click.stop="openEdit(p)">
                      ✏️
                    </button>
                    <!-- Add (optional quick add, reuses Add modal) -->
                    <!-- <button class="icon-btn add-btn" title="Add Patient (Quick)" @click.stop="openAdd">➕</button> -->
                    <!-- Delete with confirmation -->
                    <button
                      class="icon-btn delete-btn"
                      title="Delete Patient"
                      @click.stop="confirmDelete(p)">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!patients.length">
                <td
                  colspan="9"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No patients found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div
          class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Showing {{ patients.length }} entries
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

    <!-- Existing modals -->
    <ClientOnly>
      <PatientAddModal
        v-if="showAdd"
        @close="showAdd = false"
        @submit="handleAddSubmit" />
      <PatientEditModal
        v-if="showEdit && selectedPatient"
        :patient="selectedPatient"
        @close="
          showEdit = false;
          selectedPatient = null;
        "
        @submit="handleEditSubmit" />
      <PatientDetailModal
        v-if="showDetail && selectedPatient"
        :patient="selectedPatient"
        @close="
          showDetail = false;
          selectedPatient = null;
        " />
    </ClientOnly>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDelete"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Confirm Delete
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete
            <strong>{{ patientToDelete.name }}</strong
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
.add-btn:hover {
  border-color: #10b981;
  background: #10b98110;
  box-shadow: 0 0 0 3px #10b98110;
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

<template>
  <!-- Same template as before -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0">
    <div
      class="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ hospital.name }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hospital Details & Information
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Info -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Basic Information -->
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Hospital Type
                      </dt>
                      <dd class="mt-1">
                        <span
                          class="px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {{ hospital.type }}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </dt>
                      <dd class="mt-1">
                        <span
                          :class="getStatusColor(hospital.status)"
                          class="px-2 py-1 text-sm font-semibold rounded-full">
                          {{ hospital.status }}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Established
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ hospital.established }}
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Doctors
                      </dt>
                      <dd
                        class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {{ hospital.totalDoctors }}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Location & Contact -->
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Location & Contact
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div class="space-y-4">
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Address
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ hospital.address }}<br />
                        {{ hospital.city }}, {{ hospital.state }}
                      </dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt
                          class="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Phone
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ hospital.phone }}
                        </dd>
                      </div>
                      <div>
                        <dt
                          class="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ hospital.email }}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Departments -->
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Departments ({{ hospital.departments?.length }})
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="dept in hospital.departments"
                    :key="dept"
                    class="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    {{ dept }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Capacity Information -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4
                  class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Hospital Capacity
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Total Beds</span
                    >
                    <span
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                      >{{ hospital.totalBeds }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Available Beds</span
                    >
                    <span
                      class="text-sm font-semibold text-green-600 dark:text-green-400"
                      >{{ hospital.availableBeds }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Occupied Beds</span
                    >
                    <span
                      class="text-sm font-semibold text-red-600 dark:text-red-400"
                      >{{ hospital.totalBeds - hospital.availableBeds }}</span
                    >
                  </div>
                  <div
                    class="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400"
                        >Occupancy Rate</span
                      >
                      <span
                        class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{
                          Math.round(
                            ((hospital.totalBeds - hospital.availableBeds) /
                              hospital.totalBeds) *
                              100
                          )
                        }}%
                      </span>
                    </div>
                    <div
                      class="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        :style="{
                          width:
                            Math.round(
                              ((hospital.totalBeds - hospital.availableBeds) /
                                hospital.totalBeds) *
                                100
                            ) + '%',
                        }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4
                  class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Statistics
                </h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Departments</span
                    >
                    <span
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                      >{{ hospital.departments?.length }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Total Doctors</span
                    >
                    <span
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                      >{{ hospital.totalDoctors }}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Years in Service</span
                    >
                    <span
                      class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{
                        new Date().getFullYear() -
                        parseInt(hospital.established.split("/")[2])
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
          <div class="flex justify-end gap-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              Close
            </button>
            <button
              @click="viewDoctors"
              class="px-4 py-2 bg-[#4565AD] text-white hover:opacity-95 rounded-lg transition-opacity">
              View Doctors ({{ hospital.totalDoctors }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// Remove TypeScript syntax
const props = defineProps({
  hospital: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

function getStatusColor(status) {
  return status === "Active"
    ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
    : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300";
}

function viewDoctors() {
  navigateTo(`/hospital/${props.hospital.id}/doctors`);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50dark:bg-slate-900 p-4 md:p-6">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h1
            class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Hospitals List
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage global healthcare facilities and medical institutions •
            {{ filteredHospitals.length }} of {{ hospitals.length }} hospitals
          </p>
        </div>
        <!-- Open Add Modal -->
        <button
          type="button"
          @click="openAdd"
          class="px-3 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-colors"
          aria-haspopup="dialog"
          aria-controls="hospital-add-modal"
          aria-label="Add Hospital">
          Add Hospital
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Total Hospitals
              </p>
              <p
                class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ hospitals.length }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400">🏥</span>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Countries
              </p>
              <p
                class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ availableCountries.length }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span class="text-green-600 dark:text-green-400">🌍</span>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Total Beds
              </p>
              <p
                class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ totalBeds.toLocaleString() }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span class="text-purple-600 dark:text-purple-400">🛏️</span>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Total Doctors
              </p>
              <p
                class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ totalDoctors.toLocaleString() }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span class="text-emerald-600 dark:text-emerald-400">👨‍⚕️</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Search and Filters -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search hospitals by name, city, country, or type..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
              <svg
                class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <select
              v-model="countryFilter"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] min-w-[150px]">
              <option value="">All Countries</option>
              <option
                v-for="country in availableCountries"
                :key="country"
                :value="country">
                {{ country }}
              </option>
            </select>

            <select
              v-model="typeFilter"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] min-w-[150px]">
              <option value="">All Types</option>
              <option v-for="type in availableTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>

            <select
              v-model="statusFilter"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] min-w-[120px]">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap">
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Filter Summary -->
        <div
          v-if="hasActiveFilters || searchQuery"
          class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap gap-2 items-center text-sm">
            <span class="text-gray-500 dark:text-gray-400">Filters:</span>
            <span
              v-if="searchQuery"
              class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
              Search: "{{ searchQuery }}"
            </span>
            <span
              v-if="countryFilter"
              class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              {{ countryFilter }}
            </span>
            <span
              v-if="typeFilter"
              class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
              {{ typeFilter }}
            </span>
            <span
              v-if="statusFilter"
              class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
              {{ statusFilter }}
            </span>
            <span class="text-gray-500 dark:text-gray-400 ml-auto">
              {{ filteredHospitals.length }} result{{
                filteredHospitals.length !== 1 ? "s" : ""
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- Hospitals Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <p
              class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Hospital Directory
            </p>
            <div
              class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ currentPage }} of {{ totalPages }} pages</span>
              <select
                v-model="itemsPerPage"
                @change="currentPage = 1"
                class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option :value="10">10 per page</option>
                <option :value="25">25 per page</option>
                <option :value="50">50 per page</option>
                <option :value="100">100 per page</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-12 text-center">
          <div
            class="animate-spin w-8 h-8 border-4 border-[#4565AD] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">Loading hospitals...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredHospitals.length === 0"
          class="p-12 text-center">
          <div class="text-6xl mb-4">🏥</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hospitals found
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            {{
              searchQuery || hasActiveFilters
                ? "Try adjusting your search terms or filters"
                : "Add your first hospital to get started"
            }}
          </p>
          <button
            v-if="!searchQuery && !hasActiveFilters"
            @click="openAdd"
            class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
            Add First Hospital
          </button>
          <button
            v-else
            @click="clearFilters"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Clear All Filters
          </button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr
                class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                <th
                  class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                  @click="sortBy('name')">
                  <div class="flex items-center gap-1">
                    <span>Hospital Name</span>
                    <svg
                      v-if="sortField === 'name'"
                      :class="{ 'rotate-180': sortOrder === 'desc' }"
                      class="w-4 h-4 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th class="text-left px-4 py-3 font-semibold">Type & Status</th>
                <th
                  class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                  @click="sortBy('country')">
                  <div class="flex items-center gap-1">
                    <span>Location</span>
                    <svg
                      v-if="sortField === 'country'"
                      :class="{ 'rotate-180': sortOrder === 'desc' }"
                      class="w-4 h-4 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th class="text-left px-4 py-3 font-semibold">Contact</th>
                <th
                  class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                  @click="sortBy('totalBeds')">
                  <div class="flex items-center gap-1">
                    <span>Capacity</span>
                    <svg
                      v-if="sortField === 'totalBeds'"
                      :class="{ 'rotate-180': sortOrder === 'desc' }"
                      class="w-4 h-4 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th
                  class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                  @click="sortBy('totalDoctors')">
                  <div class="flex items-center gap-1">
                    <span>Staff</span>
                    <svg
                      v-if="sortField === 'totalDoctors'"
                      :class="{ 'rotate-180': sortOrder === 'desc' }"
                      class="w-4 h-4 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th class="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="hospital in paginatedHospitals"
                :key="hospital.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                <!-- Hospital Name -->
                <td class="px-4 py-4">
                  <div class="max-w-xs">
                    <div
                      class="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {{ hospital.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Est. {{ hospital.established.split("/")[2] }}
                    </div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="dept in hospital.departments.slice(0, 2)"
                        :key="dept"
                        class="px-1 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded">
                        {{ dept }}
                      </span>
                      <span
                        v-if="hospital.departments.length > 2"
                        class="text-xs text-gray-500 dark:text-gray-400">
                        +{{ hospital.departments.length - 2 }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Type & Status -->
                <td class="px-4 py-4">
                  <div class="space-y-1">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {{ hospital.type }}
                    </span>
                    <div>
                      <span
                        :class="getStatusColor(hospital.status)"
                        class="px-2 py-1 text-xs font-semibold rounded-full">
                        {{ hospital.status }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Location -->
                <td class="px-4 py-4">
                  <div class="text-sm">
                    <div
                      class="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      {{ getCountryFlag(hospital.country) }} {{ hospital.city }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ hospital.state }}
                    </div>
                    <div
                      class="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {{ hospital.country }}
                    </div>
                  </div>
                </td>

                <!-- Contact -->
                <td class="px-4 py-4">
                  <div class="text-xs space-y-1">
                    <div class="flex items-center gap-1">
                      <span>📞</span>
                      <span class="text-gray-700 dark:text-gray-300">{{
                        hospital.phone
                      }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span>✉️</span>
                      <span class="text-gray-700 dark:text-gray-300"
                        >{{ hospital.email.split("@")[0] }}@...</span
                      >
                    </div>
                  </div>
                </td>

                <!-- Capacity -->
                <td class="px-4 py-4">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ hospital.totalBeds.toLocaleString() }} beds
                    </div>
                    <div class="text-xs text-green-600 dark:text-green-400">
                      {{ hospital.availableBeds.toLocaleString() }} available
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{
                        Math.round(
                          ((hospital.totalBeds - hospital.availableBeds) /
                            hospital.totalBeds) *
                            100
                        )
                      }}% occupied
                    </div>
                  </div>
                </td>

                <!-- Staff -->
                <td class="px-4 py-4">
                  <div class="text-sm">
                    <button
                      @click="viewDoctors(hospital)"
                      class="font-medium text-[#4565AD] hover:text-[#b8935f] transition-colors hover:underline">
                      {{ hospital.totalDoctors.toLocaleString() }} doctors
                    </button>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ hospital.departments?.length }} departments
                    </div>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <!-- View Details -->
                    <button
                      class="icon-btn view-btn"
                      title="View Details"
                      @click.stop="openDetail(hospital)">
                      🔍
                    </button>
                    <!-- Edit Hospital -->
                    <button
                      class="icon-btn edit-btn"
                      title="Edit Hospital"
                      @click.stop="openEdit(hospital)">
                      ✏️
                    </button>
                    <!-- Delete with confirmation -->
                    <button
                      class="icon-btn delete-btn"
                      title="Delete Hospital"
                      @click.stop="confirmDelete(hospital)">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Enhanced Pagination -->
        <div
          v-if="totalPages > 1"
          class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-700/50">
          <div
            class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(currentPage * itemsPerPage, filteredHospitals.length)
              }}
              of {{ filteredHospitals.length }} hospitals
            </div>

            <div class="flex items-center gap-2">
              <!-- First Page -->
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ⏮️
              </button>

              <!-- Previous Page -->
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ⬅️ Previous
              </button>

              <!-- Page Numbers -->
              <div class="flex items-center gap-1">
                <button
                  v-for="page in getVisiblePages()"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'px-3 py-2 text-sm border rounded-lg transition-colors',
                    currentPage === page
                      ? 'bg-[#4565AD] text-white border-[#4565AD]'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700',
                  ]">
                  {{ page }}
                </button>
              </div>

              <!-- Next Page -->
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Next ➡️
              </button>

              <!-- Last Page -->
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ⏭️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ClientOnly>
      <HospitalDetailModal
        v-if="showDetail && selected"
        id="hospital-detail-modal"
        :hospital="selected"
        @close="showDetail = false" />
      <HospitalEditModal
        v-if="showEdit && selected"
        id="hospital-edit-modal"
        :hospital="selected"
        @close="showEdit = false"
        @saved="onEdited" />
      <HospitalAddModal
        v-if="showAdd"
        id="hospital-add-modal"
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
        aria-labelledby="hospital-delete-title">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3
              id="hospital-delete-title"
              class="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Hospital
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete
            <strong>{{ hospitalToDelete.name }}</strong
            >? This action cannot be undone and will also remove all associated
            doctors and records.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete Hospital
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, watch, onMounted } from "vue";

// Set page title for head management
useHead({
  title: "Hospital List - Healthcare Dashboard",
});

// Auto-imported composables
const { hospitals, addHospital, updateHospital, removeHospital, getCountries } =
  useHospitalMock();

// State Management
const selected = ref(null);
const showDetail = ref(false);
const showEdit = ref(false);
const showAdd = ref(false);
const isLoading = ref(false);

// Search and Filter State
const searchQuery = ref("");
const countryFilter = ref("");
const typeFilter = ref("");
const statusFilter = ref("");

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref(25);

// Sorting State
const sortField = ref("name");
const sortOrder = ref("asc");

// Delete confirmation state
const showDelete = ref(false);
const hospitalToDelete = ref({ id: 0, name: "" });

// Lazy load modals
const HospitalDetailModal = defineAsyncComponent(() =>
  import("~/components/hospitals/HospitalDetailModal.vue")
);
const HospitalEditModal = defineAsyncComponent(() =>
  import("~/components/hospitals/HospitalEditModal.vue")
);
const HospitalAddModal = defineAsyncComponent(() =>
  import("~/components/hospitals/HospitalAddModal.vue")
);

// Computed Properties
const availableCountries = computed(() => {
  const countries = [...new Set(hospitals.value.map((h) => h.country))];
  return countries.sort();
});

const availableTypes = computed(() => {
  const types = [...new Set(hospitals.value.map((h) => h.type))];
  return types.sort();
});

const hasActiveFilters = computed(() => {
  return countryFilter.value || typeFilter.value || statusFilter.value;
});

const filteredHospitals = computed(() => {
  let filtered = [...hospitals.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.city.toLowerCase().includes(query) ||
        hospital.country.toLowerCase().includes(query) ||
        hospital.type.toLowerCase().includes(query) ||
        hospital.state.toLowerCase().includes(query) ||
        hospital.departments.some((dept) => dept.toLowerCase().includes(query))
    );
  }

  // Apply country filter
  if (countryFilter.value) {
    filtered = filtered.filter(
      (hospital) => hospital.country === countryFilter.value
    );
  }

  // Apply type filter
  if (typeFilter.value) {
    filtered = filtered.filter(
      (hospital) => hospital.type === typeFilter.value
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(
      (hospital) => hospital.status === statusFilter.value
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[sortField.value];
    let bValue = b[sortField.value];

    // Handle different data types
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
});

const paginatedHospitals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredHospitals.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredHospitals.value.length / itemsPerPage.value);
});

// Stats computed properties
const totalBeds = computed(() => {
  return filteredHospitals.value.reduce((sum, h) => sum + h.totalBeds, 0);
});

const totalDoctors = computed(() => {
  return filteredHospitals.value.reduce((sum, h) => sum + h.totalDoctors, 0);
});

// Methods
function openDetail(h) {
  selected.value = h;
  showDetail.value = true;
}

function openEdit(h) {
  selected.value = h;
  showEdit.value = true;
}

function openAdd() {
  showAdd.value = true;
}

function viewDoctors(hospital) {
  navigateTo(`/hospital/${hospital.id}/doctors`);
}

// Delete flow
function confirmDelete(h) {
  hospitalToDelete.value = { id: h.id, name: h.name };
  showDelete.value = true;
}

function cancelDelete() {
  showDelete.value = false;
  hospitalToDelete.value = { id: 0, name: "" };
}

function handleDelete() {
  if (hospitalToDelete.value.id) {
    removeHospital(hospitalToDelete.value.id);
  }
  cancelDelete();
}

// Modal events
function onEdited(updated) {
  updateHospital(updated);
}

function onAdded(data) {
  addHospital(data);
}

// Sorting
function sortBy(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
}

// Pagination
function getVisiblePages() {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;

  let start = Math.max(1, current - delta);
  let end = Math.min(total, current + delta);

  // Adjust if we're near the beginning or end
  if (end - start < delta * 2) {
    if (start === 1) {
      end = Math.min(total, start + delta * 2);
    } else if (end === total) {
      start = Math.max(1, end - delta * 2);
    }
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

// Clear all filters
function clearFilters() {
  searchQuery.value = "";
  countryFilter.value = "";
  typeFilter.value = "";
  statusFilter.value = "";
  currentPage.value = 1;
}

// Utility functions
function getStatusColor(status) {
  return status === "Active"
    ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
    : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300";
}

function getCountryFlag(country) {
  const flags = {
    "United States": "🇺🇸",
    Germany: "🇩🇪",
    Japan: "🇯🇵",
    Singapore: "🇸🇬",
    Canada: "🇨🇦",
    "United Kingdom": "🇬🇧",
    Sweden: "🇸🇪",
    India: "🇮🇳",
    Thailand: "🇹🇭",
    Brazil: "🇧🇷",
    "South Africa": "🇿🇦",
    Malaysia: "🇲🇾",
    France: "🇫🇷",
    "Saudi Arabia": "🇸🇦",
  };
  return flags[country] || "🌍";
}

// Watchers
watch([searchQuery, countryFilter, typeFilter, statusFilter], () => {
  currentPage.value = 1; // Reset to first page when filters change
});

// Load data on mount
onMounted(() => {
  // Data is already loaded from composable
});
</script>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-size: 16px;
  transition: all 0.2s;
  background: transparent;
  cursor: pointer;
}
.icon-btn:hover {
  background: rgba(17, 24, 39, 0.1);
  transform: scale(1.05);
}
.view-btn:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.edit-btn:hover {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}
.delete-btn:hover {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
:global(.dark) .icon-btn {
  border-color: #374151;
}
:global(.dark) .icon-btn:hover {
  background: #374151;
}
</style>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Laboratory Partners Network
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Partner diagnostic laboratories with comprehensive test services • {{ filteredLabs.length }} of {{ labPartners.length }} partners
          </p>
        </div>
        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <button
            @click="exportData"
            class="px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            📥 Export
          </button>
          <button
            type="button"
            @click="openAdd"
            class="px-3 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-colors">
            ➕ Add Laboratory
          </button>
        </div>
      </div>

            <!-- Tabs: Labs vs DNA Kits - ADD THIS -->
      <div class="mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeSection = 'labs'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeSection === 'labs'
              ? 'border-[#4565AD] text-[#4565AD]'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]">
          🏥 Laboratory Partners
        </button>
        <button
          @click="activeSection = 'dna'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeSection === 'dna'
              ? 'border-[#4565AD] text-[#4565AD]'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]">
          🧬 DNA Test Kits
        </button>
      </div>

      <!-- WRAP all your lab content with this -->
      <div v-show="activeSection === 'labs'">
      <!-- ALL YOUR EXISTING LAB CODE STAYS HERE -->


      <!-- Enhanced Stats Cards with More Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Partners</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ labStats.totalPartners }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400">🔬</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Labs</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ labStats.activePartners }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span class="text-green-600 dark:text-green-400">✅</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Tests</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ labStats.totalTests.toLocaleString() }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span class="text-purple-600 dark:text-purple-400">🧪</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Avg Rating</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ labStats.avgRating }} ⭐
              </p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <span class="text-yellow-600 dark:text-yellow-400">⭐</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Locations</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ labStats.totalLocations.toLocaleString() }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span class="text-emerald-600 dark:text-emerald-400">📍</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Reviews</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ (labStats.totalReviews / 1000).toFixed(0) }}K
              </p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <span class="text-orange-600 dark:text-orange-400">💬</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Search and Filters Section -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <!-- Search Box -->
          <div class="lg:col-span-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="🔍 Search by name, specialty, location, or certification..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Specialty Filter -->
          <select
            v-model="specialtyFilter"
            class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
            <option value="">All Specialties</option>
            <option v-for="spec in availableSpecialties" :key="spec" :value="spec">
              {{ spec }}
            </option>
          </select>

          <!-- Certification Filter -->
          <select
            v-model="certificationFilter"
            class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
            <option value="">All Certifications</option>
            <option value="NABL">NABL Certified</option>
            <option value="CAP">CAP Certified</option>
            <option value="ISO">ISO Certified</option>
            <option value="JCI">JCI Certified</option>
          </select>

          <!-- Sort By -->
          <select
            v-model="sortBy"
            class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="reviews">Sort by Reviews</option>
            <option value="tests">Sort by Tests</option>
            <option value="locations">Sort by Locations</option>
            <option value="established">Sort by Year</option>
          </select>
        </div>

        <!-- Quick Filter Tags -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Quick Filters:</span>
          
          <button
            @click="toggleFilter('homeCollection')"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
              activeFilters.homeCollection
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]">
            🏠 Home Collection
          </button>

          <button
            @click="toggleFilter('highRated')"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
              activeFilters.highRated
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]">
            ⭐ 4.5+ Rated
          </button>

          <button
            @click="toggleFilter('activeOnly')"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
              activeFilters.activeOnly
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]">
            ✅ Active Only
          </button>

          <button
            @click="toggleFilter('fastTurnaround')"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all',
              activeFilters.fastTurnaround
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]">
            ⚡ Fast Results
          </button>

          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="ml-auto px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
            🔄 Reset All
          </button>

          <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {{ filteredLabs.length }} result{{ filteredLabs.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Active Filters Summary -->
        <div v-if="searchQuery || specialtyFilter || certificationFilter" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap gap-2 items-center text-sm">
            <span class="text-gray-500 dark:text-gray-400 text-xs">Active Filters:</span>
            <span
              v-if="searchQuery"
              class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
              Search: "{{ searchQuery }}"
            </span>
            <span
              v-if="specialtyFilter"
              class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
              Specialty: {{ specialtyFilter }}
            </span>
            <span
              v-if="certificationFilter"
              class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
              {{ certificationFilter }}
            </span>
          </div>
        </div>
      </div>

      <!-- View Toggle (Table/Grid) -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
          <button
            @click="viewMode = 'table'"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              viewMode === 'table'
                ? 'bg-[#4565AD] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            ]">
            📋 Table
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              viewMode === 'grid'
                ? 'bg-[#4565AD] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            ]">
            📱 Grid
          </button>
        </div>

        <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <select
            v-model="itemsPerPage"
            @change="currentPage = 1"
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option :value="6">6 per page</option>
            <option :value="12">12 per page</option>
            <option :value="24">24 per page</option>
            <option :value="48">48 per page</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-[#4565AD] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">Loading laboratory partners...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredLabs.length === 0" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div class="text-6xl mb-4">🔬</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No laboratories found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          {{ searchQuery || hasActiveFilters ? 'Try adjusting your filters or search terms' : 'Add your first laboratory partner to get started' }}
        </p>
        <button
          @click="clearAllFilters"
          class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
          {{ searchQuery || hasActiveFilters ? 'Clear Filters' : 'Add Laboratory' }}
        </button>
      </div>

      <!-- TABLE VIEW -->
      <div v-else-if="viewMode === 'table'" class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <p class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Laboratory Directory • {{ filteredLabs.length }} Partners
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                <th class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50" @click="changeSortField('name')">
                  <div class="flex items-center gap-1">
                    Laboratory Name
                    <svg v-if="sortBy === 'name'" :class="{ 'rotate-180': sortOrder === 'desc' }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th class="text-left px-4 py-3 font-semibold">Specialties</th>
                <th class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50" @click="changeSortField('locations')">
                  <div class="flex items-center gap-1">
                    Locations
                    <svg v-if="sortBy === 'locations'" :class="{ 'rotate-180': sortOrder === 'desc' }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50" @click="changeSortField('tests')">
                  <div class="flex items-center gap-1">
                    Tests
                    <svg v-if="sortBy === 'tests'" :class="{ 'rotate-180': sortOrder === 'desc' }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th class="text-left px-4 py-3 font-semibold cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50" @click="changeSortField('rating')">
                  <div class="flex items-center gap-1">
                    Rating
                    <svg v-if="sortBy === 'rating'" :class="{ 'rotate-180': sortOrder === 'desc' }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  </div>
                </th>
                <th class="text-left px-4 py-3 font-semibold">Features</th>
                <th class="text-left px-4 py-3 font-semibold">Status</th>
                <th class="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="lab in paginatedLabs"
                :key="lab.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                <!-- Lab Name -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="text-3xl">{{ lab.logo }}</div>
                    <div class="max-w-xs">
                      <div class="font-medium text-gray-900 dark:text-gray-100">
                        {{ lab.name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        Est. {{ lab.establishedYear }}
                      </div>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="cert in lab.certifications.slice(0, 2)"
                          :key="cert"
                          class="px-1 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                          {{ cert }}
                        </span>
                        <span v-if="lab.certifications.length > 2" class="text-xs text-gray-500 dark:text-gray-400">
                          +{{ lab.certifications.length - 2 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Specialties -->
                <td class="px-4 py-4">
                  <div class="flex flex-wrap gap-1 max-w-xs">
                    <span
                      v-for="(spec, idx) in lab.specialties.slice(0, 2)"
                      :key="idx"
                      class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full whitespace-nowrap">
                      {{ spec }}
                    </span>
                    <span
                      v-if="lab.specialties.length > 2"
                      class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                      +{{ lab.specialties.length - 2 }}
                    </span>
                  </div>
                </td>

                <!-- Locations -->
                <td class="px-4 py-4">
                  <div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ lab.locations.toLocaleString() }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ lab.turnaroundTime }}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {{ lab.operatingHours }}
                    </div>
                  </div>
                </td>

                <!-- Tests Offered -->
                <td class="px-4 py-4">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ lab.testsOffered.toLocaleString() }}
                  </div>
                  <div class="text-xs text-blue-600 dark:text-blue-400">
                    {{ lab.discount }}% discount
                  </div>
                </td>

                <!-- Rating -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-1 mb-1">
                    <span class="text-yellow-500">⭐</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ lab.rating }}</span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ (lab.reviews / 1000).toFixed(0) }}K reviews
                  </div>
                </td>

                <!-- Features -->
                <td class="px-4 py-4">
                  <div class="space-y-1">
                    <div v-if="lab.homeCollection" class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <span>🏠</span>
                      <span>Home Collection</span>
                    </div>
                    <div v-if="lab.onlineReports" class="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <span>💻</span>
                      <span>Online Reports</span>
                    </div>
                    <div v-if="lab.emergencySupport" class="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <span>🚨</span>
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-4 py-4">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      lab.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    ]">
                    {{ lab.isActive ? '✅ Active' : '❌ Inactive' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      class="icon-btn view-btn"
                      title="View Details & Book Test"
                      @click.stop="openDetail(lab)">
                      🔍
                    </button>
                    <button
                      class="icon-btn edit-btn"
                      title="Edit Laboratory"
                      @click.stop="openEdit(lab)">
                      ✏️
                    </button>
                    <button
                      class="icon-btn delete-btn"
                      title="Delete Laboratory"
                      @click.stop="confirmDelete(lab)">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer with Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-700/50">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredLabs.length) }}
              of {{ filteredLabs.length }} laboratories
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ⏮️ First
              </button>
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ⬅️ Prev
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
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]">
                  {{ page }}
                </button>
              </div>

              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Next ➡️
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Last ⏭️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- GRID VIEW -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="lab in paginatedLabs"
          :key="lab.id"
          class="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-[#4565AD] dark:hover:border-[#4565AD] hover:shadow-xl transition-all overflow-hidden">
          
          <!-- Card Header -->
          <div class="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <div v-if="!lab.isActive" class="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              Inactive
            </div>
            <div class="flex items-center gap-4">
              <div class="text-5xl">{{ lab.logo }}</div>
              <div>
                <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ lab.name }}</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Est. {{ lab.establishedYear }}</p>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6">
            <!-- Rating -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-1">
                <span class="text-yellow-500 text-xl">⭐</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ lab.rating }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">({{ (lab.reviews / 1000).toFixed(0) }}K)</span>
              </div>
              <div class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                {{ lab.discount }}% OFF
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="font-bold text-gray-900 dark:text-white">{{ lab.testsOffered }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Tests</div>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="font-bold text-gray-900 dark:text-white">{{ lab.locations.toLocaleString() }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Locations</div>
              </div>
            </div>

            <!-- Specialties -->
            <div class="mb-4">
              <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Specialties:</div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(spec, idx) in lab.specialties.slice(0, 3)"
                  :key="idx"
                  class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  {{ spec }}
                </span>
                <span v-if="lab.specialties.length > 3" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  +{{ lab.specialties.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Features -->
            <div class="flex flex-wrap gap-2 mb-4">
              <div v-if="lab.homeCollection" class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <span>🏠</span>
                <span>Home Service</span>
              </div>
              <div v-if="lab.onlineReports" class="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <span>💻</span>
                <span>Online Reports</span>
              </div>
            </div>

            <!-- Certifications -->
            <div class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="cert in lab.certifications"
                :key="cert"
                class="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                {{ cert }}
              </span>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <button
                @click="openDetail(lab)"
                class="w-full px-4 py-2.5 bg-[#4565AD] text-white rounded-lg font-medium hover:opacity-95 transition-all">
                🔍 View Details & Book Test
              </button>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="openEdit(lab)"
                  class="px-3 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50">
                  ✏️ Edit
                </button>
                <button
                  @click="confirmDelete(lab)"
                  class="px-3 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination for Grid View -->
        <div v-if="totalPages > 1" class="col-span-full mt-4">
          <div class="flex items-center justify-center gap-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              ← Previous
            </button>
            <span class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>

    </div><!-- CLOSE Labs Section -->

      <!-- DNA TEST KITS SECTION -->
      <div v-show="activeSection === 'dna'">
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">🧬 DNA Ancestry & Health Test Kits</h2>
          <p class="text-gray-600 dark:text-gray-300">Discover your genetic heritage, trace your ancestry, and unlock health insights with leading DNA test kits. Order online and receive your kit at home—simple saliva collection, detailed results in 4-8 weeks.</p>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><span>📋</span> How DNA Test Kits Work</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="text-center"><div class="text-3xl mb-2">📦</div><h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">Order Kit</h4><p class="text-xs text-gray-600 dark:text-gray-400">Purchase online and receive your kit in 3-5 days</p></div>
            <div class="text-center"><div class="text-3xl mb-2">💧</div><h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">Collect Sample</h4><p class="text-xs text-gray-600 dark:text-gray-400">Provide saliva sample or cheek swab at home</p></div>
            <div class="text-center"><div class="text-3xl mb-2">📬</div><h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">Mail Back</h4><p class="text-xs text-gray-600 dark:text-gray-400">Use prepaid envelope to send to the lab</p></div>
            <div class="text-center"><div class="text-3xl mb-2">🔬</div><h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">Lab Analysis</h4><p class="text-xs text-gray-600 dark:text-gray-400">DNA extracted and analyzed against reference database</p></div>
            <div class="text-center"><div class="text-3xl mb-2">📊</div><h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">View Results</h4><p class="text-xs text-gray-600 dark:text-gray-400">Access detailed ancestry & health reports online</p></div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="kit in dnaKits" :key="kit.id" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#4565AD] hover:shadow-lg transition-all overflow-hidden">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="text-5xl">{{ kit.logo }}</div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ kit.name }}</h3>
                    <div class="flex items-center gap-1 mt-1">
                      <span class="text-yellow-500">⭐</span>
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ kit.rating }} ({{ kit.reviews.toLocaleString() }} reviews)</span>
                    </div>
                  </div>
                </div>
                <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">{{ kit.category }}</span>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ kit.description }}</p>

              <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Best For:</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ kit.bestFor }}</p>
              </div>

              <div class="mb-4">
                <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features:</p>
                <div class="grid grid-cols-1 gap-2">
                  <div v-for="feature in kit.features" :key="feature" class="flex items-center gap-2 text-xs">
                    <span class="text-green-500">✓</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ feature }}</span>
                  </div>
                </div>
              </div>

              <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">What's Included:</p>
                <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li v-for="item in kit.included" :key="item">• {{ item }}</li>
                </ul>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div><p class="text-gray-500 dark:text-gray-400">Sample Type</p><p class="font-semibold text-gray-900 dark:text-white">{{ kit.sampleType }}</p></div>
                <div><p class="text-gray-500 dark:text-gray-400">Results Time</p><p class="font-semibold text-gray-900 dark:text-white">{{ kit.resultsTime }}</p></div>
                <div><p class="text-gray-500 dark:text-gray-400">Database Size</p><p class="font-semibold text-gray-900 dark:text-white">{{ kit.databaseSize }}</p></div>
                <div><p class="text-gray-500 dark:text-gray-400">Privacy</p><p class="font-semibold text-gray-900 dark:text-white">{{ kit.privacy }}</p></div>
              </div>

              <div class="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Kit Price</p>
                    <div class="flex items-center gap-2">
                      <span class="text-2xl font-bold text-gray-900 dark:text-white">₹{{ kit.price.toLocaleString() }}</span>
                      <span v-if="kit.originalPrice" class="text-sm text-gray-500 dark:text-gray-400 line-through">₹{{ kit.originalPrice.toLocaleString() }}</span>
                    </div>
                  </div>
                  <div v-if="kit.discount" class="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">{{ kit.discount }}% OFF</div>
                </div>
              </div>

              <button @click="openDNAOrder(kit)" class="w-full px-4 py-3 bg-[#4565AD] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span>🧬</span>
                <span>Order Kit & Enter Shipping Address</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Modals -->
<ClientOnly>
  <LaboratoryDetailModal
    v-if="showDetail && selected"
    :laboratory="selected"
    @close="showDetail = false"
    @book-test="openBookTest"
  />

   <!-- DNA Order Modal -->
  <DNAOrderModal
    v-if="showDNAOrder && selectedKit"
    :kit="selectedKit"
    @close="showDNAOrder = false"
    @ordered="onDNAOrdered"
  />

  <LaboratoryEditModal
    v-if="showEdit && selected"
    :laboratory="selected"
    @close="showEdit = false"
    @saved="onEdited"
  />

  <LaboratoryAddModal
    v-if="showAdd"
    @close="showAdd = false"
    @saved="onAdded"
  />

  <!-- FIXED: pass :show and correct prop :lab -->
  <BookTestModal
    v-if="showBookTest && selected"
    :show="showBookTest"
    :lab="selected"
    @close="showBookTest = false"
    @booked="onTestBooked"
  />
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
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.834-1.964-.834-2.732 0L4.268 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Laboratory Partner
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete <strong>{{ labToDelete.name }}</strong>?
            This will remove all associated test packages and booking history. This action cannot be undone.
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
              Delete Laboratory
            </button>
          </div>
        </div>
      </div>
    </Transition>
  
</template>

<script setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue'

// Composables - LABORATORY FIRST
const {
  labPartners,
  labStats,
  updateLabPartner,
  deleteLabPartner,
  addLabPartner
} = useLaboratoryMock()

// ADD DNA Composable AFTER lab composable
const { dnaKits, addDNAOrder } = useDNAKits()

// State
const selected = ref(null)
const showDetail = ref(false)
const showEdit = ref(false)
const showAdd = ref(false)
const showBookTest = ref(false)
const isLoading = ref(false)
const viewMode = ref('table') // 'table' or 'grid'
const activeSection = ref('labs')

// ADD DNA state
const showDNAOrder = ref(false)
const selectedKit = ref(null)

// Filters
const searchQuery = ref('')
const specialtyFilter = ref('')
const certificationFilter = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')
const activeFilters = ref({
  homeCollection: false,
  highRated: false,
  activeOnly: false,
  fastTurnaround: false
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Delete confirmation
const showDelete = ref(false)
const labToDelete = ref({ id: 0, name: '' })

// Lazy load modals
const LaboratoryDetailModal = defineAsyncComponent(() =>
  import('~/components/laboratory/LaboratoryDetailModal.vue')
)
const LaboratoryEditModal = defineAsyncComponent(() =>
  import('~/components/laboratory/LaboratoryEditModal.vue')
)
const LaboratoryAddModal = defineAsyncComponent(() =>
  import('~/components/laboratory/LaboratoryAddModal.vue')
)
const BookTestModal = defineAsyncComponent(() =>
  import('~/components/laboratory/BookTestModal.vue')
)

// ADD DNA Modal lazy loading
const DNAOrderModal = defineAsyncComponent(() =>
  import('~/components/laboratory/DNAOrderModal.vue')
)

// Computed
const availableSpecialties = computed(() => {
  const specs = new Set()
  labPartners.value.forEach(lab => {
    lab.specialties.forEach(s => specs.add(s))
  })
  return Array.from(specs).sort()
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || specialtyFilter.value || certificationFilter.value ||
         Object.values(activeFilters.value).some(v => v)
})

const filteredLabs = computed(() => {
  let filtered = [...labPartners.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(lab =>
      lab.name.toLowerCase().includes(query) ||
      lab.description.toLowerCase().includes(query) ||
      lab.specialties.some(s => s.toLowerCase().includes(query)) ||
      lab.certifications.some(c => c.toLowerCase().includes(query))
    )
  }

  // Specialty filter
  if (specialtyFilter.value) {
    filtered = filtered.filter(lab =>
      lab.specialties.includes(specialtyFilter.value)
    )
  }

  // Certification filter
  if (certificationFilter.value) {
    filtered = filtered.filter(lab =>
      lab.certifications.some(c => c.includes(certificationFilter.value))
    )
  }

  // Quick filters
  if (activeFilters.value.homeCollection) {
    filtered = filtered.filter(lab => lab.homeCollection)
  }
  if (activeFilters.value.highRated) {
    filtered = filtered.filter(lab => lab.rating >= 4.5)
  }
  if (activeFilters.value.activeOnly) {
    filtered = filtered.filter(lab => lab.isActive)
  }
  if (activeFilters.value.fastTurnaround) {
    filtered = filtered.filter(lab => 
      lab.turnaroundTime.includes('24') || lab.turnaroundTime.includes('Same day')
    )
  }

  // Sorting
  filtered.sort((a, b) => {
    let aVal, bVal
    switch (sortBy.value) {
      case 'rating':
        aVal = a.rating
        bVal = b.rating
        break
      case 'reviews':
        aVal = a.reviews
        bVal = b.reviews
        break
      case 'tests':
        aVal = a.testsOffered
        bVal = b.testsOffered
        break
      case 'locations':
        aVal = a.locations
        bVal = b.locations
        break
      case 'established':
        aVal = a.establishedYear
        bVal = b.establishedYear
        break
      default:
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredLabs.value.length / itemsPerPage.value)
})

const paginatedLabs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredLabs.value.slice(start, start + itemsPerPage.value)
})

// Methods
function toggleFilter(filterName) {
  activeFilters.value[filterName] = !activeFilters.value[filterName]
}

function clearAllFilters() {
  searchQuery.value = ''
  specialtyFilter.value = ''
  certificationFilter.value = ''
  activeFilters.value = {
    homeCollection: false,
    highRated: false,
    activeOnly: false,
    fastTurnaround: false
  }
  currentPage.value = 1
}

function changeSortField(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

function getVisiblePages() {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2

  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)

  if (end - start < delta * 2) {
    if (start === 1) {
      end = Math.min(total, start + delta * 2)
    } else if (end === total) {
      start = Math.max(1, end - delta * 2)
    }
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

function openDetail(lab) {
  selected.value = lab
  showDetail.value = true
}

function openEdit(lab) {
  selected.value = lab
  showEdit.value = true
}

function openAdd() {
  showAdd.value = true
}

function openBookTest(lab) {
  selected.value = lab
  showDetail.value = false
  showBookTest.value = true
}

function confirmDelete(lab) {
  labToDelete.value = { id: lab.id, name: lab.name }
  showDelete.value = true
}

function cancelDelete() {
  showDelete.value = false
  labToDelete.value = { id: 0, name: '' }
}

function handleDelete() {
  if (labToDelete.value.id) {
    deleteLabPartner(labToDelete.value.id)
  }
  cancelDelete()
}

function onEdited(updated) {
  updateLabPartner(updated.id, updated)
}

function onAdded(data) {
  addLabPartner(data)
}

function onTestBooked(booking) {
  console.log('Test booked:', booking)
}

function exportData() {
  const data = JSON.stringify(filteredLabs.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laboratory-partners-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ADD DNA methods
function openDNAOrder(kit) {
  selectedKit.value = kit
  showDNAOrder.value = true
}

function onDNAOrdered(data) {
  addDNAOrder(data)
  showDNAOrder.value = false
  alert(`✅ Order Confirmed!\n\n${data.kit.name} will be delivered to:\n${data.address.street}\n${data.address.city}, ${data.address.state} ${data.address.pincode}`)
}

// Watchers
watch([searchQuery, specialtyFilter, certificationFilter, activeFilters], () => {
  currentPage.value = 1
}, { deep: true })
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

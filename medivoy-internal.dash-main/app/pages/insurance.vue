<!-- pages/insurance.vue -->
<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Hero Header -->
    <div class="bg-gradient-to-r from-[#db465f] to-[#5078cf] rounded-2xl p-8 md:p-12 text-white mb-8">
      <div class="max-w-6xl">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-3xl md:text-5xl font-bold mb-4">
              International Insurance with <span class="text-yellow-300">Medivoy</span>
            </h1>
            <p class="text-lg md:text-xl text-blue-100 mb-6">
              Comprehensive admin panel to manage international insurance providers, policies, claims, and network partnerships.
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="showActivityLog = true"
              class="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
              📊
            </button>
          </div>
        </div>

        <!-- Enhanced Statistics Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div class="flex items-center gap-3 bg-white/10 rounded-xl p-4">
            <div class="text-3xl">🏢</div>
            <div>
              <div class="text-xl font-bold">{{ stats.totalCompanies }}</div>
              <div class="text-xs text-blue-100">Total Providers</div>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-white/10 rounded-xl p-4">
            <div class="text-3xl">✅</div>
            <div>
              <div class="text-xl font-bold">{{ stats.activeCompanies }}</div>
              <div class="text-xs text-blue-100">Active Plans</div>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-white/10 rounded-xl p-4">
            <div class="text-3xl">📋</div>
            <div>
              <div class="text-xl font-bold">{{ stats.totalPolicies.toLocaleString() }}</div>
              <div class="text-xs text-blue-100">Total Policies</div>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-white/10 rounded-xl p-4">
            <div class="text-3xl">💯</div>
            <div>
              <div class="text-xl font-bold">{{ stats.avgSettlementRatio }}%</div>
              <div class="text-xs text-blue-100">Avg Settlement</div>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-white/10 rounded-xl p-4">
            <div class="text-3xl">⭐</div>
            <div>
              <div class="text-xl font-bold">{{ stats.featuredCount }}</div>
              <div class="text-xs text-blue-100">Featured Plans</div>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-white/10 rounded-xl p-4">
            <div class="text-3xl">💰</div>
            <div>
              <div class="text-xl font-bold">${{ (stats.totalCommission / 1000000).toFixed(1) }}M</div>
              <div class="text-xs text-blue-100">Total Commission</div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            @click="openAddModal"
            class="px-6 py-3 bg-white text-[#4565AD] rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all">
            ➕ Add Insurance Provider
          </button>
          <button
            @click="exportData"
            class="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-bold shadow-lg hover:bg-yellow-300 transition-all">
            📥 Export Data
          </button>
          <button
            v-if="selectedProviders.length > 0"
            @click="showBulkActions = !showBulkActions"
            class="px-6 py-3 bg-orange-400 text-gray-900 rounded-xl font-bold shadow-lg hover:bg-orange-300 transition-all">
            🔧 Bulk Actions ({{ selectedProviders.length }})
          </button>
        </div>

        <!-- Bulk Actions Bar -->
        <div v-if="showBulkActions && selectedProviders.length > 0" class="mt-4 p-4 bg-white/10 rounded-xl">
          <div class="flex flex-wrap gap-3">
            <button @click="bulkActivate" class="px-4 py-2 bg-green-500 rounded-lg font-bold text-white hover:bg-green-600">
              ✅ Activate Selected
            </button>
            <button @click="bulkDeactivate" class="px-4 py-2 bg-red-500 rounded-lg font-bold text-white hover:bg-red-600">
              ❌ Deactivate Selected
            </button>
            <button @click="bulkDeleteSelected" class="px-4 py-2 bg-red-700 rounded-lg font-bold text-white hover:bg-red-800">
              🗑️ Delete Selected
            </button>
            <button @click="clearSelection" class="px-4 py-2 bg-gray-500 rounded-lg font-bold text-white hover:bg-gray-600">
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters & Controls -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search providers, plans, countries..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
          />
        </div>
        <select v-model="filterRegion" class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Regions</option>
          <option value="Europe">Europe</option>
          <option value="Americas">Americas</option>
          <option value="Asia Pacific">Asia Pacific</option>
          <option value="Middle East">Middle East</option>
          <option value="Africa">Africa</option>
        </select>
        <select v-model="filterPlanType" class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Plan Types</option>
          <option value="basic">Basic</option>
          <option value="comprehensive">Comprehensive</option>
          <option value="premium">Premium</option>
        </select>
        <select v-model="filterStatus" class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select v-model="sortBy" class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="name">Sort by Name</option>
          <option value="premium">Sort by Premium</option>
          <option value="rating">Sort by Rating</option>
          <option value="settlement">Sort by Settlement</option>
          <option value="policies">Sort by Policies</option>
          <option value="commission">Sort by Commission</option>
        </select>
      </div>

      <!-- Quick Filters -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="filterFeatured = !filterFeatured"
          :class="[
            'px-3 py-1 text-xs font-bold rounded-full transition-all',
            filterFeatured
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          ]">
          ⭐ Featured Only
        </button>
        <button
          @click="filterPopular = !filterPopular"
          :class="[
            'px-3 py-1 text-xs font-bold rounded-full transition-all',
            filterPopular
              ? 'bg-green-400 text-gray-900'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          ]">
          🔥 Popular Only
        </button>
        <button
          @click="resetFilters"
          v-if="hasActiveFilters"
          class="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 hover:bg-red-200">
          🔄 Reset Filters
        </button>
        <div class="ml-auto flex items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredInsurances.length }} of {{ insurances.length }} providers
          </span>
        </div>
      </div>
    </div>

    <!-- Insurance Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="insurance in paginatedInsurances"
        :key="insurance.id"
        :class="[
          'bg-white dark:bg-gray-900 rounded-xl border-2 overflow-hidden hover:shadow-2xl transition-all relative',
          selectedProviders.includes(insurance.id)
            ? 'border-[#4565AD] dark:border-[#4BBECF] ring-2 ring-[#4565AD]/20'
            : insurance.isPopular
            ? 'border-[#4565AD]/50 dark:border-[#4BBECF]/50'
            : 'border-gray-200 dark:border-gray-800',
        ]">

        <!-- Selection Checkbox -->
        <div class="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            :value="insurance.id"
            v-model="selectedProviders"
            class="w-5 h-5 text-[#4565AD] rounded border-gray-300 focus:ring-[#4565AD]"
          />
        </div>

        <!-- Status & Feature Badges -->
        <div class="absolute top-4 right-4 flex flex-col gap-1 z-10">
          <span v-if="insurance.isFeatured" class="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
            ⭐ FEATURED
          </span>
          <span v-if="insurance.isPopular" class="px-2 py-1 bg-green-400 text-gray-900 text-xs font-bold rounded-full">
            🔥 POPULAR
          </span>
          <span :class="[
            'px-2 py-1 text-xs font-bold rounded-full',
            insurance.status === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          ]">
            {{ insurance.status.toUpperCase() }}
          </span>
        </div>

        <div class="p-6 pt-12">
          <!-- Company Header -->
          <div class="text-center mb-6">
            <img :src="insurance.companyLogo" :alt="insurance.companyName" class="w-20 h-20 mx-auto rounded-lg mb-3 object-cover shadow-md" />
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ insurance.companyName }}
            </h3>
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              {{ insurance.country }} · {{ insurance.region }}
            </span>
          </div>

          <!-- Plan Name -->
          <div class="text-center mb-4">
            <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {{ insurance.planName }}
            </h4>
            <span :class="planTypeBadge(insurance.planType)" class="inline-block px-3 py-1 text-xs font-bold rounded-full mt-2 capitalize">
              {{ insurance.planType }}
            </span>
          </div>

          <!-- Price & Commission -->
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-[#4565AD] dark:text-[#4BBECF] mb-1">
              {{ formatCurrency(insurance.premium, insurance.currency) }}
            </div>
            <div class="text-gray-500 dark:text-gray-400 text-sm">
              Annual Premium
            </div>
            <div class="text-green-600 dark:text-green-400 font-semibold text-sm mt-1">
              Coverage: {{ formatCurrency(insurance.coverageAmount, insurance.currency) }}
            </div>
            <div class="text-orange-600 dark:text-orange-400 font-semibold text-xs mt-1">
              Commission: {{ insurance.commission }}%
            </div>
          </div>

          <!-- Enhanced Stats Grid -->
          <div class="grid grid-cols-2 gap-2 mb-6">
            <div class="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="font-bold text-sm text-gray-900 dark:text-white">
                {{ insurance.networkSize.toLocaleString() }}
              </div>
              <div class="text-xs text-gray-500">Network</div>
            </div>
            <div class="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="font-bold text-sm text-gray-900 dark:text-white">
                {{ insurance.claimSettlementRatio }}%
              </div>
              <div class="text-xs text-gray-500">Settlement</div>
            </div>
            <div class="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="font-bold text-sm text-gray-900 dark:text-white">
                {{ insurance.customerRating }}/5
              </div>
              <div class="text-xs text-gray-500">Rating</div>
            </div>
            <div class="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="font-bold text-sm text-gray-900 dark:text-white">
                {{ insurance.activePolicies }}
              </div>
              <div class="text-xs text-gray-500">Policies</div>
            </div>
          </div>

          <!-- Key Coverage (FIXED) -->
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
              Key Coverage:
            </h4>
            <div class="flex flex-wrap gap-1">
              <template v-for="(coverageValue, coverageKey, idx) in insurance.coverage" :key="coverageKey">
                <span v-if="coverageValue && idx < 6" class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  {{ formatCoverageLabel(coverageKey) }}
                </span>
              </template>
              <span v-if="Object.values(insurance.coverage).filter(v => v).length > 6" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">
                +{{ Object.values(insurance.coverage).filter(v => v).length - 6 }}
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex gap-1 mb-4">
            <button
              @click="toggleFeaturedStatus(insurance)"
              :class="[
                'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
                insurance.isFeatured
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              ]">
              ⭐
            </button>
            <button
              @click="togglePopularStatus(insurance)"
              :class="[
                'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
                insurance.isPopular
                  ? 'bg-green-400 text-gray-900 hover:bg-green-500'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              ]">
              🔥
            </button>
            <button
              @click="toggleStatusAction(insurance)"
              :class="[
                'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
                insurance.status === 'active'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              ]">
              {{ insurance.status === 'active' ? '✅' : '❌' }}
            </button>
          </div>

          <!-- Main Actions -->
          <div class="space-y-2">
            <button
              @click="viewDetails(insurance)"
              class="w-full py-3 bg-[#4565AD] text-white rounded-lg font-semibold hover:bg-[#3a5599] transition-all">
              👁️ View Full Details
            </button>
            <div class="flex gap-2">
              <button
                @click="editInsurance(insurance)"
                class="flex-1 py-2 border border-blue-300 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20">
                ✏️ Edit
              </button>
              <button
                @click="duplicateInsurance(insurance)"
                class="flex-1 py-2 border border-green-300 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20">
                📋 Duplicate
              </button>
              <button
                @click="confirmDelete(insurance)"
                class="flex-1 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredInsurances.length === 0" class="col-span-full text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No providers found</h3>
        <p class="text-gray-500 dark:text-gray-400">Try adjusting your filters or add a new provider</p>
        <button @click="resetFilters" class="mt-4 px-6 py-2 bg-[#4565AD] text-white rounded-lg font-semibold">
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
      <button
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
        ← Previous
      </button>
      <span class="px-4 py-2 text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
        Next →
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="modal">
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" @click.self="closeModals">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ showEditModal ? '✏️ Edit Insurance Provider' : '➕ Add Insurance Provider' }}
            </h3>
            <button @click="closeModals" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">×</button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Company Information -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Company Information</h4>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name *</label>
                  <input v-model="form.companyName" type="text" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country *</label>
                  <input v-model="form.country" type="text" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Region *</label>
                  <select v-model="form.region" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Region</option>
                    <option value="Europe">Europe</option>
                    <option value="Americas">Americas</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Africa">Africa</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Logo URL</label>
                  <input v-model="form.companyLogo" type="url" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>

              <!-- Plan Details -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Plan Details</h4>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Name *</label>
                  <input v-model="form.planName" type="text" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Type *</label>
                  <select v-model="form.planType" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Type</option>
                    <option value="basic">Basic</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coverage Amount *</label>
                  <input v-model.number="form.coverageAmount" type="number" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency *</label>
                  <select v-model="form.currency" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
              </div>

              <!-- Pricing & Commission -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Commission</h4>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Annual Premium *</label>
                  <input v-model.number="form.premium" type="number" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deductible *</label>
                  <input v-model.number="form.deductible" type="number" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commission Rate (%) *</label>
                  <input v-model.number="form.commission" type="number" min="0" max="50" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Network Size</label>
                  <input v-model.number="form.networkSize" type="number" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Coverage Options (FIXED) -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Coverage Options</h4>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <label v-for="(coverageValue, coverageKey) in form.coverage" :key="coverageKey" class="flex items-center gap-2">
                  <input v-model="form.coverage[coverageKey]" type="checkbox" class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ formatCoverageLabel(coverageKey) }}</span>
                </label>
              </div>
            </div>

            <!-- Contact Information -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Name *</label>
                  <input v-model="form.contactPerson.name" type="text" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                  <input v-model="form.contactPerson.email" type="email" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                  <input v-model="form.contactPerson.phone" type="tel" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position *</label>
                  <input v-model="form.contactPerson.position" type="text" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings & Status</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select v-model="form.status" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2">
                    <input v-model="form.isFeatured" type="checkbox" class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">⭐ Featured Plan</span>
                  </label>
                </div>
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2">
                    <input v-model="form.isPopular" type="checkbox" class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">🔥 Popular Plan</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="closeModals" class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-6 py-3 bg-[#4565AD] text-white rounded-lg font-semibold hover:bg-[#3a5599]">
                {{ showEditModal ? 'Update Insurance' : 'Add Insurance' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Details Modal -->
    <Transition name="modal">
      <div v-if="showDetailsModal && selectedInsurance" class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" @click.self="showDetailsModal = false">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div class="flex items-center gap-3">
              <img :src="selectedInsurance.companyLogo" :alt="selectedInsurance.companyName" class="w-12 h-12 rounded-lg object-cover" />
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ selectedInsurance.companyName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedInsurance.planName }}</p>
              </div>
            </div>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">×</button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Price Info -->
            <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <div class="text-3xl font-bold text-[#4565AD] dark:text-[#4BBECF]">
                  {{ formatCurrency(selectedInsurance.premium, selectedInsurance.currency) }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Annual Premium • Commission: {{ selectedInsurance.commission }}%
                </div>
              </div>
              <button @click="editInsurance(selectedInsurance)" class="px-6 py-3 bg-[#4565AD] text-white rounded-lg font-semibold hover:bg-[#3a5599]">
                Edit Insurance
              </button>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-500 mb-1">Coverage</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm">
                  {{ formatCurrency(selectedInsurance.coverageAmount, selectedInsurance.currency) }}
                </div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-500 mb-1">Network</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm">
                  {{ selectedInsurance.networkSize.toLocaleString() }}
                </div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-500 mb-1">Settlement</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm">
                  {{ selectedInsurance.claimSettlementRatio }}%
                </div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-500 mb-1">Rating</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm">
                  {{ selectedInsurance.customerRating }}/5 ({{ selectedInsurance.reviewCount }})
                </div>
              </div>
            </div>

            <!-- Coverage Options (FIXED) -->
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Coverage Options</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div v-for="(coverageValue, coverageKey) in selectedInsurance.coverage" :key="coverageKey" class="flex items-center gap-2 text-sm">
                  <span :class="coverageValue ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-700'">
                    {{ coverageValue ? '✓' : '✗' }}
                  </span>
                  <span :class="coverageValue ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'">
                    {{ formatCoverageLabel(coverageKey) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div v-if="selectedInsurance.benefits?.length">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Key Benefits</h4>
              <div class="space-y-2">
                <div v-for="(benefit, idx) in selectedInsurance.benefits" :key="idx" class="flex items-start gap-2 text-sm">
                  <span class="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ benefit }}</span>
                </div>
              </div>
            </div>

            <!-- Exclusions -->
            <div v-if="selectedInsurance.exclusions?.length">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Exclusions</h4>
              <div class="space-y-2">
                <div v-for="(exclusion, idx) in selectedInsurance.exclusions" :key="idx" class="flex items-start gap-2 text-sm">
                  <span class="text-red-600 dark:text-red-400 mt-0.5">✗</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ exclusion }}</span>
                </div>
              </div>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Contact Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mb-1">Name</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ selectedInsurance.contactPerson.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mb-1">Position</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ selectedInsurance.contactPerson.position }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mb-1">Email</p>
                  <a :href="`mailto:${selectedInsurance.contactPerson.email}`" class="font-medium text-[#4565AD] dark:text-[#4BBECF] hover:underline">
                    {{ selectedInsurance.contactPerson.email }}
                  </a>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mb-1">Phone</p>
                  <a :href="`tel:${selectedInsurance.contactPerson.phone}`" class="font-medium text-[#4565AD] dark:text-[#4BBECF] hover:underline">
                    {{ selectedInsurance.contactPerson.phone }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div v-if="selectedInsurance.documents?.length">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Documents</h4>
              <div class="space-y-2">
                <a v-for="(doc, idx) in selectedInsurance.documents" :key="idx" :href="doc.url" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="text-2xl">📄</div>
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white text-sm">{{ doc.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-500">{{ doc.size }} · {{ doc.type.toUpperCase() }}</div>
                    </div>
                  </div>
                  <div class="text-[#4565AD] dark:text-[#4BBECF]">📥</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Modal -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" @click.self="showDeleteModal = false">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
          <div class="text-center mb-6">
            <div class="text-5xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Insurance Provider
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete <strong>{{ selectedInsurance?.companyName }}</strong>? This action cannot be undone.
            </p>
          </div>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button @click="handleDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Activity Log Modal -->
    <Transition name="modal">
      <div v-if="showActivityLog" class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" @click.self="showActivityLog = false">
        <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">📊 Activity Log</h3>
            <button @click="showActivityLog = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">×</button>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="log in activityLog" :key="log.id" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-start justify-between mb-2">
                  <div class="font-semibold text-gray-900 dark:text-white">{{ log.action }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(log.timestamp) }}</div>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300 mb-1">{{ log.item }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-500">{{ log.details }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInsuranceMock } from '~/composables/useInsuranceMock'

const {
  insurances,
  activityLog,
  insuranceStats: stats,
  addInsurance,
  updateInsurance,
  deleteInsurance,
  bulkUpdateStatus,
  bulkDelete,
  toggleFeatured,
  togglePopular
} = useInsuranceMock()

// State
const searchQuery = ref('')
const filterRegion = ref('all')
const filterPlanType = ref('all')
const filterStatus = ref('all')
const filterFeatured = ref(false)
const filterPopular = ref(false)
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const selectedProviders = ref([])
const showBulkActions = ref(false)

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const showActivityLog = ref(false)
const selectedInsurance = ref(null)

// Form
const emptyForm = () => ({
  companyName: '',
  companyLogo: '',
  country: '',
  region: '',
  planName: '',
  planType: '',
  coverageAmount: 0,
  currency: 'USD',
  premium: 0,
  deductible: 0,
  coinsurance: 0,
  copay: 0,
  networkSize: 0,
  networkType: 'global',
  claimProcess: 'cashless',
  commission: 10,
  waitingPeriod: 30,
  coverage: {
    inpatient: false,
    outpatient: false,
    emergency: false,
    dental: false,
    vision: false,
    maternity: false,
    mentalHealth: false,
    prescriptionDrugs: false,
    preventiveCare: false,
    rehabilitation: false
  },
  contactPerson: { name: '', email: '', phone: '', position: '' },
  status: 'active',
  isFeatured: false,
  isPopular: false
})

const form = ref(emptyForm())

// Computed
const filteredInsurances = computed(() => {
  let list = [...insurances.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(ins =>
      ins.companyName?.toLowerCase().includes(q) ||
      ins.planName?.toLowerCase().includes(q) ||
      ins.country?.toLowerCase().includes(q)
    )
  }

  if (filterRegion.value !== 'all') list = list.filter(ins => ins.region === filterRegion.value)
  if (filterPlanType.value !== 'all') list = list.filter(ins => ins.planType === filterPlanType.value)
  if (filterStatus.value !== 'all') list = list.filter(ins => ins.status === filterStatus.value)
  if (filterFeatured.value) list = list.filter(ins => ins.isFeatured)
  if (filterPopular.value) list = list.filter(ins => ins.isPopular)

  // Sort
  list.sort((a, b) => {
    switch (sortBy.value) {
      case 'premium':
        return b.premium - a.premium
      case 'rating':
        return b.customerRating - a.customerRating
      case 'settlement':
        return b.claimSettlementRatio - a.claimSettlementRatio
      case 'policies':
        return b.activePolicies - a.activePolicies
      case 'commission':
        return b.commission - a.commission
      default:
        return a.companyName.localeCompare(b.companyName)
    }
  })

  return list
})

const totalPages = computed(() => Math.ceil(filteredInsurances.value.length / itemsPerPage.value))
const paginatedInsurances = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredInsurances.value.slice(start, start + itemsPerPage.value)
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || filterRegion.value !== 'all' || filterPlanType.value !== 'all' || 
         filterStatus.value !== 'all' || filterFeatured.value || filterPopular.value
})

// Utilities
const planTypeBadge = (type) => {
  const map = {
    basic: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
    comprehensive: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    premium: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
  }
  return map[type] || map.basic
}

const formatCurrency = (amount, currency) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: currency || 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(amount || 0)

const formatCoverageLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// Actions
const resetFilters = () => {
  searchQuery.value = ''
  filterRegion.value = 'all'
  filterPlanType.value = 'all'
  filterStatus.value = 'all'
  filterFeatured.value = false
  filterPopular.value = false
  sortBy.value = 'name'
  currentPage.value = 1
}

const openAddModal = () => {
  Object.assign(form.value, emptyForm())
  selectedInsurance.value = null
  showAddModal.value = true
}

const editInsurance = (insurance) => {
  selectedInsurance.value = insurance
  Object.assign(form.value, JSON.parse(JSON.stringify(insurance)))
  showEditModal.value = true
  showDetailsModal.value = false
}

const duplicateInsurance = (insurance) => {
  const duplicated = JSON.parse(JSON.stringify(insurance))
  duplicated.companyName += ' (Copy)'
  duplicated.planName += ' (Copy)'
  delete duplicated.id
  Object.assign(form.value, duplicated)
  selectedInsurance.value = null
  showAddModal.value = true
}

const viewDetails = (insurance) => {
  selectedInsurance.value = insurance
  showDetailsModal.value = true
}

const confirmDelete = (insurance) => {
  selectedInsurance.value = insurance
  showDeleteModal.value = true
}

const handleDelete = () => {
  if (selectedInsurance.value) {
    deleteInsurance(selectedInsurance.value.id)
    showDeleteModal.value = false
    showDetailsModal.value = false
    selectedInsurance.value = null
  }
}

const handleSubmit = () => {
  if (showEditModal.value && selectedInsurance.value) {
    updateInsurance(selectedInsurance.value.id, form.value)
  } else {
    addInsurance(form.value)
  }
  closeModals()
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedInsurance.value = null
}

const toggleFeaturedStatus = (insurance) => {
  toggleFeatured(insurance.id)
}

const togglePopularStatus = (insurance) => {
  togglePopular(insurance.id)
}

const toggleStatusAction = (insurance) => {
  const newStatus = insurance.status === 'active' ? 'inactive' : 'active'
  updateInsurance(insurance.id, { status: newStatus })
}

// Bulk actions
const bulkActivate = () => {
  bulkUpdateStatus(selectedProviders.value, 'active')
  clearSelection()
}

const bulkDeactivate = () => {
  bulkUpdateStatus(selectedProviders.value, 'inactive')
  clearSelection()
}

const bulkDeleteSelected = () => {
  if (confirm(`Delete ${selectedProviders.value.length} providers?`)) {
    bulkDelete(selectedProviders.value)
    clearSelection()
  }
}

const clearSelection = () => {
  selectedProviders.value = []
  showBulkActions.value = false
}

const exportData = () => {
  const data = JSON.stringify(filteredInsurances.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `insurance-providers-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>

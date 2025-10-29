<template>
  <Teleport to="body">
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
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="text-5xl">{{ laboratory.logo }}</div>
                <div>
                  <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ laboratory.name }}
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Laboratory Partner Details & Services
                  </p>
                </div>
              </div>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>


          <!-- Content -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Main Content - 2 columns -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Rating & Status Banner -->
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                      <span class="text-3xl">⭐</span>
                      <div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ laboratory.rating }}</div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">{{ laboratory.reviews.toLocaleString() }} reviews</div>
                      </div>
                    </div>
                    <div class="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div>
                      <span :class="[
                        'px-3 py-1.5 text-sm font-bold rounded-full',
                        laboratory.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      ]">
                        {{ laboratory.isActive ? '✅ Active Partner' : '❌ Inactive' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ laboratory.discount }}% OFF</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Special Discount</div>
                  </div>
                </div>


                <!-- About -->
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>📋</span> About Laboratory
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {{ laboratory.description }}
                  </p>
                </div>


                <!-- Key Information -->
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>ℹ️</span> Key Information
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Established Year</dt>
                      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.establishedYear }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Locations</dt>
                      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.locations.toLocaleString() }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tests Offered</dt>
                      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.testsOffered.toLocaleString() }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Turnaround Time</dt>
                      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.turnaroundTime }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Operating Hours</dt>
                      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.operatingHours }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Staff</dt>
                      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.totalStaff?.toLocaleString() || 'N/A' }}</dd>
                    </div>
                  </div>
                </div>


                <!-- Certifications -->
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>🏅</span> Certifications & Accreditations
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="cert in laboratory.certifications"
                      :key="cert"
                      class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-semibold">
                      ✓ {{ cert }}
                    </span>
                  </div>
                </div>


                <!-- Specialties -->
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>🎯</span> Specialties ({{ laboratory.specialties.length }})
                  </h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div
                      v-for="specialty in laboratory.specialties"
                      :key="specialty"
                      class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span class="text-blue-600 dark:text-blue-400">✓</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ specialty }}</span>
                    </div>
                  </div>
                </div>


                <!-- Contact Information -->
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>📞</span> Contact Information
                  </h3>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <span class="text-gray-400">📍</span>
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{ laboratory.address }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-gray-400">📞</span>
                      <a :href="`tel:${laboratory.phone}`" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {{ laboratory.phone }}
                      </a>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-gray-400">✉️</span>
                      <a :href="`mailto:${laboratory.email}`" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {{ laboratory.email }}
                      </a>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-gray-400">🌐</span>
                      <a :href="`https://${laboratory.website}`" target="_blank" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {{ laboratory.website }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>


              <!-- Sidebar - 1 column -->
              <div class="space-y-6">
                <!-- Quick Stats -->
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Network Size</span>
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.labNetwork?.toLocaleString() || laboratory.locations.toLocaleString() }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Tests Available</span>
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ laboratory.testsOffered }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Customer Reviews</span>
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ (laboratory.reviews / 1000).toFixed(0) }}K</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                      <span class="text-sm font-semibold text-yellow-600 dark:text-yellow-400">⭐ {{ laboratory.rating }}</span>
                    </div>
                  </div>
                </div>


                <!-- Services Available -->
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Services Available</h4>
                  <div class="space-y-3">
                    <div :class="[
                      'flex items-center gap-3 p-3 rounded-lg',
                      laboratory.homeCollection ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'
                    ]">
                      <span :class="laboratory.homeCollection ? 'text-green-600' : 'text-gray-400'">🏠</span>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">Home Collection</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ laboratory.homeCollection ? 'Available' : 'Not Available' }}
                        </div>
                      </div>
                      <span v-if="laboratory.homeCollection" class="text-green-600 dark:text-green-400">✓</span>
                    </div>


                    <div :class="[
                      'flex items-center gap-3 p-3 rounded-lg',
                      laboratory.onlineReports ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'
                    ]">
                      <span :class="laboratory.onlineReports ? 'text-blue-600' : 'text-gray-400'">💻</span>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">Online Reports</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ laboratory.onlineReports ? 'Available' : 'Not Available' }}
                        </div>
                      </div>
                      <span v-if="laboratory.onlineReports" class="text-blue-600 dark:text-blue-400">✓</span>
                    </div>


                    <div :class="[
                      'flex items-center gap-3 p-3 rounded-lg',
                      laboratory.emergencySupport ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'
                    ]">
                      <span :class="laboratory.emergencySupport ? 'text-red-600' : 'text-gray-400'">🚨</span>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">24/7 Support</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ laboratory.emergencySupport ? 'Available' : 'Not Available' }}
                        </div>
                      </div>
                      <span v-if="laboratory.emergencySupport" class="text-red-600 dark:text-red-400">✓</span>
                    </div>
                  </div>
                </div>


                <!-- Discount Badge -->
                <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div class="text-center">
                    <div class="text-4xl font-bold mb-2">{{ laboratory.discount }}%</div>
                    <div class="text-sm font-medium">Special Discount</div>
                    <div class="text-xs opacity-80 mt-1">Available on all tests</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- Footer Actions -->
          <div class="sticky bottom-0 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <div class="flex justify-end gap-3">
              <button
                @click="$emit('close')"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Close
              </button>
              <button
                @click="bookTest"
                class="px-6 py-2 bg-[#4565AD] text-white rounded-lg font-semibold hover:opacity-95 transition-opacity flex items-center gap-2">
                <span>🧪</span>
                <span>Book Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>


<script setup>
const props = defineProps({
  laboratory: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'book-test'])

function bookTest() {
  emit('book-test', props.laboratory)
}
</script>

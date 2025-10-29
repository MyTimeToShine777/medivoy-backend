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
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Laboratory Partner
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update laboratory information and details
                </p>
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

          <!-- Form -->
          <form @submit.prevent="handleSubmit">
            <div class="p-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Laboratory Name *
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                      placeholder="Enter laboratory name" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Logo Emoji *
                    </label>
                    <input
                      v-model="form.logo"
                      type="text"
                      required
                      maxlength="2"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      placeholder="🔬" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      v-model="form.description"
                      required
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] resize-none"
                      placeholder="Brief description of the laboratory"></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <input
                      v-model="form.address"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      placeholder="Full address" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone *
                      </label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="+91-xxx-xxx-xxxx" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="email@lab.com" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      v-model="form.website"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                      placeholder="www.laboratory.com" />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Established Year *
                      </label>
                      <input
                        v-model.number="form.establishedYear"
                        type="number"
                        required
                        min="1900"
                        :max="new Date().getFullYear()"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="2000" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Staff
                      </label>
                      <input
                        v-model.number="form.totalStaff"
                        type="number"
                        min="0"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="500" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating
                      </label>
                      <input
                        v-model.number="form.rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="4.8" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reviews Count
                      </label>
                      <input
                        v-model.number="form.reviews"
                        type="number"
                        min="0"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="125000" />
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tests Offered *
                      </label>
                      <input
                        v-model.number="form.testsOffered"
                        type="number"
                        required
                        min="1"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="850" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Locations *
                      </label>
                      <input
                        v-model.number="form.locations"
                        type="number"
                        required
                        min="1"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="100" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Turnaround Time *
                      </label>
                      <input
                        v-model="form.turnaroundTime"
                        type="text"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="24-48 hours" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Operating Hours *
                      </label>
                      <input
                        v-model="form.operatingHours"
                        type="text"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="24/7" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount (%)
                      </label>
                      <input
                        v-model.number="form.discount"
                        type="number"
                        min="0"
                        max="100"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                        placeholder="10" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status *
                      </label>
                      <select
                        v-model="form.isActive"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                        <option :value="true">Active</option>
                        <option :value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <!-- Certifications -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Certifications * <span class="text-xs text-gray-500">(Select at least one)</span>
                    </label>
                    <div class="grid grid-cols-2 gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg max-h-32 overflow-y-auto">
                      <label v-for="cert in availableCertifications" :key="cert" class="flex items-center gap-2">
                        <input
                          v-model="form.certifications"
                          type="checkbox"
                          :value="cert"
                          class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ cert }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Specialties -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Specialties * <span class="text-xs text-gray-500">(Select at least one)</span>
                    </label>
                    <div class="grid grid-cols-2 gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                      <label v-for="spec in availableSpecialties" :key="spec" class="flex items-center gap-2">
                        <input
                          v-model="form.specialties"
                          type="checkbox"
                          :value="spec"
                          class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ spec }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Services -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Services Available
                    </label>
                    <label class="flex items-center gap-2">
                      <input
                        v-model="form.homeCollection"
                        type="checkbox"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-sm text-gray-700 dark:text-gray-300">🏠 Home Collection</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input
                        v-model="form.onlineReports"
                        type="checkbox"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-sm text-gray-700 dark:text-gray-300">💻 Online Reports</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input
                        v-model="form.emergencySupport"
                        type="checkbox"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-sm text-gray-700 dark:text-gray-300">🚨 24/7 Emergency Support</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-6 py-2 bg-[#4565AD] text-white hover:opacity-95 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2">
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {{ isSubmitting ? 'Updating...' : 'Update Laboratory' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  laboratory: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const isSubmitting = ref(false)

const availableCertifications = [
  'NABL',
  'CAP',
  'ISO 9001:2015',
  'ISO 15189',
  'JCI',
  'CLIA',
  'COFRAC'
]

const availableSpecialties = [
  'Thyroid Panel',
  'Diabetes Screening',
  'Vitamin Deficiency',
  'Hormone Tests',
  'Blood Tests',
  'Cancer Screening',
  'Genetic Testing',
  'Allergy Testing',
  'Cardiac Risk',
  'Toxicology',
  'Infectious Disease',
  'Microbiology'
]

const form = reactive({
  id: props.laboratory.id,
  name: props.laboratory.name,
  logo: props.laboratory.logo,
  description: props.laboratory.description,
  address: props.laboratory.address,
  phone: props.laboratory.phone,
  email: props.laboratory.email,
  website: props.laboratory.website,
  establishedYear: props.laboratory.establishedYear,
  totalStaff: props.laboratory.totalStaff || 0,
  testsOffered: props.laboratory.testsOffered,
  locations: props.laboratory.locations,
  turnaroundTime: props.laboratory.turnaroundTime,
  operatingHours: props.laboratory.operatingHours,
  discount: props.laboratory.discount,
  isActive: props.laboratory.isActive,
  certifications: [...props.laboratory.certifications],
  specialties: [...props.laboratory.specialties],
  homeCollection: props.laboratory.homeCollection,
  onlineReports: props.laboratory.onlineReports,
  emergencySupport: props.laboratory.emergencySupport || false,
  rating: props.laboratory.rating,
  reviews: props.laboratory.reviews
})

// Keep form in sync if different lab is opened
watch(
  () => props.laboratory,
  (lab) => {
    form.id = lab.id
    form.name = lab.name
    form.logo = lab.logo
    form.description = lab.description
    form.address = lab.address
    form.phone = lab.phone
    form.email = lab.email
    form.website = lab.website
    form.establishedYear = lab.establishedYear
    form.totalStaff = lab.totalStaff || 0
    form.testsOffered = lab.testsOffered
    form.locations = lab.locations
    form.turnaroundTime = lab.turnaroundTime
    form.operatingHours = lab.operatingHours
    form.discount = lab.discount
    form.isActive = lab.isActive
    form.certifications = [...lab.certifications]
    form.specialties = [...lab.specialties]
    form.homeCollection = lab.homeCollection
    form.onlineReports = lab.onlineReports
    form.emergencySupport = lab.emergencySupport || false
    form.rating = lab.rating
    form.reviews = lab.reviews
  },
  { deep: true }
)

const handleSubmit = async () => {
  if (form.certifications.length === 0) {
    alert('Please select at least one certification')
    return
  }

  if (form.specialties.length === 0) {
    alert('Please select at least one specialty')
    return
  }

  isSubmitting.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('saved', { ...form })
    emit('close')
  } catch (error) {
    console.error('Error updating laboratory:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

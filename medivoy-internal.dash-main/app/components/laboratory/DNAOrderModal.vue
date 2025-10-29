<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200"
                leave-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
           role="dialog" aria-modal="true" @click.self="$emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <!-- Header -->
          <div class="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="text-5xl">{{ kit.logo }}</div>
                <div>
                  <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Order {{ kit.name }}</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter shipping address for kit delivery</p>
                </div>
              </div>
              <button type="button" @click="$emit('close')"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form Content -->
          <div class="p-6">
            <form @submit.prevent="submitOrder" class="space-y-6">
              <!-- Personal Information -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>👤</span> Personal Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.fullName" type="text" required
                           class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                           placeholder="Enter your full name"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.email" type="email" required
                           class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                           placeholder="your.email@example.com"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.phone" type="tel" required
                           class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                           placeholder="+91 98765 43210"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.dob" type="date" required
                           class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"/>
                  </div>
                </div>
              </div>

              <!-- Shipping Address -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📍</span> Shipping Address
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address / Flat No. <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.address.street" type="text" required
                           class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                           placeholder="Flat 101, Building Name, Street"/>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span class="text-red-500">*</span>
                      </label>
                      <input v-model="form.address.city" type="text" required
                             class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                             placeholder="Mumbai"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State <span class="text-red-500">*</span>
                      </label>
                      <select v-model="form.address.state" required
                              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Rajasthan">Rajasthan</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        PIN Code <span class="text-red-500">*</span>
                      </label>
                      <input v-model="form.address.pincode" type="text" required pattern="[0-9]{6}"
                             class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                             placeholder="400001"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <input v-model="form.address.country" type="text" disabled
                             class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"/>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Landmark (Optional)
                    </label>
                    <input v-model="form.address.landmark" type="text"
                           class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                           placeholder="Near Metro Station, Opposite Mall"/>
                  </div>
                </div>
              </div>

              <!-- ID Verification -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🆔</span> ID Verification
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Type <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.idType" required
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                      <option value="">Select ID Type</option>
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="Passport">Passport</option>
                      <option value="DrivingLicense">Driving License</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Number <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.idNumber" type="text" required
                           class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                           placeholder="Enter ID number"/>
                  </div>
                </div>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  * ID verification required to link sample to your account
                </p>
              </div>

              <!-- Terms & Conditions -->
              <div>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input v-model="form.agreeTerms" type="checkbox" required
                         class="mt-1 w-4 h-4 text-[#4565AD] border-gray-300 rounded focus:ring-2 focus:ring-[#4565AD]"/>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the terms & conditions, privacy policy, and consent to genetic testing and data storage.
                  </span>
                </label>
              </div>

              <!-- Order Summary -->
              <div class="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Order Summary</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Kit Price:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">₹{{ kit.price.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Shipping:</span>
                    <span class="font-semibold text-green-600 dark:text-green-400">FREE</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                    <span class="font-bold text-gray-900 dark:text-white">Total:</span>
                    <span class="font-bold text-gray-900 dark:text-white">₹{{ kit.price.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3">
                <button type="button" @click="$emit('close')"
                        class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit"
                        class="flex-1 px-4 py-3 bg-[#4565AD] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Confirm Order & Pay ₹{{ kit.price.toLocaleString() }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  kit: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'ordered', data: any): void
}>()

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    landmark: ''
  },
  idType: '',
  idNumber: '',
  agreeTerms: false
})

function submitOrder() {
  const orderData = {
    kit: props.kit,
    ...form.value,
    orderDate: new Date().toISOString(),
    orderNumber: `DNA${Date.now()}`,
    status: 'Confirmed'
  }
  
  emit('ordered', orderData)
}
</script>

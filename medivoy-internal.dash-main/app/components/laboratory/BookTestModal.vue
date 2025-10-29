<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200"
                  leave-active-class="transition-opacity duration-200"
                  enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="show" class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
             role="dialog" aria-modal="true" @click.self="close">
          <div class="bg-white dark:bg-gray-800 rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="text-5xl">{{ lab.logo }}</div>
                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                      Book Tests - {{ lab.name }}
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Lab-specific catalog • {{ lab.discount }}% discount on eligible tests
                    </p>
                  </div>
                </div>
                <button type="button" @click="close"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Controls -->
              <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div class="relative">
                  <input v-model="searchQuery" type="text" placeholder="🔍 Search tests (name, parameters)…"
                         class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"/>
                  <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                <div class="flex gap-3">
                  <select v-model="selectedCategory"
                          class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="">All Categories</option>
                    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <select v-model="sortBy"
                          class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="name">Name (A–Z)</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="discount">Best Discount</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                <div class="flex items-center gap-3">
                  <select v-model="sampleType"
                          class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="">Any Sample</option>
                    <option v-for="t in sampleTypes" :key="t" :value="t">{{ t }}</option>
                  </select>
                  <select v-model="reporting"
                          class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="">Any TAT</option>
                    <option value="6h">≤ 6 hours</option>
                    <option value="24h">≤ 24 hours</option>
                    <option value="48h">≤ 48 hours</option>
                    <option value="72h">≤ 72 hours</option>
                  </select>
                </div>
              </div>

              <!-- Tabs -->
              <div class="mt-4 flex items-center gap-2">
                <button
                  v-for="t in tabs"
                  :key="t.key"
                  @click="activeTab = t.key"
                  :class="[
                    'px-3 py-1.5 text-sm font-medium rounded-full border',
                    activeTab === t.key
                      ? 'bg-[#4565AD] text-white border-[#4565AD]'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#4565AD]'
                  ]">
                  {{ t.label }}
                </button>
              </div>

              <!-- Sticky cart summary -->
              <div v-if="cart.length > 0"
                   class="mt-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-900/20 px-4 py-3 flex items-center justify-between">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  🛒 {{ cart.length }} selected •
                  <span class="line-through">₹{{ nf.format(originalTotal) }}</span>
                  <span class="ml-2 font-semibold text-green-600 dark:text-green-400">₹{{ nf.format(discountedTotal) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" @click="clearCart"
                          class="text-sm text-red-600 dark:text-red-400 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                    Clear
                  </button>
                  <button type="button" @click="openConfirm"
                          class="text-sm font-semibold px-4 py-1.5 rounded bg-[#4565AD] text-white hover:opacity-95">
                    Proceed to Book
                  </button>
                </div>
              </div>
            </div>

            <!-- Body: All, Categories, Packages (same UI as before) -->
            <div class="p-6">
              <section v-show="activeTab === 'all'">
                <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  Showing {{ pagedAll.length }} of {{ filteredAll.length }} tests
                </div>

                <div v-if="filteredAll.length === 0" class="text-center py-12">
                  <div class="text-6xl mb-4">🔬</div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No tests match the filters</h3>
                  <button type="button" @click="resetFilters" class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95">Reset Filters</button>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    v-for="t in pagedAll"
                    :key="t.id"
                    @click="toggleCart(t)"
                    :class="[
                      'bg-white dark:bg-gray-900 rounded-xl border-2 transition-all cursor-pointer',
                      inCart(t.id) ? 'border-green-500 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-[#4565AD] hover:shadow-md'
                    ]">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ text(t.name) }}</h3>
                          <div class="flex flex-wrap gap-1">
                            <span v-if="text(t.category)" class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                              {{ text(t.category) }}
                            </span>
                          </div>
                        </div>
                        <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center', inCart(t.id) ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600']">
                          <svg v-if="inCart(t.id)" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div class="p-4">
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{{ text(t.description) }}</p>
                      <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><span>💉</span><span>{{ text(t.sampleType) || '—' }}</span></div>
                        <div class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><span>⏱️</span><span>{{ timeText(t.reportTime || t.reportingTime) || '—' }}</span></div>
                      </div>
                      <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 line-through" v-if="money(t.originalPrice || t.price)">₹{{ nf.format(money(t.originalPrice || t.price)) }}</div>
                          <div class="text-xl font-bold text-gray-900 dark:text-white">₹{{ nf.format(money(t.discountedPrice || t.price)) }}</div>
                        </div>
                        <div class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">
                          {{ discountPct(t) }}% OFF
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPagesAll > 1" class="mt-6 flex items-center justify-center gap-2">
                  <button type="button" @click="prevPage" :disabled="page === 1"
                          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">← Previous</button>
                  <span class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Page {{ page }} of {{ totalPagesAll }}</span>
                  <button type="button" @click="nextPage" :disabled="page === totalPagesAll"
                          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">Next →</button>
                </div>
              </section>

              <!-- Categories -->
              <section v-show="activeTab === 'categories'" class="mt-2">
                <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">Browse by category</div>
                <div class="space-y-4">
                  <div v-for="cat in categories" :key="cat" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button type="button" class="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-900"
                            @click="toggleOpen(cat)">
                      <div class="flex items-center gap-2">
                        <span class="text-xl">📦</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ cat }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">({{ byCategory[cat]?.length || 0 }})</span>
                      </div>
                      <span class="text-gray-400">{{ isOpen(cat) ? '▲' : '▼' }}</span>
                    </button>
                    <div v-if="isOpen(cat)" class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div
                        v-for="t in byCategory[cat]" :key="t.id" @click="toggleCart(t)"
                        :class="[
                          'bg-white dark:bg-gray-900 rounded-xl border-2 transition-all cursor-pointer',
                          inCart(t.id) ? 'border-green-500 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-[#4565AD] hover:shadow-md'
                        ]">
                        <div class="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                          <h4 class="font-semibold text-gray-900 dark:text-white">{{ text(t.name) }}</h4>
                          <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center', inCart(t.id) ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600']">
                            <svg v-if="inCart(t.id)" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        </div>
                        <div class="p-4">
                          <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{{ text(t.description) }}</p>
                          <div class="flex items-center justify-between">
                            <div class="text-sm font-bold text-gray-900 dark:text-white">₹{{ nf.format(money(t.discountedPrice || t.price)) }}</div>
                            <div class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold rounded">
                              {{ discountPct(t) }}% OFF
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Packages -->
              <section v-show="activeTab === 'packages'" class="mt-2">
                <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">Curated health packages</div>
                <div v-if="packages.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
                  No packages available.
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="p in packages" :key="p.id"
                       class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div class="flex items-center justify-between">
                        <h4 class="font-semibold text-gray-900 dark:text-white">{{ text(p.name) }}</h4>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ (p.tests?.length || 0) }} tests</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{{ text(p.description) }}</p>
                    </div>
                    <div class="p-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 line-through" v-if="money(p.originalPrice)">₹{{ nf.format(money(p.originalPrice)) }}</div>
                          <div class="text-xl font-bold text-gray-900 dark:text-white">₹{{ nf.format(money(p.discountedPrice || p.price)) }}</div>
                        </div>
                        <div class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">
                          {{ pct(p.discount) }}% OFF
                        </div>
                      </div>
                      <button type="button" @click="addPackage(p)"
                              class="mt-3 w-full px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95">
                        Add Package
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Footer -->
            <div class="sticky bottom-0 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ cart.length }} item{{ cart.length === 1 ? '' : 's' }} in cart
                </div>
                <div class="flex gap-3">
                  <button type="button" @click="close" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                    Cancel
                  </button>
                  <button v-if="cart.length > 0" type="button" @click="openConfirm"
                          class="px-6 py-2 bg-[#4565AD] text-white rounded-lg font-semibold hover:opacity-95 flex items-center gap-2">
                    <span>🛒</span>
                    <span>Proceed • ₹{{ nf.format(discountedTotal) }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmation Dialog -->
          <div v-if="confirmOpen"
               class="fixed inset-0 z-[110] flex items-center justify-center p-4"
               @click.self="confirmOpen = false">
            <div class="w-full max-w-xl rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Confirm Booking</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Please review sample requirements and preparation.</p>
              </div>
              <div class="px-6 py-4 space-y-4">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Selected Tests ({{ cart.length }})</h4>
                  <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                    <li v-for="t in cart" :key="t.id">{{ text(t.name) }} — ₹{{ nf.format(money(t.discountedPrice || t.price)) }}</li>
                  </ul>
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Samples Needed</h4>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ samplesNeeded }}</p>
                </div>
                <div v-if="prepNotes">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Preparation</h4>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ prepNotes }}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="line-through mr-2" v-if="originalTotal">₹{{ nf.format(originalTotal) }}</span>
                    <span class="font-semibold">Payable: ₹{{ nf.format(discountedTotal) }}</span>
                  </div>
                  <div class="flex gap-2">
                    <button type="button" @click="confirmOpen=false"
                            class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      Back
                    </button>
                    <button type="button" @click="confirmBooking"
                            class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'

// Props / Emits
const props = defineProps<{ show: boolean; lab: any }>()
const emit = defineEmits<{ (e:'close'):void; (e:'booked', data:any):void }>()

// Mock data and helpers
const { laboratoryTests, labPackages, testCategories, getLabById, addBooking } = useLaboratoryMock()

// Text/number helpers
const text = (v:any)=> v==null ? '' : Array.isArray(v) ? v.map(text).filter(Boolean).join(', ') : typeof v==='object' ? (v.text||v.title||v.name||'') : String(v)
const money = (n:any)=> Number.isFinite(Number(n)) ? Number(n) : 0
const pct = (n:any)=> Number.isFinite(Number(n)) ? Number(n) : 0
const timeText = (t:any)=> text(t)
const discountPct = (t:any)=> {
  if (t.discount!=null) return Math.max(0, Math.round(Number(t.discount)))
  const op = money(t.originalPrice ?? t.price), dp = money(t.discountedPrice ?? t.price)
  return !op||!dp ? 0 : Math.max(0, Math.round(100 - (dp/op) * 100))
}

// Build lab-specific test ids from popularTests + packages + specialties→category ids
function normalize(s:string){return s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
const labTestIds = computed<Set<number>>(()=> {
  const ids = new Set<number>()
  const lab = getLabById(props.lab?.id) || {}
  ;(lab.popularTests||[]).forEach((tid:number)=> ids.add(tid))
  const pkgIds:number[] = Array.isArray(lab.packages) ? lab.packages : []
  labPackages.value.filter(p=> pkgIds.includes(p.id)).forEach((p:any)=> (p.testIds||[]).forEach((tid:number)=> ids.add(tid)))
  const specs:string[] = Array.isArray(lab.specialties)? lab.specialties : []
  const specNorm = specs.map(normalize)
  testCategories.value.forEach((cat:any)=>{
    const cname = normalize(cat.name)
    if (specNorm.some(s => s.includes(cname) || cname.includes(s))) (cat.testIds||[]).forEach((tid:number)=> ids.add(tid))
  })
  return ids
}) // uses mock mapping fields
// Data sets
type Test = any; type Package = any
const all = shallowRef<Test[]>([])
const packages = shallowRef<Package[]>([])
watch(
  [() => props.lab?.id, laboratoryTests, labPackages, testCategories],
  hydrateFromLab,
  { immediate: true }
)

// UI state
const nf = new Intl.NumberFormat('en-IN')
const tabs = [{ key:'all', label:'All Tests' }, { key:'categories', label:'Categories' }, { key:'packages', label:'Packages' }]
const activeTab = ref<'all'|'categories'|'packages'>('all')
const searchQuery = ref(''); const debounced = ref(''); let to:any
watch(searchQuery, v=>{ clearTimeout(to); to=setTimeout(()=> debounced.value = text(v).toLowerCase(), 180) })
const selectedCategory = ref(''); const sampleType = ref(''); const reporting = ref(''); const sortBy = ref<'name'|'price-low'|'price-high'|'discount'|'popular'>('name')

// Facets
const categories = computed(()=> {
  const set = new Set<string>(); all.value.forEach(t=> { const c = text(t.category); if (c) set.add(c) })
  return Array.from(set).sort()
})
const sampleTypes = computed(()=> {
  const set = new Set<string>(); all.value.forEach(t=> { const s = text(t.sampleType); if (s) set.add(s) })
  return Array.from(set).sort()
})

// Filters / sorting
const filteredAll = computed(()=> {
  const q = debounced.value
  return all.value
    .filter(t=>{
      if (q) {
        const blob = [text(t.name), text(t.description), text(t.category)].join(' ').toLowerCase()
        if (!blob.includes(q)) return false
      }
      if (selectedCategory.value && text(t.category)!==selectedCategory.value) return false
      if (sampleType.value && text(t.sampleType)!==sampleType.value) return false
      if (reporting.value) {
        const rt = text(t.reportTime || t.reportingTime).toLowerCase()
        if (reporting.value==='6h' && !(rt.includes('6')||rt.includes('same'))) return false
        if (reporting.value==='24h' && !(rt.includes('6')||rt.includes('same')||rt.includes('24'))) return false
        if (reporting.value==='48h' && (rt.includes('72')||rt.includes('week'))) return false
        if (reporting.value==='72h' && !rt) return false
      }
      return true
    })
    .sort((a,b)=>{
      const pa = money(a.discountedPrice ?? a.price), pb = money(b.discountedPrice ?? b.price)
      switch (sortBy.value) {
        case 'price-low': return pa - pb
        case 'price-high': return pb - pa
        case 'discount': return discountPct(b) - discountPct(a)
        case 'popular': return (b.popularity ?? 0) - (a.popularity ?? 0)
        default: return text(a.name).localeCompare(text(b.name))
      }
    })
})
// Pagination
const page = ref(1); const perPage = 12
watch([debounced, selectedCategory, sampleType, reporting, sortBy], ()=> { page.value = 1 })
const totalPagesAll = computed(()=> Math.max(1, Math.ceil(filteredAll.value.length / perPage)))
const pagedAll = computed(()=> filteredAll.value.slice((page.value-1)*perPage, page.value*perPage))
function prevPage(){ if (page.value>1) page.value-- }
function nextPage(){ if (page.value<totalPagesAll.value) page.value++ }

// Grouping by category
const byCategory = computed<Record<string, Test[]>>(()=> {
  const map:Record<string, Test[]> = {}
  filteredAll.value.forEach(t=>{
    const c = text(t.category) || 'Uncategorized'
    ;(map[c] ||= []).push(t)
  })
  return map
})
const openCats = ref<Set<string>>(new Set())
const isOpen = (c:string)=> openCats.value.has(c)
function toggleOpen(c:string){ isOpen(c)? openCats.value.delete(c): openCats.value.add(c) }

// Cart
const cart = ref<Test[]>([])
const inCart = (id:number)=> cart.value.some(x=> x.id===id)
function toggleCart(t:Test){ inCart(t.id) ? cart.value = cart.value.filter(x=> x.id!==t.id) : cart.value = [...cart.value, t] }
function addPackage(p:Package){
  const pkg = labPackages.value.find((x:any)=> x.id===p.id)
  const allowed = new Set(all.value.map((x:any)=> x.id))
  const ids = (pkg?.testIds || []).filter((tid:number)=> allowed.has(tid))
  const wanted = new Set([...cart.value.map((x:any)=> x.id), ...ids])
  cart.value = all.value.filter((x:any)=> wanted.has(x.id))
}
function clearCart(){ cart.value = [] }

const originalTotal = computed(()=> cart.value.reduce((s:any,t:any)=> s + money(t.originalPrice ?? t.price), 0))
const discountedTotal = computed(()=> cart.value.reduce((s:any,t:any)=> s + money(t.discountedPrice ?? t.price), 0))

// Confirmation modal logic
const confirmOpen = ref(false)
const samplesNeeded = computed(()=> {
  const set = new Set<string>()
  cart.value.forEach((t:any)=> { const s = text(t.sampleType); if (s) s.split(',').forEach((x:string)=> set.add(x.trim())) })
  return Array.from(set).filter(Boolean).join(', ')
})
const prepNotes = computed(()=> {
  const notes = new Set<string>()
  cart.value.forEach((t:any)=> {
    const req = text(t.requirements || t.duration)
    if (req) notes.add(req)
  })
  return Array.from(notes).join(' • ')
})
function openConfirm(){ if (cart.value.length) confirmOpen.value = true }
function confirmBooking(){
  const payload = {
    laboratory: props.lab,
    tests: cart.value.slice(),
    originalTotal: originalTotal.value,
    discountedTotal: discountedTotal.value,
    samplesNeeded: samplesNeeded.value,
    preparation: prepNotes.value,
    discount: props.lab.discount,
    savings: originalTotal.value - discountedTotal.value,
  }
  addBooking(payload) // persist in mock store
  emit('booked', payload)
  confirmOpen.value = false
  emit('close')
}
function hydrateFromLab() {
  const idset = labTestIds.value
  all.value = laboratoryTests.value.filter((t:any)=> idset.has(t.id))
  const pkgIds:number[] = Array.isArray(props.lab?.packages) ? props.lab.packages : []
  packages.value = labPackages.value.filter((p:any)=> pkgIds.includes(p.id))
}
// Actions
function close(){ emit('close') }
function resetFilters(){ searchQuery.value=''; selectedCategory.value=''; sampleType.value=''; reporting.value=''; sortBy.value='name'; page.value=1 }
</script>

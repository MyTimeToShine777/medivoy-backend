// composables/useDNAKits.js
import { ref, computed } from 'vue'

export const useDNAKits = () => {
    // DNA Test Kits Data
    const dnaKits = ref([{
            id: 1,
            name: 'AncestryDNA',
            logo: '🧬',
            category: 'Ancestry',
            rating: 4.7,
            reviews: 250000,
            description: 'The world\'s largest consumer DNA database with detailed ethnicity estimates and extensive family tree matching.',
            bestFor: 'Finding the most relative matches due to its massive user database',
            features: [
                'Ethnicity estimates across 1,500+ regions',
                'Largest DNA matching database',
                'Family tree integration',
                'Migration patterns & historical insights'
            ],
            included: [
                'Saliva collection tube with stabilizing liquid',
                'Prepaid return mailer',
                'Detailed instructions',
                'Online results dashboard'
            ],
            sampleType: 'Saliva',
            resultsTime: '6-8 weeks',
            databaseSize: '20M+ users',
            privacy: 'Opt-in sharing',
            price: 7999,
            originalPrice: 9999,
            discount: 20
        },
        {
            id: 2,
            name: '23andMe',
            logo: '🧬',
            category: 'Health + Ancestry',
            rating: 4.6,
            reviews: 180000,
            description: 'Combines comprehensive ancestry analysis with FDA-approved health predisposition reports and carrier status.',
            bestFor: 'Combining DNA ancestry information with health traits and genetic health data',
            features: [
                'Ancestry composition (2,000+ regions)',
                'Health predisposition reports (FDA-approved)',
                'Carrier status for 40+ conditions',
                'Trait reports & wellness insights'
            ],
            included: [
                'Saliva collection kit',
                'Stabilization fluid',
                'Return shipping box',
                'Access to health + ancestry reports'
            ],
            sampleType: 'Saliva',
            resultsTime: '5-7 weeks',
            databaseSize: '12M+ users',
            privacy: 'Encrypted & secure',
            price: 14999,
            originalPrice: 18999,
            discount: 21
        },
        {
            id: 3,
            name: 'FamilyTreeDNA',
            logo: '🧬',
            category: 'Genealogy',
            rating: 4.5,
            reviews: 95000,
            description: 'Ideal for serious genealogists with advanced Y-DNA and mtDNA testing for deep paternal and maternal line analysis.',
            bestFor: 'Serious genealogists interested in deep-dive paternal and maternal line analysis',
            features: [
                'Y-DNA testing (paternal line)',
                'mtDNA testing (maternal line)',
                'Autosomal DNA for family matching',
                'Ancient origins analysis'
            ],
            included: [
                'Cheek swab collection kit',
                'Detailed collection instructions',
                'Prepaid return envelope',
                'Advanced genealogy tools'
            ],
            sampleType: 'Cheek Swab',
            resultsTime: '6-8 weeks',
            databaseSize: '2M+ users',
            privacy: 'Strict opt-in',
            price: 8999,
            originalPrice: 11999,
            discount: 25
        },
        {
            id: 4,
            name: 'Living DNA',
            logo: '🧬',
            category: 'Regional Ancestry',
            rating: 4.6,
            reviews: 72000,
            description: 'Provides detailed regional breakdowns with a focus on British Isles ancestry and global family matching.',
            bestFor: 'Detailed geographic roots and tracing Indian/South Asian ancestry with precision',
            features: [
                'Sub-regional ancestry (80+ regions)',
                'Maternal & paternal lineage',
                'Detailed Indian subcontinent breakdowns',
                'Family matching globally'
            ],
            included: [
                'Saliva collection tube',
                'Stabilization liquid',
                'Return mailer',
                'Detailed ancestry map'
            ],
            sampleType: 'Saliva',
            resultsTime: '6-8 weeks',
            databaseSize: '500K+ users',
            privacy: 'GDPR compliant',
            price: 9999,
            originalPrice: 12999,
            discount: 23
        }
    ])

    // DNA Orders tracking
    const dnaOrders = ref([])

    // Stats
    const dnaStats = computed(() => ({
        totalKits: dnaKits.value.length,
        avgRating: (dnaKits.value.reduce((sum, k) => sum + k.rating, 0) / dnaKits.value.length).toFixed(1),
        totalReviews: dnaKits.value.reduce((sum, k) => sum + k.reviews, 0),
        avgPrice: Math.round(dnaKits.value.reduce((sum, k) => sum + k.price, 0) / dnaKits.value.length)
    }))

    // CRUD Operations
    const addDNAOrder = (order) => {
        dnaOrders.value.push({
            ...order,
            id: Date.now(),
            orderDate: new Date().toISOString(),
            status: 'Confirmed',
            trackingNumber: `DNA${Date.now()}`
        })
    }

    const updateDNAOrder = (id, updates) => {
        const index = dnaOrders.value.findIndex(o => o.id === id)
        if (index !== -1) {
            dnaOrders.value[index] = {...dnaOrders.value[index], ...updates }
        }
    }

    const getDNAOrdersByUser = (userId) => {
        return dnaOrders.value.filter(o => o.userId === userId)
    }

    const getKitById = (id) => {
        return dnaKits.value.find(k => k.id === id)
    }

    return {
        // Data
        dnaKits,
        dnaOrders,
        dnaStats,

        // Methods
        addDNAOrder,
        updateDNAOrder,
        getDNAOrdersByUser,
        getKitById
    }
}
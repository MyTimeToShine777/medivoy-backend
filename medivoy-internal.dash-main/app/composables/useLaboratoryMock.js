// composables/useLaboratoryMock.js
import { ref, computed } from 'vue';

export const useLaboratoryMock = () => {
    // Enhanced Lab Partners (6 labs)
    const labPartners = ref([{
            id: 1,
            name: 'Thyrocare Technologies Ltd',
            logo: '🔬',
            rating: 4.8,
            reviews: 125000,
            testsOffered: 850,
            description: "India's leading diagnostic chain with NABL accredited labs and home sample collection across all metros.",
            specialties: ['Thyroid Panel', 'Diabetes Screening', 'Vitamin Deficiency', 'Hormone Tests'],
            locations: 2500,
            turnaroundTime: '24-48 hours',
            homeCollection: true,
            certifications: ['NABL', 'ISO 9001:2015', 'CAP'],
            discount: 30,
            isActive: true,
            address: 'D-37/1, TTC Industrial Area, Turbhe, Navi Mumbai, Maharashtra 400705',
            phone: '+91-22-4096-7000',
            email: 'customercare@thyrocare.com',
            website: 'www.thyrocare.com',
            establishedYear: 2000,
            totalStaff: 5000,
            labNetwork: 2500,
            operatingHours: '24/7',
            emergencyService: true,
            onlineReports: true,
            mobileApp: true,
            paymentMethods: ['Cash', 'Card', 'UPI', 'Wallet', 'Insurance'],
            languages: ['English', 'Hindi', 'Marathi', 'Tamil'],
            facilities: ['Home Collection', 'Online Booking', 'Digital Reports', 'Free Consultation'],
            popularTests: [3, 5, 9, 11, 14],
            packages: [1, 2],
            awards: ['Best Diagnostic Chain 2024', 'Healthcare Excellence Award'],
            insurance: ['Star Health', 'HDFC Ergo', 'Care Health', 'ICICI Lombard'],
        },
        {
            id: 2,
            name: 'Dr. Lal PathLabs',
            logo: '🧪',
            rating: 4.7,
            reviews: 98000,
            testsOffered: 3500,
            description: 'Trusted name in diagnostics with advanced molecular and genetic testing capabilities across India.',
            specialties: ['Cancer Screening', 'Genetic Testing', 'Allergy Panel', 'Cardiac Risk'],
            locations: 3800,
            turnaroundTime: '12-24 hours',
            homeCollection: true,
            certifications: ['NABL', 'CAP', 'ISO 15189'],
            discount: 25,
            isActive: true,
            address: 'Dr. Lal PathLabs Pvt. Ltd., Block E, Sector 18, Rohini, New Delhi 110085',
            phone: '+91-11-3988-8888',
            email: 'support@lalpathlabs.com',
            website: 'www.lalpathlabs.com',
            establishedYear: 1949,
            totalStaff: 8000,
            labNetwork: 3800,
            operatingHours: '7:00 AM - 10:00 PM',
            emergencyService: true,
            onlineReports: true,
            mobileApp: true,
            paymentMethods: ['Cash', 'Card', 'UPI', 'Wallet', 'Net Banking', 'Insurance'],
            languages: ['English', 'Hindi', 'Punjabi', 'Bengali'],
            facilities: [
                'Advanced Molecular Testing',
                'Genetic Counseling',
                'Home Collection',
                'Corporate Packages',
            ],
            popularTests: [5, 13, 15, 20, 22],
            packages: [2, 3],
            awards: ['Most Trusted Diagnostic Brand', 'Innovation in Healthcare 2024'],
            insurance: ['Star Health', 'HDFC Ergo', 'Aditya Birla', 'Max Bupa', 'Religare'],
        },
        {
            id: 3,
            name: 'Metropolis Healthcare',
            logo: '🏥',
            rating: 4.9,
            reviews: 156000,
            testsOffered: 4000,
            description: 'Premium diagnostic services with cutting-edge technology and expert pathologists for accurate results.',
            specialties: [
                'Advanced Imaging',
                'Molecular Diagnostics',
                'Histopathology',
                'Flow Cytometry',
            ],
            locations: 4200,
            turnaroundTime: '6-24 hours',
            homeCollection: true,
            certifications: ['NABL', 'CAP', 'JCI'],
            discount: 35,
            isActive: true,
            address: '250-D, Udyog Vihar, Phase 1, Sector 20, Gurugram, Haryana 122016',
            phone: '+91-124-498-3333',
            email: 'info@metropolisindia.com',
            website: 'www.metropolisindia.com',
            establishedYear: 1980,
            totalStaff: 12000,
            labNetwork: 4200,
            operatingHours: '24/7',
            emergencyService: true,
            onlineReports: true,
            mobileApp: true,
            paymentMethods: ['Cash', 'Card', 'UPI', 'Wallet', 'Net Banking', 'Insurance', 'EMI'],
            languages: ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil'],
            facilities: [
                'Premium Lounges',
                'Express Testing',
                'International Quality Standards',
                'AI-Powered Analysis',
            ],
            popularTests: [3, 8, 13, 15, 27],
            packages: [1, 2, 3],
            awards: ['Best Quality Lab 2024', 'Excellence in Diagnostics', 'Customer Service Award'],
            insurance: ['All Major Insurance Partners'],
        },
        {
            id: 4,
            name: 'SRL Diagnostics',
            logo: '⚕️',
            rating: 4.6,
            reviews: 87000,
            testsOffered: 3200,
            description: 'Comprehensive diagnostic solutions with state-of-the-art laboratories across India.',
            specialties: ['Infectious Disease', 'Toxicology', 'Clinical Chemistry', 'Microbiology'],
            locations: 2800,
            turnaroundTime: '24-48 hours',
            homeCollection: true,
            certifications: ['NABL', 'ISO 9001'],
            discount: 20,
            isActive: true,
            address: 'Plot No. 5, Sector 18, Gurgaon, Haryana 122015',
            phone: '+91-124-471-7800',
            email: 'customercare@srldiagnostics.com',
            website: 'www.srldiagnostics.com',
            establishedYear: 1995,
            totalStaff: 6500,
            labNetwork: 2800,
            operatingHours: '6:00 AM - 11:00 PM',
            emergencyService: true,
            onlineReports: true,
            mobileApp: true,
            paymentMethods: ['Cash', 'Card', 'UPI', 'Insurance'],
            languages: ['English', 'Hindi', 'Telugu', 'Kannada'],
            facilities: ['Specialized Testing', 'Research Lab', 'Clinical Trials', 'Corporate Health'],
            popularTests: [6, 7, 16, 17, 23],
            packages: [1, 2],
            awards: ['Best Diagnostic Lab 2023', 'Quality Excellence Award'],
            insurance: ['Star Health', 'HDFC Ergo', 'Care Health'],
        },
        {
            id: 5,
            name: 'Vijaya Diagnostic Centre',
            logo: '🔍',
            rating: 4.7,
            reviews: 45000,
            testsOffered: 1800,
            description: "South India's leading diagnostic chain with focus on quality and patient care.",
            specialties: ['Radiology', 'Pathology', 'Cardiology Tests', "Women's Health"],
            locations: 180,
            turnaroundTime: '12-36 hours',
            homeCollection: true,
            certifications: ['NABL', 'ISO 9001:2015'],
            discount: 28,
            isActive: true,
            address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
            phone: '+91-40-4455-5555',
            email: 'info@vijayadiagnostic.com',
            website: 'www.vijayadiagnostic.com',
            establishedYear: 1981,
            totalStaff: 3000,
            labNetwork: 180,
            operatingHours: '7:00 AM - 9:00 PM',
            emergencyService: true,
            onlineReports: true,
            mobileApp: true,
            paymentMethods: ['Cash', 'Card', 'UPI', 'Wallet', 'Insurance'],
            languages: ['English', 'Telugu', 'Hindi', 'Tamil'],
            facilities: [
                'Women-Only Collection Centers',
                'Senior Citizen Care',
                'Pediatric Collection',
                'Express Results',
            ],
            popularTests: [9, 10, 18, 19, 25],
            packages: [1, 3],
            awards: ['South India Best Lab 2024', 'Patient Care Excellence'],
            insurance: ['Star Health', 'Care Health', 'Max Bupa'],
        },
        {
            id: 6,
            name: 'PathKind Labs',
            logo: '💉',
            rating: 4.5,
            reviews: 32000,
            testsOffered: 1500,
            description: 'Affordable and reliable diagnostic services with focus on accuracy and timely reports.',
            specialties: [
                'Basic Health Screening',
                'Diabetes Care',
                'Preventive Health',
                'Routine Tests',
            ],
            locations: 1200,
            turnaroundTime: '24-48 hours',
            homeCollection: true,
            certifications: ['NABL', 'ISO 9001'],
            discount: 40,
            isActive: true,
            address: 'H-16, Sector 63, Noida, Uttar Pradesh 201301',
            phone: '+91-92-1234-5678',
            email: 'support@pathkindlabs.com',
            website: 'www.pathkindlabs.com',
            establishedYear: 2010,
            totalStaff: 2500,
            labNetwork: 1200,
            operatingHours: '8:00 AM - 8:00 PM',
            emergencyService: false,
            onlineReports: true,
            mobileApp: true,
            paymentMethods: ['Cash', 'Card', 'UPI', 'Paytm'],
            languages: ['English', 'Hindi'],
            facilities: [
                'Budget-Friendly Packages',
                'Quick Reports',
                'Home Collection',
                'Online Booking',
            ],
            popularTests: [3, 6, 7, 9, 14],
            packages: [1],
            awards: ['Best Value for Money 2024'],
            insurance: ['Cashless with Select Partners'],
        },
    ]);

    // Lab Test Packages (3 main packages)
    const labPackages = ref([{
            id: 1,
            name: 'Essential Wellness Package',
            packageType: 'Basic',
            price: 1499,
            originalPrice: 3999,
            discount: 63,
            duration: '8-10 hours fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 72,
            description: 'Comprehensive basic health screening covering essential parameters for overall wellness check.',
            icon: '🌟',
            popular: false,
            featured: false,
            color: 'blue',
            includes: [
                'Complete Blood Count (CBC) - 28 parameters',
                'Lipid Profile - 8 parameters',
                'Liver Function Test (LFT) - 11 parameters',
                'Kidney Function Test (KFT) - 9 parameters',
                'Thyroid Profile (T3, T4, TSH) - 3 parameters',
                'Blood Sugar Fasting & PP - 2 parameters',
                'HbA1c (Diabetes) - 1 parameter',
                'Vitamin D - 1 parameter',
                'Vitamin B12 - 1 parameter',
                'Urine Routine & Microscopy - 8 parameters',
            ],
            testIds: [3, 14, 16, 17, 9, 6, 7, 5, 11, 12],
            requirements: '8-10 hours fasting required',
            sampleType: 'Blood, Urine',
            benefits: [
                'Free home sample collection',
                'Digital reports on email & app',
                'Free doctor consultation',
                'Lifetime report storage',
            ],
            idealFor: [
                'Young adults (18-40 years)',
                'Annual health checkup',
                'Preventive screening',
                'Pre-employment medical',
            ],
            isActive: true,
        },
        {
            id: 2,
            name: 'Comprehensive Health Package',
            packageType: 'Advanced',
            price: 2999,
            originalPrice: 7999,
            discount: 63,
            duration: '10-12 hours fasting',
            reportTime: '48 hours',
            homeCollection: true,
            parameters: 125,
            description: 'Premium comprehensive package with cardiac markers, hormones, iron studies, and cancer screening.',
            icon: '💎',
            popular: true,
            featured: true,
            color: 'purple',
            includes: [
                'All Essential Wellness Package Tests - 72 parameters',
                'Cardiac Risk Markers (hs-CRP, Homocysteine) - 6 parameters',
                'Iron Profile (Iron, TIBC, Ferritin) - 4 parameters',
                'Complete Hormone Panel (Testosterone, Cortisol, DHEAS) - 8 parameters',
                'Tumor Markers (PSA, CEA, CA 19-9, AFP) - 4 parameters',
                'Advanced Lipid Profile (Apo A1, Apo B, Lp(a)) - 8 parameters',
                'Electrolyte Panel - 4 parameters',
                'ESR & hs-CRP - 2 parameters',
                'Calcium & Phosphorus - 2 parameters',
                'Complete Uric Acid Profile - 3 parameters',
                'Stool Routine & Microscopy - 8 parameters',
                'ECG (Electrocardiogram)',
                'Chest X-Ray (PA View)',
                'Ultrasound Abdomen & Pelvis',
            ],
            testIds: [3, 14, 16, 17, 9, 6, 7, 5, 11, 12, 15, 18, 19, 21, 22, 4],
            requirements: '10-12 hours fasting required',
            sampleType: 'Blood, Urine, Stool',
            benefits: [
                'Priority home sample collection',
                'Instant digital reports',
                'Free specialist consultation (30 min)',
                'Lifetime report storage',
                'Health risk assessment report',
                'Personalized diet & lifestyle plan',
            ],
            idealFor: [
                'Adults 40+ years',
                'Chronic disease monitoring',
                'Pre-surgery screening',
                'Executive health checkup',
            ],
            isActive: true,
        },
        {
            id: 3,
            name: 'Premium Master Health Package',
            packageType: 'Premium',
            price: 5499,
            originalPrice: 14999,
            discount: 63,
            duration: '12 hours fasting',
            reportTime: '72 hours',
            homeCollection: true,
            parameters: 185,
            description: 'Ultimate comprehensive health assessment with advanced diagnostics, genetic markers, and full-body imaging.',
            icon: '👑',
            popular: true,
            featured: true,
            color: 'gold',
            includes: [
                'All Comprehensive Health Package Tests - 125 parameters',
                'Advanced Cancer Screening Panel - 12 markers',
                'Complete Allergy Panel (50 allergens) - 50 parameters',
                'Autoimmune Disease Markers (ANA, RF, Anti-CCP) - 8 parameters',
                'Infectious Disease Panel (HIV, HBsAg, HCV, VDRL) - 4 tests',
                'Heavy Metal Toxicity Screen - 6 parameters',
                'Genetic Carrier Screening (Basic) - Analysis',
                'Vitamin Panel Complete (A, D, E, K, B-Complex, C) - 10 parameters',
                'Bone Health Panel (Calcium, Vitamin D, PTH, Bone markers) - 6 parameters',
                'Respiratory Function Test (PFT)',
                'Echocardiogram (2D Echo)',
                'Stress Test (TMT)',
                'Whole Abdomen & Pelvis USG (4D)',
                'Mammography (for women) / PSA (for men)',
                'Bone Density Test (DEXA Scan)',
                'Full Body Health Analysis Report',
                '1-hour specialist consultation',
                '3 months follow-up support',
            ],
            testIds: [
                3, 14, 16, 17, 9, 6, 7, 5, 11, 12, 13, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 4,
            ],
            requirements: '12 hours fasting required',
            sampleType: 'Blood, Urine, Stool, Swab',
            benefits: [
                'VIP home sample collection',
                'Same-day priority processing',
                'Detailed genetic & health risk report',
                'Free nutritionist consultation',
                'Free fitness trainer consultation',
                'Lifetime report storage with trends',
                'Annual health tracker dashboard',
                'Emergency doctor hotline (3 months)',
                'Health insurance support documentation',
            ],
            idealFor: [
                'Senior citizens 60+ years',
                'High-risk individuals',
                'Family history of chronic diseases',
                'Complete preventive health assessment',
                'Pre-retirement health checkup',
                'Post-COVID recovery assessment',
            ],
            isActive: true,
        },
    ]);

    // Test Categories (16 categories)
    const testCategories = ref([{
            id: 1,
            name: 'Complete Health Checkup',
            icon: '🏥',
            tests: 156,
            color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            description: 'Comprehensive health packages for complete body checkup',
            popular: true,
            testIds: [1, 2, 3],
        },
        {
            id: 2,
            name: 'Blood Tests',
            icon: '🩸',
            tests: 450,
            color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            description: 'Complete blood count and related blood investigations',
            popular: true,
            testIds: [3, 4],
        },
        {
            id: 3,
            name: 'Diabetes & Sugar',
            icon: '🍬',
            tests: 45,
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            description: 'Blood sugar, HbA1c, and diabetes monitoring tests',
            popular: true,
            testIds: [5, 6, 7, 8],
        },
        {
            id: 4,
            name: 'Thyroid Panel',
            icon: '🦋',
            tests: 28,
            color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            description: 'Thyroid hormone tests - T3, T4, TSH',
            popular: true,
            testIds: [9, 10],
        },
        {
            id: 5,
            name: 'Vitamin & Nutrition',
            icon: '💊',
            tests: 65,
            color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            description: 'Vitamin D, B12, Iron, and nutritional deficiency tests',
            popular: true,
            testIds: [11, 12, 13],
        },
        {
            id: 6,
            name: 'Heart & Cardiac',
            icon: '❤️',
            tests: 38,
            color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
            description: 'Lipid profile, cardiac markers, and heart health tests',
            popular: true,
            testIds: [14, 15],
        },
        {
            id: 7,
            name: 'Liver Function',
            icon: '🫀',
            tests: 32,
            color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            description: 'Liver enzymes and function tests',
            popular: false,
            testIds: [16],
        },
        {
            id: 8,
            name: 'Kidney Function',
            icon: '🫘',
            tests: 28,
            color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
            description: 'Creatinine, urea, and kidney health tests',
            popular: false,
            testIds: [17],
        },
        {
            id: 9,
            name: 'Hormone Tests',
            icon: '⚡',
            tests: 85,
            color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
            description: 'Testosterone, estrogen, and other hormone panels',
            popular: false,
            testIds: [18, 19],
        },
        {
            id: 10,
            name: 'Allergy Testing',
            icon: '🤧',
            tests: 120,
            color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
            description: 'Food and environmental allergy panels',
            popular: false,
            testIds: [20],
        },
        {
            id: 11,
            name: 'Cancer Screening',
            icon: '🎗️',
            tests: 42,
            color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
            description: 'Tumor markers and cancer detection tests',
            popular: false,
            testIds: [21, 22],
        },
        {
            id: 12,
            name: 'Infectious Disease',
            icon: '🦠',
            tests: 95,
            color: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
            description: 'COVID, HIV, Hepatitis, and infection tests',
            popular: true,
            testIds: [23, 24],
        },
        {
            id: 13,
            name: "Women's Health",
            icon: '👩',
            tests: 68,
            color: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
            description: 'PCOS, pregnancy, and female hormone panels',
            popular: true,
            testIds: [25],
        },
        {
            id: 14,
            name: "Men's Health",
            icon: '👨',
            tests: 52,
            color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
            description: 'Testosterone, fertility, and prostate tests',
            popular: false,
            testIds: [26, 21],
        },
        {
            id: 15,
            name: 'Genetic Testing',
            icon: '🧬',
            tests: 35,
            color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
            description: 'DNA testing and genetic disorder screening',
            popular: false,
            testIds: [27],
        },
        {
            id: 16,
            name: 'COVID-19 Tests',
            icon: '😷',
            tests: 12,
            color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
            description: 'RT-PCR, RAT, and antibody tests',
            popular: true,
            testIds: [23],
        },
    ]);

    // Laboratory Tests (ALL 27 tests - COMPLETE)
    const laboratoryTests = ref([
        // Blood Tests
        {
            id: 3,
            name: 'Complete Blood Count (CBC)',
            category: 'Blood Tests',
            price: 299,
            originalPrice: 500,
            discount: 40,
            duration: 'No fasting',
            reportTime: '6 hours',
            homeCollection: true,
            parameters: 28,
            description: 'Comprehensive blood test measuring RBC, WBC, platelets, hemoglobin, and other blood components.',
            includes: [
                'Red Blood Cell Count',
                'White Blood Cell Count',
                'Platelet Count',
                'Hemoglobin',
                'Hematocrit',
                'MCV, MCH, MCHC',
                'Differential Count',
            ],
            popular: true,
            featured: false,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 4,
            name: 'ESR (Erythrocyte Sedimentation Rate)',
            category: 'Blood Tests',
            price: 150,
            originalPrice: 250,
            discount: 40,
            duration: 'No fasting',
            reportTime: '6 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Measures inflammation level in the body. High ESR indicates infection or inflammatory conditions.',
            includes: ['ESR Test'],
            popular: false,
            featured: false,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },

        // Diabetes & Sugar
        {
            id: 5,
            name: 'HbA1c (Glycated Hemoglobin)',
            category: 'Diabetes & Sugar',
            price: 450,
            originalPrice: 750,
            discount: 40,
            duration: 'No fasting',
            reportTime: '12 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Measures average blood sugar levels over past 2-3 months. Gold standard for diabetes monitoring.',
            includes: ['HbA1c Test'],
            popular: true,
            featured: true,
            requirements: 'No fasting required',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 6,
            name: 'Fasting Blood Sugar (FBS)',
            category: 'Diabetes & Sugar',
            price: 120,
            originalPrice: 200,
            discount: 40,
            duration: '8-10 hours fasting',
            reportTime: '4 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Measures blood glucose level after overnight fasting. Primary test for diabetes screening.',
            includes: ['Fasting Glucose'],
            popular: true,
            featured: false,
            requirements: '8-10 hours fasting',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 7,
            name: 'Post Prandial Blood Sugar (PPBS)',
            category: 'Diabetes & Sugar',
            price: 120,
            originalPrice: 200,
            discount: 40,
            duration: '2 hours after meal',
            reportTime: '4 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Measures blood sugar 2 hours after eating. Helps diagnose diabetes and prediabetes.',
            includes: ['Post-meal Glucose'],
            popular: false,
            featured: false,
            requirements: 'Test 2 hours after meal',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 8,
            name: 'Diabetes Screening Package',
            category: 'Diabetes & Sugar',
            price: 599,
            originalPrice: 1200,
            discount: 50,
            duration: '8-10 hours fasting',
            reportTime: '12 hours',
            homeCollection: true,
            parameters: 5,
            description: 'Complete diabetes screening with glucose, HbA1c, insulin levels, and kidney function.',
            includes: [
                'Fasting Blood Sugar',
                'HbA1c',
                'Insulin Fasting',
                'Urine Microalbumin',
                'Creatinine',
            ],
            popular: true,
            featured: true,
            requirements: 'Fasting required',
            sampleType: 'Blood, Urine',
            isActive: true,
        },

        // Thyroid Panel
        {
            id: 9,
            name: 'Thyroid Profile Total (T3, T4, TSH)',
            category: 'Thyroid Panel',
            price: 499,
            originalPrice: 900,
            discount: 45,
            duration: 'No fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 3,
            description: 'Complete thyroid function test measuring T3, T4, and TSH hormones.',
            includes: ['Total T3', 'Total T4', 'TSH'],
            popular: true,
            featured: true,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 10,
            name: 'Thyroid Profile Advanced (Free T3, Free T4, TSH)',
            category: 'Thyroid Panel',
            price: 699,
            originalPrice: 1200,
            discount: 42,
            duration: 'No fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 3,
            description: 'Advanced thyroid test with free hormone levels for accurate diagnosis.',
            includes: ['Free T3', 'Free T4', 'TSH'],
            popular: true,
            featured: false,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },

        // Vitamin & Nutrition
        {
            id: 11,
            name: 'Vitamin D (25-OH)',
            category: 'Vitamin & Nutrition',
            price: 899,
            originalPrice: 1500,
            discount: 40,
            duration: 'No fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Measures Vitamin D levels. Deficiency common in modern lifestyle causing bone and immunity issues.',
            includes: ['25-Hydroxy Vitamin D'],
            popular: true,
            featured: true,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 12,
            name: 'Vitamin B12',
            category: 'Vitamin & Nutrition',
            price: 799,
            originalPrice: 1300,
            discount: 38,
            duration: 'No fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Tests B12 levels. Deficiency causes fatigue, neurological problems, and anemia.',
            includes: ['Vitamin B12'],
            popular: true,
            featured: false,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 13,
            name: 'Complete Vitamin Panel',
            category: 'Vitamin & Nutrition',
            price: 2499,
            originalPrice: 4500,
            discount: 44,
            duration: 'No fasting',
            reportTime: '48 hours',
            homeCollection: true,
            parameters: 8,
            description: 'Comprehensive vitamin testing including D, B12, B9, Iron, and other nutrients.',
            includes: [
                'Vitamin D',
                'Vitamin B12',
                'Folate (B9)',
                'Iron Studies',
                'Ferritin',
                'Calcium',
                'Magnesium',
                'Zinc',
            ],
            popular: true,
            featured: true,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },

        // Heart & Cardiac
        {
            id: 14,
            name: 'Lipid Profile Complete',
            category: 'Heart & Cardiac',
            price: 499,
            originalPrice: 800,
            discount: 38,
            duration: '12 hours fasting',
            reportTime: '12 hours',
            homeCollection: true,
            parameters: 8,
            description: 'Comprehensive cholesterol test for heart disease risk assessment.',
            includes: [
                'Total Cholesterol',
                'HDL Cholesterol',
                'LDL Cholesterol',
                'VLDL Cholesterol',
                'Triglycerides',
                'TC/HDL Ratio',
                'LDL/HDL Ratio',
                'Non-HDL Cholesterol',
            ],
            popular: true,
            featured: true,
            requirements: '12 hours fasting',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 15,
            name: 'Cardiac Risk Markers',
            category: 'Heart & Cardiac',
            price: 1899,
            originalPrice: 3500,
            discount: 46,
            duration: '12 hours fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 12,
            description: 'Advanced cardiac risk assessment with inflammatory markers and lipid profile.',
            includes: [
                'Complete Lipid Profile',
                'hs-CRP (high sensitivity)',
                'Homocysteine',
                'Lipoprotein (a)',
                'Apolipoprotein A1',
                'Apolipoprotein B',
            ],
            popular: true,
            featured: true,
            requirements: 'Fasting required',
            sampleType: 'Blood',
            isActive: true,
        },

        // Liver Function
        {
            id: 16,
            name: 'Liver Function Test (LFT)',
            category: 'Liver Function',
            price: 599,
            originalPrice: 1000,
            discount: 40,
            duration: '8-10 hours fasting',
            reportTime: '12 hours',
            homeCollection: true,
            parameters: 11,
            description: 'Complete liver health assessment measuring enzymes, proteins, and bilirubin.',
            includes: [
                'Bilirubin Total & Direct',
                'SGOT (AST)',
                'SGPT (ALT)',
                'Alkaline Phosphatase',
                'Total Protein',
                'Albumin',
                'Globulin',
                'A/G Ratio',
                'GGT',
            ],
            popular: true,
            featured: false,
            requirements: 'Fasting recommended',
            sampleType: 'Blood',
            isActive: true,
        },

        // Kidney Function
        {
            id: 17,
            name: 'Kidney Function Test (KFT)',
            category: 'Kidney Function',
            price: 599,
            originalPrice: 1000,
            discount: 40,
            duration: 'No fasting',
            reportTime: '12 hours',
            homeCollection: true,
            parameters: 9,
            description: 'Complete kidney health check measuring waste products and electrolytes.',
            includes: [
                'Urea',
                'Creatinine',
                'Uric Acid',
                'BUN',
                'BUN/Creatinine Ratio',
                'Sodium',
                'Potassium',
                'Chloride',
                'eGFR',
            ],
            popular: true,
            featured: false,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },

        // Hormone Tests
        {
            id: 18,
            name: 'Testosterone Total',
            category: 'Hormone Tests',
            price: 699,
            originalPrice: 1200,
            discount: 42,
            duration: 'Morning sample preferred',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Measures total testosterone levels. Important for fertility, energy, and muscle health.',
            includes: ['Total Testosterone'],
            popular: true,
            featured: false,
            requirements: 'Morning sample',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 19,
            name: 'Female Hormone Panel',
            category: 'Hormone Tests',
            price: 1899,
            originalPrice: 3500,
            discount: 46,
            duration: 'Specific cycle day',
            reportTime: '48 hours',
            homeCollection: true,
            parameters: 8,
            description: 'Comprehensive female hormone testing for fertility, PCOS, and menstrual issues.',
            includes: [
                'FSH',
                'LH',
                'Estradiol',
                'Progesterone',
                'Prolactin',
                'Testosterone',
                'DHEAS',
                'AMH',
            ],
            popular: true,
            featured: true,
            requirements: 'Day 2-5 of cycle',
            sampleType: 'Blood',
            isActive: true,
        },

        // Allergy Testing
        {
            id: 20,
            name: 'Food Allergy Panel - Vegetarian',
            category: 'Allergy Testing',
            price: 3999,
            originalPrice: 7000,
            discount: 43,
            duration: 'No fasting',
            reportTime: '5-7 days',
            homeCollection: true,
            parameters: 108,
            description: 'Comprehensive vegetarian food allergy testing covering 108 common food items.',
            includes: [
                'Grains & Cereals',
                'Pulses & Legumes',
                'Vegetables',
                'Fruits',
                'Nuts & Seeds',
                'Dairy Products',
                'Spices',
                'Food Additives',
            ],
            popular: true,
            featured: true,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },

        // Cancer Screening
        {
            id: 21,
            name: 'PSA (Prostate Specific Antigen)',
            category: 'Cancer Screening',
            price: 799,
            originalPrice: 1300,
            discount: 38,
            duration: 'No fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Prostate cancer screening marker for men over 40. Early detection saves lives.',
            includes: ['PSA Total'],
            popular: true,
            featured: false,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },
        {
            id: 22,
            name: 'Tumor Marker Panel',
            category: 'Cancer Screening',
            price: 2499,
            originalPrice: 4500,
            discount: 44,
            duration: 'No fasting',
            reportTime: '48 hours',
            homeCollection: true,
            parameters: 6,
            description: 'Comprehensive cancer screening with multiple tumor markers.',
            includes: [
                'CEA (Colorectal)',
                'CA 19-9 (Pancreatic)',
                'CA 125 (Ovarian)',
                'AFP (Liver)',
                'PSA (Prostate)',
                'CA 15-3 (Breast)',
            ],
            popular: true,
            featured: true,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },

        // Infectious Disease
        {
            id: 23,
            name: 'COVID-19 RT-PCR',
            category: 'COVID-19 Tests',
            price: 599,
            originalPrice: 1000,
            discount: 40,
            duration: 'No fasting',
            reportTime: '6-12 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Gold standard COVID-19 test detecting active infection.',
            includes: ['SARS-CoV-2 RT-PCR'],
            popular: true,
            featured: true,
            requirements: 'No special preparation',
            sampleType: 'Nasal/Throat Swab',
            isActive: true,
        },
        {
            id: 24,
            name: 'HIV Screening (Elisa)',
            category: 'Infectious Disease',
            price: 499,
            originalPrice: 800,
            discount: 38,
            duration: 'No fasting',
            reportTime: '24 hours',
            homeCollection: true,
            parameters: 1,
            description: 'Confidential HIV antibody test for screening.',
            includes: ['HIV 1 & 2 Antibodies'],
            popular: false,
            featured: false,
            requirements: 'No special preparation',
            sampleType: 'Blood',
            isActive: true,
        },

        // Women's Health
        {
            id: 25,
            name: 'PCOS Panel',
            category: "Women's Health",
            price: 1999,
            originalPrice: 3500,
            discount: 43,
            duration: 'Day 2-5 of cycle',
            reportTime: '48 hours',
            homeCollection: true,
            parameters: 12,
            description: 'Complete PCOS diagnosis package with hormones, insulin, and lipids.',
            includes: [
                'FSH, LH',
                'Testosterone',
                'DHEAS',
                'Insulin Fasting',
                'TSH',
                'Prolactin',
                'Lipid Profile',
                'Glucose Fasting',
            ],
            popular: true,
            featured: true,
            requirements: 'Specific cycle day',
            sampleType: 'Blood',
            isActive: true,
        },

        // Men's Health
        {
            id: 26,
            name: 'Male Fertility Panel',
            category: "Men's Health",
            price: 1799,
            originalPrice: 3000,
            discount: 40,
            duration: '2-3 days abstinence',
            reportTime: '48 hours',
            homeCollection: false,
            parameters: 15,
            description: 'Complete male fertility assessment with semen analysis and hormones.',
            includes: [
                'Semen Analysis',
                'Testosterone',
                'FSH, LH',
                'Prolactin',
                'Thyroid Profile',
                'Vitamin D',
            ],
            popular: true,
            featured: false,
            requirements: 'Lab visit required',
            sampleType: 'Semen, Blood',
            isActive: true,
        },

        // Genetic Testing
        {
            id: 27,
            name: 'Genetic Carrier Screening',
            category: 'Genetic Testing',
            price: 8999,
            originalPrice: 15000,
            discount: 40,
            duration: 'No fasting',
            reportTime: '15-21 days',
            homeCollection: true,
            parameters: 1,
            description: 'Screens for 100+ genetic disorders for family planning.',
            includes: [
                'Thalassemia',
                'Sickle Cell',
                'Cystic Fibrosis',
                'Spinal Muscular Atrophy',
                '100+ other conditions',
            ],
            popular: false,
            featured: true,
            requirements: 'Genetic counseling recommended',
            sampleType: 'Blood',
            isActive: true,
        },
    ]);

    // Test Bookings
    const testBookings = ref([]);

    // Statistics
    const labStats = computed(() => ({
        totalPartners: labPartners.value.filter((l) => l.isActive).length,
        totalPackages: labPackages.value.length,
        totalTests: laboratoryTests.value.length,
        totalCategories: testCategories.value.length,
        avgDiscount: Math.round(
            laboratoryTests.value.reduce((sum, t) => sum + t.discount, 0) / laboratoryTests.value.length
        ),
        popularTests: laboratoryTests.value.filter((t) => t.popular).length,
        homeCollectionTests: laboratoryTests.value.filter((t) => t.homeCollection).length,
        totalBookings: testBookings.value.length,
        avgRating: (
            labPartners.value.reduce((sum, l) => sum + l.rating, 0) / labPartners.value.length
        ).toFixed(1),
        totalLocations: labPartners.value.reduce((sum, l) => sum + l.locations, 0),
    }));

    // CRUD Operations for Lab Partners
    const addLabPartner = (lab) => {
        labPartners.value.push({
            ...lab,
            id: Date.now(),
            isActive: true,
            rating: 0,
            reviews: 0,
        });
    };

    const updateLabPartner = (id, updates) => {
        const index = labPartners.value.findIndex((l) => l.id === id);
        if (index !== -1) {
            labPartners.value[index] = {...labPartners.value[index], ...updates };
        }
    };

    const deleteLabPartner = (id) => {
        const index = labPartners.value.findIndex((l) => l.id === id);
        if (index > -1) labPartners.value.splice(index, 1);
    };

    const toggleLabStatus = (id) => {
        const lab = labPartners.value.find((l) => l.id === id);
        if (lab) lab.isActive = !lab.isActive;
    };

    // CRUD Operations for Tests
    const addTest = (test) => {
        laboratoryTests.value.push({...test, id: Date.now(), isActive: true });
    };

    const updateTest = (id, updates) => {
        const index = laboratoryTests.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            laboratoryTests.value[index] = {
                ...laboratoryTests.value[index],
                ...updates,
            };
        }
    };

    const deleteTest = (id) => {
        const index = laboratoryTests.value.findIndex((t) => t.id === id);
        if (index > -1) laboratoryTests.value.splice(index, 1);
    };

    // CRUD Operations for Packages
    const addPackage = (pkg) => {
        labPackages.value.push({...pkg, id: Date.now(), isActive: true });
    };

    const updatePackage = (id, updates) => {
        const index = labPackages.value.findIndex((p) => p.id === id);
        if (index !== -1) {
            labPackages.value[index] = {...labPackages.value[index], ...updates };
        }
    };

    const deletePackage = (id) => {
        const index = labPackages.value.findIndex((p) => p.id === id);
        if (index > -1) labPackages.value.splice(index, 1);
    };

    // CRUD Operations for Bookings
    const addBooking = (booking) => {
        testBookings.value.push({
            ...booking,
            id: Date.now(),
            bookingDate: new Date().toISOString(),
            status: 'pending',
        });
    };

    const updateBooking = (id, updates) => {
        const index = testBookings.value.findIndex((b) => b.id === id);
        if (index !== -1) {
            testBookings.value[index] = {...testBookings.value[index], ...updates };
        }
    };

    const deleteBooking = (id) => {
        const index = testBookings.value.findIndex((b) => b.id === id);
        if (index > -1) testBookings.value.splice(index, 1);
    };

    // Helper Methods
    const getLabById = (id) => {
        return labPartners.value.find((l) => l.id === id);
    };

    const getTestsByLab = (labId) => {
        const lab = getLabById(labId);
        if (!lab || !lab.popularTests) return [];
        return laboratoryTests.value.filter((t) => lab.popularTests.includes(t.id));
    };

    const getTestsByCategory = (categoryId) => {
        const category = testCategories.value.find((c) => c.id === categoryId);
        if (!category || !category.testIds) return [];
        return laboratoryTests.value.filter((t) => category.testIds.includes(t.id));
    };

    const getPopularTests = () => {
        return laboratoryTests.value.filter((t) => t.popular);
    };

    const getFeaturedTests = () => {
        return laboratoryTests.value.filter((t) => t.featured);
    };

    const getPopularPackages = () => {
        return labPackages.value.filter((p) => p.popular);
    };

    const searchLabs = (query) => {
        const lowercaseQuery = query.toLowerCase();
        return labPartners.value.filter(
            (lab) =>
            lab.name.toLowerCase().includes(lowercaseQuery) ||
            lab.description.toLowerCase().includes(lowercaseQuery) ||
            lab.specialties.some((s) => s.toLowerCase().includes(lowercaseQuery))
        );
    };

    const searchTests = (query) => {
        const lowercaseQuery = query.toLowerCase();
        return laboratoryTests.value.filter(
            (test) =>
            test.name.toLowerCase().includes(lowercaseQuery) ||
            test.description.toLowerCase().includes(lowercaseQuery) ||
            test.category.toLowerCase().includes(lowercaseQuery)
        );
    };

    const parseTestsFromPrescription = (prescriptionText) => {
        // AI-powered prescription parsing simulation
        const testKeywords = {
            cbc: 3,
            'blood count': 3,
            hemoglobin: 3,
            'blood sugar': 6,
            glucose: 6,
            hba1c: 5,
            diabetes: 8,
            thyroid: 9,
            tsh: 9,
            t3: 9,
            t4: 9,
            lipid: 14,
            cholesterol: 14,
            liver: 16,
            lft: 16,
            sgot: 16,
            sgpt: 16,
            kidney: 17,
            kft: 17,
            creatinine: 17,
            'vitamin d': 11,
            'vitamin b12': 12,
            vitamin: 13,
            psa: 21,
            cancer: 22,
        };

        const detectedTests = [];
        const text = prescriptionText.toLowerCase();

        Object.entries(testKeywords).forEach(([keyword, testId]) => {
            if (text.includes(keyword)) {
                const test = laboratoryTests.value.find((t) => t.id === testId);
                if (test && !detectedTests.find((dt) => dt.id === testId)) {
                    detectedTests.push(test);
                }
            }
        });

        return detectedTests;
    };

    return {
        labPartners,
        labPackages,
        testCategories,
        laboratoryTests,
        testBookings,
        labStats,
        // Lab Partner CRUD
        addLabPartner,
        updateLabPartner,
        deleteLabPartner,
        toggleLabStatus,
        // Test CRUD
        addTest,
        updateTest,
        deleteTest,
        // Package CRUD
        addPackage,
        updatePackage,
        deletePackage,
        // Booking CRUD
        addBooking,
        updateBooking,
        deleteBooking,
        // Helper methods
        getLabById,
        getTestsByLab,
        getTestsByCategory,
        getPopularTests,
        getFeaturedTests,
        getPopularPackages,
        searchLabs,
        searchTests,
        parseTestsFromPrescription,
    };
};
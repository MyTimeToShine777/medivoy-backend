// composables/usePackagesMock.js
export const usePackagesMock = () => {
  const packages = ref([
    {
      id: 1,
      name: "Complete Heart Surgery Package",
      title: "Comprehensive Cardiac Care with Tourism",
      description:
        "Complete cardiac surgery package including pre-operative consultation, surgery, post-operative care, and recovery with luxury accommodation and local sightseeing tours.",
      shortDescription: "Heart surgery with luxury stay and cultural tours",
      type: "premium",
      originalPrice: 850000,
      discountedPrice: 750000,
      duration: "21-25 days",
      validity: 180,

      // Medical Services
      consultations: [
        "Cardiologist Consultation",
        "Anesthesiologist Consultation",
        "Pre-operative Assessment",
      ],
      treatments: [
        "Coronary Bypass Surgery",
        "Post-operative Physiotherapy",
        "Cardiac Rehabilitation",
      ],
      diagnosticTests: [
        "ECG",
        "Echocardiogram",
        "Cardiac Catheterization",
        "Blood Tests",
        "Chest X-ray",
      ],
      surgicalProcedures: ["CABG Surgery", "Valve Replacement (if required)"],

      // Tourism Components
      accommodationType: "medical_resort",
      accommodationNights: 14,
      mealsIncluded: true,
      transportationIncluded: true,
      tourPackages: [
        "City Heritage Tour",
        "Cultural Experience",
        "Shopping Tour",
      ],
      touristAttractions: [
        "Red Fort",
        "India Gate",
        "Lotus Temple",
        "Qutub Minar",
      ],

      // Premium Features
      personalConcierge: true,
      translatorService: true,
      airportPickup: true,
      visaAssistance: true,
      emergencySupport: true,

      // Location & Logistics
      city: "Delhi",
      country: "India",
      hospitalPartner: "All India Institute of Medical Sciences (AIIMS)",

      isActive: true,
      isPopular: true,
      isFeatured: true,

      // Target audience
      targetCountries: ["USA", "Canada", "UK", "Australia", "UAE"],
      languages: ["English", "Arabic", "French"],

      bookingCount: 89,
      rating: 4.9,
      reviews: 67,

      inclusions: [
        "All medical procedures and consultations",
        "14 nights luxury accommodation",
        "All meals and refreshments",
        "Airport transfers and local transportation",
        "Cultural tour packages",
        "Personal concierge service",
        "24/7 translator support",
        "Visa assistance",
        "Emergency medical support",
      ],
      exclusions: [
        "International flight tickets",
        "Travel insurance",
        "Personal shopping expenses",
        "Additional tourist activities not mentioned",
      ],

      createdAt: "2025-09-15T10:00:00Z",
      updatedAt: "2025-10-10T14:30:00Z",
    },
    {
      id: 2,
      name: "Orthopedic Surgery & Recovery Package",
      title: "Joint Replacement with Wellness Tourism",
      description:
        "Complete orthopedic surgery package including knee/hip replacement, rehabilitation, and wellness tourism with Ayurvedic treatments.",
      shortDescription: "Joint replacement surgery with Ayurvedic wellness",
      type: "elite",
      originalPrice: 450000,
      discountedPrice: 380000,
      duration: "14-18 days",
      validity: 120,

      // Medical Services
      consultations: [
        "Orthopedic Surgeon Consultation",
        "Physiotherapist Consultation",
      ],
      treatments: [
        "Joint Replacement Surgery",
        "Post-operative Physiotherapy",
        "Pain Management",
      ],
      diagnosticTests: [
        "X-rays",
        "MRI Scan",
        "Blood Tests",
        "Bone Density Test",
      ],
      surgicalProcedures: ["Knee/Hip Replacement Surgery"],

      // Tourism Components
      accommodationType: "hotel_4star",
      accommodationNights: 10,
      mealsIncluded: true,
      transportationIncluded: true,
      tourPackages: ["Wellness & Spa", "Cultural Experience"],
      touristAttractions: [
        "Kerala Backwaters",
        "Ayurvedic Centers",
        "Spice Gardens",
      ],

      // Premium Features (Elite doesn't have all premium features)
      personalConcierge: false,
      translatorService: true,
      airportPickup: true,
      visaAssistance: false,
      emergencySupport: true,

      city: "Kochi",
      country: "India",
      hospitalPartner: "Amrita Institute of Medical Sciences",

      isActive: true,
      isPopular: true,
      isFeatured: false,

      targetCountries: ["UK", "Germany", "Netherlands", "UAE"],
      languages: ["English", "German"],

      bookingCount: 156,
      rating: 4.7,
      reviews: 89,

      inclusions: [
        "Orthopedic surgery and consultations",
        "10 nights hotel accommodation",
        "All meals included",
        "Airport pickup and local transport",
        "Ayurvedic wellness treatments",
        "Cultural tour packages",
        "Translator service",
        "Emergency medical support",
      ],
      exclusions: [
        "International flights",
        "Visa processing fees",
        "Personal expenses",
        "Additional medical procedures",
      ],

      createdAt: "2025-08-20T11:00:00Z",
      updatedAt: "2025-10-08T16:15:00Z",
    },
    {
      id: 3,
      name: "Cancer Treatment Package",
      title: "Comprehensive Oncology Care",
      description:
        "Complete cancer treatment package including chemotherapy, radiation therapy, and supportive care with comfortable accommodation.",
      shortDescription: "Comprehensive cancer treatment with supportive care",
      type: "premium",
      originalPrice: 1200000,
      discountedPrice: 950000,
      duration: "30-45 days",
      validity: 365,

      consultations: [
        "Medical Oncologist",
        "Radiation Oncologist",
        "Nutritionist",
        "Psycho-oncologist",
      ],
      treatments: [
        "Chemotherapy",
        "Radiation Therapy",
        "Immunotherapy",
        "Supportive Care",
      ],
      diagnosticTests: [
        "CT Scan",
        "PET Scan",
        "Biopsy",
        "Blood Tests",
        "Genetic Testing",
      ],
      surgicalProcedures: [
        "Tumor Resection (if applicable)",
        "Lymph Node Biopsy",
      ],

      accommodationType: "medical_resort",
      accommodationNights: 28,
      mealsIncluded: true,
      transportationIncluded: true,
      tourPackages: ["Wellness & Spa", "Nature & Wildlife"],
      touristAttractions: [
        "Botanical Gardens",
        "Meditation Centers",
        "Art Galleries",
      ],

      personalConcierge: true,
      translatorService: true,
      airportPickup: true,
      visaAssistance: true,
      emergencySupport: true,

      city: "Mumbai",
      country: "India",
      hospitalPartner: "Tata Memorial Hospital",

      isActive: true,
      isPopular: false,
      isFeatured: true,

      targetCountries: ["USA", "Canada", "Australia", "South Africa"],
      languages: ["English", "Spanish"],

      bookingCount: 34,
      rating: 4.8,
      reviews: 28,

      createdAt: "2025-07-10T09:00:00Z",
      updatedAt: "2025-10-05T11:20:00Z",
    },
    {
      id: 4,
      name: "Basic Health Checkup",
      title: "Comprehensive Health Screening",
      description:
        "Complete health checkup package with doctor consultations, diagnostic tests, and basic treatments for preventive healthcare.",
      shortDescription: "Essential health screening and consultation",
      type: "standard",
      originalPrice: 15000,
      discountedPrice: 12000,
      duration: "2-3 days",
      validity: 30,

      consultations: [
        "General Physician Consultation",
        "Specialist Consultation (if required)",
      ],
      treatments: ["Basic Treatment", "Medication Prescription"],
      diagnosticTests: [
        "Complete Blood Count",
        "Lipid Profile",
        "Liver Function Test",
        "ECG",
        "Chest X-ray",
      ],
      surgicalProcedures: [],

      // Standard packages don't include tourism
      accommodationType: "",
      accommodationNights: 0,
      mealsIncluded: false,
      transportationIncluded: false,
      tourPackages: [],
      touristAttractions: [],

      personalConcierge: false,
      translatorService: false,
      airportPickup: false,
      visaAssistance: false,
      emergencySupport: false,

      city: "Chennai",
      country: "India",
      hospitalPartner: "Apollo Hospital Chennai",

      isActive: true,
      isPopular: true,
      isFeatured: false,

      targetCountries: ["India", "Sri Lanka", "Bangladesh"],
      languages: ["English", "Tamil"],

      bookingCount: 892,
      rating: 4.5,
      reviews: 234,

      createdAt: "2025-08-15T14:00:00Z",
      updatedAt: "2025-10-12T10:30:00Z",
    },
    {
      id: 5,
      name: "Dental Implant & Tourism Package",
      title: "Complete Dental Care with Leisure",
      description:
        "Comprehensive dental implant package including multiple procedures, recovery time, and leisure tourism activities in Goa.",
      shortDescription: "Dental implants with beach vacation",
      type: "elite",
      originalPrice: 180000,
      discountedPrice: 150000,
      duration: "10-12 days",
      validity: 90,

      consultations: ["Oral Surgeon Consultation", "Dental Implant Specialist"],
      treatments: [
        "Dental Implant Surgery",
        "Crown Placement",
        "Oral Hygiene Care",
      ],
      diagnosticTests: ["Dental X-rays", "CT Scan", "Oral Examination"],
      surgicalProcedures: [
        "Dental Implant Placement",
        "Bone Grafting (if required)",
      ],

      accommodationType: "hotel_5star",
      accommodationNights: 8,
      mealsIncluded: true,
      transportationIncluded: true,
      tourPackages: ["Beach Resort Stay", "Cultural Experience"],
      touristAttractions: [
        "Goa Beaches",
        "Portuguese Architecture",
        "Water Sports",
        "Local Markets",
      ],

      personalConcierge: false,
      translatorService: true,
      airportPickup: true,
      visaAssistance: false,
      emergencySupport: true,

      city: "Goa",
      country: "India",
      hospitalPartner: "Goa Dental College & Hospital",

      isActive: true,
      isPopular: true,
      isFeatured: false,

      targetCountries: ["UK", "Russia", "Germany", "France"],
      languages: ["English", "Russian", "Portuguese"],

      bookingCount: 245,
      rating: 4.6,
      reviews: 178,

      createdAt: "2025-09-01T12:00:00Z",
      updatedAt: "2025-10-09T15:30:00Z",
    },
    {
      id: 6,
      name: "Eye Surgery Package",
      title: "Advanced Vision Correction",
      description:
        "Complete eye surgery package including LASIK, cataract surgery, and post-operative care with basic accommodation.",
      shortDescription: "Eye surgery with recovery support",
      type: "standard",
      originalPrice: 85000,
      discountedPrice: 70000,
      duration: "5-7 days",
      validity: 60,

      consultations: [
        "Ophthalmologist Consultation",
        "Pre-operative Assessment",
      ],
      treatments: ["LASIK Surgery", "Cataract Surgery", "Post-operative Care"],
      diagnosticTests: ["Eye Examination", "Corneal Topography", "OCT Scan"],
      surgicalProcedures: ["LASIK", "Cataract Removal", "IOL Implantation"],

      accommodationType: "",
      accommodationNights: 0,
      mealsIncluded: false,
      transportationIncluded: false,
      tourPackages: [],
      touristAttractions: [],

      personalConcierge: false,
      translatorService: false,
      airportPickup: false,
      visaAssistance: false,
      emergencySupport: false,

      city: "Bangalore",
      country: "India",
      hospitalPartner: "Narayana Netralaya",

      isActive: true,
      isPopular: false,
      isFeatured: false,

      targetCountries: ["India", "Nepal", "Bhutan"],
      languages: ["English", "Hindi"],

      bookingCount: 167,
      rating: 4.4,
      reviews: 89,

      createdAt: "2025-08-25T08:00:00Z",
      updatedAt: "2025-10-07T09:15:00Z",
    },
    {
      id: 7,
      name: "Fertility Treatment & Wellness Package",
      title: "IVF Treatment with Holistic Care",
      description:
        "Comprehensive fertility treatment package including IVF procedures, consultations, and wellness tourism for stress relief and recovery.",
      shortDescription: "IVF treatment with wellness and yoga retreat",
      type: "premium",
      originalPrice: 320000,
      discountedPrice: 280000,
      duration: "15-20 days",
      validity: 180,

      consultations: [
        "Fertility Specialist",
        "Embryologist",
        "Counselor",
        "Nutritionist",
      ],
      treatments: ["IVF Treatment", "Embryo Transfer", "Hormone Therapy"],
      diagnosticTests: [
        "Hormone Tests",
        "Ultrasound Monitoring",
        "Semen Analysis",
        "Genetic Testing",
      ],
      surgicalProcedures: ["Egg Retrieval", "Embryo Transfer"],

      accommodationType: "medical_resort",
      accommodationNights: 12,
      mealsIncluded: true,
      transportationIncluded: true,
      tourPackages: [
        "Wellness & Spa",
        "Nature & Wildlife",
        "Religious Sites Visit",
      ],
      touristAttractions: [
        "Yoga Ashrams",
        "Ayurvedic Centers",
        "Hill Stations",
        "Temples",
      ],

      personalConcierge: true,
      translatorService: true,
      airportPickup: true,
      visaAssistance: true,
      emergencySupport: true,

      city: "Pune",
      country: "India",
      hospitalPartner: "Ruby Hall Clinic",

      isActive: true,
      isPopular: true,
      isFeatured: true,

      targetCountries: ["USA", "UK", "Canada", "Australia"],
      languages: ["English", "French"],

      bookingCount: 78,
      rating: 4.7,
      reviews: 56,

      createdAt: "2025-07-20T10:30:00Z",
      updatedAt: "2025-10-11T12:45:00Z",
    },
    {
      id: 8,
      name: "Cosmetic Surgery & Recovery Package",
      title: "Aesthetic Surgery with Leisure Stay",
      description:
        "Complete cosmetic surgery package including multiple procedures, recovery care, and luxury accommodation with spa treatments.",
      shortDescription: "Cosmetic surgery with luxury spa recovery",
      type: "elite",
      originalPrice: 275000,
      discountedPrice: 235000,
      duration: "12-15 days",
      validity: 120,

      consultations: [
        "Plastic Surgeon Consultation",
        "Anesthetist Consultation",
      ],
      treatments: [
        "Cosmetic Surgery Procedures",
        "Post-operative Care",
        "Scar Management",
      ],
      diagnosticTests: ["Pre-operative Blood Tests", "ECG", "Photography"],
      surgicalProcedures: ["Rhinoplasty", "Breast Augmentation", "Liposuction"],

      accommodationType: "hotel_5star",
      accommodationNights: 10,
      mealsIncluded: true,
      transportationIncluded: true,
      tourPackages: ["Wellness & Spa", "Shopping Tour"],
      touristAttractions: ["Luxury Spas", "Shopping Malls", "Cultural Sites"],

      personalConcierge: false,
      translatorService: true,
      airportPickup: true,
      visaAssistance: false,
      emergencySupport: true,

      city: "Mumbai",
      country: "India",
      hospitalPartner: "Kokilaben Dhirubhai Ambani Hospital",

      isActive: true,
      isPopular: true,
      isFeatured: false,

      targetCountries: ["UAE", "USA", "UK", "Australia"],
      languages: ["English", "Arabic"],

      bookingCount: 123,
      rating: 4.5,
      reviews: 97,

      createdAt: "2025-08-05T11:15:00Z",
      updatedAt: "2025-10-06T14:20:00Z",
    },
  ]);

  const packageStats = computed(() => {
    const totalPackages = packages.value.length;
    const activePackages = packages.value.filter((p) => p.isActive).length;
    const popularPackages = packages.value.filter((p) => p.isPopular).length;
    const featuredPackages = packages.value.filter((p) => p.isFeatured).length;
    const totalBookings = packages.value.reduce(
      (sum, p) => sum + p.bookingCount,
      0
    );
    const avgRating = (
      packages.value.reduce((sum, p) => sum + p.rating, 0) /
      packages.value.length
    ).toFixed(1);

    // Package type distribution
    const standardPackages = packages.value.filter(
      (p) => p.type === "standard"
    ).length;
    const elitePackages = packages.value.filter(
      (p) => p.type === "elite"
    ).length;
    const premiumPackages = packages.value.filter(
      (p) => p.type === "premium"
    ).length;

    return {
      totalPackages,
      activePackages,
      popularPackages,
      featuredPackages,
      totalBookings,
      avgRating,
      standardPackages,
      elitePackages,
      premiumPackages,
    };
  });

  const categories = computed(() => {
    const types = [...new Set(packages.value.map((p) => p.type))];
    return types.map((type) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: packages.value.filter((p) => p.type === type).length,
    }));
  });

  const addPackage = (packageData) => {
    const newPackage = {
      ...packageData,
      id: Math.max(...packages.value.map((p) => p.id)) + 1,
      bookingCount: 0,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    packages.value.unshift(newPackage);
  };

  const updatePackage = (id, packageData) => {
    const index = packages.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      packages.value[index] = {
        ...packages.value[index],
        ...packageData,
        updatedAt: new Date().toISOString(),
      };
    }
  };

  const deletePackage = (id) => {
    packages.value = packages.value.filter((p) => p.id !== id);
  };

  return {
    packages: readonly(packages),
    packageStats,
    categories,
    addPackage,
    updatePackage,
    deletePackage,
  };
};

// composables/useTreatmentsMock.js
export const useTreatmentsMock = () => {
  const treatments = ref([
    {
      id: 1,
      name: "General Consultation",
      description:
        "Comprehensive medical consultation with experienced doctors",
      category: "Consultation",
      subcategory: "General Medicine",
      price: 500,
      discountPrice: 450,
      duration: 30, // minutes
      availability: "available",
      isActive: true,
      isPopular: true,
      isFeatured: false,
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      ],
      symptoms: ["Fever", "Cold", "Headache", "Body ache"],
      prerequisites: ["No fasting required", "Bring previous reports if any"],
      procedures: [
        "Initial patient assessment",
        "Physical examination",
        "Medical history review",
        "Diagnosis and treatment plan",
        "Prescription if needed",
      ],
      doctors: [
        {
          id: 1,
          name: "Dr. Sarah Wilson",
          specialization: "General Medicine",
          rating: 4.8,
        },
        {
          id: 2,
          name: "Dr. Michael Brown",
          specialization: "Internal Medicine",
          rating: 4.9,
        },
      ],
      tags: ["consultation", "general", "checkup"],
      seo: {
        title: "General Medical Consultation - Expert Doctors",
        description:
          "Book general medical consultation with experienced doctors",
        keywords: "general consultation, doctor appointment, medical checkup",
      },
      createdAt: "2025-09-15T08:00:00Z",
      updatedAt: "2025-10-10T14:30:00Z",
    },
    {
      id: 2,
      name: "Complete Blood Count (CBC)",
      description: "Comprehensive blood test to check overall health status",
      category: "Lab Tests",
      subcategory: "Blood Tests",
      price: 250,
      discountPrice: 200,
      duration: 15,
      availability: "available",
      isActive: true,
      isPopular: true,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
      ],
      symptoms: ["Fatigue", "Weakness", "Fever", "Infection screening"],
      prerequisites: ["No fasting required", "8-12 hours fasting recommended"],
      procedures: [
        "Blood sample collection",
        "Laboratory analysis",
        "Report generation",
        "Result interpretation",
      ],
      doctors: [],
      tags: ["blood test", "cbc", "lab test", "health screening"],
      seo: {
        title: "Complete Blood Count Test - CBC Lab Test",
        description: "Get comprehensive blood count test with accurate results",
        keywords: "cbc test, blood count, lab test, blood work",
      },
      createdAt: "2025-08-20T10:00:00Z",
      updatedAt: "2025-10-08T16:15:00Z",
    },
    {
      id: 3,
      name: "Basic Health Checkup Package",
      description:
        "Comprehensive health screening package including multiple tests",
      category: "Health Packages",
      subcategory: "Preventive Care",
      price: 2500,
      discountPrice: 2000,
      duration: 120,
      availability: "available",
      isActive: true,
      isPopular: false,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
      ],
      symptoms: ["Regular health monitoring", "Preventive screening"],
      prerequisites: ["12 hours fasting required", "Comfortable clothing"],
      procedures: [
        "Registration and consultation",
        "Blood sample collection",
        "Physical examination",
        "ECG and other tests",
        "Report compilation",
        "Doctor consultation for results",
      ],
      includedTests: [
        "Complete Blood Count (CBC)",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Blood Sugar (Fasting)",
        "ECG",
        "Chest X-Ray",
        "General Physical Examination",
      ],
      doctors: [
        {
          id: 1,
          name: "Dr. Sarah Wilson",
          specialization: "General Medicine",
          rating: 4.8,
        },
        {
          id: 3,
          name: "Dr. Jennifer Walsh",
          specialization: "Preventive Medicine",
          rating: 4.7,
        },
      ],
      tags: ["health package", "checkup", "screening", "preventive"],
      seo: {
        title: "Basic Health Checkup Package - Comprehensive Screening",
        description:
          "Complete health checkup package with multiple diagnostic tests",
        keywords:
          "health checkup, medical screening, health package, diagnostic tests",
      },
      createdAt: "2025-07-10T12:00:00Z",
      updatedAt: "2025-10-05T11:20:00Z",
    },
    {
      id: 4,
      name: "Diabetes Management Consultation",
      description:
        "Specialized consultation for diabetes management and monitoring",
      category: "Consultation",
      subcategory: "Endocrinology",
      price: 800,
      discountPrice: 720,
      duration: 45,
      availability: "available",
      isActive: true,
      isPopular: false,
      isFeatured: false,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      ],
      symptoms: [
        "High blood sugar",
        "Frequent urination",
        "Excessive thirst",
        "Fatigue",
      ],
      prerequisites: [
        "Bring previous reports",
        "List of current medications",
        "Fasting blood sugar if available",
      ],
      procedures: [
        "Detailed medical history",
        "Physical examination",
        "Blood sugar monitoring",
        "Diet and lifestyle counseling",
        "Medication adjustment",
        "Follow-up planning",
      ],
      doctors: [
        {
          id: 4,
          name: "Dr. Rajesh Kumar",
          specialization: "Endocrinology",
          rating: 4.9,
        },
      ],
      tags: ["diabetes", "endocrinology", "blood sugar", "specialist"],
      seo: {
        title: "Diabetes Management Consultation - Endocrinologist",
        description:
          "Expert diabetes management consultation with specialized doctors",
        keywords:
          "diabetes consultation, endocrinologist, blood sugar management",
      },
      createdAt: "2025-09-01T09:30:00Z",
      updatedAt: "2025-10-12T13:45:00Z",
    },
    {
      id: 5,
      name: "Physiotherapy Session",
      description:
        "Professional physiotherapy treatment for pain relief and mobility",
      category: "Therapy",
      subcategory: "Physical Therapy",
      price: 600,
      discountPrice: 550,
      duration: 60,
      availability: "limited",
      isActive: true,
      isPopular: true,
      isFeatured: false,
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400",
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
      ],
      symptoms: [
        "Back pain",
        "Joint stiffness",
        "Muscle weakness",
        "Post-injury recovery",
      ],
      prerequisites: [
        "Comfortable workout clothes",
        "Doctor referral if applicable",
      ],
      procedures: [
        "Initial assessment",
        "Range of motion evaluation",
        "Customized exercise program",
        "Manual therapy techniques",
        "Progress monitoring",
        "Home exercise guidance",
      ],
      doctors: [
        {
          id: 5,
          name: "Dr. Priya Sharma",
          specialization: "Physiotherapy",
          rating: 4.6,
        },
      ],
      tags: [
        "physiotherapy",
        "physical therapy",
        "rehabilitation",
        "pain relief",
      ],
      seo: {
        title: "Physiotherapy Treatment - Pain Relief & Rehabilitation",
        description:
          "Professional physiotherapy sessions for pain management and recovery",
        keywords:
          "physiotherapy, physical therapy, pain relief, rehabilitation",
      },
      createdAt: "2025-08-15T11:00:00Z",
      updatedAt: "2025-10-09T15:30:00Z",
    },
    {
      id: 6,
      name: "Dental Cleaning & Checkup",
      description: "Professional dental cleaning and oral health examination",
      category: "Dental",
      subcategory: "Preventive Dentistry",
      price: 1200,
      discountPrice: 1000,
      duration: 45,
      availability: "unavailable",
      isActive: false,
      isPopular: false,
      isFeatured: false,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      ],
      symptoms: [
        "Dental pain",
        "Gum bleeding",
        "Bad breath",
        "Routine cleaning",
      ],
      prerequisites: ["Brush teeth before visit", "List of medications"],
      procedures: [
        "Oral examination",
        "Professional teeth cleaning",
        "Plaque and tartar removal",
        "Fluoride treatment",
        "Oral hygiene education",
        "Treatment recommendations",
      ],
      doctors: [
        {
          id: 6,
          name: "Dr. Amit Patel",
          specialization: "Dentistry",
          rating: 4.5,
        },
      ],
      tags: ["dental", "cleaning", "oral health", "preventive"],
      seo: {
        title: "Dental Cleaning & Checkup - Oral Health Care",
        description:
          "Professional dental cleaning and comprehensive oral examination",
        keywords: "dental cleaning, dental checkup, oral health, dentist",
      },
      createdAt: "2025-06-20T14:00:00Z",
      updatedAt: "2025-09-25T10:15:00Z",
    },
  ]);

  const treatmentStats = computed(() => {
    const totalTreatments = treatments.value.length;
    const activeTreatments = treatments.value.filter((t) => t.isActive).length;
    const popularTreatments = treatments.value.filter(
      (t) => t.isPopular
    ).length;
    const featuredTreatments = treatments.value.filter(
      (t) => t.isFeatured
    ).length;

    return {
      totalTreatments,
      activeTreatments,
      popularTreatments,
      featuredTreatments,
    };
  });

  const categories = computed(() => {
    const cats = [...new Set(treatments.value.map((t) => t.category))];
    return cats.map((cat) => ({
      name: cat,
      count: treatments.value.filter((t) => t.category === cat).length,
    }));
  });

  const addTreatment = (treatmentData) => {
    const newTreatment = {
      ...treatmentData,
      id: Math.max(...treatments.value.map((t) => t.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    treatments.value.unshift(newTreatment);
  };

  const updateTreatment = (id, treatmentData) => {
    const index = treatments.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      treatments.value[index] = {
        ...treatments.value[index],
        ...treatmentData,
        updatedAt: new Date().toISOString(),
      };
    }
  };

  const deleteTreatment = (id) => {
    treatments.value = treatments.value.filter((t) => t.id !== id);
  };

  return {
    treatments: readonly(treatments),
    treatmentStats,
    categories,
    addTreatment,
    updateTreatment,
    deleteTreatment,
  };
};

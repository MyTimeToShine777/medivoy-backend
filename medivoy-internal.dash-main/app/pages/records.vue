<!-- pages/records.vue -->
<script setup lang="ts">
const { ref, computed, onMounted } = await import("vue");

// State
const records = ref([]);
const searchQuery = ref("");
const filterType = ref("all");
const filterPatient = ref("all");
const selectedDate = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedRecord = ref(null);
const recordToDelete = ref({ id: 0, patient: "", type: "" });
const isSubmitting = ref(false);

// New record form
const newRecord = ref({
  patientId: "",
  type: "",
  title: "",
  description: "",
  diagnosis: "",
  treatment: "",
  medications: "",
  vitals: {
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    weight: "",
    height: "",
  },
  attachments: [],
});

// Edit record form (separate from new record)
const editRecord = ref({
  id: "",
  patientId: "",
  type: "",
  title: "",
  description: "",
  diagnosis: "",
  treatment: "",
  medications: "",
  vitals: {
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    weight: "",
    height: "",
  },
  attachments: [],
});

// Stats for records
const recordStats = ref({
  totalRecords: 324,
  todayRecords: 18,
  pendingReviews: 7,
  criticalAlerts: 3,
});

// Record types
const recordTypes = [
  { value: "consultation", label: "Consultation", icon: "🩺", color: "blue" },
  { value: "lab_report", label: "Lab Report", icon: "🧪", color: "green" },
  { value: "prescription", label: "Prescription", icon: "💊", color: "purple" },
  { value: "surgery", label: "Surgery", icon: "⚕️", color: "red" },
  { value: "imaging", label: "Imaging", icon: "📷", color: "yellow" },
  { value: "vaccination", label: "Vaccination", icon: "💉", color: "teal" },
  { value: "discharge", label: "Discharge", icon: "🏠", color: "gray" },
];

// Sample patients for dropdown
const patients = ref([
  { id: 1, name: "John Doe", age: 45, gender: "Male" },
  { id: 2, name: "Jane Smith", age: 32, gender: "Female" },
  { id: 3, name: "Robert Johnson", age: 67, gender: "Male" },
  { id: 4, name: "Emily Davis", age: 28, gender: "Female" },
  { id: 5, name: "Michael Wilson", age: 54, gender: "Male" },
  { id: 6, name: "Sarah Brown", age: 41, gender: "Female" },
  { id: 7, name: "David Garcia", age: 35, gender: "Male" },
  { id: 8, name: "Lisa Rodriguez", age: 29, gender: "Female" },
  { id: 9, name: "James Miller", age: 58, gender: "Male" },
  { id: 10, name: "Maria Martinez", age: 46, gender: "Female" },
]);

// Demo data with comprehensive medical records
onMounted(() => {
  records.value = [
    {
      id: 1001,
      patientId: 1,
      patientName: "John Doe",
      type: "consultation",
      title: "Annual Physical Examination",
      description:
        "Comprehensive annual health checkup including physical examination, medical history review, and preventive care discussion",
      diagnosis:
        "Patient in overall good health. Mild vitamin D deficiency detected. Recommended lifestyle modifications for cardiovascular health.",
      treatment:
        "Continue current exercise routine, increase outdoor activities for natural vitamin D. Schedule follow-up in 6 months.",
      medications: "Vitamin D3 2000 IU daily, Multivitamin once daily",
      doctor: "Dr. Sarah Wilson",
      date: "2025-10-13T09:30:00Z",
      vitals: {
        temperature: "98.6°F",
        bloodPressure: "120/80",
        heartRate: "72 bpm",
        weight: "70 kg",
        height: "175 cm",
      },
      status: "completed",
      priority: "normal",
      notes:
        "Patient reports feeling well. No acute concerns. Discussed importance of regular exercise and healthy diet.",
      followUp: "2025-04-13",
    },
    {
      id: 1002,
      patientId: 2,
      patientName: "Jane Smith",
      type: "lab_report",
      title: "Comprehensive Metabolic Panel",
      description:
        "Complete blood count, lipid panel, liver function tests, kidney function assessment",
      diagnosis:
        "Slightly elevated LDL cholesterol (165 mg/dL). All other values within normal limits. Good kidney and liver function.",
      treatment:
        "Dietary modifications recommended. Reduce saturated fat intake, increase fiber. Recheck lipids in 3 months.",
      medications:
        "Atorvastatin 20mg once daily at bedtime, Omega-3 supplement",
      doctor: "Dr. Michael Brown",
      date: "2025-10-12T14:15:00Z",
      vitals: {
        temperature: "98.2°F",
        bloodPressure: "128/82",
        heartRate: "76 bpm",
        weight: "62 kg",
        height: "165 cm",
      },
      status: "reviewed",
      priority: "normal",
      notes:
        "Lab results reviewed with patient. Provided dietary counseling materials.",
      followUp: "2025-01-12",
    },
    {
      id: 1003,
      patientId: 3,
      patientName: "Robert Johnson",
      type: "surgery",
      title: "Laparoscopic Cholecystectomy",
      description:
        "Minimally invasive gallbladder removal surgery due to symptomatic cholelithiasis",
      diagnosis:
        "Chronic cholecystitis with multiple gallstones. Surgery completed successfully without complications.",
      treatment:
        "Post-operative recovery protocol. Graduated diet advancement. Early mobilization encouraged.",
      medications:
        "Ketorolac 30mg q6h PRN pain, Ondansetron 4mg q6h PRN nausea, Docusate sodium 100mg BID",
      doctor: "Dr. James Anderson",
      date: "2025-10-11T07:30:00Z",
      vitals: {
        temperature: "99.1°F",
        bloodPressure: "135/88",
        heartRate: "82 bpm",
        weight: "85 kg",
        height: "178 cm",
      },
      status: "critical",
      priority: "high",
      notes:
        "Surgery completed in 45 minutes. Four-port laparoscopic technique. Patient stable post-operatively.",
      followUp: "2025-10-18",
    },
    {
      id: 1004,
      patientId: 4,
      patientName: "Emily Davis",
      type: "prescription",
      title: "Upper Respiratory Infection Treatment",
      description:
        "Treatment for bacterial upper respiratory tract infection with associated symptoms",
      diagnosis:
        "Acute bacterial sinusitis with secondary upper respiratory symptoms. Strep throat ruled out.",
      treatment:
        "Antibiotic therapy, supportive care, symptom management. Rest and increased fluid intake recommended.",
      medications:
        "Amoxicillin-Clavulanate 875/125mg BID x 10 days, Pseudoephedrine 60mg q6h PRN congestion",
      doctor: "Dr. Lisa Chen",
      date: "2025-10-10T11:20:00Z",
      vitals: {
        temperature: "101.2°F",
        bloodPressure: "118/74",
        heartRate: "88 bpm",
        weight: "58 kg",
        height: "168 cm",
      },
      status: "active",
      priority: "normal",
      notes:
        "Patient reports 5-day history of nasal congestion, facial pressure, and low-grade fever.",
      followUp: "2025-10-20",
    },
    {
      id: 1005,
      patientId: 5,
      patientName: "Michael Wilson",
      type: "imaging",
      title: "Chest X-Ray - Annual Screening",
      description:
        "Two-view chest radiograph for annual health screening and occupational health requirement",
      diagnosis:
        "Clear lung fields bilaterally. No acute cardiopulmonary abnormalities. Normal heart size and configuration.",
      treatment:
        "No acute treatment required. Continue routine preventive care and annual screenings.",
      medications: "No medications prescribed at this time",
      doctor: "Dr. Patricia Lee",
      date: "2025-10-09T13:10:00Z",
      vitals: {
        temperature: "98.4°F",
        bloodPressure: "122/78",
        heartRate: "70 bpm",
        weight: "79 kg",
        height: "180 cm",
      },
      status: "completed",
      priority: "low",
      notes:
        "Routine screening. Patient asymptomatic. Non-smoker with no respiratory complaints.",
      followUp: "2025-10-09",
    },
    {
      id: 1006,
      patientId: 6,
      patientName: "Sarah Brown",
      type: "vaccination",
      title: "Annual Influenza Vaccination",
      description:
        "Seasonal influenza vaccine administration as part of preventive care program",
      diagnosis:
        "Preventive care - annual flu vaccination administered. No contraindications identified.",
      treatment:
        "Monitor for any adverse reactions. Apply cold compress if injection site soreness develops.",
      medications:
        "Influenza vaccine (quadrivalent) 0.5ml IM deltoid. Acetaminophen PRN for soreness.",
      doctor: "Dr. Amanda Clark",
      date: "2025-10-08T15:45:00Z",
      vitals: {
        temperature: "98.3°F",
        bloodPressure: "116/72",
        heartRate: "68 bpm",
        weight: "64 kg",
        height: "163 cm",
      },
      status: "completed",
      priority: "low",
      notes:
        "Vaccine lot #FLU2025-B. Patient tolerated injection well. No immediate adverse reactions.",
      followUp: null,
    },
    {
      id: 1007,
      patientId: 7,
      patientName: "David Garcia",
      type: "lab_report",
      title: "Hemoglobin A1c and Glucose Monitoring",
      description:
        "Diabetes management follow-up with glycemic control assessment",
      diagnosis:
        "Type 2 diabetes mellitus with good glycemic control. A1c improved from 7.8% to 6.9%.",
      treatment:
        "Continue current diabetes management plan. Reinforce dietary compliance and exercise routine.",
      medications:
        "Metformin 1000mg BID, continue current regimen. No changes needed at this time.",
      doctor: "Dr. Robert Kim",
      date: "2025-10-07T10:30:00Z",
      vitals: {
        temperature: "98.7°F",
        bloodPressure: "132/84",
        heartRate: "74 bpm",
        weight: "82 kg",
        height: "177 cm",
      },
      status: "reviewed",
      priority: "normal",
      notes:
        "Excellent progress with diabetes management. Patient reports good adherence to diet and exercise.",
      followUp: "2025-01-07",
    },
    {
      id: 1008,
      patientId: 8,
      patientName: "Lisa Rodriguez",
      type: "discharge",
      title: "Post-Surgical Discharge Summary",
      description:
        "Discharge following uncomplicated appendectomy with recovery milestones achieved",
      diagnosis:
        "Status post laparoscopic appendectomy for acute appendicitis. Uncomplicated post-operative course.",
      treatment:
        "Home recovery with activity restrictions. Wound care instructions provided. Follow-up scheduled.",
      medications:
        "Ibuprofen 600mg q6h PRN pain, Colace 100mg BID, resume home medications",
      doctor: "Dr. Jennifer Walsh",
      date: "2025-10-06T16:20:00Z",
      vitals: {
        temperature: "98.9°F",
        bloodPressure: "125/79",
        heartRate: "78 bpm",
        weight: "59 kg",
        height: "161 cm",
      },
      status: "completed",
      priority: "normal",
      notes:
        "Patient meeting all discharge criteria. Tolerating regular diet. Ambulating independently.",
      followUp: "2025-10-13",
    },
  ];
});

// Computed
const filteredRecords = computed(() => {
  let list = records.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.id.toString().includes(q)
    );
  }

  if (filterType.value !== "all") {
    list = list.filter((r) => r.type === filterType.value);
  }

  if (filterPatient.value !== "all") {
    list = list.filter((r) => r.patientId.toString() === filterPatient.value);
  }

  if (selectedDate.value) {
    list = list.filter((r) => {
      const recordDate = new Date(r.date).toISOString().split("T")[0];
      return recordDate === selectedDate.value;
    });
  }

  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Update computed stats based on filtered data
const computedStats = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  const todayCount = records.value.filter((r) => {
    const recordDate = new Date(r.date).toISOString().split("T")[0];
    return recordDate === today;
  }).length;

  const pendingCount = records.value.filter(
    (r) => r.status === "pending" || r.status === "active"
  ).length;
  const criticalCount = records.value.filter(
    (r) => r.status === "critical"
  ).length;

  return {
    totalRecords: records.value.length,
    todayRecords: todayCount,
    pendingReviews: pendingCount,
    criticalAlerts: criticalCount,
  };
});

// Methods
const openAddRecord = () => {
  // Reset form
  newRecord.value = {
    patientId: "",
    type: "",
    title: "",
    description: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    vitals: {
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      weight: "",
      height: "",
    },
    attachments: [],
  };
  showAddModal.value = true;
};

const openRecordDetail = (record) => {
  selectedRecord.value = { ...record };
  showDetailModal.value = true;
};

const openEditRecord = (record) => {
  // Populate edit form with current record data
  editRecord.value = {
    id: record.id,
    patientId: record.patientId.toString(),
    type: record.type,
    title: record.title,
    description: record.description,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    medications: record.medications,
    vitals: { ...record.vitals },
    attachments: [],
  };
  selectedRecord.value = record;
  showEditModal.value = true;
};

const confirmDelete = (record) => {
  recordToDelete.value = {
    id: record.id,
    patient: record.patientName,
    type:
      recordTypes.find((t) => t.value === record.type)?.label || record.type,
  };
  showDeleteConfirm.value = true;
};

const handleDelete = () => {
  const idx = records.value.findIndex((r) => r.id === recordToDelete.value.id);
  if (idx !== -1) {
    records.value.splice(idx, 1);
  }
  showDeleteConfirm.value = false;
  recordToDelete.value = { id: 0, patient: "", type: "" };

  // Show success message (you can replace with toast notification)
  console.log("Record deleted successfully");
};

const submitRecord = async () => {
  isSubmitting.value = true;
  try {
    // API call would go here
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add to local state for demo
    const newId = Math.max(...records.value.map((r) => r.id)) + 1;
    const patient = patients.value.find(
      (p) => p.id.toString() === newRecord.value.patientId
    );

    records.value.unshift({
      id: newId,
      patientId: parseInt(newRecord.value.patientId),
      patientName: patient?.name || "Unknown",
      type: newRecord.value.type,
      title: newRecord.value.title,
      description: newRecord.value.description,
      diagnosis: newRecord.value.diagnosis,
      treatment: newRecord.value.treatment,
      medications: newRecord.value.medications,
      doctor: "Current User", // Would come from auth
      date: new Date().toISOString(),
      vitals: { ...newRecord.value.vitals },
      status: "active",
      priority: "normal",
      notes: "Newly created record",
      followUp: null,
    });

    showAddModal.value = false;
    console.log("Record added successfully");
  } catch (error) {
    console.error("Error submitting record:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const updateRecord = async () => {
  isSubmitting.value = true;
  try {
    // API call would go here
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update local state for demo
    const idx = records.value.findIndex((r) => r.id === editRecord.value.id);
    if (idx !== -1) {
      const patient = patients.value.find(
        (p) => p.id.toString() === editRecord.value.patientId
      );
      records.value[idx] = {
        ...records.value[idx],
        patientId: parseInt(editRecord.value.patientId),
        patientName: patient?.name || records.value[idx].patientName,
        type: editRecord.value.type,
        title: editRecord.value.title,
        description: editRecord.value.description,
        diagnosis: editRecord.value.diagnosis,
        treatment: editRecord.value.treatment,
        medications: editRecord.value.medications,
        vitals: { ...editRecord.value.vitals },
      };
    }

    showEditModal.value = false;
    selectedRecord.value = null;
    console.log("Record updated successfully");
  } catch (error) {
    console.error("Error updating record:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleFileUpload = (e, formType = "new") => {
  const files = Array.from(e.target.files || []);
  if (formType === "edit") {
    editRecord.value.attachments = files;
  } else {
    newRecord.value.attachments = files;
  }
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status) => {
  const classes = {
    active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    reviewed:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  };
  return classes[status] || classes.pending;
};

const getPriorityClass = (priority) => {
  const classes = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    normal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return classes[priority] || classes.normal;
};

const getTypeInfo = (type) => {
  return (
    recordTypes.find((t) => t.value === type) || { icon: "📄", color: "gray" }
  );
};

const closeAllModals = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  showDetailModal.value = false;
  showDeleteConfirm.value = false;
  selectedRecord.value = null;
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Medical Records
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Patient medical history, reports, and documentation
        </p>
      </div>
      <button
        @click="openAddRecord"
        class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
        📝 Add Record
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Total Records
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ computedStats.totalRecords }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400">📁</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Today's Records
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ computedStats.todayRecords }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span class="text-green-600 dark:text-green-400">📋</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Pending Reviews
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ computedStats.pendingReviews }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <span class="text-yellow-600 dark:text-yellow-400">⏳</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[13px] text-gray-500 dark:text-gray-400">
                Critical Alerts
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ computedStats.criticalAlerts }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span class="text-red-600 dark:text-red-400">🚨</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search records..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Types</option>
          <option
            v-for="type in recordTypes"
            :key="type.value"
            :value="type.value">
            {{ type.label }}
          </option>
        </select>

        <select
          v-model="filterPatient"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Patients</option>
          <option
            v-for="patient in patients"
            :key="patient.id"
            :value="patient.id.toString()">
            {{ patient.name }}
          </option>
        </select>

        <input
          v-model="selectedDate"
          type="date"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]" />
      </div>
    </div>

    <!-- Records List -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Medical Records
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredRecords.length }} records found
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr
              class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
              <th class="text-left px-4 py-3 font-semibold">ID</th>
              <th class="text-left px-4 py-3 font-semibold">Patient</th>
              <th class="text-left px-4 py-3 font-semibold">Type</th>
              <th class="text-left px-4 py-3 font-semibold">Title</th>
              <th class="text-left px-4 py-3 font-semibold">Doctor</th>
              <th class="text-left px-4 py-3 font-semibold">Date</th>
              <th class="text-left px-4 py-3 font-semibold">Status</th>
              <th class="text-left px-4 py-3 font-semibold">Priority</th>
              <th class="text-left px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr
              v-for="record in filteredRecords"
              :key="record.id"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
              <td class="px-4 py-3">
                <span
                  class="text-[13px] font-medium text-gray-500 dark:text-gray-400"
                  >#{{ record.id }}</span
                >
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      record.patientName
                    )}&background=d4a574&color=fff`"
                    class="w-8 h-8 rounded-full object-cover"
                    alt="" />
                  <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                    record.patientName
                  }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span>{{ getTypeInfo(record.type).icon }}</span>
                  <span class="text-gray-700 dark:text-gray-300">{{
                    recordTypes.find((t) => t.value === record.type)?.label ||
                    record.type
                  }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="max-w-xs">
                  <p
                    class="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ record.title }}
                  </p>
                  <p
                    class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
                    {{ record.description }}
                  </p>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                {{ record.doctor }}
              </td>
              <td
                class="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-400">
                {{ formatDate(record.date) }}
              </td>
              <td class="px-4 py-3">
                <span
                  :class="getStatusClass(record.status)"
                  class="px-2 py-1 text-[11px] font-semibold rounded-full uppercase">
                  {{ record.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="getPriorityClass(record.priority)"
                  class="px-2 py-1 text-[11px] font-semibold rounded-full uppercase">
                  {{ record.priority }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button
                    @click="openRecordDetail(record)"
                    class="icon-btn view-btn"
                    title="View Details">
                    👁️
                  </button>
                  <button
                    @click="openEditRecord(record)"
                    class="icon-btn edit-btn"
                    title="Edit Record">
                    ✏️
                  </button>
                  <button
                    @click="confirmDelete(record)"
                    class="icon-btn delete-btn"
                    title="Delete Record">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredRecords.length === 0">
              <td
                colspan="9"
                class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No records found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div
        class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          Showing {{ filteredRecords.length }} of {{ records.length }} records
        </span>
        <div class="flex items-center gap-2 text-xs">
          <button
            class="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Prev
          </button>
          <button
            class="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add Record Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showAddModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Medical Record
              </h3>
              <button
                @click="closeAllModals"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="submitRecord" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Patient *</label
                >
                <select
                  v-model="newRecord.patientId"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Patient</option>
                  <option
                    v-for="patient in patients"
                    :key="patient.id"
                    :value="patient.id.toString()">
                    {{ patient.name }}
                  </option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Record Type *</label
                >
                <select
                  v-model="newRecord.type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Type</option>
                  <option
                    v-for="type in recordTypes"
                    :key="type.value"
                    :value="type.value">
                    {{ type.icon }} {{ type.label }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Title *</label
              >
              <input
                v-model="newRecord.title"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Brief title for this record" />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Description</label
              >
              <textarea
                v-model="newRecord.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Detailed description of the visit/procedure"></textarea>
            </div>

            <!-- Medical Information -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Medical Information
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Diagnosis</label
                  >
                  <textarea
                    v-model="newRecord.diagnosis"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Primary and secondary diagnoses"></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Treatment Plan</label
                  >
                  <textarea
                    v-model="newRecord.treatment"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Recommended treatment and procedures"></textarea>
                </div>
              </div>

              <div class="mt-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Medications</label
                >
                <textarea
                  v-model="newRecord.medications"
                  rows="2"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                  placeholder="Prescribed medications with dosage and frequency"></textarea>
              </div>
            </div>

            <!-- Vital Signs -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Vital Signs
              </h4>

              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Temperature</label
                  >
                  <input
                    v-model="newRecord.vitals.temperature"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="98.6°F" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Blood Pressure</label
                  >
                  <input
                    v-model="newRecord.vitals.bloodPressure"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="120/80" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Heart Rate</label
                  >
                  <input
                    v-model="newRecord.vitals.heartRate"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="72 bpm" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Weight</label
                  >
                  <input
                    v-model="newRecord.vitals.weight"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="70 kg" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Height</label
                  >
                  <input
                    v-model="newRecord.vitals.height"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="175 cm" />
                </div>
              </div>
            </div>

            <!-- Attachments -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Attachments</label
              >
              <input
                type="file"
                @change="handleFileUpload($event, 'new')"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                Upload medical reports, images, documents (Max 10MB each)
              </p>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeAllModals"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSubmitting ? "Saving..." : "Save Record" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Edit Record Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Medical Record #{{ editRecord.id }}
              </h3>
              <button
                @click="closeAllModals"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="updateRecord" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Patient *</label
                >
                <select
                  v-model="editRecord.patientId"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Patient</option>
                  <option
                    v-for="patient in patients"
                    :key="patient.id"
                    :value="patient.id.toString()">
                    {{ patient.name }}
                  </option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Record Type *</label
                >
                <select
                  v-model="editRecord.type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Type</option>
                  <option
                    v-for="type in recordTypes"
                    :key="type.value"
                    :value="type.value">
                    {{ type.icon }} {{ type.label }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Title *</label
              >
              <input
                v-model="editRecord.title"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Brief title for this record" />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Description</label
              >
              <textarea
                v-model="editRecord.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Detailed description of the visit/procedure"></textarea>
            </div>

            <!-- Medical Information -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Medical Information
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Diagnosis</label
                  >
                  <textarea
                    v-model="editRecord.diagnosis"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Primary and secondary diagnoses"></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Treatment Plan</label
                  >
                  <textarea
                    v-model="editRecord.treatment"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Recommended treatment and procedures"></textarea>
                </div>
              </div>

              <div class="mt-4">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Medications</label
                >
                <textarea
                  v-model="editRecord.medications"
                  rows="2"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                  placeholder="Prescribed medications with dosage and frequency"></textarea>
              </div>
            </div>

            <!-- Vital Signs -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Vital Signs
              </h4>

              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Temperature</label
                  >
                  <input
                    v-model="editRecord.vitals.temperature"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="98.6°F" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Blood Pressure</label
                  >
                  <input
                    v-model="editRecord.vitals.bloodPressure"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="120/80" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Heart Rate</label
                  >
                  <input
                    v-model="editRecord.vitals.heartRate"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="72 bpm" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Weight</label
                  >
                  <input
                    v-model="editRecord.vitals.weight"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="70 kg" />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Height</label
                  >
                  <input
                    v-model="editRecord.vitals.height"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="175 cm" />
                </div>
              </div>
            </div>

            <!-- Attachments -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Attachments</label
              >
              <input
                type="file"
                @change="handleFileUpload($event, 'edit')"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                Upload medical reports, images, documents (Max 10MB each)
              </p>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeAllModals"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSubmitting ? "Updating..." : "Update Record" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Record Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDetailModal && selectedRecord"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{
                  getTypeInfo(selectedRecord.type).icon
                }}</span>
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ selectedRecord.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ selectedRecord.patientName }} •
                    {{ formatDate(selectedRecord.date) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="
                    openEditRecord(selectedRecord);
                    showDetailModal = false;
                  "
                  class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                  ✏️ Edit
                </button>
                <button
                  @click="closeAllModals"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Record Information
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Record ID:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100"
                      >#{{ selectedRecord.id }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Doctor:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100">{{
                      selectedRecord.doctor
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Status:</span
                    >
                    <span
                      :class="getStatusClass(selectedRecord.status)"
                      class="px-2 py-1 text-[11px] font-semibold rounded-full uppercase">
                      {{ selectedRecord.status }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Priority:</span
                    >
                    <span
                      :class="getPriorityClass(selectedRecord.priority)"
                      class="px-2 py-1 text-[11px] font-semibold rounded-full uppercase">
                      {{ selectedRecord.priority }}
                    </span>
                  </div>
                  <div
                    v-if="selectedRecord.followUp"
                    class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Follow-up:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100">{{
                      new Date(selectedRecord.followUp).toLocaleDateString()
                    }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Vital Signs
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Temperature:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100">{{
                      selectedRecord.vitals?.temperature || "Not recorded"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Blood Pressure:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100">{{
                      selectedRecord.vitals?.bloodPressure || "Not recorded"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Heart Rate:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100">{{
                      selectedRecord.vitals?.heartRate || "Not recorded"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Weight:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100">{{
                      selectedRecord.vitals?.weight || "Not recorded"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400"
                      >Height:</span
                    >
                    <span class="text-gray-900 dark:text-gray-100">{{
                      selectedRecord.vitals?.height || "Not recorded"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medical Details -->
            <div
              class="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h4>
                <p
                  class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  {{ selectedRecord.description || "No description provided" }}
                </p>
              </div>

              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Diagnosis
                </h4>
                <p
                  class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  {{ selectedRecord.diagnosis || "No diagnosis recorded" }}
                </p>
              </div>

              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Treatment Plan
                </h4>
                <p
                  class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  {{
                    selectedRecord.treatment || "No treatment plan specified"
                  }}
                </p>
              </div>

              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Medications
                </h4>
                <p
                  class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  {{
                    selectedRecord.medications || "No medications prescribed"
                  }}
                </p>
              </div>

              <div v-if="selectedRecord.notes">
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Additional Notes
                </h4>
                <p
                  class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  {{ selectedRecord.notes }}
                </p>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeAllModals"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Close
              </button>
              <button
                type="button"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                📄 Print Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Delete Medical Record
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete the
            <strong>{{ recordToDelete.type }}</strong> record for
            <strong>{{ recordToDelete.patient }}</strong
            >? This action cannot be undone and will permanently remove all
            associated medical data.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete Record
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

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
}
.icon-btn:hover {
  background: #1118271a;
  transform: scale(1.05);
}
.view-btn:hover {
  border-color: #3b82f6;
  background: #3b82f610;
  box-shadow: 0 0 0 3px #3b82f610;
}
.edit-btn:hover {
  border-color: #f59e0b;
  background: #f59e0b10;
  box-shadow: 0 0 0 3px #f59e0b10;
}
.delete-btn:hover {
  border-color: #ef4444;
  background: #ef444410;
  box-shadow: 0 0 0 3px #ef444410;
}
:global(.dark) .icon-btn {
  border-color: #374151;
}
:global(.dark) .icon-btn:hover {
  background: #374151;
}
</style>

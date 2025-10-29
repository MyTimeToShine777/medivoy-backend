<!-- pages/admin/localization.vue -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "#app";

// Router
const router = useRouter();

// Page meta
definePageMeta({
  layout: "default",
});

// Localization state
const currentLanguage = ref("en");
const currentRegion = ref("IN");
const dateFormat = ref("DD/MM/YYYY");
const timeFormat = ref("24h");
const numberFormat = ref("en-IN");
const currency = ref("INR");
const timezone = ref("Asia/Kolkata");
const firstDayOfWeek = ref("monday");

// Loading states
const isLoading = ref(false);
const isSaving = ref(false);

// Translation state with comprehensive healthcare translations
const translations = ref({
  en: {
    dashboard: "Dashboard",
    patients: "Patients",
    doctors: "Doctors",
    appointments: "Appointments",
    support: "Support",
    records: "Records",
    settings: "Settings",
    notifications: "Notifications",
    welcome: "Welcome to City Hospital Dashboard",
    total_patients: "Total Patients",
    today_appointments: "Today's Appointments",
    revenue: "Revenue",
    bed_occupancy: "Bed Occupancy",
    search_placeholder: "Search...",
    view_details: "View Details",
    save_changes: "Save Changes",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    add_new: "Add New",
    refresh: "Refresh",
    emergency: "Emergency",
    surgery: "Surgery",
    cardiology: "Cardiology",
    neurology: "Neurology",
    pediatrics: "Pediatrics",
    pharmacy: "Pharmacy",
    laboratory: "Laboratory",
    radiology: "Radiology",
    blood_bank: "Blood Bank",
    ambulance: "Ambulance",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    patients: "मरीज़",
    doctors: "डॉक्टर",
    appointments: "अपॉइंटमेंट",
    support: "सहायता",
    records: "रिकॉर्ड",
    settings: "सेटिंग्स",
    notifications: "सूचनाएं",
    welcome: "सिटी हॉस्पिटल डैशबोर्ड में आपका स्वागत है",
    total_patients: "कुल मरीज़",
    today_appointments: "आज की अपॉइंटमेंट",
    revenue: "आय",
    bed_occupancy: "बेड अधिग्रहण",
    search_placeholder: "खोजें...",
    view_details: "विवरण देखें",
    save_changes: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    add_new: "नया जोड़ें",
    refresh: "ताज़ा करें",
    emergency: "आपातकाल",
    surgery: "शल्य चिकित्सा",
    cardiology: "हृदय रोग विज्ञान",
    neurology: "न्यूरोलॉजी",
    pediatrics: "बाल चिकित्सा",
    pharmacy: "फार्मेसी",
    laboratory: "प्रयोगशाला",
    radiology: "रेडियोलॉजी",
    blood_bank: "रक्त बैंक",
    ambulance: "एम्बुलेंस",
  },
  ar: {
    dashboard: "لوحة التحكم",
    patients: "المرضى",
    doctors: "الأطباء",
    appointments: "المواعيد",
    support: "الدعم",
    records: "السجلات",
    settings: "الإعدادات",
    notifications: "الإشعارات",
    welcome: "مرحباً بك في لوحة تحكم مستشفى المدينة",
    total_patients: "إجمالي المرضى",
    today_appointments: "مواعيد اليوم",
    revenue: "الإيرادات",
    bed_occupancy: "إشغال الأسرة",
    search_placeholder: "البحث...",
    view_details: "عرض التفاصيل",
    save_changes: "حفظ التغييرات",
    cancel: "إلغاء",
    edit: "تحرير",
    delete: "حذف",
    add_new: "إضافة جديد",
    refresh: "تحديث",
    emergency: "الطوارئ",
    surgery: "الجراحة",
    cardiology: "أمراض القلب",
    neurology: "طب الأعصاب",
    pediatrics: "طب الأطفال",
    pharmacy: "الصيدلية",
    laboratory: "المختبر",
    radiology: "الأشعة",
    blood_bank: "بنك الدم",
    ambulance: "الإسعاف",
  },
  es: {
    dashboard: "Panel de Control",
    patients: "Pacientes",
    doctors: "Doctores",
    appointments: "Citas",
    support: "Soporte",
    records: "Registros",
    settings: "Configuración",
    notifications: "Notificaciones",
    welcome: "Bienvenido al Panel del Hospital",
    total_patients: "Total de Pacientes",
    today_appointments: "Citas de Hoy",
    revenue: "Ingresos",
    bed_occupancy: "Ocupación de Camas",
    search_placeholder: "Buscar...",
    view_details: "Ver Detalles",
    save_changes: "Guardar Cambios",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    add_new: "Agregar Nuevo",
    refresh: "Actualizar",
    emergency: "Emergencia",
    surgery: "Cirugía",
    cardiology: "Cardiología",
    neurology: "Neurología",
    pediatrics: "Pediatría",
    pharmacy: "Farmacia",
    laboratory: "Laboratorio",
    radiology: "Radiología",
    blood_bank: "Banco de Sangre",
    ambulance: "Ambulancia",
  },
  fr: {
    dashboard: "Tableau de Bord",
    patients: "Patients",
    doctors: "Médecins",
    appointments: "Rendez-vous",
    support: "Support",
    records: "Dossiers",
    settings: "Paramètres",
    notifications: "Notifications",
    welcome: "Bienvenue au Tableau de Bord de l'Hôpital",
    total_patients: "Total des Patients",
    today_appointments: "Rendez-vous d'Aujourd'hui",
    revenue: "Revenus",
    bed_occupancy: "Occupation des Lits",
    search_placeholder: "Rechercher...",
    view_details: "Voir les Détails",
    save_changes: "Enregistrer les Modifications",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    add_new: "Ajouter Nouveau",
    refresh: "Actualiser",
    emergency: "Urgence",
    surgery: "Chirurgie",
    cardiology: "Cardiologie",
    neurology: "Neurologie",
    pediatrics: "Pédiatrie",
    pharmacy: "Pharmacie",
    laboratory: "Laboratoire",
    radiology: "Radiologie",
    blood_bank: "Banque de Sang",
    ambulance: "Ambulance",
  },
});

// Language options with RTL support
const languageOptions = [
  { code: "en", name: "English", flag: "🇺🇸", rtl: false },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳", rtl: false },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦", rtl: true },
  { code: "es", name: "Español (Spanish)", flag: "🇪🇸", rtl: false },
  { code: "fr", name: "Français (French)", flag: "🇫🇷", rtl: false },
];

// Region options
const regionOptions = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
  { code: "EU", name: "European Union", flag: "🇪🇺", currency: "EUR" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
];

// Date format options
const dateFormatOptions = [
  { value: "DD/MM/YYYY", label: "31/12/2024" },
  { value: "MM/DD/YYYY", label: "12/31/2024" },
  { value: "YYYY-MM-DD", label: "2024-12-31" },
  { value: "DD-MM-YYYY", label: "31-12-2024" },
  { value: "DD.MM.YYYY", label: "31.12.2024" },
];

// Time format options
const timeFormatOptions = [
  { value: "24h", label: "24:00 (24-hour)" },
  { value: "12h", label: "12:00 AM/PM (12-hour)" },
];

// Timezone options
const timezoneOptions = [
  {
    value: "Asia/Kolkata",
    label: "India Standard Time (IST)",
    offset: "+05:30",
  },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "-05:00" },
  {
    value: "Europe/London",
    label: "Greenwich Mean Time (GMT)",
    offset: "+00:00",
  },
  {
    value: "Europe/Paris",
    label: "Central European Time (CET)",
    offset: "+01:00",
  },
  {
    value: "Asia/Riyadh",
    label: "Arabia Standard Time (AST)",
    offset: "+03:00",
  },
];

// Number format options
const numberFormatOptions = [
  { value: "en-IN", label: "1,23,45,678.90 (Indian)", example: "1,23,456.78" },
  { value: "en-US", label: "123,456,789.00 (US)", example: "123,456.78" },
  { value: "de-DE", label: "123.456.789,00 (German)", example: "123.456,78" },
  { value: "ar-SA", label: "123,456,789.00 (Arabic)", example: "123,456.78" },
];

// Currency options
const currencyOptions = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
];

// Week options
const weekOptions = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
];

// Custom translation editor
const customTranslations = ref({});
const showTranslationEditor = ref(false);
const editingTranslationKey = ref("");
const editingTranslationValue = ref("");

// Import/Export
const showImportModal = ref(false);
const showExportModal = ref(false);
const importData = ref("");

// Computed properties
const currentLanguageData = computed(
  () =>
    languageOptions.find((l) => l.code === currentLanguage.value) ||
    languageOptions[0]
);

const currentRegionData = computed(
  () =>
    regionOptions.find((r) => r.code === currentRegion.value) ||
    regionOptions[0]
);

const currentCurrencyData = computed(
  () =>
    currencyOptions.find((c) => c.code === currency.value) || currencyOptions[0]
);

const isRTL = computed(() => currentLanguageData.value?.rtl || false);

// Translation helper
const t = (key) => {
  const customValue = customTranslations.value[currentLanguage.value]?.[key];
  if (customValue) return customValue;

  const defaultValue = translations.value[currentLanguage.value]?.[key];
  if (defaultValue) return defaultValue;

  return translations.value.en[key] || key;
};

// Format preview functions
const formatDatePreview = () => {
  const now = new Date();
  try {
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();

    switch (dateFormat.value) {
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      case "DD.MM.YYYY":
        return `${day}.${month}.${year}`;
      default:
        return `${day}/${month}/${year}`;
    }
  } catch (e) {
    return "31/12/2024";
  }
};

const formatTimePreview = () => {
  const now = new Date();
  try {
    if (timeFormat.value === "12h") {
      return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  } catch (e) {
    return timeFormat.value === "12h" ? "2:30 PM" : "14:30";
  }
};

const formatNumberPreview = () => {
  try {
    return new Intl.NumberFormat(numberFormat.value).format(123456.78);
  } catch (e) {
    return "123,456.78";
  }
};

const formatCurrencyPreview = () => {
  try {
    return new Intl.NumberFormat(numberFormat.value, {
      style: "currency",
      currency: currency.value,
    }).format(12345.67);
  } catch (e) {
    const currencyData = currencyOptions.find((c) => c.code === currency.value);
    return `${currencyData?.symbol || "$"}12,345.67`;
  }
};

// Auto-update currency based on region
const onRegionChange = () => {
  const region = regionOptions.find((r) => r.code === currentRegion.value);
  if (region) {
    currency.value = region.currency;
  }
};

// Language switching with RTL support
const switchLanguage = (langCode) => {
  currentLanguage.value = langCode;

  // Update HTML direction for RTL support
  if (typeof document !== "undefined") {
    const langData = languageOptions.find((l) => l.code === langCode);
    if (langData) {
      document.documentElement.dir = langData.rtl ? "rtl" : "ltr";
      document.documentElement.lang = langCode;

      // Add RTL class for additional styling
      if (langData.rtl) {
        document.documentElement.classList.add("rtl");
        document.documentElement.classList.remove("ltr");
      } else {
        document.documentElement.classList.add("ltr");
        document.documentElement.classList.remove("rtl");
      }
    }
  }

  // Save to localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("selectedLanguage", langCode);
  }
};

// Translation management
const openTranslationEditor = (key) => {
  editingTranslationKey.value = key;
  editingTranslationValue.value = t(key);
  showTranslationEditor.value = true;
};

const saveCustomTranslation = () => {
  if (!customTranslations.value[currentLanguage.value]) {
    customTranslations.value[currentLanguage.value] = {};
  }
  customTranslations.value[currentLanguage.value][editingTranslationKey.value] =
    editingTranslationValue.value;
  showTranslationEditor.value = false;
  saveLocalizationSettings();
};

// Import/Export functions
const exportTranslations = (format) => {
  const data = {
    language: currentLanguage.value,
    region: currentRegion.value,
    dateFormat: dateFormat.value,
    timeFormat: timeFormat.value,
    numberFormat: numberFormat.value,
    currency: currency.value,
    timezone: timezone.value,
    firstDayOfWeek: firstDayOfWeek.value,
    customTranslations: customTranslations.value,
    exportedAt: new Date().toISOString(),
  };

  let content = "";
  let filename = "";
  let mimeType = "";

  if (format === "json") {
    content = JSON.stringify(data, null, 2);
    filename = `localization-${currentLanguage.value}-${Date.now()}.json`;
    mimeType = "application/json";
  } else if (format === "csv") {
    const currentTranslations =
      data.customTranslations[currentLanguage.value] || {};
    content =
      "Key,Translation\n" +
      Object.entries(currentTranslations)
        .map(([key, value]) => `"${key}","${value}"`)
        .join("\n");
    filename = `translations-${currentLanguage.value}-${Date.now()}.csv`;
    mimeType = "text/csv";
  }

  if (typeof Blob !== "undefined") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  showExportModal.value = false;
  alert(`${format.toUpperCase()} file exported successfully!`);
};

const importTranslations = () => {
  try {
    const data = JSON.parse(importData.value);
    if (data.customTranslations) {
      customTranslations.value = {
        ...customTranslations.value,
        ...data.customTranslations,
      };
    }
    if (data.language) switchLanguage(data.language);
    if (data.region) currentRegion.value = data.region;
    if (data.dateFormat) dateFormat.value = data.dateFormat;
    if (data.timeFormat) timeFormat.value = data.timeFormat;
    if (data.numberFormat) numberFormat.value = data.numberFormat;
    if (data.currency) currency.value = data.currency;
    if (data.timezone) timezone.value = data.timezone;
    if (data.firstDayOfWeek) firstDayOfWeek.value = data.firstDayOfWeek;

    showImportModal.value = false;
    importData.value = "";
    saveLocalizationSettings();
    alert("Localization settings imported successfully!");
  } catch (error) {
    alert("Invalid import data. Please check the JSON format.");
  }
};

// Save settings
const saveLocalizationSettings = async () => {
  isSaving.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const settings = {
      language: currentLanguage.value,
      region: currentRegion.value,
      dateFormat: dateFormat.value,
      timeFormat: timeFormat.value,
      numberFormat: numberFormat.value,
      currency: currency.value,
      timezone: timezone.value,
      firstDayOfWeek: firstDayOfWeek.value,
      customTranslations: customTranslations.value,
      savedAt: new Date().toISOString(),
    };

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("localizationSettings", JSON.stringify(settings));
    }
    alert("✅ Localization settings saved successfully!");
  } catch (error) {
    alert("❌ Failed to save settings. Please try again.");
  } finally {
    isSaving.value = false;
  }
};

// Load settings
const loadLocalizationSettings = () => {
  isLoading.value = true;

  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("localizationSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        switchLanguage(settings.language || "en");
        currentRegion.value = settings.region || "IN";
        dateFormat.value = settings.dateFormat || "DD/MM/YYYY";
        timeFormat.value = settings.timeFormat || "24h";
        numberFormat.value = settings.numberFormat || "en-IN";
        currency.value = settings.currency || "INR";
        timezone.value = settings.timezone || "Asia/Kolkata";
        firstDayOfWeek.value = settings.firstDayOfWeek || "monday";
        customTranslations.value = settings.customTranslations || {};
      }
    }
  } catch (error) {
    console.error("Failed to load localization settings:", error);
  } finally {
    isLoading.value = false;
  }
};

// Reset to defaults
const resetToDefaults = () => {
  if (
    confirm(
      "⚠️ Are you sure you want to reset all localization settings to defaults? This will remove all custom translations."
    )
  ) {
    switchLanguage("en");
    currentRegion.value = "IN";
    dateFormat.value = "DD/MM/YYYY";
    timeFormat.value = "24h";
    numberFormat.value = "en-IN";
    currency.value = "INR";
    timezone.value = "Asia/Kolkata";
    firstDayOfWeek.value = "monday";
    customTranslations.value = {};

    // Clear localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("localizationSettings");
      localStorage.removeItem("selectedLanguage");
    }

    saveLocalizationSettings();
  }
};

// Test localization
const testLocalization = () => {
  const testResults = `🧪 Localization Test Results:

Language: ${currentLanguageData.value?.name}
Region: ${currentRegionData.value?.name}  
RTL Mode: ${isRTL.value ? "YES" : "NO"}
Date Format: ${formatDatePreview()}
Time Format: ${formatTimePreview()}
Number Format: ${formatNumberPreview()}
Currency Format: ${formatCurrencyPreview()}
Timezone: ${timezone.value}

Sample Translations:
- Welcome: "${t("welcome")}"
- Patients: "${t("patients")}"
- Dashboard: "${t("dashboard")}"

All systems working correctly! ✅`;

  alert(testResults);
};

// Navigation
const goBack = () => {
  router.push("/settings");
};

// Initialize
onMounted(() => {
  loadLocalizationSettings();
});
</script>

<template>
  <div class="p-6 space-y-8 max-w-6xl mx-auto" :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- Header -->
    <div
      class="flex items-center justify-between"
      :class="{ 'flex-row-reverse': isRTL }">
      <div
        class="flex items-center gap-4"
        :class="{ 'flex-row-reverse': isRTL }">
        <button
          @click="goBack"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg
            class="w-5 h-5"
            :class="{ 'rotate-180': isRTL }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div :class="{ 'text-right': isRTL }">
          <h1
            class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            🌐 Localization Settings
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Configure language, region, and formatting preferences for your
            healthcare dashboard
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-3"
        :class="{ 'flex-row-reverse': isRTL }">
        <button
          @click="testLocalization"
          class="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          🧪 Test Settings
        </button>
        <button
          @click="resetToDefaults"
          class="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
          🔄 Reset to Defaults
        </button>
        <button
          @click="saveLocalizationSettings"
          :disabled="isSaving"
          class="px-6 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2">
          <span v-if="isSaving">💾 Saving...</span>
          <span v-else>💾 Save Changes</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4565AD] mx-auto"></div>
      <p class="text-gray-600 dark:text-gray-400 mt-4">
        Loading localization settings...
      </p>
    </div>

    <div v-else class="space-y-8">
      <!-- Current Settings Overview -->
      <div
        class="bg-gradient-to-r from-[#4565AD] to-[#4BBECF] rounded-xl p-6 text-white">
        <h2 class="text-xl font-bold mb-4" :class="{ 'text-right': isRTL }">
          🎯 Current Localization Settings
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div :class="{ 'text-right': isRTL }">
            <p class="text-blue-100 text-sm">Language</p>
            <p class="font-semibold">
              {{ currentLanguageData?.flag }} {{ currentLanguageData?.name }}
            </p>
          </div>
          <div :class="{ 'text-right': isRTL }">
            <p class="text-blue-100 text-sm">Region</p>
            <p class="font-semibold">
              {{ currentRegionData?.flag }} {{ currentRegionData?.name }}
            </p>
          </div>
          <div :class="{ 'text-right': isRTL }">
            <p class="text-blue-100 text-sm">Date Format</p>
            <p class="font-semibold">{{ formatDatePreview() }}</p>
          </div>
          <div :class="{ 'text-right': isRTL }">
            <p class="text-blue-100 text-sm">Currency</p>
            <p class="font-semibold">{{ formatCurrencyPreview() }}</p>
          </div>
          <div :class="{ 'text-right': isRTL }">
            <p class="text-blue-100 text-sm">Direction</p>
            <p class="font-semibold">{{ isRTL ? "RTL ←" : "LTR →" }}</p>
          </div>
        </div>
      </div>

      <!-- Language & Region Settings -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
          :class="{ 'flex-row-reverse text-right': isRTL }">
          🗣️ Language & Region Settings
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Language Selection -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              :class="{ 'text-right': isRTL }">
              Interface Language
            </label>
            <div
              class="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div
                v-for="lang in languageOptions"
                :key="lang.code"
                class="flex items-center"
                :class="{ 'flex-row-reverse': isRTL }">
                <input
                  :id="`lang-${lang.code}`"
                  :checked="currentLanguage === lang.code"
                  type="radio"
                  class="h-4 w-4 text-[#4565AD] focus:ring-[#4565AD] border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  @change="switchLanguage(lang.code)" />
                <label
                  :for="`lang-${lang.code}`"
                  class="ml-3 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2 hover:text-[#4565AD] transition-colors"
                  :class="{ 'mr-3 ml-0 flex-row-reverse': isRTL }">
                  <span class="text-lg">{{ lang.flag }}</span>
                  {{ lang.name }}
                  <span
                    v-if="lang.rtl"
                    class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded"
                    >RTL</span
                  >
                </label>
              </div>
            </div>
          </div>

          <!-- Region Selection -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              :class="{ 'text-right': isRTL }">
              Region & Currency
            </label>
            <div
              class="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div
                v-for="region in regionOptions"
                :key="region.code"
                class="flex items-center"
                :class="{ 'flex-row-reverse': isRTL }">
                <input
                  :id="`region-${region.code}`"
                  :checked="currentRegion === region.code"
                  type="radio"
                  class="h-4 w-4 text-[#4565AD] focus:ring-[#4565AD] border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  @change="
                    currentRegion = region.code;
                    onRegionChange();
                  " />
                <label
                  :for="`region-${region.code}`"
                  class="ml-3 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2 hover:text-[#4565AD] transition-colors"
                  :class="{ 'mr-3 ml-0 flex-row-reverse': isRTL }">
                  <span class="text-lg">{{ region.flag }}</span>
                  {{ region.name }}
                  <span
                    class="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-0.5 rounded"
                    >{{ region.currency }}</span
                  >
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Date, Time & Number Formats -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
          :class="{ 'flex-row-reverse text-right': isRTL }">
          📅 Date, Time & Number Formats
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Date Format -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              :class="{ 'text-right': isRTL }">
              Date Format
            </label>
            <select
              v-model="dateFormat"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-[#4565AD]"
              :class="{ 'text-right': isRTL }">
              <option
                v-for="format in dateFormatOptions"
                :key="format.value"
                :value="format.value">
                {{ format.label }}
              </option>
            </select>
            <p
              class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              :class="{ 'text-right': isRTL }">
              Preview: {{ formatDatePreview() }}
            </p>
          </div>

          <!-- Time Format -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              :class="{ 'text-right': isRTL }">
              Time Format
            </label>
            <select
              v-model="timeFormat"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-[#4565AD]"
              :class="{ 'text-right': isRTL }">
              <option
                v-for="format in timeFormatOptions"
                :key="format.value"
                :value="format.value">
                {{ format.label }}
              </option>
            </select>
            <p
              class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              :class="{ 'text-right': isRTL }">
              Preview: {{ formatTimePreview() }}
            </p>
          </div>

          <!-- Number Format -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              :class="{ 'text-right': isRTL }">
              Number Format
            </label>
            <select
              v-model="numberFormat"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-[#4565AD]"
              :class="{ 'text-right': isRTL }">
              <option
                v-for="format in numberFormatOptions"
                :key="format.value"
                :value="format.value">
                {{ format.label }}
              </option>
            </select>
            <p
              class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              :class="{ 'text-right': isRTL }">
              Preview: {{ formatNumberPreview() }}
            </p>
          </div>

          <!-- Timezone -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              :class="{ 'text-right': isRTL }">
              Timezone
            </label>
            <select
              v-model="timezone"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-[#4565AD]"
              :class="{ 'text-right': isRTL }">
              <option
                v-for="tz in timezoneOptions"
                :key="tz.value"
                :value="tz.value">
                {{ tz.label }} ({{ tz.offset }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Translation Management -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div
          class="flex items-center justify-between mb-6"
          :class="{ 'flex-row-reverse': isRTL }">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🔤 Translation Management
          </h3>
          <div class="flex gap-2" :class="{ 'flex-row-reverse': isRTL }">
            <button
              @click="showImportModal = true"
              class="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              📥 Import
            </button>
            <button
              @click="showExportModal = true"
              class="px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
              📤 Export
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(value, key) in translations[currentLanguage] || {}"
            :key="key"
            class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#4565AD] hover:shadow-sm transition-all cursor-pointer"
            @click="openTranslationEditor(key)">
            <div
              class="flex items-center justify-between"
              :class="{ 'flex-row-reverse': isRTL }">
              <div class="flex-1 min-w-0" :class="{ 'text-right': isRTL }">
                <p
                  class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
                  {{ key.replace(/[._]/g, " ") }}
                </p>
                <p class="text-sm text-gray-900 dark:text-white truncate">
                  {{ t(key) }}
                </p>
              </div>
              <svg
                class="w-4 h-4 text-gray-400 hover:text-[#4565AD] transition-colors"
                :class="{ 'rotate-180': isRTL }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Preview -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
          :class="{ 'flex-row-reverse text-right': isRTL }">
          👁️ Live Preview
        </h3>

        <div
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-6"
          :dir="isRTL ? 'rtl' : 'ltr'">
          <div
            class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
            :class="{ 'flex-row-reverse': isRTL }">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ t("welcome") }}
            </h4>
            <span class="text-sm text-gray-500"
              >{{ formatDatePreview() }} • {{ formatTimePreview() }}</span
            >
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {{ t("total_patients") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatNumberPreview().split(".")[0] }}
              </p>
            </div>
            <div class="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {{ t("today_appointments") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">45</p>
            </div>
            <div class="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {{ t("revenue") }}
              </p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ formatCurrencyPreview() }}
              </p>
            </div>
            <div class="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {{ t("bed_occupancy") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                78%
              </p>
            </div>
          </div>

          <div
            class="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
            :class="{ 'flex-row-reverse': isRTL }">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {{ t("emergency") }}
            </span>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              {{ t("surgery") }}
            </span>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              {{ t("cardiology") }}
            </span>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {{ t("pharmacy") }}
            </span>
          </div>

          <div class="flex gap-3 pt-4" :class="{ 'flex-row-reverse': isRTL }">
            <button
              class="px-4 py-2 bg-[#4565AD] text-white text-sm rounded-lg hover:opacity-95 transition-opacity">
              {{ t("save_changes") }}
            </button>
            <button
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              {{ t("cancel") }}
            </button>
            <button
              class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {{ t("refresh") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Translation Editor Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showTranslationEditor"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white"
              :class="{ 'text-right': isRTL }">
              Edit Translation
            </h3>
            <p
              class="text-sm text-gray-500 dark:text-gray-400 mt-1"
              :class="{ 'text-right': isRTL }">
              Key: {{ editingTranslationKey.replace(/[._]/g, " ") }}
            </p>
            <p
              class="text-xs text-blue-600 dark:text-blue-400 mt-1"
              :class="{ 'text-right': isRTL }">
              Language: {{ currentLanguageData?.name }}
            </p>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                :class="{ 'text-right': isRTL }">
                Translation Text
              </label>
              <textarea
                v-model="editingTranslationValue"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-[#4565AD]"
                :class="{ 'text-right': isRTL }"
                placeholder="Enter translation..."></textarea>
              <p
                class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                :class="{ 'text-right': isRTL }">
                This will override the default translation for this language
              </p>
            </div>
          </div>
          <div
            class="p-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800"
            :class="{ 'flex-row-reverse': isRTL }">
            <button
              @click="showTranslationEditor = false"
              class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button
              @click="saveCustomTranslation"
              class="px-4 py-2 text-sm bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
              Save Translation
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Import Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showImportModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg shadow-xl">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white"
              :class="{ 'text-right': isRTL }">
              Import Localization Settings
            </h3>
            <p
              class="text-sm text-gray-500 dark:text-gray-400 mt-1"
              :class="{ 'text-right': isRTL }">
              Import previously exported settings and translations
            </p>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                :class="{ 'text-right': isRTL }">
                Paste JSON Data
              </label>
              <textarea
                v-model="importData"
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-[#4565AD] font-mono text-sm"
                :class="{ 'text-right': isRTL }"
                placeholder='{"language": "en", "region": "IN", ...}'></textarea>
              <p
                class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                :class="{ 'text-right': isRTL }">
                Paste the complete JSON data from your exported file
              </p>
            </div>
          </div>
          <div
            class="p-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800"
            :class="{ 'flex-row-reverse': isRTL }">
            <button
              @click="
                showImportModal = false;
                importData = '';
              "
              class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button
              @click="importTranslations"
              :disabled="!importData.trim()"
              class="px-4 py-2 text-sm bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              Import Settings
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Export Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showExportModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white"
              :class="{ 'text-right': isRTL }">
              Export Localization Settings
            </h3>
            <p
              class="text-sm text-gray-500 dark:text-gray-400 mt-1"
              :class="{ 'text-right': isRTL }">
              Choose format to download your settings
            </p>
          </div>
          <div class="p-6 space-y-3">
            <button
              @click="exportTranslations('json')"
              class="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-left"
              :class="{ 'text-right': isRTL }">
              <div
                class="flex items-center gap-3"
                :class="{ 'flex-row-reverse': isRTL }">
                <span class="text-lg">📄</span>
                <div>
                  <div class="font-medium">JSON Format</div>
                  <div class="text-xs opacity-80">
                    Complete settings with all translations and configurations
                  </div>
                </div>
              </div>
            </button>
            <button
              @click="exportTranslations('csv')"
              class="w-full px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-left"
              :class="{ 'text-right': isRTL }">
              <div
                class="flex items-center gap-3"
                :class="{ 'flex-row-reverse': isRTL }">
                <span class="text-lg">📊</span>
                <div>
                  <div class="font-medium">CSV Format</div>
                  <div class="text-xs opacity-80">
                    Custom translations only for spreadsheet editing
                  </div>
                </div>
              </div>
            </button>
          </div>
          <div
            class="p-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800"
            :class="{ 'flex-row-reverse': isRTL }">
            <button
              @click="showExportModal = false"
              class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* RTL Support for Arabic */
[dir="rtl"] {
  direction: rtl;
}

/* Animation for loading state */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}
</style>

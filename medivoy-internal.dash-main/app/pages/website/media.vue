<!-- pages/website/media.vue -->
<script setup lang="ts">
import { useMediaMock } from "~/composables/useMediaMock";

const {
  mediaItems,
  mediaStats,
  addMediaItem,
  updateMediaItem,
  deleteMediaItem,
  bulkUpdateStatus,
  bulkDelete,
  incrementViewCount,
  incrementDownloadCount,
} = useMediaMock();

// State management
const searchQuery = ref("");
const filterType = ref("all");
const filterCategory = ref("all");
const filterStatus = ref("all");
const filterLanguage = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showBulkModal = ref(false);
const showPreviewModal = ref(false);
const selectedMedia = ref(null);
const mediaToDelete = ref(null);
const selectedItems = ref([]);
const isSubmitting = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const sortBy = ref("lastModified");
const sortOrder = ref("desc");
const viewMode = ref("grid");

// Form data
const mediaForm = ref({
  id: null,
  title: "",
  description: "",
  type: "image",
  category: "",
  fileUrl: "",
  thumbnailUrl: "",
  fileSize: "",
  duration: "",
  resolution: "",
  format: "",
  status: "draft",
  visibility: "public",
  tags: [],
  languages: [],
  seoTitle: "",
  seoDescription: "",
  altText: "",
  copyrightInfo: "",
  expiryDate: "",
});

// Updated Options for International/Arab focus
const mediaTypes = [
  {
    value: "image",
    label: "Image",
    icon: "🖼️",
    accept: ".jpg,.jpeg,.png,.gif,.webp",
  },
  {
    value: "video",
    label: "Video",
    icon: "🎥",
    accept: ".mp4,.avi,.mov,.webm",
  },
  { value: "audio", label: "Audio", icon: "🎵", accept: ".mp3,.wav,.ogg" },
  {
    value: "document",
    label: "Document",
    icon: "📄",
    accept: ".pdf,.doc,.docx,.ppt,.pptx",
  },
];

const categoryOptions = [
  "promotional",
  "educational",
  "testimonials",
  "staff",
  "infrastructure",
  "training",
  "events",
  "announcements",
  "research",
  "awards",
  "cultural",
  "religious",
];

const statusOptions = [
  {
    value: "draft",
    label: "Draft",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  {
    value: "review",
    label: "Under Review",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "published",
    label: "Published",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    value: "archived",
    label: "Archived",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
];

const visibilityOptions = [
  { value: "public", label: "Public", icon: "🌍" },
  { value: "restricted", label: "Restricted", icon: "🔒" },
  { value: "private", label: "Private", icon: "👁️‍🗨️" },
];

// International/Arab-focused language options
const languageOptions = [
  "arabic", // Primary focus on Arabic
  "english", // International standard
  "french", // Common in North Africa/Lebanon
  "urdu", // Pakistani/Indian communities
  "farsi", // Persian/Iranian
  "turkish", // Turkey and Turkish communities
  "kurdish", // Kurdish regions
  "hebrew", // Israel
  "somali", // Somalia/Horn of Africa
  "bengali", // Bangladesh communities
  "tagalog", // Filipino workers
  "russian", // Central Asian communities
  "spanish", // International
  "german", // European expats
  "italian", // European expats
  "universal", // For images/content that transcends language
];

// Temporary input fields
const newTag = ref("");

// Computed
const filteredMediaItems = computed(() => {
  let filtered = [...mediaItems.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filterType.value !== "all") {
    filtered = filtered.filter((m) => m.type === filterType.value);
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter((m) => m.category === filterCategory.value);
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter((m) => m.status === filterStatus.value);
  }

  if (filterLanguage.value !== "all") {
    filtered = filtered.filter((m) =>
      m.languages.includes(filterLanguage.value)
    );
  }

  return filtered.sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];

    if (sortBy.value === "lastModified" || sortBy.value === "uploadDate") {
      const dateA = new Date(aVal);
      const dateB = new Date(bVal);
      return sortOrder.value === "desc" ? dateB - dateA : dateA - dateB;
    }

    if (typeof aVal === "number") {
      return sortOrder.value === "desc" ? bVal - aVal : aVal - bVal;
    }

    const strA = String(aVal || "");
    const strB = String(bVal || "");
    return sortOrder.value === "desc"
      ? strB.localeCompare(strA)
      : strA.localeCompare(strB);
  });
});

// Helper functions
const getMediaTypeIcon = (type) => {
  return mediaTypes.find((t) => t.value === type)?.icon || "📄";
};

const getStatusInfo = (status) => {
  return statusOptions.find((s) => s.value === status) || statusOptions[0];
};

const formatFileSize = (size) => {
  if (!size) return "Unknown";
  return size;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to format language name for display
const formatLanguageName = (lang) => {
  const languageNames = {
    arabic: "العربية (Arabic)",
    english: "English",
    french: "Français (French)",
    urdu: "اردو (Urdu)",
    farsi: "فارسی (Farsi)",
    turkish: "Türkçe (Turkish)",
    kurdish: "کوردی (Kurdish)",
    hebrew: "עברית (Hebrew)",
    somali: "Soomaali (Somali)",
    bengali: "বাংলা (Bengali)",
    tagalog: "Tagalog",
    russian: "Русский (Russian)",
    spanish: "Español",
    german: "Deutsch",
    italian: "Italiano",
    universal: "Universal",
  };
  return languageNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
};

// Array manipulation functions
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !mediaForm.value.tags.includes(tag)) {
    mediaForm.value.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index) => {
  mediaForm.value.tags.splice(index, 1);
};

// CRUD Operations
const openAddModal = () => {
  resetForm();
  showAddModal.value = true;
};

const openEditModal = (media) => {
  mediaForm.value = {
    ...media,
    tags: [...(media.tags || [])],
    languages: [...(media.languages || [])],
  };
  selectedMedia.value = media;
  showEditModal.value = true;
};

const openDeleteModal = (media) => {
  mediaToDelete.value = media;
  showDeleteModal.value = true;
};

const openPreviewModal = (media) => {
  selectedMedia.value = media;
  incrementViewCount(media.id);
  showPreviewModal.value = true;
};

const openBulkModal = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select items to perform bulk operations");
    return;
  }
  showBulkModal.value = true;
};

const resetForm = () => {
  mediaForm.value = {
    id: null,
    title: "",
    description: "",
    type: "image",
    category: "",
    fileUrl: "",
    thumbnailUrl: "",
    fileSize: "",
    duration: "",
    resolution: "",
    format: "",
    status: "draft",
    visibility: "public",
    tags: [],
    languages: [],
    seoTitle: "",
    seoDescription: "",
    altText: "",
    copyrightInfo: "",
    expiryDate: "",
  };
  newTag.value = "";
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  uploadProgress.value = 0;

  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 30;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      uploadProgress.value = 100;

      mediaForm.value.title =
        mediaForm.value.title || file.name.replace(/\.[^/.]+$/, "");
      mediaForm.value.fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
      mediaForm.value.format = file.name.split(".").pop().toUpperCase();
      mediaForm.value.fileUrl = `/media/${mediaForm.value.type}s/${file.name}`;

      if (
        mediaForm.value.type === "image" ||
        mediaForm.value.type === "video"
      ) {
        mediaForm.value.thumbnailUrl = `/media/thumbnails/${file.name.replace(
          /\.[^/.]+$/,
          ""
        )}-thumb.jpg`;
      }

      setTimeout(() => {
        isUploading.value = false;
        uploadProgress.value = 0;
      }, 1000);
    }
  }, 200);
};

const saveMedia = async () => {
  try {
    isSubmitting.value = true;

    if (
      !mediaForm.value.title ||
      !mediaForm.value.type ||
      !mediaForm.value.category
    ) {
      alert("Please fill in all required fields (Title, Type, Category)");
      return;
    }

    if (mediaForm.value.id) {
      updateMediaItem(mediaForm.value.id, mediaForm.value);
      alert("Media updated successfully!");
    } else {
      addMediaItem(mediaForm.value);
      alert("Media uploaded successfully!");
    }

    showAddModal.value = false;
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving media:", error);
    alert("Error saving media. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  try {
    deleteMediaItem(mediaToDelete.value.id);
    showDeleteModal.value = false;
    mediaToDelete.value = null;
    alert("Media deleted successfully!");
  } catch (error) {
    console.error("Error deleting media:", error);
    alert("Error deleting media. Please try again.");
  }
};

const handleBulkOperation = async (operation, status = null) => {
  try {
    if (operation === "status" && status) {
      bulkUpdateStatus(selectedItems.value, status);
      alert(`Updated ${selectedItems.value.length} items to ${status}`);
    } else if (operation === "delete") {
      if (
        confirm(
          `Are you sure you want to delete ${selectedItems.value.length} selected items?`
        )
      ) {
        bulkDelete(selectedItems.value);
        alert(`Deleted ${selectedItems.value.length} items`);
      }
    }

    selectedItems.value = [];
    showBulkModal.value = false;
  } catch (error) {
    console.error("Error performing bulk operation:", error);
    alert("Error performing bulk operation. Please try again.");
  }
};

const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
  }
};

const selectAllItems = () => {
  if (selectedItems.value.length === filteredMediaItems.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredMediaItems.value.map((item) => item.id);
  }
};

const downloadMedia = (media) => {
  incrementDownloadCount(media.id);
  alert(`Downloading: ${media.title}`);
};

const duplicateMedia = (media) => {
  mediaForm.value = {
    ...media,
    id: null,
    title: `${media.title} (Copy)`,
    tags: [...media.tags],
    languages: [...media.languages],
  };
  showAddModal.value = true;
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          International Media Management
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Manage multimedia content across Middle East and international
          healthcare facilities
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openBulkModal"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
          📦 Bulk Actions ({{ selectedItems.length }})
        </button>
        <div
          class="flex rounded-lg border border-gray-300 dark:border-gray-700 p-1">
          <button
            @click="viewMode = 'grid'"
            :class="
              viewMode === 'grid'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            ⊞ Grid
          </button>
          <button
            @click="viewMode = 'list'"
            :class="
              viewMode === 'list'
                ? 'bg-[#4565AD] text-white'
                : 'text-gray-600 dark:text-gray-400'
            "
            class="px-3 py-1 rounded text-sm transition-colors">
            ☰ List
          </button>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
          📁 Upload Media
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Items
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ mediaStats.totalItems }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span class="text-blue-600 dark:text-blue-400">📁</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Published
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ mediaStats.publishedItems }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400">✅</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Storage Used
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ mediaStats.totalStorageUsed }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400">💾</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Total Views
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ mediaStats.totalViews.toLocaleString() }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="text-orange-600 dark:text-orange-400">👁️</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[13px] text-gray-500 dark:text-gray-400">
              Downloads
            </p>
            <p
              class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ mediaStats.totalDownloads.toLocaleString() }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="text-yellow-600 dark:text-yellow-400">📥</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Type Stats -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Media Types by Region
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="type in mediaTypes"
          :key="type.value"
          class="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
          @click="filterType = type.value">
          <div class="text-2xl mb-2">{{ type.icon }}</div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ type.label }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ mediaStats.typeStats[type.value] }} items
          </p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <div class="relative md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search international media..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Types</option>
          <option
            v-for="type in mediaTypes"
            :key="type.value"
            :value="type.value">
            {{ type.icon }} {{ type.label }}
          </option>
        </select>

        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Categories</option>
          <option
            v-for="category in categoryOptions"
            :key="category"
            :value="category">
            {{ category.charAt(0).toUpperCase() + category.slice(1) }}
          </option>
        </select>

        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Status</option>
          <option
            v-for="status in statusOptions"
            :key="status.value"
            :value="status.value">
            {{ status.label }}
          </option>
        </select>

        <select
          v-model="filterLanguage"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="all">All Languages</option>
          <option
            v-for="language in languageOptions"
            :key="language"
            :value="language">
            {{ formatLanguageName(language) }}
          </option>
        </select>

        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
          <option value="lastModified">Last Modified</option>
          <option value="uploadDate">Upload Date</option>
          <option value="title">Title</option>
          <option value="viewCount">Views</option>
          <option value="downloadCount">Downloads</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              :checked="
                selectedItems.length === filteredMediaItems.length &&
                filteredMediaItems.length > 0
              "
              @change="selectAllItems"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
            <span class="text-gray-700 dark:text-gray-300"
              >Select All ({{ filteredMediaItems.length }})</span
            >
          </label>
        </div>
        <button
          @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
          class="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
          Sort {{ sortOrder === "desc" ? "↓" : "↑" }}
        </button>
      </div>
    </div>

    <!-- Media Grid -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="media in filteredMediaItems"
        :key="media.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-200 group">
        <!-- Thumbnail/Preview -->
        <div class="relative">
          <div
            class="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div v-if="media.thumbnailUrl" class="w-full h-full">
              <img
                :src="media.thumbnailUrl"
                :alt="media.altText || media.title"
                class="w-full h-full object-cover" />
            </div>
            <div v-else class="text-4xl opacity-50">
              {{ getMediaTypeIcon(media.type) }}
            </div>
          </div>

          <!-- Overlay Actions -->
          <div
            class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              @click="openPreviewModal(media)"
              class="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
              title="Preview">
              👁️
            </button>
            <button
              @click="downloadMedia(media)"
              class="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
              title="Download">
              📥
            </button>
            <button
              @click="openEditModal(media)"
              class="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
              title="Edit">
              ✏️
            </button>
            <button
              @click="duplicateMedia(media)"
              class="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
              title="Duplicate">
              📋
            </button>
            <button
              @click="openDeleteModal(media)"
              class="p-2 bg-white rounded-full text-red-800 hover:bg-red-100 transition-colors"
              title="Delete">
              🗑️
            </button>
          </div>

          <!-- Selection Checkbox -->
          <div class="absolute top-3 left-3">
            <input
              type="checkbox"
              :checked="selectedItems.includes(media.id)"
              @change="toggleItemSelection(media.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
          </div>

          <!-- Media Type Badge -->
          <div class="absolute top-3 right-3">
            <span
              class="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
              {{ media.type.toUpperCase() }}
            </span>
          </div>

          <!-- Duration/Size Badge -->
          <div
            v-if="media.duration || media.fileSize"
            class="absolute bottom-3 right-3">
            <span
              class="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
              {{ media.duration || formatFileSize(media.fileSize) }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3
              class="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 flex-1">
              {{ media.title }}
            </h3>
            <span
              :class="getStatusInfo(media.status).color"
              class="px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0">
              {{ getStatusInfo(media.status).label }}
            </span>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {{ media.description }}
          </p>

          <!-- Languages Badge -->
          <div
            v-if="media.languages && media.languages.length > 0"
            class="mb-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="lang in media.languages.slice(0, 3)"
                :key="lang"
                class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded"
                :title="formatLanguageName(lang)">
                {{
                  lang === "arabic"
                    ? "العربية"
                    : lang === "english"
                    ? "EN"
                    : lang.slice(0, 2).toUpperCase()
                }}
              </span>
              <span
                v-if="media.languages.length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                +{{ media.languages.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Metadata -->
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1">
                👁️ {{ media.viewCount }}
              </span>
              <span class="flex items-center gap-1">
                📥 {{ media.downloadCount }}
              </span>
            </div>
            <span>{{ formatDate(media.lastModified).split(",")[0] }}</span>
          </div>

          <!-- Tags -->
          <div v-if="media.tags && media.tags.length > 0" class="mt-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in media.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                {{ tag }}
              </span>
              <span
                v-if="media.tags.length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                +{{ media.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Expiry Warning -->
          <div
            v-if="
              media.expiryDate &&
              getDaysUntilExpiry(media.expiryDate) !== null &&
              getDaysUntilExpiry(media.expiryDate) <= 30
            "
            class="mt-2">
            <div
              :class="
                isExpired(media.expiryDate)
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              "
              class="px-2 py-1 text-xs rounded">
              {{
                isExpired(media.expiryDate)
                  ? "⚠️ Expired"
                  : `⏰ Expires in ${getDaysUntilExpiry(media.expiryDate)} days`
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div
      v-else
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            International Media List
          </h2>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            {{ filteredMediaItems.length }} items found
          </p>
        </div>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-800">
        <div
          v-for="media in filteredMediaItems"
          :key="media.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
          <div class="flex items-center gap-4">
            <!-- Selection -->
            <input
              type="checkbox"
              :checked="selectedItems.includes(media.id)"
              @change="toggleItemSelection(media.id)"
              class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />

            <!-- Thumbnail -->
            <div
              class="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div v-if="media.thumbnailUrl" class="w-full h-full">
                <img
                  :src="media.thumbnailUrl"
                  :alt="media.altText || media.title"
                  class="w-full h-full object-cover rounded-lg" />
              </div>
              <div v-else class="text-2xl opacity-50">
                {{ getMediaTypeIcon(media.type) }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3
                    class="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {{ media.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ media.description }}
                  </p>
                  <div
                    class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span class="capitalize"
                      >{{ media.type }} • {{ media.category }}</span
                    >
                    <span>{{ formatFileSize(media.fileSize) }}</span>
                    <span v-if="media.duration">{{ media.duration }}</span>
                    <span>{{ media.viewCount }} views</span>
                    <span>{{ media.downloadCount }} downloads</span>
                    <span>{{ formatDate(media.lastModified) }}</span>
                  </div>
                </div>

                <!-- Status and Actions -->
                <div class="flex items-center gap-3 ml-4">
                  <span
                    :class="getStatusInfo(media.status).color"
                    class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusInfo(media.status).label }}
                  </span>

                  <div class="flex items-center gap-1">
                    <button
                      @click="openPreviewModal(media)"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Preview">
                      👁️
                    </button>
                    <button
                      @click="downloadMedia(media)"
                      class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Download">
                      📥
                    </button>
                    <button
                      @click="duplicateMedia(media)"
                      class="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Duplicate">
                      📋
                    </button>
                    <button
                      @click="openEditModal(media)"
                      class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      title="Edit">
                      ✏️
                    </button>
                    <button
                      @click="openDeleteModal(media)"
                      class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Languages & Tags -->
          <div class="mt-3 ml-20 flex items-center gap-4">
            <!-- Languages -->
            <div v-if="media.languages && media.languages.length > 0">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="lang in media.languages.slice(0, 5)"
                  :key="lang"
                  class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded"
                  :title="formatLanguageName(lang)">
                  {{
                    lang === "arabic"
                      ? "العربية"
                      : lang === "english"
                      ? "EN"
                      : lang.slice(0, 2).toUpperCase()
                  }}
                </span>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="media.tags && media.tags.length > 0">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in media.tags.slice(0, 5)"
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredMediaItems.length === 0"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <div class="text-6xl mb-4">📁</div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No international media found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your search criteria or upload your first international
        media file.
      </p>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
        Upload Media
      </button>
    </div>

    <!-- Add/Edit Media Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{
                  showEditModal
                    ? "Edit International Media"
                    : "Upload New International Media"
                }}
              </h3>
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = false;
                  resetForm();
                "
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="saveMedia" class="p-6 space-y-6">
            <!-- File Upload (for new media) -->
            <div v-if="showAddModal">
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                File Upload
              </h4>
              <div
                class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                <div class="text-center">
                  <div class="text-4xl mb-4">📁</div>
                  <div class="mb-4">
                    <label class="cursor-pointer">
                      <span
                        class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                        Choose File
                      </span>
                      <input
                        type="file"
                        :accept="
                          mediaTypes.find((t) => t.value === mediaForm.type)
                            ?.accept
                        "
                        @change="handleFileUpload"
                        class="hidden" />
                    </label>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop or click to upload international media files
                  </p>
                </div>

                <!-- Upload Progress -->
                <div v-if="isUploading" class="mt-4">
                  <div
                    class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="bg-[#4565AD] h-2 rounded-full transition-all duration-300"
                      :style="`width: ${uploadProgress}%`"></div>
                  </div>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Uploading... {{ Math.round(uploadProgress) }}%
                  </p>
                </div>
              </div>
            </div>

            <!-- Basic Information -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Title *</label
                  >
                  <input
                    v-model="mediaForm.title"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Enter international media title" />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="mediaForm.description"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Enter media description with cultural context and region information"></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Type *</label
                  >
                  <select
                    v-model="mediaForm.type"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="type in mediaTypes"
                      :key="type.value"
                      :value="type.value">
                      {{ type.icon }} {{ type.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Category *</label
                  >
                  <select
                    v-model="mediaForm.category"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option value="">Select Category</option>
                    <option
                      v-for="category in categoryOptions"
                      :key="category"
                      :value="category">
                      {{ category.charAt(0).toUpperCase() + category.slice(1) }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Status</label
                  >
                  <select
                    v-model="mediaForm.status"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="status in statusOptions"
                      :key="status.value"
                      :value="status.value">
                      {{ status.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Visibility</label
                  >
                  <select
                    v-model="mediaForm.visibility"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                    <option
                      v-for="visibility in visibilityOptions"
                      :key="visibility.value"
                      :value="visibility.value">
                      {{ visibility.icon }} {{ visibility.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tags & Languages -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Tags & International Languages
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Tags -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Tags</label
                  >
                  <div class="flex gap-2 mb-2">
                    <input
                      v-model="newTag"
                      type="text"
                      placeholder="Add tag..."
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] text-sm"
                      @keyup.enter="addTag" />
                    <button
                      type="button"
                      @click="addTag"
                      class="px-3 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm">
                      Add
                    </button>
                  </div>
                  <div
                    v-if="mediaForm.tags.length > 0"
                    class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in mediaForm.tags"
                      :key="index"
                      class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                      {{ tag }}
                      <button
                        type="button"
                        @click="removeTag(index)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <!-- International Languages -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Languages</label
                  >
                  <div
                    class="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <label
                      v-for="language in languageOptions"
                      :key="language"
                      class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        :value="language"
                        v-model="mediaForm.languages"
                        class="rounded border-gray-300 text-[#4565AD] focus:ring-[#4565AD]" />
                      <span class="text-gray-700 dark:text-gray-300">{{
                        formatLanguageName(language)
                      }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- SEO & Accessibility -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                SEO & Accessibility
              </h4>
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >SEO Title</label
                  >
                  <input
                    v-model="mediaForm.seoTitle"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="SEO optimized title for international audience" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >SEO Description</label
                  >
                  <textarea
                    v-model="mediaForm.seoDescription"
                    rows="2"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="SEO meta description with regional keywords"></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Alt Text (for images)</label
                  >
                  <input
                    v-model="mediaForm.altText"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="Alt text for accessibility (describe image content)" />
                </div>
              </div>
            </div>

            <!-- Additional Settings -->
            <div>
              <h4
                class="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Additional Settings
              </h4>
              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Copyright Information</label
                  >
                  <input
                    v-model="mediaForm.copyrightInfo"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                    placeholder="© 2025 International Healthcare Network" />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Expiry Date (optional)</label
                  >
                  <input
                    v-model="mediaForm.expiryDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]" />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="
                  showAddModal = showEditModal = false;
                  resetForm();
                "
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || isUploading"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{
                  isSubmitting
                    ? "Saving..."
                    : showEditModal
                    ? "Update Media"
                    : "Upload Media"
                }}
              </button>
            </div>
          </form>
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
        v-if="showDeleteModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗑️ Delete International Media
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this international media item? This
            action cannot be undone and may affect multilingual content
            availability.
          </p>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ mediaToDelete?.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ mediaToDelete?.type }} •
              {{ formatFileSize(mediaToDelete?.fileSize) }} • Languages:
              {{ mediaToDelete?.languages?.join(", ") }}
            </p>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="button"
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
              Delete Media
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bulk Operations Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showBulkModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📦 Bulk Operations
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Selected {{ selectedItems.length }} international media items.
            Choose an operation:
          </p>

          <div class="space-y-3">
            <div class="flex flex-col gap-2">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >Change Status:</label
              >
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="handleBulkOperation('status', 'published')"
                  class="px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  Publish
                </button>
                <button
                  @click="handleBulkOperation('status', 'draft')"
                  class="px-3 py-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Draft
                </button>
                <button
                  @click="handleBulkOperation('status', 'review')"
                  class="px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                  Review
                </button>
                <button
                  @click="handleBulkOperation('status', 'archived')"
                  class="px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                  Archive
                </button>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="handleBulkOperation('delete')"
                class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                🗑️ Delete Selected
              </button>
            </div>
          </div>

          <div
            class="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="showBulkModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Media Preview Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showPreviewModal && selectedMedia"
        class="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {{ selectedMedia.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedMedia.type.toUpperCase() }} •
                  {{ formatFileSize(selectedMedia.fileSize) }} • Languages:
                  {{ selectedMedia.languages?.join(", ") }}
                </p>
              </div>
              <button
                type="button"
                @click="showPreviewModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <div class="p-6">
            <!-- Media Preview -->
            <div class="mb-6">
              <div v-if="selectedMedia.type === 'image'" class="text-center">
                <img
                  :src="selectedMedia.fileUrl"
                  :alt="selectedMedia.altText || selectedMedia.title"
                  class="max-w-full max-h-96 mx-auto rounded-lg shadow-lg" />
              </div>
              <div
                v-else-if="selectedMedia.type === 'video'"
                class="text-center">
                <video
                  controls
                  class="max-w-full max-h-96 mx-auto rounded-lg shadow-lg">
                  <source :src="selectedMedia.fileUrl" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div
                v-else-if="selectedMedia.type === 'audio'"
                class="text-center py-8">
                <div class="text-6xl mb-4">🎵</div>
                <audio controls class="mx-auto">
                  <source :src="selectedMedia.fileUrl" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div v-else class="text-center py-8">
                <div class="text-6xl mb-4">📄</div>
                <p class="text-gray-600 dark:text-gray-400">
                  Document preview not available
                </p>
                <button
                  @click="downloadMedia(selectedMedia)"
                  class="mt-4 px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                  📥 Download Document
                </button>
              </div>
            </div>

            <!-- Media Information -->
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                  Description
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ selectedMedia.description || "No description available" }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                    Details
                  </h4>
                  <div
                    class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      <strong>Category:</strong> {{ selectedMedia.category }}
                    </p>
                    <p><strong>Format:</strong> {{ selectedMedia.format }}</p>
                    <p v-if="selectedMedia.resolution">
                      <strong>Resolution:</strong>
                      {{ selectedMedia.resolution }}
                    </p>
                    <p v-if="selectedMedia.duration">
                      <strong>Duration:</strong> {{ selectedMedia.duration }}
                    </p>
                    <p>
                      <strong>Uploaded:</strong>
                      {{ formatDate(selectedMedia.uploadDate) }}
                    </p>
                    <p>
                      <strong>Uploaded by:</strong>
                      {{ selectedMedia.uploadedBy }}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                    Statistics & Status
                  </h4>
                  <div
                    class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      <strong>Views:</strong>
                      {{ selectedMedia.viewCount.toLocaleString() }}
                    </p>
                    <p>
                      <strong>Downloads:</strong>
                      {{ selectedMedia.downloadCount.toLocaleString() }}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      {{ getStatusInfo(selectedMedia.status).label }}
                    </p>
                    <p>
                      <strong>Visibility:</strong>
                      {{ selectedMedia.visibility }}
                    </p>
                    <p>
                      <strong>Featured:</strong>
                      {{ selectedMedia.isFeatured ? "Yes" : "No" }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Languages -->
              <div
                v-if="
                  selectedMedia.languages && selectedMedia.languages.length > 0
                ">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                  Available Languages
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="lang in selectedMedia.languages"
                    :key="lang"
                    class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm rounded-full"
                    :title="formatLanguageName(lang)">
                    {{ formatLanguageName(lang) }}
                  </span>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="selectedMedia.tags && selectedMedia.tags.length > 0">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                  Tags
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in selectedMedia.tags"
                    :key="tag"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- SEO Information -->
              <div
                v-if="
                  selectedMedia.seoTitle ||
                  selectedMedia.seoDescription ||
                  selectedMedia.altText
                ">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                  SEO & Accessibility
                </h4>
                <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p v-if="selectedMedia.seoTitle">
                    <strong>SEO Title:</strong> {{ selectedMedia.seoTitle }}
                  </p>
                  <p v-if="selectedMedia.seoDescription">
                    <strong>SEO Description:</strong>
                    {{ selectedMedia.seoDescription }}
                  </p>
                  <p v-if="selectedMedia.altText">
                    <strong>Alt Text:</strong> {{ selectedMedia.altText }}
                  </p>
                </div>
              </div>

              <!-- Copyright -->
              <div v-if="selectedMedia.copyrightInfo">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                  Copyright
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ selectedMedia.copyrightInfo }}
                </p>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
              <button
                type="button"
                @click="downloadMedia(selectedMedia)"
                class="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                📥 Download
              </button>
              <button
                type="button"
                @click="
                  duplicateMedia(selectedMedia);
                  showPreviewModal = false;
                "
                class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                📋 Duplicate
              </button>
              <button
                type="button"
                @click="
                  openEditModal(selectedMedia);
                  showPreviewModal = false;
                "
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity">
                ✏️ Edit Media
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

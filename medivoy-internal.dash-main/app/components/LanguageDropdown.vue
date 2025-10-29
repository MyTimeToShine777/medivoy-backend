<!-- components/LanguageDropdown.vue -->
<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-secondary transition-all">
      <img
        :src="currentLanguage.flag"
        :alt="currentLanguage.name"
        class="w-full h-full object-cover" />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div
        v-if="isOpen"
        v-click-outside="close"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
        <div class="py-2">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang)"
            :class="[
              'flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
              currentLanguage.code === lang.code
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300',
            ]">
            <img
              :src="lang.flag"
              :alt="lang.name"
              class="w-6 h-6 rounded object-cover ring-1 ring-gray-200 dark:ring-gray-700" />
            <span class="font-medium">
              {{ lang.name }}
            </span>
            <!-- Selected indicator -->
            <svg
              v-if="currentLanguage.code === lang.code"
              class="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const isOpen = ref(false);

// Language definitions with proper properties
const languages = [
  {
    code: "en",
    name: "English",
    flag: "https://flagcdn.com/w40/us.png",
    dir: "ltr",
  },
  {
    code: "hi",
    name: "हिंदी",
    flag: "https://flagcdn.com/w40/in.png",
    dir: "ltr",
  },
  {
    code: "es",
    name: "Español",
    flag: "https://flagcdn.com/w40/es.png",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "عربي",
    flag: "https://flagcdn.com/w40/sa.png",
    dir: "rtl",
  },
  {
    code: "fr",
    name: "Français",
    flag: "https://flagcdn.com/w40/fr.png",
    dir: "ltr",
  },
];

// Current language state - this will be synced with actual i18n
const currentLanguageCode = ref("en");

// Computed current language object
const currentLanguage = computed(
  () =>
    languages.find((lang) => lang.code === currentLanguageCode.value) ||
    languages[0]
);

// Close dropdown
const close = () => {
  isOpen.value = false;
};

// Language selection with real functionality
const selectLanguage = async (lang: any) => {
  try {
    // Update local state
    currentLanguageCode.value = lang.code;

    // Save to localStorage for persistence
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("selectedLanguage", lang.code);
    }

    // Update HTML direction for RTL support
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = lang.code;

      // Add/remove RTL class for additional styling
      if (lang.dir === "rtl") {
        document.documentElement.classList.add("rtl");
        document.documentElement.classList.remove("ltr");
      } else {
        document.documentElement.classList.add("ltr");
        document.documentElement.classList.remove("rtl");
      }
    }

    // Emit event for parent components to listen
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: { language: lang },
        })
      );
    }

    // Log for debugging
    console.log("Language changed to:", lang.name, "Direction:", lang.dir);

    // Show success message (you can replace with your toast system)
    if (typeof alert !== "undefined") {
      setTimeout(() => {
        alert(
          `Language changed to ${lang.name}! ${
            lang.dir === "rtl" ? "RTL mode activated." : ""
          }`
        );
      }, 100);
    }
  } catch (error) {
    console.error("Error changing language:", error);
  }

  close();
};

// Initialize from localStorage on mount
const initializeLanguage = () => {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("selectedLanguage");
    if (saved) {
      const foundLang = languages.find((lang) => lang.code === saved);
      if (foundLang) {
        selectLanguage(foundLang);
      }
    }
  }
};

// Watch for external language changes (if you integrate with i18n later)
watch(currentLanguageCode, (newCode) => {
  const lang = languages.find((l) => l.code === newCode);
  if (lang && typeof document !== "undefined") {
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
  }
});

// Initialize on component mount
onMounted(() => {
  initializeLanguage();
});

// Click outside directive with proper typing
const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    const clickHandler = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };

    // Store handler on element for cleanup
    (el as any).clickOutsideEvent = clickHandler;
    document.addEventListener("click", clickHandler);
  },
  unmounted(el: HTMLElement) {
    const handler = (el as any).clickOutsideEvent;
    if (handler) {
      document.removeEventListener("click", handler);
    }
  },
};

// Expose for parent component access if needed
defineExpose({
  currentLanguage,
  selectLanguage,
  languages,
});
</script>

<style scoped>
/* Enhanced styling for better UX */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom ring colors - adjust these based on your theme */
.ring-primary {
  --tw-ring-color: #4565ad;
}

.ring-secondary {
  --tw-ring-color: #4bbecf;
}

/* Hover effects */
button:hover img {
  transform: scale(1.05);
}

/* RTL support for dropdown positioning */
[dir="rtl"] .absolute.right-0 {
  right: auto;
  left: 0;
}

/* Better shadow for dropdown */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>

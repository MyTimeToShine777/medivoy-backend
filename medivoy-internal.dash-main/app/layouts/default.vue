<script setup lang="ts">
// Sidebar state management
const sidebarOpen = ref(true);
const sidebarCollapsed = ref(false);

// Toggle functions
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const toggleCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

// Computed offset based on sidebar state
const contentOffset = computed(() => {
  if (sidebarCollapsed.value) {
    return "lg:ms-20"; // Collapsed sidebar width
  }
  return "lg:ms-64"; // Expanded sidebar width
});

// Auto-close sidebar on mobile when navigating
const route = useRoute();
watch(
  () => route.path,
  () => {
    if (process.client && window.innerWidth < 1024) {
      closeSidebar();
    }
  }
);

// Handle window resize
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = true;
    }
  };

  window.addEventListener("resize", handleResize);

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});
</script>

<template>
  <div
    class="min-h-dvh flex bg-slate-50 text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
    <!-- Sidebar with dynamic width -->
    <Sidebar
      :open="sidebarOpen"
      :collapsed="sidebarCollapsed"
      @close="closeSidebar" />

    <!-- Main content area with dynamic offset -->
    <div
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        contentOffset,
      ]">
      <!-- Header with both toggle handlers -->
      <Header
        :is-collapsed="sidebarCollapsed"
        @toggle-menu="toggleSidebar"
        @toggle-collapse="toggleCollapse" />

      <!-- Main content with proper spacing -->
      <main class="flex-1 p-4 sm:p-6 mx-auto w-full max-w-screen-2xl">
        <slot />
      </main>
    </div>

    <!-- Mobile overlay when sidebar is open -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="closeSidebar"
        aria-hidden="true" />
    </Transition>
  </div>
</template>

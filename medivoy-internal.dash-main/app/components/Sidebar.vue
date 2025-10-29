<template>
  <aside :class="sidebarClasses">
    <!-- Brand / Logo -->
    <div
      class="flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 h-[73px]">
      <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
        mode="out-in">
        <NuxtLink
          v-if="!collapsed"
          key="expanded"
          to="/"
          class="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition">
          <div class="text-xl font-bold text-gray-800 dark:text-white">
            Medivoy
          </div>
        </NuxtLink>

        <NuxtLink
          v-else
          key="collapsed"
          to="/"
          class="w-full flex justify-center px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition">
          <div class="text-xl font-bold text-gray-800 dark:text-white">M</div>
        </NuxtLink>
      </Transition>

      <button
        @click="$emit('close')"
        class="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-4">
      <!-- Admin Panel -->
      <div class="mb-6">
        <div v-if="!collapsed" class="px-3 pt-2 pb-3">
          <p
            class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Admin Panel
          </p>
        </div>
        <div v-else class="h-px bg-gray-200 dark:bg-gray-700 mb-3"></div>

        <div class="space-y-1">
          <NuxtLink
            v-for="item in adminItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            :class="getLinkClasses(item.path)"
            :title="collapsed ? item.name : undefined">
            <div
              :class="[
                'flex items-center gap-3',
                collapsed ? 'justify-center' : '',
              ]">
              <span class="text-lg">{{ item.icon }}</span>
              <span v-if="!collapsed" class="font-medium">{{ item.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Website -->
      <div class="mb-6">
        <div v-if="!collapsed" class="px-3 pt-2 pb-3">
          <p
            class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Website
          </p>
        </div>
        <div v-else class="h-px bg-gray-200 dark:bg-gray-700 mb-3"></div>

        <div class="space-y-1">
          <NuxtLink
            v-for="item in websiteItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            :class="getLinkClasses(item.path)"
            :title="collapsed ? item.name : undefined">
            <div
              :class="[
                'flex items-center gap-3',
                collapsed ? 'justify-center' : '',
              ]">
              <span class="text-lg">{{ item.icon }}</span>
              <span v-if="!collapsed" class="font-medium">{{ item.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Admin Tools -->
      <div>
        <div v-if="!collapsed" class="px-3 pt-2 pb-3">
          <p
            class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Admin Tools
          </p>
        </div>
        <div v-else class="h-px bg-gray-200 dark:bg-gray-700 mb-3"></div>

        <div class="space-y-1">
          <NuxtLink
            v-for="item in toolsItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            :class="getLinkClasses(item.path)"
            :title="collapsed ? item.name : undefined">
            <div
              :class="[
                'flex items-center gap-3',
                collapsed ? 'justify-center' : '',
              ]">
              <span class="text-lg">{{ item.icon }}</span>
              <span v-if="!collapsed" class="font-medium">{{ item.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  open?: boolean;
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: true,
  collapsed: false,
});

defineEmits<{ close: [] }>();

const route = useRoute();

const adminItems = [
  { name: "Dashboard", path: "/", icon: "📊" },
  { name: "Patients", path: "/patient/list", icon: "👥" },
  { name: "Hospitals", path: "/hospital/list", icon: "🏥" },
  // { name: "Doctors", path: "/doctor/list", icon: "👨‍⚕️" },
  { name: "Appointments", path: "/appointment", icon: "📅" },
  { name: "Labs", path: "/laboratory/list", icon: "🧪" },
  //{ name: "Get Insured", path: "/insurance", icon: "🛡️" },
  { name: "Support", path: "/support", icon: "💬" },
  { name: "Records", path: "/records", icon: "🩺" },
  //{ name: "Settings", path: "/settings", icon: "⚙️" },
];

const websiteItems = [
  { name: "Coupons", path: "/website/coupons", icon: "🎫" },
  { name: "Treatments", path: "/website/treatments", icon: "💊" },
  { name: "Packages", path: "/website/packages", icon: "📦" },
  { name: "Terms", path: "/website/terms", icon: "📋" },
  { name: "Privacy", path: "/website/privacy", icon: "🔒" },
  { name: "FAQs", path: "/website/faqs", icon: "❓" },
  { name: "Media", path: "/website/media", icon: "🖼️" },
  { name: "Payments", path: "/website/payments", icon: "💳" },
];

const toolsItems = [
  //{ name: "Staff", path: "/admin/staff", icon: "👤" },
  { name: "Audit", path: "/admin/audit", icon: "📝" },
  //{ name: "API", path: "/admin/api", icon: "🔧" },
  //{ name: "Integrations", path: "/admin/integrations", icon: "🔌" },
  { name: "Localization", path: "/admin/localization", icon: "🌐" },
  { name: "Notifications", path: "/admin/notifications", icon: "🔔" },
  //{ name: "System", path: "/admin/system", icon: "⚡" },
  //{ name: "Data", path: "/admin/data", icon: "📊" },
  { name: "Login", path: "/auth/login", icon: "🔑" },
  { name: "Logout", path: "/auth/logout", icon: "🚪" },
  { name: "Profile", path: "/profile", icon: "👤" },
  { name: "ProfileEdit", path: "/profile/edit", icon: "✏️" },
];

const collapsed = computed(() => props.collapsed);

const sidebarClasses = computed(() => [
  "fixed top-0 left-0 z-30 h-screen flex flex-col bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700",
  "transition-all duration-300",
  props.collapsed ? "w-20" : "w-64",
  props.open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
]);

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + "/");
};

const getLinkClasses = (path: string) => [
  "flex items-center px-3 py-2 rounded-xl transition-colors cursor-pointer",
  isActive(path)
    ? "bg-[#706F6F] dark:bg-gray-800 text-white"
    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
];
</script>

<style scoped>
nav::-webkit-scrollbar {
  width: 6px;
}
nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark nav::-webkit-scrollbar-thumb {
  background: #4b5563;
}
.dark nav::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>

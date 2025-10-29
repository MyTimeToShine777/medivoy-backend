<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-xl smooth-transition border border-gray-100 dark:border-gray-800 card-hover">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-4xl font-bold mb-2" :style="{ color }">{{ value }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {{ label }}
        </p>
      </div>
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
        :style="{ background: gradient }">
        <component :is="icon" class="w-7 h-7 text-white" stroke-width="2.5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string;
  label: string;
  icon: any;
  color: string;
  gradient: string;
}>();
</script>

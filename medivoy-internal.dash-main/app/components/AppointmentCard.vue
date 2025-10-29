<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-primary/30 dark:hover:border-secondary/30 smooth-transition cursor-pointer group">
    <div class="flex items-center gap-3 md:gap-4">
      <div class="relative">
        <img
          :src="doctor.image"
          :alt="doctor.name"
          class="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-primary/50 smooth-transition" />
        <div
          class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900"></div>
      </div>

      <div class="flex-1 min-w-0">
        <h4
          class="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate group-hover:text-primary smooth-transition">
          {{ doctor.name }}
        </h4>
        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
          {{ doctor.specialty }}
        </p>
      </div>

      <div class="text-right shrink-0">
        <p
          class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
          {{ time }}
        </p>
        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {{ date }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  doctor: {
    name: string;
    specialty: string;
    image: string;
  };
  time: string;
  date: string;
}>();
</script>

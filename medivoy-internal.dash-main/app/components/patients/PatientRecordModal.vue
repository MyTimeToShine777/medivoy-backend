<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div
        class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Add Medical Record
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
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
      </div>

      <div class="p-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Adding record for: <strong>{{ patient.name }}</strong>
        </p>

        <form @submit.prevent="submit" class="space-y-4">
          <div
            class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
            <input
              v-model="form.diagnosis"
              type="text"
              placeholder="Diagnosis"
              class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
          </div>

          <div
            class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
            <input
              v-model="form.treatment"
              type="text"
              placeholder="Treatment"
              class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400" />
          </div>

          <div
            class="flex items-center gap-2 px-3 h-12 rounded-lg border border-gray-200 dark:border-gray-800">
            <input
              v-model="form.date"
              type="date"
              class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100" />
          </div>

          <div
            class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800">
            <textarea
              v-model="form.notes"
              rows="4"
              placeholder="Additional notes..."
              class="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95">
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  patient: any;
}>();

defineEmits<{
  close: [];
  submit: [data: any];
}>();

const form = reactive({
  diagnosis: "",
  treatment: "",
  date: "",
  notes: "",
});

function submit() {
  if (!form.diagnosis || !form.treatment) {
    alert("Diagnosis and Treatment are required.");
    return;
  }
  $emit("submit", { ...form });
}
</script>

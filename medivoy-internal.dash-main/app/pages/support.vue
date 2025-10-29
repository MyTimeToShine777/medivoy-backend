<!-- pages/support.vue -->
<script setup lang="ts">
const { ref, computed, onMounted } = await import("vue");

// State
const stats = ref({
  openTickets: 12,
  inProgress: 8,
  resolved: 145,
  avgResponse: "2.5h",
});
const tickets = ref([]);
const searchQuery = ref("");
const filterStatus = ref("all");
const filterPriority = ref("all");
const showNewTicketModal = ref(false);
const showFAQModal = ref(false);
const isSubmitting = ref(false);

const newTicket = ref({
  subject: "",
  category: "",
  priority: "",
  description: "",
  attachments: [],
});

const systemUpdates = ref([
  {
    id: 1,
    title: "System maintenance scheduled for Oct 15",
    date: "2 days ago",
    type: "maintenance",
  },
  {
    id: 2,
    title: "New feature: Bulk patient import released",
    date: "5 days ago",
    type: "feature",
  },
  {
    id: 3,
    title: "Security patch applied successfully",
    date: "1 week ago",
    type: "security",
  },
]);

const faqs = ref([
  {
    question: "How do I reset my password?",
    answer:
      'Go to login and click "Forgot Password", then follow the email instructions.',
    isOpen: false,
  },
  {
    question: "How can I add a new user to the system?",
    answer:
      "Navigate to Settings → User Management → Add New User and assign appropriate roles.",
    isOpen: false,
  },
  {
    question: "What should I do if I encounter a technical error?",
    answer:
      'Take a screenshot, note the steps, and submit a "Technical Issue" ticket for fastest response.',
    isOpen: false,
  },
  {
    question: "How do I export patient reports?",
    answer:
      "Go to Reports section, select date range and type, then click Export (PDF/Excel/CSV).",
    isOpen: false,
  },
  {
    question: "Can I customize the dashboard layout?",
    answer:
      "Yes, go to Settings → Dashboard Preferences to drag/drop widgets and save layouts.",
    isOpen: false,
  },
]);

// Demo ticket data
onMounted(() => {
  tickets.value = [
    {
      id: 1001,
      title: "Cannot access patient records",
      description: "Getting 403 error when viewing patient history",
      status: "open",
      priority: "high",
      assignedTo: "IT Support",
      createdAt: "2025-10-13T08:30:00Z",
      replies: 2,
    },
    {
      id: 1002,
      title: "New staff member access request",
      description: "Please create account for Dr. Sarah Wilson",
      status: "in_progress",
      priority: "medium",
      assignedTo: "Admin Team",
      createdAt: "2025-10-12T14:20:00Z",
      replies: 5,
    },
    {
      id: 1003,
      title: "Feature request: Dark mode toggle",
      description: "Would be helpful for night shift staff",
      status: "open",
      priority: "low",
      assignedTo: "Development",
      createdAt: "2025-10-11T10:15:00Z",
      replies: 1,
    },
    {
      id: 1004,
      title: "Dashboard loading very slowly",
      description: "Performance issues during peak hours 9-11 AM",
      status: "in_progress",
      priority: "urgent",
      assignedTo: "IT Support",
      createdAt: "2025-10-13T09:00:00Z",
      replies: 8,
    },
    {
      id: 1005,
      title: "Print receipts not working",
      description: "Appointment receipts won't print from appointments module",
      status: "resolved",
      priority: "medium",
      assignedTo: "IT Support",
      createdAt: "2025-10-10T16:45:00Z",
      replies: 3,
    },
  ];
});

// Computed
const filteredTickets = computed(() => {
  let list = tickets.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toString().includes(q)
    );
  }
  if (filterStatus.value !== "all")
    list = list.filter((t) => t.status === filterStatus.value);
  if (filterPriority.value !== "all")
    list = list.filter((t) => t.priority === filterPriority.value);
  return list;
});

// Methods
const submitTicket = async () => {
  isSubmitting.value = true;
  // API call would go here
  await new Promise((resolve) => setTimeout(resolve, 1000));
  showNewTicketModal.value = false;
  newTicket.value = {
    subject: "",
    category: "",
    priority: "",
    description: "",
    attachments: [],
  };
  isSubmitting.value = false;
};

const handleFileUpload = (e) => {
  newTicket.value.attachments = Array.from(e.target.files || []);
};

const toggleFAQ = (i) => {
  faqs.value[i].isOpen = !faqs.value[i].isOpen;
};

const openTicketDetail = (ticket) => {
  // Navigate to ticket detail or open modal
  console.log("Open ticket:", ticket.id);
};

const formatDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getPriorityClass = (priority) => {
  const classes = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return classes[priority] || classes.low;
};

const getStatusClass = (status) => {
  const classes = {
    open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    in_progress:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    resolved:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  };
  return classes[status] || classes.open;
};
</script>

<template>
  <div class="p-5 md:p-7 lg:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Support Center
        </h1>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
          Help desk, tickets, and system announcements
        </p>
      </div>
      <button
        @click="showNewTicketModal = true"
        class="px-4 py-2 rounded-lg text-sm text-white bg-[#4565AD] hover:opacity-95 transition-opacity">
        ✉️ New Ticket
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
                Open Tickets
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ stats.openTickets }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400">📋</span>
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
                In Progress
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ stats.inProgress }}
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
                Resolved
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ stats.resolved }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span class="text-green-600 dark:text-green-400">✅</span>
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
                Avg Response
              </p>
              <p
                class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ stats.avgResponse }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span class="text-purple-600 dark:text-purple-400">⚡</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Tickets List -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 col-span-12 lg:col-span-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2
            class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Support Tickets
          </h2>
        </div>

        <!-- Filters -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tickets..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD] focus:border-transparent" />
              <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            <select
              v-model="filterStatus"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              v-model="filterPriority"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#4565AD]">
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <!-- Tickets Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr
                class="bg-gray-100/40 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                <th class="text-left px-4 py-3 font-semibold">ID</th>
                <th class="text-left px-4 py-3 font-semibold">Subject</th>
                <th class="text-left px-4 py-3 font-semibold">Priority</th>
                <th class="text-left px-4 py-3 font-semibold">Status</th>
                <th class="text-left px-4 py-3 font-semibold">Assigned To</th>
                <th class="text-left px-4 py-3 font-semibold">Created</th>
                <th class="text-left px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="ticket in filteredTickets"
                :key="ticket.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                <td class="px-4 py-3">
                  <span
                    class="text-[13px] font-medium text-gray-500 dark:text-gray-400"
                    >#{{ ticket.id }}</span
                  >
                </td>
                <td class="px-4 py-3">
                  <div class="max-w-xs">
                    <p
                      class="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {{ ticket.title }}
                    </p>
                    <p
                      class="text-[12px] text-gray-500 dark:text-gray-400 truncate">
                      {{ ticket.description }}
                    </p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="getPriorityClass(ticket.priority)"
                    class="px-2 py-1 text-[11px] font-semibold rounded-full uppercase">
                    {{ ticket.priority }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="getStatusClass(ticket.status)"
                    class="px-2 py-1 text-[11px] font-semibold rounded-full uppercase">
                    {{ ticket.status.replace("_", " ") }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ ticket.assignedTo }}
                </td>
                <td
                  class="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-400">
                  {{ formatDate(ticket.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="openTicketDetail(ticket)"
                    class="icon-btn"
                    title="View Details">
                    👁️
                  </button>
                </td>
              </tr>

              <tr v-if="filteredTickets.length === 0">
                <td
                  colspan="7"
                  class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No tickets found matching your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions Sidebar -->
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <!-- Quick Actions -->
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2
              class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div class="px-6 py-4 grid grid-cols-1 gap-3">
            <button
              @click="showNewTicketModal = true"
              class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm font-medium">
              ✉️ Submit Ticket
            </button>
            <button
              @click="showFAQModal = true"
              class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm font-medium">
              ❓ View FAQs
            </button>
            <button
              class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm font-medium">
              📞 Call Support
            </button>
            <button
              class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity text-sm font-medium">
              📖 Documentation
            </button>
          </div>
        </div>

        <!-- Contact Info -->
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2
              class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              Contact Support
            </h2>
          </div>
          <div class="px-6 py-4 space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <span>📞</span>
              <span class="text-gray-700 dark:text-gray-300"
                >+91 1800-123-4567</span
              >
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span>✉️</span>
              <span class="text-gray-700 dark:text-gray-300"
                >support@hospital.com</span
              >
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span>🕘</span>
              <span class="text-gray-700 dark:text-gray-300"
                >24/7 Available</span
              >
            </div>
            <div
              class="border-t border-gray-200 dark:border-gray-800 mt-4 pt-3">
              <p class="text-[12px] text-gray-500 dark:text-gray-400">
                Average response time: {{ stats.avgResponse }}
              </p>
            </div>
          </div>
        </div>

        <!-- System Updates -->
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2
              class="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              System Updates
            </h2>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div
              v-for="update in systemUpdates"
              :key="update.id"
              class="flex items-start gap-3">
              <span class="text-base">
                {{
                  update.type === "maintenance"
                    ? "🔧"
                    : update.type === "feature"
                    ? "✨"
                    : "🔒"
                }}
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ update.title }}
                </p>
                <p class="text-[12px] text-gray-500 dark:text-gray-400">
                  {{ update.date }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Ticket Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showNewTicketModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Submit New Support Ticket
              </h3>
              <button
                @click="showNewTicketModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <form @submit.prevent="submitTicket" class="p-6 space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Subject *</label
              >
              <input
                v-model="newTicket.subject"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD] focus:border-transparent"
                placeholder="Brief description of your issue" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Category *</label
                >
                <select
                  v-model="newTicket.category"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="access">Access & Permissions</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="training">Training & Documentation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Priority *</label
                >
                <select
                  v-model="newTicket.priority"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]">
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Description *</label
              >
              <textarea
                v-model="newTicket.description"
                required
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4565AD]"
                placeholder="Please provide detailed information about your issue..."></textarea>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Attachments</label
              >
              <input
                type="file"
                @change="handleFileUpload"
                multiple
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                Max 10MB each (PDF, PNG, JPG, DOC)
              </p>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showNewTicketModal = false"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-[#4565AD] text-white rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50">
                {{ isSubmitting ? "Submitting..." : "Submit Ticket" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- FAQ Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="showFAQModal"
        class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h3>
              <button
                @click="showFAQModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <div
              v-for="(faq, i) in faqs"
              :key="i"
              class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <button
                @click="toggleFAQ(i)"
                class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors text-left">
                <span class="font-medium text-gray-900 dark:text-white">{{
                  faq.question
                }}</span>
                <span
                  :class="{ 'rotate-180': faq.isOpen }"
                  class="transition-transform text-gray-400">
                  ▼
                </span>
              </button>
              <div
                v-if="faq.isOpen"
                class="px-6 py-4 bg-white dark:bg-gray-800">
                <p class="text-gray-700 dark:text-gray-300">{{ faq.answer }}</p>
              </div>
            </div>
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px #3b82f610;
}
</style>

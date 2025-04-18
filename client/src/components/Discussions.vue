<!-- QuestionDashboard.vue -->
<template>
  <div
    v-if="disc"
    class="bg-black/90 min-h-full fixed flex z-20 inset-0 justify-center align-middle p-5"
    @click="showDisc"
  >
    <Discussion :qid="currentQid" @click.stop="" />
  </div>
  <div
    class="dashboard-container backdrop-blur-md bg-black bg-opacity-50 border border-gray-700 rounded-lg"
  >
    <!-- Header Section -->
    <header class="p-4 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-fuchsia-400">Discussions</h1>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search questions..."
              class="bg-gray-800 bg-opacity-70 px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button class="absolute right-2 top-2 text-gray-400">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-400">Filter:</span>
            <select
              v-model="filterStatus"
              class="bg-gray-800 bg-opacity-70 px-2 py-1 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="dashboard-content p-4">
      <!-- Stats Row -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div
          class="stat-card bg-gray-800 bg-opacity-70 p-4 rounded-lg border border-gray-700"
        >
          <div class="text-sm text-gray-400 mb-1">Total Discussions</div>
          <div class="text-2xl font-bold text-white">
            {{ questions.length }}
          </div>
        </div>
        <div
          class="stat-card bg-gray-800 bg-opacity-70 p-4 rounded-lg border border-gray-700"
        >
          <div class="text-sm text-gray-400 mb-1">Solved</div>
          <div class="text-2xl font-bold text-green-400">{{ solvedCount }}</div>
        </div>
        <div
          class="stat-card bg-gray-800 bg-opacity-70 p-4 rounded-lg border border-gray-700"
        >
          <div class="text-sm text-gray-400 mb-1">Unsolved</div>
          <div class="text-2xl font-bold text-yellow-400">
            {{ questions.length - solvedCount }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="loader w-10 h-10 border-4 border-gray-600 border-t-fuchsia-500 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-900 bg-opacity-50 p-4 rounded-lg text-center"
      >
        <p class="text-red-200">{{ error }}</p>
        <button
          @click="fetchQuestions"
          class="mt-2 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-md text-white text-sm"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredQuestions.length === 0" class="py-12 text-center">
        <div class="text-gray-400 text-lg">No questions found</div>
        <p class="text-gray-500 mt-2">
          Try changing your filters or check back later
        </p>
      </div>

      <!-- Questions Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="question in filteredQuestions"
          :key="question.questionId"
          @click="setQid(question.questionId)"
          class="question-card bg-gray-800 bg-opacity-70 p-4 rounded-lg border border-gray-700 hover:border-fuchsia-500 transition-all"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <div
                class="user-avatar w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm text-white"
              >
                {{ question.username.charAt(0).toUpperCase() }}
              </div>
              <span class="ml-2 text-sm text-gray-400"
                >@{{ question.username }}</span
              >
            </div>
            <span
              :class="[
                'text-xs px-2 py-1 rounded-full',
                question.solved ? 'bg-green-600' : 'bg-yellow-600',
              ]"
            >
              {{ question.solved ? "Solved" : "Open" }}
            </span>
          </div>

          <div class="mt-3">
            <p class="text-white">{{ question.queBody }}</p>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <span class="text-xs text-gray-500">
              Last viewed: {{ formatDate(question.lastViewed) }}
            </span>
            <button
              class="px-3 py-1 bg-fuchsia-700 hover:bg-fuchsia-600 rounded-md text-white text-xs"
              @click="viewQuestionDetails(question.questionId)"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <button
          @click="currentPage > 1 && currentPage--"
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            currentPage === 1
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-white',
          ]"
        >
          Previous
        </button>

        <div v-for="page in totalPages" :key="page" class="pagination-item">
          <button
            @click="currentPage = page"
            :class="[
              'w-8 h-8 rounded-md text-sm',
              currentPage === page
                ? 'bg-fuchsia-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage < totalPages && currentPage++"
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            currentPage === totalPages
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-white',
          ]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Discussion from "./Discussion.vue";

// State
const questions = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const filterStatus = ref("all");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const disc = ref("");
const currentQid = ref("");
const showDisc = () => {
  disc.value = !disc.value;
  currentQid.value = "";
};
const setQid = (qid) => {
  disc.value = !disc.value;
  currentQid.value = qid;

  //console.log("skdnjosndonf");
};
// Computed properties
const solvedCount = computed(() => {
  return questions.value.filter((q) => q.solved).length;
});

const filteredQuestions = computed(() => {
  let result = [...questions.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (q) =>
        q.queBody.toLowerCase().includes(query) ||
        q.username.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filterStatus.value === "solved") {
    result = result.filter((q) => q.solved);
  } else if (filterStatus.value === "unsolved") {
    result = result.filter((q) => !q.solved);
  }

  // Apply pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;

  return result.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  let filtered = [...questions.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (q) =>
        q.queBody.toLowerCase().includes(query) ||
        q.username.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value === "solved") {
    filtered = filtered.filter((q) => q.solved);
  } else if (filterStatus.value === "unsolved") {
    filtered = filtered.filter((q) => !q.solved);
  }

  return Math.ceil(filtered.length / itemsPerPage.value) || 1;
});

// Methods
const fetchQuestions = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("/api/dissNotifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    questions.value = data.notifications;
    currentPage.value = 1; // Reset to first page on successful fetch
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    error.value = "Failed to load questions. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 30) return `${diffDays} days ago`;

  return date.toLocaleDateString();
};

const viewQuestionDetails = (questionId) => {
  // This would typically navigate to a question detail page
  // For now, just logging to console
  console.log(`Viewing details for question: ${questionId}`);
  // Example: router.push(`/questions/${questionId}`);
};

// Lifecycle hooks
onMounted(() => {
  fetchQuestions();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  background: rgba(27, 27, 27, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.question-card {
  transition: all 0.2s ease;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(233, 30, 99, 0.2);
}

.dashboard-content {
  max-height: 80vh;
  overflow-y: auto;
}

/* Custom scrollbar */
.dashboard-content::-webkit-scrollbar {
  width: 6px;
}

.dashboard-content::-webkit-scrollbar-track {
  background: rgba(31, 31, 31, 0.5);
}

.dashboard-content::-webkit-scrollbar-thumb {
  background: rgba(233, 30, 99, 0.5);
  border-radius: 3px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

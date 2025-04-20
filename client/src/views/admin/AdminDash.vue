<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../../fireInit";
import { collection, getDocs } from "firebase/firestore";
import { Line, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  ArcElement
);

// State variables
const userCount = ref(0);
const totalQuestions = ref(0);
const solvedQuestions = ref(0);
const questionsByTag = ref([]);
const questionsTrend = ref([]);
const loading = ref(true);
const error = ref(null);

// Chart data
const trendChartData = ref({
  labels: [],
  datasets: [
    {
      label: "New Questions",
      backgroundColor: "#d946ef22",
      borderColor: "#d946ef",
      borderWidth: 2,
      tension: 0.2,
      fill: true,
      data: [],
    },
    {
      label: "Solved Questions",
      backgroundColor: "#10b98122",
      borderColor: "#10b981",
      borderWidth: 2,
      tension: 0.2,
      fill: true,
      data: [],
    },
  ],
});

const tagChartData = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: ["#d946ef", "#8b5cf6", "#ec4899", "#3b82f6", "#f97316"],
      data: [],
    },
  ],
});

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#e5e7eb",
      },
    },
    tooltip: {
      mode: "index",
      backgroundColor: "#1f2937",
      titleColor: "#f9fafb",
      bodyColor: "#f9fafb",
      borderColor: "#374151",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: "#333333",
      },
      ticks: {
        color: "#9ca3af",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#333333",
      },
      ticks: {
        color: "#9ca3af",
      },
    },
  },
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "#e5e7eb",
      },
    },
    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#f9fafb",
      bodyColor: "#f9fafb",
      borderColor: "#374151",
      borderWidth: 1,
    },
  },
};

// Computed properties
const solvedPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0;
  return Math.round((solvedQuestions.value / totalQuestions.value) * 100);
});

// Fetch data
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch user count
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const Count = userSnapshot.size;
    userCount.value = Count;

    // Fetch question analytics
    const questionResponse = await fetch("/api/analytics/questions");
    if (!questionResponse.ok) throw new Error("Failed to fetch question data");
    const questionData = await questionResponse.json();

    totalQuestions.value = questionData.totalCount;
    solvedQuestions.value = questionData.solvedCount;
    questionsByTag.value = questionData.byTag;

    // Process trend data for chart
    const trend = questionData.trend;
    trendChartData.value.labels = trend.map((item) => item.date);
    trendChartData.value.datasets[0].data = trend.map((item) => item.new);
    trendChartData.value.datasets[1].data = trend.map((item) => item.solved);

    // Process tag data for pie chart
    const topTags = questionData.byTag.slice(0, 5);
    tagChartData.value.labels = topTags.map((item) => item.tag);
    tagChartData.value.datasets[0].data = topTags.map((item) => item.count);

    loading.value = false;
  } catch (err) {
    console.error("Error fetching analytics:", err);
    error.value = err.message;
    loading.value = false;
  }
};

// Initialize dashboard
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="min-h-screen bg-black text-gray-200 p-6">
    <div
      class="backdrop-blur-md backdrop-saturate-150 bg-black/50 rounded-xl p-6 shadow-xl border border-gray-800"
    >
      <h1 class="text-3xl font-bold mb-6 text-fuchsia-400">
        Analytics Dashboard
      </h1>

      <!-- Loading and Error States -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"
        ></div>
      </div>

      <div
        v-else-if="error"
        class="bg-rose-900/30 text-rose-200 p-4 rounded-lg"
      >
        {{ error }}
      </div>

      <div v-else>
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- User Count -->
          <div
            class="backdrop-blur-md backdrop-saturate-150 bg-gray-900/60 rounded-lg p-6 border border-gray-700 hover:border-fuchsia-700 transition-all"
          >
            <h3 class="text-gray-400 mb-1 text-sm font-medium">Total Users</h3>
            <p class="text-4xl font-bold text-white">{{ userCount }}</p>
          </div>

          <!-- Question Count -->
          <div
            class="backdrop-blur-md backdrop-saturate-150 bg-gray-900/60 rounded-lg p-6 border border-gray-700 hover:border-fuchsia-700 transition-all"
          >
            <h3 class="text-gray-400 mb-1 text-sm font-medium">
              Total Questions
            </h3>
            <p class="text-4xl font-bold text-white">{{ totalQuestions }}</p>
          </div>

          <!-- Solved Questions -->
          <div
            class="backdrop-blur-md backdrop-saturate-150 bg-gray-900/60 rounded-lg p-6 border border-gray-700 hover:border-fuchsia-700 transition-all"
          >
            <h3 class="text-gray-400 mb-1 text-sm font-medium">
              Solved Questions
            </h3>
            <div class="flex items-end justify-between">
              <p class="text-4xl font-bold text-white">{{ solvedQuestions }}</p>
              <p class="text-lg font-medium text-fuchsia-400">
                {{ solvedPercentage }}%
              </p>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                class="bg-fuchsia-500 h-2 rounded-full"
                :style="`width: ${solvedPercentage}%`"
              ></div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <!-- Questions Trend -->
          <div
            class="backdrop-blur-md backdrop-saturate-150 bg-gray-900/60 rounded-lg p-6 border border-gray-700"
          >
            <h3 class="text-xl font-medium mb-4 text-white">
              Question Activity Trend
            </h3>
            <div class="h-64 w-full">
              <Line
                v-if="trendChartData.labels.length > 0"
                :data="trendChartData"
                :options="lineChartOptions"
              />
            </div>
          </div>

          <!-- Questions by Tag -->
          <div
            class="backdrop-blur-md backdrop-saturate-150 bg-gray-900/60 rounded-lg p-6 border border-gray-700"
          >
            <h3 class="text-xl font-medium mb-4 text-white">
              Top Question Tags
            </h3>
            <div class="h-64">
              <Pie
                v-if="tagChartData.labels.length > 0"
                :data="tagChartData"
                :options="pieChartOptions"
              />
            </div>
          </div>
        </div>

        <!-- Tag Distribution Table -->
        <div
          class="backdrop-blur-md backdrop-saturate-150 bg-gray-900/60 rounded-lg p-6 border border-gray-700"
        >
          <h3 class="text-xl font-medium mb-4 text-white">Tag Distribution</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Tag
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Count
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr
                  v-for="(tag, idx) in questionsByTag"
                  :key="idx"
                  class="hover:bg-gray-800/50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :style="`background-color: ${
                        ['#d946ef', '#8b5cf6', '#ec4899', '#3b82f6', '#f97316'][
                          idx % 5
                        ]
                      }33; color: ${
                        ['#d946ef', '#8b5cf6', '#ec4899', '#3b82f6', '#f97316'][
                          idx % 5
                        ]
                      }`"
                    >
                      {{ tag.tag }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ tag.count }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ ((tag.count / totalQuestions) * 100).toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

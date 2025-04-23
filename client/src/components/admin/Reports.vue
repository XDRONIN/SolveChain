<template>
  <div
    class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 text-white"
  >
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-fuchsia-500 mb-6">User Reports</h1>

      <div v-if="loading" class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-fuchsia-500"
        ></div>
        <p class="mt-2 text-gray-400">Loading reports...</p>
      </div>

      <div
        v-else-if="error"
        class="bg-red-900/50 p-4 rounded-lg border border-red-500/50 mb-6"
      >
        <p class="text-red-300">{{ error }}</p>
      </div>

      <div
        v-else
        v-for="report in processedReports"
        :key="report._id"
        class="mb-4 p-4 rounded-2xl backdrop-blur-[12px] backdrop-saturate-162 bg-black/50 shadow-lg border border-fuchsia-500/20"
      >
        <div class="text-lg">
          <span class="text-fuchsia-400 font-semibold">{{
            report.senderName
          }}</span>
          <span class="text-gray-300"> reported </span>
          <span class="text-fuchsia-400 font-semibold">{{
            report.userName
          }}</span>
        </div>
        <div class="text-sm text-gray-400 mt-2">
          Reason: {{ report.reason }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ formatTime(report.createdAt) }} |
          {{ formatDate(report.createdAt) }}
        </div>

        <div class="mt-3 flex gap-3">
          <button
            @click="viewUserProfile(report.user)"
            class="px-3 py-1 text-sm bg-fuchsia-700 hover:bg-fuchsia-600 rounded-md transition"
          >
            View User
          </button>

          <button
            v-if="report.dId"
            @click="viewDiscussion(report.dId)"
            class="px-3 py-1 text-sm bg-indigo-700 hover:bg-indigo-600 rounded-md transition"
          >
            View Discussion
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Popup for ViewProfile -->
  <div
    v-if="showUserProfile"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
    @click.self="showUserProfile = false"
  >
    <div
      class="bg-gray-800 rounded-xl border border-fuchsia-500/30 w-full max-w-lg p-6 relative"
    >
      <button
        @click="showUserProfile = false"
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <ViewProfile :userId="selectedUserId" @close="showUserProfile = false" />
    </div>
  </div>

  <!-- Popup for Discussion -->
  <div
    v-if="showDiscussion"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
    @click.self="showDiscussion = false"
  >
    <div
      class="bg-gray-800 rounded-xl border border-fuchsia-500/30 w-full max-w-2xl p-6 relative"
    >
      <button
        @click="showDiscussion = false"
        class="absolute top-8 -right-75 text-gray-400 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <Discussion :qid="selectedDiscussionId" @close="showDiscussion = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ViewProfile from "../ViewProfile.vue";
import Discussion from "../Discussion.vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../fireInit";

const reports = ref([]);
const userNamesCache = ref({});
const processedReports = ref([]);
const loading = ref(true);
const error = ref(null);

const showUserProfile = ref(false);
const selectedUserId = ref(null);

const showDiscussion = ref(false);
const selectedDiscussionId = ref(null);

// Format date to display in user-friendly format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time to display in user-friendly format
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get reports from backend API
const getReports = async () => {
  try {
    loading.value = true;
    const response = await fetch("/api/getAllReports");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch reports: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    reports.value = data.reports;

    // After getting reports, fetch user information from Firebase
    await fetchUserNames();
  } catch (err) {
    console.error("Error fetching reports:", err);
    error.value = "Failed to load reports. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Fetch user names from Firebase based on user IDs
const fetchUserNames = async () => {
  try {
    // Create a set of unique user IDs to fetch
    const uniqueUserIds = new Set();

    reports.value.forEach((report) => {
      if (report.user) uniqueUserIds.add(report.user);
      if (report.sender) uniqueUserIds.add(report.sender);
    });

    // Fetch user data for each unique ID
    const fetchPromises = Array.from(uniqueUserIds).map(async (userId) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          userNamesCache.value[userId] =
            userData.username || userData.displayName || "Unknown User";
        } else {
          userNamesCache.value[userId] = "Unknown User";
        }
      } catch (err) {
        console.error(`Error fetching user data for ${userId}:`, err);
        userNamesCache.value[userId] = "Unknown User";
      }
    });

    await Promise.all(fetchPromises);

    // Process reports with user names
    processedReports.value = reports.value.map((report) => ({
      ...report,
      senderName: report.sender || "Unknown User",
      userName: userNamesCache.value[report.user] || "Unknown User",
    }));
  } catch (err) {
    console.error("Error fetching user names:", err);
    // Fall back to using IDs as names
    processedReports.value = reports.value.map((report) => ({
      ...report,
      senderName: report.sender || "Unknown User",
      userName: report.user || "Unknown User",
    }));
  }
};

const viewUserProfile = (userId) => {
  selectedUserId.value = userId;
  showUserProfile.value = true;
};

const viewDiscussion = (discussionId) => {
  selectedDiscussionId.value = discussionId;
  showDiscussion.value = true;
};

onMounted(() => {
  getReports();
});
</script>

<style scoped>
/* Optional custom styles */
</style>

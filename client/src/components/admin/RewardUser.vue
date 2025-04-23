<template>
  <div
    class="min-h-screen flex flex-col md:flex-row gap-4 p-10 bg-black/50 backdrop-blur-[12px] backdrop-saturate-[162%] text-gray-200"
  >
    <!-- Left Panel: Solvers List -->
    <div class="w-full md:w-1/2 space-y-4">
      <h6 class="text-3xl font-bold text-fuchsia-600">
        Reward Community Members
      </h6>
      <div
        v-for="user in rewards"
        :key="user.username"
        class="p-4 rounded-2xl bg-black/60 border border-fuchsia-500 shadow-md"
      >
        <h2 class="text-xl font-bold text-fuchsia-400">
          {{ user.realName || "Loading..." }} (@{{ user.username }})
        </h2>
        <p class="text-sm">Solved: {{ user.totalSolved || 0 }} problems</p>

        <div class="flex flex-wrap gap-3 mt-3">
          <button
            @click="openProfilePopup(user.userId)"
            class="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-1 rounded-lg text-sm shadow"
          >
            View Profile
          </button>
          <button
            @click="openDiscussionPopup(user.qid)"
            class="bg-green-500 hover:bg-green-600 text-black px-4 py-1 rounded-lg text-sm shadow"
          >
            Problem Solved
          </button>
          <button
            v-if="user.walletId"
            @click="copyWalletAddress(user.walletId)"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm shadow flex items-center gap-1"
          >
            <span>{{
              copyStatus[user.walletId] ? "Copied!" : "Copy Wallet"
            }}</span>
            <svg
              v-if="copyStatus[user.walletId]"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Panel: Wallet Connection -->
    <div class="w-full md:w-1/2">
      <WalletConnect />
    </div>

    <!-- Profile Popup -->
    <div
      v-if="showProfilePopup"
      @click.self="closeProfilePopup"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <ViewProfile :userId="selectedUserId" />
    </div>

    <!-- Discussion Popup -->
    <div
      v-if="showDiscussionPopup"
      @click.self="closeDiscussionPopup"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <Discussion :qid="selectedQid" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import WalletConnect from "../WalletConnect.vue";
import ViewProfile from "../ViewProfile.vue";
import Discussion from "../Discussion.vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../fireInit";
const rewards = ref([]);
const showProfilePopup = ref(false);
const showDiscussionPopup = ref(false);
const selectedUserId = ref(null);
const selectedQid = ref(null);
const copyStatus = reactive({});

// Function to fetch reward requests from the backend
const fetchRewardRequests = async () => {
  try {
    const response = await fetch("/api/getRewardRequests");
    if (!response.ok) {
      throw new Error("Failed to fetch reward requests");
    }

    const data = await response.json();

    // Enrich the data with user details from Firebase
    const enrichedData = await Promise.all(
      data.map(async (reward) => {
        // Fetch user details from Firebase
        const userDetails = await getUserFromFirebase(reward.username);

        return {
          ...reward,
          ...userDetails,
          userId: userDetails?.userId || null,
        };
      })
    );

    rewards.value = enrichedData;
  } catch (error) {
    console.error("Error fetching reward requests:", error);
  }
};

// Function to get user details from Firebase by username
const getUserFromFirebase = async (username) => {
  try {
    // Query the users collection directly by username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    // Check if we found any matching user
    if (!querySnapshot.empty) {
      // Get the first matching document
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return {
        userId: userDoc.id, // This is the document ID from Firestore
        realName:
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          "Unknown",
        areaOfInterest: userData.areaOfInterest,
        fieldOfExpertise: userData.fieldOfExpertise,
        walletId: userData.walletId || null,
        totalSolved: userData.solvedProblems?.length || 0,
      };
    }

    return { realName: "Unknown User", totalSolved: 0, userId: null };
  } catch (error) {
    console.error("Error fetching user from Firebase:", error);
    return { realName: "Error Loading", totalSolved: 0, userId: null };
  }
};

// Function to copy wallet address to clipboard
const copyWalletAddress = async (walletId) => {
  try {
    await navigator.clipboard.writeText(walletId);
    copyStatus[walletId] = true;

    // Reset the copy status after 2 seconds
    setTimeout(() => {
      copyStatus[walletId] = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy wallet address:", error);
    // Fallback for browsers that don't support clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = walletId;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
      copyStatus[walletId] = true;

      // Reset the copy status after 2 seconds
      setTimeout(() => {
        copyStatus[walletId] = false;
      }, 2000);
    } catch (err) {
      console.error("Fallback: Failed to copy wallet address:", err);
      alert("Failed to copy wallet address. Please try again.");
    }

    document.body.removeChild(textarea);
  }
};

// Open profile popup
const openProfilePopup = (userId) => {
  selectedUserId.value = userId;
  showProfilePopup.value = true;
};

// Close profile popup
const closeProfilePopup = () => {
  showProfilePopup.value = false;
};

// Open discussion popup
const openDiscussionPopup = (qid) => {
  selectedQid.value = qid;
  showDiscussionPopup.value = true;
};

// Close discussion popup
const closeDiscussionPopup = () => {
  showDiscussionPopup.value = false;
};

// Fetch data when component is mounted
onMounted(() => {
  fetchRewardRequests();
});
</script>

<style scoped>
/* Add any additional styling here */
</style>

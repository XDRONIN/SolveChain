<template>
  <div
    class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 text-white"
  >
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-fuchsia-500 mb-6">Ban Users</h1>

      <!-- Search bar -->
      <div class="flex gap-3 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search username..."
          class="flex-1 p-3 rounded-xl bg-black/40 border border-fuchsia-500/20 text-white backdrop-blur-[12px] backdrop-saturate-[162%] placeholder-gray-400 focus:outline-none"
        />
        <button
          @click="searchUsers"
          class="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl font-semibold shadow-lg"
        >
          Search
        </button>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="text-center p-6">
        <p class="text-fuchsia-400">Loading users...</p>
      </div>

      <!-- Users list -->
      <div
        v-for="user in users"
        :key="user._id"
        class="mb-4 p-4 rounded-2xl backdrop-blur-[12px] backdrop-saturate-[162%] bg-black/50 shadow-lg border border-fuchsia-500/20 flex items-center justify-between"
      >
        <div>
          <div class="text-lg font-semibold text-fuchsia-400">
            {{ user.username }}
          </div>
          <div class="text-sm text-gray-300">
            {{ user.firstName }} {{ user.lastName }}
          </div>
          <div class="text-xs text-gray-400">User ID: {{ user._id }}</div>
          <div
            v-if="user.disabled"
            class="text-xs mt-1 text-red-400 font-semibold"
          >
            BANNED
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="viewProfile(user._id)"
            class="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white"
          >
            View Profile
          </button>
          <button
            v-if="!user.disabled"
            @click="confirmBanUser(user)"
            class="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-bold"
          >
            Ban
          </button>
          <button
            v-else
            @click="confirmUnbanUser(user)"
            class="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-bold"
          >
            Unban
          </button>
        </div>
      </div>

      <!-- No results message -->
      <div v-if="!loading && users.length === 0" class="text-center p-6">
        <p class="text-gray-400">No users found matching your search.</p>
      </div>
    </div>
  </div>

  <!-- Profile Popup -->
  <div
    v-if="showProfilePopup"
    class="fixed inset-0 flex items-center justify-center z-50"
    @click="closeProfilePopup"
  >
    <div class="fixed inset-0 bg-black opacity-70"></div>
    <div
      class="relative bg-gray-800 rounded-xl shadow-xl z-10 max-w-xl w-full mx-4"
      @click.stop
    >
      <ViewProfile :userId="selectedUserId" @close="closeProfilePopup" />
    </div>
  </div>

  <!-- Ban Confirmation Popup -->
  <div
    v-if="showBanConfirmation"
    class="fixed inset-0 flex items-center justify-center z-50"
    @click="closeBanConfirmation"
  >
    <div class="fixed inset-0 bg-black opacity-70"></div>
    <div
      class="bg-gray-800 rounded-xl shadow-xl z-10 p-6 max-w-md w-full mx-4"
      @click.stop
    >
      <h2 class="text-xl font-bold text-red-500 mb-4">
        {{ actionType === "ban" ? "Confirm User Ban" : "Confirm User Unban" }}
      </h2>
      <p class="text-white mb-6">
        Are you sure you want to {{ actionType === "ban" ? "ban" : "unban" }}
        <span class="font-bold">{{ userToAction?.username }}</span
        >?
        {{
          actionType === "ban"
            ? "Their account will be disabled but not deleted."
            : "Their account will be re-enabled."
        }}
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="closeBanConfirmation"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          @click="processUserAction"
          class="px-4 py-2 rounded-lg font-bold"
          :class="
            actionType === 'ban'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          "
          :disabled="processing"
        >
          {{
            processing
              ? actionType === "ban"
                ? "Banning..."
                : "Unbanning..."
              : actionType === "ban"
              ? "Ban User"
              : "Unban User"
          }}
        </button>
      </div>
    </div>
  </div>

  <!-- Success/Error Toast -->
  <div
    v-if="toast.show"
    class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50"
    :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
  >
    {{ toast.message }}
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import ViewProfile from "../ViewProfile.vue";
import { db } from "../../fireInit";

const searchQuery = ref("");
const users = ref([]);
const loading = ref(false);
const showProfilePopup = ref(false);
const selectedUserId = ref(null);
const showBanConfirmation = ref(false);
const userToAction = ref(null);
const processing = ref(false);
const actionType = ref("ban"); // 'ban' or 'unban'
const toast = ref({
  show: false,
  message: "",
  type: "success",
});

// Search for users in Firebase
const searchUsers = async () => {
  loading.value = true;

  try {
    // Fetch users with role="user" from Firebase
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "user"));
    const querySnapshot = await getDocs(q);

    const firebaseUsers = [];
    const userIds = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      // Filter by search query on the client side
      if (
        !searchQuery.value || // Show all if no search query
        userData.username
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        userData.firstName
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        userData.lastName
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      ) {
        firebaseUsers.push({
          _id: doc.id,
          username: userData.username || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          disabled: userData.disabled || false,
        });
        userIds.push(doc.id);
      }
    });

    users.value = firebaseUsers;
  } catch (error) {
    console.error("Error searching users:", error);
    showToast("Error loading users: " + error.message, "error");
  } finally {
    loading.value = false;
  }
};

const viewProfile = (userId) => {
  selectedUserId.value = userId;
  showProfilePopup.value = true;
};

const closeProfilePopup = () => {
  showProfilePopup.value = false;
};

const confirmBanUser = (user) => {
  userToAction.value = user;
  actionType.value = "ban";
  showBanConfirmation.value = true;
};

const confirmUnbanUser = (user) => {
  userToAction.value = user;
  actionType.value = "unban";
  showBanConfirmation.value = true;
};

const closeBanConfirmation = () => {
  showBanConfirmation.value = false;
  userToAction.value = null;
};

const processUserAction = async () => {
  if (!userToAction.value) return;

  const userId = userToAction.value._id;
  const isDisabling = actionType.value === "ban";
  processing.value = true;

  try {
    // Update user status in Firestore first
    await updateDoc(doc(db, "users", userId), {
      disabled: isDisabling,
    });

    // Then try to call the API if available
    try {
      const response = await fetch("/api/toggle-account-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          disabled: isDisabling,
        }),
        credentials: "same-origin",
      });

      // Check if response is JSON before trying to parse it
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();

        if (!response.ok) {
          console.warn("API responded with error:", data);
          // We'll continue because we've already updated Firestore
        }
      } else {
        console.warn("API did not return JSON. Status:", response.status);
        // We'll continue because we've already updated Firestore
      }
    } catch (apiError) {
      console.warn("API call failed but Firestore update succeeded:", apiError);
      // We'll continue because we've already updated Firestore
    }

    // Update user in the list
    const userIndex = users.value.findIndex((user) => user._id === userId);
    if (userIndex !== -1) {
      users.value[userIndex].disabled = isDisabling;
    }

    showToast(
      `User ${userToAction.value.username} has been ${
        isDisabling ? "banned" : "unbanned"
      } successfully`,
      "success"
    );
  } catch (error) {
    console.error(
      `Error ${isDisabling ? "banning" : "unbanning"} user:`,
      error
    );
    showToast(
      `Error ${isDisabling ? "banning" : "unbanning"} user: ${error.message}`,
      "error"
    );
  } finally {
    processing.value = false;
    closeBanConfirmation();
  }
};

const showToast = (message, type = "success") => {
  toast.value = {
    show: true,
    message,
    type,
  };

  // Auto-hide toast after 3 seconds
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Load initial users on component mount
onMounted(() => {
  searchUsers();
});
</script>

<style scoped>
/* Optional extras */
</style>

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
        </div>
        <div class="flex gap-2">
          <button
            @click="viewProfile(user._id)"
            class="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white"
          >
            View Profile
          </button>
          <button
            @click="banUser(user._id)"
            class="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-bold"
          >
            Ban
          </button>
        </div>
      </div>

      <!-- No results message -->
      <div v-if="!loading && users.length === 0" class="text-center p-6">
        <p class="text-gray-400">No users found matching your search.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../fireInit"; // Make sure to import your Firebase config

const searchQuery = ref("");
const users = ref([]);
const loading = ref(false);

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
        });
        userIds.push(doc.id);
      }
    });

    users.value = firebaseUsers;
  } catch (error) {
    console.error("Error searching users:", error);
  } finally {
    loading.value = false;
  }
};

const viewProfile = (userId) => {
  // Future: Navigate to profile or open a modal
  console.log(`Viewing profile of user ID ${userId}`);
};

const banUser = (userId) => {
  // Future: Send ban request to backend
  console.log(`Banning user ID ${userId}`);
};

// Load initial users on component mount
onMounted(() => {
  searchUsers();
});
</script>

<style scoped>
/* Optional extras */
</style>

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
          @click="searchUser"
          class="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl font-semibold shadow-lg"
        >
          Search
        </button>
      </div>

      <!-- Users list -->
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="mb-4 p-4 rounded-2xl backdrop-blur-[12px] backdrop-saturate-[162%] bg-black/50 shadow-lg border border-fuchsia-500/20 flex items-center justify-between"
      >
        <div>
          <div class="text-lg font-semibold text-fuchsia-400">
            {{ user.username }}
          </div>
          <div class="text-sm text-gray-400">User ID: {{ user.id }}</div>
        </div>
        <div class="flex gap-2">
          <button
            @click="viewProfile(user.id)"
            class="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white"
          >
            View Profile
          </button>
          <button
            @click="banUser(user.id)"
            class="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-bold"
          >
            Ban
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Dummy users
const users = ref([
  { id: 101, username: "ShadowHunter" },
  { id: 102, username: "BuggedOut" },
  { id: 103, username: "HackThrone" },
  { id: 104, username: "PixelWarrior" },
  { id: 105, username: "CodeSamurai" },
]);

const searchQuery = ref("");

const filteredUsers = computed(() =>
  users.value.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const searchUser = () => {
  // You can implement search logic or API call here in the future
  console.log(`Searching for "${searchQuery.value}"...`);
};

const viewProfile = (userId) => {
  // Future: Navigate to profile or open a modal
  console.log(`Viewing profile of user ID ${userId}`);
};

const banUser = (userId) => {
  // Future: Send ban request to backend
  console.log(`Banning user ID ${userId}`);
};
</script>

<style scoped>
/* Optional extras */
</style>

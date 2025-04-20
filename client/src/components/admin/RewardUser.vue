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
        v-for="user in users"
        :key="user.username"
        class="p-4 rounded-2xl bg-black/60 border border-fuchsia-500 shadow-md"
      >
        <h2 class="text-xl font-bold text-fuchsia-400">
          {{ user.realName }} (@{{ user.username }})
        </h2>
        <p class="text-sm">Solved: {{ user.totalSolved }} problems</p>

        <div class="flex gap-3 mt-3">
          <button
            class="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-1 rounded-lg text-sm shadow"
          >
            View Profile
          </button>
          <button
            class="bg-green-500 hover:bg-green-600 text-black px-4 py-1 rounded-lg text-sm shadow"
          >
            Problem Solved
          </button>
        </div>
      </div>
    </div>

    <!-- Right Panel: Wallet Connection -->
    <div class="w-full md:w-1/2">
      <WalletConnect />
    </div>
  </div>
</template>

<script setup>
import WalletConnect from "../WalletConnect.vue";

const users = [
  {
    username: "devpro123",
    realName: "Aarav Nair",
    totalSolved: 27,
  },
  {
    username: "cybersam",
    realName: "Samaira Kapoor",
    totalSolved: 42,
  },
  {
    username: "bughunter",
    realName: "Kabir Joshi",
    totalSolved: 35,
  },
  {
    username: "pixelwizard",
    realName: "Neha Sharma",
    totalSolved: 18,
  },
];
</script>

<style scoped></style>

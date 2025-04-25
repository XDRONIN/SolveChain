<script setup>
import Analitics from "../../components/admin/Analitics.vue";
import VRequests from "../../components/admin/VRequests.vue";
import Reports from "../../components/admin/Reports.vue";
import BanUser from "../../components/admin/BanUser.vue";
import RewardUser from "../../components/admin/RewardUser.vue";
import { ref } from "vue";
import { Ban } from "lucide-vue-next";

const menuOpen = ref(false);
const Nav = ref("Dashboard");

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const handleMenuAction = (action) => {
  menuOpen.value = false;
  switch (action) {
    case "verification":
      Nav.value = "verification";
      break;
    case "review":
      Nav.value = "review";
      break;
    case "ban":
      Nav.value = "ban";
      break;
    case "reward":
      Nav.value = "reward";
      break;
    case "Dashboard":
      Nav.value = "Dashboard";
      break;
  }
};
</script>

<template>
  <div class="relative flex justify-end pt-5 -mb-20 mr-10 z-10">
    <div class="relative inline-block text-left">
      <button
        @click="toggleMenu"
        class="p-2 rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none"
      >
        <svg
          class="w-10 h-10"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Dropdown -->
      <div
        v-if="menuOpen"
        class="absolute right-0 mt-2 w-52 rounded-xl shadow-xl bg-gray-900 border border-gray-700 z-50"
      >
        <ul class="py-2 text-sm text-gray-300">
          <li>
            <button
              @click="handleMenuAction('Dashboard')"
              class="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              @click="handleMenuAction('verification')"
              class="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Verification Requests
            </button>
          </li>
          <li>
            <button
              @click="handleMenuAction('review')"
              class="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Review Reports
            </button>
          </li>
          <li>
            <button
              @click="handleMenuAction('ban')"
              class="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Ban User
            </button>
          </li>
          <li>
            <button
              @click="handleMenuAction('reward')"
              class="w-full text-left px-4 py-2 hover:bg-gray-800"
            >
              Reward User
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="bg-black min-h-screen">
    <!-- Make sure the case matches -->
    <Analitics v-if="Nav === 'Dashboard'" />
    <VRequests v-if="Nav === 'verification'" />
    <Reports v-if="Nav === 'review'" />
    <BanUser v-if="Nav === 'ban'" />
    <RewardUser v-if="Nav === 'reward'" />
  </div>
</template>

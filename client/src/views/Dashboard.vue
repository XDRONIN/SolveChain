<template>
  <div class="min-h-screen bg-black text-white md:pl-45 md:pr-45">
    <!-- Main Layout -->
    <div class="flex flex-col md:flex-row">
      <div
        :class="[
          ' min-w-screen min-h-screen absolute  left-0 z-20  backdrop-blur-[12px] backdrop-saturate-[162%] bg-[rgba(255,255,255,0.1)] flex items-center justify-center ',
          postDiv ? 'flex' : 'hidden',
        ]"
        @click="togglePost"
      >
        <ComposePost @click.stop="" />
      </div>
      <!-- Left Sidebar -->
      <nav
        class="fixed inset-y-0 left-0 w-64 border-r border-gray-800 p-4 bg-black md:static md:block md:h-screen transition-transform transform md:translate-x-0 z-10"
        :class="{
          '-translate-x-full': !isSidebarOpen,
          'translate-x-0': isSidebarOpen,
        }"
      >
        <!-- Logo -->
        <div class="mb-4 flex justify-between items-center">
          <img src="../assets/logo2.png" alt="" class="w-40" />
          <button class="md:hidden text-white" @click="toggleSidebar">✖</button>
        </div>

        <!-- Navigation Items -->
        <div class="space-y-4 mt-10">
          <button
            v-for="item in navItems"
            :key="item.name"
            :class="[
              'flex w-full items-center gap-4 rounded-full p-3 text-xl hover:bg-[rgba(27,27,27,0.5)]',
              activeNav === item.name ? 'text-fuchsia-500' : '',
            ]"
            @click="makeActive(item.name)"
          >
            <component :is="item.icon" class="h-7 w-7" />
            <span>{{ item.name }}</span>
          </button>
        </div>

        <!-- Post Button -->
        <div
          @click="togglePost"
          class="mt-4 w-full flex gap-3 cursor-pointer text-white font-semibold bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 px-7 py-3 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-fuchsia-800 hover:to-fuchsia-500"
        >
          <CircleFadingPlus class="h-7 w-7" />Ask a Question
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col bg-black md:max-w-336">
        <!-- Header -->
        <header
          class="top-0 border-b border-gray-800 bg-black/80 p-4 flex justify-between items-center"
        >
          <button class="md:hidden text-white" @click="toggleSidebar">☰</button>

          <div class="relative w-full max-w-lg mx-auto flex-1 left-0 ml-1">
            <input
              type="search"
              placeholder="Search"
              class="w-full rounded-full backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-3 outline-none"
            />
          </div>
          <div class="flex mr-2">
            <button
              class="text-center mr-4 ml-3 flex cursor-pointer text-fuchsia-700 md:font-semibold text-sm bg-transparent md:px-1 md:py-2 rounded-full border-2 border-fuchsia-700 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200 before:rounded-full before:bg-gradient-to-r before:from-fuchsia-400 before:to-fuchsia-800 before:blur-md before:opacity-50 before:z-[-1]"
            >
              Connect Wallet
            </button>
          </div>
          <User class="h-7 w-7 mr-4" />
        </header>

        <Posts />
      </main>

      <!-- Right Sidebar -->
      <aside
        class="hidden md:block relative right-0 top-0 h-screen w-80 border-l border-gray-800 p-4 bg-black"
      >
        <!-- Premium Card -->
        <div
          class="mt-4 rounded-xl backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-3 pr-6 flex flex-col pt-4"
        >
          <h2 class="text-xl font-bold mb-0 ml-2">Top Solvers</h2>
          <Trophy class="w-7 h-7 relative -top-7 left-31" />
          <div v-for="solvers in TopSolvers" :key="solvers.username">
            <div
              class="flex h-20 w-full bg-transparant rounded-2xl border-1 border-[rgba(255,255,255,0.125)] m-1 gap-2 items-center p-6"
            >
              <User class="h-7 w-7" />
              <p>
                {{ solvers.username }}<br />
                <span class="text-gray-500">
                  {{ solvers.fieldOfExpectise }}</span
                >
              </p>
            </div>
          </div>
        </div>

        <!-- What's happening -->
        <div
          class="mt-4 rounded-xl backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-4"
        >
          <h2 class="text-xl font-bold">Hot now</h2>
          <Flame class="w-7 h-7 relative -top-8 left-21" />

          <div class="space-y-4">
            <div v-for="trend in trends" :key="trend.id">
              <div class="text-sm text-gray-500">{{ trend.field }}</div>
              <div class="font-bold">{{ trend.tag }}</div>
              <div class="text-sm text-gray-500">
                {{ trend.questions }} Questions
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-4 rounded-xl backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-4 pr-6 flex flex-col mb-0"
        >
          <p class="text-xl font-bold">
            SolveCoins Paid<br />

            <span
              class="bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 bg-clip-text text-transparent mt-0"
              >{{ noQuestions }}</span
            >
          </p>
          <Coins class="w-7 h-7 relative -top-15 left-39 m-0 p-0" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Posts from "../components/Posts.vue";
import ComposePost from "../components/ComposePost.vue";
import {
  Home,
  Flame,
  TrendingUp,
  Coins,
  Bell,
  CircleCheckBig,
  CircleFadingPlus,
  Trophy,
  CircleHelp,
  Users,
  User,
} from "lucide-vue-next";
const postDiv = ref(false);
const navItems = ref([
  { name: "Home", icon: Home },
  { name: "Trending", icon: TrendingUp },
  { name: "Notifications", icon: Bell },
  { name: "Discussions", icon: Users },
  { name: "My Questions", icon: CircleHelp },

  { name: "My Solutions", icon: CircleCheckBig },
]);

const noQuestions = ref("2,00,000");

const TopSolvers = ref([
  {
    username: "xyz",
    fieldOfExpectise: "Web Developer",
  },
  {
    username: "another",
    fieldOfExpectise: "Mechanic",
  },
  {
    username: "AnotherOne",
    fieldOfExpectise: "Teacher",
  },
]);
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const trends = ref([
  {
    id: 1,
    field: "tech",
    tag: "#Deepseek",
    questions: "136K",
  },
  {
    id: 2,
    field: "tech",
    tag: "#iphone13",
    questions: "2,361",
  },
  {
    id: 3,
    field: "Relationship",
    tag: "#ValentinesDay",
    questions: "544K",
  },
]);
const activeNav = ref("Home");
const makeActive = (item) => {
  activeNav.value = item;
  // console.log(activeNav);
};
const togglePost = () => {
  postDiv.value = !postDiv.value;
};
</script>

<style>
/* Add any custom styles here */
</style>

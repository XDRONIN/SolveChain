<template>
  <div class="min-h-screen bg-black text-white md:pl-45 md:pr-45">
    <!-- Main Layout -->
    <div class="flex flex-col md:flex-row">
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
            class="flex w-full items-center gap-4 rounded-full p-3 text-xl hover:bg-gray-900"
          >
            <component :is="item.icon" class="h-7 w-7" />
            <span>{{ item.name }}</span>
          </button>
        </div>

        <!-- Post Button -->
        <div
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

          <select
            name="filter"
            id="filter"
            class="md:w-fit sm:w-2 rounded-full border-none outline-none bg-gray-900 pl-2 py-2 text-gray-200 m-2 ml-4"
          >
            <option
              v-for="option in filterOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <select
            name="fieldFilter"
            id="dieldFilter"
            class="md:w-fit sm:w-2 rounded-full border-none outline-none bg-gray-900 pl-2 py-2 text-gray-200 m-2"
          >
            <option
              v-for="option in fieldOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <div class="relative w-full max-w-lg mx-auto flex-1">
            <input
              type="search"
              placeholder="Search"
              class="w-full rounded-full bg-gray-900 p-3 pl-4 outline-none"
            />
          </div>
          <div class="flex mr-2">
            <button
              class="text-center flex cursor-pointer text-fuchsia-700 md:font-semibold text-sm bg-transparent md:px-1 md:py-2 rounded-full border-2 border-fuchsia-700 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200 before:rounded-full before:bg-gradient-to-r before:from-fuchsia-400 before:to-fuchsia-800 before:blur-md before:opacity-50 before:z-[-1]"
            >
              Connect Wallet
            </button>
          </div>
          <User class="h-7 w-7 mr-4" />
        </header>

        <!-- Feed -->
        <div class="divide-y divide-gray-800 p-4 flex flex-col gap-2">
          <article v-for="post in posts" :key="post.id" class="p-4">
            <div class="flex gap-4">
              <div
                class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-600"
              ></div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold">{{ post.author }}</span>
                  <span class="text-gray-500">@{{ post.handle }}</span>
                  <span class="text-gray-500">· {{ post.time }}</span>
                </div>
                <p class="mt-1">{{ post.content }}</p>
                <div class="mt-4 flex justify-between text-gray-500">
                  <button class="hover:text-green-500 flex items-center">
                    <ArrowBigUp class="h-7 w-7" /> {{ post.upvotes }}
                  </button>
                  <button class="hover:text-red-500 flex items-center">
                    <ArrowBigDown class="h-7 w-7" /> {{ post.downvotes }}
                  </button>
                  <button class="hover:text-yellow-500 flex items-center">
                    <BellPlus class="h-5 w-5" /> {{ post.notify }}
                  </button>
                  <button class="hover:text-fuchsia-500 flex items-center">
                    <Users class="h-5 w-5" /> {{ post.discussion }}
                  </button>
                  <button class="hover:text-blue-500 flex items-center">
                    <Send class="h-5 w-5" /> {{ post.share }}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <!-- Right Sidebar -->
      <aside
        class="hidden md:block relative right-0 top-0 h-screen w-80 border-l border-gray-800 p-4 bg-black"
      >
        <!-- Premium Card -->
        <div class="mt-4 rounded-xl bg-gray-900 p-3 pr-6 flex flex-col">
          <h2 class="text-xl font-bold mb-0 ml-2">Top Solvers</h2>
          <Trophy class="w-7 h-7 relative -top-7 left-31" />
          <div v-for="solvers in TopSolvers" :key="solvers.username">
            <div
              class="flex h-20 w-full bg-gray-800 rounded-2xl m-1 gap-2 items-center p-6"
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
        <div class="mt-4 rounded-xl bg-gray-900 p-4">
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
        <div class="mt-4 rounded-xl bg-gray-900 p-4 pr-6 flex flex-col mb-0">
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

import {
  Home,
  Flame,
  TrendingUp,
  ArrowBigUp,
  ArrowBigDown,
  BellPlus,
  Send,
  Coins,
  Bell,
  CircleCheckBig,
  CircleFadingPlus,
  Trophy,
  CircleHelp,
  Users,
  User,
} from "lucide-vue-next";

const navItems = [
  { name: "Home", icon: Home },
  { name: "Trending", icon: TrendingUp },
  { name: "Notifications", icon: Bell },
  { name: "Discussions", icon: Users },
  { name: "My Questions", icon: CircleHelp },

  { name: "My Solutions", icon: CircleCheckBig },
];

const posts = ref([
  {
    id: 1,
    author: "Alex Jones",
    handle: "RealAlexJones",
    time: "7h",
    content:
      "BREAKING: Donald Trump Signs Off On DOGE To Fully Audit The IRS As The Growing Team Of Super Geniuses Enter The IRS Building Today",
    upvotes: "2.6K",
    downvotes: "2.6K",
    notify: "1.6K",
    discussion: "102K",
    share: "8.5M",
  },
  {
    id: 2,
    author: "Alex Jones",
    handle: "RealAlexJones",
    time: "7h",
    content:
      "BREAKING: Donald Trump Signs Off On DOGE To Fully Audit The IRS As The Growing Team Of Super Geniuses Enter The IRS Building Today sdjnaudiuaduai ajbnsiahdiubasbsdu ajbjsdibaduibasidbas jasdudkasdb<br>hjsvdavdyuvasdyuv",
    upvotes: "2.6K",
    downvotes: "2.6K",
    notify: "1.6K",
    discussion: "102K",
    share: "8.5M",
  },
  {
    id: 3,
    author: "Alex Jones",
    handle: "RealAlexJones",
    time: "7h",
    content:
      "BREAKING: Donald Trump Signs Off On DOGE To Fully Audit The IRS As The Growing Team Of Super Geniuses Enter The IRS Building Today",
    upvotes: "2.6K",
    downvotes: "2.6K",
    notify: "1.6K",
    discussion: "102K",
    share: "8.5M",
  },
  // Add more posts as needed
]);
const noQuestions = ref("2,00,000");
const filterOptions = ref(["New", "Popular", "Unsolved", "Solved"]);
const fieldOptions = ref([
  "Tech",
  "Mechanical",
  "Electrical",
  "Medical",
  "Law",
  "Everyday Skills",
  "All",
]);
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
</script>

<style>
/* Add any custom styles here */
</style>

<template>
  <div class="min-h-screen bg-black text-white">
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
        <button
          class="mt-4 w-full rounded-full bg-blue-500 p-4 font-bold hover:bg-blue-600"
        >
          Post
        </button>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col bg-black md:max-w-336">
        <!-- Header -->
        <header
          class="top-0 border-b border-gray-800 bg-black/80 p-4 flex justify-between items-center"
        >
          <button class="md:hidden text-white" @click="toggleSidebar">☰</button>
          <div class="relative w-full max-w-lg mx-auto flex-1">
            <input
              type="search"
              placeholder="Search"
              class="w-full rounded-full bg-gray-900 p-3 pl-4 outline-none"
            />
          </div>
          <div class="flex">
            <button
              class="text-center flex cursor-pointer text-fuchsia-700 md:font-semibold bg-transparent md:px-2 md:py-1 rounded-full border-2 border-fuchsia-700 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200 before:rounded-full before:bg-gradient-to-r before:from-fuchsia-400 before:to-fuchsia-800 before:blur-md before:opacity-50 before:z-[-1] mr-5"
            >
              Connect Wallet
            </button>
            <User class="h-7 w-7" />
          </div>
        </header>

        <!-- Feed -->
        <div class="divide-y divide-gray-800 p-4">
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
                  <button class="hover:text-blue-500">
                    <i class="far fa-comment"></i> {{ post.replies }}
                  </button>
                  <button class="hover:text-green-500">
                    <i class="far fa-retweet"></i> {{ post.retweets }}
                  </button>
                  <button class="hover:text-red-500">
                    <i class="far fa-heart"></i> {{ post.likes }}
                  </button>
                  <button class="hover:text-blue-500">
                    <i class="far fa-chart-bar"></i> {{ post.views }}
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
        <div class="mt-4 rounded-xl bg-gray-900 p-4">
          <h2 class="text-xl font-bold">Subscribe to Premium</h2>
          <p class="mt-2 text-sm text-gray-300">
            Subscribe to unlock new features and if eligible, receive a share of
            revenue.
          </p>
          <button
            class="mt-4 rounded-full bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600"
          >
            Subscribe
          </button>
        </div>

        <!-- What's happening -->
        <div class="mt-4 rounded-xl bg-gray-900 p-4">
          <h2 class="text-xl font-bold">What's happening</h2>
          <div class="mt-4 space-y-4">
            <div v-for="trend in trends" :key="trend.id">
              <div class="text-sm text-gray-500">{{ trend.category }}</div>
              <div class="font-bold">{{ trend.title }}</div>
              <div class="text-sm text-gray-500">{{ trend.posts }} posts</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Users,
  User,
} from "lucide-vue-next";

const navItems = [
  { name: "Home", icon: Home },
  { name: "Explore", icon: Search },
  { name: "Notifications", icon: Bell },
  { name: "Messages", icon: Mail },
  { name: "Bookmarks", icon: Bookmark },
  { name: "Communities", icon: Users },
];

const posts = ref([
  {
    id: 1,
    author: "Alex Jones",
    handle: "RealAlexJones",
    time: "7h",
    content:
      "BREAKING: Donald Trump Signs Off On DOGE To Fully Audit The IRS As The Growing Team Of Super Geniuses Enter The IRS Building Today",
    replies: "2.6K",
    retweets: "1.6K",
    likes: "102K",
    views: "8.5M",
  },
  // Add more posts as needed
]);
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const trends = ref([
  {
    id: 1,
    category: "Trending in India",
    title: "#DisasterLaila",
    posts: "136K",
  },
  {
    id: 2,
    category: "Entertainment · Trending",
    title: "#JioHotstar",
    posts: "2,361",
  },
  {
    id: 3,
    category: "Trending in India",
    title: "#ValentinesDay",
    posts: "544K",
  },
]);
</script>

<style>
/* Add any custom styles here */
</style>

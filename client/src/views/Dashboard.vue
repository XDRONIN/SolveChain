<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Main Layout -->
    <div class="flex">
      <!-- Left Sidebar -->
      <nav class="fixed h-screen w-64 border-r border-gray-800 p-4">
        <!-- Logo -->
        <div class="mb-4">
          <svg
            viewBox="0 0 24 24"
            class="h-8 w-8 text-white"
            fill="currentColor"
          >
            <g>
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              ></path>
            </g>
          </svg>
        </div>

        <!-- Navigation Items -->
        <div class="space-y-4">
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
      <main class="ml-64 flex-1">
        <!-- Header -->
        <header
          class="sticky top-0 border-b border-gray-800 bg-black/80 backdrop-blur"
        >
          <div class="flex">
            <button class="flex-1 p-4 hover:bg-gray-900">For you</button>
            <button class="flex-1 p-4 hover:bg-gray-900">Following</button>
          </div>
        </header>

        <!-- Post Composer -->
        <div class="border-b border-gray-800 p-4">
          <div class="flex gap-4">
            <div class="h-10 w-10 rounded-full bg-gray-600"></div>
            <div class="flex-1">
              <input
                type="text"
                placeholder="What is happening?!"
                class="w-full bg-transparent p-2 text-xl outline-none"
              />
              <div class="mt-4 flex items-center justify-between">
                <div class="flex gap-2">
                  <button
                    v-for="action in postActions"
                    :key="action.name"
                    class="rounded-full p-2 hover:bg-blue-500/20"
                  >
                    <component
                      :is="action.icon"
                      class="h-5 w-5 text-blue-500"
                    />
                  </button>
                </div>
                <button
                  class="rounded-full bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Feed -->
        <div class="divide-y divide-gray-800">
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
      <aside class="fixed right-0 h-screen w-80 border-l border-gray-800 p-4">
        <!-- Search -->
        <div class="relative">
          <input
            type="search"
            placeholder="Search"
            class="w-full rounded-full bg-gray-900 p-3 pl-12 outline-none"
          />
          <i
            class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          ></i>
        </div>

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
  Image,
  Film,
  ListPlus,
  MapPin,
  Smile,
  Calendar,
} from "lucide-vue-next";

const navItems = [
  { name: "Home", icon: Home },
  { name: "Explore", icon: Search },
  { name: "Notifications", icon: Bell },
  { name: "Messages", icon: Mail },
  { name: "Bookmarks", icon: Bookmark },
  { name: "Communities", icon: Users },
  { name: "Profile", icon: User },
];

const postActions = [
  { name: "Media", icon: Image },
  { name: "GIF", icon: Film },
  { name: "Poll", icon: ListPlus },
  { name: "Location", icon: MapPin },
  { name: "Emoji", icon: Smile },
  { name: "Schedule", icon: Calendar },
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

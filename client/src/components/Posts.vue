<template>
  <div class="flex">
    <select
      name="filter"
      id="filter"
      class="md:w-fit sm:w-2 rounded-full border-none outline-none backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] pl-2 py-2 text-gray-200 m-2 ml-4"
    >
      <option v-for="option in filterOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <select
      name="fieldFilter"
      id="dieldFilter"
      class="md:w-fit sm:w-2 rounded-full border-none outline-none backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] pl-2 py-2 text-gray-200 m-2"
    >
      <option v-for="option in fieldOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
  <!-- Feed -->
  <div class="divide-y divide-gray-800 p-4 flex flex-col gap-2">
    <article v-for="post in posts" :key="post.id" class="p-4">
      <div class="flex gap-4">
        <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-600"></div>
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
</template>
<script setup>
import { ref } from "vue";
import {
  ArrowBigUp,
  ArrowBigDown,
  BellPlus,
  Send,
  Users,
} from "lucide-vue-next";
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
</script>

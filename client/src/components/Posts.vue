<template>
  <div class="flex">
    <select
      name="filter"
      id="filter"
      v-model="selectedFilter"
      @change="fetchPosts(true)"
      class="md:w-fit sm:w-2 rounded-full border-none outline-none backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] pl-2 py-2 text-gray-200 m-2 ml-4"
    >
      <option v-for="option in filterOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <select
      name="fieldFilter"
      id="fieldFilter"
      v-model="selectedField"
      @change="fetchPosts(true)"
      class="md:w-fit sm:w-2 rounded-full border-none outline-none backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] pl-2 py-2 text-gray-200 m-2"
    >
      <option v-for="option in fieldOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>

  <!-- Feed -->
  <div class="divide-y divide-gray-800 p-4 flex flex-col gap-2">
    <article v-for="post in posts" :key="post._id" class="p-4">
      <div class="flex gap-4">
        <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-600"></div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-bold">{{ post.username }}</span>
            <span class="text-gray-500"
              >· {{ formatTime(post.createdAt) }}</span
            >
          </div>
          <p class="mt-1">{{ post.queBody }}</p>

          <!-- Display Media -->
          <div v-if="post?.media?.length" class="mt-2 relative">
            <div
              :class="{
                'grid grid-cols-1': post.media.length === 1,
                'grid grid-cols-2 gap-1':
                  post.media.length === 2 || post.media.length === 3,
                'grid grid-cols-2 gap-1': post.media.length >= 4,
              }"
            >
              <template
                v-for="(media, index) in post.media.slice(0, 4)"
                :key="index"
              >
                <div
                  class="relative cursor-pointer"
                  @click="openModal(post, index)"
                >
                  <img
                    :src="media.url"
                    class="w-full rounded-lg"
                    :class="{
                      'col-span-2 max-h-[300px]': post.media.length === 1,
                      'max-h-[250px]':
                        post.media.length === 2 || post.media.length === 3,
                      'max-h-[200px]': post.media.length >= 4,
                    }"
                    alt="Post media"
                    loading="lazy"
                    style="object-fit: cover"
                  />
                  <!-- Show "+X more" overlay -->
                  <div
                    v-if="index === 3 && post.media.length > 4"
                    class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-lg font-bold"
                  >
                    +{{ post.media.length - 4 }}
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="mt-4 flex justify-between text-gray-500">
            <button class="hover:text-green-500 flex items-center">
              <ArrowBigUp class="h-7 w-7" /> {{ post.meta.upvotes }}
            </button>
            <button class="hover:text-red-500 flex items-center">
              <ArrowBigDown class="h-7 w-7" /> {{ post.meta.downvotes }}
            </button>
            <button class="hover:text-yellow-500 flex items-center">
              <BellPlus class="h-5 w-5" /> {{ post.meta.notify }}
            </button>
            <button class="hover:text-fuchsia-500 flex items-center">
              <Users class="h-5 w-5" /> {{ post.meta.discussion }}
            </button>
            <button class="hover:text-blue-500 flex items-center">
              <Send class="h-5 w-5" /> {{ post.meta.share }}
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>

  <!-- Modal for Image Slideshow -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
    @click.self="closeModal"
  >
    <!-- Left Arrow -->
    <button
      class="absolute left-5 text-white text-3xl bg-gray-700 rounded-full px-3 py-1 hover:bg-gray-600"
      @click.stop="prevImage"
    >
      ‹
    </button>

    <!-- Display Image -->
    <img
      v-if="currentMedia"
      :src="currentMedia.url"
      class="max-w-full max-h-[90vh] rounded-lg"
    />

    <!-- Right Arrow -->
    <button
      class="absolute right-5 text-white text-3xl bg-gray-700 rounded-full px-3 py-1 hover:bg-gray-600"
      @click.stop="nextImage"
    >
      ›
    </button>
  </div>

  <!-- Load More Button -->
  <div class="text-center mt-4">
    <button
      @click="fetchPosts(false)"
      class="bg-blue-500 text-white px-4 py-2 rounded-lg"
      v-if="hasMore"
    >
      Load More
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  ArrowBigUp,
  ArrowBigDown,
  BellPlus,
  Send,
  Users,
} from "lucide-vue-next";

const posts = ref([]);
const page = ref(1);
const hasMore = ref(true);
const selectedFilter = ref("New");
const selectedField = ref("All");

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

const fetchPosts = async (reset = false) => {
  if (reset) {
    posts.value = [];
    page.value = 1;
  }

  try {
    const response = await fetch(
      `/api/getPosts?page=${page.value}&limit=20&filter=${selectedFilter.value}&field=${selectedField.value}`
    );
    const data = await response.json();

    if (response.ok) {
      if (reset) {
        posts.value = data.posts;
      } else {
        posts.value = [...posts.value, ...data.posts];
      }

      hasMore.value = data.posts.length === 20;
      page.value++;
    } else {
      console.error("Failed to fetch posts:", data.error);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return "Unknown time";

  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 0 to 12
  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return `${date.toLocaleDateString()} at ${formattedTime}`;
};

onMounted(() => {
  fetchPosts();
});

// Modal state
const isModalOpen = ref(false);
const currentImageIndex = ref(0);
const activePost = ref(null);

// Changed to use activePost instead of props.post
const currentMedia = computed(
  () => activePost.value?.media?.[currentImageIndex.value] || null
);

// Updated to store the current post and index
const openModal = (post, index) => {
  if (post?.media?.length) {
    activePost.value = post;
    currentImageIndex.value = index;
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const prevImage = () => {
  if (!activePost.value?.media) return;

  currentImageIndex.value =
    currentImageIndex.value > 0
      ? currentImageIndex.value - 1
      : activePost.value.media.length - 1;
};

const nextImage = () => {
  if (!activePost.value?.media) return;

  currentImageIndex.value =
    currentImageIndex.value < activePost.value.media.length - 1
      ? currentImageIndex.value + 1
      : 0;
};
</script>

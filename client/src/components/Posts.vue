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
  <div
    v-if="disc"
    class="bg-black/90 min-h-full fixed flex z-20 inset-0 justify-center align-middle p-5"
    @click="showDisc"
  >
    <Discussion :qid="currentQid" @click.stop="" />
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
                  <!-- Dynamic media display based on type -->
                  <img
                    v-if="getMediaType(media) === 'image'"
                    :src="media.url"
                    class="w-full rounded-lg"
                    :class="{
                      'col-span-2 max-h-[300px]': post.media.length === 1,
                      'max-h-[250px]':
                        post.media.length === 2 || post.media.length === 3,
                      'max-h-[200px]': post.media.length >= 4,
                    }"
                    alt="Post image"
                    loading="lazy"
                    style="object-fit: cover"
                  />
                  <video
                    v-else-if="getMediaType(media) === 'video'"
                    class="w-full rounded-lg"
                    :class="{
                      'col-span-2 max-h-[300px]': post.media.length === 1,
                      'max-h-[250px]':
                        post.media.length === 2 || post.media.length === 3,
                      'max-h-[200px]': post.media.length >= 4,
                    }"
                    :src="media.url"
                    style="object-fit: cover"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <!-- Play button overlay for videos -->
                  <div
                    v-if="getMediaType(media) === 'video'"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <div class="bg-black bg-opacity-30 rounded-full p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
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
            <button
              class="hover:text-green-500 flex items-center"
              @click="updateMeta('upvotes', post._id)"
            >
              <ArrowBigUp class="h-7 w-7" /> {{ post.meta.upvotes.val }}
            </button>
            <button
              class="hover:text-red-500 flex items-center"
              @click="updateMeta('downvotes', post._id)"
            >
              <ArrowBigDown class="h-7 w-7" /> {{ post.meta.downvotes.val }}
            </button>
            <button
              class="hover:text-yellow-500 flex items-center"
              @click="updateMeta('notify', post._id)"
            >
              <BellPlus class="h-5 w-5" /> {{ post.meta.notify.val }}
            </button>
            <button
              class="hover:text-fuchsia-500 flex items-center"
              @click="setQid(post._id)"
            >
              <Users class="h-5 w-5" /> {{ post.meta.discussion.val }}
            </button>
            <button class="hover:text-blue-500 flex items-center">
              <Send class="h-5 w-5" /> {{ post.meta.share.val }}
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>

  <!-- Modal for Media Slideshow -->
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

    <!-- Display Media based on type -->
    <img
      v-if="currentMedia && getMediaType(currentMedia) === 'image'"
      :src="currentMedia.url"
      class="max-w-full max-h-[90vh] rounded-lg"
      alt="Post image"
    />
    <video
      v-else-if="currentMedia && getMediaType(currentMedia) === 'video'"
      class="max-w-full max-h-[90vh] rounded-lg"
      controls
      autoplay
    >
      <source :src="currentMedia.url" :type="getVideoType(currentMedia)" />
      Your browser does not support the video tag.
    </video>

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
import Discussion from "./Discussion.vue";
const posts = ref([]);
const page = ref(1);
const hasMore = ref(true);
const selectedFilter = ref("New");
const selectedField = ref("All");
const disc = ref(false);
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
const currentQid = ref("");

// Function to determine media type
const getMediaType = (media) => {
  if (!media || !media.url) return "unknown";

  // Check if media has an explicit type property
  if (media.type) {
    if (media.type.startsWith("image/")) return "image";
    if (media.type.startsWith("video/")) return "video";
  }

  // If no explicit type, infer from URL extension
  const url = media.url.toLowerCase();

  // Image extensions
  if (
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".png") ||
    url.endsWith(".gif") ||
    url.endsWith(".webp") ||
    url.endsWith(".svg")
  ) {
    return "image";
  }

  // Video extensions
  if (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg") ||
    url.endsWith(".mov") ||
    url.endsWith(".avi")
  ) {
    return "video";
  }

  // Default to image if unable to determine
  return "image";
};

// Function to determine video MIME type
const getVideoType = (media) => {
  if (media.type) return media.type;

  const url = media.url.toLowerCase();
  if (url.endsWith(".mp4")) return "video/mp4";
  if (url.endsWith(".webm")) return "video/webm";
  if (url.endsWith(".ogg")) return "video/ogg";
  if (url.endsWith(".mov")) return "video/quicktime";
  if (url.endsWith(".avi")) return "video/x-msvideo";

  return "video/mp4"; // Default to mp4
};

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
const updateMeta = async (whichMeta, qid) => {
  try {
    const response = await fetch("/api/updateMeta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ whichMeta, qid }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message); // Success message
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
const showDisc = () => {
  disc.value = !disc.value;
};
const setQid = (qid) => {
  showDisc();
  currentQid.value = qid;

  //console.log(currentQid);
};
</script>

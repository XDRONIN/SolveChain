<template>
  <div class="min-h-screen bg-black text-white p-4">
    <!-- Main Layout -->
    <div class="flex flex-col md:flex-row h-screen max-w-screen-2xl mx-auto">
      <div
        :class="[
          'min-w-screen min-h-screen absolute left-0 z-20 backdrop-blur-[12px] backdrop-saturate-[162%] bg-black/50 flex items-center justify-center',
          postDiv ? 'flex' : 'hidden',
        ]"
        @click="togglePost"
      >
        <ComposePost @click.stop="" />
      </div>

      <!-- Left Sidebar - Fixed with spacing -->
      <nav
        class="fixed inset-y-0 left-0 ml-4 mt-4 mb-4 w-64 rounded-xl border-r border-gray-800 p-4 bg-black md:relative md:h-screen overflow-y-auto scrollbar-hide transition-transform transform md:translate-x-0 z-10 flex-shrink-0"
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
        <div
          v-if="notify"
          class="bg-red-500 rounded-full w-3 h-3 absolute top-42 left-11"
        ></div>
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

      <!-- Main Content - Scrollable -->
      <main
        class="flex-1 flex flex-col bg-black md:max-w-336 scrollbar-hide overflow-y-auto h-screen mx-4"
      >
        <!-- Header - Sticky -->
        <header
          class="sticky top-0 border-b border-gray-800 bg-black/80 p-4 flex justify-between items-center z-10 rounded-t-xl"
        >
          <button class="md:hidden text-white" @click="toggleSidebar">☰</button>

          <div class="relative w-full max-w-lg mx-auto flex-1 left-0 ml-1">
            <input
              type="search"
              placeholder="Search users or posts"
              class="w-full rounded-full backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-3 outline-none"
              v-model="searchQuery"
              @input="handleSearch"
              @focus="showResults = true"
              @blur="hideSearchResults"
            />
            <!-- Search Results -->
            <div
              v-show="
                showResults &&
                (searchResults.users.length > 0 ||
                  searchResults.posts.length > 0)
              "
              class="absolute w-full mt-2 rounded-xl backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.8)] border border-[rgba(255,255,255,0.125)] max-h-96 overflow-y-auto z-20"
            >
              <!-- Users Section -->
              <div v-if="searchResults.users.length > 0" class="p-3">
                <h3 class="text-fuchsia-500 font-medium mb-2">Users</h3>
                <div
                  v-for="user in searchResults.users"
                  :key="user._id"
                  @click="setUserID(user._id)"
                  class="flex items-center gap-3 p-2 hover:bg-[rgba(48,48,48,0.5)] rounded-lg cursor-pointer"
                >
                  <div class="flex-shrink-0">
                    <img
                      v-if="user.profilePic"
                      :src="user.profilePic"
                      alt=""
                      class="h-10 w-10 rounded-full"
                    />
                    <User v-else class="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p class="font-medium">{{ user.username }}</p>
                    <p class="text-sm text-gray-400">
                      {{ user.firstName }} {{ user.lastName }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Posts Section -->
              <div
                v-if="searchResults.posts.length > 0"
                class="p-3 border-t border-gray-700"
              >
                <h3 class="text-fuchsia-500 font-medium mb-2">Posts</h3>
                <div
                  v-for="post in searchResults.posts"
                  :key="post._id"
                  class="p-2 hover:bg-[rgba(48,48,48,0.5)] rounded-lg cursor-pointer"
                  @mousedown.prevent="handlePostClick(post._id)"
                >
                  <p class="font-medium truncate">
                    {{ post.title || post.content.substring(0, 30) + "..." }}
                  </p>
                  <div class="flex gap-2 mt-1">
                    <span
                      v-for="tag in post.tags"
                      :key="tag"
                      class="text-xs bg-fuchsia-900 px-2 py-1 rounded-full"
                      >{{ tag }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex mr-2">
            <!-- <button
              @click="toggleWallet()"
              class="text-center mr-4 ml-3 flex cursor-pointer text-fuchsia-700 md:font-semibold text-sm bg-transparent md:px-1 md:py-2 rounded-full border-2 border-fuchsia-700 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200 before:rounded-full before:bg-gradient-to-r before:from-fuchsia-400 before:to-fuchsia-800 before:blur-md before:opacity-50 before:z-[-1]"
            >
              Connect Wallet
            </button> -->
          </div>
          <User
            v-if="!user.profilePic"
            class="h-7 w-7 mr-4"
            @click="makeActive('Profile')"
          />
          <img
            v-if="user.profilePic"
            :src="user.profilePic"
            alt=""
            class="h-12 w-12 mr-4"
            @click="makeActive('Profile')"
          />
        </header>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto scrollbar-hide">
          <Posts v-if="activeNav === 'Home'" />
          <Discussions v-if="activeNav === 'Discussions'" />
          <Profile v-if="activeNav === 'Profile'" />
          <Notification v-if="activeNav === 'Notifications'" />
          <UserQuestions v-if="activeNav === 'My Questions'" />
          <MySolutions v-if="activeNav === 'My Solutions'" />
          <SearchPost :qid="searchQid" v-if="activeNav === 'SearchQuestion'" />
          <ViewProfile :userId="searchUid" v-if="activeNav === 'SearchUser'" />
        </div>
      </main>

      <!-- Right Sidebar - Fixed with spacing -->
      <aside
        class="hidden md:block md:relative w-90 border-l border-gray-800 p-4 bg-black h-screen overflow-y-auto scrollbar-hide flex-shrink-0 mr-4 mt-4 mb-4 rounded-xl"
      >
        <WalletConnect />
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
import { ref, onMounted, nextTick } from "vue";
import Posts from "../components/Posts.vue";
import ComposePost from "../components/ComposePost.vue";
import Discussions from "../components/Discussions.vue";
import Notification from "../components/Notification.vue";
import UserQuestions from "../components/UserQuestions.vue";
import MySolutions from "../components/MySolutions.vue";
import WalletConnect from "../components/WalletConnect.vue";
import SearchPost from "../components/SearchPost.vue";
import ViewProfile from "../components/ViewProfile.vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fireInit";
import {
  Home,
  Flame,
  Coins,
  Bell,
  CircleCheckBig,
  CircleFadingPlus,
  Trophy,
  CircleHelp,
  Users,
  User,
} from "lucide-vue-next";
import Profile from "../components/Profile.vue";

const postDiv = ref(false);
const navItems = ref([
  { name: "Home", icon: Home },
  //{ name: "Trending", icon: TrendingUp },
  { name: "Notifications", icon: Bell },
  { name: "Discussions", icon: Users },
  { name: "My Questions", icon: CircleHelp },
  { name: "My Solutions", icon: CircleCheckBig },
]);
const notify = ref(false);
const noQuestions = ref("2,00,000");
const user = ref({
  profilePic: "",
});

// Search functionality
const searchQuery = ref("");
const showResults = ref(false);
const searchResults = ref({
  users: [],
  posts: [],
});

// Search debounce timer
let searchTimeout = null;

// Function to hide search results with a delay
const hideSearchResults = () => {
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const handleSearch = () => {
  clearTimeout(searchTimeout);

  // Skip search if query is too short
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = { users: [], posts: [] };
    return;
  }

  searchTimeout = setTimeout(async () => {
    await Promise.all([searchUsers(), searchPosts()]);
  }, 300); // 300ms debounce
};

const searchUsers = async () => {
  try {
    // Get Firestore instance

    // Fetch users with role="user" from Firebase
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "user"));
    const querySnapshot = await getDocs(q);

    const firebaseUsers = [];
    const userIds = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      // Filter by search query on the client side
      if (
        searchQuery.value &&
        (userData.username
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
          userData.firstName
            ?.toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          userData.lastName
            ?.toLowerCase()
            .includes(searchQuery.value.toLowerCase()))
      ) {
        firebaseUsers.push({
          _id: doc.id,
          username: userData.username || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
        });
        userIds.push(doc.id);
      }
    });
    //console.log(userIds);

    // If we have matching users, fetch their additional data from MongoDB
    if (userIds.length > 0) {
      // Fetch additional user data from backend using the UIDs
      const response = await fetch("/api/getUsersData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uids: userIds }),
      });

      if (response.ok) {
        const { users: mongoUsers } = await response.json();

        // Merge data from both sources
        searchResults.value.users = firebaseUsers
          .map((fbUser) => {
            const mongoUser = mongoUsers.find(
              (mUser) => mUser.uid === fbUser._id
            );
            return {
              ...fbUser,
              profilePic: mongoUser?.profilePic || "",
              // Add any other MongoDB fields you need
            };
          })
          .slice(0, 5); // Limit to 5 results
      }
    } else {
      searchResults.value.users = [];
    }
  } catch (error) {
    console.error("Error searching users:", error);
    searchResults.value.users = [];
  }
};

const searchPosts = async () => {
  try {
    const response = await fetch(
      `/api/searchPosts?query=${encodeURIComponent(searchQuery.value)}`
    );
    if (response.ok) {
      const data = await response.json();
      searchResults.value.posts = data.posts || [];
    } else {
      console.error("Failed to search posts");
      searchResults.value.posts = [];
    }
  } catch (error) {
    console.error("Error searching posts:", error);
    searchResults.value.posts = [];
  }
};

// Original code continues
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
const searchQid = ref("");
const searchUid = ref("");

// Improved makeActive function to ensure reactivity
const makeActive = (item) => {
  activeNav.value = item;
  if (item === "Notifications") {
    notify.value = false;
  }
  //console.log("Active nav set to:", activeNav.value);
};
const setUserID = async (uid) => {
  searchUid.value = uid;
  activeNav.value = "SearchUser";
  await nextTick();
  showResults.value = false;
};
// New function to handle post clicks from search results
const handlePostClick = async (qid) => {
  console.log("Post clicked with ID:", qid);
  searchQid.value = qid;

  // First set the active nav
  activeNav.value = "SearchQuestion";

  // Use nextTick to ensure DOM updates
  await nextTick();

  // Log for debugging
  //console.log("Changed to SearchQuestion view with QID:", searchQid.value);

  // Close the search results dropdown
  showResults.value = false;
};

const togglePost = () => {
  postDiv.value = !postDiv.value;
};

onMounted(async () => {
  try {
    const response = await fetch("/api/user");
    if (response.ok) {
      const userData = await response.json();
      user.value = {
        ...userData,
      };
      //console.log(user.value.profilePic);
    } else {
      console.error("Failed to load user data");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  await checkForSolvedQuestions();
  // Call the function every 60 seconds
  setInterval(checkForSolvedQuestions, 60000);
});

async function checkForSolvedQuestions() {
  try {
    const response = await fetch("/api/checkForSolve");
    const data = await response.json();
    if (data.success) {
      // notify is true if a new solved question exists
      notify.value = true;
      console.log("You have a newly solved question!");
    } else {
      notify.value = false;
      //console.log("Checked for Notifications ");
    }
  } catch (error) {
    console.error("Error checking for solved questions:", error);
    return false;
  }
}
</script>

<style>
.h-screen {
  height: 100vh;
  height: 100dvh; /* For mobile browsers with dynamic viewports */
}

/* Hide scrollbars but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Ensure content doesn't overflow on small screens */
@media (max-width: 768px) {
  .md\:relative {
    position: absolute;
  }
}
</style>

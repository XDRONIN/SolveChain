<script setup>
import { ref, onMounted, watch } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../fireInit";

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const user = ref({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  areaOfInterest: "",
  fieldOfExpertise: "",
  profilePic: "",
  certs: [],
  solved: 0,
  stars: 0,
  verified: false,
  followers: [],
  following: [],
  createdAt: "",
  role: "",
});

const message = ref("");
const isLoading = ref(true);

const loadUserData = async () => {
  if (!props.userId) {
    message.value = "User ID is required";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  message.value = "";

  try {
    // First get the basic user data from Firestore
    const userDocRef = doc(db, "users", props.userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Get data from Firestore
      const userData = userDoc.data();
      console.log("Firebase user data:", userData);

      // Make sure certs is initialized as an array if it doesn't exist
      if (!userData.certs) {
        userData.certs = [];
      }

      // Update the user ref with Firebase data
      user.value = { ...user.value, ...userData };
    } else {
      message.value = "User not found in Firestore";
      console.warn(`No user found with UID: ${props.userId}`);
      isLoading.value = false;
      return;
    }

    // Now fetch additional data from the API
    try {
      const response = await fetch(`/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: props.userId }),
        credentials: "include",
      });

      if (response.ok) {
        const apiData = await response.json();
        console.log("API user data:", apiData);

        // Handle certifications specifically - ensure we have the certs array
        if (apiData.certs && Array.isArray(apiData.certs)) {
          user.value.certs = apiData.certs;
        }

        // Update the rest of the user data
        user.value = {
          ...user.value,
          ...apiData,
          // Keep the certs we already set
          certs: user.value.certs,
        };

        console.log("Combined user data with certs:", user.value);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.warn("API fetch failed:", errorData.error);
        message.value = errorData.error || "Failed to load user metadata";
      }
    } catch (apiError) {
      console.error("API error:", apiError);
      message.value = `API error: ${apiError.message}`;
    }
  } catch (error) {
    message.value = `An error occurred loading user: ${error.message}`;
    console.error("User loading error:", error);
  } finally {
    isLoading.value = false;
  }
};

const followUser = async () => {
  try {
    const response = await fetch(`/api/user/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetUserId: props.userId }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      message.value = data.message || "Followed user successfully";
      // Reload user data to get updated followers count
      loadUserData();
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      message.value = errorData.error || "Failed to follow user";
    }
  } catch (error) {
    message.value = "Error following user";
    console.error(error);
  }
};

const addStar = async () => {
  try {
    const response = await fetch(`/api/user/star`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: props.userId }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      message.value = data.message || "Star added successfully";
      // Update the local star count and reload data
      user.value.stars += 1;
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      message.value = errorData.error || "Failed to add star";
    }
  } catch (error) {
    message.value = "Error adding star";
    console.error(error);
  }
};

// Get the filename from a URL
const getFilenameFromUrl = (url) => {
  if (!url) return "Certificate";

  // Try to extract a filename from the URL
  const parts = url.split("/");
  const filename = parts[parts.length - 1];

  // Remove query parameters if they exist
  const cleanName = filename.split("?")[0];

  // Decode URI component to handle encoded characters
  try {
    return decodeURIComponent(cleanName) || "Certificate";
  } catch (e) {
    return cleanName || "Certificate";
  }
};

// Load user data when component mounts or userId changes
onMounted(() => {
  loadUserData();
});

// Also watch for changes to the userId prop
watch(
  () => props.userId,
  (newUserId, oldUserId) => {
    if (newUserId !== oldUserId) {
      loadUserData();
    }
  }
);
</script>

<template>
  <div
    class="backdrop-blur-md backdrop-saturate-150 bg-opacity-50 bg-gray-900 border border-gray-700 rounded-xl text-white p-6 max-w-4xl mx-auto my-8"
  >
    <div v-if="isLoading" class="flex justify-center p-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"
      ></div>
    </div>

    <div v-else-if="!props.userId" class="text-center p-8">
      <p class="text-lg text-red-400">User ID is required</p>
    </div>

    <template v-else>
      <div
        class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8"
      >
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="relative">
            <div
              class="w-24 h-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-fuchsia-500"
            >
              <img
                v-if="user.profilePic"
                :src="user.profilePic"
                alt="Profile Picture"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-4xl text-gray-400">
                {{ user.firstName ? user.firstName[0].toUpperCase() : ""
                }}{{ user.lastName ? user.lastName[0].toUpperCase() : "" }}
              </span>
            </div>
          </div>

          <div>
            <h1 class="text-2xl font-bold">
              {{ user.firstName || "First Name" }}
              {{ user.lastName || "Last Name" }}
              <span
                v-if="user.verified"
                class="inline-block ml-2 text-fuchsia-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </h1>
            <p class="text-gray-400">@{{ user.username || "Username" }}</p>
          </div>
        </div>

        <div class="mt-4 md:mt-0 grid grid-cols-2 gap-4">
          <div class="bg-gray-800 p-3 rounded-lg text-center">
            <p class="text-xl font-bold text-fuchsia-400">
              {{ user.solved || 0 }}
            </p>
            <p class="text-sm text-gray-400">Problems Solved</p>
          </div>
          <div class="bg-gray-800 p-3 rounded-lg text-center">
            <p class="text-xl font-bold text-fuchsia-400">
              {{ user.stars || 0 }}
            </p>
            <p class="text-sm text-gray-400">Stars</p>
          </div>
        </div>
      </div>

      <div
        v-if="message"
        class="mb-6 p-3 rounded-md"
        :class="
          message.includes('Error') || message.includes('Failed')
            ? 'bg-red-900 bg-opacity-40'
            : 'bg-green-900 bg-opacity-40'
        "
      >
        {{ message }}
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-fuchsia-300">
          Personal Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-400 mb-1">First Name</label>
            <p class="text-gray-300">{{ user.firstName || "Not specified" }}</p>
          </div>
          <div>
            <label class="block text-gray-400 mb-1">Last Name</label>
            <p class="text-gray-300">{{ user.lastName || "Not specified" }}</p>
          </div>
          <div>
            <label class="block text-gray-400 mb-1">Username</label>
            <p class="text-gray-300">{{ user.username || "Not specified" }}</p>
          </div>
          <div>
            <label class="block text-gray-400 mb-1">Email</label>
            <p class="text-gray-300">{{ user.email || "Not specified" }}</p>
          </div>
          <div>
            <label class="block text-gray-400 mb-1">Area of Interest</label>
            <p class="text-gray-300">
              {{ user.areaOfInterest || "Not specified" }}
            </p>
          </div>
          <div>
            <label class="block text-gray-400 mb-1">Field of Expertise</label>
            <p class="text-gray-300">
              {{ user.fieldOfExpertise || "Not specified" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Certifications Section -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-fuchsia-300">
          Certifications
        </h2>

        <!-- Debug info for development -->
        <pre
          v-if="false"
          class="text-xs text-white bg-gray-800 p-2 mb-4 overflow-auto"
        >
          {{ JSON.stringify(user.certs, null, 2) }}
        </pre>

        <!-- When we have certifications -->
        <div
          v-if="user.certs && user.certs.length > 0"
          class="grid grid-cols-1 gap-4"
        >
          <div
            v-for="(certUrl, index) in user.certs"
            :key="index"
            class="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-fuchsia-400 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>

              <a
                :href="certUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-fuchsia-400 hover:text-fuchsia-300 flex-grow truncate"
              >
                View Cerification
              </a>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                />
                <path
                  d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- When we have no certifications -->
        <p v-else class="text-gray-400 italic">No certifications found</p>
      </div>

      <div class="flex gap-4">
        <button
          @click="followUser"
          class="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors"
        >
          Follow
        </button>
        <button
          @click="addStar"
          class="bg-yellow-500 hover:bg-yellow-400 text-white py-2 px-4 rounded-md transition-colors"
        >
          Add Star
        </button>
      </div>
    </template>
  </div>
</template>

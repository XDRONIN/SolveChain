<template>
  <div class="bg-gray-900 w-230 rounded-2xl">
    <!-- Question heading -->
    <div v-if="queDetails.queBody" class="p-4 border-b border-gray-700">
      <h2 class="text-xl font-semibold text-white">{{ queDetails.queBody }}</h2>
    </div>

    <div class="flex space-x-4 mt-4 relative left-185">
      <button
        @click="joinDiscussion"
        class="w-40 flex cursor-pointer p-3 text-center align-middle justify-center text-white font-semibold bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-fuchsia-800 hover:to-fuchsia-500"
      >
        {{ isUserMember ? "Joined" : "Join Discussion" }}
      </button>

      <!-- Request Reward button - only visible to author when question is solved -->
      <button
        v-if="isAuthor && hasSolvedMessage && !rewardRequested"
        @click="requestReward"
        class="w-40 fixed left-265 flex cursor-pointer p-3 text-center align-middle justify-center text-white font-semibold bg-gradient-to-r from-green-500 to-green-800 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-green-800 hover:to-green-500"
      >
        Request Reward
      </button>
      <div
        v-if="isAuthor && rewardRequested"
        class="fixed left-265 p-2 text-sm text-green-400 font-medium"
      >
        Reward requested!
      </div>
    </div>

    <div class="p-4 h-174 overflow-y-auto" ref="messagesContainer">
      <div v-if="messages.length === 0" class="text-gray-400 text-center mt-20">
        No messages yet. Start the conversation!
      </div>

      <div v-else class="space-y-4">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <div
            :class="[
              message.username === username
                ? 'ml-auto bg-gray-800 text-white'
                : isAuthorMessage(message)
                ? 'bg-blue-900 text-white'
                : 'bg-gray-700 text-gray-200',
              message.solved ? 'border-2 border-green-500' : '',
            ]"
            class="max-w-3/4 p-3 rounded-lg relative"
          >
            <div class="font-semibold flex items-center justify-between">
              <div class="flex items-center">
                {{ message.username }}
                <span
                  v-if="isAuthorMessage(message)"
                  class="ml-2 text-xs bg-fuchsia-700 px-2 py-1 rounded"
                  >Author</span
                >
              </div>
              <button
                @click="viewProfile(message.username)"
                class="text-xs bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded ml-2"
              >
                View Profile
              </button>
            </div>
            <div>{{ message.msg }}</div>

            <!-- Media files display -->
            <div
              v-if="message.media && message.media.length > 0"
              class="mt-2 grid grid-cols-2 gap-1"
            >
              <div
                v-for="(file, fileIndex) in message.media"
                :key="fileIndex"
                class="media-item mt-2"
              >
                <!-- Images with proper URL correction -->
                <img
                  v-if="file.contentType.includes('image')"
                  :src="getProperUrl(file.url)"
                  alt="Image"
                  class="max-w-full rounded-lg max-h-48"
                  @error="handleImageError"
                />

                <!-- Video with proper URL correction -->
                <video
                  v-else-if="file.contentType.includes('video')"
                  controls
                  class="max-w-full rounded-lg max-h-48"
                >
                  <source
                    :src="getProperUrl(file.url)"
                    :type="file.contentType"
                  />
                  Your browser does not support the video tag.
                </video>

                <!-- Audio with proper URL correction -->
                <audio
                  v-else-if="file.contentType.includes('audio')"
                  controls
                  class="max-w-full"
                >
                  <source
                    :src="getProperUrl(file.url)"
                    :type="file.contentType"
                  />
                  Your browser does not support the audio tag.
                </audio>

                <!-- Other file types with proper URL correction -->
                <a
                  v-else
                  :href="getProperUrl(file.url)"
                  target="_blank"
                  class="text-blue-400 underline flex items-center"
                >
                  <span class="mr-2">{{ getFileNameFromUrl(file.url) }}</span>
                  <span class="text-xs"
                    >({{ formatFileType(file.contentType) }})</span
                  >
                </a>
              </div>
            </div>

            <div class="text-xs opacity-70">
              {{ formatTimestamp(message.time) }}
            </div>

            <!-- Mark as solution button for author -->
            <button
              v-if="isAuthor && !message.solved && !hasSolvedMessage"
              @click="markAsSolved(index)"
              class="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-500"
            >
              Mark as Solution
            </button>

            <!-- Solution badge -->
            <div
              v-if="message.solved"
              class="absolute top-3 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded mr-25"
            >
              Solution ✓
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col bottom-4 w-230 px-2 pt-4">
      <!-- Selected files preview -->
      <div
        v-if="selectedFiles.length > 0"
        class="mb-2 p-2 bg-blue-950 rounded-lg absolute top-180"
      >
        <div class="text-sm text-gray-300 mb-1">
          Selected files: {{ selectedFiles.length }}
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="relative"
          >
            <div
              class="bg-gray-700 px-2 py-1 rounded text-xs text-gray-200 flex items-center"
            >
              <span class="truncate max-w-32">{{ file.name }}</span>
              <button
                @click="removeSelectedFile(index)"
                class="ml-2 text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex relative -top-15">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessageHandler"
          type="text"
          placeholder="Send Message"
          :disabled="!isUserMember"
          class="w-full rounded-full pr-13 backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-3 outline-none"
        />
        <input
          type="file"
          ref="fileInput"
          multiple
          @change="handleFileSelection"
          class="hidden"
        />
        <button @click="triggerFileInput" class="relative right-10">
          <Paperclip />
        </button>
        <button
          @click="sendMessageHandler"
          :disabled="!isUserMember || isUploading"
          class="rounded-full p-5 flex justify-center align-middle"
          :class="
            isUserMember && !isUploading
              ? 'bg-blue-950 cursor-pointer'
              : 'bg-gray-700 cursor-not-allowed'
          "
        >
          <Send v-if="!isUploading" />
          <div
            v-else
            class="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          ></div>
        </button>
      </div>
    </div>

    <!-- View Profile Modal -->
    <div
      v-if="showProfile"
      class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="relative bg-transparent rounded-lg p-4 max-w-fit w-full max-h-screen overflow-y-auto overflow-x-hidden"
      >
        <button
          @click="closeProfile"
          class="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold"
        >
          X
        </button>
        <ViewProfile :userId="selectedUserId" :dId="props.qid" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Send, Paperclip } from "lucide-vue-next";
import ViewProfile from "./ViewProfile.vue";
import {
  collection,
  doc,
  query,
  where,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../fireInit";
import { ref, onMounted, nextTick, watch, onUnmounted, computed } from "vue";

const props = defineProps({ qid: String });
const uid = ref(null);
const username = ref("Anonymous"); // This should come from your user profile
const messages = ref([]);
const newMessage = ref("");
const isUserMember = ref(false);
const messagesContainer = ref(null);
const discussionDoc = ref(null);
const fileInput = ref(null);
const selectedFiles = ref([]);
const isUploading = ref(false);
const rewardRequested = ref(false); // Track if reward has been requested
const baseUrl = "http://localhost:5000"; // Get the current base URL of the application
let unsubscribe = null;
let queDetails = ref({});

// Profile viewing state
const showProfile = ref(false);
const selectedUserId = ref(null);

// Check if current user is the author
const isAuthor = computed(() => {
  if (!uid.value || !queDetails.value || !queDetails.value.author) return false;
  return uid.value === queDetails.value.author;
});

// Check if any message is already marked as solved
const hasSolvedMessage = computed(() => {
  return messages.value.some((message) => message.solved);
});

// Find the solved message username
const getSolvedMessageUsername = () => {
  const solvedMessage = messages.value.find((message) => message.solved);
  return solvedMessage ? solvedMessage.username : null;
};

// Request reward function
async function requestReward() {
  try {
    const solvedUsername = getSolvedMessageUsername();

    if (!solvedUsername) {
      console.error("No solved message found");
      return;
    }

    const response = await fetch("/api/requestReward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qid: props.qid,
        username: solvedUsername,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Reward requested successfully:", data);
      rewardRequested.value = true;
    } else {
      console.error("Error requesting reward:", data.error);
    }
  } catch (error) {
    console.error("Error requesting reward:", error);
  }
}

// Check if a message is from the author
function isAuthorMessage(message) {
  if (!queDetails.value || !queDetails.value.username) return false;
  return message.username === queDetails.value.username;
}

// View profile function
async function viewProfile(messageUsername) {
  try {
    const userId = await getUserIdByUsername(messageUsername);
    if (userId) {
      selectedUserId.value = userId;
      showProfile.value = true;
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.error("Error viewing profile:", error);
  }
}

// Close profile modal
function closeProfile() {
  showProfile.value = false;
  selectedUserId.value = null;
}

// Mark a message as solved
async function markAsSolved(index) {
  if (!isAuthor.value || !discussionDoc.value) return;

  try {
    // Create a copy of the messages array with the specific message marked as solved
    const updatedMessages = [...messages.value];
    updatedMessages[index] = {
      ...updatedMessages[index],
      solved: true,
    };
    markDissAsSolved(props, updatedMessages, index);
    //console.log(updatedMessages[index].username);

    // Update the document with the new messages array
    await updateDoc(discussionDoc.value, {
      messages: updatedMessages,
    });

    console.log("Message marked as solved:", index);
    markQuestionAsSolved(props.qid);
  } catch (error) {
    console.error("Error marking message as solved:", error);
  }
}
async function markDissAsSolved(props, updatedmessages, index) {
  //console.log(props.qid, updatedmessages.)
  const uid = await getUserIdByUsername(updatedmessages[index].username);
  const response = await fetch("/api/markDissSolved", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quid: props.qid,
      uid: uid,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Successfully updated:", data.message);
  } else {
    console.error("Error:", data.error);
  }
}
// Function to get _id (document ID) by username
async function getUserIdByUsername(username) {
  const usersRef = collection(db, "users"); // assuming your collection is named "users"
  const q = query(usersRef, where("username", "==", username));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return null;
  }

  // Assuming usernames are unique, return the first matching document ID
  return querySnapshot.docs[0].id;
}
// Format timestamp to readable time
function formatTimestamp(timestamp) {
  if (!timestamp) return "";

  try {
    // Handle Firestore Timestamp, regular Date object, or string date
    let date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp.seconds && timestamp.nanoseconds) {
      // Handle Firestore timestamp that was converted to a plain object
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "";
  }
}

// Helper to extract filename from URL
function getFileNameFromUrl(url) {
  if (!url) return "file";
  const parts = url.split("/");
  return parts[parts.length - 1];
}

// Format file type for display
function formatFileType(contentType) {
  if (!contentType) return "FILE";
  return contentType.split("/")[1].toUpperCase();
}

// Process URL to ensure it's correctly formatted for the browser
function getProperUrl(url) {
  if (!url) return "";

  // Check if URL starts with '/' for server root
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }

  // Otherwise assume it's relative to the current URL
  return `${baseUrl}/${url}`;
}

// Handle image loading errors
function handleImageError(event) {
  console.error("Image failed to load:", event.target.src);
  // You can set a fallback image if needed
  event.target.src = "/path/to/fallback-image.png";
  // Or add a class to show custom styling
  event.target.classList.add("image-error");
}

// Trigger file input click
function triggerFileInput() {
  if (!isUserMember.value) return;
  fileInput.value.click();
}

// Handle file selection
function handleFileSelection(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  // Add files to selectedFiles array
  for (let i = 0; i < files.length; i++) {
    // Limit to 5 files
    if (selectedFiles.value.length < 5) {
      selectedFiles.value.push(files[i]);
    } else {
      alert("Maximum 5 files allowed");
      break;
    }
  }

  // Reset file input
  event.target.value = null;
}

// Remove selected file
function removeSelectedFile(index) {
  selectedFiles.value.splice(index, 1);
}

// Upload files to server
async function uploadFiles() {
  if (selectedFiles.value.length === 0) return [];

  isUploading.value = true;

  try {
    const formData = new FormData();

    selectedFiles.value.forEach((file) => {
      formData.append("media", file);
    });

    // For debugging
    console.log(
      "Uploading files:",
      selectedFiles.value.map((f) => f.name)
    );

    const response = await fetch("/api/uploadMedia", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Upload response error:", errorData);
      throw new Error(errorData.message || "Upload failed");
    }

    const data = await response.json();
    console.log("Upload response:", data);

    // Ensure the mediaFiles array has the correct structure
    return data.mediaFiles || [];
  } catch (error) {
    console.error("Error uploading files:", error);
    return [];
  } finally {
    isUploading.value = false;
    selectedFiles.value = [];
  }
}

// Scroll to the bottom of messages
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

// Send message function
async function sendMessageHandler() {
  if (
    (!newMessage.value.trim() && selectedFiles.value.length === 0) ||
    !isUserMember.value ||
    !uid.value
  )
    return;

  try {
    // Upload files first if any
    const mediaFiles = await uploadFiles();
    console.log("Media files to store:", mediaFiles);

    const discussionRef = doc(collection(db, "Discussions"), props.qid);

    // Get current messages
    const docSnap = await getDoc(discussionRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Check if user is allowed to send messages
      if (!data.users.includes(uid.value)) {
        console.error("User not authorized to send messages");
        return;
      }

      // Create new message according to your schema
      const messageObj = {
        username: username.value,
        msg: newMessage.value.trim(),
        time: new Date(),
        solved: false,
        media: mediaFiles,
      };

      // For debugging
      console.log("Saving message with media:", messageObj);

      // Add message to existing messages array
      const updatedMessages = [...(data.messages || []), messageObj];

      // Update the document with the new messages array
      await updateDoc(discussionRef, {
        messages: updatedMessages,
      });

      newMessage.value = ""; // Clear input after sending
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Join discussion function

// Updated joinDiscussion function with permission check
async function joinDiscussion() {
  if (!uid.value) return;

  try {
    // Get the author ID
    const authorId = queDetails.value.author;

    // Check if user can join the discussion
    const response = await fetch("/api/checkUserJoin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid.value,
        qid: props.qid,
        authorId: authorId,
      }),
    });
    console.log(uid.value, props.qid, queDetails.value.author);
    const result = await response.json();

    if (result.canJoin) {
      // User has permission, add them to the discussion
      await updateDoc(discussionDoc.value, {
        users: arrayUnion(uid.value),
      });
      isUserMember.value = true;
      await addDiss(props.qid);
    } else {
      // User doesn't have permission
      console.log("You don't have permission to join this discussion");
      // Optionally show a notification to the user
    }
  } catch (error) {
    console.error("Error joining discussion:", error);
  }
}
async function addDiss(qid) {
  try {
    const response = await fetch("/api/addDissToUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qid }),
    });
    console.log(qid);

    const data = await response.json();
    if (response.ok) {
      console.log("Discussion Added");
    }
  } catch (error) {}
}
// Initialize or get discussion document
async function initDiscussion() {
  if (!props.qid) {
    console.error("Question ID is required");
    return;
  }

  const discussionRef = doc(collection(db, "Discussions"), props.qid);
  discussionDoc.value = discussionRef;

  try {
    const docSnap = await getDoc(discussionRef);
    console.log(queDetails.value.author);

    // Create a new document if it doesn't exist
    if (!docSnap.exists()) {
      await setDoc(discussionRef, {
        _id: props.qid,
        users: [queDetails.value.author],
        messages: [],
      });
      console.log("Created new discussion document");
    }

    // Check if current user is a member
    if (uid.value) {
      const data = docSnap.exists() ? docSnap.data() : { users: [] };
      isUserMember.value = data.users.includes(uid.value);
    }

    // Set up real-time listener for messages
    unsubscribe = onSnapshot(discussionRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();

        // For debugging
        //console.log("Received updated document:", data);

        messages.value = data.messages || [];

        // Update membership status
        if (uid.value) {
          isUserMember.value = data.users.includes(uid.value);
        }

        scrollToBottom();
      }
    });
  } catch (error) {
    console.error("Error initializing discussion:", error);
  }
}

// Fetch user ID and username
async function fetchUserInfo() {
  try {
    const response = await fetch("/api/fetchUid", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      uid.value = data.userId;
      username.value = data.username || `User-${uid.value.substring(0, 5)}`;
      //console.log("User ID:", uid.value);

      // Initialize discussion after getting UID
      await initDiscussion();
    } else {
      console.error("Error fetching user info:", data.error);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

async function fetchAuthorByQid(qid) {
  try {
    const response = await fetch("/api/addAuthor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qid }),
    });

    if (!response.ok) throw new Error("Failed to fetch author");

    const data = await response.json();
    //console.log("Author info:", data);
    return data; // { author, username, queBody }
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
}

// Watch for changes in messages to scroll to bottom
watch(messages, () => {
  scrollToBottom();
});

onMounted(async () => {
  queDetails.value = await fetchAuthorByQid(props.qid);
  await fetchUserInfo();

  // Check if reward has already been requested for this question
  checkRewardStatus();
});

// Check if a reward has already been requested for this question
async function checkRewardStatus() {
  try {
    const response = await fetch(`/api/checkRewardStatus?qid=${props.qid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok && data.exists) {
      rewardRequested.value = true;
    }
  } catch (error) {
    console.error("Error checking reward status:", error);
  }
}

// Clean up listener when component is unmounted
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
  updateLastViewed(props.qid);
});
async function markQuestionAsSolved(qid) {
  try {
    const response = await fetch("/api/setSolved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qid }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update question");
    }

    return data;
  } catch (err) {
    console.error("Error setting question as solved:", err.message);
    return { success: false, message: err.message };
  }
}
const updateLastViewed = async (Id) => {
  try {
    const dissId = Id;
    const response = await fetch("/api/updateLastViewed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dissId }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    await response.json();
  } catch (error) {
    console.error("Failed to update lastViewed timestamp:", error);
    throw error;
  }
};
</script>

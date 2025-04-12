<template>
  <div class="bg-gray-900 w-230 rounded-2xl">
    <button
      class="mt-4 w-40 flex cursor-pointer p-3 text-center align-middle justify-center relative left-185 text-white font-semibold bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-fuchsia-800 hover:to-fuchsia-500"
      @click="joinDiscussion(props.qid)"
    >
      Join Discussion
    </button>

    <div class="p-4 h-174 overflow-y-auto">
      <div
        v-if="messages.length === 0 && loading === false"
        class="text-gray-400 text-center mt-20"
      >
        No messages yet. Start the conversation!
      </div>
      <div v-if="loading === true" class="text-gray-400 text-center mt-20">
        Loading messages
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'p-3 rounded-lg max-w-4/5 break-words',
            message.username === currentUser
              ? 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-800 text-white ml-auto'
              : 'bg-gray-700 text-white',
          ]"
        >
          <div class="flex justify-between mb-1">
            <span class="font-bold text-sm">{{ message.username }}</span>
            <span class="text-xs opacity-70">{{
              formatTime(message.time)
            }}</span>
          </div>
          <p>{{ message.msg }}</p>

          <div v-if="message.media && message.media.length > 0" class="mt-2">
            <div
              v-for="(media, mediaIndex) in message.media"
              :key="mediaIndex"
              class="mt-1"
            >
              <img
                v-if="media.contentType.startsWith('image')"
                :src="media.url"
                class="rounded max-w-full h-auto"
                alt="Shared image"
              />
              <div
                v-else
                class="p-2 bg-gray-800 rounded cursor-pointer flex items-center"
                @click="downloadFile(media.url)"
              >
                <span class="truncate">Attachment</span>
              </div>
            </div>
          </div>

          <div
            v-if="message.solved"
            class="mt-1 text-xs flex items-center text-green-300"
          >
            <span>✓ Solved</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex bottom-4 w-230 px-2 pt-4">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Send Message"
        class="w-full rounded-full pr-13 backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-3 outline-none active:border-fuchsia-800"
        @keyup.enter="sendMessage"
      />
      <button class="relative right-10">
        <Paperclip />
      </button>
      <button
        class="rounded-full p-5 bg-blue-950 flex justify-center align-middle"
        @click="sendMessage"
      >
        <Send />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Send, Paperclip } from "lucide-vue-next";

const props = defineProps({
  qid: String,
});

const messages = ref([]);
const loading = ref(false);
const error = ref(null);
const currentUser = ref("User123"); // Replace with actual authenticated user
const newMessage = ref("");
let interval = null; // Store interval ID

// Format time function
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Download file function
const downloadFile = (url) => {
  window.open(url, "_blank");
};

// Fetch messages function
const fetchMessages = async () => {
  if (!props.qid) return;
  loading.value = true;
  console.log("LOADING");
  error.value = null;

  try {
    const response = await fetch(`/api/fetchMessages?qid=${props.qid}`);
    if (!response.ok) {
      throw new Error(`Error fetching messages: ${response.statusText}`);
    }
    const data = await response.json();
    messages.value = data.messages || [];

    setTimeout(() => {
      const container = document.querySelector(".overflow-y-auto");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
    console.log("LOADED");
  }
};
// Join discussion function
const joinDiscussion = async (qid) => {
  if (!qid) return;

  try {
    const response = await fetch("/api/joinDiscussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qid }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message); // Success message
      fetchMessages(qid); // Refresh messages after joining
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

// Send message function
const sendMessage = async () => {
  if (!newMessage.value.trim() || !props.qid) return;

  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qid: props.qid,
        message: newMessage.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error sending message: ${response.statusText}`);
    }

    // Clear input field after successful send
    newMessage.value = "";

    // Refresh messages to see the new one
    fetchMessages(props.qid);
  } catch (err) {
    console.error("Failed to send message:", err);
    error.value = err.message;
    alert("Join The Discussion to send messages");
  }
};

// Watch for qid changes
watch(
  () => props.qid,
  (newQid) => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    if (newQid) {
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
  },
  { immediate: true } // Ensures it runs on mount too
);

// Cleanup interval when component unmounts
onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
});
</script>

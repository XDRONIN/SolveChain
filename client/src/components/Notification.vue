<template>
  <div
    v-if="disc"
    class="bg-black/90 min-h-full fixed flex z-20 inset-0 justify-center align-middle p-5"
    @click="showDisc"
  >
    <Discussion :qid="currentQid" @click.stop="" />
  </div>

  <div
    class="max-w-2xl mx-auto p-4 mt-6 rounded-2xl backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] text-white shadow-xl"
  >
    <h2 class="text-2xl font-bold text-fuchsia-400 mb-4">Notifications</h2>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <template v-else>
      <div v-if="newNotifications.length">
        <h3 class="text-lg text-fuchsia-300 mb-2">New</h3>
        <ul class="space-y-3 mb-4">
          <li
            v-for="(note, index) in newNotifications"
            @click="setQid(note.source)"
            :key="'new-' + index"
            class="p-3 rounded-lg bg-gray-900/60 border border-fuchsia-700"
          >
            <p class="text-sm text-gray-300">{{ note.msg }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatDate(note.createdAt) }}
            </p>
          </li>
        </ul>
      </div>

      <div v-if="oldNotifications.length">
        <h3 class="text-lg text-gray-400 mb-2">Earlier</h3>
        <ul class="space-y-3">
          <li
            v-for="(note, index) in oldNotifications"
            @click="setQid(note.source)"
            :key="'old-' + index"
            class="p-3 rounded-lg bg-gray-800/40 border border-gray-600"
          >
            <p class="text-sm text-gray-300">{{ note.msg }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatDate(note.createdAt) }}
            </p>
          </li>
        </ul>
      </div>

      <div
        v-if="!newNotifications.length && !oldNotifications.length"
        class="text-gray-500 mt-4"
      >
        No notifications.
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Discussion from "./Discussion.vue";

const userId = "your_user_id"; // replace this with actual user id, maybe from auth

const notifications = ref([]);
const lastView = ref(null);
const loading = ref(true);
const disc = ref("");
const currentQid = ref("");

const newNotifications = ref([]);
const oldNotifications = ref([]);

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

async function fetchNotifications() {
  try {
    await fetch("/api/checkSolvedNotify", {
      method: "POST",
      credentials: "include",
    }); // solve check first

    const res = await fetch(`/api/getNotifications?userId=${userId}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      notifications.value = data.data.notificationDetails;
      lastView.value = new Date(data.data.lastView);

      newNotifications.value = notifications.value.filter(
        (n) => new Date(n.createdAt) > lastView.value
      );
      oldNotifications.value = notifications.value.filter(
        (n) => new Date(n.createdAt) <= lastView.value
      );
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
  } finally {
    loading.value = false;
  }
}

async function updateSeen() {
  try {
    await fetch("/api/updateSeen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId }),
    });
  } catch (err) {
    console.error("Error updating seen timestamp:", err);
  }
}
const showDisc = () => {
  disc.value = !disc.value;
  currentQid.value = "";
};
const setQid = (qid) => {
  disc.value = !disc.value;
  currentQid.value = qid;

  //console.log("skdnjosndonf");
};

onMounted(() => {
  fetchNotifications();
});

onUnmounted(() => {
  updateSeen();
});
</script>

<style scoped>
/* optional: subtle animation on mount */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
li {
  animation: fadeInUp 0.3s ease both;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../fireInit";

const verificationRequests = ref([]);
const loading = ref(true);
const error = ref(null);
function viewCert(certUrl) {
  window.open(certUrl, "_blank");
}

// Fetch verification requests and user data
async function fetchVerificationRequests() {
  try {
    loading.value = true;

    const response = await fetch("/api/getVrequests");

    if (!response.ok) {
      throw new Error("Failed to fetch verification requests");
    }

    const data = await response.json();
    const users = data.users;

    if (!users || users.length === 0) {
      verificationRequests.value = [];
      return;
    }

    const userRequests = [];

    for (const { uid, profilepic, certs, followers, solved } of users) {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const request = {
            uid,
            username: userData.username || "Unknown",
            profilePic:
              profilepic || userData.profilePic || "/placeholder-avatar.png",
            name:
              `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
              "Unknown",
            areaOfInterest: userData.areaOfInterest || "Not specified",
            createdAt: userData.createdAt?.toDate?.() || new Date(),
            certs: certs || [],
            followers: followers || [],
            solved: solved || 0,
          };
          userRequests.push(request);
        } else {
          console.warn(`User document not found for UID: ${uid}`);
        }
      } catch (userError) {
        console.error(`Error fetching user data for UID ${uid}:`, userError);
      }
    }

    verificationRequests.value = userRequests;
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching verification requests:", err);
  } finally {
    loading.value = false;
  }
}

async function approveRequest(uid) {
  try {
    const response = await fetch("/api/approveVerification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });

    if (!response.ok) throw new Error("Failed to approve verification");

    verificationRequests.value = verificationRequests.value.filter(
      (req) => req.uid !== uid
    );
  } catch (err) {
    console.error("Error approving request:", err);
  }
}

async function rejectRequest(uid) {
  try {
    const response = await fetch("/api/rejectVerification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });

    if (!response.ok) throw new Error("Failed to reject verification");

    verificationRequests.value = verificationRequests.value.filter(
      (req) => req.uid !== uid
    );
  } catch (err) {
    console.error("Error rejecting request:", err);
  }
}

function viewCerts(request) {
  if (request.certs.length > 0) {
    window.open(request.certs[0], "_blank");
  }
}

onMounted(() => {
  fetchVerificationRequests();
});
</script>

<template>
  <div
    class="verification-container backdrop-blur-md bg-black p-10 shadow-xl border border-fuchsia-500/30 min-h-screen w-screen overflow-x-hidden"
  >
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-2 text-fuchsia-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
      Verification Requests
    </h2>

    <div v-if="loading" class="flex justify-center my-8">
      <div
        class="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="error" class="bg-red-500/20 text-red-200 p-4 rounded-lg">
      {{ error }}
    </div>

    <div
      v-else-if="verificationRequests.length === 0"
      class="text-center py-8 text-gray-400"
    >
      No verification requests pending
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="request in verificationRequests"
        :key="request.uid"
        class="bg-gray-900/70 rounded-lg p-4 border border-gray-700 hover:border-fuchsia-500/50 transition-all duration-300"
      >
        <div class="flex items-center space-x-3 mb-3">
          <img
            :src="request.profilePic"
            alt="Profile"
            class="w-12 h-12 rounded-full object-cover border-2 border-fuchsia-500"
          />
          <div>
            <h3 class="font-medium text-white">{{ request.name }}</h3>
            <p class="text-gray-400 text-sm">@{{ request.username }}</p>
          </div>
        </div>

        <div class="mb-3">
          <span class="text-xs text-gray-500">Area of Interest</span>
          <p class="text-fuchsia-300">{{ request.areaOfInterest }}</p>
        </div>

        <div class="text-sm text-gray-300 space-y-1 mb-2">
          <p>
            <span class="font-medium text-white">Followers:</span>
            {{ request.followers.length }}
          </p>
          <p>
            <span class="font-medium text-white">Solved:</span>
            {{ request.solved }}
          </p>
        </div>

        <div v-if="request.certs.length > 0" class="mb-3 space-y-2">
          <div v-for="(cert, index) in request.certs" :key="index">
            <button
              @click="viewCert(cert)"
              class="text-xs w-full px-3 py-1 text-fuchsia-300 hover:bg-fuchsia-600/10 rounded-md transition-all text-left"
            >
              View Certificate {{ index + 1 }}
            </button>
          </div>
        </div>

        <div class="flex justify-between mt-4">
          <button
            @click="approveRequest(request.uid)"
            class="px-3 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-md text-sm transition-colors"
          >
            Approve
          </button>
          <button
            @click="rejectRequest(request.uid)"
            class="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded-md text-sm transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>

    <div class="mt-6 text-right">
      <button
        @click="fetchVerificationRequests"
        class="px-4 py-2 bg-fuchsia-600/80 hover:bg-fuchsia-600 text-white rounded-md flex items-center justify-center transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
    </div>
  </div>
</template>

<style scoped>
.verification-container {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(217, 70, 239, 0.5) rgba(0, 0, 0, 0.2);
}

.verification-container::-webkit-scrollbar {
  width: 6px;
}

.verification-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.verification-container::-webkit-scrollbar-thumb {
  background-color: rgba(217, 70, 239, 0.5);
  border-radius: 3px;
}
html body {
  margin: 0;
  padding: 0;
  background: #000;
}
</style>

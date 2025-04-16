<script setup>
import { ref, onMounted } from "vue";

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
});

const newCert = ref(null);
const profileImage = ref(null);
const isLoading = ref(false);
const message = ref("");

// Fetch user data from the backend
onMounted(async () => {
  try {
    const response = await fetch("/api/user");
    if (response.ok) {
      const userData = await response.json();
      user.value = {
        ...user.value,
        ...userData,
      };
      console.log(user.value.profilePic);
    } else {
      message.value = "Failed to load user data";
    }
  } catch (error) {
    message.value = "Error fetching user data";
    console.error(error);
  }
});

// Handle profile picture upload
const handleProfilePicUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePic", file);

  isLoading.value = true;
  message.value = "";

  try {
    const response = await fetch("/api/user/profile-pic", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      user.value.profilePic = data.profilePic;
      message.value = "Profile picture updated successfully";
    } else {
      message.value = "Failed to upload profile picture";
    }
  } catch (error) {
    message.value = "Error uploading profile picture";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Handle certification upload
const handleCertUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("cert", file);

  isLoading.value = true;
  message.value = "";

  try {
    const response = await fetch("/api/user/cert", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      user.value.certs = [...user.value.certs, data.certUrl];
      message.value = "Certification uploaded successfully";
      event.target.value = ""; // Clear the input
    } else {
      message.value = "Failed to upload certification";
    }
  } catch (error) {
    message.value = "Error uploading certification";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Handle user data update
const updateUserInfo = async () => {
  isLoading.value = true;
  message.value = "";

  try {
    const response = await fetch("/api/user/ppic", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        username: user.value.username,
        email: user.value.email,
        areaOfInterest: user.value.areaOfInterest,
        fieldOfExpertise: user.value.fieldOfExpertise,
      }),
    });

    if (response.ok) {
      message.value = "User information updated successfully";
    } else {
      message.value = "Failed to update user information";
    }
  } catch (error) {
    message.value = "Error updating user information";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Request verification
const requestVerification = async () => {
  isLoading.value = true;
  message.value = "";

  try {
    const response = await fetch("/api/user/request-verification", {
      method: "POST",
    });

    if (response.ok) {
      message.value = "Verification request submitted successfully";
    } else {
      message.value = "Failed to submit verification request";
    }
  } catch (error) {
    message.value = "Error submitting verification request";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Delete certification
const deleteCert = async (index) => {
  isLoading.value = true;
  message.value = "";

  try {
    const certUrl = user.value.certs[index];
    const response = await fetch("/api/user/cert", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ certUrl }),
    });

    if (response.ok) {
      user.value.certs = user.value.certs.filter((_, i) => i !== index);
      message.value = "Certification deleted successfully";
    } else {
      message.value = "Failed to delete certification";
    }
  } catch (error) {
    message.value = "Error deleting certification";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="backdrop-blur-md backdrop-saturate-150 bg-opacity-50 bg-gray-900 border border-gray-700 rounded-xl text-white p-6 max-w-4xl mx-auto my-8"
  >
    <!-- Header with Stats -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8"
    >
      <div class="flex flex-col md:flex-row items-center gap-6">
        <!-- Profile Picture Upload -->
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
              {{ user.firstName ? user.firstName[0] : ""
              }}{{ user.lastName ? user.lastName[0] : "" }}
            </span>
          </div>
          <label
            for="profile-pic-upload"
            class="absolute bottom-0 right-0 bg-fuchsia-600 rounded-full p-1 cursor-pointer hover:bg-fuchsia-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </label>
          <input
            id="profile-pic-upload"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleProfilePicUpload"
          />
        </div>

        <div>
          <h1 class="text-2xl font-bold">
            {{ user.firstName }} {{ user.lastName }}
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
          <p class="text-gray-400">@{{ user.username }}</p>
        </div>
      </div>

      <div class="mt-4 md:mt-0 grid grid-cols-2 gap-4">
        <div class="bg-gray-800 p-3 rounded-lg text-center">
          <p class="text-xl font-bold text-fuchsia-400">{{ user.solved }}</p>
          <p class="text-sm text-gray-400">Problems Solved</p>
        </div>
        <div class="bg-gray-800 p-3 rounded-lg text-center">
          <p class="text-xl font-bold text-fuchsia-400">{{ user.stars }}</p>
          <p class="text-sm text-gray-400">Stars</p>
        </div>
      </div>
    </div>

    <!-- Status Message -->
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

    <!-- User Details Form -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4 text-fuchsia-300">
        Personal Information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 mb-1">First Name</label>
          <input
            type="text"
            v-model="user.firstName"
            class="w-full p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
        <div>
          <label class="block text-gray-400 mb-1">Last Name</label>
          <input
            type="text"
            v-model="user.lastName"
            class="w-full p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
        <div>
          <label class="block text-gray-400 mb-1">Username</label>
          <input
            type="text"
            v-model="user.username"
            class="w-full p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
        <div>
          <label class="block text-gray-400 mb-1">Email</label>
          <input
            type="email"
            v-model="user.email"
            class="w-full p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
        <div>
          <label class="block text-gray-400 mb-1">Area of Interest</label>
          <input
            type="text"
            v-model="user.areaOfInterest"
            class="w-full p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
        <div>
          <label class="block text-gray-400 mb-1">Field of Expertise</label>
          <input
            type="text"
            v-model="user.fieldOfExpertise"
            class="w-full p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
      </div>
      <button
        @click="updateUserInfo"
        class="mt-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        :disabled="isLoading"
      >
        {{ isLoading ? "Saving..." : "Save Changes" }}
      </button>
    </div>

    <!-- Certifications Section -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4 text-fuchsia-300">
        Certifications
      </h2>

      <div class="flex flex-wrap gap-4 mb-4">
        <div
          v-for="(cert, index) in user.certs"
          :key="index"
          class="relative bg-gray-800 p-3 rounded-lg flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-fuchsia-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <a
            :href="cert"
            target="_blank"
            class="text-sm hover:text-fuchsia-300 transition-colors"
          >
            Certificate {{ index + 1 }}
          </a>
          <button
            @click="deleteCert(index)"
            class="absolute top-1 right-1 text-gray-500 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div v-if="user.certs.length === 0" class="text-gray-500 text-sm">
          No certifications added yet.
        </div>
      </div>

      <div class="flex items-center gap-2">
        <label
          for="cert-upload"
          class="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors cursor-pointer border border-gray-700"
        >
          Upload Certificate
        </label>
        <input
          id="cert-upload"
          type="file"
          class="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          @change="handleCertUpload"
        />
      </div>
    </div>

    <!-- Verification Request -->
    <div class="bg-gray-800 p-4 rounded-lg">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 class="font-semibold mb-1">Account Verification</h3>
          <p class="text-gray-400 text-sm">
            Get verified to increase your credibility in the community
          </p>
        </div>
        <button
          @click="requestVerification"
          class="mt-3 md:mt-0 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-2 px-6 rounded-md transition-colors disabled:opacity-50"
          :disabled="isLoading || user.verified"
        >
          {{ user.verified ? "Verified" : "Request Verification" }}
        </button>
      </div>
    </div>

    <!-- Social Stats -->
    <div class="mt-8 grid grid-cols-2 gap-4">
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="font-semibold mb-2">Following</h3>
        <p class="text-2xl font-bold text-fuchsia-400">
          {{ user.following.length }}
        </p>
      </div>
      <div class="bg-gray-800 p-4 rounded-lg">
        <h3 class="font-semibold mb-2">Followers</h3>
        <p class="text-2xl font-bold text-fuchsia-400">
          {{ user.followers.length }}
        </p>
      </div>
    </div>
  </div>
</template>

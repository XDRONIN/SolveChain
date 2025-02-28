<script setup>
import { ref, onMounted } from "vue";
import { Image, FileX } from "lucide-vue-next";

const uploadedFiles = ref([]);
const postText = ref(""); // Stores text input
const responseOption = ref("Everyone");
const postForm = ref(null);

const handleFilesSelected = (event) => {
  const files = event.target.files;
  uploadedFiles.value = []; // Clear previous files

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const previewUrl = URL.createObjectURL(file);
    uploadedFiles.value.push({
      file,
      previewUrl,
      type: file.type.startsWith("video") ? "video" : "image",
    });
  }
};

// Extract hashtags from text input
const extractTags = (text) => {
  const regex = /#(\w+)/g;
  const tags = [...text.matchAll(regex)].map((match) => match[1]);
  return tags;
};

const submitPost = async () => {
  if (!postText.value.trim() && uploadedFiles.value.length === 0) {
    alert("Post cannot be empty!");
    return;
  }

  const formData = new FormData();
  formData.append("queBody", postText.value);
  formData.append("whoCanRespond", responseOption.value);
  extractTags(postText.value).forEach((tag) => formData.append("tags[]", tag));

  uploadedFiles.value.forEach(({ file }) => {
    formData.append("media", file);
  });
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Post uploaded successfully!");
      resetForm();
    } else {
      alert("Failed to upload post!");
    }
  } catch (error) {
    console.error("Error uploading post:", error);
    alert("An error occurred while uploading.");
  }
};

const resetForm = () => {
  if (postForm.value) postForm.value.reset();
  postText.value = "";
  uploadedFiles.value = [];
  responseOption.value = "Everyone";
};

onMounted(() => {
  postForm.value = document.getElementById("postForm");
});
</script>

<template>
  <div class="border rounded-4xl border-fuchsia-500/40 p-4 md:w-130">
    <div class="flex gap-4">
      <div class="h-10 w-10 rounded-full bg-gray-600"></div>
      <div class="flex-1">
        <form id="postForm" ref="postForm" @submit.prevent="submitPost">
          <input
            v-model="postText"
            type="text"
            placeholder="What's the problem?!"
            class="w-full bg-transparent p-2 pb-12 text-xl outline-none"
          />

          <!-- Dropdown for Response Options -->
          <div class="relative w-64 mt-2">
            <select
              v-model="responseOption"
              class="w-full bg-transparent border border-fuchsia-500/40 text-fuchsia-500 px-3 py-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option class="bg-gray-900 text-white" value="Everyone">
                Everyone can respond
              </option>
              <option class="bg-gray-900 text-white" value="Following">
                Only Users I Follow
              </option>
              <option class="bg-gray-900 text-white" value="Verified">
                Only Verified Users
              </option>
            </select>
          </div>

          <!-- Preview Grid -->
          <div class="mt-4 flex gap-2">
            <template
              v-for="(file, index) in uploadedFiles.slice(0, 3)"
              :key="index"
            >
              <div class="relative">
                <img
                  v-if="file.type === 'image'"
                  :src="file.previewUrl"
                  alt="Preview"
                  class="h-20 w-20 object-cover rounded"
                />
                <video v-else class="h-20 w-20 object-cover rounded" controls>
                  <source :src="file.previewUrl" type="video/mp4" />
                </video>
              </div>
            </template>
            <div v-if="uploadedFiles.length > 3" class="relative">
              <img
                v-if="uploadedFiles[3].type === 'image'"
                :src="uploadedFiles[3].previewUrl"
                alt="Preview"
                class="h-20 w-20 object-cover rounded"
              />
              <video v-else class="h-20 w-20 object-cover rounded" controls>
                <source :src="uploadedFiles[3].previewUrl" type="video/mp4" />
              </video>
              <div
                class="absolute inset-0 bg-black/70 flex items-center justify-center rounded"
              >
                <span class="text-white text-lg font-bold">
                  +{{ uploadedFiles.length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="relative inline-block">
              <input
                type="file"
                id="mediaInput"
                class="hidden"
                accept="image/*, video/*"
                multiple
                @change="handleFilesSelected"
              />
              <label
                for="mediaInput"
                class="rounded-full p-2 cursor-pointer hover:bg-fuchsia-500/20 flex items-center justify-center"
              >
                <Image class="h-5 w-5 text-fuchsia-500" />
              </label>
            </div>
            <button
              type="submit"
              class="rounded-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 px-4 py-2 font-bold hover:from-fuchsia-800 hover:to-fuchsia-500"
            >
              Post
            </button>
          </div>
        </form>
        <FileX
          class="h-5 w-5 text-red-400 relative -top-7.5 left-80 rounded-full cursor-pointer hover:text-red-500"
          @click="resetForm"
        />
      </div>
    </div>
  </div>
</template>

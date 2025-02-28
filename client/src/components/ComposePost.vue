<script setup>
import { ref, onMounted } from "vue";
import { Image, Earth, FileX } from "lucide-vue-next";

const uploadedFiles = ref([]);
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

const resetForm = () => {
  if (postForm.value) postForm.value.reset(); // Reset form fields
  uploadedFiles.value = []; // Clear previews
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
        <form id="postForm" ref="postForm">
          <input
            type="text"
            placeholder="What's the problem?!"
            class="w-full bg-transparent p-2 pb-12 text-xl outline-none"
          />

          <div
            class="text-fuchsia-500/80 rounded-full max-w-fit px-2 py-1 hover:bg-fuchsia-500/20 hover:cursor-pointer flex"
          >
            <Earth class="mr-2 h-5 w-5" /> Everyone can respond
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
                  Your browser does not support the video tag.
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

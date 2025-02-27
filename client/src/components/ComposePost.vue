<script setup>
import { Image, Film, ListPlus, Earth } from "lucide-vue-next";
const postActions = [
  { name: "Images", icon: Image, filetype: "image/*" },
  { name: "Videos", icon: Film, filetype: "video/*" },
];
</script>
<template>
  <!-- Post Composer -->
  <div class="border rounded-4xl border-fuchsia-500/40 p-4 md:w-130">
    <div class="flex gap-4">
      <div class="h-10 w-10 rounded-full bg-gray-600"></div>
      <div class="flex-1">
        <input
          type="text"
          placeholder="What's the problem?!"
          class="w-full bg-transparent p-2 pb-12 text-xl outline-none"
          id="postBody"
        />

        <div
          class="text-fuchsia-500/80 rounded-full max-w-fit px-2 py-1 hover:bg-fuchsia-500/20 hover:cursor-pointer flex"
        >
          <Earth class="mr-2 h-5 w-5" /> Everyone can respond
        </div>

        <div class="mt-4 flex items-center justify-between">
          <div class="flex gap-2">
            <div
              v-for="action in postActions"
              :key="action.name"
              class="relative inline-block"
            >
              <input
                type="file"
                :id="action.name"
                class="hidden"
                :accept="action.filetype"
              />
              <label
                :for="action.name"
                class="rounded-full p-2 cursor-pointer hover:bg-fuchsia-500/20 flex items-center justify-center"
              >
                <component :is="action.icon" class="h-5 w-5 text-fuchsia-500" />
              </label>
            </div>
          </div>
          <button
            class="rounded-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 px-4 py-2 font-bold hover:from-fuchsia-800 hover:to-fuchsia-500"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Image,
  Film,
  ListPlus,
  MapPin,
  Smile,
  Calendar,
} from "lucide-vue-next";
const postActions = [
  { name: "Media", icon: Image },
  { name: "GIF", icon: Film },
  { name: "Poll", icon: ListPlus },
  { name: "Location", icon: MapPin },
  { name: "Emoji", icon: Smile },
  { name: "Schedule", icon: Calendar },
];
</script>
<template>
  <!-- Post Composer -->
  <div class="border-b border-gray-800 p-4">
    <div class="flex gap-4">
      <div class="h-10 w-10 rounded-full bg-gray-600"></div>
      <div class="flex-1">
        <input
          type="text"
          placeholder="What is happening?!"
          class="w-full bg-transparent p-2 text-xl outline-none"
        />
        <div class="mt-4 flex items-center justify-between">
          <div class="flex gap-2">
            <button
              v-for="action in postActions"
              :key="action.name"
              class="rounded-full p-2 hover:bg-blue-500/20"
            >
              <component :is="action.icon" class="h-5 w-5 text-blue-500" />
            </button>
          </div>
          <button
            class="rounded-full bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

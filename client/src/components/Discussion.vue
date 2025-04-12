<template>
  <div class="bg-gray-900 w-230 rounded-2xl">
    <button
      class="mt-4 w-40 flex cursor-pointer p-3 text-center align-middle justify-center relative left-185 text-white font-semibold bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-fuchsia-800 hover:to-fuchsia-500"
    >
      Join Discussion
    </button>

    <div class="p-4 h-174 overflow-y-auto">
      <div class="text-gray-400 text-center mt-20">
        No messages yet. Start the conversation!
      </div>

      <div class="space-y-4"></div>
    </div>

    <div class="flex bottom-4 w-230 px-2 pt-4">
      <input
        type="text"
        placeholder="Send Message"
        class="w-full rounded-full pr-13 backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-3 outline-none"
      />
      <button class="relative right-10">
        <Paperclip />
      </button>
      <button
        class="rounded-full p-5 bg-blue-950 flex justify-center align-middle"
      >
        <Send />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Send, Paperclip } from "lucide-vue-next";
</script>

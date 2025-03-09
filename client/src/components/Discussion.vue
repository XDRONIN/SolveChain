<template>
  <div class="bg-gray-900 w-230 rounded-2xl">
    <button
      class="mt-4 w-40 flex cursor-pointer p-3 text-center align-middle justify-center relative left-185 text-white font-semibold bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-fuchsia-800 hover:to-fuchsia-500"
    >
      Join Discussion
    </button>
    <div></div>
    <div class="flex top-200 w-230 px-2 fixed">
      <input
        type="text"
        placeholder="Send Message"
        class="w-full rounded-full pr-13 backdrop-blur-[18px] backdrop-saturate-[174%] bg-[rgba(27,27,27,0.5)] border border-[rgba(255,255,255,0.125)] p-3 outline-none active:border-fuchsia-800"
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
import { ref } from "vue";
import { Send, Paperclip } from "lucide-vue-next";

const props = defineProps({
  qid: String,
});

const joinDiscussion = async (qid) => {
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
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
const currentQid = ref(props.qid);
const fetchDiscussion = (currentQid) => {
  if (currentQid) {
    console.log(`fetchdata${props.qid}`);
  }
};
fetchDiscussion(currentQid);
</script>

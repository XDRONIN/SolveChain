<template>
  <div
    class="min-h-screen min-w-screen bg-black -z-10 flex overflow-hidden p-5"
  >
    <div
      class="h-210 w-500 bg-[rgba(17,24,39,1)] flex pt-5 pl-5 rounded-2xl mt-2.5"
    >
      <img
        ref="image"
        src="../assets/prpl.jpg"
        class="image-fade absolute z-5 w-250 h-200 rounded-2xl"
        @load="onImageLoad"
      />
      <div class="relative left-300 flex items-center">
        <login />
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-fade {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(10px);
  transition: opacity 2s ease-in-out, transform 1.5s ease-in-out,
    filter 2s ease-in-out;
}
.image-fade.loaded {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import login from "../components/login.vue";

const image = ref(null);

const onImageLoad = () => {
  if (image.value) {
    image.value.classList.add("loaded");
  }
};

onMounted(() => {
  if (image.value && image.value.complete) {
    onImageLoad();
  }
});
</script>

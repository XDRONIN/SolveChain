<script setup>
import login from "../components/login.vue";
</script>
<template>
  <div
    class="min-h-screen min-w-screen bg-black -z-10 flex overflow-hidden p-5"
  >
    <div
      class="h-210 w-500 bg-[rgba(17,24,39,1)] flex pt-5 pl-5 rounded-2xl mt-2.5"
    >
      <img
        src="../assets/prpl.jpg"
        class="absolute z-5 w-250 h-200 rounded-2xl"
      />
      <div class="relative left-300 flex items-center"><login /></div>
    </div>
  </div>
</template>
<style scoped>
html,
body {
  overflow: hidden;
}
</style>

<script setup>
import { ref } from "vue";
const tabs = ["Home", "Docs", "Community", "How it works"];
const activeTab = ref(0);
</script>
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <div class="min-h-screen absolute inset-0 bg-gradient -z-10">
    <nav
      class="w-100% h-30 text-white flex items-center popins-font justify-between pl-10 pr-10"
    >
      <span class="text-xl font-bold">
        <img src="../assets/logo2.png" class="w-40"
      /></span>
      <div
        class="fixed z-10 justify-evenly left-134 font-semibold text-white pl-10 pr-10 rounded-full flex items-center sm:w-120 sm:h-15 lg:w-200 backdrop-blur-[12px] backdrop-saturate-[162%] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.125)]"
      >
        <span
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          :class="[
            'w-30 flex justify-center h-12 items-center flex-1  rounded-full cursor-pointer transition-all delay-75',
            activeTab == index ? ' text-fuchsia-500 shadow ' : '',
          ]"
          >{{ tab }}</span
        >
      </div>
      <div>
        <button
          class="relative text-center flex cursor-pointer text-fuchsia-700 font-semibold bg-transparent px-7 py-3 rounded-full border-2 border-fuchsia-700 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200 before:rounded-full before:bg-gradient-to-r before:from-fuchsia-400 before:to-fuchsia-800 before:blur-md before:opacity-50 before:z-[-1]"
        >
          Sign In
        </button>
      </div>
    </nav>
    <main class="h-218 text-white pt-5 popins-font">
      <center>
        <div>
          <h4 class="text-8xl custom-font">
            <span class="font-semibold text-fuchsia-800">BIG </span
            >Problems?<br />
            Meet
            <span class="font-semibold text-fuchsia-800">BIGGER </span>
            solutions
          </h4>
        </div>

        <div class="text-lg font-semibold">
          Join the chain of thinkers, doers, and innovators, solving problems
          together<br />
          Post your challenge, find your expert, and unlock solutions.
        </div>

        <div class="flex flex-row justify-center pt-2">
          <button
            class="relative flex gap-3 cursor-pointer text-white font-semibold bg-gradient-to-r from-fuchsia-300 to-fuchsia-800 px-7 py-3 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-fuchsia-800 hover:to-fuchsia-400 before:absolute before:top-[-2px] before:left-[-2px] before:right-[-2px] before:bottom-[1px] before:rounded-full before:bg-gradient-to-r before:from-fuchsia-400 before:to-fuchsia-800 before:blur-md before:opacity-50 before:z-[-1]"
          >
            Get Started >
          </button>
          <div class="w-6"></div>
          <button
            class="relative flex gap-3 cursor-pointer text-fuchsia-800 font-semibold bg-transparent px-7 py-3 rounded-full border-2 border-fuchsia-800 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200"
          >
            How It Works
          </button>
        </div>
      </center>
      <div
        class="absolute left-[620px] top-[470px] order-1 transform-gpu md:order-2 md:w-[700px] items-center justify-center lg:flex lg:animate-[open-scale-up-fade_1.5s_ease-in-out] before:from-green-5/5 before:to-yellow-6/25 before:absolute before:left-0 before:top-0 before:block before:h-full before:w-full before:rounded-full before:bg-gradient-to-br before:blur-[100px] before:content-['']"
      >
        <div
          class="relative animate-webgl-scale-in-fade"
          style="width: 100%; height: 100%; overflow: hidden"
        >
          <center>
            <video
              loop
              autoplay
              muted
              playsinline
              preload="auto"
              class="object-contain"
            >
              <source src="../assets/cubeVid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </center>
        </div>
      </div>
      <div
        class="min-h-screen relative top-111 inset-0 bg-gradient2 -z-10"
      ></div>
    </main>
  </div>
</template>
<style scoped>
@font-face {
  font-family: "MyCustomFont";
  src: url("../public/fonts/BebasNeue-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
.custom-font {
  font-family: "MyCustomFont", sans-serif;
}
.bg-gradient {
  background-color: hsla(0, 0%, 0%, 1);
  background-image: radial-gradient(
      at 65% 46%,
      hsla(80, 0%, 0%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 44% 47%, hsla(34, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 66% 85%, hsla(37, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 44% 86%, hsla(166, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(102, 0%, 0%, 0.55) 0px, transparent 50%),
    radial-gradient(at 54% 2%, hsla(25, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 44% 67%, hsla(74, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 66% 69%, hsla(135, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 93% 19%, hsla(274, 75%, 54%, 0.79) 0px, transparent 50%),
    radial-gradient(at 9% 56%, hsla(206, 100%, 70%, 0.34) 0px, transparent 50%),
    radial-gradient(at 90% 58%, hsla(204, 85%, 61%, 0.62) 0px, transparent 50%),
    radial-gradient(at 33% 7%, hsla(279, 73%, 50%, 0.71) 0px, transparent 50%);
}
.bg-gradient2 {
  background-color: hsla(0, 0%, 0%, 1);
  background-image: radial-gradient(
      at 78% 100%,
      hsla(18, 0%, 0%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 30% 98%, hsla(352, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 58% 100%, hsla(12, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 54% 1%, hsla(83, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 56% 77%, hsla(206, 100%, 70%, 0.34) 0px, transparent 50%),
    radial-gradient(at 17% 44%, hsla(206, 100%, 70%, 0.34) 0px, transparent 50%),
    radial-gradient(at 56% 73%, hsla(274, 75%, 54%, 1) 0px, transparent 50%),
    radial-gradient(at 94% 42%, hsla(204, 85%, 61%, 0.62) 0px, transparent 50%);
}
</style>

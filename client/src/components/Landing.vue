<script setup></script>
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <div class="min-h-screen absolute inset-0 bg-gradient -z-10">
    <nav
      class="w-100% h-30 text-white flex items-center popins-font justify-between"
    >
      SolveChain
      <div
        class="text-white pl-10 pr-10 rounded-full flex items-center sm:w-120 sm:h-15 lg:w-200 backdrop-blur-[12px] backdrop-saturate-[162%] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.125)]"
      >
        <span
          class="w-30 flex justify-center h-12 items-center flex-1 m-1 active:backdrop-blur-[21px] active:backdrop-saturate-[162%] active:bg-[rgba(255,255,255,0.12)] rounded-full"
          >Home</span
        >
        <span
          class="w-30 flex justify-center h-12 items-center flex-1 m-1 active:backdrop-blur-[21px] active:backdrop-saturate-[162%] active:bg-[rgba(255,255,255,0.12)] rounded-full"
          >Comunity</span
        >
        <span
          class="w-30 flex justify-center h-12 items-center flex-1 m-1 active:backdrop-blur-[21px] active:backdrop-saturate-[162%] active:bg-[rgba(255,255,255,0.12)] rounded-full"
          >How it works</span
        >
        <span
          class="w-30 flex justify-center h-12 items-center flex-1 m-1 active:backdrop-blur-[21px] active:backdrop-saturate-[162%] active:bg-[rgba(255,255,255,0.12)] rounded-full"
          >Documentation</span
        >
      </div>
      <div><button>Sign In</button></div>
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
            class="relative flex gap-3 cursor-pointer text-fuchsia-800 font-semibold bg-black px-7 py-3 rounded-full border-2 border-fuchsia-800 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200 before:absolute before:top-[1px] before:left-[1px] before:right-[1px] before:bottom-[1px] before:rounded-full before:bg-gradient-to-r before:from-fuchsia-400 before:to-fuchsia-800 before:blur-md before:opacity-50 before:z-[-1]"
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
      at 64% 38%,
      hsla(12, 0%, 0%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 63% 80%, black 0px, transparent 50%),
    radial-gradient(at 64% 73%, black 0px, transparent 50%),
    radial-gradient(at 37% 70%, black 0px, transparent 50%),
    radial-gradient(at 58% 4%, black 0px, transparent 50%),
    radial-gradient(at 43% 32%, black 0px, transparent 50%),
    radial-gradient(at 44% 75%, black 0px, transparent 50%),
    radial-gradient(at 80% 71%, black 0px, transparent 50%),
    radial-gradient(at 55% 80%, black 0px, transparent 50%),
    radial-gradient(at 55% 90%, black 0px, transparent 50%),
    radial-gradient(at 60% 90%, black 0px, transparent 50%),
    radial-gradient(at 79% 18%, hsla(279, 73%, 50%, 0.71) 0px, transparent 50%),
    radial-gradient(at 23% 82%, hsla(204, 85%, 61%, 0.62) 0px, transparent 50%),
    radial-gradient(
      at 100% 100%,
      hsla(282, 93%, 60%, 0.49) 0px,
      transparent 50%
    ),
    radial-gradient(at 29% 38%, hsla(206, 100%, 70%, 0.34) 0px, transparent 50%),
    radial-gradient(at 37% 1%, hsla(274, 75%, 54%, 0.79) 0px, transparent 50%);
}
</style>

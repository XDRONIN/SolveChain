<script setup></script>
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <nav
    class="w-100% h-30 bg-black text-white flex items-center justify-between"
  >
    SolveChain
    <div
      class="text-white pl-10 pr-10 rounded-full flex items-center sm:w-120 sm:h-15 lg:w-200 backdrop-blur-[21px] backdrop-saturate-[162%] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.125)]"
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
  <main class="h-218 text-white pt-20 bg-black">
    <center>
      <div>
        BIG Problems?<br />
        Meet BIGGER solutions
      </div>
    </center>
    <div>
      Join the chain of thinkers, doers, and innovators, solving problems
      together<br />
      Post your challenge, find your expert, and unlock solutions.
      <br />Collaboration made effortless.
    </div>
    <div><button>Get Started</button><button>How It Works</button></div>
    <div
      class="relative order-1 transform-gpu md:order-2 md:w-[700px] items-center justify-center lg:flex lg:animate-[open-scale-up-fade_1.5s_ease-in-out] before:from-green-5/5 before:to-yellow-6/25 before:absolute before:left-0 before:top-0 before:block before:h-full before:w-full before:rounded-full before:bg-gradient-to-br before:blur-[100px] before:content-['']"
    >
      <div
        class="relative animate-webgl-scale-in-fade"
        style="width: 100%; height: 100%; overflow: hidden"
      >
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
      </div>
    </div>
  </main>
</template>

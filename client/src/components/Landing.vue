<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const tabs = ["Home", "Docs", "Community", "How it works"];
const activeTab = ref("Home");
const openDocs = () => {
  window.open(
    "https://github.com/XDRONIN/SolveChain/blob/main/README.md",
    "_blank"
  );
};
// Function to update active tab based on scroll position
const updateActiveTab = () => {
  const sections = document.querySelectorAll(".content-block");
  let currentTab = "Home";

  sections.forEach((block) => {
    const rect = block.getBoundingClientRect();
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      currentTab = block.id;
    }
  });

  activeTab.value = currentTab;
};
// Attach scroll event listener
onMounted(() => {
  window.addEventListener("scroll", updateActiveTab);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveTab);
});
const scrollToSection = (tab) => {
  document.getElementById(tab).scrollIntoView({ behavior: "smooth" });
};
</script>
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <div
    class="min-h-screen absolute inset-0 bg-gradient -z-10 content-block"
    id="Home"
  >
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
          @click="scrollToSection(tab)"
          :class="[
            'w-30 flex justify-center h-12 items-center flex-1  rounded-full cursor-pointer transition-all delay-75',
            activeTab === tab ? ' text-fuchsia-500 shadow ' : '',
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
    <main class="h-218 text-white pt-5 popins-font scrollbar-hide">
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

      <div class="min-h-screen relative top-111 inset-0 bg-gradient2 -z-10">
        <div id="Docs" class="content-block">
          <center>
            <h6 class="relative top-40 custom-font text-6xl">
              Tech <span class="text-fuchsia-800"> Stack</span>
            </h6>
          </center>
          <div
            class="flex min-h-screen justify-center items-center flex-col mt-9"
          >
            <div class="grid lg:grid-cols-4 gap-15">
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/vue.svg" alt="" />
              </div>
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/mongo.svg" alt="" />
              </div>
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/express.svg" alt="" />
              </div>
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/node.svg" alt="" />
              </div>
            </div>
            <div class="grid lg:grid-cols-4 gap-15 mt-20">
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/mongoose.svg" alt="" />
              </div>
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/tail.svg" alt="" />
              </div>
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/vite.svg" alt="" />
              </div>
              <div
                class="w-50 items-center justify-center group flex flex-col text-center p-8 border h-45 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
              >
                <img src="../assets/sol.svg" alt="" />
              </div>
            </div>

            <button
              class="top-20 relative left-4 flex gap-3 cursor-pointer text-fuchsia-800 font-semibold bg-transparent px-7 py-3 rounded-full border-2 border-fuchsia-800 hover:scale-105 duration-200 hover:text-white hover: to-fuchsia-800 hover:from-fuchsia-800 hover:to-fuchsia-200"
              @click="openDocs"
            >
              Read Docs
            </button>
          </div>
        </div>
      </div>
      <div
        class="min-h-screen relative top-111 inset-0 bg-gradient3 -z-10 content-block"
        id="Community"
      >
        <div class="w-full h-screen flex justify-center items-center">
          <div class="grid grid-cols-4 grid-rows-5 h-full w-full gap-5 p-5">
            <div
              class="p-5 backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] col-span-1 row-span-2 flex justify-center rounded-2xl"
            >
              <p class="mt-5 font-bold text-4xl">
                <span
                  class="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
                  >100+</span
                ><br />
                Problems are getting solved every day
              </p>
            </div>
            <div
              class="overflow-clip backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-2 row-span-2 flex justify-start rounded-2xl"
            >
              <h2 class="mt-20 text-7xl custom-font">
                Join The
                <span
                  class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent underline"
                >
                  Problem-<br />Solving</span
                >
                Revolution
              </h2>

              <img
                src="../assets/image.png"
                class="absolute left-120 h-120 w-120"
              />
            </div>
            <div
              class="text-center backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-1 row-span-1 flex justify-center rounded-2xl"
            >
              <p class="text-2xl font-bold">
                Members from
                <span
                  class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
                  >diverse fields</span
                >
                like technology, business, science, and education
              </p>
            </div>
            <div
              class="text-center backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-1 row-span-1 flex justify-center rounded-2xl"
            >
              <p class="text-2xl font-bold">
                Work with trusted experts who deliver<span
                  class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
                >
                  high-quality solutions.</span
                >
              </p>
            </div>
            <div
              class="overflow-clip backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-1 row-span-2 flex justify-center rounded-2xl"
            >
              <p class="text-2xl font-bold">
                Solve problems and connect with collaborators from over<span
                  class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
                >
                  50+</span
                >
                countries
              </p>
              <img
                src="../assets/cyan_pink-View 3.png"
                alt=""
                class="absolute top-30 h-100 w-100"
              />
            </div>
            <div
              class="overflow-clip text-center backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-1 row-span-3 flex justify-center rounded-2xl"
            >
              <p class="text-3xl font-bold">
                Access a growing repository of innovative solutions, case
                studies, and expert insights contributed by the community.
              </p>
              <img
                src="../assets/Group 134.png"
                alt=""
                class="absolute h-90 w-90 top-56"
              />
            </div>
            <div
              class="backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-1 row-span-3 flex justify-center rounded-2xl"
            >
              <p class="text-4xl font-extrabold">
                “SolveChain connected me to experts who helped me tackle a
                critical business challenge. A must-have platform for
                innovators!” <br />—
                <span
                  class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
                  >John Doe</span
                >

                <img src="../assets/avatars.png" alt="" class="mt-5" />
              </p>
            </div>
            <div
              class="backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-1 row-span-2 flex justify-center rounded-2xl"
            >
              <p class="text-2xl font-bold">
                Earn
                <span
                  class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
                  >SolveCoin</span
                >
                for your each contributions
              </p>
              <img
                src="../assets/holo-7.png"
                class="absolute h-90 w-90 top-20"
              />
            </div>
            <div
              class="items-center backdrop-blur-0 backdrop-saturate-[94%] bg-[rgba(29,11,53,0.43)] border border-[rgba(255,255,255,0.125)] p-4 col-span-1 row-span-1 flex justify-center rounded-2xl"
            >
              <button
                class="items-center relative h-20 flex gap-3 cursor-pointer text-white bg-gradient-to-r from-purple-400 to-pink-600 px-7 py-3 rounded-full border border-black hover:scale-105 duration-200 hover:text-white hover:border-gray-800 hover:from-pink-600 hover:to-purple-400 before:absolute before:top-[-2px] before:left-[-2px] before:right-[-2px] before:bottom-[1px] before:rounded-full before:bg-gradient-to-r before:from-purple-400 before:to-pink-600 before:blur-md before:opacity-50 before:z-[-1] font-bold"
              >
                Join the Community
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="min-h-screen relative top-111 inset-0 bg-gradient4 -z-10 content-block"
        id="How it works"
      >
        <div class="h-screen">
          <div
            class="pl-2 relative h-60 w-190 top-50 left-40 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5 flex items-center"
          >
            <div
              class="items-center rounded-full backdrop-blur-[12px] backdrop-saturate-[162%] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.125)] min-h-40 min-w-40 flex justify-center custom-font font-bold text-7xl"
            >
              <p
                class="bg-gradient-to-r from-fuchsia-700 to-fuchsia-400 bg-clip-text text-transparent"
              >
                1
              </p>
            </div>
            <p class="popins-font text-2xl ml-2">
              <span class="text-fuchsia-900 font-bold">Post a Problem:</span>
              Have a problem that needs solving? Submit a challenge, describing
              the issue in detail using images,videos etc.
            </p>
          </div>
          <div
            class="pl-2 flex items-center relative h-50 w-190 top-50 left-270 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
          >
            <div
              class="items-center rounded-full backdrop-blur-[12px] backdrop-saturate-[162%] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.125)] min-h-40 min-w-40 flex justify-center custom-font font-bold text-7xl"
            >
              <p
                class="bg-gradient-to-r from-fuchsia-700 to-fuchsia-400 bg-clip-text text-transparent"
              >
                2
              </p>
            </div>
            <p class="popins-font text-2xl ml-2">
              <span class="text-fuchsia-900 font-bold"
                >Experts & Community Respond</span
              >
              Experts and community members analyze your challenge and submit
              solutions in various formats: Step-by-Step Guides, Videos & Live
              Sessions, Code Snippets & Technical Solutions
            </p>
          </div>
          <div
            class="pl-2 flex items-center relative h-50 w-190 top-60 left-40 border-white dark:border-white/10 rounded-xl bg-white/30 dark:bg-black/10 shadow-2xl shadow-indigo-950/5"
          >
            <div
              class="items-center rounded-full backdrop-blur-[12px] backdrop-saturate-[162%] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.125)] min-h-40 min-w-40 flex justify-center custom-font font-bold text-7xl"
            >
              <p
                class="bg-gradient-to-r from-fuchsia-700 to-fuchsia-400 bg-clip-text text-transparent"
              >
                3
              </p>
            </div>
            <p class="popins-font text-2xl ml-2">
              <span class="text-fuchsia-900 font-bold"
                >Earn & Reward with Blockchain</span
              >
              Once a challenge is solved, the solver earns blockchain based
              SkillCoinss, which can be used trade in the ecosystem. As platform
              grows so does the value of the coin
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
body {
  overflow-y: hidden;
}
::-webkit-scrollbar {
  display: none; /* Hides the scrollbar */
}
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
.bg-gradient3 {
  background-color: hsla(0, 0%, 0%, 1);
  background-image: radial-gradient(
      at 100% 37%,
      hsla(107, 0%, 0%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 4% 26%, hsla(323, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 45% 40%, hsla(274, 75%, 54%, 0.79) 0px, transparent 50%),
    radial-gradient(at 65% 100%, hsla(269, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 61% 59%, hsla(189, 100%, 56%, 1) 0px, transparent 50%),
    radial-gradient(at 12% 53%, hsla(206, 100%, 70%, 0.34) 0px, transparent 50%),
    radial-gradient(at 16% 51%, hsla(204, 85%, 61%, 0.62) 0px, transparent 50%),
    radial-gradient(at 22% 60%, hsla(274, 75%, 54%, 1) 0px, transparent 50%),
    radial-gradient(at 92% 44%, hsla(204, 85%, 61%, 0.62) 0px, transparent 50%);
}
.bg-gradient4 {
  background-color: hsla(0, 0%, 0%, 1);
  background-image: radial-gradient(
      at 100% 37%,
      hsla(107, 0%, 0%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 0% 0%, hsla(0, 0%, 0%, 0.76) 0px, transparent 50%),
    radial-gradient(at 65% 100%, hsla(269, 0%, 0%, 1) 0px, transparent 50%),
    radial-gradient(at 14% 41%, hsla(274, 75%, 54%, 0.79) 0px, transparent 50%),
    radial-gradient(at 89% 45%, hsla(189, 100%, 56%, 1) 0px, transparent 50%),
    radial-gradient(at 49% 59%, hsla(206, 100%, 70%, 0.34) 0px, transparent 50%),
    radial-gradient(at 3% 99%, hsla(204, 85%, 61%, 0.62) 0px, transparent 50%),
    radial-gradient(at 100% 63%, hsla(274, 75%, 54%, 1) 0px, transparent 50%),
    radial-gradient(at 92% 44%, hsla(204, 85%, 61%, 0.62) 0px, transparent 50%);
}
</style>

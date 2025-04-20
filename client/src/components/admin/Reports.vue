<template>
  <div
    class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 text-white"
  >
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-fuchsia-500 mb-6">User Reports</h1>

      <div
        v-for="report in reports"
        :key="report.id"
        class="mb-4 p-4 rounded-2xl backdrop-blur-[12px] backdrop-saturate-[162%] bg-black/50 shadow-lg border border-fuchsia-500/20"
      >
        <div class="text-lg">
          <span class="text-fuchsia-400 font-semibold">{{
            report.reportedBy
          }}</span>
          <span class="text-gray-300"> reported </span>
          <span class="text-fuchsia-400 font-semibold">{{
            report.reportedUser
          }}</span>
        </div>
        <div class="text-sm text-gray-400 mt-2">
          Reason: {{ report.reason }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ report.time }} | {{ report.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const reports = [
  {
    id: 1,
    reportedBy: "ShadowHunter",
    reportedUser: "PixelWarrior",
    reason: "Spamming inappropriate links in comments",
    time: "10:34 PM",
    date: "April 18, 2025",
  },
  {
    id: 2,
    reportedBy: "CodeSamurai",
    reportedUser: "BuggedOut",
    reason: "Using offensive language in the discussion forum",
    time: "03:22 PM",
    date: "April 17, 2025",
  },
  {
    id: 3,
    reportedBy: "DataSlinger",
    reportedUser: "HackThrone",
    reason: "Trying to phish for user credentials via profile bio",
    time: "08:15 AM",
    date: "April 16, 2025",
  },
];
</script>

<style scoped>
/* Optional custom styles */
</style>

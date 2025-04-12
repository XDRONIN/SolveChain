<template></template>
<script setup>
import { onMounted } from "vue";
onMounted(async () => {
  try {
    const response = await fetch("/api/getDiscussion", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.Discs);
    }
  } catch (error) {}
});
</script>

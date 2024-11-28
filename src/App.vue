<script setup>
import Navbar from "@/views/Navbar.vue"; 
import { useUserStore } from "@/store/user.store";

const userStore = useUserStore();
userStore.init();
</script>

<template>
  <div class="app-global-container">
    <Navbar />
    <RouterView />
  </div>
</template>

<style scoped>
</style>

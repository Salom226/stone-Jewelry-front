<script setup>
import Navbar from "@/views/Navbar.vue"; 
import { useUserStore } from "@/store/user.store";
import Footer from "@/views/Footer.vue"; 

const userStore = useUserStore();
userStore.init();

</script>

<template>
  <div class="app-global-container">
    <Navbar />
    <RouterView />
    <Footer />
  </div>

</template>

<style scoped>
</style>

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
.app-global-container {
  width: 100%;
  height: 100%;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.navbar {
  background-color: #2c3e50;
  padding: 10px 20px;
}

.navbar-list {
  list-style-type: none;
  display: flex;
  gap: 15px;
}

.navbar-list li {
  display: inline;
}

.navbar-list a {
  color: #fff;
  text-decoration: none;
}

.navbar-list a:hover {
  text-decoration: underline;
}
</style>

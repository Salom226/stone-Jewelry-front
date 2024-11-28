<template>
  <Menubar :model="items">
    <template #start>
      <router-link to="/">
        <svg
          width="35"
          height="40"
          viewBox="0 0 35 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-8"
        >
          <path d="..." fill="var(--p-primary-color)" />
          <path d="..." fill="var(--p-text-color)" />
        </svg>
      </router-link>
    </template>

    <template #item="{ item, props, hasSubmenu }">
      <div
      v-if="item.items"
      class="submenu relative flex items-center"
      @mouseenter="item.show = true"
      @mouseleave="item.show = false"
      @click.stop 
      
      >
        <span :class="item.icon"></span>
        <span class="ml-2">{{ item.label }}</span>
        <i class="pi pi-angle-down ml-auto"></i>

        <ul
        v-bind:class="{ 'submenu-content-visible': item.show }"
          class="submenu-content absolute bg-white shadow-lg rounded-md"
        >
          <li
            v-for="subItem in item.items"
            :key="subItem.label"
            class="py-2 px-4 hover:bg-gray-200"
          >
          <router-link :to="{ name: 'BijouxCategory', params: { id: subItem.id } }">
            {{ subItem.label }}
          </router-link>
        </li>
        </ul>
      </div>
      <router-link
        v-else
        v-bind="props"
        :to="item.to"
        class="flex items-center"
      >
        <span :class="item.icon"></span>
        <span class="ml-2">{{ item.label }}</span>
      </router-link>
    </template>

    <template #end>
      <div class="navbar-end flex items-center space-x-4 relative">
         <span class="pi pi-search ml-auto" style="cursor: pointer;" @click="handleSearch"></span>
        
        <input 
          v-model="searchQuery" 
          @input="handleSearch" 
          type="text" 
          placeholder="Rechercher..." 
          class="p-inputtext p-component p-inputtext-sm" 
        />

          <!-- Affichage des résultats de recherche sous l'input -->
          <ul v-if="searchResults.length > 0" class="search-results-container absolute bg-white shadow-lg rounded-md w-full mt-2">
            <li
              v-for="result in searchResults"
              :key="result.id"
              class="py-2 px-4 hover:bg-gray-200"
            >
              <router-link :to="{ name: 'ProductDetail', params: { id: result.id } }">
                {{ result.name }}
              </router-link>
            </li>
          </ul>
        <router-link v-if="!isLoggedIn" to="/login" class="mr-2">CONNEXION</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="ml-2">INSCRIPTION</router-link>
        <router-link v-if="isAdmin" to="/admin" class="ml-2">ADMIN</router-link>
        <a v-if="isLoggedIn" href="#" @click="logout">DECONNEXION</a>
      </div>
    </template>
  </Menubar>
</template>

<script>
import Menubar from "primevue/menubar";
import { useUserStore } from "@/store/user.store";
import axios from 'axios';
import { Api } from '@/helper/api';


export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      isLoggedIn: false, 
      items: [
        { label: "ACCEUIL", to: "/", icon: "pi pi-home" },
        { label: "PANIER", to: "/cart", icon: "pi pi-shopping-cart" },
        {
          label: "BIJOUX",
          icon: "pi pi-gem",
          items: [],
        },
      ],
    };
  },
  mounted() {
    this.fetchCategories();
    this.checkLoginStatus();
    this.emitter.on('login', () => {
      this.checkLoginStatus();
    });
  },
  methods: {
    checkLoginStatus() {
      const userStore = useUserStore();
      this.isLoggedIn = !!userStore.getUser().token;
      this.isAdmin = userStore.userHasRole("ROLE_ADMIN"); 
    },

    handleSearch() {
      if (this.searchQuery.length > 2) {
        this.searchProducts();
      } else {
        // Si le champ est vide ou trop court, on vide les résultats
        this.searchResults = [];
      }
    },

    searchProducts() {
      // Effectuer la recherche en fonction du query
      new Api().get(`/products/search?q=${this.searchQuery}`)
        .then((response) => {
          console.log("Résultats de recherche", response.data);
          this.searchResults = response.data; // Stocke les résultats dans l'état
        })
        .catch((error) => {
          console.error('Erreur de recherche', error);
          this.searchResults = []; // Vide les résultats en cas d'erreur
        });
    },

    fetchCategories() {
    new Api().get('/categories')
    .then((response) => {
      if (Array.isArray(response.data)) {
        const categories = response.data;

        this.items = this.items.map(item => {
          if (item.label === "BIJOUX") {
            item.items = categories.map(category => ({
              label: category.name,
              id: category.id,
              to: { name: "BijouxCategory", params: { id: category.id } },
              icon: 'pi pi-gem',
            }));
          }
          return item;
        });

        console.log('Items générés :', this.items); 
      } else {
        console.error('Erreur : La réponse de l\'API ne contient pas un tableau valide de catégories.');
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des catégories', error);
    });
  },

    logout() {
      const userStore = useUserStore();
      userStore.setUser({}, { saveToLocalStorage: true }); 
      this.isLoggedIn = false; 
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/scss/navbar.scss";

</style>

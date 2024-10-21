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

    <!-- Items du menu -->
    <template #item="{ item, props, hasSubmenu, root }">
      <router-link v-bind="props" :to="item.to" class="flex items-center">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <i
          v-if="hasSubmenu"
          :class="[
            'pi pi-angle-down',
            { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
          ]"
        ></i>
      </router-link>
    </template>

    <!-- Partie droite: Liens de connexion/déconnexion et avatar -->
    <template #end>
      <div class="navbar-end">
        <!-- Afficher les liens en fonction de l'état de connexion -->
        <router-link v-if="!isLoggedIn" to="/login" class="mr-2"
          >Connexion</router-link
        >
        <router-link v-if="!isLoggedIn" to="/register" class="ml-2"
          >Inscription</router-link
        >
        <router-link v-if="isAdmin" to="/admin" class="ml-2">Admin</router-link>
        <a v-if="isLoggedIn" href="#" @click="logout">Déconnexion</a>
        <!-- Afficher l'avatar si l'utilisateur est connecté -->
        <!-- <Avatar v-if="isLoggedIn" image="/images/avatar/amyelsner.png" shape="circle" /> -->
      </div>
    </template>
  </Menubar>
</template>
<script>
import Menubar from "primevue/menubar";
import { useUserStore } from "@/store/user.store";

export default {
  data() {
    return {
      isLoggedIn: false, // Remplacer par la logique réelle de connexion
      items: [
        // Lien vers la page d'accueil
        { label: "Accueil", to: "/", icon: "pi pi-home" },

        // Lien vers le panier
        { label: "Panier", to: "/cart", icon: "pi pi-shopping-cart" },
      ],
    };
  },
  mounted() {
    // Vérifier l'état de connexion au montage du composant
    this.checkLoginStatus();
    this.emitter.on('login', () => {
      this.checkLoginStatus();
    })
  },
  methods: {
    // Vérifier si l'utilisateur est connecté (via le localStorage ou un autre mécanisme)
    checkLoginStatus() {
      const userStore = useUserStore();
      console.log(userStore.getUser());
      this.isLoggedIn = !!userStore.getUser().token; // Si le token existe, l'utilisateur est connecté
      this.isAdmin = userStore.userHasRole("ROLE_ADMIN"); // Si le token existe, l'utilisateur est admin
    },
    // Fonction de déconnexion
    logout() {
      const userStore = useUserStore();
      userStore.setUser({}, { saveToLocalStorage: true }); // Supprimer le token ou toute autre donnée d'authentification
      this.isLoggedIn = false; // Mettre à jour l'état de connexion
      this.$router.push("/login"); // Rediriger l'utilisateur vers la page de connexion
    },
  },
};
</script>
<style lang="scss">
@import "@/styles/scss/navbar.scss";
</style>

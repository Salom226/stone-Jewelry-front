<template>
  <Menubar :model="items">
    <template #start>
      <router-link to="/">
        <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8">
          <path d="..." fill="var(--p-primary-color)" />
          <path d="..." fill="var(--p-text-color)" />
        </svg>
      </router-link>
    </template>

    <template #item="{ item, props, hasSubmenu, root }">
      <router-link v-bind="props" :to="item.to" class="items-center">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <i v-if="hasSubmenu" :class="[
          'pi pi-angle-down',
          { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
        ]"></i>
        <Badge v-if="item.badge" :value="item.badge" />
      </router-link>
    </template>

    <template #end>
      <div class="navbar-end">
        <router-link v-if="!isLoggedIn" to="/login" class="mr-2">Connexion</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="ml-2">Inscription</router-link>
        <router-link v-if="isLoggedIn && isAdmin" to="/admin" class="ml-2">Admin</router-link>
        <a v-if="isLoggedIn" href="#" @click="logout">Déconnexion</a>
      </div>
    </template>
  </Menubar>
</template>
<script>
import Menubar from "primevue/menubar";
import { useUserStore } from "@/store/user.store";
import { getCartItemCount } from "@/store/cart.store";

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
    this.updateCartBadge();
    this.emitter.on('login', () => {
      this.checkLoginStatus();
    });
    this.emitter.on('cartUpdate', () => {
      this.updateCartBadge();
    });
  },
  methods: {
    // Vérifier si l'utilisateur est connecté
    checkLoginStatus() {
      const userStore = useUserStore();
      console.log(userStore.getUser());
      this.isLoggedIn = !!userStore.getUser().token;
      this.isAdmin = userStore.userHasRole("ROLE_ADMIN");
    },
    // Fonction de déconnexion
    logout() {
      const userStore = useUserStore();
      userStore.setUser({}, { saveToLocalStorage: true });
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
    updateCartBadge() {
      const totalItems = getCartItemCount();
      this.items = [this.items[0], { ...this.items[1], badge: totalItems > 0 ? totalItems : null }];
    },
  },
};
</script>
<style lang="scss">
@import "@/styles/scss/navbar.scss";
</style>

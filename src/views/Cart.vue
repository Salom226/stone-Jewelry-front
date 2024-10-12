<template>
  <div>
    <h1>Mon Panier</h1>
    <div v-if="items && items.length">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <p>ID du produit : {{ item.id }}</p>
        <p>Quantité : {{ item.quantity }}</p>
        <button @click="removeProductFromCart(item.id)">Retirer du panier</button>
      </div>
      <button @click="clearCart">Vider le panier</button> <!-- Bouton pour vider le panier -->
    </div>
    <div v-else>
      <p>Le panier est vide.</p>
    </div>
  </div>
</template>

<script>
import { removeFromCart } from '../store/cart.store';
import { clearCart } from '../store/cart.store';


export default {
  data() {
    return {
      items: [] // Tableau pour stocker les IDs et quantités
    };
  },
  mounted() {
    this.fetchCart(); // Charger les éléments du panier depuis le localStorage au montage du composant
  },
  methods: {
    fetchCart() {
      // Lire le panier depuis le localStorage
      let cart = localStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart); // Convertir la chaîne JSON en objet
        this.loadCartItems(cart); // Charger les éléments du panier
      } else {
        this.items = []; // Panier vide
      }
    },
    removeProductFromCart(productId) {
    removeFromCart(productId); // Appelle la fonction pour retirer l'élément du panier
    this.fetchCart(); // Recharger les éléments du panier après modification
  },
  clearCart() {
    clearCart(); // Appelle la fonction pour vider le panier
    this.fetchCart(); // Recharger les éléments du panier (qui sera vide)
  },
   
    loadCartItems(cart) {
      // Transformer les données du panier (IDs et quantités) en tableau
      this.items = Object.keys(cart).map(productId => ({
        id: productId, // ID du produit
        quantity: cart[productId] // Quantité correspondante
      }));
    }
  }
};
</script>

<style>
/* Vos styles ici */
</style>
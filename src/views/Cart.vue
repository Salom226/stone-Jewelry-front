<template>
  <div class="cart-container"> <!-- Ajout de la classe -->
    <h1>Mon Panier</h1>
    <div v-if="items && items.length">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <img :src="getProductImageUrl(item.image)" alt="Image du produit" class="product-image" />
        <h5>{{ item.name }}</h5>
        <p>Quantité : {{ item.quantity }}</p>
        <p>Prix unitaire : {{ item.price }} EUR</p>
        <p>Total pour ce produit : {{ item.price * item.quantity }} EUR</p>
        <button @click="removeProductFromCart(item.id)" class="remove-btn">Retirer du panier</button> <!-- Ajout de la classe -->
      </div>
      <div class="cart-total">
        <h3>Total du panier : {{ totalPrice }} EUR</h3>
      </div>
      <button @click="clearCart" class="clear-cart-btn">Vider le panier</button> <!-- Ajout de la classe -->
    </div>
    <div v-else>
      <p class="empty-cart-message">Le panier est vide.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { removeFromCart, clearCart } from '../store/cart.store';


export default {
  data() {
    return {
      items: [] // Tableau pour stocker les IDs et quantités
    };
  },
  computed: {
    // Propriété calculée pour le prix total
    totalPrice() {
      return this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0); // Initialisation de la somme à 0
    }
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
    async loadCartItems(cart) {
  const productIds = Object.keys(cart).join(','); // Joindre les IDs en une chaîne séparée par des virgules
  console.log(productIds); // Voir si la chaîne contient bien les IDs de produits
  try {
    // const response = await axios.post('http://localhost:8000/api/cart-details', {
          // productIds: productIds
        // });
    const response = await axios.get(`http://localhost:8000/products/filtered?ids=${productIds}`);
    const products = response.data;
    this.items = products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity: cart[product.id],
      price: product.price
    }));
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
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
   
  //   loadCartItems(cart) {
  //     // Transformer les données du panier (IDs et quantités) en tableau
  //     this.items = Object.keys(cart).map(productId => ({
  //       id: productId, // ID du produit
  //       quantity: cart[productId] // Quantité correspondante
  //     }));
  getProductImageUrl(image) {
      return `http://localhost:8000/uploads/images/${image}`;

  }
    }
};
</script>

<style lang="scss">
@import '@/styles/scss/cart.scss';
</style>
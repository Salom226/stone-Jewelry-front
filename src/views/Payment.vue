<template>
  <div class="cart-container">
    <h1>Mon Panier</h1>
    <div v-if="items && items.length">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <img :src="getProductImageUrl(item.image)" alt="Image du produit" class="product-image" />
        <h5>{{ item.name }}</h5>
        <p>Quantité : {{ item.quantity }}</p>
        <p>Prix unitaire : {{ item.price }} EUR</p>
        <p>Total pour ce produit : {{ item.price * item.quantity }} EUR</p>
        <button @click="removeProductFromCart(item.id)" class="remove-btn">Retirer du panier</button>
      </div>
      <div class="cart-total">
        <h3>Total du panier : {{ totalPrice }} EUR</h3>
      </div>
      <button @click="clearCart" class="clear-cart-btn">Vider le panier</button>
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
      items: []
    };
  },
  computed: {
    totalPrice() {
      return this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    }
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    fetchCart() {
      let cart = localStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart);
        this.loadCartItems(cart);
      } else {
        this.items = [];
      }
    },
    removeProductFromCart(productId) {
      removeFromCart(productId);
      this.fetchCart();
    },
    clearCart() {
      clearCart();
      this.fetchCart();
    },

    getProductImageUrl(image) {
      return `${import.meta.env.VITE_API_UPLOAD_URL}/images/${image}`;
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/scss/cart.scss';
</style>
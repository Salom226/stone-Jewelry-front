<template>
  <div class="cart-container">
    <h1>Mon Panier</h1>
    <div v-if="items && items.length">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <img :src="getProductImageUrl(item.image)" alt="Image du produit" class="product-image" />
        <h2>{{ item.name }}</h2>
        <p>Quantité : {{ item.quantity }}</p>
        <p>Prix unitaire : {{ item.price }} EUR</p>
        <p>Total pour ce produit : {{ item.price * item.quantity }} EUR</p>
        <button @click="removeProductFromCart(item.id)" class="remove-btn">
          Retirer du panier
        </button>
      </div>
      <div class="cart-total">
        <h3>Total du panier : {{ totalPrice }} EUR</h3>
      </div>
      <div class="cart-buttons">
        <Button @click="validateOrder" label="Passer la commande" class="p-button-success order-btn"
          icon="pi pi-shopping-cart" />
        <Button @click="clearCart" label="Vider le panier" class="p-button-danger" icon="pi pi-trash" />
      </div>
    </div>
    <div v-else>
      <p class="empty-cart-message">Le panier est vide.</p>
    </div>
  </div>
</template>

<style scoped>
.cart-buttons {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 10px;
}
</style>

<script>
import axios from "axios";
import { removeFromCart, clearCart } from "../store/cart.store";

export default {
  data() {
    return {
      items: [],
    };
  },
  computed: {
    totalPrice() {
      return this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    fetchCart() {
      let cart = localStorage.getItem("cart");
      if (cart) {
        console.log(cart);
        cart = JSON.parse(cart);
        this.loadCartItems(cart);
      } else {
        this.items = [];
      }
    },
    async loadCartItems(cart) {
      const productIds = Object.keys(cart).join(",");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/filtered?ids=${productIds}`
        );
        const products = response.data;
        this.items = products.map((product) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: cart[product.id],
          price: product.price,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
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

    async validateOrder() {
      console.log("Commande passée");


      this.$router.push("/orders/validation");
    },

    getProductImageUrl(image) {
      return `${image}`;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/scss/cart.scss";
</style>

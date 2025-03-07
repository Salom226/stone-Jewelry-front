<template>
  <main>
    <div class="cart-container">
      <h1>Panier</h1>
      <div v-if="items && items.length">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="cart-item">
              <td>
                <div class="product-details">
                  <img 
                    :src="getProductImageUrl(item.images?.[0])" 
                    alt="images du produit" 
                    class="product-image"
                  />
                  <span class="product-name">{{ item.name }}</span>
                </div>
              </td>
              <td>
                <span>{{ item.price }}€</span>
              </td>
              <td>
                <div class="quantity-controls">
                  <button @click="decrementQuantity(item.id)" class="quantity-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                      <path d="M220-450v-60h520v60H220Z"/>
                    </svg>
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button @click="incrementQuantity(item.id)" class="quantity-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                      <path d="M450-450H220v-60h230v-230h60v230h230v60H510v230h-60v-230Z"/>
                    </svg>
                  </button>
                </div>
                <button class="remove-btn" @click="removeProductFromCart(item.id)">
                  <span>Retirer</span>
                </button>
              </td>
              <td>
                <span>{{ item.price * item.quantity }}€</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="cart-total">
          <h2>Total du panier : {{ totalPrice }} €</h2>
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
  </main>
</template>

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
          images: product.images,
          quantity: cart[product.id],
          price: product.price,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    },
    incrementQuantity(productId) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        item.quantity++;
        updateCart(productId, item.quantity);
        this.fetchCart();
      }
    },
    decrementQuantity(productId) {
      const item = this.items.find((item) => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
        updateCart(productId, item.quantity);
        this.fetchCart();
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
    getProductImageUrl(imageUrl) {
      return imageUrl || "https://via.placeholder.com/150";
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/scss/cart.scss";
</style>


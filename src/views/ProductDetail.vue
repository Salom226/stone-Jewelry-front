<template>
  <div class="product-detail-container">
    <div class="product-image-container">
      <img :src="getProductImageUrl(product.image)" alt="Product Image" class="product-image" />
    </div>
    <div class="product-info-container">
      <h1 class="product-name">{{ product.name }}</h1>
      <p class="product-description">{{ product.description }}</p>
      <h3 class="product-price">{{ product.price }} EUR</h3>
      <button @click="addToCart(product.id)" class="add-to-cart-btn">Ajouter au panier</button>
    </div>
    <div class="suggested-products">
      <h2>Tu pourrais aussi aimer</h2>
      <div class="suggested-products-list">
        <div v-for="lastProduct in lastProducts" :key="lastProduct.id" class="suggested-product-card">
          <div class="product-link">
            <img :src="getProductImageUrl(lastProduct.image)" alt="Image du produit" class="suggested-product-image" />
            <button class="add-to-cart-btn" @click="addToCart(product.id)">Ajouter au panier</button>
          </div>
          <div class="suggested-product-info">
            <h5 class="suggested-product-name">{{ lastProduct.name }}</h5>
            <h3 class="suggested-product-price">{{ lastProduct.price }} EUR</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { addToCart } from '../store/cart.store';

export default {
  props: {
    id: {
      type: [Number, String], // Accepte à la fois les nombres et les chaînes de caractères
      required: true,
    },
  },
  data() {
    return {
      product: {},
    };
  },
  mounted() {
    this.fetchProductDetails();
  },
  methods: {
    fetchProductDetails() {
      const productId = Number(this.id); // Assurez-vous que l'id est converti en nombre
      axios.get(`http://localhost:8000/products/${productId}`)
        .then(response => {
          this.product = response.data.product;
          this.lastProducts = response.data.last_products;

        })
        .catch(error => {
          console.error(error);
        });
    },
    addToCart(productId) {
      addToCart(productId);
    },
    getProductImageUrl(image) {
      return `http://localhost:8000/uploads/images/${image}`;
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/scss/productDetail.scss';
</style>
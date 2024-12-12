<template>
  <main class="main">
    <div :key="$route.params.id">
      <div class="product-detail-container">
        <div class="product-images-container">
        <div class="product-images-little" v-if="product.images && product.images.length">
          <div v-for="(image, index) in product.images" :key="index" @click="setMainImage(image)" class="small-image-container">
            <img :src="image" alt="image du produit">
          </div>
        </div>
        <div class="product-image-container">
          <img 
          :src="mainImage" 
          alt="Product image" 
          class="product-image"
        />
        </div>
      </div>
        <div class="product-info-container">
          <h1 class="product-name product-name-detail">{{ product.name }}</h1>
          <h2 class="product-price">{{ product.price }}€</h2>
          <p class="product-description">{{ product.description }}</p>

          <button @click="addToCart(product.id)" class="add-to-cart-btn">Ajouter au panier</button>
        </div>
      </div>
      <section class="suggested-products">
        <h2>Tu pourrais aussi aimer</h2>
        <div class="suggested-products-list">
          <div class="suggested-product-card" v-for="lastProduct in filteredLastProducts" :key="lastProduct.id">
            <div class="product-link" @click="goToProductDetail(lastProduct.id)">
              <img 
              :src="getProductImageUrl(lastProduct.images?.[0])" 
              alt="Image du produit" 
              class="suggested-product-image" 
              />
              <button class="add-to-cart" @click.stop="addToCart(product.id)">Ajouter au panier</button>
            </div>
            <div class="suggested-product-info">
              <h3 class="suggested-product-name"  @click="goToProductDetail(lastProduct.id)">{{ lastProduct.name }}</h3>
              <h5 class="suggested-product-price">{{ lastProduct.price.toFixed(2) }}€</h5>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { addToCart } from '../store/cart.store';
import { Api } from '@/helper/api';

export default {
  watch: {
    '$route': 'fetchProductDetails'
  },
  props: {
    id: {
      type: [Number, String], 
      required: true,
    },
  },
  data() {
    return {
      product: {},
      lastProducts: [],
       mainImage: '',
    };
  },
  mounted() {
    console.log('Product ID:', this.id);
    this.fetchProductDetails();
  },
  computed: {
    filteredLastProducts() {
      return this.lastProducts.filter(lastProduct => lastProduct.id !== this.product.id);
    },
  },
  methods: {
    goToProductDetail(productId) {
  console.log('Clic détecté sur le produit ID:', productId); 
  console.log('Redirection vers /product/' + productId);

  this.$router.push(`/product/${productId}`).then(() => {
    console.log('Navigation réussie vers le produit', productId);
  }).catch((error) => {
    console.error('Erreur de redirection:', error);
  });
},

    fetchProductDetails() {
      const productId = Number(this.$route.params.id);
      new Api().get(`/products/${productId}`)
        .then(response => {
          this.product = response.data.product;
          this.lastProducts = response.data.last_products;
         
          if (this.product.images && this.product.images.length > 0) {
            this.mainImage = this.product.images[0];
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    addToCart(productId) {
      addToCart(productId);
    },
    getProductImageUrl(imageUrl) {
      return imageUrl;
    },
    setMainImage(image) {
      this.mainImage = image;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/scss/productDetail.scss';
</style>
<template>
  <main class="main">
    <div>
      <h1>Produits</h1>
      <div class="products-container">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="image-container">
            <router-link :to="`/product/${product.id}`">
              <img 
                :src="getProductImageUrl(product.images?.[0])" 
                alt="images du produit" 
                class="product-image"
              />
            </router-link>
            <div class="add-to-cart">
              <button @click.stop="addToCart(product.id)">Ajouter au panier</button>
            </div>
          </div>
          <div class="product-info">
            <h2 class="product-name product-name-home">{{ product.name }}</h2>
            <h3 class="product-price">{{ product.price.toFixed(2) }} €</h3>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button :disabled="pagination.current_page === 1" @click="prevPage">Précédent</button>
        <span>Page {{ pagination.current_page }} sur {{ pagination.total_pages }}</span>
        <button :disabled="pagination.current_page === pagination.total_pages" @click="nextPage">Suivant</button>
      </div>
    </div>
  </main>
</template>

  
  <script>
import axios from 'axios'; 
import { addToCart } from '../store/cart.store';
import { Api } from '@/helper/api';


export default {
  data() {
    return {
      products: [],
      pagination: {
        current_page: 1,
        total_pages: 1,
      },
    };
  },
  mounted() {
    this.fetchProducts(); 
  },
  methods: {
    fetchProducts(page = 1) {
      new Api().get(`/products?page=${page}`)
      
        .then(response => {
            console.log(response.data); 
          this.products = response.data.products;
          this.pagination = response.data.pagination;
        })
        .catch(error => {
          console.error(error);
        });
    },
    addToCart(productId) {
      addToCart(productId);
    },
    nextPage() {
      if (this.pagination.current_page < this.pagination.total_pages) {
        this.fetchProducts(this.pagination.current_page + 1);
      }
    },
    prevPage() {
      if (this.pagination.current_page > 1) {
        this.fetchProducts(this.pagination.current_page - 1);
      }
    },
    getProductImageUrl(imageUrl) {
      return imageUrl || "https://via.placeholder.com/150";
    },
  }
};
</script>
<style lang="scss">
  @import '@/styles/scss/home.scss';
</style>
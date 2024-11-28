<template>
    <div class="category-page">
        <h1 class="category-title">{{ categoryName }}</h1>
        <div class="product-container">
          <div v-for="product in products" :key="product.id" class="product-card">
            <img v-bind:src="product.image" alt="product.name" class="product-image" />
            <p class="product-name">{{ product.name }}</p>
            <p class="product-price">{{ product.price }} €</p>
          </div>
        </div>
        <p v-if="!products.length">Aucun produit dans cette catégorie.</p>
      </div>
</template>
  
  <script>
  import axios from 'axios';
  import { Api } from '@/helper/api';
  
  export default {
    props: ['id'],
    data() {
      return {
        products: [],
        categoryName: '',
        id: this.$route.params.id,
      };
    },
    mounted() {
      this.fetchCategoryProducts();
    },
    watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.id = newId;
        this.fetchCategoryProducts(); 
      },
    },
  },
    methods: {
      async fetchCategoryProducts() {
        try {
            if (!this.id) {
            throw new Error('ID de la catégorie non défini.');
            }
            const response = await new Api().get(`/products/category/${this.id}`);
            this.categoryName = response.data.category; 
            this.products = response.data.products; 
            } catch (error) {
            console.error('Erreur lors de la récupération des produits ou de la catégorie', error);

      this.categoryName = 'Catégorie inconnue';
      this.products = [];
    }
      }
    }
  };

</script>

<style lang="scss">
  @import '@/styles/scss/bijouxCategory.scss';
</style>

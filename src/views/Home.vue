<template>
    <!-- <div class="product-container">
      <h1>Produits</h1>
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="getProductImage(product.image)" class="product-image" alt="Product Image">
          <div class="product-body">
            <router-link :to="{ name: 'productShow', params: { id: product.id } }" class="product-title">
              {{ product.name }}
            </router-link>
            <p class="product-description">{{ truncateDescription(product.description) }} ..</p>
            <h3 class="product-price">{{ product.price }} EUR</h3>
            <router-link :to="{ name: 'addToCart', params: { id: product.id } }" class="add-to-cart">Ajouter au panier</router-link>
          </div>
        </div>
      </div>
      <br><br><br>
      <Pagination :paginationData="paginationData" @page-changed="onPageChanged" />
    </div> -->
  </template>
  
  <script>

// import Pagination from './Pagination.vue'; // Assume you have a pagination component

export default {
  components: {
    Pagination,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    paginationData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getProductImage(image) {
      return require(`@/assets/uploads/images/${image}`);
    },
    truncateDescription(description) {
      return description.length > 60 ? description.slice(0, 60) : description;
    },
    onPageChanged(page) {
      // Handle the page change event here
      this.$emit('page-changed', page);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/scss/home.scss';
</style>
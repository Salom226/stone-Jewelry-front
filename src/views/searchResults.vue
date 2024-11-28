<template>
    <div v-if="searchResults.length">
      <h2>Résultats de la recherche</h2>
      <ul>
        <li v-for="product in searchResults" :key="product.id">
          <img :src="product.image" alt="Product image" />
          <p>{{ product.name }}</p>
          <p>{{ product.price }} €</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        searchResults: [],
      };
    },
    methods: {
      handleSearch() {
        if (this.searchQuery.length > 2) {
          this.searchProducts();
        }
      },
  
      searchProducts() {
        new Api().get(`products/search?q=${this.searchQuery}`)
          .then((response) => {
            this.searchResults = response.data;
          })
          .catch((error) => {
            console.error('Erreur de recherche', error);
          });
      },
    },
  };
  </script>
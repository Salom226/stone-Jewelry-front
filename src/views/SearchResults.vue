<template>
    <main v-if="searchResults.length">
      <h2>Résultats de la recherche</h2>
      <ul>
        <li v-for="product in searchResults" :key="product.id">
          <p>{{ product.name }}</p>
          <p>{{ product.price }} €</p>
        </li>
      </ul>
    </main>
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
            console.log("Données produits reçues:", response.data);
      this.searchResults = response.data;
          })
          .catch((error) => {
            console.error('Erreur de recherche', error);
          });
      },
    },
  };
  </script>
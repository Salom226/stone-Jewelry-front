<template>
    <div>
      <h1>Mon Panier</h1>
      <div v-if="items && items.length">
        <div v-for="item in items" :key="item.product.id" class="cart-item">
          <img :src="getProductImageUrl(item.product.image)" alt="Image du produit" />
          <h5>{{ item.product.name }}</h5>
          <p>Quantité : {{ item.quantity }}</p>
          <h3>{{ item.product.price }} EUR</h3>
        </div>
        <h2>Total : {{ total }} EUR</h2>
      </div>
      <div v-else>
        <p>Le panier est vide.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        items: [],
        total: 0,
        shippingCost: 0,
      };
    },
    mounted() {
      this.fetchCart();
    },
    methods: {
      fetchCart() {
        axios.get('http://localhost:8000/cart')
          .then(response => {
            console.log(response.data);
            this.items = response.data.items; // Mettre à jour les éléments du panier
            this.total = response.data.total; // Mettre à jour le total
            this.shippingCost = response.data.shippingCost; // Mettre à jour les frais d'expédition
          })
          .catch(error => {
            console.error(error);
          });
      },
      getProductImageUrl(image) {
        return `http://localhost:8000/uploads/images/${image}`;
      }
    }
  };
  </script>
  
  <style>
  /* Vos styles ici */
  </style>
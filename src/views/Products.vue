<template>
  <div>
    <h1>Produits</h1>
    <div class="products-container">
      <div v-for="product in products" :key="product.id" class="product-card">
        <router-link :to="`/product/${product.id}`">
          <img :src="getProductImageUrl(product.image)" alt="Image du produit" class="product-image" />
        </router-link>
        <div class="product-info">
          <h5 class="product-name">{{ product.name }}</h5>
          <p class="product-description">{{ product.description.substring(0, 60) }}...</p>
          <h3 class="product-price">{{ product.price }} EUR</h3>
          <button class="add-to-cart" @click="addToCart(product.id)">Ajouter au panier</button>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button :disabled="pagination.current_page === 1" @click="prevPage">Précédent</button>
      <span>Page {{ pagination.current_page }} sur {{ pagination.total_pages }}</span>
      <button :disabled="pagination.current_page === pagination.total_pages" @click="nextPage">Suivant</button>
    </div>
  </div>

  <Toast />
</template>


<script>
import axios from 'axios';
import { addToCart } from '../store/cart.store';
import { Api } from '@/helper/api';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";


export default {
  setup() {
    const toast = useToast();

    const showToast = (message) => {
      toast.add({
        severity: "success",
        summary: "Succès",
        detail: message,
        life: 3000
      });
    };

    return {
      showToast,
    };
  },
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
    this.fetchProducts(); // Appel de la méthode fetchProducts au montage
  },
  methods: {
    fetchProducts(page = 1) {
      new Api().get(`/products?page=${page}`)

        .then(response => {
          console.log(response.data); // Ajoutez cette ligne pour vérifier la réponse

          this.products = response.data.products;
          this.pagination = response.data.pagination;
        })
        .catch(error => {
          console.error(error);
        });
    },
    showSuccess(message) {
      this.showToast(message);

    },
    addToCart(productId) {
      addToCart(productId);
      this.showSuccess("Produit ajouté au panier avec succès");
      this.emitter.emit("cartUpdate");
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
    getProductImageUrl(image) {
      return `http://localhost:8000/uploads/images/${image}`;
    }
  }
};
</script>
<style lang="scss">
@import '@/styles/scss/home.scss';
</style>
<template>
    <div class="cart-container"> 
        <h1>Mon Panier</h1>
        <div v-if="items && items.length">
        <div v-for="item in items" :key="item.id" class="cart-item">
            <img :src="getProductImageUrl(item.image)" alt="Image du produit" class="product-image" />
            <h5>{{ item.name }}</h5>
            <p>Quantité : {{ item.quantity }}</p>
            <p>Prix unitaire : {{ item.price }} EUR</p>
            <p>Total pour ce produit : {{ item.price * item.quantity }} EUR</p>
            <button @click="removeProductFromCart(item.id)" class="remove-btn">Retirer du panier</button> 
        </div>
        <div class="cart-total">
            <h3>Total du panier : {{ totalPrice }} EUR</h3>
        </div>
        <button @click="clearCart" class="clear-cart-btn">Vider le panier</button> 
        </div>
        <div v-else>
        <p class="empty-cart-message">Le panier est vide.</p>
        </div>
    </div>
    <div class="container">
      <h1>Formulaire de commande</h1>
  
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input 
            type="text" 
            v-model="form.firstName" 
            class="form form-control" 
            id="firstName" 
            placeholder="Votre prénom" 
            required 
          />
        </div>
  
        <div class="form-group">
          <label for="lastName">Nom</label>
          <input 
            type="text" 
            v-model="form.lastName" 
            class="form form-control" 
            id="lastName" 
            placeholder="Votre nom" 
            required 
          />
        </div>
  
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            v-model="form.email" 
            class="form form-control" 
            id="email" 
            placeholder="Votre email" 
            required 
          />
        </div>
  
        <div class="form-group">
          <label for="phone">Téléphone</label>
          <input 
            type="text" 
            v-model="form.phone" 
            class="form form-control" 
            id="phone" 
            placeholder="Votre téléphone" 
            required 
          />
        </div>
  
        <div class="form-group">
          <label for="adress">Adresse</label>
          <input 
            type="text" 
            v-model="form.adress" 
            class="form form-control" 
            id="adress" 
            placeholder="Votre adresse" 
            required 
          />
        </div>
  
      
        <button type="submit" class="btn btn-primary">Commander</button>
      </form>
    </div>
  </template>
  
  <script>
import axios from 'axios';
import { removeFromCart, clearCart } from '../store/cart.store';


  export default {
    data() {
      return {
        form: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          adress: '',
          city: null
        },
        items: [], 
    
      };
    },
    computed: {
    totalPrice() {
      return this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    }
  },
  mounted() {
    this.fetchCart();
  },
    methods: {
      fetchCart() {
      let cart = localStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart); 
        this.loadCartItems(cart); 
      } else {
        this.items = [];
      }
    },
    async loadCartItems(cart) {
  const productIds = Object.keys(cart).join(','); 
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/filtered?ids=${productIds}`);
    const products = response.data;
    this.items = products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity: cart[product.id],
      price: product.price
    }));
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
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
  getProductImageUrl(image) {
      return `${import.meta.env.VITE_API_UPLOAD_URL}/images/${image}`;

  },
      async submitForm() {
        try {
          const response = await fetch(import.meta.env.VITE_API_URL + '/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.form)
          });
  
          if (response.ok) {
            const result = await response.json();
            alert('Commande envoyée avec succès!');
            this.resetForm();
          } else {
            alert('Erreur lors de l\'envoi de la commande');
          }
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      resetForm() {
        this.form = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          adress: '',
        };
      },
    }
  };
  </script>
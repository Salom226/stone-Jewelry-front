<template>
    <div class="cart-container"> <!-- Ajout de la classe -->
        <h1>Mon Panier</h1>
        <div v-if="items && items.length">
        <div v-for="item in items" :key="item.id" class="cart-item">
            <img :src="getProductImageUrl(item.image)" alt="Image du produit" class="product-image" />
            <h5>{{ item.name }}</h5>
            <p>Quantité : {{ item.quantity }}</p>
            <p>Prix unitaire : {{ item.price }} EUR</p>
            <p>Total pour ce produit : {{ item.price * item.quantity }} EUR</p>
            <button @click="removeProductFromCart(item.id)" class="remove-btn">Retirer du panier</button> <!-- Ajout de la classe -->
        </div>
        <div class="cart-total">
            <h3>Total du panier : {{ totalPrice }} EUR</h3>
        </div>
        <button @click="clearCart" class="clear-cart-btn">Vider le panier</button> <!-- Ajout de la classe -->
        </div>
        <div v-else>
        <p class="empty-cart-message">Le panier est vide.</p>
        </div>
    </div>
    <div class="container">
      <h1>Formulaire de commande</h1>
  
      <!-- Formulaire de commande -->
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
  
        <!-- <div class="form-group">
          <label for="city">Ville</label>
          <select 
            v-model="form.city" 
            class="form form-control" 
            id="city" 
            required>
            <option 
              v-for="city in cities" 
              :key="city.id" 
              :value="city.id">
              {{ city.name }}
            </option>
          </select>
        </div> -->
  
        <!-- Soumettre le formulaire -->
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
        items: [], // Tableau pour stocker les IDs et quantités
        // cities: [] // Remplir cette liste par une requête à l'API
      };
    },
    computed: {
    // Propriété calculée pour le prix total
    totalPrice() {
      return this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0); // Initialisation de la somme à 0
    }
  },
  mounted() {
    this.fetchCart(); // Charger les éléments du panier depuis le localStorage au montage du composant
  },
    methods: {
      fetchCart() {
      // Lire le panier depuis le localStorage
      let cart = localStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart); // Convertir la chaîne JSON en objet
        this.loadCartItems(cart); // Charger les éléments du panier
      } else {
        this.items = []; // Panier vide
      }
    },
    async loadCartItems(cart) {
  const productIds = Object.keys(cart).join(','); // Joindre les IDs en une chaîne séparée par des virgules
  try {
    const response = await axios.get(`http://localhost:8000/products/filtered?ids=${productIds}`);
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
    removeFromCart(productId); // Appelle la fonction pour retirer l'élément du panier
    this.fetchCart(); // Recharger les éléments du panier après modification
  },
  clearCart() {
    clearCart(); // Appelle la fonction pour vider le panier
    this.fetchCart(); // Recharger les éléments du panier (qui sera vide)
  },
  getProductImageUrl(image) {
      return `http://localhost:8000/uploads/images/${image}`;

  },
      // Méthode pour soumettre le formulaire
      async submitForm() {
        try {
          // Vous pouvez remplacer l'URL par celle de votre API Symfony
          const response = await fetch('http://localhost:8000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.form)
          });
  
          if (response.ok) {
            const result = await response.json();
            alert('Commande envoyée avec succès!');
            // Réinitialiser le formulaire
            this.resetForm();
          } else {
            alert('Erreur lors de l\'envoi de la commande');
          }
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      // Méthode pour réinitialiser le formulaire après soumission
      resetForm() {
        this.form = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          adress: '',
          // city: null
        };
      },
      
      // Récupération de la liste des villes depuis l'API
      // async fetchCities() {
      //   try {
      //     const response = await fetch('/api/cities');
      //     const data = await response.json();
      //     this.cities = data;
      //   } catch (error) {
      //     console.error('Erreur lors de la récupération des villes:', error);
      //   }
      // }
    },
    // mounted() {
    //   // Appel API pour récupérer les villes au chargement du composant
    //   this.fetchCities();
    // },

  };
  </script>
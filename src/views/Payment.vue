<template>
    <div>
      <h2>Paiement</h2>
      <p>Total : {{ total }} €</p>
  
      <!-- Afficher les articles du panier -->
      <div v-for="item in cartItems" :key="item.id">
        <p>{{ item.name }} - Quantité : {{ item.quantity }}</p>
        <p>Prix : {{ item.price * item.quantity }} €</p>
      </div>
  
      <button @click="startPayment">Payer avec Stripe</button>
    </div>
  </template>
  
  <script>
  import { loadStripe } from '@stripe/stripe-js';
  import { getCart } from '../store/cart.store'; // Supposons que cette fonction existe pour récupérer le panier
  
  export default {
    data() {
      return {
        stripe: null,
        cartItems: [], // Le panier chargé
        total: 0 // Le total du panier
      };
    },
    async mounted() {
      // Charger la clé publique Stripe
      this.stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);
  
      // Récupérer le panier depuis localStorage
      this.fetchCart();
    },
    methods: {
      fetchCart() {
        const cart = getCart();
        this.cartItems = cart.items; // Exemple: suppose que getCart() retourne un objet avec items
        this.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      async startPayment() {
        try {
          const response = await fetch('/api/stripe/create-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cart: this.cartItems,
              shippingCost: 10
            }),
          });
  
          const session = await response.json();
  
          const { error } = await this.stripe.redirectToCheckout({
            sessionId: session.id,
          });
  
          if (error) {
            console.error("Erreur de redirection : ", error);
          }
        } catch (error) {
          console.error("Erreur lors du paiement : ", error);
        }
      },
    },
  };
  </script>
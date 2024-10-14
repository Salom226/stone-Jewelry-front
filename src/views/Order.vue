<template>
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
  
        <div class="form-group">
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
        </div>
  
        <!-- Soumettre le formulaire -->
        <button type="submit" class="btn btn-primary">Commander</button>
      </form>
    </div>
  </template>
  
  <script>
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
        cities: [] // Remplir cette liste par une requête à l'API
      };
    },
    methods: {
      // Méthode pour soumettre le formulaire
      async submitForm() {
        try {
          // Vous pouvez remplacer l'URL par celle de votre API Symfony
          const response = await fetch('/api/orders', {
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
          city: null
        };
      },
      // Récupération de la liste des villes depuis l'API
      async fetchCities() {
        try {
          const response = await fetch('/api/cities');
          const data = await response.json();
          this.cities = data;
        } catch (error) {
          console.error('Erreur lors de la récupération des villes:', error);
        }
      }
    },
    mounted() {
      // Appel API pour récupérer les villes au chargement du composant
      this.fetchCities();
    }
  };
  </script>
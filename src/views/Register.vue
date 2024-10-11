<template>
    <div>
      <h1>Inscription</h1>
      <form @submit.prevent="registerUser">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
        
        <label for="password">Mot de passe:</label>
        <input type="password" v-model="password" required />
  
        <button type="submit">S'inscrire</button>
      </form>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        successMessage: '',
        errorMessage: ''
      };
    },
    methods: {
      registerUser() {
        axios.post('http://localhost:8000/api/register', {
          email: this.email,
          plainPassword: this.password
        })
        .then(response => {
          this.successMessage = response.data.message;
        })
        .catch(error => {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription';
        });
      }
    }
  };
  </script>
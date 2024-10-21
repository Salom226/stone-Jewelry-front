<template>
    <div>
      <h1>Ajouter une nouvelle catégorie</h1>
      <form @submit.prevent="addCategory">
        <div>
          <label for="name">Nom</label>
          <input type="text" v-model="name" required />
        </div>
        <button type="submit" class="btn btn-primary">Ajouter</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
      };
    },
    methods: {
      async addCategory() {
        try {
          await axios.post('/api/categories', { name: this.name });
          this.$router.push({ name: 'CategoryList' });
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
      },
    },
  };
  </script>
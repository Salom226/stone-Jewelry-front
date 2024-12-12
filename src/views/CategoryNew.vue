<template>
    <main>
      <h1>Ajouter une nouvelle catégorie</h1>
      <form @submit.prevent="addCategory">
        <div>
          <label for="name">Nom</label>
          <input type="text" v-model="name" required />
        </div>
        <button type="submit" class="btn btn-primary">Ajouter</button>
      </form>
    </main>
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
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, {
          name: this.name
        });
          this.$router.push({ name: 'CategoryList' }); 
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
      },
    },
  };
  </script>
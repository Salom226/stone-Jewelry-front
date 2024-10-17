<template>
    <div>
      <h1>Modifier la catégorie</h1>
      <form @submit.prevent="updateCategory">
        <div>
          <label for="name">Nom</label>
          <input type="text" v-model="name" required />
        </div>
        <button type="submit" class="btn btn-primary">Modifier</button>
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
    async mounted() {
      const id = this.$route.params.id;
      const response = await axios.get(`/api/categories/${id}`);
      this.name = response.data.name;
    },
    methods: {
      async updateCategory() {
        const id = this.$route.params.id;
        try {
          await axios.put(`/api/categories/${id}`, { name: this.name });
          this.$router.push({ name: 'CategoryList' }); // Rediriger vers la liste des catégories
        } catch (error) {
          console.error('Erreur lors de la modification de la catégorie:', error);
        }
      },
    },
  };
  </script>
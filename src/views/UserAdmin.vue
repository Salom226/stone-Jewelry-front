<template>
    <div>
      <h1>Liste des utilisateurs</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rôles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles.join(', ') }}</td>
            <td>
              <button @click="addEditorRole(user.id)">Ajouter rôle éditeur</button>
              <button @click="removeUser(user.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        successMessage: '',
        errorMessage: ''
      };
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      fetchUsers() {
        axios.get('http://localhost:8000/api/users')
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            this.errorMessage = 'Une erreur est survenue lors de la récupération des utilisateurs';
          });
      },
      addEditorRole(userId) {
        axios.patch(`http://localhost:8000/api/user/${userId}/to/editor`)
          .then(response => {
            this.successMessage = response.data.message;
            this.fetchUsers(); // Rafraîchit la liste des utilisateurs
          })
          .catch(error => {
            this.errorMessage = 'Une erreur est survenue lors de l\'ajout du rôle';
          });
      },
      removeUser(userId) {
        axios.delete(`http://localhost:8000/api/user/${userId}/remove`)
          .then(response => {
            this.successMessage = response.data.message;
            this.fetchUsers(); // Rafraîchit la liste des utilisateurs
          })
          .catch(error => {
            this.errorMessage = 'Une erreur est survenue lors de la suppression de l\'utilisateur';
          });
      }
    }
  };
  </script>
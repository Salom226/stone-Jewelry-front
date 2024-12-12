<template>
  <main class="container security-form">
    <div class="login-form">
      <h1>Inscription</h1>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" class="form-control" placeholder="Email" required />
        </div>

        <div class="form-group">
          <label for="firstName">Nom:</label>
          <input type="text" v-model="firstName" class="form-control" placeholder="Nom" required />
        </div>

        <div class="form-group">
          <label for="lastName">Prénom:</label>
          <input type="text" v-model="lastName" class="form-control" placeholder="Prénom" required />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe:</label>
          <input type="password" v-model="password" class="form-control" placeholder="Mot de passe" required />
        </div>

        <div class="form-group">
          <label for="agreeTerms">
            <input type="checkbox" v-model="agreeTerms" required />
            J'accepte les termes et conditions
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          S'inscrire
        </button>
      </form>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      agreeTerms: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    registerUser() {
      if (!this.agreeTerms) {
        this.errorMessage = "Vous devez accepter les termes et conditions.";
        return;
      }
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}`, {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          plainPassword: this.password,
        })
        .then((response) => {
          this.successMessage = "Inscription réussie !";
          this.errorMessage = "";

          window.location.href = "/";
        })
        .catch((error) => {
          this.errorMessage = "Une erreur est survenue lors de l'inscription.";
          this.successMessage = "";
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/scss/register.scss";
</style>

<template>
  <div class="container security-form">
    <div class="login-form">
      <h1 class="h3 mb-3 font-weight-normal">Connexion</h1>
      <form @submit.prevent="handleLogin">
        <!-- Error message -->
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <!-- Username (Email) field -->
        <div class="form-group">
          <label for="inputEmail">Email</label>
          <input
            v-model="form.username"
            type="email"
            name="_username"
            id="inputEmail"
            class="form-control"
            placeholder="Enter your email"
            required
            autofocus
          />
        </div>

        <!-- Password field -->
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            v-model="form.password"
            type="password"
            name="_password"
            id="inputPassword"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- CSRF Token -->
        <input type="hidden" name="_csrf_token" :value="form.csrfToken" />

        <!-- Remember Me checkbox -->
        <div class="checkbox mb-3">
          <label>
            <input
              v-model="form.rememberMe"
              type="checkbox"
              name="_remember_me"
            />
            Remember me
          </label>
        </div>

        <!-- Submit button -->
        <button class="btn btn-lg btn-primary btn-block" type="submit">
          Sign in
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/store/user.store.js";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        csrfToken: "",
        rememberMe: false,
      },
      error: null,
      userStore: useUserStore(),
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/login",
          {
            username: this.form.username,
            password: this.form.password,
            remember_me: this.form.rememberMe,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 200 || !response.data.token) {
          throw new Error("Identifiants de connexion invalides.");
        }

        const { token, roles } = response.data;

        // Utiliser le store pour sauvegarder les informations de l'utilisateur
        this.userStore.setUser({ token, roles }, { saveToLocalStorage: true });

        // Rediriger vers la page d'accueil
        this.$router.push("/");
      } catch (error) {
        this.error = error.message;
      }
    },
    async fetchCsrfToken() {
      try {
        const response = await fetch("http://localhost:8000/get-csrf-token");
        const data = await response.json();
        this.form.csrfToken = data.token;
      } catch (error) {
        this.error = "Failed to fetch CSRF token.";
      }
    },
  },
  mounted() {
    // Charger l'utilisateur depuis le localStorage au montage du composant
    this.userStore.loadUserFromLocalStorage();
  },
};
</script>

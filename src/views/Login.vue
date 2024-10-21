<template>
  <div class="container security-form">
    <div class="login-form">
      <h1 class="h3 mb-3 font-weight-normal">Connexion</h1>
      <form @submit.prevent="handleLogin">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="form-group">
          <label for="inputEmail">Email</label>
          <input v-model="form.username" type="email" name="_username" id="inputEmail" class="form-control"
            placeholder="Enter your email" required autofocus />
        </div>

        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input v-model="form.password" type="password" name="_password" id="inputPassword" class="form-control"
            placeholder="Enter your password" required />
        </div>

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
          import.meta.env.VITE_API_URL + "/login",
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


        this.userStore.setUser({ token, roles }, { saveToLocalStorage: true });
        console.log(token);

        this.$router.push("/");
        this.emitter.emit('login');
      } catch (error) {
        this.error = error.message;
      }
    },
  },
  mounted() {
    this.userStore.loadUserFromLocalStorage();
  },
};
</script>

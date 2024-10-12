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
              /> Remember me
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
  import axios from 'axios';
  export default {
    data() {
      return {
        form: {
          username: "", // Change 'email' to 'username' for compatibility
          password: "",
          csrfToken: "", // CSRF token will be fetched from the backend
          rememberMe: false,
        },
        error: null, // Error message if login fails
      };
    },
    methods: {
        async handleLogin() {
    try {
        const response = await axios.post('http://localhost:8000/api/login', {
              username: this.form.username,
              password: this.form.password,
              remember_me: this.form.rememberMe
            },{ 

            headers: {
              "Content-Type": "application/json",
            },
            //  body:{ 
            //   username: this.form.username,
            //   password: this.form.password,
            //   remember_me: this.form.rememberMe
            // }
            
        });
        // const tokens = localStorage.getItem('tokens');
        console.log(response);
        // if (!tokens) {
          /* Traitement dans le cas où aucun token n'existe dans le localStorage */
        // }
        
        /* Le localStorage stocke les données sous forme de chaines de caractères nous transformons donc la donnée en JSON */
        // const { accessToken, tokenType } = JSON.parse(tokens);
        
        /* On créer l'en-tête Authorization contenant le JWT */
        // const headers = new Headers();
        // headers.append('Authorization', `${tokenType} ${accessToken}`);
        
        // const options = {
        //   method: 'GET',
        //   mode: 'cors',
        //   headers
        // };

        if (response.status !== 200) {
            throw new Error('Invalid login credentials.');
        }

        // Rediriger vers la page d'accueil ou un chemin souhaité après une connexion réussie
        window.location.href = '/';
    } catch (error) {
        // Afficher le message d'erreur en cas d'échec de la connexion
        this.error = error.message;
    }
},
      async fetchCsrfToken() {
        try {
          const response = await fetch('http://localhost:8000/get-csrf-token');
          const data = await response.json();
          this.form.csrfToken = data.token;
        } catch (error) {
          this.error = "Failed to fetch CSRF token.";
        }
      },
    },
    mounted() {
      // Fetch CSRF token when the component is mounted
      this.fetchCsrfToken();
    },
  };
  </script>
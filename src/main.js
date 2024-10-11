import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from './router/router'; // Importez votre fichier de routeur

const app = createApp(App);

// Utiliser le router
app.use(router); // Assurez-vous que ceci est bien là

app.mount('#app');
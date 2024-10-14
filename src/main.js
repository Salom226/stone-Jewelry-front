import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Menubar from 'primevue/menubar'
import './style.css'
import App from './App.vue';
import router from './router/router'; // Importez votre fichier de routeur

const app = createApp(App);

app.use(router); // Make sure the router is used
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.component('Menubar', Menubar);
app.mount('#app');
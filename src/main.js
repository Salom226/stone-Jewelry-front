import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "./style.css";
import App from "./App.vue";
import axios from "axios";
import router from "./router/router"; // Importez votre fichier de routeur
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(router); // Make sure the router is used
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.mount("#app");

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupérer le token depuis localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Ajouter le token dans les headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;

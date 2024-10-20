import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "./style.css";
import App from "./App.vue";
import router from "./router/router"; // Importez votre fichier de routeur
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import "primeicons/primeicons.css";
import mitt from 'mitt';
const emitter = mitt();

const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.use(router); // Make sure the router is used
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.mount("#app");
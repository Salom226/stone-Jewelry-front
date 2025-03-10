import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import App from "./App.vue";
import router from "./router/router";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import "primeicons/primeicons.css";
import "./style.scss";
import mitt from "mitt";
import Toast from "primevue/toast";

const emitter = mitt();

const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.component("Toast", Toast);
app.use(ConfirmationService);
app.mount("#app");

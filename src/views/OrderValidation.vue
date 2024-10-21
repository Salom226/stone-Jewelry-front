<template>
  <div class="order-validation">
    <h1>Validation de la commande</h1>
    <form @submit.prevent="validateOrder" class="p-fluid">
      <div class="p-field">
        <label for="firstName">Prénom</label>
        <InputText id="firstName" v-model="orderInfo.firstName" required />
      </div>
      <div class="p-field">
        <label for="lastName">Nom</label>
        <InputText id="lastName" v-model="orderInfo.lastName" required />
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText id="email" v-model="orderInfo.email" type="email" required />
      </div>
      <div class="p-field">
        <label for="phone">Téléphone</label>
        <InputText id="phone" v-model="orderInfo.phone" required />
      </div>
      <div class="p-field">
        <label for="address">Adresse</label>
        <Textarea id="address" v-model="orderInfo.address" rows="3" required />
      </div>
      <div class="p-field">
        <label for="city">Ville</label>
        <InputText id="city" v-model="orderInfo.city" required />
      </div>
      <div class="p-field">
        <label for="card-element">Informations de paiement</label>
        <div id="card-element" ref="cardElement"></div>
      </div>
      <Button type="submit" label="Payer et finaliser la commande" icon="pi pi-check" class="p-mt-2"
        :loading="loading" />
    </form>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { Api } from "@/helper/api";
import { useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const stripe = ref(null);
const cardElement = ref(null);

const orderInfo = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
});

onMounted(async () => {
  stripe.value = await loadStripe(
    "pk_test_51Q7YKoP7dqdF5E8UEurDGGI8NhRIPWTw7ZtjH92z7HhauDNJowfk6ZMUfJkrSdhVNFzC07RK1A5ogmAxaMlRTUjD00qA4brWRe"
  );
  const elements = stripe.value.elements();
  cardElement.value = elements.create("card");
  cardElement.value.mount("#card-element");
});

const getCartInfo = () => {
  const cart = localStorage.getItem("cart");
  return JSON.parse(cart);
};

const validateOrder = async () => {
  loading.value = true;
  try {
    let token;
    let error;
    try {
      ({ token, error } = await stripe.value.createToken(cardElement.value));
    } catch (error) {
      console.log(error);
      token = "my_token_test";
    }
  
    if (error) {
      token = "my_token_test";
    }

    const cartInfo = getCartInfo();

    const response = await new Api().post("/orders", {
      ...orderInfo.value,
      stripeToken: token.id,
      cart: cartInfo,
    });

    showSuccess("Commande validée avec succès");
    // Clear cart
    localStorage.removeItem("cart");

    // Redirect to order confirmation page
    router.push({
      name: "Products",
    });
  } catch (error) {
    console.log(error);
    showError("Une erreur est survenue lors de la validation de la commande");
  } finally {
    loading.value = false;
  }
};

const showSuccess = (message) => {
  toast.add({
    severity: "success",
    summary: "Succès",
    detail: message,
    life: 3000,
  });
};

const showError = (message) => {
  toast.add({
    severity: "error",
    summary: "Erreur",
    detail: message,
    life: 3000,
  });
};
</script>

<style scoped>
.order-validation {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: var(--text-color);
  margin-bottom: 20px;
}

.p-field {
  margin-bottom: 1.5rem;
}

:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-dropdown) {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

#card-element {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 10px;
}
</style>

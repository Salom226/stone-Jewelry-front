<template>
  <div class="create-product-admin">
    <h1>Nouveau produit</h1>
    <form @submit.prevent="createProduct" class="p-fluid">
      <div class="p-field">
        <label for="name">Nom</label>
        <InputText id="name" v-model="product.name" required />
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <Textarea id="description" v-model="product.description" rows="5" />
      </div>
      <div class="p-field">
        <label for="price">Prix</label>
        <InputNumber
          id="price"
          v-model="product.price"
          mode="currency"
          currency="EUR"
          locale="fr-FR"
          required
        />
      </div>
      <div class="p-field">
        <label for="image">Image URL</label>
        <InputText id="image" v-model="product.image" />
      </div>
      <div class="p-field">
        <label for="stock">Stock</label>
        <InputNumber id="stock" v-model="product.stock" :min="0" required />
      </div>
      <Button
        type="submit"
        label="Créer le produit"
        icon="pi pi-check"
        class="p-mt-2"
      />
    </form>

    <Toast />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { Api } from "@/helper/api";
import { useRouter } from "vue-router";

const router = useRouter();

const toast = useToast();

const product = ref({
  name: "",
  description: "",
  price: null,
  image: "",
  stock: 0,
});

const createProduct = async () => {
  try {
    const response = await new Api().post("/admin/products", product.value);
    showSuccess("Produit créé avec succès");
    router.push({ name: "ProductAdmin" });
  } catch (error) {
    showError("Une erreur est survenue lors de la création du produit");
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
.create-product-admin {
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
:deep(.p-inputnumber) {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
</style>

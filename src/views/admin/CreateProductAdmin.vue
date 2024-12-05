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
        <label for="images">Images</label>
        <input type="file" id="images" multiple @change="onFilesChange" />
      </div>
      <div class="p-field">
        <label for="stock">Stock</label>
        <InputNumber id="stock" v-model="product.stock" :min="0" required />
      </div>
      <div class="p-field">
        <label for="category">Catégorie</label>
        <Select id="category" v-model="product.categoryId" :options="categories" optionLabel="name" optionValue="id" required />
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
import { ref, onMounted } from "vue";
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
  images: [],
  stock: 0,
});
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await new Api().get("/admin/categories");
    categories.value = response.data;
  } catch (error) {
    showError("Erreur lors de la récupération des catégories.");
    console.error(error);
  }
};
const imageFiles = ref([]);

const onFilesChange = (event) => {
  imageFiles.value = Array.from(event.target.files); // Stocker plusieurs fichiers
};

const createProduct = async () => {
  try {
    if (imageFiles.value.length === 0) {
      showError("Veuillez sélectionner au moins une image");
      return;
    }

    const formData = new FormData();
    imageFiles.value.forEach((file) => {
      formData.append("images[]", file); // Ajouter plusieurs fichiers
    });

    const imageResponse = await new Api().post("/admin/products/upload-multiple", formData);
    const imageUrls = imageResponse.data.imageUrls;

    const payload = {
      name: product.value.name,
      description: product.value.description,
      price: product.value.price,
      images: imageUrls,// URLs des images
      stock: product.value.stock,
      categoryId: product.value.categoryId,
    };

    // Log des données préparées
    console.log("Payload envoyé :", payload);

    // Envoi à l'API
    await new Api().post("/admin/products", payload);
    product.value.images = imageUrls; // Associer les URLs des images au produit

    showSuccess("Produit créé avec succès");
    router.push({ name: "ProductAdmin" });
  } catch (error) {
    showError("Une erreur est survenue lors de la création du produit");
    console.error(error);
  }
};

onMounted(() => {
  fetchCategories();
});

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

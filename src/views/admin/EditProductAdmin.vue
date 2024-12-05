<template>
  <div class="create-product-admin">
    <h1>Modifier produit</h1>
    <form @submit.prevent="editProduct" class="p-fluid">
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
        <InputNumber id="price" v-model="product.price" mode="currency" currency="EUR" locale="fr-FR" required />
      </div>
      <div class="p-field">
        <label for="images">Images</label>

        <div v-if="product.images.length > 0">
          <p>Images actuelles :</p>
          <div class="image-preview-container" v-for="(image, index) in product.images" :key="index">
            <img :src="image" alt="Aperçu" class="image-preview" />
            <Button icon="pi pi-times" class="p-button-rounded p-button-danger" @click="removeExistingImage(index)" />
          </div>
        </div>

        <!-- Upload de nouvelles images -->
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
      <Button type="submit" label="Modifier le produit" icon="pi pi-check" class="p-mt-2" />
    </form>
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
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const toast = useToast();

const product = ref({
  name: "",
  description: "",
  price: null,
  images: [],
  stock: 0,
  categoryId: null,
});

const categories = ref([]);
const imageFiles = ref([]);

const fetchCategories = async () => {
  try {
    const response = await new Api().get("/admin/categories");
    categories.value = response.data;
  } catch (error) {
    showError("Erreur lors de la récupération des catégories.");
    console.error(error);
  }
};

const route = useRoute()

const fetchProductDetails = () => {
  const productId = Number(route.params.id);
  new Api().get(`/products/${productId}`)
    .then(response => {
      product.value = response.data.product;
      console.log("Valeur de product.image :", product.value.image);
    })
    .catch(error => {
      console.error(error);
    });
};

const onFilesChange = (event) => {
  imageFiles.value = Array.from(event.target.files);
};
// Supprimer une image existante
const removeExistingImage = (index) => {
  product.value.images.splice(index, 1);
};
const editProduct = async () => {
  try {
    let newImageUrls = [];

    if (imageFiles.value.length > 0)  {
      const formData = new FormData();
      formData.append("image", imageFiles.value);
      imageFiles.value.forEach((file) => {
        formData.append("images[]", file);
      });
      const uploadResponse = await new Api().post("/admin/products/upload-multiple", formData);
      newImageUrls = uploadResponse.data.imageUrls;
    }

    const updatedProduct = {
      ...product.value,
      images: [...product.value.images, ...newImageUrls], // Combiner les anciennes et nouvelles images
    };
    await new Api().put(`/admin/products/${route.params.id}`, updatedProduct);
    showSuccess("Produit modifié avec succès");
    router.push({ name: "ProductAdmin" });
  } catch (error) {
    showError("Une erreur est survenue lors de la modification du produit.");
    console.error(error);
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
const isLoading = ref(true);
onMounted(async () => {
  try {
    await Promise.all([fetchCategories(), fetchProductDetails()]);
  } catch (error) {
    showError("Erreur lors du chargement des données.");
  } finally {
    isLoading.value = false;
  }
});
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
.image-preview-container {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  text-align: center;
}

.image-preview {
  width: 100px; 
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.p-button-rounded {
  margin-top: 5px;
}
</style>

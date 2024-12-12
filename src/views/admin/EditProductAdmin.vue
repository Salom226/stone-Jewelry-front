<template>
  <main class="create-product-admin">
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
        <input type="file" id="images" multiple @change="onFilesChange" />
        <div v-if="imagePreviews.length > 0">
          <p>Aperçu des images :</p>
          <div
            class="image-preview-container"
            v-for="(image, index) in imagePreviews"
            :key="index"
            :class="{ active: activeImageIndex === index }"
          >
            <img :src="image.src" alt="Aperçu" class="image-preview" @click="selectImage(index)" />
            <Button
              icon="pi pi-times"
              class="p-button-rounded p-button-danger"
              @click="removeImagePreview(index)"
            />
          </div>
        </div>
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
  </main>
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
import { watch } from "vue";

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
const imagePreviews = ref([]);
const activeImageIndex = ref(null);
const isLoading = ref(true);


const fetchCategories = async () => {
  try {
    const response = await new Api().get("/admin/categories");
    categories.value = response.data;
  } catch (error) {
    showError("Erreur lors de la récupération des catégories.");
    console.error(error);
  }
};

const fetchProductDetails = async () => {
  const productId = Number(route.params.id);
  try {
    const response = await new Api().get(`/products/${productId}`);
    const fetchedProduct = response.data.product;

    product.value = {
  ...fetchedProduct,
  categoryId: fetchedProduct.category ? fetchedProduct.category.id : null,
};
imagePreviews.value = fetchedProduct.images.map((url) => ({ type: "existing", src: url }));
imageFiles.value.forEach((file) => {
  imagePreviews.value.push({ type: "new", src: URL.createObjectURL(file) });
});
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du produit :", error);
    showError("Erreur lors de la récupération des détails du produit.");
  }
};

const route = useRoute()
const onFilesChange = (event) => {
  const files = Array.from(event.target.files);
  imageFiles.value.push(...files);

  const newPreviews = files.map((file) => URL.createObjectURL(file));
  newPreviews.forEach((preview) => {
    imagePreviews.value.push({ type: "new", src: preview });
  });
};
const removeImagePreview = (index) => {
  const image = imagePreviews.value[index];

  if(!image) {
    imagePreviews.value.splice(index, 1);
    return;
  }

  if (image.type === "existing") {
    product.value.images.splice(index, 1); 
  } else if (image.type === "new") {
    const newIndex = index - product.value.images.length;
    URL.revokeObjectURL(image.src);
    imageFiles.value.splice(newIndex, 1);
  }

  imagePreviews.value.splice(index, 1);

  if (activeImageIndex.value === index) {
    activeImageIndex.value = null;
  } else if (activeImageIndex.value > index) {
    activeImageIndex.value--;
  }
};
const selectImage = (index) => {
  if (activeImageIndex.value === null) {
    activeImageIndex.value = index;
  } else {
    swapImages(activeImageIndex.value, index);
    activeImageIndex.value = null;
  }
};

const swapImages = (index1, index2) => {
  if(!imagePreviews.value[index1] || !imagePreviews.value[index2]) {
    return;
  }

  const tempPreview = imagePreviews.value[index1];
  
  imagePreviews.value[index1] = imagePreviews.value[index2];
  imagePreviews.value[index2] = tempPreview;
};

const editProduct = async () => {
  try {
    let newImageUrls = [];

    if (imageFiles.value.length > 0)  {
      const formData = new FormData();
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
  cursor: pointer;
}
.image-preview-container.active img{
  border: 2px solid #007ad9;
  border-radius: 4px;
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

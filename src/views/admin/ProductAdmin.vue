<template>
  <div class="products-admin">
    <h1>Gestion des produits</h1>
    <Button label="Ajouter un produit" icon="pi pi-plus" @click="createProductInTable" />
    <div v-if="loading" class="loading-container">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration=".5s" />
    </div>
    <DataView v-else :value="products" :sortOrder="sortOrder" :sortField="sortField" layout="list">
      <template #header>
        <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier par prix"
          @change="onSortChange($event)" />
      </template>
      <template #list="slotProps">
        <div class="product-list">
          <div v-for="(item, index) in slotProps.items" :key="index" class="product-item">
            <div class="product-container">
              <div class="product-image-container">
                <img v-if="item.image" :src="getProductImageUrl(item.image)" :alt="item.name" class="product-image" />
                <!-- <div class="product-tag">
                  <Tag :value="item.inventoryStatus" :severity="getSeverity(item)"></Tag>
                </div> -->
              </div>
              <div class="product-details">
                <div>
                  <span class="product-category">{{ item.category.name }}</span>
                  <h3 class="product-name">{{ item.name }}</h3>
                </div>
                <div class="product-actions">
                  <span class="product-price">{{ item.price }}€</span>
                  <div class="product-buttons">
                    <Button icon="pi pi-pencil" @click="editProduct(item.id)"
                      class="p-button-rounded p-button-success" />
                    <Button icon="pi pi-trash" @click="confirmDeleteProduct(item)"
                      class="p-button-rounded p-button-danger" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>

    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import DataView from "primevue/dataview";
import Select from "primevue/select";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Tag from "primevue/tag";
import { Api } from "@/helper/api";
import { useRouter } from "vue-router";

const router = useRouter();

const products = ref([]);
const toast = useToast();
const confirm = useConfirm();

const sortOptions = ref([
  { label: "Prix croissant", value: "price" },
  { label: "Prix décroissant", value: "!price" },
]);
const sortOrder = ref(1);
const sortField = ref("");
const sortKey = ref(null);

let loading = ref(false);

onMounted(() => {
  fetchProducts();
  console.log(products.value); 
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await new Api().get("/products");
    loading.value = false;
    console.log(response.data.products);
    products.value = response.data.products;
  } catch (error) {
    loading.value = false;
    showError("Une erreur est survenue lors de la récupération des produits");
  }
};

const createProductInTable = () => {
  router.push({ name: "CreateProductAdmin" });
};

const editProduct = (productId) => {
  router.push({ name: "EditProductAdmin", params: { id: productId } });
};

const confirmDeleteProduct = (product) => {
  confirm.require({
    message: `Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`,
    header: "Confirmation de suppression",
    icon: "pi pi-exclamation-triangle",
    accept: () => deleteProduct(product.id),
  });
};

const deleteProduct = async (productId) => {
  try {
    const response = await new Api().delete(`/admin/products/${productId}`);
    showSuccess(response.data.message);
    await fetchProducts();
  } catch (error) {
    showError("Une erreur est survenue lors de la suppression du produit");
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

const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case "INSTOCK":
      return "success";
    case "LOWSTOCK":
      return "warning";
    case "OUTOFSTOCK":
      return "danger";
    default:
      return null;
  }
};

const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = value.startsWith("!") ? -1 : 1;

  sortOrder.value = sortValue;
  sortField.value = value.replace("!", "");
};

const getProductImageUrl = (image) => {
  return `${image}`;
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.products-admin {
  padding: 20px;
}

h1 {
  color: var(--text-color);
  margin-bottom: 20px;
}

.p-button {
  margin-bottom: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
}

.product-list {
  display: flex;
  flex-direction: column;
}

.product-item {
  margin-bottom: 1rem;
}

.product-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.product-image-container {
  position: relative;
  margin-bottom: 1rem;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-tag {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
}

.product-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-category {
  font-size: 0.875rem;
  color: #718096;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.product-buttons {
  display: flex;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .product-container {
    flex-direction: row;
  }

  .product-image-container {
    width: 25%;
    margin-bottom: 0;
  }

  .product-details {
    width: 75%;
    padding-left: 1rem;
  }
}
</style>

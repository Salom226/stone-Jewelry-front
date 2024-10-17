<template>
  <div class="categories-admin">
    <h1>Gestion des catégories</h1>
    <Button
      label="Ajouter une catégorie"
      icon="pi pi-plus"
      @click="createCategoryInTable"
    />
    <div v-if="loading" class="loading-container">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="4"
        animationDuration=".5s"
      />
    </div>
    <DataTable
      v-else
      :value="categories"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      currentPageReportTemplate="Affichage {first} à {last} sur {totalRecords} catégories"
      v-model:editingRows="editingRows"
      @row-edit-save="onRowEditSave"
      @row-edit-cancel="onRowEditCancel"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Titre" sortable>
        <template #body="{ data, field }">
          <div v-if="editingRows.includes(data.id) || data.isAdding">
            <InputText v-model="data[field]" autofocus />
          </div>
          <span v-else>{{ data[field] }}</span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            v-if="
              editingRows.includes(slotProps.data.id) || slotProps.data.isAdding
            "
            icon="pi pi-check"
            class="p-button-rounded p-button-info p-mr-2"
            @click="onValidateCategoryEdition(slotProps.data)"
          />
          <div v-else>
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success p-mr-2"
              @click="editCategory(slotProps.data.id)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="confirmDeleteCategory(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import InputText from "primevue/inputtext";
import { Api } from "@/helper/api";

const categories = ref([]);
const toast = useToast();
const confirm = useConfirm();

const editingRows = ref([]);

let firstLoad = true;
let loading = ref(false);

const fetchCategories = async () => {
  if (firstLoad) {
    loading.value = true;
  }
  try {
    const response = await new Api().get("/categories");
    loading.value = false;
    categories.value = response.data;
  } catch (error) {
    loading.value = false;
    showError("Une erreur est survenue lors de la récupération des catégories");
  }
};

const createCategoryInTable = () => {
  const newCategory = {
    id: "",
    name: "",
    isAdding: true,
  };
  categories.value.push(newCategory);
};

const addCategory = async (category) => {
  try {
    const response = await new Api().post("/categories", {
      name: category.name,
    });
    showSuccess("La catégorie a été ajoutée avec succès");
    await fetchCategories();
  } catch (error) {
    showError("Une erreur est survenue lors de l'ajout de la catégorie");
  }
};

const editCategory = (categoryId) => {
  editingRows.value.push(categoryId);
};

const confirmDeleteCategory = (category) => {
  confirm.require({
    message: `Êtes-vous sûr de vouloir supprimer la catégorie "${category.title}" ?`,
    header: "Confirmation de suppression",
    icon: "pi pi-exclamation-triangle",
    accept: () => deleteCategory(category.id),
  });
};

const deleteCategory = async (categoryId) => {
  try {
    const response = await new Api().delete(`/categories/${categoryId}`);
    showSuccess(response.data.message);
    await fetchCategories();
  } catch (error) {
    showError("Une erreur est survenue lors de la suppression de la catégorie");
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

const onCategoryAdded = async () => {
  await fetchCategories();
  showSuccess("La catégorie a été ajoutée avec succès");
};

const onValidateCategoryEdition = async (category) => {
  if (category.isAdding) {
    category.isAdding = false;
    await addCategory(category);
  } else {
    await onRowEditSave(category.id);
  }
};

const onRowEditSave = async (category) => {
  try {
    editingRows.value = editingRows.value.filter((id) => id !== category.id);
    const response = await new Api().put(`/categories/${categoryId}`, category);
    console.log(response);

    const index = categories.value.findIndex(
      (category) => category.id === categoryId
    );
    categories.value[index] = response.data;
    showSuccess("La catégorie a été mise à jour avec succès");
  } catch (error) {
    showError("Une erreur est survenue lors de la mise à jour de la catégorie");
  }
};

const onRowEditCancel = (event) => {
  // You can add logic here if needed when edit is cancelled
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
:deep(.p-datatable .p-paginator-content) {
  flex-wrap: nowrap;
}

.categories-admin {
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
</style>

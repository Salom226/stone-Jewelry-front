<template>
  <div class="user-admin">
    <h1>Gestion des utilisateurs</h1>
    <Button
      label="Ajouter un utilisateur"
      icon="pi pi-plus"
      @click="openAddUserDialog"
    />
    <DataTable
      :value="users"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      currentPageReportTemplate="Affichage {first} à {last} sur {totalRecords} utilisateurs"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="roles" header="Rôles" sortable>
        <template #body="slotProps">
          {{ slotProps.data.roles.join(", ") }}
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            icon="pi pi-user-edit"
            class="p-button-rounded p-button-success p-mr-2"
            @click="addEditorRole(slotProps.data.id)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="confirmRemoveUser(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <AddUserDialog
      v-model:visible="addUserDialogVisible"
      @user-added="onUserAdded"
    />

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
import AddUserDialog from "./AddUserDialog.vue";
import axios from "axios";
import { Api } from "@/helper/api";

const users = ref([]);
const toast = useToast();
const confirm = useConfirm();

const addUserDialogVisible = ref(false);

const fetchUsers = async () => {
  try {
    const response = await new Api().get("/users");
    console.log(response);
    users.value = response.data;
  } catch (error) {
    showError(
      "Une erreur est survenue lors de la récupération des utilisateurs"
    );
  }
};

const addEditorRole = async (userId) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/user/${userId}/to/editor`
    );
    showSuccess(response.data.message);
    await fetchUsers();
  } catch (error) {
    showError("Une erreur est survenue lors de l'ajout du rôle");
  }
};

const confirmRemoveUser = (user) => {
  confirm.require({
    message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`,
    header: "Confirmation de suppression",
    icon: "pi pi-exclamation-triangle",
    accept: () => removeUser(user.id),
  });
};

const removeUser = async (userId) => {
  try {
    const response = await new Api().delete(`/users/${userId}`);
    showSuccess(response.data.message);
    await fetchUsers();
  } catch (error) {
    showError(
      "Une erreur est survenue lors de la suppression de l'utilisateur"
    );
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

const openAddUserDialog = () => {
  addUserDialogVisible.value = true;
};

const onUserAdded = async () => {
  await fetchUsers();
  showSuccess("L'utilisateur a été ajouté avec succès");
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
:deep(.p-datatable .p-paginator-content) {
  flex-wrap: nowrap;
}

.user-admin {
  padding: 20px;
}

h1 {
  color: var(--text-color);
  margin-bottom: 20px;
}

.p-button {
  margin-bottom: 20px;
}
</style>

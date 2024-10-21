<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    header="Ajouter un utilisateur"
    :style="{ width: '50vw' }"
  >
    <div class="p-fluid">
      <div class="p-field">
        <label for="email">Email</label>
        <InputText id="email" v-model="email" required autofocus />
      </div>
      <div class="p-field">
        <label for="firstName">Prénom</label>
        <InputText id="firstName" v-model="firstName" required autofocus />
      </div>
      <div class="p-field">
        <label for="lastName">Nom</label>
        <InputText id="lastName" v-model="lastName" required autofocus />
      </div>
      <div class="p-field">
        <label for="password">Mot de passe</label>
        <Password id="password" v-model="password" required toggleMask />
      </div>
      <div class="p-field">
        <label for="roles">Rôles</label>
        <MultiSelect
          id="roles"
          v-model="selectedRoles"
          :options="availableRoles"
          optionLabel="name"
          optionValue="value"
          display="chip"
        />
      </div>
    </div>
    <template #footer>
      <Button
        label="Annuler"
        icon="pi pi-times"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button label="Ajouter" icon="pi pi-check" @click="addUser" autofocus />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import { Api } from "@/helper/api";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["update:visible", "user-added"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const email = ref("");
const password = ref("");
const selectedRoles = ref([]);
const firstName = ref("");
const lastName = ref("");

const availableRoles = [
  { name: "Utilisateur", value: "ROLE_USER" },
  { name: "Éditeur", value: "ROLE_EDITOR" },
  { name: "Admin", value: "ROLE_ADMIN" },
];

const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  email.value = "";
  password.value = "";
  selectedRoles.value = [];
};

const addUser = async () => {
  try {
    const response = await new Api().post("/users", {
      username: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      roles: selectedRoles.value,
    });
    emit("user-added");
    closeDialog();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error);
  }
};
</script>

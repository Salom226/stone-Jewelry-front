<template>
  <main class="orders-admin">
    <h1>Gestion des commandes</h1>
    <div v-if="loading" class="loading-container">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration=".5s" />
    </div>
    <DataView v-else :value="orders" :sortOrder="sortOrder" :sortField="sortField" layout="list">
      <template #header>
        <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier par date"
          @change="onSortChange($event)" />
      </template>
      <template #list="slotProps">
        <div class="order-list">
          <div v-for="(item, index) in slotProps.items" :key="index" class="order-item">
            <div class="order-container">
              <div class="order-date">
                {{ formatDate(item.createdAt) }}
              </div>
              <div class="order-names">
                <div>{{ item.firstName }}</div>
                <div>{{ item.lastName }}</div>
              </div>
              <div class="order-phone">
                {{ item.phone }}
              </div>
              <div class="order-price">
                {{ item.totalPrice }}€
              </div>
              <div class="order-state" :class="{ 'completed': item.completed }">
                {{ item.completed ? "Validée" : "En attente" }}
              </div>
              <div class="order-actions">
                <div class="order-buttons">
                  <Button icon="pi pi-check" @click="validateOrder(item.id)"
                    class="p-button-rounded p-button-success" />
                  <Button icon="pi pi-times" @click="confirmDeleteOrder(item)"
                    class="p-button-rounded p-button-danger" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>

    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </main>
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

const orders = ref([]);
const toast = useToast();
const confirm = useConfirm();

const sortOptions = ref([
  { label: "Plus récentes", value: "!createdAt" },
  { label: "Plus anciennes", value: "createdAt" },
]);
const sortOrder = ref(-1);
const sortField = ref("createdAt");
const sortKey = ref(null);

let loading = ref(false);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await new Api().get("/admin/orders");
    loading.value = false;
    orders.value = response.data.map(o => ({
      ...o,
      createdAt: new Date(o.createdAt)
    }));
  } catch (error) {
    loading.value = false;
    showError("Une erreur est survenue lors de la récupération des commandes");
  }
};

const createOrderInTable = () => {
  router.push({ name: "CreateOrderAdmin" });
};

const validateOrder = (orderId) => {
  router.push({ name: "ValidateOrder", params: { id: orderId } });
};

const confirmDeleteOrder = (order) => {
  confirm.require({
    message: `Êtes-vous sûr de vouloir supprimer la commande ?`,
    header: "Confirmation de suppression",
    icon: "pi pi-exclamation-triangle",
    accept: () => deleteOrder(order.id),
  });
};

const deleteOrder = async (orderId) => {
  try {
    const response = await new Api().delete(`/admin/orders/${orderId}`);
    showSuccess("Commande supprimée avec succès");
    await fetchOrders();
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

const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = value.startsWith("!") ? -1 : 1;

  sortOrder.value = sortValue;
  sortField.value = value.replace("!", "");
};

const formatDate = (date) => {
  return date.toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit"});
}

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders-admin {
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

.order-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  margin-bottom: 1rem;
}

.order-container {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.order-names {
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.order-state {
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 10px;
  background-color: #95acfd;
}

.order-state.completed {
  background-color: #13bd21;
}

.order-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>

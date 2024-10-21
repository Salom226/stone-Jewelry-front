<template>
  <div class="admin-home">
    <h1>Tableau de bord administrateur</h1>
    <div class="admin-menu">
      <Button
        @click="navigateTo('products')"
        label="Gérer les produits"
        class="p-button-primary"
      />
      <Button
        @click="navigateTo('orders')"
        label="Gérer les commandes"
        class="p-button-primary"
      />
      <Button
        @click="navigateTo('users')"
        label="Gérer les utilisateurs"
        class="p-button-primary"
      />
      <Button
        @click="navigateTo('categories')"
        label="Gérer les catégories"
        class="p-button-primary"
      />
    </div>
    <div class="admin-summary">
      <Card class="summary-card">
        <template #title>Produits</template>
        <template #content>
          <p>{{ productCount }} produits en stock</p>
        </template>
      </Card>
      <Card class="summary-card">
        <template #title>Commandes</template>
        <template #content>
          <p>{{ orderCount }} commandes en attente</p>
        </template>
      </Card>
      <Card class="summary-card">
        <template #title>Utilisateurs</template>
        <template #content>
          <p>{{ userCount }} utilisateurs inscrits</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import Card from "primevue/card";
import { useRouter } from "vue-router";

const router = useRouter();

const productCount = ref(0);
const orderCount = ref(0);
const userCount = ref(0);

const navigateTo = (section) => {
  router.push(`/admin/${section}`);
};

const fetchSummaryData = () => {
  productCount.value = 100;
  orderCount.value = 25;
  userCount.value = 500;
};

onMounted(() => {
  fetchSummaryData();
});
</script>

<style scoped>
.admin-home {
  padding: 20px;
}

h1 {
  color: var(--text-color);
  margin-bottom: 20px;
}

.admin-menu {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.admin-summary {
  display: flex;
  gap: 20px;
}

.summary-card {
  flex: 1;
}

:deep(.p-card-title) {
  color: var(--primary-color);
}

@media only screen and (max-width: 768px) {
  .admin-menu {
    flex-wrap: wrap;
  }
  .admin-summary {
    flex-wrap: wrap;
  }
}
</style>

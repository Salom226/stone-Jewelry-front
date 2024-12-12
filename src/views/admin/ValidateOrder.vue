<template>
  <main class="validate-order">
    <div class="validate-order-header">
      <h1>Valider la commande</h1>
    </div>
    <div class="validate-order-content">
      <div class="order-details">
        <h2>Détails de la commande</h2>
        <div class="order-details-item">
          <span class="order-details-label">Nom du client:</span>
          <span class="order-details-value">{{ order.firstName }} {{ order.lastName }}</span>
        </div>
        <div class="order-details-item">
          <span class="order-details-label">Numéro:</span>
          <span class="order-details-value">{{ order.phone }}</span>
        </div>
        <div class="order-details-item">
          <span class="order-details-label">Adresse de livraison:</span>
          <span class="order-details-value">{{ order.address }}</span>
        </div>
        <div class="order-details-item">
          <span class="order-details-label">Date de la commande:</span>
          <span class="order-details-value">{{ order.createdAt }}</span>
        </div>
        <div class="order-details-item">
          <span class="order-details-label">Total:</span>
          <span class="order-details-value">{{ order.totalPrice }}€</span>
        </div>
      </div>
      <div class="order-products">
        <h2>Produits</h2>
        <div class="product-list">
          <div class="order-product" v-for="(product, index) in order.products">
            <div class="order-product-name">{{ product.name }}</div>
            <div class="order-product-price">{{ product.price }}€</div>
            <div class="order-product-quantity">x{{ product.quantity }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="validate-order-button">
      <Button icon="pi pi-check" label="Valider la commande" @click="validateOrder" />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import { Api } from "@/helper/api";

const router = useRouter();
const route = useRoute()
const toast = useToast();

const order = ref({});

const fetchOrder = async () => {
  try {
    const orderId = Number(route.params.id);
    const response = await new Api().get(`/admin/orders/${orderId}`);
    order.value = response.data;
  } catch (error) {
    showError("Une erreur est survenue lors de la récupération des commandes");
    console.error(error);
  }
}

onMounted(() => {
  fetchOrder();
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

const validateOrder = async () => {
  try {
    const response = await new Api().put(`/admin/orders/${order.value.id}/validate`);
    showSuccess("Commande validée avec succès");
    router.push({ name: "OrderAdmin" });
  } catch (error) {
    showError("Une erreur est survenue lors de la validation de la commande");
    console.error(error);
  }
};

</script>

<style scoped lang="scss">
.validate-order {
  width: 100%;
  padding: 30px;

  .validate-order-content {
    display: flex;
    gap: 30px;
    width: 100%;

    justify-content: space-evenly;

    .order-details {
      width: 40%;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .order-details-item {
        display: flex;
        justify-content: space-between;

        .order-details-label {
          font-weight: bold;
        }

        .order-details-value {
          font-style: italic;
        }
      }
    }

    .order-products {
      width: 40%;

      .product-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 400px;
        overflow-y: auto;

        .order-product {
          border-bottom: solid 1px #d0ccccc2;
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
      }
    }
  }

  .validate-order-button {
    margin-top: 50px;
  }
}
</style>
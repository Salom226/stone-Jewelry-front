import { createRouter, createWebHistory } from 'vue-router';
import Products from '../views/Products.vue'; 
import ProductDetail from '../views/ProductDetail.vue'; 
import Cart from '../views/Cart.vue';

const routes = [
  {
    path: '',
    name: 'Products',
    component: Products,
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
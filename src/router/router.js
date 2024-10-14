import { createRouter, createWebHistory } from 'vue-router';
import Products from '../views/Products.vue'; 
import ProductDetail from '../views/ProductDetail.vue'; 
import Register from '../views/Register.vue';
import UserAdmin from '../views/UserAdmin.vue';
import Login from '../views/Login.vue';
import Order from '../views/Order.vue';
import Payment from '../views/Payment.vue';


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
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/admin/users',
    name: 'UserAdmin',
    component: UserAdmin
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart, 
  },
  {
    path: '/order',
    name: 'Order',
    component: Order, 
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
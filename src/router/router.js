import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store/user.store";

import Products from "../views/Products.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import Order from "../views/Order.vue";
import Payment from "../views/Payment.vue";
import Cart from "../views/Cart.vue";
import BijouxCategory from '../views/BijouxCategory.vue'; 


import AdminHome from "../views/admin/AdminHome.vue";

import CreateProductAdmin from "../views/admin/CreateProductAdmin.vue";
import EditProductAdmin from "@/views/admin/EditProductAdmin.vue";
import OrderValidation from "../views/OrderValidation.vue";

const adminRoutes = [
  {
    path: "",
    name: "AdminHome",
    component: AdminHome,
  },
  {
    path: "users",
    name: "UserAdmin",
    component: () => import("../views/admin/UserAdmin.vue"),
  },
  {
    path: "products",
    name: "ProductAdmin",
    component: () => import("../views/admin/ProductAdmin.vue"),
  },
  {
    path: "products/new",
    name: "CreateProductAdmin",
    component: CreateProductAdmin,
  },
  {
    path: "products/edit/:id",
    name: "EditProductAdmin",
    component: EditProductAdmin,
  },
  {
    path: "categories",
    name: "CategoriesAdmin",
    component: () => import("../views/admin/CategoriesAdmin.vue"),
  },
  {
    path: "categories/new",
    name: "CategoryNew",
    component: () => import("../views/CategoryNew.vue"),
  },
  {
    path: "categories/:id/edit",
    name: "CategoryEdit",
    component: () => import("../views/CategoryEdit.vue"),
  },
  {
    path: "orders",
    name: "OrderAdmin",
    component: () => import("../views/admin/OrderAdmin.vue"),
  },
  {
    path: "orders/validate/:id",
    name: "ValidateOrder",
    component: () => import("../views/admin/ValidateOrder.vue"),
  },
];

const routes = [
  {
    path: "",
    name: "Products",
    component: Products,
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/order",
    name: "Order",
    component: Order,
  },
  {
    path: "/orders/validation",
    name: "OrderValidation",
    component: OrderValidation,
  },
  {
    path: "/payment",
    name: "Payment",
    component: Payment,
  },
    {
    path: '/bijoux/:id',
    name: 'BijouxCategory',
    component: BijouxCategory,
    props: true,
  },
  {
    path: "/admin",
    component: () => import("../views/admin/AdminLayout.vue"),
    children: adminRoutes,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.getUser().token;
  const userRole = userStore.getUser()?.roles;

  if (to.meta.requiresAdmin) {
    if (isAuthenticated && userStore.userHasRole("ROLE_ADMIN")) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;

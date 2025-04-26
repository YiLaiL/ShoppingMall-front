import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/search',
    name: 'SearchResults',
    component: () => import('../views/SearchResults.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/goods/detail/:id',
    name: 'GoodsDetail',
    component: () => import('../views/GoodsDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'category',
        name: 'CategoryManagement',
        component: () => import('../views/admin/CategoryManagement.vue')
      },
      {
        path: 'tag',
        name: 'TagManagement',
        component: () => import('../views/admin/TagManagement.vue')
      },
      {
        path: 'location',
        name: 'LocationManagement',
        component: () => import('../views/admin/LocationManagement.vue')
      },
      {
        path: 'permission',
        name: 'PermissionManagement',
        component: () => import('../views/admin/PermissionManagement.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})



export default router
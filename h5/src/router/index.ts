import { createRouter, createWebHistory } from 'vue-router'
import OrderView from '../views/order/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/order/:uid',
      name: 'order',
      component: OrderView,
    },
    {
      path: '/pay/:status',
      name: 'payStatus',
      component: () => import('../views/pay/index.vue'),
    },
  ],
})

export default router

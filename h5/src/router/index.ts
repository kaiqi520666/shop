import { createRouter, createWebHistory } from 'vue-router'
import OrderView from '../views/order/index.vue'
import NotFound from '../views/general/404.vue'
import Payment from '../views/pay/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/order/:uid',
      name: 'order',
      component: OrderView,
    },
    {
      path: '/payment/:status',
      name: 'payStatus',
      component: Payment,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

export default router

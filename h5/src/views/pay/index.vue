<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <div
      :class="[
        'text-white py-8 text-center',
        status === 'success'
          ? 'bg-linear-to-b from-green-500 to-green-400'
          : 'bg-linear-to-b from-red-500 to-red-400',
      ]"
    >
      <div class="text-lg font-medium">Online Payment</div>
    </div>

    <!-- Main -->
    <div class="-mt-6 flex-1 bg-white rounded-t-3xl shadow-lg mx-4 p-6 text-center">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div
          :class="[
            'rounded-full w-16 h-16 flex items-center justify-center text-3xl text-white',
            status === 'success' ? 'bg-green-500' : 'bg-red-500',
          ]"
        >
          <van-icon :name="status === 'success' ? 'passed' : 'close'" size="28" />
        </div>
      </div>

      <!-- Title -->
      <h2
        :class="[
          'text-2xl font-semibold mb-2',
          status === 'success' ? 'text-green-500' : 'text-red-500',
        ]"
      >
        {{ status === 'success' ? 'Payment Successful' : 'Payment Failed' }}
      </h2>

      <!-- Description -->
      <p class="text-gray-500 mb-6">
        {{
          status === 'success'
            ? 'Thank you for your payment. We appreciate your support!'
            : 'Sorry, your payment could not be completed. Please try again.'
        }}
      </p>

      <!-- Transaction Info -->
      <div
        class="border-t border-gray-100 divide-y divide-gray-100 text-left max-w-xs mx-auto text-gray-700"
      >
        <div class="flex justify-between py-3">
          <span>Transaction ID</span>
          <span :class="statusColor">{{ uid }}</span>
        </div>
        <div class="flex justify-between py-3">
          <span>Price</span>
          <span :class="statusColor">{{ order.total }}</span>
        </div>
        <div class="flex justify-between py-3">
          <span>Transaction Time</span>
          <span :class="statusColor">{{ order.createTime }}</span>
        </div>
      </div>

      <!-- Button -->
      <router-link :to="`/order/${uid}`" class="block mt-8">
        <van-button round block :type="status === 'success' ? 'success' : 'danger'">
          {{ status === 'success' ? 'Back to Home' : 'Try Again' }}
        </van-button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Icon as VanIcon, Button as VanButton } from 'vant'
import { getOrderData } from '@/api/shop/order'

// 获取 URL 参数 ?status=success or fail
const route = useRoute()
const status = computed(() => route.params.status || 'fail')
const uid = computed(() => route.params.uid)
const order = ref({
  title: '',
  img: '',
  avatarUrl: '',
  nickName: '',
  price: 0,
  num: 0,
  orderId: '',
  total: '',
  desc: '',
  ip: '',
  createTime: '',
})

onMounted(async () => {
  const { data: orderData } = await getOrderData(route.params.uid)

  order.value.title = orderData.data.title
  order.value.img = orderData.data.img
  order.value.avatarUrl = orderData.data.avatarUrl
  order.value.nickName = orderData.data.nickName
  order.value.price = orderData.data.price
  order.value.num = orderData.data.num
  order.value.orderId = orderData.data.id
  order.value.total = (order.value.price * order.value.num).toFixed(2)
  order.value.desc = orderData.data.desc
  order.value.createTime = orderData.data.createTime
})

// 颜色切换
const statusColor = computed(() => (status.value === 'success' ? 'text-green-500' : 'text-red-500'))
</script>

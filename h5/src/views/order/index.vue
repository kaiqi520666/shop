<template>
  <van-nav-bar title="Product Introduction" />
  <div class="p-2 flex flex-col gap-4">
    <div class="bg-white rounded-md p-3">
      <div class="flex gap-2">
        <img :src="order.avatarUrl" alt="" class="w-20 h-20 rounded-sm object-cover" />
        <div class="flex flex-col gap-2 text-sm">
          <div>{{ order.nickName }}</div>
          <div class="rounded-sm p-2 bg-[#eff6ff] overflow-hidden text-ellipsis">
            <p
              class="break-all"
              style="
                display: -webkit-box;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              "
            >
              I selected a wonderful treasure on Taobao. Please use Alipay to pay for me. Thank you!
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2 flex-col bg-white rounded-b-lg">
      <div class="bg-linear-to-tr from-[#3388ff] to-[#8ec5ff] rounded-t-lg w-full text-white">
        <div class="flex flex-col gap-2 p-2">
          <div class="flex justify-between text-sm">
            <div>Help me pay for the information</div>
            <div>Order waiting for payment</div>
          </div>
          <div>
            <span class="text-lg mr-2">$</span
            ><span class="text-4xl">{{ (order.price * order.num).toFixed(2) }}</span>
          </div>
          <div class="border-b border-white h-1"></div>
          <div class="text-sm">
            The actual amount shall be subject to the payer's confirmation of payment
          </div>
        </div>
      </div>
      <div class="p-3">
        <div class="p-3 bg-[#eff6ff] flex gap-2 items-center" @click="showBottom = true">
          <img :src="order.img" alt="" class="w-12 h-12 rounded-sm object-fill" />
          <div class="line-clamp-2 text-base">
            {{ order.title }}
          </div>
        </div>
      </div>
    </div>
    <van-button type="primary" @click="onPay"
      ><span class="text-lg">Confirm to help him make the payment</span></van-button
    >
    <div class="text-sm flex flex-col gap-2">
      <div>Help me pay for the instructions:</div>
      <div class="text-gray-400">
        1. This product is providing payment services for new friends, and you should use this
        product within the scope permitted by national regulations and policies.
      </div>
      <div class="text-gray-400">
        2. Before making payment, please make sure to confirm the identity of the other party to
        avoid any fraudulent activities.
      </div>
      <div class="text-gray-400">
        3. Selecting 'Long term payment for TA' will redirect you to a page where you can activate a
        family card for the other party. After completing the activation, you still need to return
        to the current page to continue paying for the current order.
      </div>
      <div class="text-red-400">
        4.If a refund occurs in the transaction, the paid amount will be returned to the payer's
        payment account through the original payment method.
      </div>
    </div>
  </div>

  <van-overlay :show="display" class="flex justify-center items-center">
    <van-loading size="80" />
  </van-overlay>
  <van-popup v-model:show="showBottom" position="bottom" round :style="{ height: '80%' }">
    <div class="p-2" v-html="order.desc"></div>
  </van-popup>
</template>
<script setup lang="ts">
import { getOrderData, getIp } from '@/api/shop/order'
import { gereratePayOrder } from '@/api/shop/pay'
import { showDialog } from 'vant'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const display = ref(false)
const showBottom = ref(false)
const orderId = route.params.uid as string
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
})
onMounted(async () => {
  const { data: orderData } = await getOrderData(orderId)
  const ipinfo = await getIp()
  order.value.title = orderData.data.title
  order.value.img = orderData.data.img
  order.value.avatarUrl = orderData.data.avatarUrl
  order.value.nickName = orderData.data.nickName
  order.value.price = orderData.data.price
  order.value.num = orderData.data.num
  order.value.orderId = orderData.data.id
  order.value.total = (order.value.price * order.value.num).toFixed(2)
  order.value.desc = orderData.data.desc
  order.value.ip = ipinfo.data
})
const onPay = async () => {
  display.value = true
  const payInfo = await gereratePayOrder(order.value)
  console.log(payInfo)
  try {
    const payUrl = payInfo.data.data.data.payUrl
    window.location.href = payUrl
  } catch (error) {
    showDialog({
      title: 'tips',
      message: error as string,
    }).then(() => {
      // on close
    })
  } finally {
    display.value = false
  }
}
</script>

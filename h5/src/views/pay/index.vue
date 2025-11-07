<template>
  <van-nav-bar title="在线支付" />
  <div class="flex flex-col min-h-screen bg-gray-50" v-if="status == 'success'">
    <!-- 顶部橙色背景 -->
    <div class="bg-linear-to-b from-green-400 to-green-300 text-white py-8 text-center">
      <div class="text-lg font-medium h-16"></div>
    </div>

    <!-- 主体内容 -->
    <div class="-mt-6 flex-1 bg-white rounded-t-3xl shadow-lg mx-4 p-6 text-center">
      <!-- 图标 -->
      <div class="flex justify-center mb-4">
        <div
          class="bg-[#07c160] text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl"
        >
          ✓
        </div>
      </div>

      <!-- 支付成功文字 -->
      <h2 class="text-2xl font-semibold text-[#07c160] mb-2">支付成功</h2>
      <p class="text-gray-500 mb-6">感谢您对我们的信任与支持，欢迎下次再来！</p>

      <!-- 交易信息 -->
      <div
        class="border-t border-gray-100 divide-y divide-gray-100 text-left max-w-xs mx-auto text-gray-700"
      >
        <div class="flex justify-between py-3">
          <span>交易编号</span>
          <span class="text-[#07c160]">201703216324</span>
        </div>
        <div class="flex justify-between py-3">
          <span>交易方式</span>
          <span class="text-[#07c160]">微信支付</span>
        </div>
        <div class="flex justify-between py-3">
          <span>交易时间</span>
          <span class="text-[#07c160]">2017.03.19</span>
        </div>
      </div>

      <div class="pt-12"><van-button type="success" class="w-60">SUCCESS</van-button></div>
      <!-- 按钮 -->
    </div>
  </div>
  <div class="flex flex-col min-h-screen bg-gray-50" v-else>
    <!-- 顶部红色背景 -->
    <div class="bg-linear-to-b from-red-500 to-red-400 text-white py-8 text-center">
      <div class="text-lg font-medium h-16"></div>
    </div>

    <!-- 主体内容 -->
    <div class="-mt-6 flex-1 bg-white rounded-t-3xl shadow-lg mx-4 p-6 text-center">
      <!-- 图标 -->
      <div class="flex justify-center mb-4">
        <div
          class="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl"
        >
          ✕
        </div>
      </div>

      <!-- 支付失败文字 -->
      <h2 class="text-2xl font-semibold text-red-500 mb-2">支付失败</h2>
      <p class="text-gray-500 mb-6">很抱歉，您的支付未成功，请检查后重新尝试。</p>

      <!-- 交易信息 -->
      <div
        class="border-t border-gray-100 divide-y divide-gray-100 text-left max-w-xs mx-auto text-gray-700"
      >
        <div class="flex justify-between py-3">
          <span>交易编号</span>
          <span class="text-red-500">202511060001</span>
        </div>
        <div class="flex justify-between py-3">
          <span>交易方式</span>
          <span class="text-red-500">微信支付</span>
        </div>
        <div class="flex justify-between py-3">
          <span>交易时间</span>
          <span class="text-red-500">2025.11.06</span>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="pt-12"><van-button type="danger" class="w-60">Confirm</van-button></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const status = route.params.status
</script>

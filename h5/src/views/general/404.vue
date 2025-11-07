<template>
  <div class="flex flex-col min-h-screen bg-gray-50 items-center justify-center text-center px-4">
    <div class="bg-white shadow-lg rounded-3xl px-8 py-12 max-w-sm w-full">
      <div class="text-7xl font-bold text-gray-300 mb-4">404</div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p class="text-gray-500 mb-8">
        Sorry, the page you are looking for does not exist or has been removed.
      </p>

      <router-link to="/" class="block">
        <van-button round block type="primary" color="#f97316"> Back to Home </van-button>
      </router-link>
    </div>

    <p class="text-gray-400 text-sm mt-6">© 2025 Your Company. All rights reserved.</p>
  </div>
</template>

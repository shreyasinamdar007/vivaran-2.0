<script setup lang="ts">
import AppLoader from "./components/app-loader.vue";
import ToastMessage from "./components/toast-message.vue";
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <AppLoader />
  <ToastMessage />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

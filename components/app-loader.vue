<script setup lang="ts">
import { useLoaderStore } from "@/stores/loader/loader";

const loader = useLoaderStore();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="loader.isLoading"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
    >
      <div class="bg-base-100 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <span class="loading loading-infinity loading-xl text-teal-500" />
        <p class="text-sm font-medium">
          {{ loader.message }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { useToastStore } from "@/stores/toast/toast";

const toastStore = useToastStore();

const typeConfig = {
  success: {
    title: "Success",
    icon: "ep:success-filled",
    accent: "#2ab51a",
    bg: "bg-gray-700 text-white",
  },
  error: {
    title: "Error",
    icon: "ep:circle-close-filled",
    accent: "#e11d48",
    bg: "bg-gray-700 text-white",
  },
  warning: {
    title: "Warning",
    icon: "ep:warning-filled",
    accent: "#f59e0b",
    bg: "bg-gray-700 text-white",
  },
  info: {
    title: "Info",
    icon: "ep:info-filled",
    accent: "#0ea5e9",
    bg: "bg-gray-700 text-white",
  },
};
</script>

<template>
  <div class="fixed top-5 right-5 z-[9999] space-y-4">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="w-80 rounded-2xl flex shadow-2xl overflow-hidden relative"
      >
        <!-- Left Accent Bar -->
        <div class="w-2" :style="{ backgroundColor: typeConfig[toast.type].accent }" />

        <!-- Main Content -->
        <div class="w-full flex items-center px-4 py-4 pr-8 bg-white" :class="typeConfig[toast.type].bg">
          <!-- Icon + Text -->
          <div class="flex items-center gap-3">
            <Icon :name="typeConfig[toast.type].icon" size="30" :style="{ color: typeConfig[toast.type].accent }" />

            <div class="flex flex-col">
              <span class="font-bold text-lg text-black">
                {{ typeConfig[toast.type].title }}
              </span>
              <span class="text-sm opacity-90 text-black">
                {{ toast.message }}
              </span>
            </div>
          </div>
        </div>

        <!-- Close Button (Top Right) -->
        <button
          class="absolute top-2 right-2 text-xs font-bold p-1 text-black opacity-60 cursor-pointer hover:opacity-100 transition"
          @click="toastStore.remove(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>

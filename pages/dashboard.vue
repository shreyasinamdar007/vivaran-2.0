<script setup lang="ts">
import { useAuthStore } from "~/stores/auth/auth";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const auth = useAuthStore();

async function logout() {
  await auth.logout();
  await navigateTo("/login");
}
</script>

<template>
  <div class="mx-auto p-4 sm:p-6 max-w-7xl">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="font-heading text-3xl font-bold">
          Dashboard
        </h1>
        <p class="text-base-content/70 mt-1">
          Welcome back to the dashboard.
        </p>
      </div>
      <button class="btn btn-secondary btn-sm" @click="logout">
        <Icon name="solar:logout-linear" size="20" class="mr-1" />
        Logout
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ClientOnly>
        <MrChart class="w-full lg:col-span-2" />
        <template #fallback>
          <div
            class="w-full lg:col-span-2 h-80 flex items-center justify-center bg-base-100 border border-base-200 rounded-box"
          >
            <span class="loading loading-spinner text-primary" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

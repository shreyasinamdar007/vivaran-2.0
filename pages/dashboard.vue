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
  <div class="mx-auto p-2">
    <h1 class="text-3xl font-bold mb-4">
      Welcome to the Home Page
    </h1>
    <p class="text-lg">
      Welcome
    </p>
    <button class="btn btn-secondary" @click="logout">
      <Icon name="solar:logout-linear" size="24" class="mr-2" />
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import DashboardNavbar from "~/components/dashboard-navbar.vue";
import AppNavBar from "~/components/nav-bar.vue";
import { useAuthStore } from "~/stores/auth/auth";

const { fetchUser } = useAuth();
const auth = useAuthStore();

await fetchUser();
const route = useRoute();
</script>

<template>
  <div>
    <AppNavBar v-if="route.path === '/'" />
    <DashboardNavbar v-if="auth.isAuthenticated" />
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppNavBar from "~/components/nav-bar.vue";

const route = useRoute();
</script>

<template>
  <div>
    <AppNavBar v-if="!route.meta.hideNavbar" />
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

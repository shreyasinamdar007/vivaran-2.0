<script setup lang="ts">
import AppNavBar from "~/components/app/nav-bar.vue";
</script>

<template>
  <div>
    <AppNavBar />
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

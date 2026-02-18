<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="bg-base-200 rounded-2xl p-6 shadow-sm space-y-6">
    <!-- Section Title -->
    <h2 class="text-lg font-semibold border-b border-base-300 pb-2">
      {{ title }}
    </h2>

    <!-- Content Slot -->
    <div class="space-y-2">
      <slot />
    </div>
  </div>
</template>

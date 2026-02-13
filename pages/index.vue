<script setup lang="ts">
</script>

<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content">
      <div class="max-w-md flex flex-col items-center text-center gap-y-4">
        <div class="w-xl h-8 flex items-center">
          <img src="/assets/vv.svg" alt="Logo" class="rounded-full ml-20">
        </div>
        <p class="py-6">
          Simplified billing and GST compliance in one seamless flow. Accurate invoices, real-time tax
          calculations, and effortless reporting.
        </p>
        <button class="btn btn-accent text-white" @click="() => navigateTo('/login')">
          Sign In
          <Icon name="solar:login-2-linear" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>

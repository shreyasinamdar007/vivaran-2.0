<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const routes = [
  { name: "Dashboard", path: "/dashboard", icon: "ep:monitor" },
  { name: "Add Company", path: "/add-company", icon: "ep:office-building" },
  { name: "Sales Register", path: "/sales-purchase", icon: "ep:document" },
  { name: "Manage Companies", path: "/manage-companies", icon: "ep:setting" },
];
</script>

<template>
  <div class="flex min-h-screen bg-[#0f172a] text-gray-200">
    <aside class="w-72 bg-[#111827] border-r border-gray-800 shadow-2xl flex flex-col">
      <div class="p-6 border-b border-gray-800">
        <img src="/assets/vv-cropped.svg" alt="Logo" class="h-10 transition-transform duration-300 hover:scale-105">
      </div>

      <ul class="flex-1 p-4 space-y-2">
        <li v-for="r in routes" :key="r.path">
          <NuxtLink
            :to="r.path"
            class="group relative flex items-center gap-3 px-4 py-3 rounded-xl text-medium font-semibold transition-all duration-300"
            :class="route.path === r.path
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            "
          >
            <Icon :name="r.icon" size="20" class="transition-transform duration-300 group-hover:scale-110" />
            {{ r.name }}

            <span v-if="route.path === r.path" class="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 rounded-r-full" />
          </NuxtLink>
        </li>
      </ul>

      <div class="p-4 border-t border-gray-800 text-sm text-gray-500">
        © 2026 Vivaran
      </div>
    </aside>

    <div class="flex-1 flex flex-col">
      <div
        class="h-12 min-h-12 max-h-12 shrink-0
         flex items-center justify-between px-8
         bg-[#111827] border-b border-gray-800 shadow-lg"
      >
        <h1 class="text-lg font-bold tracking-wide text-white whitespace-nowrap">
          {{ routes.find(r => r.path === route.path)?.name }}
        </h1>

        <div class="flex items-center gap-6">
          <Icon name="ep:bell" size="18" class="cursor-pointer text-gray-400 hover:text-teal-400 transition" />

          <div
            class="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center
             font-semibold text-white shadow-md"
          >
            S
          </div>
        </div>
      </div>

      <main class="flex-1 p-6 overflow-y-auto bg-[#0f172a]">
        <div class="bg-[#111827] rounded-2xl p-4 border border-gray-800">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

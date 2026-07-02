<script setup lang="ts">
import { computed, ref, watch } from "vue";

export type Column = {
  key: string;
  label: string;
  width?: string;
};

const props = withDefaults(defineProps<{
  columns: Column[];
  data: any[];
  searchable?: boolean;
  searchKeys?: string[];
  actions?: boolean;
  pageSize?: number;
}>(), {
  searchable: false,
  searchKeys: () => [],
  actions: false,
  pageSize: 10,
});

const searchQuery = ref("");
const currentPage = ref(1);

// Reset to page 1 when search changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Reset to page 1 when data changes
watch(() => props.data, () => {
  currentPage.value = 1;
});

// Filter data based on search query and searchKeys
const filteredData = computed(() => {
  if (!props.searchable || !searchQuery.value.trim() || props.searchKeys.length === 0) {
    return props.data || [];
  }

  const query = searchQuery.value.toLowerCase().trim();

  return (props.data || []).filter((row) => {
    return props.searchKeys.some((key) => {
      // Helper to safely access nested properties like 'address.city'
      const val = getNestedValue(row, key);
      if (val === null || val === undefined)
        return false;
      return String(val).toLowerCase().includes(query);
    });
  });
});

// Pagination calculations
const totalPages = computed(() => Math.ceil(filteredData.value.length / props.pageSize) || 1);
const startIndex = computed(() => (currentPage.value - 1) * props.pageSize);
const endIndex = computed(() => startIndex.value + props.pageSize);

const paginatedData = computed(() => {
  return filteredData.value.slice(startIndex.value, endIndex.value);
});

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

// Basic dot notation support
function getNestedValue(obj: any, path: string) {
  if (!path.includes("."))
    return obj[path];
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function formatCell(row: any, key: string) {
  const val = getNestedValue(row, key);
  return (val !== null && val !== undefined && val !== "") ? val : "-";
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Header: Search -->
    <div v-if="searchable" class="flex justify-between items-center">
      <div class="relative w-full max-w-sm">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full p-2.5 pl-10 text-sm rounded-lg bg-[#1f2937] border-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Search..."
        >
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto rounded-lg border border-gray-800 bg-[#111827]">
      <table class="table w-full text-left text-sm text-gray-400">
        <thead class="text-xs uppercase bg-[#1f2937] text-gray-400 border-b border-gray-800">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="px-6 py-4 font-medium"
              :style="{ width: col.width }"
            >
              {{ col.label }}
            </th>
            <th v-if="actions" scope="col" class="px-6 py-4 font-medium text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="actions ? columns.length + 1 : columns.length" class="px-6 py-8 text-center text-gray-500">
              No data found.
            </td>
          </tr>
          <tr
            v-for="(row, index) in paginatedData"
            :key="index"
            class="border-b border-gray-800 hover:bg-[#1f2937]/50 transition-colors"
          >
            <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap">
              <slot :name="`cell-${col.key}`" :row="row">
                <!-- Fallback to default rendering if slot not provided -->
                {{ formatCell(row, col.key) }}
              </slot>
            </td>
            <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-2 px-2">
      <span class="text-sm text-gray-400">
        Showing <span class="font-semibold text-white">{{ startIndex + 1 }}</span> to
        <span class="font-semibold text-white">{{ Math.min(endIndex, filteredData.length) }}</span> of
        <span class="font-semibold text-white">{{ filteredData.length }}</span> entries
      </span>
      <div class="flex gap-2">
        <button
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm rounded-md bg-[#1f2937] text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="prevPage"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm rounded-md bg-[#1f2937] text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

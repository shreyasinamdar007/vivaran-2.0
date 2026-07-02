<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ErrorMessage, Field } from "vee-validate";
import { onUnmounted, ref, watch } from "vue";

type Option<T = unknown> = {
  label: string;
  value: string | number;
  raw?: T; // 👈 full object
};

const props = defineProps<{
  name: string;
  label: string;
  fetchOptions: (query: string) => Promise<Option[]>;
  disabled?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "select", option: Option): void;
}>();
const query = ref("");
const options = ref<Option[]>([]);
const isOpen = ref(false);
const isLoading = ref(false);

function clear() {
  query.value = "";
  isOpen.value = false;
}

defineExpose({
  clear,
});

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(query, (val) => {
  if (!val) {
    options.value = [];
    return;
  }

  if (debounceTimer)
    clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    isLoading.value = true;
    try {
      options.value = await props.fetchOptions(val);
    }
    finally {
      isLoading.value = false;
    }
  }, 300);
});

onUnmounted(() => {
  if (debounceTimer)
    clearTimeout(debounceTimer);
});

function selectOption(
  option: Option,
  setValue: (value: Option["value"]) => void,
) {
  query.value = option.label;
  setValue(option.value);
  emit("select", option);
  isOpen.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-1 w-full relative">
    <label class="text-sm font-medium text-white">
      {{ label }}
    </label>

    <Field v-slot="{ meta, setValue }" :name="name">
      <div class="relative">
        <input
          v-model="query"
          type="text"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full h-12 px-4 rounded-xl bg-transparent text-white outline-none border transition-all duration-200"
          :class="[
            disabled
              ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10'
              : meta.touched && meta.invalid
                ? 'border-red-500'
                : 'border-white/20',
          ]"
          @focus="isOpen = true"
          @blur="setTimeout(() => (isOpen = false), 150)"
        >

        <!-- Right icon -->
        <Icon v-if="!isLoading" icon="tabler:search" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
        <Icon
          v-else
          icon="tabler:loader-2"
          class="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-white/50"
        />

        <!-- Dropdown -->
        <ul
          v-if="isOpen && options.length"
          class="absolute z-50 w-full
                    max-h-60 overflow-y-auto
                    rounded-b-xl
                    border border-white/10
                    bg-[#2a2a2a]
                    shadow-xl"
        >
          <li
            v-for="option in options"
            :key="option.value"
            class="px-4 py-3 text-white
                   hover:bg-white/10 transition-colors duration-200
                   flex justify-between items-center cursor-pointer"
            @mousedown.prevent="selectOption(option, setValue)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </Field>

    <ErrorMessage v-slot="{ message }" :name="name">
      <div class="flex items-center gap-1.5 text-xs text-red-400 mt-1">
        <Icon icon="tabler:alert-circle" />
        <span>{{ message }}</span>
      </div>
    </ErrorMessage>
  </div>
</template>

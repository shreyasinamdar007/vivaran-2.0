<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";
import { ref } from "vue";

type Option = {
  label: string;
  value: string;
};

defineProps<{
  name: string;
  label: string;
  options: Option[];
}>();

const isOpen = ref(false);
</script>

<template>
  <div class="w-full flex flex-col gap-1 relative">
    <!-- Label -->
    <label class="text-sm font-medium text-white">
      {{ label }}
    </label>

    <Field v-slot="{ field, meta }" :name="name">
      <div class="relative">
        <!-- Select Button -->
        <div
          class="h-12 px-4 rounded-xl flex items-center justify-between
                 border transition-all duration-200 cursor-pointer
                 bg-transparent"
          :class="[
            meta.touched && meta.invalid
              ? 'border-red-500'
              : meta.touched && meta.valid
                ? 'border-green-500'
                : 'border-white',
          ]"
          tabindex="0"
          @click="isOpen = !isOpen"
          @blur="field.onBlur"
        >
          <span :class="field.value ? 'text-white' : 'text-gray-400'">
            {{
              options.find(o => o.value === field.value)?.label
                || `Select ${label}`
            }}
          </span>

          <Icon
            name="mdi:chevron-down"
            size="20"
            class="transition-transform duration-300"
            :class="isOpen && 'rotate-180'"
          />
        </div>

        <!-- Dropdown -->
        <div
          v-if="isOpen"
          class="absolute left-0 top-full w-full
                 rounded-b-xl bg-[#2a2a2a]
                 border border-white/10
                 shadow-2xl shadow-black/50
                 z-50 overflow-hidden"
        >
          <div
            v-for="option in options"
            :key="option.value"
            class="px-4 py-3 text-white
                   hover:bg-white/10 transition-colors duration-200
                   flex justify-between items-center cursor-pointer"
            @click="() => {
              field.onChange(option.value); // ✅ THIS FIXES IT
              isOpen = false;
            }"
          >
            {{ option.label }}

            <Icon
              v-if="option.value === field.value"
              name="mdi:check"
              size="18"
              class="text-green-400"
            />
          </div>
        </div>
      </div>
    </Field>

    <!-- Error -->
    <ErrorMessage v-slot="{ message }" :name="name">
      <div class="flex items-center gap-1 text-sm text-red-400">
        <Icon name="ic:sharp-error" size="16" />
        <span>{{ message }}</span>
      </div>
    </ErrorMessage>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ErrorMessage, Field } from "vee-validate";

defineProps<{
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="text-sm font-medium text-white">{{ label }}</label>
    <Field v-slot="{ field, meta }" :name="name">
      <input
        v-bind="field"
        :type="type || 'text'"
        :disabled="disabled"
        class="w-full h-12 px-4 rounded-xl bg-transparent text-white outline-none border transition-all duration-200"
        :class="[
          disabled ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10'
          : meta.touched && meta.invalid ? 'border-red-500' : 'border-white/20',
        ]"
      >
    </Field>
    <ErrorMessage v-slot="{ message }" :name="name">
      <div class="flex items-center gap-1.5 text-xs text-red-400 mt-1">
        <Icon icon="tabler:alert-circle" />
        <span>{{ message }}</span>
      </div>
    </ErrorMessage>
  </div>
</template>

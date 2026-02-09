<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";

defineProps<{
  label: string;
  type: string;
  name: string;
  errorMessage: string;
  error: boolean;
  modelValue?: string;
  pattern?: string;
  minlength?: number;
  maxlength?: number;
  icon: string;
  rules?: string;
}>();
</script>

<template>
  <label class="input validator">
    <div class="flex items-center gap-x-2">
      <Icon :name="icon" size="24" class="relative" />
      <Field v-slot="{ field }" :name="name" :rules="rules">
        <input
          v-bind="field" :type="type" :placeholder="label" :pattern="pattern" :minlength="minlength"
          :maxlength="maxlength" :class="{ 'border-error': error }"
        >
      </Field>
    </div>
  </label>
  <div class="flex text-left !items-start">
    <ErrorMessage v-slot="{ message }" :name="name">
      <Icon name="ic:sharp-error" size="20" class="text-error mr-1" />
      <p class="w-full text-sm text-error text-left self-start !items-start">
        {{ message }}
      </p>
    </ErrorMessage>
  </div>
</template>

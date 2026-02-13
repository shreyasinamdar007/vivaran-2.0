<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";

defineProps<{
  label: string;
  type: string;
  name: string;
  modelValue?: string;
  pattern?: string;
  minlength?: number;
  maxlength?: number;
  icon: string;
  rules?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <label class="input validator input-bordered w-full flex items-center gap-2">
    <Icon :name="icon" size="24" />

    <Field v-slot="{ field }" :name="name" :rules="rules">
      <input
        v-bind="field" class="grow" :type="type" :placeholder="label" :pattern="pattern" :minlength="minlength"
        :maxlength="maxlength" :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </Field>
  </label>

  <div class="flex text-left">
    <ErrorMessage v-slot="{ message }" :name="name">
      <Icon name="ic:sharp-error" size="20" class="text-error mr-1" />
      <p class="text-sm text-error">
        {{ message }}
      </p>
    </ErrorMessage>
  </div>
</template>

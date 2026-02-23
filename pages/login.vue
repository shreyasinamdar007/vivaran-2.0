<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";

import InputField from "~/components/input-field.vue";
import { loginSchema } from "~/schemas/login.schema";
import { useAuthStore } from "~/stores/auth/auth";
import { useLoaderStore } from "~/stores/loader/loader";
import { useToastStore } from "~/stores/toast/toast";

const auth = useAuthStore();
const loader = useLoaderStore();
const toast = useToastStore();

const email = ref("");
const password = ref("");

const validateSchema = toTypedSchema(loginSchema);

async function onSubmit() {
  loader.show("Logging in...");
  try {
    await auth.login(email.value, password.value);
    await navigateTo("/dashboard");
  }
  catch (error: unknown) {
    let message = "Something went wrong. Please try again.";

    if (typeof error === "object" && error !== null) {
      const err = error as any;

      if (err?.data?.message) {
        message = err.data.message;
      }
      else if (err?.message) {
        message = err.message;
      }
    }
    toast.show(message, "error");
  }
  finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="flex">
    <div class="w-1/2 h-screen flex items-center justify-center p-4">
      <div class="card w-3/4 p-6 bg-gray-700 flex items-center">
        <div class="w-3/4 flex justify-center px-8 py-6">
          <img src="/assets/vv-cropped.svg" alt="Logo" class="rounded-full ml-6 xl:ml-12">
        </div>
        <Form class="w-3/4 flex flex-col items-center gap-y-3" :validation-schema="validateSchema" @submit="onSubmit">
          <InputField
            v-model="email"
            icon="ic:sharp-email"
            label="Email"
            type="email"
            name="email"
            error-message="Please enter a valid email address."
            :minlength="1"
            :error="true"
            :rules="loginSchema.email"
          />
          <InputField
            v-model="password"
            icon="ic:sharp-lock"
            label="Password"
            type="password"
            name="password"
            error-message="Password must be at least 8 characters long."
            :error="true"
            :rules="loginSchema.password"
            :minlength="8"
          />
          <button type="submit" class="btn btn-primary w-3/4 mt-4">
            Sign In
            <Icon name="solar:login-2-linear" size="24" class="ml-2" />
          </button>
        </Form>
      </div>
    </div>
    <div class="w-1/2">
      <img src="/assets/login-bg.jpg" alt="Login Background" class="w-full h-screen object-cover">
    </div>
  </div>
</template>

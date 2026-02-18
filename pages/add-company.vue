<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";

import BaseFormSection from "~/components/form/base-form-section.vue";
import BaseInput from "~/components/form/base-input.vue";
import BaseSelect from "~/components/form/base-select.vue";
import { companySchema } from "~/schemas/company.schema";
import { useLoaderStore } from "~/stores/loader/loader";
import { useToastStore } from "~/stores/toast/toast";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const toast = useToastStore();
const loader = useLoaderStore();

const validateSchema = toTypedSchema(companySchema);

async function submitForm(values: any, { resetForm }: any) {
  loader.show("Adding Company...");

  try {
    const response: any = await $fetch("/api/company", {
      method: "POST",
      body: values, // ✅ use validated values
    });

    toast.show(response.message, "success");

    resetForm(); // ✅ proper reset
  }
  catch (error: any) {
    toast.show(error.message || "Something went wrong", "error");
  }
  finally {
    loader.hide();
  }
}
</script>

<template>
  <Form class="space-y-6" :validation-schema="validateSchema" @submit="submitForm">
    <!-- Company Details -->
    <BaseFormSection title="Company Details">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput name="name" label="Company Name" />

        <BaseSelect
          name="company_type" label="Company Type" :options="[
            { label: 'Sales', value: 'sales' },
            { label: 'Purchase', value: 'purchase' },
          ]"
        />
      </div>

      <BaseInput name="gst_no" label="GST Number" />

      <BaseInput name="name_of_owner" label="Owner Name" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput name="mobile_no_1" label="Mobile Number 1" />
        <BaseInput name="mobile_no_2" label="Mobile Number 2" />
      </div>
    </BaseFormSection>

    <!-- Address Section -->
    <BaseFormSection title="Address">
      <BaseInput name="address.address_line_1" label="Address Line 1" />

      <BaseInput name="address.address_line_2" label="Address Line 2" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput name="address.city" label="City" />
        <BaseInput name="address.state" label="State" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput name="address.country" label="Country" />
        <BaseInput name="address.zipcode" label="Zip Code" type="number" />
      </div>
    </BaseFormSection>

    <!-- Submit -->
    <button
      type="submit" class="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded-xl
             font-medium transition shadow-lg shadow-blue-500/20"
    >
      Add Company
    </button>
  </Form>
</template>
